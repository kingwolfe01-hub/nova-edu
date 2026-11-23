// js/grade3-quiz-engine.js — NovaEdu 三年級多題型互動引擎（問答聽力 / 積木重組 / 文法挖空 / 情境對話）
window.Grade3QuizEngine = (function() {
  let activeAudio = null;

  function stopAudio() {
    if ("speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    if (activeAudio) {
      try { activeAudio.pause(); activeAudio.currentTime = 0; } catch (e) {}
      activeAudio = null;
    }
  }

  function playPromptAudio(q, slowRate) {
    stopAudio();
    if (!q) return;
    const text = q.promptAudio || q.speakerLine || "";
    if (!slowRate && q.audioFile) {
      try {
        activeAudio = new Audio(q.audioFile);
        activeAudio.play().catch(() => speakFallback(text, 0.85));
        return;
      } catch (e) {}
    }
    speakFallback(text, slowRate ? 0.62 : 0.85);
  }

  function speakFallback(text, rate) {
    if (!("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = rate || 0.85;
    window.speechSynthesis.speak(u);
  }

  function getQuestionsForPlanet(planetId) {
    const map = {
      planet2: window.NOVA_G3_QUESTIONS,
      planet3: window.NOVA_G4_QUESTIONS,
      planet4: window.NOVA_G5_QUESTIONS,
      planet5: window.NOVA_G6_QUESTIONS,
      planet6: window.NOVA_ADV_QUESTIONS
    };
    const arr = map[planetId || "planet2"];
    return Array.isArray(arr) ? arr : [];
  }

  function getPool(opts) {
    const pid = opts?.planetId || (typeof currentBook !== "undefined" && currentBook?.planetId) || "planet2";
    const all = getQuestionsForPlanet(pid);
    const sem = opts?.semester || (typeof currentSemester !== "undefined" ? currentSemester : "上學期");
    const ed = opts?.edition || (typeof currentEditionFilter !== "undefined" ? currentEditionFilter : "ALL");
    const unitId = opts?.unitId || "";
    const examHalf = opts?.examHalf || "";
    const stage = opts?.stage || "practice";
    const typeFilter = opts?.type || "all";

    return all.filter(q => {
      if (sem && q.semester !== sem) return false;
      if (ed && ed !== "ALL" && Array.isArray(q.editions) && !q.editions.includes(ed)) return false;
      if (stage && Array.isArray(q.stage) && !q.stage.includes(stage)) return false;
      if (unitId && Array.isArray(q.unitIds) && !q.unitIds.includes(unitId)) return false;
      if (examHalf && q.examHalf !== examHalf) return false;
      if (typeFilter && typeFilter !== "all" && q.type !== typeFilter) return false;
      return true;
    });
  }

  // ==================== 隨堂練習模式（掛載於 #sentence-content） ====================
  let pQueue = [];
  let pIdx = 0;
  let pScore = 0;
  let pWrongs = [];
  let pModeTitle = "";
  let pLastParams = null;
  let builtBlocks = [];
  let poolBlocks = [];
  let puzzleLocked = false;
  let isCrossUnitFallback = false;

  function shufflePuzzleBlocks(blocks, answer) {
    const arr = [...(blocks || [])];
    if (arr.length <= 1) return arr;
    let out = shuffle(arr);
    for (let t = 0; t < 5 && Array.isArray(answer) && out.length === answer.length && out.every((v, i) => v === answer[i]); t++) {
      out = shuffle(arr);
    }
    return out;
  }

  function startGrade3Practice(params) {
    pLastParams = params || {};
    const typeLabelMap = {
      all: "🧠 句型綜合特訓",
      qa_listening: "🎧 問答聽力（聽問選答）",
      block_puzzle: "🧱 積木重組造句",
      grammar_blank: "✏️ 文法關鍵字挖空",
      situational_qa: "💬 星際情境對話"
    };
    pModeTitle = typeLabelMap[params?.type || "all"] || "🧠 句型綜合特訓";
    const pool = getPool({
      semester: currentSemester,
      edition: currentEditionFilter,
      unitId: params?.unitId || "",
      stage: "practice",
      type: params?.type || "all"
    });
    if (!pool.length) {
      isCrossUnitFallback = true;
      const fallback = getPool({ semester: currentSemester, edition: "ALL", stage: "practice", type: params?.type || "all" });
      pQueue = shuffle(fallback).slice(0, 8);
    } else {
      isCrossUnitFallback = false;
      pQueue = shuffle(pool).slice(0, 8);
    }
    pIdx = 0;
    pScore = 0;
    pWrongs = [];
    renderPracticeStep();
  }

  function renderPracticeStep() {
    const box = document.getElementById("sentence-content");
    if (!box) return;
    stopAudio();

    if (pIdx >= pQueue.length) {
      const total = Math.max(1, pQueue.length);
      const pct = Math.round((pScore / total) * 100);
      if (typeof triggerNovaCelebration === "function") triggerNovaCelebration(pct);
      if (typeof saveStudyRecord === "function") {
        saveStudyRecord({
          mode: `隨堂：${pModeTitle}`,
          unit: currentUnitKey || "三年級句型",
          score: pScore,
          correct: pScore,
          total,
          wrongWords: pWrongs.map(w => w.word)
        });
      }
      box.innerHTML = `
        <div class="text-center py-6 space-y-4">
          <div class="text-4xl font-black text-sky-600">${pct} 分</div>
          <div class="text-sm font-bold text-slate-600">${escapeHtml(pModeTitle)}完成｜答對 ${pScore} / ${total} 題</div>
          ${pWrongs.length ? `
            <div class="max-w-lg mx-auto text-left space-y-1.5">
              <div class="text-xs font-black text-rose-700">📌 重點複習提醒：</div>
              ${pWrongs.map(w => `<div class="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">${escapeHtml(w.word)}<div class="text-[11px] text-slate-600 mt-0.5">${escapeHtml(w.meaning)}</div></div>`).join("")}
            </div>` : `<div class="text-xs font-black text-emerald-600">🎉 全部一次通關！文法觀念超穩固！</div>`}
          ${typeof window.renderNextPracticePromptHtml === "function" ? window.renderNextPracticePromptHtml("g3_" + (pLastParams?.type || "all")) : ""}
          <div class="flex justify-center gap-2 pt-2">
            <button type="button" onclick="backToActiveUnitModal()" class="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-800 font-black text-xs">↩️ 回本單元選單</button>
          </div>
        </div>`;
      return;
    }

    const q = pQueue[pIdx];
    const headerHtml = `
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div class="flex items-center gap-1.5">
          <span class="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-black">${escapeHtml(pModeTitle)}</span>
          <span class="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold">${escapeHtml(q.topic)}</span>
          ${isCrossUnitFallback ? `<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">本單元暫無此題型・跨單元精選</span>` : ""}
        </div>
        <span class="text-xs font-black text-slate-500">第 ${pIdx + 1} / ${pQueue.length} 題</span>
      </div>`;

    let bodyHtml = "";
    if (q.type === "qa_listening") {
      bodyHtml = `
        <div class="text-center space-y-3">
          <p class="text-xs font-bold text-slate-500">🎧 【問答聽力】請仔細聽太空廣播的「問句」，選出最合理的「答句」：</p>
          <div class="flex justify-center gap-2">
            <button type="button" onclick="Grade3QuizEngine.playCurrent(false)" class="px-5 py-3 rounded-2xl nova-btn-3d bg-violet-600 text-white font-black text-sm shadow">🔊 播放問句</button>
            <button type="button" onclick="Grade3QuizEngine.playCurrent(true)" class="px-4 py-3 rounded-2xl bg-slate-100 border border-slate-300 text-slate-700 font-black text-xs">🐢 慢速重聽</button>
          </div>
          <div id="g3-reveal-prompt" style="display:none;" class="text-xs font-black text-violet-700 bg-violet-50 border border-violet-200 rounded-xl py-1.5 px-3 max-w-md mx-auto"></div>
          <div class="space-y-2.5 max-w-lg mx-auto pt-1" id="g3-opt-list">
            ${q.options.map((opt, idx) => `
              <button type="button" data-idx="${idx}" onclick="Grade3QuizEngine.submitChoice(${idx}, this)"
                class="w-full p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-violet-400 transition text-left font-black text-sm text-slate-800">
                ${String.fromCharCode(65 + idx)}. ${escapeHtml(opt)}
              </button>`).join("")}
          </div>
        </div>`;
    } else if (q.type === "grammar_blank") {
      const parts = q.sentence.split("_____");
      bodyHtml = `
        <div class="text-center space-y-4">
          <p class="text-xs font-bold text-slate-500">✏️ 【文法關鍵字挖空】請選出最適合填入發光空格的單字：</p>
          <div class="p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-200 text-lg sm:text-xl font-black text-slate-900 max-w-xl mx-auto">
            ${escapeHtml(parts[0] || "")}<span id="g3-blank-slot" class="inline-block min-w-[68px] px-3 py-0.5 mx-1 rounded-xl bg-white border-2 border-dashed border-amber-500 text-amber-600">？</span>${escapeHtml(parts[1] || "")}
          </div>
          <div class="grid ${q.options.length >= 4 ? "grid-cols-2 sm:grid-cols-4 max-w-xl" : "grid-cols-3 max-w-md"} gap-2.5 mx-auto" id="g3-opt-list">
            ${q.options.map((opt, idx) => `
              <button type="button" data-idx="${idx}" onclick="Grade3QuizEngine.submitChoice(${idx}, this)"
                class="p-3.5 rounded-2xl nova-btn-3d bg-white border-2 border-slate-200 hover:border-amber-400 transition font-black text-base text-slate-800">
                ${escapeHtml(opt)}
              </button>`).join("")}
          </div>
        </div>`;
    } else if (q.type === "situational_qa") {
      bodyHtml = `
        <div class="space-y-3 max-w-xl mx-auto">
          <p class="text-xs font-bold text-slate-500 text-center">💬 【星際情境對話】請閱讀情境並選出最正確的回應：</p>
          <div class="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 text-left space-y-2">
            <div class="text-xs font-bold text-slate-700">${escapeHtml(q.situationZh)}</div>
            ${q.speakerLine ? `<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-sky-200 text-sm font-black text-sky-900">
              <span>🧑‍🚀 「${escapeHtml(q.speakerLine)}」</span>
              <button type="button" onclick="Grade3QuizEngine.playCurrent(false)" class="text-xs px-2 py-0.5 rounded-lg bg-sky-500 text-slate-950 font-black">🔊</button>
            </div>` : ""}
          </div>
          <div class="space-y-2" id="g3-opt-list">
            ${q.options.map((opt, idx) => `
              <button type="button" data-idx="${idx}" onclick="Grade3QuizEngine.submitChoice(${idx}, this)"
                class="w-full p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-sky-400 transition text-left font-black text-sm text-slate-800">
                ${String.fromCharCode(65 + idx)}. ${escapeHtml(opt)}
              </button>`).join("")}
          </div>
        </div>`;
    } else if (q.type === "block_puzzle") {
      puzzleLocked = false;
      builtBlocks = [];
      poolBlocks = shufflePuzzleBlocks(q.blocks, q.answer).map((txt, i) => ({ id: i, text: txt, used: false }));
      bodyHtml = `
        <div class="text-center space-y-3 max-w-xl mx-auto">
          <p class="text-xs font-bold text-slate-500">🧱 【積木重組造句】依序點擊下方積木，排出正確的英文句子：</p>
          <div class="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-base font-black text-indigo-950">
            中文提示：${escapeHtml(q.promptZh)}
          </div>
          <div id="g3-puzzle-answer-zone" class="min-h-[56px] p-3 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-wrap items-center justify-center gap-2">
            <span class="text-xs font-bold text-slate-400">請點選下方積木排列句子...</span>
          </div>
          <div id="g3-puzzle-pool-zone" class="flex flex-wrap items-center justify-center gap-2 pt-1"></div>
          <div class="flex justify-center gap-2 pt-2">
            <button id="g3-puzzle-reset-btn" type="button" onclick="Grade3QuizEngine.resetPuzzle()" class="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-black text-xs">↩️ 清除重排</button>
            <button id="g3-puzzle-check-btn" type="button" disabled onclick="Grade3QuizEngine.checkPuzzle()" class="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow opacity-45 cursor-not-allowed">✅ 檢查句子</button>
          </div>
        </div>`;
    }

    box.innerHTML = `
      <div>
        ${headerHtml}
        ${bodyHtml}
        <div id="g3-feedback-box" style="display:none;" class="mt-4 max-w-xl mx-auto p-3.5 rounded-2xl text-xs font-bold"></div>
      </div>`;

    if (q.type === "block_puzzle") renderPuzzleZones();
    if (q.type === "qa_listening") playPromptAudio(q, false);
  }

  function renderPuzzleZones() {
    const ansZone = document.getElementById("g3-puzzle-answer-zone");
    const poolZone = document.getElementById("g3-puzzle-pool-zone");
    if (!ansZone || !poolZone) return;

    ansZone.innerHTML = builtBlocks.length
      ? builtBlocks.map((b, idx) => `
          <button type="button" ${puzzleLocked ? "disabled" : ""} onclick="Grade3QuizEngine.removePuzzleBlock(${idx})"
            class="px-3.5 py-2 rounded-xl bg-sky-600 text-white font-black text-sm shadow-sm ${puzzleLocked ? "opacity-90 cursor-default" : "hover:bg-sky-500"}">
            ${escapeHtml(b.text)}
          </button>`).join("")
      : `<span class="text-xs font-bold text-slate-400">請點選下方積木排列句子...</span>`;

    poolZone.innerHTML = poolBlocks.map((b, idx) => `
      <button type="button" ${(b.used || puzzleLocked) ? "disabled" : ""} onclick="Grade3QuizEngine.pickPuzzleBlock(${idx})"
        class="px-3.5 py-2 rounded-xl font-black text-sm border-2 transition ${(b.used || puzzleLocked) ? "opacity-30 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed" : "nova-btn-3d bg-white border-indigo-300 text-indigo-950 hover:border-indigo-500"}">
        ${escapeHtml(b.text)}
      </button>`).join("");

    const resetBtn = document.getElementById("g3-puzzle-reset-btn");
    if (resetBtn) {
      resetBtn.disabled = puzzleLocked;
      resetBtn.classList.toggle("opacity-45", puzzleLocked);
      resetBtn.classList.toggle("cursor-not-allowed", puzzleLocked);
    }
    const checkBtn = document.getElementById("g3-puzzle-check-btn");
    if (checkBtn) {
      const ready = !puzzleLocked && builtBlocks.length === poolBlocks.length && poolBlocks.length > 0;
      checkBtn.disabled = !ready;
      checkBtn.className = ready
        ? "px-5 py-2 rounded-xl nova-btn-3d bg-emerald-500 text-slate-950 font-black text-xs shadow"
        : "px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow opacity-45 cursor-not-allowed";
    }
  }

  function pickPuzzleBlock(poolIdx) {
    if (puzzleLocked) return;
    const item = poolBlocks[poolIdx];
    if (!item || item.used) return;
    item.used = true;
    builtBlocks.push(item);
    renderPuzzleZones();
  }

  function removePuzzleBlock(ansIdx) {
    if (puzzleLocked) return;
    const removed = builtBlocks.splice(ansIdx, 1)[0];
    if (removed) removed.used = false;
    renderPuzzleZones();
  }

  function resetPuzzle() {
    if (puzzleLocked) return;
    builtBlocks = [];
    poolBlocks.forEach(b => { b.used = false; });
    renderPuzzleZones();
  }

  function checkPuzzle() {
    const q = pQueue[pIdx];
    if (puzzleLocked || !q || builtBlocks.length < poolBlocks.length) return;
    puzzleLocked = true;
    const userSeq = builtBlocks.map(b => b.text);
    const isOk = userSeq.length === q.answer.length && userSeq.every((t, i) => t === q.answer[i]);
    renderPuzzleZones();

    const ansZone = document.getElementById("g3-puzzle-answer-zone");
    if (ansZone) {
      ansZone.classList.remove("bg-slate-100", "border-slate-300", "border-dashed");
      ansZone.classList.add(...(isOk ? ["bg-emerald-50", "border-emerald-500"] : ["bg-rose-50", "border-rose-400"]));
    }

    const fullSentence = q.answer.join(" ").replace(/\s+([?.!])/g, "$1");
    if (q.audioFile) {
      playPromptAudio({ audioFile: q.audioFile, promptAudio: fullSentence }, false);
    } else {
      speakFallback(fullSentence, 0.85);
    }
    showPracticeFeedback(isOk, q, fullSentence);
  }

  function submitChoice(selectedIdx, btn) {
    const q = pQueue[pIdx];
    if (!q) return;
    const isOk = selectedIdx === q.correctIndex;
    document.querySelectorAll("#g3-opt-list button").forEach(b => {
      b.disabled = true;
      if (Number(b.dataset.idx) === q.correctIndex) {
        b.classList.add("border-emerald-500", "bg-emerald-50", "ring-2", "ring-emerald-300");
      }
    });
    if (!isOk && btn) btn.classList.add("border-rose-500", "bg-rose-50");

    if (q.type === "grammar_blank") {
      const slot = document.getElementById("g3-blank-slot");
      if (slot) {
        slot.innerText = q.options[q.correctIndex];
        slot.className = "inline-block px-3 py-0.5 mx-1 rounded-xl bg-emerald-100 border-2 border-emerald-500 text-emerald-800";
      }
    }
    if (q.type === "qa_listening") {
      const rev = document.getElementById("g3-reveal-prompt");
      if (rev) {
        rev.style.display = "block";
        rev.innerText = `題目問句：${q.promptAudio}`;
      }
    }
    showPracticeFeedback(isOk, q, q.options[q.correctIndex]);
  }

  function showPracticeFeedback(isOk, q, correctText) {
    const fb = document.getElementById("g3-feedback-box");
    if (isOk) {
      pScore++;
      if (fb) {
        fb.style.display = "block";
        fb.className = "mt-4 max-w-xl mx-auto p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold";
        fb.innerHTML = `✅ <b>答對了！</b> ${escapeHtml(q.explanation)}`;
      }
      setTimeout(() => { pIdx++; renderPracticeStep(); }, 1100);
    } else {
      const title = q.promptAudio || q.promptZh || q.sentence || q.situationZh;
      pWrongs.push({ word: `${title} → ${correctText}`, meaning: q.explanation });
      if (fb) {
        fb.style.display = "block";
        fb.className = "mt-4 max-w-xl mx-auto p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold space-y-2";
        fb.innerHTML = `
          <div>❌ <b>再想一下喔！</b> 💡 提示：${escapeHtml(q.hint || "")}</div>
          <div class="text-slate-700">📌 正確答案：<b>${escapeHtml(correctText)}</b>（${escapeHtml(q.explanation)}）</div>
          <div class="text-right"><button type="button" onclick="Grade3QuizEngine.nextStep()" class="px-4 py-1.5 rounded-xl bg-slate-800 text-white font-black text-xs">下一題 ▶</button></div>`;
      }
    }
  }

  // ==================== 段考／總檢測出題橋接（供 js/self-exam.js 呼叫） ====================
  function getExamQuestionsForBook(book, examMode, selectedGroupIds) {
    if (!book || !["planet2", "planet3", "planet4", "planet5", "planet6"].includes(book.planetId)) return [];
    const sem = book.semester;
    const ed = typeof currentEditionFilter !== "undefined" ? currentEditionFilter : "ALL";
    let pool = getPool({ planetId: book.planetId, semester: sem, edition: ed, stage: "exam" });

    if (examMode === "midterm") {
      pool = pool.filter(q => q.examHalf === "midterm");
    } else if (examMode === "final") {
      pool = pool.filter(q => q.examHalf === "final");
    } else if (examMode === "unit" || examMode === "custom") {
      const ids = new Set(selectedGroupIds || []);
      pool = pool.filter(q => (q.unitIds || []).some(uid => {
        if (ids.has(`grp_${uid}`)) return true;
        const m = uid.match(/^sentence_u([1-4])$/);
        return m && ids.has(`grp_u${m[1]}`);
      }));
    }

    const limitMap = { unit: 5, midterm: 8, final: 10, custom: 6 };
    return shuffle(pool).slice(0, limitMap[examMode] || 6).map(q => ({
      ...q,
      _isG3Rich: true,
      word: q.promptAudio || q.promptZh || q.sentence || q.situationZh,
      meaning: q.type === "block_puzzle" ? q.answer.join(" ").replace(/\s+([?.!])/g, "$1") : (q.options ? q.options[q.correctIndex] : "")
    }));
  }

  return {
    getPool,
    stopAudio,
    startGrade3Practice,
    retryPractice: () => startGrade3Practice(pLastParams),
    playCurrent: (slow) => playPromptAudio(pQueue[pIdx], slow),
    submitChoice,
    pickPuzzleBlock,
    removePuzzleBlock,
    resetPuzzle,
    checkPuzzle,
    nextStep: () => { pIdx++; renderPracticeStep(); },
    getExamQuestionsForBook
  };
})();
