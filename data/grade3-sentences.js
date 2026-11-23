// data/grade3-sentences.js — NovaEdu 三年級綠洲星（3上/3下）多元化文法與問答聽力題庫（共 72 題，三版本全覆蓋）
window.NOVA_G3_QUESTIONS = [
  // ==================== 上學期：Get Ready / Starter & Unit 1（認識新朋友：姓名與年齡） ====================
  {
    id: "g3_up_u1_qal_01",
    grade: 3, semester: "上學期", unitIds: ["sentence_starter", "sentence_u1"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "認識新朋友（姓名與年齡）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "What's your name?", audioFile: "audio/whats_your_name.mp3",
    options: ["My name is Nova.", "I'm nine years old.", "I'm fine, thank you."],
    correctIndex: 0,
    hint: "聽到 name（名字）時，要回答自己的名字喔！",
    explanation: "What's your name? 詢問「你叫什麼名字？」，正確回答為 My name is... 或 I'm...。"
  },
  {
    id: "g3_up_u1_qal_02",
    grade: 3, semester: "上學期", unitIds: ["sentence_u1", "sentence_u2"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "認識新朋友（姓名與年齡）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "How old are you?", audioFile: "audio/how_old_are_you.mp3",
    options: ["My name is Leo.", "I'm ten years old.", "You're welcome."],
    correctIndex: 1,
    hint: "注意聽關鍵字 old！問幾歲要回答數字年齡喔！",
    explanation: "How old are you? 詢問年齡，正確回答為 I'm ten years old. 或 I'm ten.。"
  },
  {
    id: "g3_up_u1_blk_01",
    grade: 3, semester: "上學期", unitIds: ["sentence_starter", "sentence_u1"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "認識新朋友（姓名與年齡）",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "你叫什麼名字？",
    blocks: ["name", "What's", "your", "?"],
    answer: ["What's", "your", "name", "?"],
    hint: "大寫疑問詞 What's 放在最前面，問號放最後面！",
    explanation: "詢問名字的標準語序為 What's + your + name?"
  },
  {
    id: "g3_up_u1_blk_02",
    grade: 3, semester: "上學期", unitIds: ["sentence_u1", "sentence_u2"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "認識新朋友（姓名與年齡）",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "你幾歲？",
    blocks: ["you", "are", "How old", "?"],
    answer: ["How old", "are", "you", "?"],
    hint: "把問「幾歲」的積木 How old 放在第一位！",
    explanation: "詢問年齡的句型為 How old + are + you?"
  },
  {
    id: "g3_up_u1_blk_03",
    grade: 3, semester: "上學期", unitIds: ["sentence_u1", "sentence_u2"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "認識新朋友（姓名與年齡）",
    stage: ["practice"], type: "block_puzzle",
    promptZh: "我九歲。",
    blocks: ["years old", "I'm", "nine", "."],
    answer: ["I'm", "nine", "years old", "."],
    hint: "先說「我是 I'm」，再放數字，最後放 years old！",
    explanation: "表達年齡的完整句型為 I'm + 數字 + years old.。"
  },
  {
    id: "g3_up_u1_grm_01",
    grade: 3, semester: "上學期", unitIds: ["sentence_starter", "sentence_u1"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "認識新朋友（姓名與年齡）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "What's _____ name? — My name is Mia.",
    options: ["your", "my", "you"],
    correctIndex: 0,
    hint: "問對方「你的」名字，要用所有格 your 喔！",
    explanation: "詢問對方名字使用 your（你的），回答才用 my（我的）。"
  },
  {
    id: "g3_up_u1_grm_02",
    grade: 3, semester: "上學期", unitIds: ["sentence_u1", "sentence_u2"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "認識新朋友（姓名與年齡）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "How old _____ you? — I'm eight.",
    options: ["is", "am", "are"],
    correctIndex: 2,
    hint: "主詞是 you，好朋友 be 動詞要配哪一個呢？",
    explanation: "第二人稱 you 搭配的 be 動詞為 are。"
  },
  {
    id: "g3_up_u1_sit_01",
    grade: 3, semester: "上學期", unitIds: ["sentence_starter", "sentence_u1"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "認識新朋友（姓名與年齡）",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "你在太空站遇到新同學，他問你：“What's your name?” 你該怎麼回答？",
    speakerLine: "What's your name?",
    options: ["I'm Amy.", "I'm nine.", "It's a kite."],
    correctIndex: 0,
    hint: "對方在問你的名字，選出說出名字的句子！",
    explanation: "可用 I'm + 名字 或 My name is + 名字 回答。"
  },

  // ==================== 上學期：Unit 2 & Unit 4（心情與狀態：Be 動詞與形容詞） ====================
  {
    id: "g3_up_u2_qal_01",
    grade: 3, semester: "上學期", unitIds: ["sentence_u2", "sentence_u4"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "心情與狀態（Be 動詞與形容詞）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Are you hungry?", audioFile: "audio/are_you_hungry.mp3",
    options: ["Yes, I am.", "Yes, you are.", "Yes, it is."],
    correctIndex: 0,
    hint: "別人問 Are you...?（你……嗎？），回答要變成「我是 I am」喔！",
    explanation: "面對 Are you...? 的問句，肯定簡答必須轉換主詞為 Yes, I am.。"
  },
  {
    id: "g3_up_u2_qal_02",
    grade: 3, semester: "上學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "心情與狀態（Be 動詞與形容詞）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Are you tired?", audioFile: "audio/are_you_tired.mp3",
    options: ["No, I'm not. I'm sad.", "No, it isn't.", "No, I can't."],
    correctIndex: 0,
    hint: "注意聽問句開頭是 Are you，否定簡答要用 No, I'm not.！",
    explanation: "Are you tired? 的否定回答為 No, I'm not.，並可補充真實感受 I'm sad.。"
  },
  {
    id: "g3_up_u2_blk_01",
    grade: 3, semester: "上學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "心情與狀態（Be 動詞與形容詞）",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "你肚子餓嗎？",
    blocks: ["you", "hungry", "Are", "?"],
    answer: ["Are", "you", "hungry", "?"],
    hint: "把大寫的 Are 放到最前面變成問句！",
    explanation: "Be 動詞疑問句結構為 Are + you + 形容詞?"
  },
  {
    id: "g3_up_u2_blk_02",
    grade: 3, semester: "上學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "心情與狀態（Be 動詞與形容詞）",
    stage: ["practice"], type: "block_puzzle",
    promptZh: "不，我不是。我很難過。",
    blocks: ["I'm sad.", "No,", "I'm not."],
    answer: ["No,", "I'm not.", "I'm sad."],
    hint: "先說「不 No,」，再說「我不是 I'm not.」，最後補充心情！",
    explanation: "否定簡答後接肯定句說明狀態：No, I'm not. I'm sad."
  },
  {
    id: "g3_up_u2_grm_01",
    grade: 3, semester: "上學期", unitIds: ["sentence_u2", "sentence_u4"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "心情與狀態（Be 動詞與形容詞）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "Are you happy? — Yes, I _____.",
    options: ["am", "are", "is"],
    correctIndex: 0,
    hint: "主詞變成 I 了，後面要配哪一個 be 動詞？",
    explanation: "第一人稱單數 I 固定搭配 am，簡答不可縮寫。"
  },
  {
    id: "g3_up_u2_grm_02",
    grade: 3, semester: "上學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "心情與狀態（Be 動詞與形容詞）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "Look at Leo. _____ strong.",
    options: ["He's", "She's", "It's"],
    correctIndex: 0,
    hint: "Leo 是男生，要用代表「他是」的縮寫喔！",
    explanation: "男性單數主詞用 He's（He is）。"
  },
  {
    id: "g3_up_u2_sit_01",
    grade: 3, semester: "上學期", unitIds: ["sentence_u2", "sentence_u4"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "心情與狀態（Be 動詞與形容詞）",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "太空隊友打了個大哈欠，你問他：“Are you tired?” 他點點頭說：",
    speakerLine: "Are you tired?",
    options: ["Yes, I am.", "No, I'm not.", "I'm ten."],
    correctIndex: 0,
    hint: "點頭表示「是的」，用肯定簡答！",
    explanation: "肯定回答 Are you...? 為 Yes, I am.。"
  },

  // ==================== 上學期：Unit 3 & Unit 4（發現新物品：指示代名詞與顏色） ====================
  {
    id: "g3_up_u3_qal_01",
    grade: 3, semester: "上學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "發現新物品（指示代名詞與顏色）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "What's this?", audioFile: "audio/whats_this.mp3",
    options: ["It's a kite.", "It's red.", "I'm Ken."],
    correctIndex: 0,
    hint: "聽到 What's this?（這是什麼？），要回答「它是一個……」！",
    explanation: "What's this? 詢問近處物品名稱，應用 It's a/an + 物品 回答。"
  },
  {
    id: "g3_up_u3_qal_02",
    grade: 3, semester: "上學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "發現新物品（指示代名詞與顏色）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "What color is it?", audioFile: "audio/what_color_is_it.mp3",
    options: ["It's red.", "It's a robot.", "Yes, it is."],
    correctIndex: 0,
    hint: "聽到 color（顏色），答案裡一定要有顏色單字喔！",
    explanation: "What color is it? 詢問顏色，回答為 It's + 顏色形容詞。"
  },
  {
    id: "g3_up_u3_blk_01",
    grade: 3, semester: "上學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "發現新物品（指示代名詞與顏色）",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "那個是什麼？",
    blocks: ["that", "What's", "?"],
    answer: ["What's", "that", "?"],
    hint: "疑問詞 What's 放句首，指示代名詞 that 放後面！",
    explanation: "詢問遠處單數物品：What's that?"
  },
  {
    id: "g3_up_u3_blk_02",
    grade: 3, semester: "上學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "發現新物品（指示代名詞與顏色）",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "它是什麼顏色？",
    blocks: ["is", "What color", "it", "?"],
    answer: ["What color", "is", "it", "?"],
    hint: "把問「什麼顏色」的積木 What color 放在最前面！",
    explanation: "詢問物品顏色的標準語序為 What color + is + it?"
  },
  {
    id: "g3_up_u3_grm_01",
    grade: 3, semester: "上學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "發現新物品（指示代名詞與顏色）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "What's that? — It's _____ robot.",
    options: ["a", "an", "are"],
    correctIndex: 0,
    hint: "robot 的第一個字母 r 不是母音，要用哪一個冠詞？",
    explanation: "子音開頭的單數可數名詞前使用不定冠詞 a。"
  },
  {
    id: "g3_up_u3_grm_02",
    grade: 3, semester: "上學期", unitIds: ["sentence_u3", "sentence_u4"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "發現新物品（指示代名詞與顏色）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "What's this? — _____ a kite.",
    options: ["It's", "I'm", "He's"],
    correctIndex: 0,
    hint: "風箏是物品，要用代表「它是」的代名詞縮寫！",
    explanation: "指稱單數物品或動物使用 It's（It is）。"
  },
  {
    id: "g3_up_u3_sit_01",
    grade: 3, semester: "上學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "發現新物品（指示代名詞與顏色）",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "你撿到一顆發光的紅色星際寶石，隊友問：“What color is it?” 你回答：",
    speakerLine: "What color is it?",
    options: ["It's red.", "It's a pen.", "Thank you."],
    correctIndex: 0,
    hint: "直接用 It's + 顏色 回答就可以囉！",
    explanation: "詢問顏色時，答句為 It's + 顏色（不加 a/an）。"
  },

  // ==================== 上學期：常駐主題（課室用語與日常禮貌） ====================
  {
    id: "g3_up_cl_qal_01",
    grade: 3, semester: "上學期", unitIds: ["classroom_上學期", "daily_上學期"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "星際禮貌與指令（課室與日常）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Thank you.", audioFile: "audio/thank_you.mp3",
    options: ["You're welcome.", "I'm sorry.", "Sit down."],
    correctIndex: 0,
    hint: "別人對你說「謝謝你」，有禮貌的回答是「不客氣」喔！",
    explanation: "聽到 Thank you. 時，標準禮貌回應為 You're welcome.。"
  },
  {
    id: "g3_up_cl_qal_02",
    grade: 3, semester: "上學期", unitIds: ["daily_上學期"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "星際禮貌與指令（課室與日常）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Nice to meet you.", audioFile: "audio/nice_to_meet_you.mp3",
    options: ["Nice to meet you, too.", "Good job.", "Be quiet, please."],
    correctIndex: 0,
    hint: "別人說「很高興認識你」，記得在句尾加上 too（也）！",
    explanation: "Nice to meet you. 的回應為 Nice to meet you, too.。"
  },
  {
    id: "g3_up_cl_qal_03",
    grade: 3, semester: "上學期", unitIds: ["daily_上學期"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "星際禮貌與指令（課室與日常）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "How are you?", audioFile: "audio/how_are_you.mp3",
    options: ["I'm fine.", "I'm ten.", "My name is Ken."],
    correctIndex: 0,
    hint: "這句沒有 old！How are you? 是問「你好嗎？」，不是問幾歲喔！",
    explanation: "How are you? 問候近況，回答為 I'm fine. 或 I'm OK.。"
  },
  {
    id: "g3_up_cl_sit_01",
    grade: 3, semester: "上學期", unitIds: ["classroom_上學期"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "星際禮貌與指令（課室與日常）",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "上課鐘響了，同學們還在聊天，老師想請大家安靜下來，會說哪一句？",
    speakerLine: "Class begins!",
    options: ["Be quiet, please.", "Stand up.", "Open your book."],
    correctIndex: 0,
    hint: "quiet 是「安靜的」意思！",
    explanation: "Be quiet, please. 意為「請安靜。」"
  },
  {
    id: "g3_up_cl_sit_02",
    grade: 3, semester: "上學期", unitIds: ["daily_上學期"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "星際禮貌與指令（課室與日常）",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "你不小心把隊友的課本碰掉在地上，你應該趕快對他說什麼？",
    speakerLine: "Oh, no!",
    options: ["I'm sorry.", "You're welcome.", "Good job."],
    correctIndex: 0,
    hint: "做錯事或不小心撞到人時要說「對不起」！",
    explanation: "道歉用語為 I'm sorry.，對方可回答 It's OK.。"
  },
  {
    id: "g3_up_cl_blk_01",
    grade: 3, semester: "上學期", unitIds: ["classroom_上學期"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "星際禮貌與指令（課室與日常）",
    stage: ["practice"], type: "block_puzzle",
    promptZh: "舉起你的手。",
    blocks: ["hand", "Raise", "your", "."],
    answer: ["Raise", "your", "hand", "."],
    hint: "動作「舉起 Raise」放在最前面！",
    explanation: "課室指令祈使句以原形動詞開頭：Raise your hand."
  },

  // ==================== 下學期：Unit 1（物品與冠詞 a/an ＋ 單數動物確認 Is it a...?） ====================
  {
    id: "g3_dn_u1_qal_01",
    grade: 3, semester: "下學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "發現新物品（指示代名詞與顏色）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "What's that?", audioFile: "audio/whats_that.mp3",
    options: ["It's an eraser.", "Yes, it is.", "I'm fine."],
    correctIndex: 0,
    hint: "聽到 What's that?（那是什麼？），要回答它是什麼文具喔！",
    explanation: "What's that? 詢問遠處物品，回答為 It's an eraser.。"
  },
  {
    id: "g3_dn_u1_qal_02",
    grade: 3, semester: "下學期", unitIds: ["sentence_u1", "sentence_u3"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "猜猜看是什麼（單數物品確認）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Is it a cat?", audioFile: "audio/is_it_a_cat.mp3",
    options: ["No, it's not. It's a dog.", "Yes, I am.", "No, I can't."],
    correctIndex: 0,
    hint: "問句用 Is it...? 開頭，回答也要用 it 喔！",
    explanation: "Is it a cat? 詢問動物，可用 Yes, it is. 或 No, it's not. It's a dog. 回答。"
  },
  {
    id: "g3_dn_u1_blk_01",
    grade: 3, semester: "下學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "發現新物品（指示代名詞與顏色）",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "它是一塊橡皮擦。",
    blocks: ["eraser", "It's", "an", "."],
    answer: ["It's", "an", "eraser", "."],
    hint: "先放「它是 It's」，再放母音專用的 an，最後放橡皮擦！",
    explanation: "母音開頭的單字 eraser 前面須搭配 an。"
  },
  {
    id: "g3_dn_u1_blk_02",
    grade: 3, semester: "下學期", unitIds: ["sentence_u1", "sentence_u3"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "猜猜看是什麼（單數物品確認）",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "牠是一隻熊嗎？",
    blocks: ["a bear", "it", "Is", "?"],
    answer: ["Is", "it", "a bear", "?"],
    hint: "大寫的 Is 放在最前面，後面接著 it！",
    explanation: "確認單數動物／物品的問句語序：Is + it + a/an + 名詞?"
  },
  {
    id: "g3_dn_u1_grm_01",
    grade: 3, semester: "下學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "發現新物品（指示代名詞與顏色）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "What's this? — It's _____ eraser.",
    options: ["a", "an", "am"],
    correctIndex: 1,
    hint: "eraser 第一個字母是 e（母音 a, e, i, o, u），要選 an 喔！",
    explanation: "母音開頭單字前使用 an，子音開頭才用 a。"
  },
  {
    id: "g3_dn_u1_grm_02",
    grade: 3, semester: "下學期", unitIds: ["sentence_u1", "sentence_u3"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "猜猜看是什麼（單數物品確認）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "Is that a dog? — Yes, _____ is.",
    options: ["it", "that", "I"],
    correctIndex: 0,
    hint: "問句用 this 或 that 問動物時，簡答要改用哪個代名詞？",
    explanation: "英語習慣在簡答中將 this / that 統一改為 it（Yes, it is.）。"
  },
  {
    id: "g3_dn_u1_sit_01",
    grade: 3, semester: "下學期", unitIds: ["sentence_u1", "sentence_u3"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "猜猜看是什麼（單數物品確認）",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "你在草叢看到一隻猴子，隊友猜：“Is it a bear?” 你搖搖頭說：",
    speakerLine: "Is it a bear?",
    options: ["No, it isn't. It's a monkey.", "Yes, it is.", "It's red."],
    correctIndex: 0,
    hint: "不是熊，是猴子！選出否定回答並說出 monkey 的句子。",
    explanation: "否定簡答 No, it isn't. 後接正確答案 It's a monkey.。"
  },

  // ==================== 下學期：Unit 2 & Unit 4（超能力測試：情態助動詞 Can） ====================
  {
    id: "g3_dn_u2_qal_01",
    grade: 3, semester: "下學期", unitIds: ["sentence_u2", "sentence_u4"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "超能力測試（情態助動詞 Can）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Can you dance?", audioFile: "audio/can_you_dance.mp3",
    options: ["Yes, I can.", "Yes, I am.", "Yes, it is."],
    correctIndex: 0,
    hint: "聽到 Can you...? 開頭，回答最後面也要有 can 喔！",
    explanation: "Can you...? 詢問能力，肯定簡答為 Yes, I can.。"
  },
  {
    id: "g3_dn_u2_qal_02",
    grade: 3, semester: "下學期", unitIds: ["sentence_u2", "sentence_u4"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "超能力測試（情態助動詞 Can）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Can you sing?", audioFile: "audio/can_you_sing.mp3",
    options: ["No, I can't.", "No, I'm not.", "No, he isn't."],
    correctIndex: 0,
    hint: "問句用 Can 開頭，否定簡答就是 No, I can't.！",
    explanation: "Can you sing? 的否定回答為 No, I can't.。"
  },
  {
    id: "g3_dn_u2_blk_01",
    grade: 3, semester: "下學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "超能力測試（情態助動詞 Can）",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "你會跳舞嗎？",
    blocks: ["you", "dance", "Can", "?"],
    answer: ["Can", "you", "dance", "?"],
    hint: "把大寫的 Can 放到句首，後面依序放「你」和「跳舞」！",
    explanation: "詢問能力問句語序：Can + you + 原形動詞?"
  },
  {
    id: "g3_dn_u2_blk_02",
    grade: 3, semester: "下學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "超能力測試（情態助動詞 Can）",
    stage: ["practice"], type: "block_puzzle",
    promptZh: "不，我不會。",
    blocks: ["I", "No,", "can't", "."],
    answer: ["No,", "I", "can't", "."],
    hint: "先放 No, 再放主詞 I，最後放 can't！",
    explanation: "情態助動詞 can 的否定簡答為 No, I can't.。"
  },
  {
    id: "g3_dn_u2_grm_01",
    grade: 3, semester: "下學期", unitIds: ["sentence_u2", "sentence_u4"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "超能力測試（情態助動詞 Can）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "_____ you sing? — Yes, I can.",
    options: ["Can", "Are", "Is"],
    correctIndex: 0,
    hint: "看後面的答句有 can，問句開頭也要用同一個字喔！",
    explanation: "答句為 Yes, I can.，問句開頭必為助動詞 Can。"
  },
  {
    id: "g3_dn_u2_sit_01",
    grade: 3, semester: "下學期", unitIds: ["sentence_u2", "sentence_u4"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "超能力測試（情態助動詞 Can）",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "星際才藝大賽開始了，評審問你：“Can you sing?” 你超會唱歌，自信地回答：",
    speakerLine: "Can you sing?",
    options: ["Yes, I can.", "No, I can't.", "It's a pen."],
    correctIndex: 0,
    hint: "「是的，我會」的英文是 Yes, I can.！",
    explanation: "肯定自己具備某項能力時，用 Yes, I can. 回答。"
  },

  // ==================== 下學期：Unit 3 & Unit 4（家人與職業：Who 與 He/She） ====================
  {
    id: "g3_dn_u3_qal_01",
    grade: 3, semester: "下學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "家人與職業（Who 與 He/She）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Who's he?", audioFile: "audio/whos_he.mp3",
    options: ["He's my father.", "She's my mother.", "It's a bear."],
    correctIndex: 0,
    hint: "注意聽問句裡的 he（男生），回答也要用 He's 開頭喔！",
    explanation: "Who's he? 詢問男性身分，回答為 He's my father.。"
  },
  {
    id: "g3_dn_u3_qal_02",
    grade: 3, semester: "下學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "家人與職業（Who 與 He/She）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Who's she?", audioFile: "audio/whos_she.mp3",
    options: ["She's my mother.", "He's my father.", "Yes, she is."],
    correctIndex: 0,
    hint: "聽到 she（女生），要回答「她是我的媽媽」喔！",
    explanation: "Who's she? 詢問女性身分，回答為 She's my mother.。"
  },
  {
    id: "g3_dn_u4_qal_01",
    grade: 3, semester: "下學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "家人與職業（Who 與 He/She）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Is he a teacher?", audioFile: "audio/is_he_a_teacher.mp3",
    options: ["Yes, he is.", "Yes, she is.", "Yes, I am."],
    correctIndex: 0,
    hint: "問句問 Is he...?（他是……嗎？），回答要用 he is！",
    explanation: "確認男性職業的肯定簡答為 Yes, he is.。"
  },
  {
    id: "g3_dn_u4_qal_02",
    grade: 3, semester: "下學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "家人與職業（Who 與 He/She）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Is she a nurse?", audioFile: "audio/is_she_a_nurse.mp3",
    options: ["No, she's not.", "No, he's not.", "No, I can't."],
    correctIndex: 0,
    hint: "問句主角是女生 she，否定簡答要用 she's not！",
    explanation: "Is she a nurse? 的否定簡答為 No, she's not. 或 No, she isn't.。"
  },
  {
    id: "g3_dn_u3_blk_01",
    grade: 3, semester: "下學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "家人與職業（Who 與 He/She）",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "他是誰？",
    blocks: ["he", "Who's", "?"],
    answer: ["Who's", "he", "?"],
    hint: "問「是誰 Who's」放最前面，後面放男生代名詞 he！",
    explanation: "詢問男性身分的句型：Who's he?"
  },
  {
    id: "g3_dn_u4_blk_01",
    grade: 3, semester: "下學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "家人與職業（Who 與 He/She）",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "她是護理師嗎？",
    blocks: ["she", "Is", "a nurse", "?"],
    answer: ["Is", "she", "a nurse", "?"],
    hint: "大寫的 Is 放第一位，後面放女生代名詞 she！",
    explanation: "確認職業問句語序：Is + she + a/an + 職業?"
  },
  {
    id: "g3_dn_u4_grm_01",
    grade: 3, semester: "下學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "家人與職業（Who 與 He/She）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "Is he _____ teacher? — Yes, he is.",
    options: ["a", "an", "am"],
    correctIndex: 0,
    hint: "英文裡說出單數職業（老師）前面一定要加冠詞 a 喔！",
    explanation: "英文職業名詞為可數名詞，單數前須加不定冠詞 a/an（a teacher）。"
  },
  {
    id: "g3_dn_u3_grm_02",
    grade: 3, semester: "下學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "家人與職業（Who 與 He/She）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "Who's she? — _____ my mother.",
    options: ["She's", "He's", "It's"],
    correctIndex: 0,
    hint: "mother（媽媽）是女性，要用「她是 She's」喔！",
    explanation: "女性家人對應主詞 she，縮寫為 She's。"
  },

  // ==================== 下學期：常駐主題（課室用語與日常對話） ====================
  {
    id: "g3_dn_cl_qal_01",
    grade: 3, semester: "下學期", unitIds: ["daily_下學期"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "星際禮貌與指令（課室與日常）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Are you ready?", audioFile: "audio/are_you_ready.mp3",
    options: ["Yes!", "Sorry, I'm late.", "Good idea."],
    correctIndex: 0,
    hint: "太空船要起飛了！問「你準備好了嗎？」，準備好就大聲說 Yes!！",
    explanation: "Are you ready? 詢問是否準備完成，回答為 Yes! 或 Yes, I am.。"
  },
  {
    id: "g3_dn_cl_qal_02",
    grade: 3, semester: "下學期", unitIds: ["daily_下學期"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "星際禮貌與指令（課室與日常）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "I have an idea.", audioFile: "audio/i_have_an_idea.mp3",
    options: ["Good idea.", "See you.", "Stop!"],
    correctIndex: 0,
    hint: "朋友說「我有個主意」，讚美他的主意很棒要說 Good idea.！",
    explanation: "聽到 I have an idea. 時，常用 Good idea.（好主意。）回應。"
  },
  {
    id: "g3_dn_cl_sit_01",
    grade: 3, semester: "下學期", unitIds: ["classroom_下學期"], examHalf: "midterm",
    editions: ["Super", "Wonder", "Here"], topic: "星際禮貌與指令（課室與日常）",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "老師唸完一句英文，想請全班同學「跟著老師唸一遍」，會說哪一句？",
    speakerLine: "Listen carefully!",
    options: ["Repeat after me.", "Put away your book.", "Goodbye."],
    correctIndex: 0,
    hint: "repeat 是「重複」的意思！",
    explanation: "Repeat after me. 意為「跟著我唸。」"
  },
  {
    id: "g3_dn_cl_sit_02",
    grade: 3, semester: "下學期", unitIds: ["daily_下學期"], examHalf: "final",
    editions: ["Super", "Wonder", "Here"], topic: "星際禮貌與指令（課室與日常）",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "你進教室時已經打鐘遲到了，推開門應該禮貌地對老師說：",
    speakerLine: "Come in, please.",
    options: ["Sorry, I'm late.", "Here you are.", "Hurry up!"],
    correctIndex: 0,
    hint: "late 是「遲到」的意思！",
    explanation: "遲到時的禮貌用語為 Sorry, I'm late.。"
  }
];
