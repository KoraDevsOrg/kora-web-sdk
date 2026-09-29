/**
 * Kora Web SDK - Menú Lateral de Negocios
 * https://github.com/KoraDevsOrg/kora-web-sdk
 */
export const BIZ_MODULES = [
  { id: "inventario", name: "Gestión de Inventario", icon: "📦", url: "https://koradevsorg.github.io/kora-inventario/" },
  { id: "fabricacion", name: "Fabricación & Órdenes", icon: "⚙️", url: "https://koradevsorg.github.io/kora-fabricacion/" },
  { id: "ventas", name: "Ventas & Mostrador", icon: "🏷️", url: "https://koradevsorg.github.io/kora-ventas/" },
  { id: "costos", name: "Costos & Servicios", icon: "💡", url: "https://koradevsorg.github.io/calculadora-costos/" },
  { id: "rrhh", name: "Gestión Humana (RRHH)", icon: "👥", url: "https://koradevsorg.github.io/kora-rrhh/" },
  { id: "financiero", name: "Financiero & Cuentas", icon: "📊", url: "https://koradevsorg.github.io/kora-financiero/" }
];

export class KoraBizNav {
  static init(currentModuleId) {
    const backdrop = document.getElementById("drawerBackdrop");
    const drawer = document.getElementById("sideDrawer");
    if (!drawer) return;

    drawer.innerHTML = `
      <div class="drawer-header">
        <h2 style="font-size: 1.15rem; font-weight: 800; color: #fff;">Ecosistema Kora</h2>
        <button id="btnCloseDrawer" class="btn-icon">✕</button>
      </div>
      
      <div class="drawer-section-title">SUITE DE NEGOCIO</div>
      <nav class="drawer-list">
        ${BIZ_MODULES.map(m => {
          const isActive = m.id === currentModuleId;
          return `
            <a href="${isActive ? '#' : m.url}" class="drawer-item ${isActive ? 'active' : ''}">
              <span>${m.icon}</span> <span>${m.name}</span>
            </a>
          `;
        }).join('')}
      </nav>

      <div class="drawer-footer">
        <small style="color: var(--text-sub); display: block; margin-bottom: 8px;">Kora Admin DB (Motor Central)</small>
        <button id="btnOpenKoraAdmin" class="btn-secondary" style="width: 100%; font-size: 0.8rem;">
          ⚙️️ Administrar Bases de Datos
        </button>
      </div>
    `;

    const btnOpen = document.getElementById("btnOpenDrawer");
    const btnClose = document.getElementById("btnCloseDrawer");
    const btnAdmin = document.getElementById("btnOpenKoraAdmin");

    const toggle = (open) => {
      drawer.classList.toggle("open", open);
      if (backdrop) backdrop.classList.toggle("active", open);
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
