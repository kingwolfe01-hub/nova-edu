// js/self-exam.js — NovaEdu v11 月球 4 大自學測驗站（整合單元卷、分層期中/期末考卷、快捷自挑卷、真實聽力題型）
let selfExamQueue = [];
let selfExamIndex = 0;
let selfExamScore = 0;
let selfExamWrongs = [];
let selfExamTitle = "";
let activeExamAudioObj = null;

function examMatchesEdition(it) {
  return (typeof matchesGlobalEdition === "function") ? matchesGlobalEdition(it) : true;
}

function stopExamPlaybackAudio() {
  if ("speechSynthesis" in window) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
  if (activeExamAudioObj) {
    try { activeExamAudioObj.pause(); activeExamAudioObj.currentTime = 0; } catch (e) {}
    activeExamAudioObj = null;
  }
}

function buildExamGroups() {
  const all = currentBook?.unitCatalog || [];
  const groups = [];

  for (let i = 1; i <= 4; i++) {
    const vU = all.find(u => u.id === `vocab_u${i}`);
    const sU = all.find(u => u.id === `sentence_u${i}`);
    if (vU || sU) {
      const words = (vU?.words || []).filter(examMatchesEdition);
      const sentences = (sU?.sentences || []).filter(examMatchesEdition);
      groups.push({
        id: `grp_u${i}`,
        title: `📘 Unit ${i}（單字＋句型）`,
        examHalf: i <= 2 ? "midterm" : "final",
        category: "unit",
        words,
        sentences
      });
    }
  }

  all.forEach(u => {
    if (/^vocab_u[1-4]$|^sentence_u[1-4]$/.test(u.id)) return;
    groups.push({
      id: `grp_${u.id}`,
      title: `${u.badgeIcon} ${u.title}`,
      examHalf: u.examHalf || "midterm",
      category: u.category,
      words: (u.words || []).filter(examMatchesEdition),
      sentences: (u.sentences || []).filter(examMatchesEdition)
    });
  });
  return groups;
}

function switchExamSemester(semName) {
  if (typeof switchPlanetSemester === "function") {
    switchPlanetSemester(semName);
    renderSelfExamHub();
  }
}

