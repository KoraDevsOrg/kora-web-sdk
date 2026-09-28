/**
 * Kora Web SDK - Motor Universal de Internacionalización (i18n)
 * Soporte para Español y Lenguas Indígenas Originarias (Wayuunaiki, Nasa Yuwe)
 * Licencia Libre MIT - KoraDevsOrg
 */

export const KORA_LANGUAGES = Object.freeze({
  es: { code: "es", name: "Español" },
  guc: { code: "guc", name: "Wayuunaiki" },
  pbb: { code: "pbb", name: "Nasa Yuwe" }
});

export const KORA_DICTIONARY = Object.freeze({
  es: {
    appTitle: "Kora Primeros Auxilios",
    offlineTag: "100% Offline",
    menuTitle: "Protocolos de Emergencia",
    langSelect: "Idioma / Yuwe:",
    metronomeTitle: "Metrónomo RCP (110 BPM)",
    btnStartMetro: "INICIAR METRÓNOMO RCP",
    btnStopMetro: "DETENER METRÓNOMO",
    metroInstruction: "Comprime al compás exacto de cada golpe y destello",
    alertLabel: "ALERTA:",
    actionLabel: "ACCIÓN OBLIGATORIA:",
    footerText: "Kora Health Initiative • Software Libre MIT",
    // Categorías de triage
    catAsfixia: "Atragantamiento (Heimlich)",
    catRcp: "Paro Cardiorrespiratorio (RCP)",
    catHemorragias: "Hemorragias y Torniquete",
    catQuemaduras: "Quemaduras Térmicas",
    catToxicos: "Mordeduras y Tóxicos"
  },
  guc: { // Wayuunaiki (Pueblo Wayuu)
    appTitle: "Kora Ayatawaa Mülianüin",
    offlineTag: "Ayatüsü namaa internet",
    menuTitle: "Süchikuwaya Mülianüin",
    langSelect: "Aashajawaa:",
    metronomeTitle: "Sutaa aalin a'yatawaa (110 BPM)",
    btnStartMetro: "AYATAWAYAA METRÓNOMO",
    btnStopMetro: "EITAWASTAA",
    metroInstruction: "Pa'yateera a'luwatawaa sümaa nürütpaa",
    alertLabel: "ANNOOJOLÜ:",
    actionLabel: "A'YATAWAA CHO'UJAASÜ:",
    footerText: "Kora Health Initiative • Karalo'uta Anaasü MIT",
    catAsfixia: "Kakulaa (Heimlich)",
    catRcp: "Aashajuushii (RCP)",
    catHemorragias: "Ashaa aashajawaa",
    catQuemaduras: "Kousaa süka siki",
    catToxicos: "Wüi otta waneeyan"
  },
  pbb: { // Nasa Yuwe (Pueblo Nasa)
    appTitle: "Kora Dxij Yaacxpnasx",
    offlineTag: "Internet fxi'ze'yã'",
    menuTitle: "Ksxawte'saty Yu'tse",
    langSelect: "Yuwe:",
    metronomeTitle: "Pkhbuya uypx (110 BPM)",
    btnStartMetro: "UYPX YU'TSE'N",
    btnStopMetro: "TUCXNI",
    metroInstruction: "Pkhbuyue e'ste uypxte pa'ga",
    alertLabel: "CXHABTE:",
    actionLabel: "THEGNAYA:",
    footerText: "Kora Health Initiative • Fxize'we'sx MIT",
    catAsfixia: "Dxij cxe'ni (Heimlich)",
    catRcp: "Yu'tse' Uypx (RCP)",
    catHemorragias: "Iskwe Ksa'ji",
    catQuemaduras: "Ip'jxupx",
    catToxicos: "Ksxawte' thakwe"
  }
});

export class KoraI18n {
  constructor(storageKey = "kora_app_lang", defaultLang = "es") {
    this.storageKey = storageKey;
    this.currentLang = localStorage.getItem(this.storageKey) || defaultLang;
  }

  getLang() {
    return this.currentLang;
  }

  setLang(langCode) {
    if (KORA_DICTIONARY[langCode]) {
      this.currentLang = langCode;
      localStorage.setItem(this.storageKey, langCode);
    }
  }

  t(key) {
    const dict = KORA_DICTIONARY[this.currentLang] || KORA_DICTIONARY.es;
    return dict[key] || KORA_DICTIONARY.es[key] || key;
  }

  getText(fieldObject) {
    if (!fieldObject) return "";
    return fieldObject[this.currentLang] || fieldObject.es || "";
  }
}
