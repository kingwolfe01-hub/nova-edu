// js/app-core.js — NovaEdu 銀河英語探險 B2C 序號登入、年級星系導覽、家長學習報告與音檔播放
let currentEditionFilter = localStorage.getItem("nova_edition_filter") || "ALL";

function matchesGlobalEdition(it) {
  if (currentEditionFilter === "ALL") return true;
  const eds = it?.editions || [];
  return !eds.length || eds.includes(currentEditionFilter);
}

function setGlobalEditionFilter(ed) {
  currentEditionFilter = ed || "ALL";
  localStorage.setItem("nova_edition_filter", currentEditionFilter);
  ["ALL", "Super", "Wonder", "Here"].forEach(k => {
    ["world-ed-btn-", "ed-btn-"].forEach(prefix => {
      const btn = document.getElementById(prefix + k);
      if (!btn) return;
      if (k === currentEditionFilter) {
        btn.className = "px-3 py-1.5 rounded-xl text-xs font-black border bg-indigo-600 text-white border-indigo-400 shadow-sm";
      } else {
        btn.className = prefix === "world-ed-btn-"
          ? "px-3 py-1.5 rounded-xl text-xs font-black border bg-slate-900 text-slate-300 border-slate-700 hover:border-sky-400"
          : "px-3 py-1.5 rounded-xl text-xs font-black border bg-slate-100 text-slate-700 border-slate-200 hover:border-indigo-300";
      }
    });
  });
  if (typeof renderAudioPlayerUnits === "function" && document.getElementById("player-section")?.style.display !== "none") {
    renderAudioPlayerUnits();
  }
  if (typeof renderSelfExamHub === "function" && document.getElementById("exam-section")?.style.display !== "none") {
    renderSelfExamHub();
  }
  if (typeof renderStationModalSubUnits === "function" && document.getElementById("unit-station-modal")?.style.display === "flex") {
    renderStationModalSubUnits();
  }
}

let currentPlanetId = "";
let currentPlanet = null;
let currentSemester = "上學期";
let currentBookId = "";
let currentBook = null;
let currentUnitKey = "";
let currentVocabList = [];
let currentQuizList = [];
let currentQuizIndex = 0;
let score = 0;
let quizWrongItems = [];
let currentSentenceList = [];
let currentSentenceIndex = 0;
let sentenceScore = 0;
let sentenceWrongItems = [];
let audioUnlocked = false;
let activeAudioObj = null;
let loggedInStudent = null;

function resolvePlanetAccessFromBooks(allowedBooks) {
  const books = Array.isArray(allowedBooks) ? allowedBooks : [];
  const bookToPlanet = {
    nova1: ["planet2", "上學期"], nova2: ["planet2", "下學期"],
    nova3: ["planet3", "上學期"], nova4: ["planet3", "下學期"],
    nova5: ["planet4", "上學期"], nova6: ["planet4", "下學期"],
    nova7: ["planet5", "上學期"], nova8: ["planet5", "下學期"],
    nova9: ["planet6", "上學期"], nova10: ["planet6", "下學期"]
  };
  const pSet = new Set(["planet1"]);
  const sSet = new Set();
  books.forEach(b => {
    const m = bookToPlanet[String(b).trim()];
    if (m) { pSet.add(m[0]); sSet.add(m[1]); }
  });
  return {
    allowedPlanets: [...pSet],
    allowedSemesters: sSet.size ? [...sSet] : ["上學期", "下學期"]
  };
}

function stopAllPracticeAudio() {
  if (typeof stopPlayerAutoPlay === "function") stopPlayerAutoPlay();
  if ("speechSynthesis" in window) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
  if (activeAudioObj) {
    try { activeAudioObj.pause(); activeAudioObj.currentTime = 0; } catch (e) {}
    activeAudioObj = null;
  }
  if (typeof stopExamPlaybackAudio === "function") {
    try { stopExamPlaybackAudio(); } catch (e) {}
  }
}

function getNovaDeviceId() {
  let devId = localStorage.getItem("nova_device_id");
  if (!devId) {
    devId = "DEV-" + Math.random().toString(36).slice(2, 10).toUpperCase();
    localStorage.setItem("nova_device_id", devId);
  }
  return devId;
}

function getLocalSerialStore() {
  try {
    const saved = JSON.parse(localStorage.getItem("nova_local_cards") || "{}");
    return { ...DEMO_SERIAL_CARDS, ...saved };
  } catch (e) {
    return { ...DEMO_SERIAL_CARDS };
  }
}

