// data/books.js — NovaEdu 銀河英語探險 v2（6 顆星球 × 南北半球 × 衛星專區資源路徑映射）
function sfNormalizeText(text) {
  return String(text || "").toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, " ").trim();
}

function uniqueByWordForBook(list) {
  const map = new Map();
  (list || []).forEach(item => {
    const key = sfNormalizeText(item.word || item.sentence || "");
    if (key && !map.has(key)) map.set(key, item);
  });
  return [...map.values()];
}

function getAssetFileName(path) {
  if (!path) return "";
  const cleanPath = String(path).split("?")[0].split("#")[0];
  return cleanPath.split("/").pop();
}

function makeBookAssetPath(path, basePath) {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const cleanName = getAssetFileName(path).replace(/\.png$/i, ".webp");
  return basePath + cleanName;
}

function hydrateUnitItems(unitList, imgBase, audBase) {
  return (unitList || []).map(u => {
    const words = (u.words || []).map(it => ({
      ...it,
      image: makeBookAssetPath(it.image, imgBase),
      audio: makeBookAssetPath(it.audio, audBase)
    }));
    const sentences = (u.sentences || []).map(it => ({
      ...it,
      image: makeBookAssetPath(it.image, imgBase),
      audio: makeBookAssetPath(it.audio, audBase)
    }));
    return { ...u, words, sentences };
  });
}

const planetData = {};
const bookData = {};

(typeof NOVA_GALAXY_PLANETS !== "undefined" ? NOVA_GALAXY_PLANETS : []).forEach(rawPlanet => {
  const imgBase = "images/";
  const audBase = "audio/";
  const semesters = {};

  ["上學期", "下學期"].forEach(semName => {
    const rawSem = rawPlanet.semesters?.[semName] || { semester: semName, hemisphere: semName === "上學期" ? "north" : "south", units: [], satelliteUnits: [] };
    const mainUnits = hydrateUnitItems(rawSem.units, imgBase, audBase);
    const satelliteUnits = hydrateUnitItems(rawSem.satelliteUnits, imgBase, audBase);
    const allUnits = [...mainUnits, ...satelliteUnits];

    const allVocabWords = uniqueByWordForBook(allUnits.flatMap(u => u.words || []));
    const allSentences = uniqueByWordForBook(allUnits.flatMap(u => u.sentences || []));

    const semBookId = `${rawPlanet.planetId}_${semName === "上學期" ? "up" : "dn"}`;
    const semObj = {
      bookId: semBookId,
      planetId: rawPlanet.planetId,
      planetName: rawPlanet.planetName,
      planetColor: rawPlanet.planetColor,
      accentColor: rawPlanet.accentColor,
      planetIcon: rawPlanet.planetIcon,
      title: `${rawPlanet.planetName}（${semName}）`,
      grade: rawPlanet.gradeLabel,
      semester: semName,
      hemisphere: rawSem.hemisphere,
      mainUnits,
      satelliteUnits,
      unitCatalog: allUnits,
      vocabulary: allVocabWords,
      allSentences,
      imageBasePath: imgBase,
      vocabAudioBasePath: audBase,
      sentenceAudioBasePath: audBase
    };
    semesters[semName] = semObj;
    bookData[semBookId] = semObj;
  });

  planetData[rawPlanet.planetId] = {
    planetId: rawPlanet.planetId,
    planetName: rawPlanet.planetName,
    gradeLabel: rawPlanet.gradeLabel,
    subtitle: rawPlanet.subtitle,
    planetColor: rawPlanet.planetColor,
    accentColor: rawPlanet.accentColor,
    planetIcon: rawPlanet.planetIcon,
    semesters
  };
});
