// data/nova-config.js — NovaEdu 銀河英語探險 v2 B2C 商業版核心設定
const NOVA_BRAND = {
  name: "NovaEdu 銀河英語探險",
  shortName: "NovaEdu 英語星系",
  subtitle: "國小 3–6 年級暨進階・3D 星球雙學期在家自學平台",
  copyright: "© NovaEdu 銀河英語探險（全原創繪本圖庫與語音素材）"
};

// 部署 B2C 版 Google Apps Script (Code.gs) 後，將 Web App 網址貼入下方即可啟用雲端序號開通與跨裝置同步；
// 留空時系統自動以「本機示範模式 + localStorage 同步」運作，方便單機體驗與測試！
const NOVA_GAS_URL = "";

// 預設賣家後台管理密碼（建議於 Code.gs Script Properties 或下方修改）
const NOVA_ADMIN_DEFAULT_PASS = "nova2026admin";

// 內建測試用序號卡（僅於未設定雲端 NOVA_GAS_URL 時供本機驗收測試）
const DEMO_SERIAL_CARDS = {
  "NOVA-ALL-DEMO": {
    serial: "NOVA-ALL-DEMO",
    planType: "全星系暢學卡（6 顆星球・上下學期全開通）",
    allowedPlanets: ["planet1", "planet2", "planet3", "planet4", "planet5", "planet6"],
    allowedSemesters: ["上學期", "下學期"],
    validDays: 365,
    maxDevices: 3,
    status: "ACTIVE"
  },
  "NOVA-G3-DEMO": {
    serial: "NOVA-G3-DEMO",
    planType: "三年級綠洲星卡（含啟航暖身星・上下學期）",
    allowedPlanets: ["planet1", "planet2"],
    allowedSemesters: ["上學期", "下學期"],
    validDays: 365,
    maxDevices: 3,
    status: "ACTIVE"
  },
  "NOVA-G4-DEMO": {
    serial: "NOVA-G4-DEMO",
    planType: "四年級蔚藍星卡（含啟航暖身星・上下學期）",
    allowedPlanets: ["planet1", "planet3"],
    allowedSemesters: ["上學期", "下學期"],
    validDays: 365,
    maxDevices: 3,
    status: "ACTIVE"
  },
  "NOVA-B1-DEMO": {
    serial: "NOVA-B1-DEMO",
    planType: "3上單學期卡（北半球白天開通・南半球黑夜鎖定）",
    allowedPlanets: ["planet1", "planet2"],
    allowedSemesters: ["上學期"],
    validDays: 365,
    maxDevices: 3,
    status: "ACTIVE"
  },
  "NOVA-ADV-DEMO": {
    serial: "NOVA-ADV-DEMO",
    planType: "進階榮耀星卡（含啟航暖身星・上下學期）",
    allowedPlanets: ["planet1", "planet6"],
    allowedSemesters: ["上學期", "下學期"],
    validDays: 365,
    maxDevices: 3,
    status: "ACTIVE"
  }
};

// 預留高清星球貼圖路徑（日後將高清貼圖放入 textures/ 資料夾並取消註解或對應檔名即可自動套用）
const NOVA_HD_PLANET_TEXTURES = {
  planet1: "",
  planet2: "",
  planet3: "",
  planet4: "",
  planet5: "",
  planet6: ""
};