function saveLocalSerialStore(storeObj) {
  localStorage.setItem("nova_local_cards", JSON.stringify(storeObj));
}

function fillDemoSerial(code) {
  const input = document.getElementById("serial-input");
  const nick = document.getElementById("nickname-input");
  if (input) input.value = code;
  if (nick && !nick.value.trim()) nick.value = "小小探險家";
}

function initNovaApp() {
  document.title = NOVA_BRAND.name;
  initNovaParticles();
  mountNovaLottie("lottie-login-rocket", "rocket");
  mountNovaLottie("lottie-galaxy-mascot", "badge");
  mountNovaLottie("lottie-station-badge", "badge");
  mountNovaLottie("lottie-exam-trophy", "trophy");
  if (typeof lucide !== 'undefined') { try { lucide.createIcons(); } catch(e){} }
  const savedSession = localStorage.getItem("nova_active_session");
  if (savedSession) {
    try {
      const parsed = JSON.parse(savedSession);
      if (parsed && parsed.serial) {
        document.getElementById("serial-input").value = parsed.serial;
        document.getElementById("nickname-input").value = parsed.nickname || "";
      }
    } catch (e) {}
  }
}

async function handleSerialLogin() {
  unlockAudio();
  const serial = (document.getElementById("serial-input").value || "").trim().toUpperCase();
  const nickname = (document.getElementById("nickname-input").value || "").trim();
  const errEl = document.getElementById("login-error");
  if (errEl) errEl.style.display = "none";

  if (!serial) return showError("請輸入序號卡上的開通序號！");
  if (!nickname) return showError("請輸入孩子的自訂暱稱（用於學習報告顯示）！");

  const btn = document.getElementById("login-btn");
  if (btn) { btn.disabled = true; btn.innerText = "⏳ 正在驗證序號與裝置..."; }

  const deviceId = getNovaDeviceId();

  try {
    let authResult = null;
    if (NOVA_GAS_URL) {
      const res = await fetch(NOVA_GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "serialLogin", serial, nickname, deviceId })
      });
      authResult = await res.json();
    } else {
      // 本機離線驗收模式（無 GAS 時自動啟用，完整模擬 365 天效期與 3 台裝置綁定）
      const store = getLocalSerialStore();
      const card = store[serial];
      if (!card) {
        authResult = { ok: false, error: "查無此序號，請確認是否輸入正確（或點選下方示範序號測試）。" };
      } else if (card.status === "DISABLED") {
        authResult = { ok: false, error: "此序號已被停用，請聯繫客服人員。" };
      } else {
        const now = Date.now();
        if (!card.activatedAt) {
          card.activatedAt = new Date(now).toISOString();
          const exp = new Date(now + (card.validDays || 365) * 86400000);
          card.expiresAt = exp.toISOString();
        }
        const expMs = new Date(card.expiresAt).getTime();
        if (now > expMs) {
          authResult = { ok: false, error: `此序號已於 ${card.expiresAt.slice(0, 10)} 到期，請續約或更換新序號。` };
        } else {
          card.boundDevices = Array.isArray(card.boundDevices) ? card.boundDevices : [];
          const maxDev = card.maxDevices || 3;
          if (!card.boundDevices.includes(deviceId)) {
            if (card.boundDevices.length >= maxDev) {
              authResult = { ok: false, error: `此序號已達 ${maxDev} 台裝置綁定上限！請聯繫客服於後台重置裝置。` };
            } else {
              card.boundDevices.push(deviceId);
            }
          }
          if (!authResult) {
            card.nickname = nickname;
            store[serial] = card;
            saveLocalSerialStore(store);
            const daysLeft = Math.max(1, Math.ceil((expMs - now) / 86400000));
            authResult = {
              ok: true,
              serial,
              nickname,
              planType: card.planType,
              allowedBooks: card.allowedBooks || [],
              allowedPlanets: (card.allowedPlanets && card.allowedPlanets.length) ? card.allowedPlanets : resolvePlanetAccessFromBooks(card.allowedBooks).allowedPlanets,
              allowedSemesters: (card.allowedSemesters && card.allowedSemesters.length) ? card.allowedSemesters : resolvePlanetAccessFromBooks(card.allowedBooks).allowedSemesters,
              activatedAt: card.activatedAt.slice(0, 10),
              expiresAt: card.expiresAt.slice(0, 10),
              daysLeft,
              boundCount: card.boundDevices.length,
              maxDevices: maxDev
            };
          }
        }
      }
    }

    if (!authResult || !authResult.ok) {
      showError(authResult?.error || "序號驗證失敗，請稍後再試。");
      return;
    }

    loggedInStudent = authResult;
    localStorage.setItem("nova_active_session", JSON.stringify({ serial, nickname }));
    enterGalaxyHub();
  } catch (e) {
    showError("連線驗證失敗，請檢查網路狀態。");
  } finally {
    if (btn) { btn.disabled = false; btn.innerText = "🚀 啟動星際護照並進入星系"; }
  }
}

