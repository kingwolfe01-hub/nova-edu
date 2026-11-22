// js/seller-admin.js — NovaEdu 總部／賣家序號發卡與售後管理後台
let isAdminAuthed = false;
let adminPasscode = "";

function openTeacherAuthModal() {
  const m = document.getElementById("teacherAuthModal");
  if (m) m.style.display = "flex";
}
function closeTeacherAuthModal() {
  const m = document.getElementById("teacherAuthModal");
  if (m) m.style.display = "none";
}

async function handleTeacherModalLogin() {
  const pass = (document.getElementById("teacher-pass-input")?.value || "").trim();
  const errEl = document.getElementById("teacher-auth-error");
  if (errEl) errEl.style.display = "none";

  if (NOVA_GAS_URL) {
    try {
      const res = await fetch(NOVA_GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "adminLogin", passcode: pass })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "密碼錯誤");
    } catch (e) {
      if (errEl) { errEl.innerText = "管理密碼錯誤或連線失敗"; errEl.style.display = "block"; }
      return;
    }
  } else if (pass !== NOVA_ADMIN_DEFAULT_PASS) {
    if (errEl) { errEl.innerText = `管理密碼錯誤（本機預設：${NOVA_ADMIN_DEFAULT_PASS}）`; errEl.style.display = "block"; }
    return;
  }

  isAdminAuthed = true;
  adminPasscode = pass;
  closeTeacherAuthModal();
  document.getElementById("login-wrapper").style.display = "none";
  document.getElementById("galaxy-wrapper").style.display = "none";
  document.getElementById("main-app").style.display = "none";
  document.getElementById("admin-wrapper").style.display = "block";
  refreshAdminSerialTable();
}

function closeAdminSection() {
  document.getElementById("admin-wrapper").style.display = "none";
  document.getElementById("login-wrapper").style.display = "flex";
}

function resolveBooksForPlan(planCode) {
  if (planCode === "ALL") return ["nova1", "nova2", "nova3", "nova4", "nova5", "nova6", "nova7", "nova8", "nova9", "nova10"];
  if (planCode === "G3") return ["nova1", "nova2"];
  if (planCode === "G4") return ["nova3", "nova4"];
  if (planCode === "G5") return ["nova5", "nova6"];
  if (planCode === "G6") return ["nova7", "nova8"];
  if (planCode === "ADV") return ["nova9", "nova10"];
  return [planCode];
}

function randomCodeChunk(len = 4) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

async function generateBatchSerialCards() {
  const planCode = document.getElementById("admin-plan-select").value;
  const planLabel = document.getElementById("admin-plan-select").selectedOptions[0].text;
  const count = Math.min(500, Math.max(1, Number(document.getElementById("admin-gen-count").value || 10)));
  const validDays = Math.max(1, Number(document.getElementById("admin-valid-days").value || 365));
  const maxDevices = Math.max(1, Number(document.getElementById("admin-max-devices").value || 3));
  const allowedBooks = resolveBooksForPlan(planCode);

  const newCards = [];
  for (let i = 0; i < count; i++) {
    const serial = `NOVA-${planCode}-${randomCodeChunk(4)}-${randomCodeChunk(4)}`;
    newCards.push({
      serial,
      planType: planLabel,
      allowedBooks,
      validDays,
      maxDevices,
      status: "ACTIVE",
      activatedAt: "",
      expiresAt: "",
      boundDevices: [],
      nickname: ""
    });
  }

  if (NOVA_GAS_URL) {
    await fetch(NOVA_GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "adminCreateSerials", passcode: adminPasscode, cards: newCards })
    });
  } else {
    const store = getLocalSerialStore();
    newCards.forEach(c => { store[c.serial] = c; });
    saveLocalSerialStore(store);
  }

  document.getElementById("admin-gen-msg").innerText = `✅ 已成功產出 ${count} 張「${planLabel}」序號卡！`;
  refreshAdminSerialTable();
}

