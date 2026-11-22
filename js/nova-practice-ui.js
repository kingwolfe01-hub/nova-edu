// js/nova-practice-ui.js — NovaEdu v5 閃卡活動 ＋ 指定 4 種測驗（含正解綠框提示、1.3秒訂正停留、統一音訊中斷）
(function() {
  let cardIdx = 0;
  let cardList = [];

  function playItemAudio(item) {
    if (typeof stopAllPracticeAudio === "function") stopAllPracticeAudio();
    if (!item) return;
    if (typeof playAudio === "function") {
      playAudio(item);
    } else if (item.audio) {
      try { new Audio(item.audio).play().catch(() => {}); } catch (e) {}
    }
  }

  function renderImgTag(item, cls) {
    const word = getItemText(item);
    if (hasImage(item)) {
      return `<img src="${item.image}" alt="${escapeHtml(word)}" class="${cls}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <div style="display:none;" class="${cls} bg-sky-50 border-2 border-dashed border-sky-300 items-center justify-center flex-col text-sky-700 p-3 text-center">
                <span class="text-3xl mb-1">🖼️</span>
                <span class="text-xs font-black">${escapeHtml(word)}</span>
                <span class="text-[10px] text-slate-400 mt-1">請確認 images/ 資料夾位於同層目錄</span>
              </div>`;
    }
    return `<div class="${cls} bg-indigo-50 border border-indigo-200 flex items-center justify-center flex-col text-indigo-700 p-4 text-center">
              <span class="text-4xl mb-1">📖</span>
              <span class="text-xs font-bold">${escapeHtml(word)}</span>
            </div>`;
  }

  function editDist(a, b) {
    a = String(a || "").toLowerCase().replace(/[^a-z]/g, "");
    b = String(b || "").toLowerCase().replace(/[^a-z]/g, "");
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] = Math.min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
      }
    }
    return dp[a.length][b.length];
  }

  window.pickMinimalPairOptions = function(q, localList, globalPool, requireImage) {
    const targetText = getItemText(q);
    const targetKey = targetText.toLowerCase();
    const candidates = [];
    const seen = new Set([targetKey]);
    [...(localList || []), ...(globalPool || [])].forEach(x => {
      const k = getItemText(x).toLowerCase();
      if (!k || seen.has(k)) return;
      if (requireImage && !hasImage(x)) return;
      seen.add(k);
      candidates.push(x);
    });

    const simSet = new Set((q.similarWords || []).map(s => String(s).toLowerCase()));
    const scored = candidates.map(x => {
      const xt = getItemText(x).toLowerCase();
      let sc = 0;
      if (simSet.has(xt)) sc += 200;
      const ed = editDist(targetText, xt);
      if (ed === 1) sc += 120;
      else if (ed === 2) sc += 65;
      else if (ed === 3) sc += 25;
      if (targetKey.length >= 2 && xt.length >= 2 && targetKey.slice(-2) === xt.slice(-2)) sc += 45;
      if (targetKey[0] === xt[0]) sc += 12;
      if (Math.abs(targetKey.length - xt.length) <= 1) sc += 10;
      return { item: x, sc: sc + Math.random() * 4 };
    });

    scored.sort((a, b) => b.sc - a.sc);
    const dist = scored.slice(0, 3).map(s => s.item);
    return shuffle([q, ...dist]);
  };

  window.pickSimilarSentenceOptions = function(q, localList, globalPool) {
    const targetText = getItemText(q);
    const targetKey = targetText.toLowerCase();
    const t1 = targetKey.replace(/’/g, "'").match(/[a-z']+/g) || [];
    const set1 = new Set(t1);
    const isQ1 = targetText.trim().endsWith("?");

    const candidates = [];
    const seen = new Set([targetKey]);
    [...(localList || []), ...(globalPool || [])].forEach(x => {
      const k = getItemText(x).toLowerCase();
      if (!k || seen.has(k)) return;
      seen.add(k);
      candidates.push(x);
    });

    const simSet = new Set((q.similarSentences || []).map(s => String(s).toLowerCase()));
    const scored = candidates.map(x => {
      const xt = getItemText(x);
      const xk = xt.toLowerCase();
      const t2 = xk.replace(/’/g, "'").match(/[a-z']+/g) || [];
      const set2 = new Set(t2);
      let sc = 0;
      if (simSet.has(xk)) sc += 220;
      if (isQ1 === xt.trim().endsWith("?")) sc += 60;
      if (t1[0] && t2[0] && t1[0] === t2[0]) sc += 45;
      if (t1.length >= 2 && t2.length >= 2 && t1[0] === t2[0] && t1[1] === t2[1]) sc += 35;
      let inter = 0;
      set1.forEach(w => { if (set2.has(w)) inter++; });
      sc += Math.round((inter / Math.max(1, set1.size + set2.size - inter)) * 100);
      if (Math.abs(t1.length - t2.length) <= 2) sc += 20;
      return { item: x, sc: sc + Math.random() * 4 };
    });

    scored.sort((a, b) => b.sc - a.sc);
    const dist = scored.slice(0, 3).map(s => s.item);
    return shuffle([q, ...dist]);
  };

  function buildFourOptions(q, localList, globalPool) {
    if (q && q.kind === "word") {
      return window.pickMinimalPairOptions(q, localList, globalPool, false);
    }
    if (q && q.kind === "sentence") {
      return window.pickSimilarSentenceOptions(q, localList, globalPool);
    }
    const targetKey = getItemText(q).toLowerCase();
    const seen = new Set([targetKey]);
    const dist = [];
    shuffle([...(localList || []), ...(globalPool || [])]).forEach(x => {
      const k = getItemText(x).toLowerCase();
      if (k && !seen.has(k) && dist.length < 3) {
        seen.add(k);
        dist.push(x);
      }
    });
    return shuffle([q, ...dist]);
  }

  function markAnswerResult(containerId, ok, clickedBtn) {
    const buttons = document.querySelectorAll(`#${containerId} button`);
    buttons.forEach(b => {
      b.disabled = true;
      if (b.dataset.correct === "1") {
        b.classList.add("border-emerald-500", "bg-emerald-50", "ring-2", "ring-emerald-300");
      }
    });
    if (!ok && clickedBtn) {
      clickedBtn.classList.add("border-rose-500", "bg-rose-50");
    }
  }

  // === 1. 閃卡活動（單字／發音／數字／節慶） ===
  window.showVocabCards = function(words) {
    cardList = words || [];
    cardIdx = 0;
    renderCardView();
  };

  function renderCardView() {
    const box = document.getElementById("vocab-content");
    if (!box || !cardList.length) return;
    const item = cardList[cardIdx];
    const word = getItemText(item);
    const meaning = getItemMeaning(item);

    const thumbsHtml = cardList.map((w, i) => `
      <button type="button" onclick="window._jumpNovaCard(${i})"
        class="px-2.5 py-1.5 rounded-xl text-xs font-black border transition ${i === cardIdx ? 'bg-sky-500 text-slate-950 border-sky-400' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-300'}">
        ${escapeHtml(getItemText(w))}
      </button>`).join("");

    box.innerHTML = `
      <div class="text-center">
        <div class="flex items-center justify-between mb-3">
          <span class="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-black">🃏 閃卡活動｜${escapeHtml(currentUnitKey)}</span>
          <span class="text-xs font-black text-slate-500">第 ${cardIdx + 1} / ${cardList.length} 張</span>
        </div>
        <div class="max-w-sm mx-auto p-5 rounded-3xl bg-gradient-to-b from-slate-50 to-white border-2 border-slate-200 shadow-sm">
          ${renderImgTag(item, "w-56 h-56 object-contain mx-auto rounded-2xl bg-white p-2 border border-slate-100 shadow-sm")}
          <div class="text-3xl font-black text-slate-900 mt-4">${escapeHtml(word)}</div>
          <div class="text-base font-bold text-slate-600 mt-1">${escapeHtml(meaning)}</div>
          <button type="button" onclick="window._playNovaCardAudio()" class="mt-4 px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm shadow">
            🔊 播放標準發音
          </button>
        </div>
        <div class="flex justify-center gap-3 mt-4">
          <button type="button" onclick="window._stepNovaCard(-1)" class="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 font-black text-xs">◀ 上一張</button>
          <button type="button" onclick="window._stepNovaCard(1)" class="px-4 py-2 rounded-xl bg-slate-800 text-white font-black text-xs">下一張 ▶</button>
        </div>
        <div class="mt-5 pt-4 border-t border-slate-100 flex flex-wrap justify-center gap-1.5">${thumbsHtml}</div>
      </div>`;
    playItemAudio(item);
  }

  window._jumpNovaCard = function(i) { cardIdx = i; renderCardView(); };
  window._stepNovaCard = function(d) { cardIdx = (cardIdx + d + cardList.length) % cardList.length; renderCardView(); };
  window._playNovaCardAudio = function() { playItemAudio(cardList[cardIdx]); };

  // === 2. 單元測驗：聽音辨圖 ===
  let liQueue = [], liIdx = 0, liScore = 0, liWrongs = [];
  window.startListenToImageQuiz = function(words) {
    liQueue = shuffle([...(words || [])]);
    liIdx = 0; liScore = 0; liWrongs = [];
    renderListenImageQ();
  };

  function renderListenImageQ() {
    const box = document.getElementById("vocab-content");
    if (!box) return;
    if (liIdx >= liQueue.length) {
      const pct = Math.round((liScore / Math.max(1, liQueue.length)) * 100);
      if (typeof triggerNovaCelebration === 'function') triggerNovaCelebration(pct);
      if (typeof triggerNovaCelebration === 'function') triggerNovaCelebration(pct);
  saveStudyRecord({ mode: "單元測驗：聽音辨圖", unit: currentUnitKey, score: liScore, correct: liScore, total: liQueue.length, wrongs: liWrongs });
      box.innerHTML = `
        <div class="text-center py-6">
          <div class="text-4xl font-black text-emerald-600">${pct} 分</div>
          <div class="text-sm font-bold text-slate-600 mt-1">聽音辨圖完成｜答對 ${liScore} / ${liQueue.length} 題</div>
          <div class="flex justify-center gap-2 mt-4"><button type="button" onclick="startListenToImageQuiz(currentVocabList)" class="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs">🔄 再測一次</button><button type="button" onclick="backToActiveUnitModal()" class="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-black text-xs">↩️ 回本單元選單</button></div>
        </div>`;
      return;
    }

    const q = liQueue[liIdx];
    const opts = window.pickMinimalPairOptions(q, liQueue, currentBook?.vocabulary, hasImage(q));

    box.innerHTML = `
      <div class="text-center">
        <div class="flex items-center justify-between mb-3">
          <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">🖼️ 聽音辨圖｜${escapeHtml(currentUnitKey)}</span>
          <span class="text-xs font-black text-slate-500">第 ${liIdx + 1} / ${liQueue.length} 題</span>
        </div>
        <p class="text-xs font-bold text-slate-500 mb-2">請聽語音，選出正確的圖片</p>
        <button type="button" onclick="window._replayListenImg()" class="mb-4 px-6 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm shadow">🔊 播放題目語音</button>
        <div class="grid grid-cols-2 gap-3 max-w-lg mx-auto" id="nova-li-opts">
          ${opts.map(opt => {
            const isOk = getItemText(opt) === getItemText(q);
            return `
            <button type="button" data-correct="${isOk ? '1' : '0'}" onclick="window._ansListenImg(${isOk}, this)"
              class="p-3 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-emerald-400 transition flex flex-col items-center justify-center min-h-[132px]">
              ${hasImage(opt)
                ? `<img src="${opt.image}" alt="" class="w-28 h-28 object-contain rounded-xl bg-white p-1" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" /><span style="display:none;" class="text-sm font-black text-slate-800">${escapeHtml(getItemText(opt))}</span>`
                : `<span class="text-base font-black text-slate-800">${escapeHtml(getItemText(opt))}</span>`}
            </button>`;
          }).join("")}
        </div>
      </div>`;
    playItemAudio(q);
  }

  window._replayListenImg = function() { playItemAudio(liQueue[liIdx]); };
  window._ansListenImg = function(ok, btn) {
    markAnswerResult("nova-li-opts", ok, btn);
    if (ok) liScore++;
    else liWrongs.push({ word: getItemText(liQueue[liIdx]), meaning: getItemMeaning(liQueue[liIdx]) });
    setTimeout(() => { liIdx++; renderListenImageQ(); }, ok ? 750 : 1300);
  };

  // === 3. 單元測驗：聽音辨字 ===
  let lwQueue = [], lwIdx = 0, lwScore = 0, lwWrongs = [];
  window.startListenToWordQuiz = function(words) {
    lwQueue = shuffle([...(words || [])]);
    lwIdx = 0; lwScore = 0; lwWrongs = [];
    renderListenWordQ();
  };

  function renderListenWordQ() {
    const box = document.getElementById("vocab-content");
    if (!box) return;
    if (lwIdx >= lwQueue.length) {
      const pct = Math.round((lwScore / Math.max(1, lwQueue.length)) * 100);
      if (typeof triggerNovaCelebration === 'function') triggerNovaCelebration(pct);
      if (typeof triggerNovaCelebration === 'function') triggerNovaCelebration(pct);
  saveStudyRecord({ mode: "單元測驗：聽音辨字", unit: currentUnitKey, score: lwScore, correct: lwScore, total: lwQueue.length, wrongs: lwWrongs });
      box.innerHTML = `
        <div class="text-center py-6">
          <div class="text-4xl font-black text-amber-600">${pct} 分</div>
          <div class="text-sm font-bold text-slate-600 mt-1">聽音辨字完成｜答對 ${lwScore} / ${lwQueue.length} 題</div>
          <div class="flex justify-center gap-2 mt-4"><button type="button" onclick="startListenToWordQuiz(currentVocabList)" class="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs">🔄 再測一次</button><button type="button" onclick="backToActiveUnitModal()" class="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-black text-xs">↩️ 回本單元選單</button></div>
        </div>`;
      return;
    }

    const q = lwQueue[lwIdx];
    const opts = buildFourOptions(q, lwQueue, currentBook?.vocabulary);

    box.innerHTML = `
      <div class="text-center">
        <div class="flex items-center justify-between mb-3">
          <span class="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black">🔤 聽音辨字｜${escapeHtml(currentUnitKey)}</span>
          <span class="text-xs font-black text-slate-500">第 ${lwIdx + 1} / ${lwQueue.length} 題</span>
        </div>
        <p class="text-xs font-bold text-slate-500 mb-2">請聽語音，選出正確的英文單字</p>
        <button type="button" onclick="window._replayListenWord()" class="mb-4 px-6 py-3 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm shadow">🔊 播放題目語音</button>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto" id="nova-lw-opts">
          ${opts.map(opt => {
            const isOk = getItemText(opt) === getItemText(q);
            return `
            <button type="button" data-correct="${isOk ? '1' : '0'}" onclick="window._ansListenWord(${isOk}, this)"
              class="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-amber-400 transition text-lg font-black text-slate-800">
              ${escapeHtml(getItemText(opt))}
            </button>`;
          }).join("")}
        </div>
      </div>`;
    playItemAudio(q);
  }

  window._replayListenWord = function() { playItemAudio(lwQueue[lwIdx]); };
  window._ansListenWord = function(ok, btn) {
    markAnswerResult("nova-lw-opts", ok, btn);
    if (ok) lwScore++;
    else lwWrongs.push({ word: getItemText(lwQueue[lwIdx]), meaning: getItemMeaning(lwQueue[lwIdx]) });
    setTimeout(() => { lwIdx++; renderListenWordQ(); }, ok ? 750 : 1300);
  };

  // === 4. 句型／課室用語／Daily Talk：閃卡活動 ===
  let stList = [], stIdx = 0;
  window.startSentencePractice = function(sentences) {
    stList = sentences || [];
    stIdx = 0;
    renderSentenceCard();
  };

  function renderSentenceCard() {
    const box = document.getElementById("sentence-content");
    if (!box || !stList.length) return;
    const item = stList[stIdx];
    box.innerHTML = `
      <div class="text-center max-w-xl mx-auto">
        <div class="flex items-center justify-between mb-3">
          <span class="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-black">🃏 句型閃卡｜${escapeHtml(currentUnitKey)}</span>
          <span class="text-xs font-black text-slate-500">第 ${stIdx + 1} / ${stList.length} 句</span>
        </div>
        <div class="p-6 rounded-3xl bg-gradient-to-b from-sky-50 to-white border-2 border-sky-200 shadow-sm">
          <div class="text-4xl mb-3">💬</div>
          <div class="text-xl sm:text-2xl font-black text-slate-900 leading-relaxed">${escapeHtml(getItemText(item))}</div>
          <div class="text-base font-bold text-slate-600 mt-2">${escapeHtml(getItemMeaning(item))}</div>
          <button type="button" onclick="window._playSentenceAudio()" class="mt-4 px-5 py-2.5 rounded-2xl bg-sky-500 text-slate-950 font-black text-sm shadow">🔊 播放整句語音</button>
        </div>
        <div class="flex justify-center gap-3 mt-4">
          <button type="button" onclick="window._stepSentence(-1)" class="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 font-black text-xs">◀ 上一句</button>
          <button type="button" onclick="window._stepSentence(1)" class="px-4 py-2 rounded-xl bg-slate-800 text-white font-black text-xs">下一句 ▶</button>
        </div>
      </div>`;
    playItemAudio(item);
  }

  window._playSentenceAudio = function() { playItemAudio(stList[stIdx]); };
  window._stepSentence = function(d) { stIdx = (stIdx + d + stList.length) % stList.length; renderSentenceCard(); };

  // === 5. 句型單元測驗：聽音辨句 ===
  let lsQueue = [], lsIdx = 0, lsScore = 0, lsWrongs = [];
  window.startListenToSentenceQuiz = function(sentences) {
    lsQueue = shuffle([...(sentences || [])]);
    lsIdx = 0; lsScore = 0; lsWrongs = [];
    renderListenSentenceQ();
  };

  function renderListenSentenceQ() {
    const box = document.getElementById("sentence-content");
    if (!box) return;
    if (lsIdx >= lsQueue.length) {
      const pct = Math.round((lsScore / Math.max(1, lsQueue.length)) * 100);
      if (typeof triggerNovaCelebration === 'function') triggerNovaCelebration(pct);
      if (typeof triggerNovaCelebration === 'function') triggerNovaCelebration(pct);
  saveStudyRecord({ mode: "單元測驗：聽音辨句", unit: currentUnitKey, score: lsScore, correct: lsScore, total: lsQueue.length, wrongs: lsWrongs });
      box.innerHTML = `
        <div class="text-center py-6">
          <div class="text-4xl font-black text-violet-600">${pct} 分</div>
          <div class="text-sm font-bold text-slate-600 mt-1">聽音辨句完成｜答對 ${lsScore} / ${lsQueue.length} 題</div>
          <div class="flex justify-center gap-2 mt-4"><button type="button" onclick="startListenToSentenceQuiz(currentSentenceList)" class="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-black text-xs">🔄 再測一次</button><button type="button" onclick="backToActiveUnitModal()" class="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-black text-xs">↩️ 回本單元選單</button></div>
        </div>`;
      return;
    }

    const q = lsQueue[lsIdx];
    const opts = buildFourOptions(q, lsQueue, currentBook?.allSentences);

    box.innerHTML = `
      <div class="text-center">
        <div class="flex items-center justify-between mb-3">
          <span class="px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-black">🎧 聽音辨句｜${escapeHtml(currentUnitKey)}</span>
          <span class="text-xs font-black text-slate-500">第 ${lsIdx + 1} / ${lsQueue.length} 題</span>
        </div>
        <p class="text-xs font-bold text-slate-500 mb-2">請聽語音，選出聽到的英文句子</p>
        <button type="button" onclick="window._replayListenSent()" class="mb-4 px-6 py-3 rounded-2xl bg-violet-600 text-white font-black text-sm shadow">🔊 播放整句語音</button>
        <div class="space-y-2.5 max-w-xl mx-auto" id="nova-ls-opts">
          ${opts.map(opt => {
            const isOk = getItemText(opt) === getItemText(q);
            return `
            <button type="button" data-correct="${isOk ? '1' : '0'}" onclick="window._ansListenSent(${isOk}, this)"
              class="w-full p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-violet-400 transition text-left font-black text-sm text-slate-800">
              ${escapeHtml(getItemText(opt))}
            </button>`;
          }).join("")}
        </div>
      </div>`;
    playItemAudio(q);
  }

  window._replayListenSent = function() { playItemAudio(lsQueue[lsIdx]); };
  window._ansListenSent = function(ok, btn) {
    markAnswerResult("nova-ls-opts", ok, btn);
    if (ok) lsScore++;
    else lsWrongs.push({ word: getItemText(lsQueue[lsIdx]), meaning: getItemMeaning(lsQueue[lsIdx]) });
    setTimeout(() => { lsIdx++; renderListenSentenceQ(); }, ok ? 750 : 1300);
  };

  // === 6. 句型單元測驗：聽音選中字 ===
  let lzQueue = [], lzIdx = 0, lzScore = 0, lzWrongs = [];
  window.startListenToChineseQuiz = function(sentences) {
    lzQueue = shuffle([...(sentences || [])]);
    lzIdx = 0; lzScore = 0; lzWrongs = [];
    renderListenZhQ();
  };

  function renderListenZhQ() {
    const box = document.getElementById("sentence-content");
    if (!box) return;
    if (lzIdx >= lzQueue.length) {
      const pct = Math.round((lzScore / Math.max(1, lzQueue.length)) * 100);
      if (typeof triggerNovaCelebration === 'function') triggerNovaCelebration(pct);
      if (typeof triggerNovaCelebration === 'function') triggerNovaCelebration(pct);
  saveStudyRecord({ mode: "單元測驗：聽音選中字", unit: currentUnitKey, score: lzScore, correct: lzScore, total: lzQueue.length, wrongs: lzWrongs });
      box.innerHTML = `
        <div class="text-center py-6">
          <div class="text-4xl font-black text-emerald-600">${pct} 分</div>
          <div class="text-sm font-bold text-slate-600 mt-1">聽音選中字完成｜答對 ${lzScore} / ${lzQueue.length} 題</div>
          <div class="flex justify-center gap-2 mt-4"><button type="button" onclick="startListenToChineseQuiz(currentSentenceList)" class="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs">🔄 再測一次</button><button type="button" onclick="backToActiveUnitModal()" class="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-black text-xs">↩️ 回本單元選單</button></div>
        </div>`;
      return;
    }

    const q = lzQueue[lzIdx];
    const opts = buildFourOptions(q, lzQueue, currentBook?.allSentences);

    box.innerHTML = `
      <div class="text-center">
        <div class="flex items-center justify-between mb-3">
          <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">🀄 聽音選中字｜${escapeHtml(currentUnitKey)}</span>
          <span class="text-xs font-black text-slate-500">第 ${lzIdx + 1} / ${lzQueue.length} 題</span>
        </div>
        <p class="text-xs font-bold text-slate-500 mb-2">請聽英文語音，選出正確的中文翻譯</p>
        <button type="button" onclick="window._replayListenZh()" class="mb-4 px-6 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm shadow">🔊 播放整句語音</button>
        <div class="space-y-2.5 max-w-xl mx-auto" id="nova-lz-opts">
          ${opts.map(opt => {
            const isOk = getItemText(opt) === getItemText(q);
            return `
            <button type="button" data-correct="${isOk ? '1' : '0'}" onclick="window._ansListenZh(${isOk}, this)"
              class="w-full p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-emerald-400 transition text-left font-black text-sm text-slate-800">
              ${escapeHtml(getItemMeaning(opt) || getItemText(opt))}
            </button>`;
          }).join("")}
        </div>
      </div>`;
    playItemAudio(q);
  }

  window._replayListenZh = function() { playItemAudio(lzQueue[lzIdx]); };
  window._ansListenZh = function(ok, btn) {
    markAnswerResult("nova-lz-opts", ok, btn);
    if (ok) lzScore++;
    else lzWrongs.push({ word: getItemText(lzQueue[lzIdx]), meaning: getItemMeaning(lzQueue[lzIdx]) });
    setTimeout(() => { lzIdx++; renderListenZhQ(); }, ok ? 750 : 1300);
  };
})();