function getAllowedPlanetSet() {
  if (loggedInStudent?.allowedPlanets?.length) return new Set(loggedInStudent.allowedPlanets);
  return new Set(["planet1","planet2","planet3","planet4","planet5","planet6"]);
}

function getAllowedSemesterSet() {
  if (loggedInStudent?.allowedSemesters?.length) return new Set(loggedInStudent.allowedSemesters);
  return new Set(["上學期", "下學期"]);
}

function enterGalaxyHub() {
  document.getElementById("login-wrapper").style.display = "none";
  document.getElementById("main-app").style.display = "none";
  const gal = document.getElementById("galaxy-wrapper");
  gal.style.display = "block";

  const infoEl = document.getElementById("galaxy-user-badge");
  if (infoEl && loggedInStudent) {
    infoEl.innerHTML = `🧑‍🚀 <b>${escapeHtml(loggedInStudent.nickname)}</b> ｜ 🎫 ${escapeHtml(loggedInStudent.planType)} ｜ ⏳ 剩餘 ${loggedInStudent.daysLeft} 天（裝置 ${loggedInStudent.boundCount}/${loggedInStudent.maxDevices}）`;
  }
  const planets = Object.values(planetData || {});
  const allowed = getAllowedPlanetSet();
  if (typeof init3DGalaxy === "function") {
    init3DGalaxy(planets, allowed, pid => {
      if (allowed.has(pid)) enterPlanetWorld(pid);
      else alert("此星球尚未開通！請購買對應年級／全星系序號卡解鎖。");
    });
  }
  renderGalaxyCards();
  requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
}

function renderGalaxyCards() {
  const container = document.getElementById("galaxy-grid-container");
  if (!container) return;
  const allowed = getAllowedPlanetSet();
  const allowedSems = getAllowedSemesterSet();

  container.innerHTML = Object.values(planetData || {}).map(p => {
    const unlocked = allowed.has(p.planetId);
    const upUnits = p.semesters["上學期"]?.mainUnits?.length || 0;
    const dnUnits = p.semesters["下學期"]?.mainUnits?.length || 0;
    const satCount = (p.semesters["上學期"]?.satelliteUnits?.length || 0) + (p.semesters["下學期"]?.satelliteUnits?.length || 0);
    return `
      <button type="button" onclick="${unlocked ? `enterPlanetWorld('${p.planetId}')` : `alert('此星球（${p.planetName}）尚未開通！請購買對應年級／全星系序號卡解鎖。')`}"
        class="text-left rounded-3xl p-5 border transition-all backdrop-blur-md shadow-xl ${unlocked ? 'bg-slate-900/80 border-slate-600 hover:border-sky-300 hover:scale-[1.01] cursor-pointer' : 'bg-slate-950/60 border-slate-800 opacity-60 cursor-not-allowed'}">
        <div class="flex items-center justify-between mb-2">
          <span class="px-3 py-1 rounded-full text-xs font-black text-slate-950" style="background:${p.planetColor}">${p.planetIcon} ${p.gradeLabel}</span>
          <span class="px-2.5 py-1 rounded-full text-xs font-black ${unlocked ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' : 'bg-slate-800 text-slate-400'}">
            ${unlocked ? '進入 3D 星球 →' : '🔒 未解鎖'}
          </span>
        </div>
        <h3 class="text-lg font-black text-white m-0">${p.planetName}</h3>
        <p class="text-xs text-slate-300 mt-1 mb-3">${p.subtitle}</p>
        <div class="flex flex-wrap gap-1.5 text-[11px] font-bold">
          <span class="px-2 py-1 rounded-lg ${allowedSems.has("上學期") ? 'bg-amber-400/20 text-amber-200' : 'bg-slate-800 text-slate-400'}">☀️ 北半球(上)：${upUnits} 單元</span>
          <span class="px-2 py-1 rounded-lg ${allowedSems.has("下學期") ? 'bg-sky-400/20 text-sky-200' : 'bg-slate-800 text-slate-400'}">🌙 南半球(下)：${dnUnits} 單元</span>
          <span class="px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-200">🛰️ 衛星專區：${satCount} 區</span>
        </div>
      </button>`;
  }).join("");
}