function renderSelfExamHub() {
  if (!currentBook) return;
  stopExamPlaybackAudio();
  document.getElementById("self-exam-hub").style.display = "block";
  document.getElementById("self-exam-runner").style.display = "none";
  document.getElementById("self-exam-result").style.display = "none";

  const gradeSemTag = `[${currentBook.grade}${currentBook.semester}]`;
  const scopeEl = document.getElementById("exam-scope-banner");
  if (scopeEl) {
    const allowedSems = (typeof getAllowedSemesterSet === "function") ? getAllowedSemesterSet() : new Set(["上學期", "下學期"]);
    const isUp = currentBook.semester === "上學期";
    scopeEl.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-black">${escapeHtml(currentBook.grade)}・${escapeHtml(currentBook.semester)}</span>
        <span class="text-xs font-black text-slate-700">${escapeHtml(currentBook.planetName)} 測驗範圍</span>
      </div>
      <div class="flex gap-1.5">
        <button type="button" onclick="switchExamSemester('上學期')" class="px-3 py-1.5 rounded-xl text-xs font-black border ${isUp ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm' : (allowedSems.has('上學期') ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-100 text-slate-400 border-slate-200')}">${isUp ? '☀️ ' : (allowedSems.has('上學期') ? '' : '🔒 ')}上學期</button>
        <button type="button" onclick="switchExamSemester('下學期')" class="px-3 py-1.5 rounded-xl text-xs font-black border ${!isUp ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm' : (allowedSems.has('下學期') ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-100 text-slate-400 border-slate-200')}">${!isUp ? '☀️ ' : (allowedSems.has('下學期') ? '' : '🔒 ')}下學期</button>
      </div>`;
  }

  const groups = buildExamGroups();
  const unitSel = document.getElementById("exam-unit-select");
  if (unitSel) {
    const avail = groups.map((g, idx) => ({ g, idx, cnt: g.words.length + g.sentences.length })).filter(x => x.cnt > 0);
    unitSel.innerHTML = avail.length
      ? avail.map(x => `<option value="${x.idx}">${escapeHtml(gradeSemTag)} ${escapeHtml(x.g.title)} (${x.cnt} 題庫)</option>`).join("")
      : `<option value="-1">此版本本學期無可用題庫</option>`;
  }

  const customBox = document.getElementById("exam-custom-checkboxes");
  if (customBox) {
    customBox.innerHTML = groups.map((g, idx) => {
      const cnt = g.words.length + g.sentences.length;
      if (cnt === 0) {
        return `
      <label class="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold opacity-45 cursor-not-allowed">
        <input type="checkbox" disabled class="custom-unit-chk-disabled" />
        <span class="text-slate-400">${escapeHtml(gradeSemTag)} ${escapeHtml(g.title)} (0)</span>
      </label>`;
      }
      return `
      <label class="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold cursor-pointer hover:border-sky-400">
        <input type="checkbox" class="custom-unit-chk" data-half="${g.examHalf}" value="${idx}" checked />
        <span><span class="text-sky-700 font-black">${escapeHtml(gradeSemTag)}</span> ${escapeHtml(g.title)} <span class="text-slate-400">(${cnt})</span></span>
      </label>`;
    }).join("");
  }
}

function selectCustomExamPreset(preset) {
  document.querySelectorAll(".custom-unit-chk").forEach(chk => {
    if (preset === "all") chk.checked = true;
    else if (preset === "none") chk.checked = false;
    else if (preset === "midterm") chk.checked = chk.dataset.half === "midterm";
    else if (preset === "final") chk.checked = chk.dataset.half === "final";
  });
}

function collectPoolFromGroups(groups, typeFilter) {
  const pool = [];
  (groups || []).forEach(g => {
    if (typeFilter !== "sentence") {
      (g.words || []).forEach(w => pool.push({ ...w, _type: "word", _cat: g.category }));
    }
    if (typeFilter !== "word") {
      (g.sentences || []).forEach(s => pool.push({ ...s, _type: "sentence", _cat: g.category }));
    }
  });
  return pool;
}

function stratifiedPick(pool, count, targets) {
  const vocabPool = shuffle(pool.filter(x => x._type === "word" && x._cat !== "phonics"));
  const phonicsPool = shuffle(pool.filter(x => x._type === "word" && x._cat === "phonics"));
  const sentPool = shuffle(pool.filter(x => x._type === "sentence"));

  const picked = [];
  const used = new Set();
  function take(arr, n) {
    for (const item of arr) {
      if (picked.length >= count || n <= 0) break;
      const k = getItemText(item).toLowerCase();
      if (!used.has(k)) {
        used.add(k);
        picked.push(item);
        n--;
      }
    }
  }
  take(vocabPool, targets.vocab);
  take(phonicsPool, targets.phonics);
  take(sentPool, targets.sentence);

  if (picked.length < count) {
    take(shuffle(pool), count - picked.length);
  }
  return shuffle(picked);
}

function startSelfExam(examMode) {
  if (!currentBook) return;
  const groups = buildExamGroups();
  let queue = [];

  if (examMode === "unit") {
    const idx = Number(document.getElementById("exam-unit-select")?.value || 0);
    const g = groups[idx];
    const pool = collectPoolFromGroups(g ? [g] : [], "all");
    const edTag = currentEditionFilter === "ALL" ? "" : `[${currentEditionFilter}] `;
    selfExamTitle = `${edTag}單元卷：${g?.title || ""}`;
    queue = shuffle(pool).slice(0, Math.min(15, pool.length));
  } else if (examMode === "midterm") {
    const midGroups = groups.filter(g => g.examHalf === "midterm");
    const pool = collectPoolFromGroups(midGroups.length ? midGroups : groups, "all");
    const edTag = currentEditionFilter === "ALL" ? "" : `[${currentEditionFilter}] `;
    selfExamTitle = `${edTag}${currentBook.planetName}（${currentBook.semester}）期中考卷｜U1–U2＋期中發音/數字`;
    queue = stratifiedPick(pool, Math.min(20, pool.length), { vocab: 8, phonics: 6, sentence: 6 });
  } else if (examMode === "final") {
    const finGroups = groups.filter(g => g.examHalf === "final");
    const pool = collectPoolFromGroups(finGroups.length ? finGroups : groups, "all");
    const edTag = currentEditionFilter === "ALL" ? "" : `[${currentEditionFilter}] `;
    selfExamTitle = `${edTag}${currentBook.planetName}（${currentBook.semester}）期末考卷｜U3–U4＋期末發音/節慶`;
    queue = stratifiedPick(pool, Math.min(25, pool.length), { vocab: 10, phonics: 7, sentence: 8 });
  } else if (examMode === "custom") {
    const checked = [...document.querySelectorAll(".custom-unit-chk:checked")].map(el => groups[Number(el.value)]).filter(Boolean);
    if (!checked.length) return alert("請至少勾選 1 個單元！");
    const typeFilter = document.getElementById("exam-custom-type")?.value || "all";
    const pool = collectPoolFromGroups(checked, typeFilter);
    const reqCount = Number(document.getElementById("exam-custom-count")?.value || 20);
    const edTag = currentEditionFilter === "ALL" ? "" : `[${currentEditionFilter}] `;
    selfExamTitle = `${edTag}自挑單元卷（已選 ${checked.length} 單元）`;
    queue = shuffle(pool).slice(0, Math.min(reqCount, pool.length));
  }

  if (!queue.length) return alert("所選範圍目前沒有符合題型的題目，請改選其他單元或題型！");

  // Assign authentic sub-mode per question (listen_image / listen_word / listen_sentence / listen_zh)
  let rawExamItems = queue.map((item, i) => {
    if (item._type === "word") {
      const subMode = (hasImage(item) && i % 2 === 0) ? "listen_image" : "listen_word";
      return { ...item, _subMode: subMode };
    }
    return { ...item, _subMode: i % 2 === 0 ? "listen_sentence" : "listen_zh" };
  });

  if (typeof Grade3QuizEngine !== "undefined" && ["planet2", "planet3", "planet4", "planet5", "planet6"].includes(currentBook?.planetId)) {
    const selectedIds = examMode === "unit"
      ? [groups[Number(document.getElementById("exam-unit-select")?.value || 0)]?.id]
      : (examMode === "custom" ? [...document.querySelectorAll(".custom-unit-chk:checked")].map(el => groups[Number(el.value)]?.id) : []);
    const g3Extra = Grade3QuizEngine.getExamQuestionsForBook(currentBook, examMode, selectedIds);
    if (g3Extra.length) {
      rawExamItems = [...rawExamItems.slice(0, Math.max(4, rawExamItems.length - g3Extra.length)), ...g3Extra];
    }
  }

  // Group same question types into structured exam sections (大題制：同類題連續作答，大題內隨機)
  const EXAM_SECTIONS = [
    { key: "sec_img", title: "聽音辨圖", desc: "請聽語音，選出正確的圖片", match: q => !q._isG3Rich && q._subMode === "listen_image" },
    { key: "sec_word", title: "聽音辨字", desc: "請聽語音，選出正確的英文單字", match: q => !q._isG3Rich && q._subMode === "listen_word" },
    { key: "sec_sent", title: "聽音辨句與句意", desc: "請聽整句語音，選出對應句子或中文", match: q => !q._isG3Rich && (q._subMode === "listen_sentence" || q._subMode === "listen_zh") },
    { key: "sec_qal", title: "問答聽力測驗", desc: "請聽問句廣播，選出最合理的答句", match: q => q._isG3Rich && q.type === "qa_listening" },
    { key: "sec_grm", title: "情境對話與文法測驗", desc: "請閱讀情境與句子，選出最正確的選項", match: q => q._isG3Rich && (q.type === "situational_qa" || q.type === "grammar_blank") },
    { key: "sec_blk", title: "句子重組測驗", desc: "請依序點擊積木，排成正確的英文句子", match: q => q._isG3Rich && q.type === "block_puzzle" }
  ];
  const CN_NUMS = ["一", "二", "三", "四", "五", "六", "七"];
  const sectionedQueue = [];
  let activeSecNo = 0;
  EXAM_SECTIONS.forEach(sec => {
    const matched = shuffle(rawExamItems.filter(sec.match));
    if (matched.length) {
      const secLabel = `第${CN_NUMS[activeSecNo] || (activeSecNo + 1)}大題｜${sec.title}`;
      matched.forEach((item, idxInSec) => {
        sectionedQueue.push({
          ...item,
          _sectionTitle: secLabel,
          _sectionDesc: sec.desc,
          _sectionIndex: idxInSec + 1,
          _sectionTotal: matched.length,
          _isFirstInSection: idxInSec === 0
        });
      });
      activeSecNo++;
    }
  });
  selfExamQueue = sectionedQueue.length ? sectionedQueue : rawExamItems;

  selfExamIndex = 0;
  selfExamScore = 0;
  selfExamWrongs = [];

  document.getElementById("self-exam-hub").style.display = "none";
  document.getElementById("self-exam-runner").style.display = "block";
  document.getElementById("self-exam-result").style.display = "none";
  renderSelfExamQuestion();
}

function renderSelfExamQuestion() {
  if (selfExamIndex >= selfExamQueue.length) {
    finishSelfExam();
    return;
  }
  const q = selfExamQueue[selfExamIndex];
  document.getElementById("exam-runner-title").innerText = selfExamTitle;
  document.getElementById("exam-runner-progress").innerText = `總進度 第 ${selfExamIndex + 1} / ${selfExamQueue.length} 題`;

  let secBanner = document.getElementById("exam-section-banner");
  if (!secBanner) {
    const runnerEl = document.getElementById("self-exam-runner");
    const hdrRow = runnerEl?.firstElementChild;
    if (hdrRow) {
      secBanner = document.createElement("div");
      secBanner.id = "exam-section-banner";
      hdrRow.insertAdjacentElement("afterend", secBanner);
    }
  }
  if (secBanner && q._sectionTitle) {
    secBanner.className = q._isFirstInSection
      ? "p-3 rounded-2xl bg-indigo-600 text-white flex flex-wrap items-center justify-between gap-2 shadow-sm animate__animated animate__fadeIn"
      : "p-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 flex flex-wrap items-center justify-between gap-2";
    secBanner.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="px-2.5 py-0.5 rounded-lg text-xs font-black ${q._isFirstInSection ? "bg-amber-400 text-slate-950" : "bg-indigo-600 text-white"}">${escapeHtml(q._sectionTitle)}</span>
        <span class="text-xs font-bold ${q._isFirstInSection ? "text-indigo-100" : "text-slate-600"}">${q._isFirstInSection ? "🔔 接下來都是同類題型！｜" : ""}${escapeHtml(q._sectionDesc || "")}</span>
      </div>
      <span class="text-xs font-black ${q._isFirstInSection ? "text-amber-300" : "text-indigo-700"}">本大題第 ${q._sectionIndex} / ${q._sectionTotal} 題</span>`;
  }

  const replayBtn = document.querySelector("#self-exam-runner button[onclick='replayCurrentExamAudio()']");
  if (replayBtn) replayBtn.style.display = "inline-block";

  if (q._isG3Rich) {
    renderG3RichExamQuestion(q);
    return;
  }

  const imgBox = document.getElementById("exam-question-image");
  if (imgBox) {
    // Only show hint icon/placeholder (do not leak answer text or image in listen_image/listen_word!)
    imgBox.innerHTML = `<div class="w-24 h-24 mx-auto rounded-2xl bg-sky-50 border-2 border-sky-200 flex items-center justify-center text-4xl shadow-inner">${q._subMode === "listen_image" ? "🖼️" : (q._type === "word" ? "🔤" : "🎧")}</div>`;
  }

  const promptMap = {
    listen_image: "【聽音辨圖】請聽語音，選出正確的圖片（最小配對干擾）",
    listen_word: "【聽音辨字】請聽語音，選出正確的英文單字（最小配對干擾）",
    listen_sentence: "【聽音辨句】請聽語音，選出聽到的英文句子（高擬真相似句）",
    listen_zh: "【聽音選中字】請聽語音，選出正確的中文句意"
  };
  const promptEl = document.getElementById("exam-question-prompt");
  if (promptEl) promptEl.innerText = promptMap[q._subMode] || "請聽語音作答";

  const fullPool = currentBook.unitCatalog.flatMap(u => q._type === "word" ? (u.words || []) : (u.sentences || []));
  const options = (q._type === "word" && typeof window.pickMinimalPairOptions === "function")
    ? window.pickMinimalPairOptions(q, fullPool, currentBook?.vocabulary, q._subMode === "listen_image")
    : (q._type === "sentence" && typeof window.pickSimilarSentenceOptions === "function")
      ? window.pickSimilarSentenceOptions(q, fullPool, currentBook?.allSentences)
      : shuffle([q, ...shuffle(fullPool.filter(x => getItemText(x) !== getItemText(q))).slice(0, 3)]);

  const optEl = document.getElementById("exam-question-options");
  if (optEl) {
    optEl.innerHTML = options.map(opt => {
      const isCorrect = getItemText(opt) === getItemText(q);
      if (q._subMode === "listen_image") {
        return `<button type="button" data-correct="${isCorrect ? '1' : '0'}" onclick="answerSelfExam(${isCorrect}, this)" class="p-3 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-sky-400 transition flex flex-col items-center justify-center min-h-[128px]">
          ${hasImage(opt)
            ? `<img src="${opt.image}" alt="" class="w-28 h-28 object-contain rounded-xl bg-white p-1" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" /><span style="display:none;" class="text-sm font-black text-slate-800">${escapeHtml(getItemText(opt))}</span>`
            : `<span class="text-base font-black text-slate-800">${escapeHtml(getItemText(opt))}</span>`}
        </button>`;
      }
      const label = q._subMode === "listen_zh" ? (getItemMeaning(opt) || getItemText(opt)) : getItemText(opt);
      return `<button type="button" data-correct="${isCorrect ? '1' : '0'}" onclick="answerSelfExam(${isCorrect}, this)" class="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-sky-400 font-black text-sm text-left transition">${escapeHtml(label)}</button>`;
    }).join("");
  }

  playExamAudio(q);
}

function playExamAudio(q) {
  stopExamPlaybackAudio();
  if (!q) return;
  if (q.audio) {
    try {
      activeExamAudioObj = new Audio(q.audio);
      activeExamAudioObj.play().catch(() => speakText(getItemText(q)));
      return;
    } catch (e) {}
  }
  speakText(getItemText(q));
}

function replayCurrentExamAudio() {
  const q = selfExamQueue[selfExamIndex];
  if (q) playExamAudio(q);
}

function answerSelfExam(isCorrect, btn) {
  const q = selfExamQueue[selfExamIndex];
  document.querySelectorAll("#exam-question-options button").forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === "1") {
      b.classList.add("bg-emerald-50", "border-emerald-500", "text-emerald-800", "ring-2", "ring-emerald-300");
    }
  });
  if (isCorrect) {
    selfExamScore++;
  } else {
    if (btn) btn.classList.add("bg-rose-50", "border-rose-500", "text-rose-800");
    selfExamWrongs.push({ word: getItemText(q), meaning: getItemMeaning(q) });
  }
  const delayMs = isCorrect ? 750 : (q?.type === "block_puzzle" ? 1800 : 1300);
  setTimeout(() => {
    selfExamIndex++;
    renderSelfExamQuestion();
  }, delayMs);
}

function finishSelfExam() {
  stopExamPlaybackAudio();
  document.getElementById("self-exam-runner").style.display = "none";
  document.getElementById("self-exam-result").style.display = "block";

  const total = selfExamQueue.length || 1;
  const pct = Math.round((selfExamScore / total) * 100);
  const stars = pct >= 90 ? "⭐⭐⭐ 太神啦！" : (pct >= 70 ? "⭐⭐ 表現很棒！" : "⭐ 繼續加油！");
  const starEl = document.getElementById("exam-result-stars");
  if (starEl) starEl.innerText = stars;
  const scoreEl = document.getElementById("exam-result-score");
  if (scoreEl) scoreEl.innerText = `${pct} 分（答對 ${selfExamScore} / ${total} 題）`;
  const tipEl = document.getElementById("exam-upload-tip");
  if (tipEl) tipEl.innerText = `${selfExamTitle}｜成績已自動儲存至學習報告`;

  const wrongEl = document.getElementById("exam-result-wrongs");
  if (wrongEl) {
    wrongEl.innerHTML = selfExamWrongs.length
      ? selfExamWrongs.map(w => `<div class="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">${escapeHtml(w.word)} — ${escapeHtml(w.meaning)}</div>`).join("")
      : `<div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-700">🎉 全數答對！太棒了！</div>`;
  }

  if (typeof triggerNovaCelebration === "function") triggerNovaCelebration(pct);
  saveStudyRecord({
    mode: selfExamTitle,
    unit: currentBook?.title || "自學測驗",
    score: selfExamScore,
    correct: selfExamScore,
    total,
    wrongWords: selfExamWrongs.map(w => w.word),
    wrongs: selfExamWrongs
  });
}


// 三年級進階題型於「4大自學模擬測驗（無即時提示擬真考卷）」的專用渲染
let examBuiltBlocks = [];
let examPoolBlocks = [];
let examPuzzleLocked = false;

function shuffleExamPuzzleBlocks(blocks, answer) {
  const arr = [...(blocks || [])];
  if (arr.length <= 1) return arr;
  let out = shuffle(arr);
  for (let t = 0; t < 5 && Array.isArray(answer) && out.length === answer.length && out.every((v, i) => v === answer[i]); t++) {
    out = shuffle(arr);
  }
  return out;
}

function renderG3RichExamQuestion(q) {
  const imgBox = document.getElementById("exam-question-image");
  const promptEl = document.getElementById("exam-question-prompt");
  const optEl = document.getElementById("exam-question-options");
  const replayBtn = document.querySelector("#self-exam-runner button[onclick='replayCurrentExamAudio()']");
  if (replayBtn) replayBtn.style.display = (q.type === "qa_listening") ? "inline-block" : "none";

  const typeTitles = {
    qa_listening: "【問答聽力】請聽問句語音，選出最合理的答句",
    grammar_blank: "【文法綜合挖空】請選出最適合填入空格的單字",
    situational_qa: "【情境對話反應】請根據情境選出正確回應",
    block_puzzle: "【句子重組測驗】請依序點擊積木排成正確句子"
  };
  if (promptEl) promptEl.innerText = typeTitles[q.type] || "請作答";

  if (q.type === "qa_listening") {
    if (imgBox) imgBox.innerHTML = `<div class="w-24 h-24 mx-auto rounded-2xl bg-violet-50 border-2 border-violet-200 flex items-center justify-center text-4xl">🗣️</div>`;
    if (optEl) {
      optEl.innerHTML = q.options.map((opt, idx) => {
        const isOk = idx === q.correctIndex;
        return `<button type="button" data-correct="${isOk ? '1' : '0'}" onclick="answerSelfExam(${isOk}, this)" class="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-violet-400 font-black text-sm text-left transition">${String.fromCharCode(65 + idx)}. ${escapeHtml(opt)}</button>`;
      }).join("");
    }
    playExamAudio({ audio: q.audioFile, word: q.promptAudio });
  } else if (q.type === "grammar_blank") {
    if (imgBox) imgBox.innerHTML = `<div class="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-lg font-black text-slate-900 max-w-lg mx-auto">${escapeHtml(q.sentence)}</div>`;
    if (optEl) {
      optEl.innerHTML = q.options.map((opt, idx) => {
        const isOk = idx === q.correctIndex;
        return `<button type="button" data-correct="${isOk ? '1' : '0'}" onclick="answerSelfExam(${isOk}, this)" class="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-400 font-black text-base text-center transition">${escapeHtml(opt)}</button>`;
      }).join("");
    }
  } else if (q.type === "situational_qa") {
    if (imgBox) imgBox.innerHTML = `<div class="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 text-xs font-bold text-slate-800 max-w-lg mx-auto text-left">${escapeHtml(q.situationZh)}</div>`;
    if (optEl) {
      optEl.innerHTML = q.options.map((opt, idx) => {
        const isOk = idx === q.correctIndex;
        return `<button type="button" data-correct="${isOk ? '1' : '0'}" onclick="answerSelfExam(${isOk}, this)" class="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-sky-400 font-black text-sm text-left transition">${String.fromCharCode(65 + idx)}. ${escapeHtml(opt)}</button>`;
      }).join("");
    }
  } else if (q.type === "block_puzzle") {
    examPuzzleLocked = false;
    examBuiltBlocks = [];
    examPoolBlocks = shuffleExamPuzzleBlocks(q.blocks, q.answer).map((t, i) => ({ id: i, text: t, used: false }));
    if (imgBox) imgBox.innerHTML = `<div class="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-base font-black text-indigo-950 max-w-lg mx-auto">中文題意：${escapeHtml(q.promptZh)}</div>`;
    if (optEl) {
      optEl.innerHTML = `
        <div class="col-span-full space-y-3">
          <div id="exam-pz-ans" class="min-h-[52px] p-3 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-wrap justify-center gap-2"></div>
          <div id="exam-pz-pool" class="flex flex-wrap justify-center gap-2"></div>
          <div class="flex justify-center gap-2">
            <button id="exam-pz-reset-btn" type="button" onclick="resetExamPuzzle()" class="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-black text-xs">↩️ 清除</button>
            <button id="exam-pz-check-btn" type="button" disabled onclick="submitExamPuzzle()" class="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs opacity-45 cursor-not-allowed">✅ 確認送出</button>
          </div>
          <div id="exam-pz-feedback" style="display:none;" class="p-3 rounded-2xl text-xs font-bold text-left max-w-lg mx-auto"></div>
        </div>`;
      renderExamPuzzleUI();
    }
  }
}

function renderExamPuzzleUI() {
  const aEl = document.getElementById("exam-pz-ans");
  const pEl = document.getElementById("exam-pz-pool");
  if (!aEl || !pEl) return;
  aEl.innerHTML = examBuiltBlocks.length
    ? examBuiltBlocks.map((b, i) => `<button type="button" ${examPuzzleLocked ? "disabled" : ""} onclick="removeExamPuzzleBlock(${i})" class="px-3 py-1.5 rounded-xl bg-sky-600 text-white font-black text-sm">${escapeHtml(b.text)}</button>`).join("")
    : `<span class="text-xs font-bold text-slate-400">請點擊下方積木組出句子</span>`;
  pEl.innerHTML = examPoolBlocks.map((b, i) => `<button type="button" ${(b.used || examPuzzleLocked) ? "disabled" : ""} onclick="pickExamPuzzleBlock(${i})" class="px-3 py-1.5 rounded-xl border-2 font-black text-sm ${(b.used || examPuzzleLocked) ? "opacity-30 bg-slate-100 cursor-not-allowed" : "bg-white border-indigo-300 text-indigo-950"}">${escapeHtml(b.text)}</button>`).join("");

  const resetBtn = document.getElementById("exam-pz-reset-btn");
  if (resetBtn) resetBtn.disabled = examPuzzleLocked;
  const checkBtn = document.getElementById("exam-pz-check-btn");
  if (checkBtn) {
    const ready = !examPuzzleLocked && examBuiltBlocks.length === examPoolBlocks.length && examPoolBlocks.length > 0;
    checkBtn.disabled = !ready;
    checkBtn.className = ready
      ? "px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs"
      : "px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs opacity-45 cursor-not-allowed";
  }
}
function pickExamPuzzleBlock(i) { if (examPuzzleLocked) return; if (examPoolBlocks[i] && !examPoolBlocks[i].used) { examPoolBlocks[i].used = true; examBuiltBlocks.push(examPoolBlocks[i]); renderExamPuzzleUI(); } }
function removeExamPuzzleBlock(i) { if (examPuzzleLocked) return; const r = examBuiltBlocks.splice(i, 1)[0]; if (r) r.used = false; renderExamPuzzleUI(); }
function resetExamPuzzle() { if (examPuzzleLocked) return; examBuiltBlocks = []; examPoolBlocks.forEach(b => b.used = false); renderExamPuzzleUI(); }
function submitExamPuzzle() {
  const q = selfExamQueue[selfExamIndex];
  if (examPuzzleLocked || !q || examBuiltBlocks.length < examPoolBlocks.length) return;
  examPuzzleLocked = true;
  const userSeq = examBuiltBlocks.map(b => b.text);
  const ok = userSeq.length === q.answer.length && userSeq.every((t, i) => t === q.answer[i]);
  renderExamPuzzleUI();

  const aEl = document.getElementById("exam-pz-ans");
  if (aEl) {
    aEl.classList.remove("bg-slate-100", "border-slate-300", "border-dashed");
    aEl.classList.add(...(ok ? ["bg-emerald-50", "border-emerald-500"] : ["bg-rose-50", "border-rose-400"]));
  }
  const fullSentence = q.answer.join(" ").replace(/\s+([?.!])/g, "$1");
  const fbEl = document.getElementById("exam-pz-feedback");
  if (fbEl) {
    fbEl.style.display = "block";
    fbEl.className = ok
      ? "p-3 rounded-2xl bg-emerald-50 border border-emerald-400 text-emerald-900 text-xs font-bold text-left max-w-lg mx-auto"
      : "p-3 rounded-2xl bg-rose-50 border border-rose-400 text-rose-900 text-xs font-bold text-left max-w-lg mx-auto";
    fbEl.innerHTML = ok
      ? `✅ 答對了！正確句子：<b>${escapeHtml(fullSentence)}</b>`
      : `❌ 正確答案：<b>${escapeHtml(fullSentence)}</b>`;
  }
  answerSelfExam(ok, null);
}
