/**
 * KoraSyncEngine - Motor reutilizable de sincronización y persistencia
 * para micro-apps web conectadas a Kora Admin DB.
 */
class KoraSyncEngine {
  /**
   * @param {Object} config
   * @param {string} config.pkgName - Identificador del paquete (ej: 'org.koradevs.quiz.japon')
   * @param {string} config.appName - Nombre legible de la app
   * @param {string} config.tableDdl - Sentencia CREATE TABLE para SQLite
   * @param {string} config.tableName - Nombre de la tabla a auditar
   * @param {string} config.remoteUrl - URL del JSON en GitHub (raw)
   * @param {string} config.htmlVersion - Versión actual del frontend web
   * @param {Function} config.insertHandler - Función (db, item) para insertar registros
   */
  constructor(config) {
    this.config = config;
    this.hasBridge = typeof window.KoraDB !== "undefined";
    this.storageKey = `kora_ver_${config.pkgName}`;
  }

  // 1. Inicialización de tabla en SQLite de Kora Admin DB
  async initDb() {
    if (!this.hasBridge) {
      console.warn("[KoraSync] Modo standalone: window.KoraDB no detectado.");
      return false;
    }

    try {
      const resRaw = window.KoraDB.registerModule(
        this.config.pkgName,
        this.config.appName,
        1,
        this.config.tableDdl
      );
      const res = JSON.parse(resRaw);
      return res.status === "SUCCESS";
    } catch (e) {
      console.error("[KoraSync] Error al registrar módulo:", e);
      return false;
    }
  }

  // 2. Conteo de registros locales
  getLocalCount() {
    if (!this.hasBridge) return 0;
    try {
      const res = JSON.parse(
        window.KoraDB.query(`SELECT COUNT(*) AS total FROM ${this.config.tableName};`)
      );
      return res.length > 0 ? Number(res[0].total) : 0;
    } catch (e) {
      return 0;
    }
  }

  // 3. Flujo principal de verificación y sincronización resiliente
  async sync(callbacks = {}) {
    const onStatus = callbacks.onStatus || (() => {});
    const onPrompt = callbacks.onPrompt || ((msg) => window.confirm(msg));

    if (!this.hasBridge) {
      onStatus("Modo navegador web (sin persistencia Kora Admin).");
      return { status: "NO_BRIDGE" };
    }

    await this.initDb();
    const localCount = this.getLocalCount();

    // Comportamiento Offline: Cero errores en pantalla, continuar con datos locales
    if (!navigator.onLine) {
      onStatus("Modo Offline: Operando con la base de datos local.");
      return { status: "OFFLINE", localCount };
    }

    try {
      // Consulta silenciosa a GitHub evitando caché de red
      const response = await fetch(this.config.remoteUrl, { cache: "no-cache" });
      if (!response.ok) {
        onStatus("No se pudo contactar con Git. Usando datos locales.");
        return { status: "NETWORK_ERROR", localCount };
      }

      const remoteData = await response.json();
      const remoteItems = remoteData.items || remoteData.words || [];
      const remoteCount = remoteItems.length;
      const remoteHtmlVer = remoteData.htmlVersion || "1.0.0";
      const localHtmlVer = localStorage.getItem(this.storageKey) || this.config.htmlVersion;

      const hasMoreData = remoteCount > localCount;
      const hasNewHtml = remoteHtmlVer !== localHtmlVer;

      // Escenario A: Base de datos vacía (Primera carga) -> Sincronización automática
      if (localCount === 0 && remoteCount > 0) {
        onStatus("Descargando e inicializando base de datos local...");
        this._persistBatch(remoteItems);
        localStorage.setItem(this.storageKey, remoteHtmlVer);
        onStatus("Base de datos inicializada.");
        return { status: "INITIAL_SYNC_COMPLETE", count: remoteCount };
      }

      // Escenario B: Cambios detectados -> Solicitar autorización al usuario
      if (hasMoreData || hasNewHtml) {
        let mensaje = "Su base de datos está desactualizada. ¿Desea actualizar ahora?";
        if (hasMoreData) {
          mensaje = `Se encontraron ${remoteCount - localCount} nuevos registros en Git.\n${mensaje}`;
        }

        const userAccepted = await onPrompt(mensaje);

        if (userAccepted) {
          if (hasMoreData) {
            onStatus("Sincronizando nuevos registros...");
            this._persistBatch(remoteItems);
          }
          if (hasNewHtml) {
            localStorage.setItem(this.storageKey, remoteHtmlVer);
            onStatus("Recargando interfaz con nueva versión...");
            window.location.reload();
            return { status: "RELOADED" };
          }
          onStatus("Sincronización finalizada con éxito.");
          return { status: "UPDATED", count: remoteCount };
        } else {
          onStatus("Actualización pospuesta por el usuario.");
          return { status: "SKIPPED", localCount };
        }
      }

      onStatus("Base de datos sincronizada.");
      return { status: "UP_TO_DATE", localCount };
    } catch (err) {
      // Captura silenciosa ante fallos de conexión o parseo
      console.warn("[KoraSync] Sincronización omitida:", err.message);
      onStatus("Operando con base de datos local.");
      return { status: "FALLBACK_LOCAL", localCount };
    }
  }

  // 4. Inserción por lotes delegando en el handler configurado
  _persistBatch(items) {
    if (!this.config.insertHandler) return;
    items.forEach((item) => {
      this.config.insertHandler(window.KoraDB, item);
    });
  }

  // 5. Utilidad para ejecutar consultas directas desde la app
  query(sql, args = []) {
    if (!this.hasBridge) return [];
    try {
      const res = window.KoraDB.query(sql, JSON.stringify(args));
      return JSON.parse(res);
    } catch (e) {
      console.error("[KoraSync] Error en query:", e);
      return [];
    }
  }
}

// Exportación modular o global para navegador
if (typeof module !== "undefined" && module.exports) {
  module.exports = KoraSyncEngine;
} else {
  window.KoraSyncEngine = KoraSyncEngine;
}