function enterPlanetWorld(planetId, preferredSemester) {
  currentPlanetId = planetId;
  currentPlanet = planetData[planetId];
  if (!currentPlanet) return;

  const allowedSems = getAllowedSemesterSet();
  let targetSem = preferredSemester || (allowedSems.has("上學期") ? "上學期" : "下學期");
  if (!allowedSems.has(targetSem)) {
    targetSem = [...allowedSems][0] || "上學期";
  }
  currentSemester = targetSem;
  currentBook = currentPlanet.semesters[currentSemester];
  currentBookId = currentBook.bookId;

  document.getElementById("galaxy-wrapper").style.display = "none";
  document.getElementById("main-app").style.display = "block";

  updateHemisphereHUD();
  setGlobalEditionFilter(currentEditionFilter);
  if (typeof init3DWorld === "function") init3DWorld(currentBook, currentSemester);
  showModule("world");
  requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
}

function switchPlanetSemester(semName) {
  if (!currentPlanet) return;
  const allowedSems = getAllowedSemesterSet();
  if (!allowedSems.has(semName)) {
    alert(`您的序號卡目前僅開通「${[...allowedSems].join("、")}」，「${semName}」半球目前為黑夜鎖定狀態！`);
    return;
  }
  currentSemester = semName;
  currentBook = currentPlanet.semesters[semName];
  currentBookId = currentBook.bookId;
  updateHemisphereHUD();
  setGlobalEditionFilter(currentEditionFilter);
  if (typeof init3DWorld === "function") init3DWorld(currentBook, currentSemester);
}

function updateHemisphereHUD() {
  if (!currentBook) return;
  const badge = document.getElementById("student-badge");
  if (badge) badge.innerText = `🧑‍🚀 ${loggedInStudent.nickname}｜${currentBook.planetName}・${currentSemester}`;
  const hdr = document.getElementById("dynamic-school-header");
  if (hdr) hdr.innerText = `${NOVA_BRAND.name} ・ ${currentBook.planetName}（剩 ${loggedInStudent.daysLeft} 天）`;

  const allowedSems = getAllowedSemesterSet();
  const btnN = document.getElementById("btn-hemi-north");
  const btnS = document.getElementById("btn-hemi-south");
  if (btnN) {
    const isDay = currentSemester === "上學期";
    btnN.className = `px-3 py-1.5 rounded-xl text-xs font-black border transition ${isDay ? "bg-amber-400 text-slate-950 border-amber-300 shadow" : "bg-slate-900 text-slate-300 border-slate-700"}`;
    btnN.innerText = isDay ? "☀️ 北半球・上學期（白天使用中）" : (allowedSems.has("上學期") ? "🌑 北半球・上學期（黑夜・點擊切換）" : "🔒 北半球・上學期（黑夜鎖定）");
  }
  if (btnS) {
    const isDay = currentSemester === "下學期";
    btnS.className = `px-3 py-1.5 rounded-xl text-xs font-black border transition ${isDay ? "bg-amber-400 text-slate-950 border-amber-300 shadow" : "bg-slate-900 text-slate-300 border-slate-700"}`;
    btnS.innerText = isDay ? "☀️ 南半球・下學期（白天使用中）" : (allowedSems.has("下學期") ? "🌑 南半球・下學期（黑夜・點擊切換）" : "🔒 南半球・下學期（黑夜鎖定）");
  }
}



