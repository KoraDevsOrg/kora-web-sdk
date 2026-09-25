/**
 * KoraSyncEngine - Motor universal de sincronización Local-First
 * Ecosistema KoraDevs
 */
class KoraSyncEngine {
  constructor(config) {
    this.config = {
      pkgName: config.pkgName,
      appName: config.appName,
      tableName: config.tableName,
      tableDdl: config.tableDdl,
      currentHtmlVersion: config.currentHtmlVersion || "1.0.0",
      insertHandler: config.insertHandler
    };
    this.hasBridge = typeof window.KoraDB !== "undefined";
    this.storageVerKey = `kora_ver_${config.pkgName}`;
  }

  // 1. Inicializa tabla en SQLite de Kora Admin DB
  initDb() {
    if (!this.hasBridge) return false;
    try {
      const resRaw = window.KoraDB.registerModule(
        this.config.pkgName,
        this.config.appName,
        1,
        this.config.tableDdl
      );
      return JSON.parse(resRaw).status === "SUCCESS";
    } catch (e) {
      console.warn("[KoraSync] Error al registrar módulo:", e);
      return false;
    }
  }

  // 2. Consulta el conteo de filas en SQLite
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

  // 3. Orquestador de sincronización resiliente
  async sync(incomingData = [], options = {}) {
    const onStatus = options.onStatus || (() => {});
    const onPrompt = options.onPrompt || ((msg) => window.confirm(msg));

    if (!this.hasBridge) {
      onStatus("Operando en navegador web (modo demostración).");
      return { status: "NO_BRIDGE", data: incomingData };
    }

    this.initDb();
    const localCount = this.getLocalCount();
    const incomingCount = incomingData.length;

    // Escenario A: Modo Offline
    if (!navigator.onLine) {
      onStatus("Modo sin conexión: Operando 100% con SQLite local.");
      return { status: "OFFLINE", count: localCount };
    }

    // Escenario B: BD vacía (Primera carga) -> Inicialización automática
    if (localCount === 0 && incomingCount > 0) {
      onStatus("Inicializando base de datos local...");
      this._persistBatch(incomingData);
      localStorage.setItem(this.storageVerKey, this.config.currentHtmlVersion);
      onStatus(`Base de datos lista con ${incomingCount} registros.`);
      return { status: "INITIAL_SYNC_COMPLETE", count: incomingCount };
    }

    // Escenario C: Hay más registros o cambio de versión
    const hasMoreRecords = incomingCount > localCount;
    const lastSavedVer = localStorage.getItem(this.storageVerKey);
    const hasNewVersion = lastSavedVer && lastSavedVer !== this.config.currentHtmlVersion;

    if (hasMoreRecords || hasNewVersion) {
      const diff = incomingCount - localCount;
      const mensaje = diff > 0
        ? `Su base de datos está desactualizada.\nSe encontraron ${diff} palabras nuevas en la versión actual.\n\n¿Desea sincronizar ahora?`
        : `Nueva versión (${this.config.currentHtmlVersion}) disponible.\n\n¿Desea actualizar su base de datos ahora?`;

      const userAccepted = await onPrompt(mensaje);

      if (userAccepted) {
        onStatus("Actualizando registros en SQLite...");
        this._persistBatch(incomingData);
        localStorage.setItem(this.storageVerKey, this.config.currentHtmlVersion);
        onStatus("Base de datos actualizada con éxito.");
        return { status: "UPDATED", count: incomingCount };
      } else {
        onStatus("Actualización pospuesta por el usuario.");
        return { status: "SKIPPED", count: localCount };
      }
    }

    onStatus("Base de datos al día.");
    return { status: "UP_TO_DATE", count: localCount };
  }

  // 4. Inserción por lotes
  _persistBatch(items) {
    if (!this.config.insertHandler || !this.hasBridge) return;
    items.forEach((item) => {
      this.config.insertHandler(window.KoraDB, item);
    });
  }

  // 5. Consulta directa para obtener palabras desde SQLite
  getAll() {
    if (!this.hasBridge) return [];
    try {
      return JSON.parse(window.KoraDB.query(`SELECT * FROM ${this.config.tableName};`));
    } catch (e) {
      console.error("[KoraSync] Error al leer tabla:", e);
      return [];
    }
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = KoraSyncEngine;
} else {
  window.KoraSyncEngine = KoraSyncEngine;
}
