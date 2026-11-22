/**
 * NovaEdu 銀河英語探險 v5 — B2C 序號卡與自學紀錄雲端後端 (Google Apps Script)
 * 部署方式：
 * 1. 建立空白 Google 試算表，打開「擴充功能 -> Apps Script」，貼上本程式碼儲存。
 * 2. 點選「部署 -> 新增部署作業 -> 網頁應用程式」，執行身分選「我」，誰可以存取選「所有人」。
 * 3. 複製產出的 Web App 網址，貼入 data/nova-config.js 的 NOVA_GAS_URL 即可啟用雲端營運！
 */

const ADMIN_PASSCODE = "nova2026admin"; // 請務必於正式上線前修改為您的專屬管理密碼
const SHEET_CARDS = "SerialCards";
const SHEET_RECORDS = "StudyRecords";

function resolvePlanetAccessFromBooks(allowedBooks) {
  var books = Array.isArray(allowedBooks) ? allowedBooks : [];
  var bookToPlanet = {
    nova1: ["planet2", "上學期"], nova2: ["planet2", "下學期"],
    nova3: ["planet3", "上學期"], nova4: ["planet3", "下學期"],
    nova5: ["planet4", "上學期"], nova6: ["planet4", "下學期"],
    nova7: ["planet5", "上學期"], nova8: ["planet5", "下學期"],
    nova9: ["planet6", "上學期"], nova10: ["planet6", "下學期"]
  };
  var pSet = { planet1: true };
  var sSet = {};
  books.forEach(function(b) {
    var m = bookToPlanet[String(b).trim()];
    if (m) {
      pSet[m[0]] = true;
      sSet[m[1]] = true;
    }
  });
  var allowedPlanets = Object.keys(pSet);
  var allowedSemesters = Object.keys(sSet);
  if (!allowedSemesters.length) allowedSemesters = ["上學期", "下學期"];
  return { allowedPlanets: allowedPlanets, allowedSemesters: allowedSemesters };
}

function getOrCreateSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sCards = ss.getSheetByName(SHEET_CARDS);
  if (!sCards) {
    sCards = ss.insertSheet(SHEET_CARDS);
    sCards.appendRow(["serial", "planType", "allowedBooks", "validDays", "maxDevices", "status", "activatedAt", "expiresAt", "boundDevices", "nickname"]);
  }
  let sRecs = ss.getSheetByName(SHEET_RECORDS);
  if (!sRecs) {
    sRecs = ss.insertSheet(SHEET_RECORDS);
    sRecs.appendRow(["timestamp", "serial", "nickname", "bookId", "bookTitle", "unit", "mode", "score", "total", "pct", "wrongWords"]);
  }
  return { sCards, sRecs };
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    const action = body.action || "";
    const { sCards, sRecs } = getOrCreateSheets();

    if (action === "serialLogin") {
      const serial = String(body.serial || "").trim().toUpperCase();
      const nickname = String(body.nickname || "").trim();
      const deviceId = String(body.deviceId || "").trim();
      const rows = sCards.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]).trim().toUpperCase() === serial) {
          const status = rows[i][5] || "ACTIVE";
          if (status === "DISABLED") return jsonOut({ ok: false, error: "此序號已被停用，請聯繫客服。" });

          const validDays = Number(rows[i][3] || 365);
          const maxDevices = Number(rows[i][4] || 3);
          let activatedAt = rows[i][6];
          let expiresAt = rows[i][7];
          const now = new Date();

          if (!activatedAt) {
            activatedAt = now.toISOString();
            expiresAt = new Date(now.getTime() + validDays * 86400000).toISOString();
            sCards.getRange(i + 1, 7).setValue(activatedAt);
            sCards.getRange(i + 1, 8).setValue(expiresAt);
          }

          const expMs = new Date(expiresAt).getTime();
          if (now.getTime() > expMs) {
            return jsonOut({ ok: false, error: "此序號已於 " + String(expiresAt).slice(0, 10) + " 到期。" });
          }

          let boundDevices = [];
          try { boundDevices = JSON.parse(rows[i][8] || "[]"); } catch (err) { boundDevices = []; }
          if (!Array.isArray(boundDevices)) boundDevices = [];

          if (deviceId && boundDevices.indexOf(deviceId) === -1) {
            if (boundDevices.length >= maxDevices) {
              return jsonOut({ ok: false, error: "此序號已達 " + maxDevices + " 台裝置綁定上限，請聯繫客服重置。" });
            }
            boundDevices.push(deviceId);
            sCards.getRange(i + 1, 9).setValue(JSON.stringify(boundDevices));
          }
          if (nickname) sCards.getRange(i + 1, 10).setValue(nickname);

          let allowedBooks = [];
          try { allowedBooks = JSON.parse(rows[i][2] || "[]"); } catch (err) { allowedBooks = String(rows[i][2] || "").split(","); }
          const access = resolvePlanetAccessFromBooks(allowedBooks);
          const daysLeft = Math.max(1, Math.ceil((expMs - now.getTime()) / 86400000));

          return jsonOut({
            ok: true,
            serial: serial,
            nickname: nickname || rows[i][9] || "小探險家",
            planType: rows[i][1] || "標準方案",
            allowedBooks: allowedBooks,
            allowedPlanets: access.allowedPlanets,
            allowedSemesters: access.allowedSemesters,
            activatedAt: String(activatedAt).slice(0, 10),
            expiresAt: String(expiresAt).slice(0, 10),
            daysLeft: daysLeft,
            boundCount: boundDevices.length,
            maxDevices: maxDevices
          });
        }
      }
      return jsonOut({ ok: false, error: "查無此序號，請確認是否輸入正確。" });
    }

    if (action === "saveStudyRecord") {
      const r = body.record || body;
      sRecs.appendRow([
        r.timestamp || new Date().toISOString(),
        r.serial || "",
        r.nickname || "",
        r.bookId || "",
        r.bookTitle || "",
        r.unit || "",
        r.mode || "",
        r.score || 0,
        r.total || 0,
        r.pct || 0,
        JSON.stringify(r.wrongs || [])
      ]);
      return jsonOut({ ok: true });
    }

    if (action === "adminLogin") {
      if (String(body.passcode || "") !== ADMIN_PASSCODE) {
        return jsonOut({ ok: false, error: "管理密碼錯誤" });
      }
      return jsonOut({ ok: true });
    }

    if (String(body.passcode || "") !== ADMIN_PASSCODE) {
      return jsonOut({ ok: false, error: "未授權的後台操作" });
    }

    if (action === "adminCreateBatch") {
      const cards = body.cards || [];
      cards.forEach(c => {
        sCards.appendRow([
          c.serial, c.planType, JSON.stringify(c.allowedBooks || []),
          c.validDays || 365, c.maxDevices || 3, "ACTIVE", "", "", "[]", ""
        ]);
      });
      return jsonOut({ ok: true, created: cards.length });
    }

    if (action === "adminListCards") {
      const rows = sCards.getDataRange().getValues();
      const list = [];
      for (let i = 1; i < rows.length; i++) {
        let devs = [];
        try { devs = JSON.parse(rows[i][8] || "[]"); } catch (e) {}
        list.push({
          serial: rows[i][0],
          planType: rows[i][1],
          allowedBooks: rows[i][2],
          validDays: rows[i][3],
          maxDevices: rows[i][4],
          status: rows[i][5],
          activatedAt: String(rows[i][6] || "").slice(0, 10),
          expiresAt: String(rows[i][7] || "").slice(0, 10),
          boundCount: Array.isArray(devs) ? devs.length : 0,
          nickname: rows[i][9] || ""
        });
      }
      return jsonOut({ ok: true, cards: list });
    }

    if (action === "adminResetDevices") {
      const target = String(body.serial || "").trim().toUpperCase();
      const rows = sCards.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]).trim().toUpperCase() === target) {
          sCards.getRange(i + 1, 9).setValue("[]");
          return jsonOut({ ok: true });
        }
      }
      return jsonOut({ ok: false, error: "查無序號" });
    }

    if (action === "adminToggleStatus") {
      const target = String(body.serial || "").trim().toUpperCase();
      const rows = sCards.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]).trim().toUpperCase() === target) {
          const cur = rows[i][5] || "ACTIVE";
          const next = cur === "ACTIVE" ? "DISABLED" : "ACTIVE";
          sCards.getRange(i + 1, 6).setValue(next);
          return jsonOut({ ok: true, status: next });
        }
      }
      return jsonOut({ ok: false, error: "查無序號" });
    }

    return jsonOut({ ok: false, error: "未知的 action" });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}