function openSatelliteModal() {
  if (!currentBook || typeof openUnitStationModal !== "function") return;
  const sats = currentBook.satelliteUnits || [];
  if (!sats.length) {
    alert("本學期衛星專區暫無額外單元。");
    return;
  }
  const subUnits = [];
  sats.forEach(u => {
    const base = u.title || "";
    if (u.words && u.words.length) {
      subUnits.push({ ...u, subType: "vocab", subLabel: `${u.badgeIcon || "🛰️"} ${base}${u.sentences && u.sentences.length ? "（字彙）" : ""}` });
    }
    if (u.sentences && u.sentences.length) {
      subUnits.push({ ...u, subType: "sentence", subLabel: `${u.badgeIcon || "💬"} ${base}${u.words && u.words.length ? "（句型）" : ""}` });
    }
  });
  if (!subUnits.length) {
    alert("本學期衛星專區暫無額外單元。");
    return;
  }
  openUnitStationModal({
    id: "station_satellite_all",
    title: "衛星專區（發音 / 數字 / 節慶 / 用語）",
    icon: "🛰️",
    desc: `${currentBook.planetName}・${currentSemester} 全部衛星專區`,
    subUnits
  });
}

function backToGalaxyHub() {
  stopAllPracticeAudio();
  if (typeof stopExamPlaybackAudio === "function") stopExamPlaybackAudio();
  if (activeAudioObj) { try { activeAudioObj.pause(); } catch (e) {} }
  enterGalaxyHub();
}

function showError(msg) {
  const errEl = document.getElementById("login-error");
  if (errEl) {
    errEl.innerText = msg;
    errEl.style.display = "block";
  }
}

