/**
 * Kora Web SDK - Menú Global Unificado de Negocios (ERP Suite)
 * Repositorio: KoraDevsOrg/kora-web-sdk
 * Licencia MIT - 100% Offline / Local-First
 */

export const BIZ_MODULES = [
  { id: "inventario", name: "Inventario & Materiales", icon: "📦", url: "https://koradevsorg.github.io/kora-inventario/" },
  { id: "fabricacion", name: "Fabricación & Rutas", icon: "⚙️", url: "https://koradevsorg.github.io/kora-fabricacion/" },
  { id: "rrhh", name: "Gestión Humana & Turnos", icon: "👥", url: "https://koradevsorg.github.io/kora-rrhh/" },
  { id: "costos", name: "Costos & Escandallos", icon: "📐", url: "https://koradevsorg.github.io/calculadora-costos/" },
  { id: "ventas", name: "Punto de Venta (POS)", icon: "🏷️", url: "https://koradevsorg.github.io/kora-ventas/" },
  { id: "clientes", name: "Clientes & Cartera", icon: "🤝", url: "https://koradevsorg.github.io/kora-clientes/" }
];

export class KoraBizNav {
  /**
   * Inicializa e inyecta el drawer y sus estilos en cualquier micro-app
   * @param {string} currentAppId - Identificador del módulo actual ('fabricacion', 'inventario', etc.)
   */
  static init(currentAppId) {
    this.injectStyles();
    this.injectDrawer(currentAppId);
    this.bindEvents();
  }

  static injectStyles() {
    if (document.getElementById("kora-biz-nav-styles")) return;
    const style = document.createElement("style");
    style.id = "kora-biz-nav-styles";
    style.textContent = `
      .kora-drawer-backdrop {
        position: fixed; inset: 0; background: rgba(0,0,0,0.65);
        backdrop-filter: blur(2px); z-index: 998; display: none;
      }
      .kora-drawer-backdrop.active { display: block; }
      .kora-side-drawer {
        position: fixed; top: 0; bottom: 0; left: 0; width: 280px;
        background: #0f172a; border-right: 1px solid #334155;
        z-index: 999; transform: translateX(-100%); transition: transform 0.22s ease-out;
        display: flex; flex-direction: column; color: #f8fafc; font-family: system-ui, sans-serif;
      }
      .kora-side-drawer.open { transform: translateX(0); }
      .kora-drawer-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 16px; border-bottom: 1px solid #334155; background: #1e293b;
      }
      .kora-drawer-list {
        display: flex; flex-direction: column; flex: 1; padding: 8px; overflow-y: auto; gap: 4px;
      }
      .kora-drawer-item {
        display: flex; align-items: center; gap: 12px; padding: 12px 14px;
        color: #94a3b8; text-decoration: none; border-radius: 8px; font-size: 0.9rem; font-weight: 500;
      }
      .kora-drawer-item:hover { background: #1e293b; color: #fff; }
      .kora-drawer-item.active {
        background: rgba(245, 158, 11, 0.12); color: #f59e0b; font-weight: 700;
        border-left: 3px solid #f59e0b;
      }
      .kora-drawer-footer {
        padding: 14px; border-top: 1px solid #334155; font-size: 0.75rem; color: #64748b;
      }
    `;
    document.head.appendChild(style);
  }

  static injectDrawer(currentAppId) {
    let backdrop = document.getElementById("drawerBackdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "drawerBackdrop";
      backdrop.className = "kora-drawer-backdrop";
      document.body.prepend(backdrop);
    }

    let aside = document.getElementById("sideDrawer");
    if (!aside) {
      aside = document.createElement("aside");
      aside.id = "sideDrawer";
      aside.className = "kora-side-drawer";
      document.body.prepend(aside);
    }

    aside.innerHTML = `
      <div class="kora-drawer-header">
        <div>
          <div style="font-size:0.7rem; text-transform:uppercase; color:#f59e0b; font-weight:800; letter-spacing:1px;">Suite Kora</div>
          <h2 style="font-size:1.1rem; font-weight:800; margin:0; color:#fff;">Módulos de Negocio</h2>
        </div>
        <button id="btnCloseDrawer" style="background:none; border:none; color:#94a3b8; font-size:1.4rem; cursor:pointer;" aria-label="Cerrar">✕</button>
      </div>

      <nav class="kora-drawer-list">
        ${BIZ_MODULES.map(mod => {
          const isActive = mod.id === currentAppId;
          return `
            <a href="${isActive ? '#' : mod.url}" class="kora-drawer-item ${isActive ? 'active' : ''}">
              <span style="font-size:1.25rem;">${mod.icon}</span>
              <div style="flex:1;">
                <div>${mod.name}</div>${isActive ? '<small style="font-size:0.7rem; color:#f59e0b;">● Módulo actual</small>' : ''}
              </div>
            </a>
          `;
        }).join('')}
      </nav>

      <div class="kora-drawer-footer">
        Persistencia: <code style="color:#f59e0b;">kora_master.db</code>
      </div>
    `;
  }

  static bindEvents() {
    const btnOpen = document.getElementById("btnOpenDrawer");
    const btnClose = document.getElementById("btnCloseDrawer");
    const backdrop = document.getElementById("drawerBackdrop");
    const aside = document.getElementById("sideDrawer");

    const toggle = (open) => {
      if (aside) aside.classList.toggle("open", open);
      if (backdrop) backdrop.classList.toggle("active", open);
    };

    if (btnOpen) btnOpen.onclick = () => toggle(true);
    if (btnClose) btnClose.onclick = () => toggle(false);
    if (backdrop) backdrop.onclick = () => toggle(false);
  }
}
