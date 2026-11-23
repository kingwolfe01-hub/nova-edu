// data/grade4-sentences.js — NovaEdu 四年級蔚藍星（上／下學期 64 題分級互動題庫）
window.NOVA_G4_QUESTIONS = [
  // ==================== 上學期 Unit 1（人物身分 / 天氣） ====================
  {
    id: "g4_up_u1_qal_01",
    grade: 4, semester: "上學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Super"], topic: "人物身分與天氣（Who / How's the weather）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Who's he?",
    options: ["He's my father.", "She's my mother.", "It's sunny."],
    correctIndex: 0,
    hint: "問句用男生代名詞 he，回答也要用 He's！",
    explanation: "Who's he?（他是誰？）對應回答 He's my father."
  },
  {
    id: "g4_up_u1_qal_02",
    grade: 4, semester: "上學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Wonder", "Here"], topic: "人物身分與天氣（Who / How's the weather）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "How's the weather?",
    options: ["It's sunny and warm.", "I'm in the living room.", "Yes, it is."],
    correctIndex: 0,
    hint: "How's the weather? 是詢問天氣，請選天氣形容詞！",
    explanation: "詢問天氣用 How's the weather?，回答 It's sunny and warm."
  },
  {
    id: "g4_up_u1_blk_01",
    grade: 4, semester: "上學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Super"], topic: "人物身分與天氣（Who / How's the weather）",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "他是我的爸爸。",
    blocks: ["father", "my", "He's", "."],
    answer: ["He's", "my", "father", "."],
    hint: "先放主詞與動詞縮寫 He's，再放 my father！",
    explanation: "介紹男性家人句型：He's + my + 家人稱謂。"
  },
  {
    id: "g4_up_u1_blk_02",
    grade: 4, semester: "上學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Here"], topic: "人物身分與天氣（Who / How's the weather）",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "天氣下雨又涼爽。",
    blocks: ["and", "It's", "cool", "rainy", "."],
    answer: ["It's", "rainy", "and", "cool", "."],
    hint: "先說 It's，再用 and 連接兩個天氣形容詞！",
    explanation: "描述雙重天氣特徵：It's + 形容詞 1 + and + 形容詞 2。"
  },
  {
    id: "g4_up_u1_grm_01",
    grade: 4, semester: "上學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Super"], topic: "人物身分與天氣（Who / How's the weather）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "Who's _____? — She's my mother.",
    options: ["he", "she", "it"],
    correctIndex: 1,
    hint: "答句說 She's my mother，代表問的是女生喔！",
    explanation: "女性第三人稱單數代名詞為 she。"
  },
  {
    id: "g4_up_u1_grm_02",
    grade: 4, semester: "上學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Wonder", "Here"], topic: "人物身分與天氣（Who / How's the weather）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "_____ is the weather? — It's sunny.",
    options: ["Who", "Where", "How"],
    correctIndex: 2,
    hint: "詢問天氣「如何」要用疑問詞 How！",
    explanation: "詢問天氣固定搭配疑問詞 How：How is / How's the weather?"
  },
  {
    id: "g4_up_u1_sit_01",
    grade: 4, semester: "上學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Wonder", "Here"], topic: "人物身分與天氣（Who / How's the weather）",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "出門前你想知道外面天氣冷不冷，要怎麼問家人？",
    speakerLine: "",
    options: ["How's the weather?", "Where are you?", "What time is it?"],
    correctIndex: 0,
    hint: "問天氣的固定句型是 How's...！",
    explanation: "想知道外頭天氣狀況應詢問 How's the weather?"
  },
  {
    id: "g4_up_u1_sit_02",
    grade: 4, semester: "上學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Super"], topic: "人物身分與天氣（Who / How's the weather）",
    stage: ["practice"], type: "situational_qa",
    situationZh: "朋友指著照片裡的女生問你是誰，你要介紹那是你的媽媽：",
    speakerLine: "Who's she?",
    options: ["She's my mother.", "He's my father.", "It's a turtle."],
    correctIndex: 0,
    hint: "用 She's 開頭介紹女性家人！",
    explanation: "回應 Who's she? 應使用 She's my + 稱謂。"
  },

  // ==================== 上學期 Unit 2（職業 / 時間 / 口渴） ====================
  {
    id: "g4_up_u2_qal_01",
    grade: 4, semester: "上學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Super"], topic: "職業確認、時間與狀態",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Is he a doctor?",
    options: ["Yes, he is.", "No, she isn't.", "Yes, I am."],
    correctIndex: 0,
    hint: "用 Is he...? 提問，肯定簡答也要用 he is！",
    explanation: "Is he...? 的肯定簡答為 Yes, he is."
  },
  {
    id: "g4_up_u2_qal_02",
    grade: 4, semester: "上學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Wonder"], topic: "職業確認、時間與狀態",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "What time is it?",
    options: ["It's twelve thirty.", "It's sunny.", "I'm thirsty."],
    correctIndex: 0,
    hint: "What time is it? 是問現在幾點鐘！",
    explanation: "詢問時間用 What time is it?，回答 It's + 數字時間。"
  },
  {
    id: "g4_up_u2_blk_01",
    grade: 4, semester: "上學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Super"], topic: "職業確認、時間與狀態",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "不，她不是。她是位老師。",
    blocks: ["she", "isn't.", "No,", "She's", "a teacher."],
    answer: ["No,", "she", "isn't.", "She's", "a teacher."],
    hint: "先放否定簡答 No, she isn't.，再接 She's a teacher.！",
    explanation: "否定簡答後補充正確職業：No, she isn't. She's a teacher."
  },
  {
    id: "g4_up_u2_blk_02",
    grade: 4, semester: "上學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Wonder"], topic: "職業確認、時間與狀態",
    stage: ["practice"], type: "block_puzzle",
    promptZh: "現在是十二點鐘。",
    blocks: ["o'clock", "It's", "twelve", "."],
    answer: ["It's", "twelve", "o'clock", "."],
    hint: "It's 放句首，整點 o'clock 放數字後面！",
    explanation: "整點時間表達為 It's + 數字 + o'clock."
  },
  {
    id: "g4_up_u2_grm_01",
    grade: 4, semester: "上學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Super"], topic: "職業確認、時間與狀態",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "Is she a nurse? — No, she _____.",
    options: ["is", "isn't", "aren't"],
    correctIndex: 1,
    hint: "前面有 No, 而且主詞是單數 she，要選否定縮寫！",
    explanation: "she 搭配 Be 動詞否定簡答為 isn't。"
  },
  {
    id: "g4_up_u2_grm_02",
    grade: 4, semester: "上學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Here"], topic: "職業確認、時間與狀態",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "_____ you thirsty? — Yes, I am.",
    options: ["Is", "Am", "Are"],
    correctIndex: 2,
    hint: "主詞是 you，Be 動詞一定要搭配 Are！",
    explanation: "第二人稱 you 搭配 Be 動詞 Are。"
  },
  {
    id: "g4_up_u2_sit_01",
    grade: 4, semester: "上學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Super"], topic: "職業確認、時間與狀態",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "你在醫院看到一位穿白袍的女士，想確認她是不是護理師：",
    speakerLine: "",
    options: ["Is she a nurse?", "Is he a doctor?", "Are you thirsty?"],
    correctIndex: 0,
    hint: "對方是女性且要確認職業是不是 nurse！",
    explanation: "確認女性是否為護理師：Is she a nurse?"
  },
  {
    id: "g4_up_u2_sit_02",
    grade: 4, semester: "上學期", unitIds: ["classroom_上學期"], examHalf: "midterm",
    editions: ["Super", "Here"], topic: "課室指令與禮貌",
    stage: ["practice"], type: "situational_qa",
    situationZh: "測驗時間結束了，老師在講台上提醒大家停筆：",
    speakerLine: "Time's up.",
    options: ["Show me your homework.", "Don't run.", "Thank you."],
    correctIndex: 0,
    hint: "老師收卷或檢查作業時常會接著說什麼？",
    explanation: "Time's up.（時間到）後常見課室銜接語為 Show me your homework."
  },

  // ==================== 上學期 Unit 3（房間位置 / 物品歸屬） ====================
  {
    id: "g4_up_u3_qal_01",
    grade: 4, semester: "上學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Super"], topic: "居家房間與位置（Where + in）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Where's Ken?",
    options: ["He's in the kitchen.", "She's in the bathroom.", "I'm in the living room."],
    correctIndex: 0,
    hint: "Ken 是男生，所以要用 He's 回答他在哪個房間！",
    explanation: "詢問單一男性位置 Where's Ken?，回答 He's in the kitchen."
  },
  {
    id: "g4_up_u3_qal_02",
    grade: 4, semester: "上學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Wonder"], topic: "居家房間與位置（Where + in）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Is this your pencil?",
    options: ["Yes, it is.", "Yes, I am.", "He's in the kitchen."],
    correctIndex: 0,
    hint: "問句主詞是 this（單數物品），簡答要用 it！",
    explanation: "Is this...? 問單數物品，肯定簡答用 Yes, it is."
  },
  {
    id: "g4_up_u3_blk_01",
    grade: 4, semester: "上學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Super"], topic: "居家房間與位置（Where + in）",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "我在客廳裡。",
    blocks: ["the", "I'm", "living room", "in", "."],
    answer: ["I'm", "in", "the", "living room", "."],
    hint: "先放 I'm，再用介系詞 in the 接房間名稱！",
    explanation: "表達人在某房間內：I'm + in the + 房間。"
  },
  {
    id: "g4_up_u3_blk_02",
    grade: 4, semester: "上學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Super"], topic: "居家房間與位置（Where + in）",
    stage: ["practice"], type: "block_puzzle",
    promptZh: "你媽媽在哪裡？",
    blocks: ["your", "Where's", "mom", "?"],
    answer: ["Where's", "your", "mom", "?"],
    hint: "疑問詞 Where's 放最前面，後面放 your mom！",
    explanation: "詢問家人位置：Where's + your + 稱謂?"
  },
  {
    id: "g4_up_u3_grm_01",
    grade: 4, semester: "上學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Super"], topic: "居家房間與位置（Where + in）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "Where's your mom? — She's _____ the bathroom.",
    options: ["in", "on", "to"],
    correctIndex: 0,
    hint: "在「房間裡面」要使用介系詞 in！",
    explanation: "在室內空間（如 bathroom, kitchen）搭配介系詞 in。"
  },
  {
    id: "g4_up_u3_grm_02",
    grade: 4, semester: "上學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Super"], topic: "居家房間與位置（Where + in）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "Where _____ you? — I'm in the living room.",
    options: ["is", "am", "are"],
    correctIndex: 2,
    hint: "主詞是 you，Be 動詞要用 are！",
    explanation: "Where are you? 是詢問對方位置的固定句型。"
  },
  {
    id: "g4_up_u3_sit_01",
    grade: 4, semester: "上學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Super"], topic: "居家房間與位置（Where + in）",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "回到家發現媽媽不在客廳，你想問爸爸「媽媽在哪裡？」：",
    speakerLine: "",
    options: ["Where's my mom?", "Who's she?", "What's that?"],
    correctIndex: 0,
    hint: "詢問人在哪裡要用 Where's...！",
    explanation: "詢問位置應使用疑問詞 Where。"
  },
  {
    id: "g4_up_u3_sit_02",
    grade: 4, semester: "上學期", unitIds: ["daily_上學期"], examHalf: "final",
    editions: ["Super"], topic: "日常禮貌對話",
    stage: ["practice"], type: "situational_qa",
    situationZh: "你進教室時發現已經上課遲到了，應該對老師說什麼？",
    speakerLine: "",
    options: ["Sorry, I'm late.", "Have a seat, please.", "It's tea time."],
    correctIndex: 0,
    hint: "遲到時要先跟老師道歉！",
    explanation: "Sorry, I'm late. 意為「抱歉，我遲到了。」"
  },

  // ==================== 上學期 Unit 4（擁有寵物 / 介系詞 / 點餐） ====================
  {
    id: "g4_up_u4_qal_01",
    grade: 4, semester: "上學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Super"], topic: "寵物與喜好（Do you have / want）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Do you have a turtle?",
    options: ["No, I don't. I have a dog.", "Yes, it is.", "It's under the chair."],
    correctIndex: 0,
    hint: "Do you...? 開頭的問句，要用 I do 或 I don't 回答！",
    explanation: "Do you have...? 的否定回答為 No, I don't. I have..."
  },
  {
    id: "g4_up_u4_qal_02",
    grade: 4, semester: "上學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Here"], topic: "寵物與喜好（Do you have / want）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Do you want some pizza?",
    options: ["No, thank you. I want some juice.", "Yes, I have a turtle.", "He's in the kitchen."],
    correctIndex: 0,
    hint: "對方問你要不要吃披薩，回答禮貌拒絕並說想喝果汁！",
    explanation: "回應 Do you want some...? 禮貌拒絕可說 No, thank you. I want..."
  },
  {
    id: "g4_up_u4_blk_01",
    grade: 4, semester: "上學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Wonder"], topic: "物品方位（in / on / under）",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "它在椅子底下。",
    blocks: ["the", "under", "It's", "chair", "."],
    answer: ["It's", "under", "the", "chair", "."],
    hint: "先放 It's，再放方位介系詞 under，最後放 the chair！",
    explanation: "表達物品在下方：It's + under + the + 名詞。"
  },
  {
    id: "g4_up_u4_blk_02",
    grade: 4, semester: "上學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Super"], topic: "寵物與喜好（Do you have / want）",
    stage: ["practice"], type: "block_puzzle",
    promptZh: "你養烏龜嗎？",
    blocks: ["you", "a turtle", "Do", "have", "?"],
    answer: ["Do", "you", "have", "a turtle", "?"],
    hint: "助動詞 Do 放句首，接著放主詞 you 和動詞 have！",
    explanation: "一般動詞疑問句語序：Do + you + 原形動詞 + 受詞?"
  },
  {
    id: "g4_up_u4_grm_01",
    grade: 4, semester: "上學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Super"], topic: "寵物與喜好（Do you have / want）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "Do you have a turtle? — Yes, I _____.",
    options: ["am", "do", "does"],
    correctIndex: 1,
    hint: "用 Do 問，主詞是 I，簡答就用 do！",
    explanation: "Do you...? 的肯定簡答為 Yes, I do."
  },
  {
    id: "g4_up_u4_grm_02",
    grade: 4, semester: "上學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Here"], topic: "寵物與喜好（Do you have / want）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "No, thank you. I _____ some juice.",
    options: ["want", "wants", "am"],
    correctIndex: 0,
    hint: "主詞是 I（第一人稱），動詞不需要加 s！",
    explanation: "主詞 I 搭配原形動詞 want。"
  },
  {
    id: "g4_up_u4_sit_01",
    grade: 4, semester: "上學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Here"], topic: "寵物與喜好（Do you have / want）",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "朋友問你要不要吃披薩，你剛好非常想吃，應該禮貌回答：",
    speakerLine: "Do you want some pizza?",
    options: ["Yes, please.", "No, I don't.", "It's under the chair."],
    correctIndex: 0,
    hint: "接受別人的招待時要說「好的，麻煩你」！",
    explanation: "接受招待時的禮貌回覆為 Yes, please."
  },
  {
    id: "g4_up_u4_sit_02",
    grade: 4, semester: "上學期", unitIds: ["festival_上學期_1"], examHalf: "final",
    editions: ["Super", "Wonder"], topic: "節慶文化（Halloween）",
    stage: ["practice"], type: "situational_qa",
    situationZh: "萬聖節晚上你和朋友去鄰居家按門鈴要糖果時，大家會一起喊：",
    speakerLine: "",
    options: ["Trick or treat!", "Happy Dragon Boat Festival!", "Time's up!"],
    correctIndex: 0,
    hint: "「不給糖就搗蛋」的英文怎麼說？",
    explanation: "Trick or treat! 是萬聖節要糖果的經典用語。"
  },

  // ==================== 下學期 Unit 1（複數指示代名詞 / 居家位置） ====================
  {
    id: "g4_dn_u1_qal_01",
    grade: 4, semester: "下學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Super"], topic: "複數指示代名詞（these / those）",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "What are these?",
    options: ["They're robots.", "It's a robot.", "He's in the bedroom."],
    correctIndex: 0,
    hint: "these 是複數（這些），回答要用 They're + 複數名詞！",
    explanation: "What are these/those? 回答時主詞一律用 They're + 複數名詞。"
  },
  {
    id: "g4_dn_u1_qal_02",
    grade: 4, semester: "下學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Wonder"], topic: "居家房間與位置",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Where's Kevin?",
    options: ["He's in the dining room.", "They're yo-yos.", "I'm reading."],
    correctIndex: 0,
    hint: "Kevin 是男生，回答他在哪個房間要用 He's in...！",
    explanation: "詢問單一男性位置，回答用 He's in the + 房間。"
  },
  {
    id: "g4_dn_u1_blk_01",
    grade: 4, semester: "下學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Super"], topic: "複數指示代名詞（these / those）",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "那些是什麼？",
    blocks: ["those", "are", "What", "?"],
    answer: ["What", "are", "those", "?"],
    hint: "疑問詞 What 放句首，複數 Be 動詞 are 接在後面！",
    explanation: "詢問遠處複數物品：What + are + those?"
  },
  {
    id: "g4_dn_u1_blk_02",
    grade: 4, semester: "下學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Wonder"], topic: "居家房間與位置",
    stage: ["practice"], type: "block_puzzle",
    promptZh: "我在臥室裡。",
    blocks: ["bedroom", "in", "I'm", "the", "."],
    answer: ["I'm", "in", "the", "bedroom", "."],
    hint: "先說 I'm，再接介系詞片語 in the bedroom！",
    explanation: "表達自己在臥室：I'm in the bedroom."
  },
  {
    id: "g4_dn_u1_grm_01",
    grade: 4, semester: "下學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Super"], topic: "複數指示代名詞（these / those）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "What are these? — _____ robots.",
    options: ["It's", "They're", "She's"],
    correctIndex: 1,
    hint: "問句用複數 these，答句開頭也要用複數 They're！",
    explanation: "複數物品回答應使用 They're（They are）。"
  },
  {
    id: "g4_dn_u1_grm_02",
    grade: 4, semester: "下學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Super"], topic: "複數指示代名詞（these / those）",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "What _____ those? — They're yo-yos.",
    options: ["is", "am", "are"],
    correctIndex: 2,
    hint: "those 代表複數「那些」，所以 Be 動詞要用 are！",
    explanation: "複數指示代名詞 these / those 須搭配 are。"
  },
  {
    id: "g4_dn_u1_sit_01",
    grade: 4, semester: "下學期", unitIds: ["sentence_u1"], examHalf: "midterm",
    editions: ["Super"], topic: "複數指示代名詞（these / those）",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "桌上放著好幾個新機器人玩具，你手指著近處的它們問媽媽是什麼：",
    speakerLine: "",
    options: ["What are these?", "What's this?", "Where are the robots?"],
    correctIndex: 0,
    hint: "近處而且有好幾個（複數），要用 these 喔！",
    explanation: "詢問近處複數物品用 What are these?"
  },
  {
    id: "g4_dn_u1_sit_02",
    grade: 4, semester: "下學期", unitIds: ["classroom_下學期"], examHalf: "midterm",
    editions: ["Super", "Here"], topic: "課室用語",
    stage: ["practice"], type: "situational_qa",
    situationZh: "桌遊剛玩完你這一輪，你要提醒下一位同學「輪到你了」：",
    speakerLine: "",
    options: ["It's your turn.", "Watch out.", "Wait a minute."],
    correctIndex: 0,
    hint: "「輪到你了」的英文固定說法是 It's your...！",
    explanation: "It's your turn. 意為「輪到你了。」"
  },

  // ==================== 下學期 Unit 2（物品單複數方位 / 正在做什麼） ====================
  {
    id: "g4_dn_u2_qal_01",
    grade: 4, semester: "下學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Super"], topic: "單複數方位與進行動作",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Where are the dolls?",
    options: ["They're on the chair.", "It's in the box.", "I'm reading."],
    correctIndex: 0,
    hint: "the dolls 有加 s 是複數，回答要用 They're！",
    explanation: "詢問複數物品位置 Where are the...?，回答用 They're + 介系詞 + 地點。"
  },
  {
    id: "g4_dn_u2_qal_02",
    grade: 4, semester: "下學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Wonder", "Here"], topic: "單複數方位與進行動作",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "What are you doing?",
    options: ["I'm reading.", "He's sleeping.", "It's in the box."],
    correctIndex: 0,
    hint: "對方問「你」正在做什麼，要用「我 I'm」回答！",
    explanation: "What are you doing? 回應為 I'm + V-ing。"
  },
  {
    id: "g4_dn_u2_blk_01",
    grade: 4, semester: "下學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Super"], topic: "單複數方位與進行動作",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "娃娃在哪裡？",
    blocks: ["the", "Where", "dolls", "are", "?"],
    answer: ["Where", "are", "the", "dolls", "?"],
    hint: "疑問詞 Where 放最前，因為 dolls 是複數，所以後面放 are！",
    explanation: "詢問複數物品位置：Where + are + the + 複數名詞?"
  },
  {
    id: "g4_dn_u2_blk_02",
    grade: 4, semester: "下學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Super"], topic: "單複數方位與進行動作",
    stage: ["practice"], type: "block_puzzle",
    promptZh: "它們在椅子上。",
    blocks: ["the", "They're", "chair", "on", "."],
    answer: ["They're", "on", "the", "chair", "."],
    hint: "複數代名詞 They're 放最前面，接著放介系詞 on the chair！",
    explanation: "表達複數物品位置：They're + 介系詞 + the + 物品。"
  },
  {
    id: "g4_dn_u2_grm_01",
    grade: 4, semester: "下學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Super"], topic: "單複數方位與進行動作",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "Where _____ the kite? — It's in the box.",
    options: ["is", "are", "am"],
    correctIndex: 0,
    hint: "the kite 是單數一隻風箏，要用單數 Be 動詞！",
    explanation: "單數名詞搭配 is（Where is / Where's）。"
  },
  {
    id: "g4_dn_u2_grm_02",
    grade: 4, semester: "下學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Wonder"], topic: "單複數方位與進行動作",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "What's he doing? — He's _____.",
    options: ["sleep", "sleeping", "sleeps"],
    correctIndex: 1,
    hint: "Be 動詞 He's 後面表示「正在做」，動詞要加 ing！",
    explanation: "現在進行式結構：Be 動詞 + V-ing。"
  },
  {
    id: "g4_dn_u2_sit_01",
    grade: 4, semester: "下學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Wonder"], topic: "單複數方位與進行動作",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "你看到哥哥正趴在床上閉著眼睛，媽媽問你哥哥在做什麼：",
    speakerLine: "What's he doing?",
    options: ["He's sleeping.", "I'm reading.", "They're on the chair."],
    correctIndex: 0,
    hint: "問他（he）在做什麼，要用 He's 回答「睡覺」的進行式！",
    explanation: "描述他正在睡覺：He's sleeping."
  },
  {
    id: "g4_dn_u2_sit_02",
    grade: 4, semester: "下學期", unitIds: ["sentence_u2"], examHalf: "midterm",
    editions: ["Super"], topic: "單複數方位與進行動作",
    stage: ["practice"], type: "situational_qa",
    situationZh: "弟弟找不到他的風箏，你看到風箏就在箱子裡面，要怎麼告訴他？",
    speakerLine: "Where's the kite?",
    options: ["It's in the box.", "They're on the chair.", "He's in the box."],
    correctIndex: 0,
    hint: "風箏是單數物品，在箱子「裡面」要用 in！",
    explanation: "It's in the box. 表示單數物品在箱子裡。"
  },

  // ==================== 下學期 Unit 3（幾點了 / 午餐想吃什麼） ====================
  {
    id: "g4_dn_u3_qal_01",
    grade: 4, semester: "下學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Super"], topic: "時間表達與餐點點餐",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "What time is it?",
    options: ["It's seven thirty.", "I want a hot dog.", "Yes, I do."],
    correctIndex: 0,
    hint: "What time is it? 問時間，請選幾點幾分的答案！",
    explanation: "回答現在幾點：It's + 小時 + 分鐘。"
  },
  {
    id: "g4_dn_u3_qal_02",
    grade: 4, semester: "下學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Wonder"], topic: "時間表達與餐點點餐",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "What do you want for lunch?",
    options: ["I want two hamburgers.", "It's seven o'clock.", "They're robots."],
    correctIndex: 0,
    hint: "問午餐想吃什麼，回答 I want + 食物！",
    explanation: "回應 What do you want for lunch? 用 I want + 食物名稱。"
  },
  {
    id: "g4_dn_u3_blk_01",
    grade: 4, semester: "下學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Super"], topic: "時間表達與餐點點餐",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "現在是七點三十分。",
    blocks: ["thirty", "It's", "seven", "."],
    answer: ["It's", "seven", "thirty", "."],
    hint: "先放 It's，再放小時 seven，最後放分鐘 thirty！",
    explanation: "非整點時間表達：It's + 時 + 分。"
  },
  {
    id: "g4_dn_u3_blk_02",
    grade: 4, semester: "下學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Wonder"], topic: "時間表達與餐點點餐",
    stage: ["practice"], type: "block_puzzle",
    promptZh: "我要一份熱狗。",
    blocks: ["hot dog", "want", "I", "a", "."],
    answer: ["I", "want", "a", "hot dog", "."],
    hint: "先說「我想要 I want」，再加數量詞 a 和食物！",
    explanation: "點餐表達：I want + a/an + 單數食物。"
  },
  {
    id: "g4_dn_u3_grm_01",
    grade: 4, semester: "下學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Wonder"], topic: "時間表達與餐點點餐",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "I want two _____.",
    options: ["hamburger", "hamburgers", "juice"],
    correctIndex: 1,
    hint: "數量是 two（兩個），可數名詞一定要加 s！",
    explanation: "two 後面須接複數可數名詞 hamburgers。"
  },
  {
    id: "g4_dn_u3_grm_02",
    grade: 4, semester: "下學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Wonder"], topic: "時間表達與餐點點餐",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "I want _____ juice.",
    options: ["a", "two", "some"],
    correctIndex: 2,
    hint: "juice（果汁）是液體不可數名詞，不能用 a 或 two 喔！",
    explanation: "不可數名詞（如 juice）搭配 some 表示「一些」。"
  },
  {
    id: "g4_dn_u3_sit_01",
    grade: 4, semester: "下學期", unitIds: ["sentence_u3"], examHalf: "final",
    editions: ["Wonder"], topic: "時間表達與餐點點餐",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "中午到了，你想問同學午餐想要吃什麼：",
    speakerLine: "",
    options: ["What do you want for lunch?", "What time is it?", "Where are you?"],
    correctIndex: 0,
    hint: "問「午餐想吃什麼」要用 for lunch！",
    explanation: "What do you want for lunch? 詢問對方午餐想吃什麼。"
  },
  {
    id: "g4_dn_u3_sit_02",
    grade: 4, semester: "下學期", unitIds: ["daily_下學期"], examHalf: "final",
    editions: ["Super"], topic: "日常提醒對話",
    stage: ["practice"], type: "situational_qa",
    situationZh: "看到朋友差點踩到地上的水窪，你要趕快提醒他：",
    speakerLine: "",
    options: ["Watch out!", "I'm hungry.", "Let's count."],
    correctIndex: 0,
    hint: "提醒別人「小心」要說 Watch out! 或 Be careful!",
    explanation: "Watch out! 用於提醒他人注意危險。"
  },

  // ==================== 下學期 Unit 4（喜好確認 / 帽子在哪） ====================
  {
    id: "g4_dn_u4_qal_01",
    grade: 4, semester: "下學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Super"], topic: "喜好確認與物品方位",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Do you like milk?",
    options: ["Yes, I do.", "Yes, I am.", "It's on the desk."],
    correctIndex: 0,
    hint: "用 Do you...? 問喜好，肯定簡答要用 Yes, I do.！",
    explanation: "Do you like...? 的肯定簡答為 Yes, I do."
  },
  {
    id: "g4_dn_u4_qal_02",
    grade: 4, semester: "下學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Wonder"], topic: "喜好確認與物品方位",
    stage: ["practice", "exam"], type: "qa_listening",
    promptAudio: "Do you like bears?",
    options: ["No, I don't. I like tigers.", "Yes, it is.", "They're yo-yos."],
    correctIndex: 0,
    hint: "問句用 Do you like...?，否定回答後說出真正喜歡的動物！",
    explanation: "否定回答並補充喜好：No, I don't. I like + 複數動物。"
  },
  {
    id: "g4_dn_u4_blk_01",
    grade: 4, semester: "下學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Wonder"], topic: "喜好確認與物品方位",
    stage: ["practice", "exam"], type: "block_puzzle",
    promptZh: "不，我不喜歡。我喜歡老虎。",
    blocks: ["tigers.", "I don't.", "No,", "like", "I"],
    answer: ["No,", "I don't.", "I", "like", "tigers."],
    hint: "先放否定簡答 No, I don't.，再接肯定句 I like tigers.！",
    explanation: "否定簡答後接真實喜好：No, I don't. I like + 複數名詞。"
  },
  {
    id: "g4_dn_u4_blk_02",
    grade: 4, semester: "下學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Here"], topic: "喜好確認與物品方位",
    stage: ["practice"], type: "block_puzzle",
    promptZh: "我的帽子在哪裡？",
    blocks: ["my", "Where's", "hat", "?"],
    answer: ["Where's", "my", "hat", "?"],
    hint: "疑問詞 Where's 放句首，再放 my hat！",
    explanation: "詢問單數物品位置：Where's + my + 物品?"
  },
  {
    id: "g4_dn_u4_grm_01",
    grade: 4, semester: "下學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Wonder"], topic: "喜好確認與物品方位",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "Do you like _____? — Yes, I do.",
    options: ["tiger", "tigers", "a tigers"],
    correctIndex: 1,
    hint: "表達「喜歡某一類動物」時，可數名詞要用複數形式喔！",
    explanation: "like 後方泛指某類可數動物或物品須使用複數 tigers。"
  },
  {
    id: "g4_dn_u4_grm_02",
    grade: 4, semester: "下學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Here"], topic: "喜好確認與物品方位",
    stage: ["practice", "exam"], type: "grammar_blank",
    sentence: "Where's my hat? — _____ on the desk.",
    options: ["It's", "They're", "I'm"],
    correctIndex: 0,
    hint: "my hat 只有一頂帽子，是單數，所以要用 It's！",
    explanation: "單數物品用 It's 代替，複數才用 They're。"
  },
  {
    id: "g4_dn_u4_sit_01",
    grade: 4, semester: "下學期", unitIds: ["sentence_u4"], examHalf: "final",
    editions: ["Super", "Wonder"], topic: "喜好確認與物品方位",
    stage: ["practice", "exam"], type: "situational_qa",
    situationZh: "你在動物園看熊的時候，你想問旁邊的同學喜不喜歡熊：",
    speakerLine: "",
    options: ["Do you like bears?", "Are you a bear?", "Where are the bears?"],
    correctIndex: 0,
    hint: "詢問對方「喜不喜歡」要用 Do you like + 複數名詞！",
    explanation: "詢問喜好固定句型為 Do you like + 複數可數名詞?"
  },
  {
    id: "g4_dn_u4_sit_02",
    grade: 4, semester: "下學期", unitIds: ["festival_下學期_1"], examHalf: "final",
    editions: ["Super"], topic: "節慶文化（端午節）",
    stage: ["practice"], type: "situational_qa",
    situationZh: "端午節到了，大家在河邊準備參加龍舟比賽，你熱情招呼隊友：",
    speakerLine: "Happy Dragon Boat Festival!",
    options: ["Let's row the dragon boat!", "Trick or treat!", "Let's clean up!"],
    correctIndex: 0,
    hint: "端午節的特色活動是「划龍舟」！",
    explanation: "row the dragon boat 意為「划龍舟」。"
  }
];