function showModule(moduleName) {
  if (typeof stopExamPlaybackAudio === "function") stopExamPlaybackAudio();
  ["world-hub", "vocab-section", "sentence-section", "player-section", "exam-section"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
  if (moduleName === "world") {
    document.getElementById("world-hub").style.display = "block";
    if (typeof refresh3DWorldProgress === "function") refresh3DWorldProgress();
    if (typeof window.resumeNova3DLoops === "function") setTimeout(window.resumeNova3DLoops, 30);
  } else if (moduleName === "vocab") {
    document.getElementById("vocab-section").style.display = "block";
  } else if (moduleName === "sentence") {
    document.getElementById("sentence-section").style.display = "block";
  } else if (moduleName === "player") {
    document.getElementById("player-section").style.display = "block";
    renderAudioPlayerUnits();
  } else if (moduleName === "exam") {
    document.getElementById("exam-section").style.display = "block";
    if (typeof renderSelfExamHub === "function") renderSelfExamHub();
  }
}

function backToMenu() {
  stopAllPracticeAudio();
  showModule("world");
}

function logoutStudent() {
  stopAllPracticeAudio();
  loggedInStudent = null;
  document.getElementById("main-app").style.display = "none";
  document.getElementById("galaxy-wrapper").style.display = "none";
  document.getElementById("login-wrapper").style.display = "flex";
}

function unlockAudio() { audioUnlocked = true; }
function normalizeText(t) { return sfNormalizeText(t); }
function shuffle(a) {
  const arr = [...(a || [])];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function escapeHtml(text) {
  return String(text || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function getItemText(item) { return item ? String(item.word || item.sentence || "").replace(/[’‘]/g, "'") : ""; }
function getItemMeaning(item) { return item ? (item.meaning || "") : ""; }
function hasImage(item) { return !!(item && item.image && !String(item.image).includes("無須生圖")); }
function buildImageOnlyUnits(units) {
  const out = {};
  Object.entries(units || {}).forEach(([k, list]) => {
    const valid = (list || []).filter(hasImage);
    if (valid.length) out[k] = valid;
  });
  return out;
}
function safeList(arr) { return Array.isArray(arr) ? arr : []; }

function playAudio(item) {
  if (!item) return;
  if (activeAudioObj) { try { activeAudioObj.pause(); } catch (e) {} }
  const src = item.audio || "";
  if (src) {
    const a = new Audio(src);
    activeAudioObj = a;
    a.play().catch(() => speakText(getItemText(item)));
  } else {
    speakText(getItemText(item));
  }
}

function speakText(text) {
  if (!("speechSynthesis" in window) || !text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

// 單元語音播放器（取代原 CD1 / CD2）
let _playerTracks = [];
let _playerAutoTimer = null;
let _playerAutoRunning = false;
let _playerAutoIdx = 0;

function stopPlayerAutoPlay() {
  _playerAutoRunning = false;
  if (_playerAutoTimer) { clearTimeout(_playerAutoTimer); _playerAutoTimer = null; }
  const btn = document.getElementById("player-autoplay-btn");
  if (btn) {
    btn.innerText = "▶️ 全部自動連播";
    btn.className = "px-4 py-2 rounded-xl nova-btn-3d bg-emerald-500 text-slate-950 text-xs font-black shadow";
  }
  document.querySelectorAll("[id^='player-row-']").forEach(el => {
    el.classList.remove("border-sky-500", "bg-sky-50", "ring-2", "ring-sky-300");
  });
}

function togglePlayerAutoPlay() {
  if (_playerAutoRunning) {
    stopPlayerAutoPlay();
    if (activeAudioObj) { try { activeAudioObj.pause(); } catch (e) {} }
    return;
  }
  if (!_playerTracks.length) return;
  _playerAutoRunning = true;
  _playerAutoIdx = 0;
  const btn = document.getElementById("player-autoplay-btn");
  if (btn) {
    btn.innerText = "⏹️ 停止自動連播";
    btn.className = "px-4 py-2 rounded-xl nova-btn-3d bg-rose-500 text-white text-xs font-black shadow";
  }
  playNextAutoTrack();
}

function playTrackAndHighlight(idx, fromAuto) {
  const item = _playerTracks[idx];
  if (!item) return;
  document.querySelectorAll("[id^='player-row-']").forEach(el => {
    el.classList.remove("border-sky-500", "bg-sky-50", "ring-2", "ring-sky-300");
  });
  const row = document.getElementById(`player-row-${idx}`);
  if (row) {
    row.classList.add("border-sky-500", "bg-sky-50", "ring-2", "ring-sky-300");
    row.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  const gapMs = Number(document.getElementById("player-gap-select")?.value || 1500);
  const loopOn = !!document.getElementById("player-loop-chk")?.checked;

  function scheduleNext() {
    if (!fromAuto || !_playerAutoRunning) return;
    _playerAutoTimer = setTimeout(() => {
      if (!_playerAutoRunning) return;
      _playerAutoIdx++;
      if (_playerAutoIdx >= _playerTracks.length) {
        if (loopOn) _playerAutoIdx = 0;
        else { stopPlayerAutoPlay(); return; }
      }
      playNextAutoTrack();
    }, gapMs);
  }

  if (activeAudioObj) { try { activeAudioObj.pause(); } catch (e) {} }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();

  if (item.audio) {
    try {
      activeAudioObj = new Audio(item.audio);
      activeAudioObj.onended = scheduleNext;
      activeAudioObj.onerror = () => { speakText(getItemText(item)); scheduleNext(); };
      activeAudioObj.play().catch(() => { speakText(getItemText(item)); scheduleNext(); });
      return;
    } catch (e) {}
  }
  speakText(getItemText(item));
  scheduleNext();
}

function playNextAutoTrack() {
  if (!_playerAutoRunning) return;
  playTrackAndHighlight(_playerAutoIdx, true);
}

function renderAudioPlayerUnits() {
  stopPlayerAutoPlay();
  const sel = document.getElementById("player-unit-select");
  const listEl = document.getElementById("player-track-list");
  if (!sel || !listEl || !currentBook) return;
  const gradeSemTag = `[${currentBook.grade}${currentBook.semester}]`;
  if (!sel.options.length || sel.dataset.bookId !== currentBookId) {
    sel.dataset.bookId = currentBookId;
    sel.innerHTML = currentBook.unitCatalog.map((u, idx) => `<option value="${idx}">${escapeHtml(gradeSemTag)} ${u.badgeIcon} ${escapeHtml(u.title)}</option>`).join("");
  }
  const u = currentBook.unitCatalog[Number(sel.value || 0)];
  if (!u) return;
  _playerTracks = [...(u.words || []), ...(u.sentences || [])].filter(matchesGlobalEdition);
  const autoBtn = document.getElementById("player-autoplay-btn");
  if (autoBtn) {
    autoBtn.disabled = _playerTracks.length === 0;
    autoBtn.className = _playerTracks.length === 0
      ? "px-4 py-2 rounded-xl bg-slate-200 text-slate-400 text-xs font-black cursor-not-allowed opacity-60"
      : "px-4 py-2 rounded-xl nova-btn-3d bg-emerald-500 text-slate-950 text-xs font-black shadow";
  }
  const edTag = currentEditionFilter === "ALL" ? "" : ` [${currentEditionFilter}]`;
  listEl.innerHTML = _playerTracks.map((t, i) => `
    <div id="player-row-${i}" class="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-sky-400 transition">
      <div class="flex items-center gap-3 min-w-0">
        ${hasImage(t)
          ? `<img src="${t.image}" alt="" class="w-14 h-14 object-contain rounded-xl bg-slate-50 border border-slate-200 p-1 shrink-0" onerror="this.style.display='none';" />`
          : `<div class="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shrink-0">💬</div>`}
        <div class="min-w-0">
          <div class="font-black text-slate-800 text-sm truncate">${i + 1}. ${escapeHtml(getItemText(t))}</div>
          <div class="text-xs text-slate-500 mt-0.5">${escapeHtml(getItemMeaning(t))}</div>
        </div>
      </div>
      <button type="button" onclick="playTrackAndHighlight(${i}, false)" class="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black shrink-0">🔊 播放</button>
    </div>`).join("") || `<div class="p-6 rounded-2xl bg-slate-100 border border-slate-200 text-center text-sm font-bold text-slate-400">此版本${escapeHtml(edTag)}在本單元無收錄音檔，請切換其他單元或「全部綜合」。</div>`;
}

// 家長學習報告與錯題雲端同步
function getStudyRecordsKey() {
  return `nova_study_records_${loggedInStudent?.serial || "DEMO"}`;
}

function getLocalStudyRecords() {
  try {
    const arr = JSON.parse(localStorage.getItem(getStudyRecordsKey()) || "[]");
    return (arr || []).map(r => {
      const tot = Math.max(1, Number(r.total || 1));
      let sc = Number(r.score || 0);
      let pct = Number(r.pct || 0);
      if (sc > tot || pct > 100) {
        pct = Math.min(100, Math.round(pct > 100 ? (sc <= 100 ? sc : 100) : pct));
        sc = Math.min(tot, Math.round((pct / 100) * tot));
      }
      return { ...r, score: sc, total: tot, pct: Math.min(100, Math.max(0, pct)) };
    });
  } catch (e) { return []; }
}

function saveStudyRecord(rec, modeForTip) {
  if (!loggedInStudent) return;
  const fullRec = {
    id: "REC-" + Date.now(),
    timestamp: new Date().toISOString(),
    serial: loggedInStudent.serial,
    nickname: loggedInStudent.nickname,
    bookId: rec.bookId || currentBookId || "",
    bookTitle: bookData[rec.bookId || currentBookId]?.title || "",
    unit: rec.unit || "",
    mode: rec.mode || "practice",
    score: Math.min(Math.max(1, Number(rec.total || 1)), Math.max(0, Number(rec.correct != null ? rec.correct : rec.score || 0))),
    total: Math.max(1, Number(rec.total || 1)),
    pct: Math.min(100, Math.round((Math.min(Math.max(1, Number(rec.total || 1)), Math.max(0, Number(rec.correct != null ? rec.correct : rec.score || 0))) / Math.max(1, Number(rec.total || 1))) * 100)),
    wrongWords: Array.isArray(rec.wrongWords) ? rec.wrongWords : []
  };

  const list = getLocalStudyRecords();
  list.unshift(fullRec);
  localStorage.setItem(getStudyRecordsKey(), JSON.stringify(list.slice(0, 300)));

  if (NOVA_GAS_URL) {
    fetch(NOVA_GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "saveStudyRecord", record: fullRec })
    })
      .then(() => {
        const tipEl = document.getElementById(`${modeForTip}-upload-tip`);
        if (tipEl) tipEl.innerHTML = "☁️ 已同步至家長學習報告";
      })
      .catch(() => {});
  } else {
    const tipEl = document.getElementById(`${modeForTip}-upload-tip`);
    if (tipEl) tipEl.innerHTML = "💾 已儲存至個人學習報告";
  }
}

function openParentReportModal() {
  const modal = document.getElementById("parentReportModal");
  if (!modal) return;
  modal.style.display = "flex";
  renderParentReport();
}

function closeParentReportModal() {
  const modal = document.getElementById("parentReportModal");
  if (modal) modal.style.display = "none";
  if (typeof window.resumeNova3DLoops === "function") window.resumeNova3DLoops();
}

function renderParentReport() {
  const recs = getLocalStudyRecords();
  const days = new Set(recs.map(r => (r.timestamp || "").slice(0, 10))).size;
  const avg = recs.length ? Math.round(recs.reduce((s, r) => s + (r.pct || 0), 0) / recs.length) : 0;
  const wrongCounts = {};
  recs.forEach(r => (r.wrongWords || []).forEach(w => { wrongCounts[w] = (wrongCounts[w] || 0) + 1; }));
  const topWrong = Object.entries(wrongCounts).sort((a, b) => b[1] - a[1]).slice(0, 12);

  document.getElementById("report-summary-cards").innerHTML = `
    <div class="p-3 rounded-xl bg-sky-50 border border-sky-200 text-center"><div class="text-xs text-sky-700 font-bold">累積學習天數</div><div class="text-2xl font-black text-sky-900">${days} 天</div></div>
    <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center"><div class="text-xs text-emerald-700 font-bold">完成練習／測驗</div><div class="text-2xl font-black text-emerald-900">${recs.length} 次</div></div>
    <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center"><div class="text-xs text-amber-700 font-bold">平均正確率</div><div class="text-2xl font-black text-amber-900">${avg}%</div></div>
  `;

  document.getElementById("report-wrong-words").innerHTML = topWrong.length
    ? topWrong.map(([w, c]) => `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">${escapeHtml(w)} <small class="text-rose-500">×${c}</small></span>`).join(" ")
    : "<span class='text-xs text-emerald-700 font-bold'>🎉 目前沒有常錯單字，表現很棒！</span>";

  
  const chartCanvas = document.getElementById("parent-report-chart");
  if (chartCanvas && typeof Chart !== "undefined") {
    if (_novaReportChart) { try { _novaReportChart.destroy(); } catch (e) {} }
    const recent = recs.slice(0, 10).reverse();
    _novaReportChart = new Chart(chartCanvas, {
      type: "bar",
      data: {
        labels: recent.length ? recent.map(r => (r.unit || r.mode || "測驗").slice(0, 8)) : ["尚未測驗"],
        datasets: [{
          label: "正確率 (%)",
          data: recent.length ? recent.map(r => r.pct || 0) : [0],
          backgroundColor: recent.map(r => (r.pct || 0) >= 80 ? "#10b981" : "#38bdf8"),
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        scales: { y: { min: 0, max: 100 } },
        plugins: { legend: { display: false } }
      }
    });
  }

  document.getElementById("report-history-tbody").innerHTML = recs.slice(0, 30).map(r => `
    <tr>
      <td>${escapeHtml((r.timestamp || "").slice(0, 10))}</td>
      <td>${escapeHtml(r.bookTitle || r.bookId)}</td>
      <td>${escapeHtml(r.unit)}</td>
      <td>${escapeHtml(r.mode)}</td>
      <td class="font-black ${r.pct >= 80 ? 'text-emerald-700' : 'text-amber-700'}">${r.score}/${r.total} (${r.pct}%)</td>
    </tr>`).join("") || "<tr><td colspan='5' class='text-center text-slate-400'>尚無學習紀錄，快去地球儀探索吧！</td></tr>";
}

function openStudentGuideModal() {
  const m = document.getElementById("studentGuideModal");
  if (m) m.style.display = "flex";
}
function closeStudentGuideModal() {
  const m = document.getElementById("studentGuideModal");
  if (m) m.style.display = "none";
}

window.addEventListener("DOMContentLoaded", initNovaApp);

let _novaReportChart = null;

function triggerNovaCelebration(pct) {
  if (pct >= 80 && typeof confetti === "function") {
    try {
      confetti({ particleCount: 95, spread: 75, origin: { y: 0.62 } });
    } catch (e) {}
  }
}

function initNovaParticles() {
  if (typeof tsParticles === "undefined") return;
  try {
    tsParticles.load("tsparticles-bg", {
      particles: {
        number: { value: 65, density: { enable: true, area: 800 } },
        color: { value: ["#ffffff", "#7dd3fc", "#fde047"] },
        opacity: { value: { min: 0.15, max: 0.75 }, animation: { enable: true, speed: 0.8 } },
        size: { value: { min: 1, max: 3 } },
        move: { enable: true, speed: 0.35, direction: "none", outModes: "out" }
      },
      detectRetina: true
    });
  } catch (e) {}
}

const _mountedLotties = {};
function mountNovaLottie(domId, packKey) {
  const el = document.getElementById(domId);
  if (!el || typeof lottie === "undefined" || typeof NOVA_LOTTIE_PACK === "undefined" || !NOVA_LOTTIE_PACK[packKey]) return;
  if (_mountedLotties[domId]) return;
  try {
    _mountedLotties[domId] = lottie.loadAnimation({
      container: el,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: JSON.parse(JSON.stringify(NOVA_LOTTIE_PACK[packKey]))
    });
  } catch (e) {}
}