async function refreshAdminSerialTable() {
  const tbody = document.getElementById("admin-serial-tbody");
  if (!tbody) return;
  let cards = [];

  if (NOVA_GAS_URL) {
    try {
      const res = await fetch(NOVA_GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "adminListSerials", passcode: adminPasscode })
      });
      const data = await res.json();
      cards = data.cards || [];
    } catch (e) { cards = []; }
  } else {
    cards = Object.values(getLocalSerialStore());
  }

  const kw = (document.getElementById("admin-search-input")?.value || "").trim().toUpperCase();
  if (kw) cards = cards.filter(c => (c.serial || "").includes(kw) || (c.nickname || "").toUpperCase().includes(kw));

  tbody.innerHTML = cards.map(c => {
    const devCnt = Array.isArray(c.boundDevices) ? c.boundDevices.length : 0;
    const stateLabel = c.status === "DISABLED" ? "⛔ 已停用" : (c.activatedAt ? "✅ 使用中" : "🆕 未開通");
    return `
      <tr>
        <td class="font-mono font-black">${escapeHtml(c.serial)}</td>
        <td>${escapeHtml(c.planType)}</td>
        <td>${stateLabel}</td>
        <td>${escapeHtml(c.nickname || "—")}</td>
        <td>${c.activatedAt ? c.activatedAt.slice(0, 10) : "—"}</td>
        <td>${c.expiresAt ? c.expiresAt.slice(0, 10) : `${c.validDays || 365}天`}</td>
        <td>${devCnt} / ${c.maxDevices || 3}</td>
        <td class="space-x-1">
          <button type="button" onclick="adminResetDevices('${c.serial}')" class="px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs font-bold">重置裝置</button>
          <button type="button" onclick="adminExtendDays('${c.serial}', 365)" class="px-2 py-1 rounded bg-sky-100 text-sky-800 text-xs font-bold">+1年</button>
          <button type="button" onclick="adminToggleStatus('${c.serial}', '${c.status === "DISABLED" ? "ACTIVE" : "DISABLED"}')" class="px-2 py-1 rounded bg-rose-100 text-rose-800 text-xs font-bold">${c.status === "DISABLED" ? "啟用" : "停用"}</button>
        </td>
      </tr>`;
  }).join("") || "<tr><td colspan='8' class='text-center text-slate-400'>尚無符合的序號資料</td></tr>";
}

async function adminResetDevices(serial) {
  if (NOVA_GAS_URL) {
    await fetch(NOVA_GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "adminResetDevices", passcode: adminPasscode, serial })
    });
  } else {
    const store = getLocalSerialStore();
    if (store[serial]) { store[serial].boundDevices = []; saveLocalSerialStore(store); }
  }
  refreshAdminSerialTable();
}

async function adminExtendDays(serial, days) {
  if (NOVA_GAS_URL) {
    await fetch(NOVA_GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "adminExtendSerial", passcode: adminPasscode, serial, days })
    });
  } else {
    const store = getLocalSerialStore();
    const c = store[serial];
    if (c) {
      const base = c.expiresAt ? new Date(c.expiresAt).getTime() : Date.now();
      c.expiresAt = new Date(base + days * 86400000).toISOString();
      saveLocalSerialStore(store);
    }
  }
  refreshAdminSerialTable();
}

async function adminToggleStatus(serial, newStatus) {
  if (NOVA_GAS_URL) {
    await fetch(NOVA_GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "adminToggleSerial", passcode: adminPasscode, serial, status: newStatus })
    });
  } else {
    const store = getLocalSerialStore();
    if (store[serial]) { store[serial].status = newStatus; saveLocalSerialStore(store); }
  }
  refreshAdminSerialTable();
}

function exportSerialsCsv() {
  const cards = Object.values(getLocalSerialStore());
  const header = "序號,方案名稱,解鎖冊別,效期天數,裝置上限,狀態\n";
  const body = cards.map(c => `"${c.serial}","${c.planType}","${(c.allowedBooks || []).join("|")}",${c.validDays || 365},${c.maxDevices || 3},"${c.status}"`).join("\n");
  const blob = new Blob(["\uFEFF" + header + body], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "NovaEdu_序號卡印刷清單.csv";
  a.click();
}
