/**
 * Kora Web SDK - Menú Lateral de Negocios
 * https://github.com/KoraDevsOrg/kora-web-sdk
 */
export const BIZ_MODULES = [
  { id: "inventario", name: "Gestión de Inventario", icon: "📦", url: "https://koradevsorg.github.io/kora-inventario/" },
  { id: "fabricacion", name: "Fabricación (Órdenes)", icon: "⚙️", url: "https://koradevsorg.github.io/kora-fabricacion/" },
  { id: "ventas", name: "Ventas & Mostrador", icon: "🏷️", url: "https://koradevsorg.github.io/kora-ventas/" },
  { id: "costos", name: "Costos & Servicios Indirectos", icon: "💡", url: "https://koradevsorg.github.io/calculadora-costos/" },
  { id: "rrhh", name: "Gestión Humana & Nómina", icon: "👥", url: "https://koradevsorg.github.io/kora-rrhh/" },
  { id: "financiero", name: "Financiero & Cuentas", icon: "📊", url: "https://koradevsorg.github.io/kora-financiero/" }
];

export class KoraBizNav {
  static init(currentModuleId) {
    let backdrop = document.getElementById("drawerBackdrop");
    let drawer = document.getElementById("sideDrawer");

    if (!drawer) {
      drawer = document.createElement("aside");
      drawer.id = "sideDrawer";
      drawer.className = "side-drawer";
      document.body.prepend(drawer);
    }

    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "drawerBackdrop";
      backdrop.className = "drawer-backdrop";
      document.body.prepend(backdrop);
    }

    drawer.innerHTML = `
      <div class="drawer-header">
        <div>
          <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--accent-orange, #f97316); font-weight: 800; letter-spacing: 0.5px;">SUITE KORA</div>
          <h2 style="font-size: 1.15rem; font-weight: 800; color: #fff; margin-top: 2px;">Módulos de Negocio</h2>
        </div>
        <button id="btnCloseDrawer" class="btn-icon">✕</button>
      </div>
      
      <div class="drawer-section-title">SUITE DE NEGOCIO DESCENTRALIZADA</div>
      <nav class="drawer-list">
        ${BIZ_MODULES.map(m => {
          const isActive = m.id === currentModuleId;
          return `
            <a href="${isActive ? '#' : m.url}" class="drawer-item ${isActive ? 'active' : ''}">
              <span class="drawer-item-icon">${m.icon}</span> <span>${m.name}</span>
            </a>
          `;
        }).join('')}
      </nav>

      <div class="drawer-footer">
        <small style="color: var(--text-sub); display: block; margin-bottom: 8px;">Kora Admin DB (Motor Central)</small>
        <button id="btnOpenKoraAdmin" class="btn-secondary" style="width: 100%; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
          ⚙️ Administrar Bases de Datos
        </button>
      </div>
    `;

    const btnOpen = document.getElementById("btnOpenDrawer");
    const btnClose = document.getElementById("btnCloseDrawer");
    const btnAdmin = document.getElementById("btnOpenKoraAdmin");

    const toggle = (open) => {
      drawer.classList.toggle("open", open);
      backdrop.classList.toggle("active", open);
    };

    if (btnOpen) btnOpen.onclick = () => toggle(true);
    if (btnClose) btnClose.onclick = () => toggle(false);
    if (backdrop) backdrop.onclick = () => toggle(false);

    if (btnAdmin) {
      btnAdmin.onclick = () => {
        if (typeof window.KoraDB !== "undefined" && window.KoraDB.openAdmin) {
          window.KoraDB.openAdmin();
        } else {
          window.location.href = "https://github.com/KoraDevsOrg/kora-admin-db/releases";
        }
      };
    }
  }
}
