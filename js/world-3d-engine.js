// js/world-3d-engine.js — NovaEdu v15 螺旋銀河 ＋ 高細緻凹凸星球貼皮 ＋ 獨立雲層 ＋ Fresnel 大氣光暈 ＋ 水晶塔台地標
(function() {
  const IS_MOBILE_TIER = (typeof window !== "undefined") && (window.innerWidth < 768 || (navigator.deviceMemory && navigator.deviceMemory <= 4));
  const TEX_W = IS_MOBILE_TIER ? 512 : 1024;
  const TEX_H = IS_MOBILE_TIER ? 256 : 512;
  const DPR_CAP = IS_MOBILE_TIER ? 1.5 : 2;
  const SEG_GLOBE = IS_MOBILE_TIER ? 36 : 56;
  const SEG_SUB = IS_MOBILE_TIER ? 28 : 48;
  const SEG_MINI = IS_MOBILE_TIER ? 20 : 32;
  const _tmpScaleVec = (typeof THREE !== "undefined") ? new THREE.Vector3(1, 1, 1) : null;

  function syncCameraAspectAndDist(cam, cw, ch, baseZ) {
    if (!cam || !cw || !ch) return;
    const aspect = cw / ch;
    cam.aspect = aspect;
    if (baseZ) {
      cam.position.z = aspect < 1 ? Math.min(baseZ + 5.2, baseZ / Math.max(0.65, aspect) * 0.92) : baseZ;
    }
    cam.updateProjectionMatrix();
  }

  function isElVisible(el) {
    return !!(el && el.offsetParent !== null && el.clientWidth > 0 && el.clientHeight > 0);
  }

  let galaxyRafId = null;
  let planetRafId = null;
  // === Fast Deterministic 2D Fractal Noise for Rich Planet Terrain & Bump Maps ===
  function hash2D(ix, iy, seed) {
    let n = Math.sin(ix * 127.1 + iy * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }
  function valueNoise2D(x, y, seed) {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    const a = hash2D(ix, iy, seed), b = hash2D(ix + 1, iy, seed);
    const c = hash2D(ix, iy + 1, seed), d = hash2D(ix + 1, iy + 1, seed);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  }
  function fbm2D(x, y, seed) {
    let v = 0, amp = 0.5, freq = 1;
    for (let o = 0; o < 4; o++) {
      v += amp * valueNoise2D(x * freq, y * freq, seed + o * 13);
      freq *= 2.02;
      amp *= 0.5;
    }
    return v;
  }

  const _skinCache = {};
  function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  function buildRichPlanetMaps(planetId, planetColor) {
    const key = `${planetId}_${planetColor}_v18`;
    if (_skinCache[key]) return _skinCache[key];

    const w = 1024, h = 512;
    const colCanvas = document.createElement("canvas");
    colCanvas.width = w; colCanvas.height = h;
    const cCtx = colCanvas.getContext("2d");
    const cImg = cCtx.createImageData(w, h);

    const bmpCanvas = document.createElement("canvas");
    bmpCanvas.width = w; bmpCanvas.height = h;
    const bCtx = bmpCanvas.getContext("2d");
    const bImg = bCtx.createImageData(w, h);

    const base = new THREE.Color(planetColor || "#0ea5e9");
    const hsl = {}; base.getHSL(hsl);
    const seed = (planetId || "planet1").charCodeAt(planetId.length - 1) * 19;
    const isGas = planetId === "planet4" || planetId === "planet6";

    // Natural Earth + Planet Biome Palette
    const deepOcean = new THREE.Color("#082f49").lerp(base, 0.15);
    const shallowOcean = new THREE.Color("#0284c7").lerp(base, 0.2);
    const desertCol = new THREE.Color("#eab308").lerp(new THREE.Color("#d97706"), 0.35);
    const forestCol = new THREE.Color("#15803d").lerp(base, 0.25);
    const mountainCol = new THREE.Color("#78716c");
    const snowCol = new THREE.Color("#f8fafc");
    const polarIce = new THREE.Color("#e0f2fe");

    for (let y = 0; y < h; y++) {
      const ny = y / h;
      const latFactor = Math.abs(ny - 0.5) * 2; // 0 equator .. 1 poles
      for (let x = 0; x < w; x++) {
        const nx = x / w;
        const angle = nx * Math.PI * 2;
        const elev = isGas
          ? fbm2D(Math.cos(angle) * 1.8 + 4, ny * 9.5 + Math.sin(angle) * 0.7, seed)
          : fbm2D(Math.cos(angle) * 2.3 + 5, Math.sin(angle) * 2.3 + ny * 4.6, seed);
        const moist = fbm2D(Math.cos(angle) * 2.0 + 17, Math.sin(angle) * 2.0 + ny * 4.0, seed + 41);

        const idx = (y * w + x) * 4;
        let pxCol = new THREE.Color();
        let bumpVal = 40;

        // Fractal polar cap threshold (organic North & South Pole icebergs/glaciers)
        const polarEdge = 0.77 + (elev - 0.5) * 0.14;
        if (latFactor > polarEdge) {
          const iceBlend = smoothstep(polarEdge, Math.min(1, polarEdge + 0.08), latFactor);
          pxCol.copy(polarIce).lerp(snowCol, iceBlend);
          bumpVal = Math.floor(155 + iceBlend * 65);
        } else if (isGas) {
          const band = 0.5 + 0.5 * Math.sin(ny * 20 + elev * 4.5);
          pxCol.copy(deepOcean).lerp(base, band).lerp(desertCol, Math.max(0, band - 0.72) * 1.4);
          bumpVal = Math.floor(80 + band * 80);
        } else if (elev < 0.48) {
          // Smooth Ocean Depth
          const tO = smoothstep(0.22, 0.48, elev);
          pxCol.copy(deepOcean).lerp(shallowOcean, tO);
          bumpVal = 35;
        } else {
          // Land: smooth blend from Desert (low lat + low moisture) -> Forest -> Mountain -> Snow Peak
          const tLand = smoothstep(0.48, 0.85, elev);
          const dryFactor = smoothstep(0.65, 0.2, moist) * smoothstep(0.55, 0.12, latFactor);
          const lowBiome = forestCol.clone().lerp(desertCol, dryFactor);
          if (tLand < 0.52) {
            pxCol.copy(shallowOcean).lerp(lowBiome, smoothstep(0.0, 0.12, tLand));
            bumpVal = Math.floor(75 + tLand * 120);
          } else if (tLand < 0.80) {
            pxCol.copy(lowBiome).lerp(mountainCol, smoothstep(0.52, 0.80, tLand));
            bumpVal = Math.floor(140 + (tLand - 0.52) * 260);
          } else {
            pxCol.copy(mountainCol).lerp(snowCol, smoothstep(0.80, 0.96, tLand));
            bumpVal = Math.floor(215 + (tLand - 0.80) * 180);
          }
        }

        cImg.data[idx] = Math.round(pxCol.r * 255);
        cImg.data[idx + 1] = Math.round(pxCol.g * 255);
        cImg.data[idx + 2] = Math.round(pxCol.b * 255);
        cImg.data[idx + 3] = 255;

        bImg.data[idx] = bImg.data[idx + 1] = bImg.data[idx + 2] = bumpVal;
        bImg.data[idx + 3] = 255;
      }
    }
    cCtx.putImageData(cImg, 0, 0);
    bCtx.putImageData(bImg, 0, 0);

    const mapTex = new THREE.CanvasTexture(colCanvas);
    mapTex.colorSpace = THREE.SRGBColorSpace;
    const bumpTex = new THREE.CanvasTexture(bmpCanvas);
    _skinCache[key] = { mapTex, bumpTex };
    return _skinCache[key];
  }

  function applyPlanetSkin(material, planetId, planetColor, useBump) {
    if (!material) return;
    const { mapTex, bumpTex } = buildRichPlanetMaps(planetId, planetColor);
    material.map = mapTex;
    if (useBump) {
      material.bumpMap = bumpTex;
      material.bumpScale = 0.045;
    }
    material.needsUpdate = true;

    const isFileProto = (typeof location !== "undefined" && location.protocol === "file:");
    const hdUrl = (!isFileProto && typeof NOVA_HD_PLANET_TEXTURES !== "undefined") ? NOVA_HD_PLANET_TEXTURES[planetId] : "";
    if (hdUrl && typeof THREE.TextureLoader !== "undefined") {
      new THREE.TextureLoader().load(hdUrl, hdTex => {
        hdTex.colorSpace = THREE.SRGBColorSpace;
        material.map = hdTex;
        material.needsUpdate = true;
      }, undefined, () => {});
    }
  }

  function buildCloudLayerTexture() {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 256;
    const ctx = c.getContext("2d");
    const img = ctx.createImageData(512, 256);
    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 512; x++) {
        const ang = (x / 512) * Math.PI * 2;
        const n = fbm2D(Math.cos(ang) * 3.0 + 10, Math.sin(ang) * 3.0 + (y / 256) * 5.0, 99);
        const alpha = n > 0.56 ? Math.min(185, Math.floor((n - 0.56) * 620)) : 0;
        const idx = (y * 512 + x) * 4;
        img.data[idx] = 255; img.data[idx + 1] = 255; img.data[idx + 2] = 255; img.data[idx + 3] = alpha;
      }
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function buildMoonCraterMaps() {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 128;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(0, 0, 256, 128);
    for (let i = 0; i < 38; i++) {
      const cx = (i * 53 + 12) % 240 + 8;
      const cy = 14 + ((i * 37) % 100);
      const r = 4 + (i % 6) * 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "#94a3b8"; ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = "#f1f5f9"; ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function buildFresnelAtmoMaterial(hexColor) {
    const col = new THREE.Color(hexColor || "#38bdf8");
    return new THREE.ShaderMaterial({
      uniforms: { glowColor: { value: col } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.66 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(glowColor, 1.0) * intensity * 1.15;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
  }

  // === Part A: 3D 螺旋銀河系總覽引擎 ===
  let gScene, gCamera, gRenderer, gControls, gGalaxyPoints;
  let gPlanetMeshes = [];
  let gInitialized = false;
  let gRaycaster = null;
  let gPointer = null;
  let gDownPos = { x: 0, y: 0 };
  let gOnSelect = null;

  function buildSpiralGalaxyPoints() {
    const count = 3200, branches = 3, radiusMax = 28;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const insideCol = new THREE.Color("#fde047");
    const midCol = new THREE.Color("#38bdf8");
    const outsideCol = new THREE.Color("#a855f7");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 0.75) * radiusMax;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = r * 0.42;
      const randX = Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? 1 : -1) * 1.4;
      const randY = Math.pow(Math.random(), 2.5) * (Math.random() < 0.5 ? 1 : -1) * 1.1;
      const randZ = Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? 1 : -1) * 1.4;
      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randX;
      positions[i3 + 1] = randY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randZ;
      const t = r / radiusMax;
      const c = t < 0.45 ? insideCol.clone().lerp(midCol, t / 0.45) : midCol.clone().lerp(outsideCol, (t - 0.45) / 0.55);
      colors[i3] = c.r; colors[i3 + 1] = c.g; colors[i3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.22, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true
    }));
  }

  function ensureGalaxyScene() {
    if (gInitialized) return;
    const container = document.getElementById("galaxy-3d-canvas");
    if (!container || typeof THREE === "undefined") return;

    gScene = new THREE.Scene();
    gScene.background = new THREE.Color("#030712");
    const w = container.clientWidth || 900, h = container.clientHeight || 360;
    gCamera = new THREE.PerspectiveCamera(45, w / h, 0.1, 300);
    gCamera.position.set(0, 12.5, 22);

    gRenderer = new THREE.WebGLRenderer({ antialias: true });
    gRenderer.setSize(w, h);
    gRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
    gRenderer.domElement.style.touchAction = "none";
    container.innerHTML = "";
    container.appendChild(gRenderer.domElement);

    if (typeof THREE.OrbitControls !== "undefined") {
      gControls = new THREE.OrbitControls(gCamera, gRenderer.domElement);
      gControls.enableDamping = true; gControls.enablePan = false;
      gControls.minDistance = 12; gControls.maxDistance = 38;
    }

    gScene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const sunLight = new THREE.PointLight(0xfffbeb, 2.2, 120);
    sunLight.position.set(0, 2, 0);
    gScene.add(sunLight);

    const coreMesh = new THREE.Mesh(new THREE.SphereGeometry(1.45, SEG_MINI, SEG_MINI), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    const coreGlow = new THREE.Mesh(new THREE.SphereGeometry(2.15, SEG_MINI, SEG_MINI), new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.28, side: THREE.BackSide }));
    gScene.add(coreMesh, coreGlow);

    gGalaxyPoints = buildSpiralGalaxyPoints();
    gScene.add(gGalaxyPoints);

    gRaycaster = new THREE.Raycaster();
    gPointer = new THREE.Vector2();
    gRenderer.domElement.addEventListener("pointerdown", e => { gDownPos = { x: e.clientX, y: e.clientY }; });
    gRenderer.domElement.addEventListener("pointerup", e => {
      if (Math.hypot(e.clientX - gDownPos.x, e.clientY - gDownPos.y) > 8) return;
      const rect = gRenderer.domElement.getBoundingClientRect();
      gPointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      gPointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      gRaycaster.setFromCamera(gPointer, gCamera);
      const hits = gRaycaster.intersectObjects(gPlanetMeshes.map(p => p.hitMesh));
      if (hits.length && gOnSelect) gOnSelect(hits[0].object.userData.planetId);
    });

    function resizeGalaxy() {
      if (!container || !gRenderer || !gCamera) return;
      const cw = container.clientWidth, ch = container.clientHeight;
      if (!cw || !ch) return;
      syncCameraAspectAndDist(gCamera, cw, ch, 17.5);
      gRenderer.setSize(cw, ch);
    }
    window.addEventListener("resize", resizeGalaxy);
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(resizeGalaxy).observe(container);
    }
    resizeGalaxy();
    gInitialized = true;
    animateGalaxy();
  }

  function animateGalaxy() {
    galaxyRafId = requestAnimationFrame(animateGalaxy);
    const container = document.getElementById("galaxy-3d-canvas");
    if (document.hidden || !isElVisible(container)) return;
    const t = Date.now() * 0.00035;
    gPlanetMeshes.forEach((item, idx) => {
      const ang = item.baseAngle + t * item.speed;
      item.group.position.set(Math.cos(ang) * item.radius, Math.sin(ang * 2 + idx) * 0.35, Math.sin(ang) * item.radius);
      item.mesh.rotation.y += 0.012;
    });
    if (gGalaxyPoints) gGalaxyPoints.rotation.y += 0.0007;
    if (gControls) gControls.update();
    if (gRenderer && gScene && gCamera) gRenderer.render(gScene, gCamera);
  }

  window.init3DGalaxy = function(planets, allowedSet, onSelect) {
    ensureGalaxyScene();
    if (typeof window.resumeNova3DLoops === "function") setTimeout(window.resumeNova3DLoops, 30);
    gOnSelect = onSelect;
    if (!gScene) return;
    gPlanetMeshes.forEach(p => { gScene.remove(p.group); gScene.remove(p.orbitRing); });
    gPlanetMeshes = [];

    (planets || []).forEach((pl, idx) => {
      const radius = 3.8 + idx * 2.15;
      const unlocked = allowedSet.has(pl.planetId);
      const colHex = new THREE.Color(pl.planetColor || "#38bdf8");

      const orbitRing = new THREE.Mesh(
        new THREE.RingGeometry(radius - 0.04, radius + 0.04, 64),
        new THREE.MeshBasicMaterial({ color: unlocked ? colHex : 0x334155, side: THREE.DoubleSide, transparent: true, opacity: unlocked ? 0.45 : 0.2 })
      );
      orbitRing.rotation.x = Math.PI / 2;
      gScene.add(orbitRing);

      const group = new THREE.Group();
      const mat = new THREE.MeshPhongMaterial({
        shininess: 28,
        emissive: unlocked ? colHex : new THREE.Color(0x0f172a),
        emissiveIntensity: unlocked ? 0.14 : 0.04
      });
      applyPlanetSkin(mat, pl.planetId, pl.planetColor, true);
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.92, SEG_MINI, SEG_MINI), mat);
      group.add(mesh);

      if (unlocked) {
        const halo = new THREE.Mesh(new THREE.RingGeometry(1.18, 1.38, 32), new THREE.MeshBasicMaterial({ color: colHex, side: THREE.DoubleSide, transparent: true, opacity: 0.6 }));
        halo.rotation.x = Math.PI / 2.4;
        group.add(halo);
      }

      const hitMesh = new THREE.Mesh(new THREE.SphereGeometry(1.45, 12, 12), new THREE.MeshBasicMaterial({ visible: false }));
      hitMesh.userData.planetId = pl.planetId;
      group.add(hitMesh);

      gScene.add(group);
      gPlanetMeshes.push({ group, mesh, hitMesh, orbitRing, radius, baseAngle: (Math.PI * 2 / 6) * idx, speed: 0.55 - idx * 0.05 });
    });
  };

  // === Part B: 進階 3D 星球地球儀（凹凸貼皮＋獨立雲層＋Fresnel光暈＋行星環＋星際水晶塔台）===
  let scene, camera, renderer, controls;
  let planetTiltGroup, globeGroup, earthMesh, cloudMesh, atmosphereMesh, planetRingMesh, starField, satelliteGroup, moonGroup, sunGroup, sunLight;
  let targetSunY = 10.5;
  let stationMarkers = [];
  let selectedStationIdx = -1;
  let isInitialized = false;
  let autoRotate = true;
  let raycaster = null;
  let pointer = null;
  let pointerDownPos = { x: 0, y: 0 };

  let activeStationObj = null;
  let activeSubUnitIdx = 0;
  let targetGlobeRotY = null;
  let targetCamY = null;

  function playCeremonyTone(kind) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!window._novaAC) window._novaAC = new AC();
      const ctx = window._novaAC;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      const now = ctx.currentTime;
      if (kind === "lock") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(560, now + 0.22);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
        osc.start(now); osc.stop(now + 0.27);
      } else {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.09);
        osc.frequency.setValueAtTime(783.99, now + 0.18);
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
        osc.start(now); osc.stop(now + 0.37);
      }
    } catch (e) {}
  }

  function makeLabelSprite(text, borderCol) {
    const canvas = document.createElement("canvas");
    canvas.width = 280; canvas.height = 68;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(8, 15, 36, 0.92)";
    ctx.beginPath(); ctx.roundRect(8, 8, 264, 52, 20); ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = borderCol || "#38bdf8"; ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 23px sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(String(text || "").slice(0, 15), 140, 35);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
    sp.scale.set(2.25, 0.55, 1);
    return sp;
  }

  function buildDayNightVeilTexture(activeSemester) {
    const canvas = document.createElement("canvas");
    canvas.width = TEX_W; canvas.height = TEX_H;
    const ctx = canvas.getContext("2d");
    ctx.scale(TEX_W / 1024, TEX_H / 512);
    ctx.clearRect(0, 0, 1024, 512);
    const northIsDay = activeSemester === "上學期";
    const nightY = northIsDay ? 256 : 0;

    ctx.fillStyle = "rgba(3, 7, 24, 0.78)";
    ctx.fillRect(0, nightY, 1024, 256);

    ctx.fillStyle = "rgba(253, 224, 71, 0.68)";
    for (let i = 0; i < 55; i++) {
      ctx.beginPath();
      ctx.arc((i * 97 + 40) % 1000, nightY + 14 + ((i * 53) % 225), 2.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glowing Equator Energy Line
    const eqGrad = ctx.createLinearGradient(0, 248, 0, 264);
    eqGrad.addColorStop(0, "rgba(253,224,71,0)");
    eqGrad.addColorStop(0.5, "rgba(253,224,71,0.92)");
    eqGrad.addColorStop(1, "rgba(253,224,71,0)");
    ctx.fillStyle = eqGrad;
    ctx.fillRect(0, 248, 1024, 16);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function latLonToVec3(latDeg, lonDeg, radius) {
    const phi = (90 - latDeg) * (Math.PI / 180);
    const theta = (lonDeg + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  function buildIslandStations(book) {
    const all = book?.unitCatalog || [];
    const stations = [];
    const sStarter = all.find(u => u.id === "sentence_starter");
    if (sStarter && sStarter.sentences.length) {
      stations.push({ id: "station_starter", title: "Get Ready / Starter", icon: "🚩", color: 0xf59e0b, desc: "暖身句型（依版本收錄）", subUnits: [{ ...sStarter, subType: "sentence", subLabel: "💬 句型｜Get Ready / Starter" }] });
    }
    for (let i = 1; i <= 4; i++) {
      const vUnit = all.find(u => u.id === `vocab_u${i}`);
      const sUnit = all.find(u => u.id === `sentence_u${i}`);
      const subs = [];
      if (vUnit && vUnit.words.length) subs.push({ ...vUnit, subType: "vocab", subLabel: `🔤 單字 Unit ${i}` });
      if (sUnit && sUnit.sentences.length) subs.push({ ...sUnit, subType: "sentence", subLabel: `💬 句型 Unit ${i}` });
      if (subs.length) stations.push({ id: `station_u${i}`, title: `Unit ${i}`, icon: "📘", color: 0x38bdf8, desc: i <= 2 ? "期中考前核心單字與句型" : "期末考核心單字與句型", subUnits: subs });
    }
    const starterAm = all.find(u => u.id === "starter_am");
    const starterNz = all.find(u => u.id === "starter_nz");
    if (starterAm) stations.push({ id: "station_am", title: "字母 A–M", icon: "🔤", color: 0xf59e0b, desc: "期中考前字母自然發音", subUnits: [{ ...starterAm, subType: "vocab", subLabel: "🔤 字母音 A–M" }] });
    if (starterNz) stations.push({ id: "station_nz", title: "字母 N–Z", icon: "🔤", color: 0xf59e0b, desc: "期末考字母自然發音", subUnits: [{ ...starterNz, subType: "vocab", subLabel: "🔤 字母音 N–Z" }] });
    const phonics = all.filter(u => u.category === "phonics");
    if (phonics.length) stations.push({ id: "station_phonics", title: "發音單元", icon: "🎈", color: 0xf472b6, desc: "依發音規則分類拼讀", subUnits: phonics.map(u => ({ ...u, subType: "vocab", subLabel: u.title.replace(/^(發音規則|發音)｜/, "🎈 ") })) });
    const nums = all.filter(u => u.category === "numbers");
    if (nums.length) stations.push({ id: "station_numbers", title: "數字單元", icon: "🔢", color: 0xfbbf24, desc: "各年級進度數字專區", subUnits: nums.map(u => ({ ...u, subType: "vocab", subLabel: `🔢 ${u.title}` })) });
    const fests = all.filter(u => u.category === "festival");
    if (fests.length) {
      const festSubs = [];
      fests.forEach(u => {
        const base = u.title.replace("節慶｜", "");
        if (u.words && u.words.length) festSubs.push({ ...u, subType: "vocab", subLabel: `🎡 ${base}（字彙）` });
        if (u.sentences && u.sentences.length) festSubs.push({ ...u, subType: "sentence", subLabel: `💬 ${base}（句型）` });
      });
      if (festSubs.length) stations.push({ id: "station_festival", title: "節慶單元", icon: "🎡", color: 0x34d399, desc: "獨立節慶主題詞彙與句型", subUnits: festSubs });
    }
    const cls = all.filter(u => u.category === "classroom");
    if (cls.length) stations.push({ id: "station_classroom", title: "課室用語", icon: "🏫", color: 0xa78bfa, desc: "教室常用英文指令", subUnits: cls.map(u => ({ ...u, subType: "sentence", subLabel: `🏫 ${u.title}` })) });
    const daily = all.filter(u => u.category === "daily");
    if (daily.length) stations.push({ id: "station_daily", title: "Daily Talk", icon: "🗣️", color: 0xfb923c, desc: "生活情境高頻對話", subUnits: daily.map(u => ({ ...u, subType: "sentence", subLabel: `🗣️ ${u.title}` })) });
    return stations;
  }

  function ensureScene() {
    if (isInitialized) return;
    const container = document.getElementById("world-canvas-container");
    if (!container || typeof THREE === "undefined") return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color("#030712");

    const w = container.clientWidth || 800, h = container.clientHeight || 460;
    camera = new THREE.PerspectiveCamera(44, w / h, 0.1, 200);
    camera.position.set(0, 2.2, 13.0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
    renderer.domElement.style.touchAction = "none";
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    if (typeof THREE.OrbitControls !== "undefined") {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; controls.enablePan = false;
      controls.minDistance = 7; controls.maxDistance = 20;
      controls.addEventListener("start", () => { autoRotate = false; });
    }

    scene.add(new THREE.AmbientLight(0x1e293b, 0.28));
    sunLight = new THREE.DirectionalLight(0xfffbeb, 2.45);
    sunLight.position.set(11, 10.5, 9);
    scene.add(sunLight);

    // Glowing 3D Sun in space showing true illumination direction
    sunGroup = new THREE.Group();
    const sunCore = new THREE.Mesh(
      new THREE.SphereGeometry(1.15, 28, 28),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    const sunHalo = new THREE.Mesh(
      new THREE.SphereGeometry(1.75, 28, 28),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.28, side: THREE.BackSide })
    );
    sunGroup.add(sunCore, sunHalo);
    sunGroup.position.set(11, 10.5, 9);
    scene.add(sunGroup);

    // Multi-color deep-space starfield
    const starGeo = new THREE.BufferGeometry();
    const starVerts = [], starCols = [];
    const palette = [new THREE.Color("#ffffff"), new THREE.Color("#7dd3fc"), new THREE.Color("#fde047")];
    for (let i = 0; i < 1100; i++) {
      starVerts.push((Math.random() - 0.5) * 140, (Math.random() - 0.5) * 140, (Math.random() - 0.5) * 140);
      const c = palette[i % palette.length];
      starCols.push(c.r, c.g, c.b);
    }
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starVerts, 3));
    starGeo.setAttribute("color", new THREE.Float32BufferAttribute(starCols, 3));
    starField = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.32, vertexColors: true }));
    scene.add(starField);

    planetTiltGroup = new THREE.Group();
    planetTiltGroup.rotation.z = THREE.MathUtils.degToRad(23.5);
    scene.add(planetTiltGroup);

    globeGroup = new THREE.Group();
    planetTiltGroup.add(globeGroup);

    earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(3.4, SEG_GLOBE, SEG_GLOBE),
      new THREE.MeshPhongMaterial({ shininess: 26, specular: new THREE.Color(0x334155) })
    );
    globeGroup.add(earthMesh);

    // Independent drifting cloud layer lit by real Sun
    cloudMesh = new THREE.Mesh(
      new THREE.SphereGeometry(3.46, SEG_SUB, SEG_SUB),
      new THREE.MeshPhongMaterial({ map: buildCloudLayerTexture(), transparent: true, opacity: 0.78, depthWrite: false })
    );
    globeGroup.add(cloudMesh);

    // Fresnel Rim-Glow Atmosphere
    atmosphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(3.74, SEG_SUB, SEG_SUB),
      buildFresnelAtmoMaterial("#38bdf8")
    );
    globeGroup.add(atmosphereMesh);

    // Optional Saturn-style Planetary Ring (shown on planet1 / planet4)
    planetRingMesh = new THREE.Mesh(
      new THREE.RingGeometry(4.2, 5.15, 64),
      new THREE.MeshBasicMaterial({ color: 0xa78bfa, side: THREE.DoubleSide, transparent: true, opacity: 0.25 })
    );
    planetRingMesh.rotation.x = Math.PI / 2.35;
    planetRingMesh.visible = false;
    globeGroup.add(planetRingMesh);

    // Companion Orbital Rings
    const satOrbit = new THREE.Mesh(new THREE.RingGeometry(5.85, 5.9, 72), new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.22 }));
    satOrbit.rotation.x = Math.PI / 2.2; satOrbit.rotation.y = 0.25;
    scene.add(satOrbit);

    // 3D Orbiting Satellite + 3D Label
    satelliteGroup = new THREE.Group();
    const satCore = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.62, 16), new THREE.MeshPhongMaterial({ color: 0xfbbf24, shininess: 60 }));
    satCore.rotation.z = Math.PI / 2;
    const satDish = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.18, 16), new THREE.MeshPhongMaterial({ color: 0xe2e8f0 }));
    satDish.rotation.z = -Math.PI / 2; satDish.position.x = 0.36;
    const solarL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.05, 0.42), new THREE.MeshPhongMaterial({ color: 0x1d4ed8, emissive: 0x38bdf8, emissiveIntensity: 0.35 }));
    solarL.position.x = -0.52;
    const solarR = solarL.clone(); solarR.position.x = 0.52;
    const satHit = new THREE.Mesh(new THREE.SphereGeometry(1.25, 12, 12), new THREE.MeshBasicMaterial({ visible: false }));
    satHit.userData.specialTarget = "satellite";
    const satLabel = makeLabelSprite("🛰️ 衛星主題", "#38bdf8");
    satLabel.position.set(0, 0.92, 0);
    satLabel.userData.specialTarget = "satellite";
    satelliteGroup.add(satCore, satDish, solarL, solarR, satHit, satLabel);
    satelliteGroup.position.set(5.7, 1.85, 0.4);
    scene.add(satelliteGroup);

    // 3D Orbiting Moon (Cratered Texture + 3D Label)
    moonGroup = new THREE.Group();
    const moonTex = buildMoonCraterMaps();
    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.82, 28, 28),
      new THREE.MeshPhongMaterial({ map: moonTex, bumpMap: moonTex, bumpScale: 0.08, shininess: 8 })
    );
    const moonHit = new THREE.Mesh(new THREE.SphereGeometry(1.3, 12, 12), new THREE.MeshBasicMaterial({ visible: false }));
    moonHit.userData.specialTarget = "moon";
    const moonLabel = makeLabelSprite("🌙 月球考卷", "#fbbf24");
    moonLabel.position.set(0, 1.18, 0);
    moonLabel.userData.specialTarget = "moon";
    moonGroup.add(moonMesh, moonHit, moonLabel);
    moonGroup.position.set(-5.7, -1.45, 0.4);
    scene.add(moonGroup);

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    renderer.domElement.addEventListener("pointerdown", e => { pointerDownPos = { x: e.clientX, y: e.clientY }; });
    renderer.domElement.addEventListener("pointerup", e => {
      if (Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y) > 8) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const specialHits = raycaster.intersectObjects([satHit, satLabel, moonHit, moonLabel]);
      if (specialHits.length) {
        const tgt = specialHits[0].object.userData.specialTarget;
        if (tgt === "moon" && typeof showModule === "function") showModule("exam");
        if (tgt === "satellite") {
          const satIdx = stationMarkers.findIndex(m => ["station_phonics", "station_numbers", "station_festival"].includes(m.station.id));
          if (satIdx >= 0) focusUnitOnGlobe(satIdx, false);
        }
        return;
      }

      const targets = stationMarkers.flatMap(m => [m.hitMesh, m.labelSp]);
      const hits = raycaster.intersectObjects(targets);
      if (hits.length) {
        const clickedIdx = hits[0].object.userData.stationIdx;
        const clickedMarker = stationMarkers[clickedIdx];
        if (clickedMarker && !clickedMarker.isActive) {
          if (typeof switchPlanetSemester === "function") switchPlanetSemester(clickedMarker.pinSem);
          return;
        }
        if (clickedIdx === selectedStationIdx) {
          playCeremonyTone("land");
          openUnitStationModal(stationMarkers[clickedIdx].station);
        } else {
          focusUnitOnGlobe(clickedIdx, false);
        }
      }
    });

    function resizePlanet() {
      if (!container || !renderer || !camera) return;
      const cw = container.clientWidth, ch = container.clientHeight;
      if (!cw || !ch) return;
      syncCameraAspectAndDist(camera, cw, ch, 13.0);
      renderer.setSize(cw, ch);
    }
    window.addEventListener("resize", resizePlanet);
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(resizePlanet).observe(container);
    }
    resizePlanet();

    isInitialized = true;
    animate();
  }

  function animate() {
    planetRafId = requestAnimationFrame(animate);
    const container = document.getElementById("world-canvas-container");
    const modalOpen = document.getElementById("unit-station-modal")?.style.display === "flex"
      || document.getElementById("parentReportModal")?.style.display === "flex";
    if (document.hidden || !isElVisible(container) || modalOpen) return;
    const t = Date.now() * 0.001;
    if (autoRotate && globeGroup) globeGroup.rotation.y += 0.002;
    if (cloudMesh) cloudMesh.rotation.y += 0.00075;
    if (starField) starField.rotation.y -= 0.00025;
    if (satelliteGroup) {
      satelliteGroup.position.y = 1.85 + Math.sin(t * 1.4) * 0.25;
      satelliteGroup.rotation.y += 0.01;
    }
    if (moonGroup) {
      moonGroup.position.y = -1.45 + Math.cos(t * 1.1) * 0.22;
    }
    if (sunLight && sunGroup) {
      sunLight.position.y += (targetSunY - sunLight.position.y) * 0.08;
      sunGroup.position.y = sunLight.position.y;
    }
    if (!autoRotate && globeGroup && targetGlobeRotY !== null) {
      let diff = ((targetGlobeRotY - globeGroup.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      if (Math.abs(diff) < 0.004) globeGroup.rotation.y = targetGlobeRotY;
      else globeGroup.rotation.y += diff * 0.11;
    }
    if (!autoRotate && camera && targetCamY !== null) {
      camera.position.y += (targetCamY - camera.position.y) * 0.1;
    }
    stationMarkers.forEach((m, idx) => {
      const isSel = idx === selectedStationIdx;
      const sc = isSel ? 1.38 : 1.0;
      if (m.crystal) {
        if (_tmpScaleVec) { _tmpScaleVec.set(sc, sc, sc); m.crystal.scale.lerp(_tmpScaleVec, 0.12); }
        m.crystal.rotation.y += isSel ? 0.045 : 0.018;
        m.crystal.position.z = 0.72 + Math.sin(t * 3 + idx) * 0.05;
      }
      if (m.lockRing) {
        m.lockRing.visible = isSel;
        if (isSel) {
          const pulse = 1 + Math.sin(t * 5.5) * 0.2;
          m.lockRing.scale.set(pulse, pulse, 1);
          m.lockRing.rotation.z += 0.03;
        }
      }
    });
    if (controls) controls.update();
    if (renderer && scene && camera) renderer.render(scene, camera);
  }

  function clearMarkers() {
    stationMarkers.forEach(m => { if (globeGroup) globeGroup.remove(m.holder); });
    stationMarkers = [];
  }

  window.init3DWorld = function(book, activeSemester) {
    ensureScene();
    if (!globeGroup || !book) return;
    clearMarkers();
    selectedStationIdx = -1;
    autoRotate = true;
    targetGlobeRotY = null;
    targetCamY = null;

    const sem = activeSemester || book.semester || "上學期";
    if (earthMesh) applyPlanetSkin(earthMesh.material, book.planetId, book.planetColor, true);
    targetSunY = (sem === "上學期") ? 10.5 : -10.5;
    if (atmosphereMesh && atmosphereMesh.material.uniforms?.glowColor) {
      atmosphereMesh.material.uniforms.glowColor.value = new THREE.Color(book.planetColor || "#38bdf8");
    }
    if (planetRingMesh) {
      planetRingMesh.visible = (book.planetId === "planet1" || book.planetId === "planet4");
      planetRingMesh.material.color = new THREE.Color(book.planetColor || "#a78bfa");
    }

    const parentPlanet = (typeof planetData !== "undefined" && planetData[book.planetId]) ? planetData[book.planetId] : null;
    const upBook = parentPlanet?.semesters?.["上學期"] || (sem === "上學期" ? book : null);
    const dnBook = parentPlanet?.semesters?.["下學期"] || (sem === "下學期" ? book : null);

    const bothPins = [];
    if (upBook) {
      buildIslandStations(upBook).forEach((st, i, arr) => bothPins.push({ st, pinSem: "上學期", isActive: sem === "上學期", i, total: arr.length }));
    }
    if (dnBook) {
      buildIslandStations(dnBook).forEach((st, i, arr) => bothPins.push({ st, pinSem: "下學期", isActive: sem === "下學期", i, total: arr.length }));
    }

    const activePillStations = [];
    bothPins.forEach(({ st, pinSem, isActive, i, total }) => {
      const idx = stationMarkers.length;
      if (isActive) activePillStations.push({ st, idx });
      const latSign = pinSem === "上學期" ? 1 : -1;
      const lat = latSign * (18 + (i % 3) * 14);
      const lon = -180 + (360 / Math.max(1, total)) * i + (pinSem === "下學期" ? 20 : 0);
      const pos = latLonToVec3(lat, lon, 3.45);

      const holder = new THREE.Group();
      holder.position.copy(pos);
      holder.lookAt(pos.clone().multiplyScalar(2));

      // Sci-fi Landing Pad Base + Translucent Energy Beam + Floating Rotating Crystal
      const basePad = new THREE.Mesh(
        new THREE.RingGeometry(0.14, 0.26, 24),
        new THREE.MeshBasicMaterial({ color: st.color, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
      );
      basePad.position.z = 0.03;
      holder.add(basePad);

      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.11, 0.65, 12),
        new THREE.MeshBasicMaterial({ color: isActive ? st.color : 0x475569, transparent: true, opacity: isActive ? 0.6 : 0.25 })
      );
      beam.rotation.x = Math.PI / 2;
      beam.position.z = 0.34;
      holder.add(beam);

      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(isActive ? 0.24 : 0.17, 0),
        new THREE.MeshPhongMaterial({ color: isActive ? st.color : 0x64748b, emissive: isActive ? st.color : 0x1e293b, emissiveIntensity: isActive ? 0.65 : 0.15, shininess: 90 })
      );
      crystal.position.z = 0.72;
      crystal.userData.stationIdx = idx;
      holder.add(crystal);

      const hitMesh = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 12), new THREE.MeshBasicMaterial({ visible: false }));
      hitMesh.position.z = 0.72;
      hitMesh.userData.stationIdx = idx;
      holder.add(hitMesh);

      const lockRing = new THREE.Mesh(
        new THREE.RingGeometry(0.42, 0.58, 32),
        new THREE.MeshBasicMaterial({ color: 0xfde047, side: THREE.DoubleSide, transparent: true, opacity: 0.92 })
      );
      lockRing.position.z = 0.72;
      lockRing.visible = false;
      holder.add(lockRing);

      const labelSp = makeLabelSprite((isActive ? "" : "🌙 ") + st.title, isActive ? "#fde047" : "#475569");
      if (!isActive) labelSp.material.opacity = 0.55;
      labelSp.position.z = 1.38;
      labelSp.userData.stationIdx = idx;
      holder.add(labelSp);

      globeGroup.add(holder);
      stationMarkers.push({ holder, crystal, hitMesh, lockRing, labelSp, station: st, pinSem: pinSem, isActive: isActive });
    });

    if (camera) camera.position.set(0, sem === "上學期" ? 2.8 : -2.2, 13.0);

    const bar = document.getElementById("globe-unit-pills");
    if (bar) {
      bar.innerHTML = activePillStations.map(({ st, idx }) => `
        <button type="button" onclick="focusUnitOnGlobe(${idx}, false)" id="globe-pill-${idx}"
          class="px-3.5 py-2 rounded-full text-xs font-black border transition-all nova-btn-3d bg-slate-900/85 text-sky-100 border-sky-500/40 hover:border-amber-300 cursor-pointer">
          ${st.icon} ${st.title}
        </button>`).join("");
    }

    if (activePillStations.length) focusUnitOnGlobe(activePillStations[0].idx, false);
  };

  window.focusUnitOnGlobe = function(idx, openModal) {
    if (!stationMarkers[idx]) return;
    selectedStationIdx = idx;
    autoRotate = false;
    const m = stationMarkers[idx];

    document.querySelectorAll("[id^='globe-pill-']").forEach(el => {
      el.classList.remove("bg-amber-400", "text-slate-950", "border-amber-300", "shadow-lg");
      el.classList.add("bg-slate-900/85", "text-sky-100", "border-sky-500/40");
    });
    const activePill = document.getElementById(`globe-pill-${idx}`);
    if (activePill) {
      activePill.classList.remove("bg-slate-900/85", "text-sky-100", "border-sky-500/40");
      activePill.classList.add("bg-amber-400", "text-slate-950", "border-amber-300", "shadow-lg");
    }

    if (globeGroup) {
      const p = m.holder.position;
      targetGlobeRotY = -Math.atan2(p.x, p.z);
      targetCamY = p.y >= 0 ? 3.2 : -2.6;
    }

    const banner = document.getElementById("globe-ceremony-banner");
    if (banner) {
      banner.style.display = "flex";
      banner.innerHTML = `<span>🎯 星艦雷達已鎖定 <b>${m.station.icon} ${m.station.title}</b> — 請點擊地球儀上的 <b>3D 水晶標籤</b> 登陸！</span>`;
    }

    if (openModal) {
      playCeremonyTone("land");
      openUnitStationModal(m.station);
    } else if (selectedStationIdx >= 0) {
      playCeremonyTone("lock");
    }
  };

  window.openUnitStationModal = function(stationObj) {
    window._lastActiveStationObj = stationObj;
    activeStationObj = stationObj;
    activeSubUnitIdx = 0;
    const modal = document.getElementById("unit-station-modal");
    if (!modal || !stationObj) return;
    document.getElementById("station-modal-title").innerText = `${stationObj.icon} ${stationObj.title}`;
    document.getElementById("station-modal-desc").innerText = stationObj.desc || "";
    renderStationModalSubUnits();
    modal.style.display = "flex";
  };

  window.closeUnitStationModal = function() {
    if (typeof stopAllPracticeAudio === "function") stopAllPracticeAudio();
    const modal = document.getElementById("unit-station-modal");
    if (modal) modal.style.display = "none";
    if (typeof window.resumeNova3DLoops === "function") window.resumeNova3DLoops();
  };

  function getSubUnitFilteredCounts(sub) {
    const fn = typeof matchesGlobalEdition === "function" ? matchesGlobalEdition : () => true;
    const fw = (sub?.words || []).filter(fn);
    const fs = (sub?.sentences || []).filter(fn);
    return { fw, fs, total: fw.length + fs.length };
  }

  window.selectStationSubUnit = function(subIdx) {
    if (!activeStationObj) return;
    const subs = activeStationObj.subUnits || [];
    const target = subs[subIdx];
    if (!target || getSubUnitFilteredCounts(target).total === 0) return;
    activeSubUnitIdx = subIdx;
    renderStationModalSubUnits();
  };

  window.renderStationModalSubUnits = function() {
    if (!activeStationObj) return;
    const subs = activeStationObj.subUnits || [];
    const subBar = document.getElementById("station-modal-subunits");
    const actBox = document.getElementById("station-modal-actions");
    const metaEl = document.getElementById("station-modal-submeta");

    const counts = subs.map(s => getSubUnitFilteredCounts(s));
    if (subs.length && (!subs[activeSubUnitIdx] || counts[activeSubUnitIdx]?.total === 0)) {
      const firstAvail = counts.findIndex(c => c.total > 0);
      if (firstAvail >= 0) activeSubUnitIdx = firstAvail;
    }

    if (subBar) {
      subBar.innerHTML = subs.map((s, i) => {
        const cnt = counts[i]?.total || 0;
        const isEmpty = cnt === 0;
        const label = escapeHtml(s.subLabel || s.title);
        if (isEmpty) {
          return `
        <button type="button" disabled aria-disabled="true" title="此版本在本單元無收錄內容"
          class="px-3.5 py-2 rounded-xl text-xs font-black border transition opacity-40 bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed">
          ${label}（無資料）
        </button>`;
        }
        return `
        <button type="button" onclick="selectStationSubUnit(${i})"
          class="px-3.5 py-2 rounded-xl text-xs font-black border transition ${
            i === activeSubUnitIdx ? "bg-sky-600 text-white border-sky-500 shadow" : "bg-slate-100 text-slate-700 border-slate-200 hover:border-sky-400"
          }">
          ${label}
        </button>`;
      }).join("");
    }

    const curSub = subs[activeSubUnitIdx];
    if (!curSub) return;
    selectedUnitObj = curSub;
    currentUnitKey = curSub.title;

    const isSentenceType = curSub.subType === "sentence" || (!curSub.words.length && curSub.sentences.length > 0);
    const curCounts = counts[activeSubUnitIdx] || getSubUnitFilteredCounts(curSub);
    const fWords = curCounts.fw;
    const fSents = curCounts.fs;
    const edLabel = (typeof currentEditionFilter !== "undefined" && currentEditionFilter !== "ALL") ? ` [${currentEditionFilter}]` : "";
    if (metaEl) {
      metaEl.innerText = isSentenceType
        ? `目前子單元${edLabel}：${curSub.title}（共 ${fSents.length} 句）`
        : `目前子單元${edLabel}：${curSub.title}（共 ${fWords.length} 個字詞）`;
    }

    if (actBox && curCounts.total === 0) {
      actBox.innerHTML = `<div class="col-span-full p-5 rounded-2xl bg-slate-100 border border-slate-200 text-center text-sm font-bold text-slate-400">此版本在本單元暫無收錄內容，請切換其他單元或選擇「全部綜合」。</div>`;
      return;
    }

    if (actBox) {
      if (isSentenceType) {
        actBox.innerHTML = `
          <button type="button" onclick="launchStationActivity('sentence_cards')" class="p-4 rounded-2xl nova-btn-3d bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm shadow transition flex flex-col items-center gap-1">
            <span class="text-2xl">🃏</span><span>閃卡活動</span><span class="text-[11px] font-bold opacity-80">句型卡＋標準發音</span>
          </button>
          <button type="button" onclick="launchStationActivity('listen_sentence')" class="p-4 rounded-2xl nova-btn-3d bg-violet-600 hover:bg-violet-500 text-white font-black text-sm shadow transition flex flex-col items-center gap-1">
            <span class="text-2xl">🎧</span><span>單元測驗：聽音辨句</span><span class="text-[11px] font-bold opacity-80">聽語音選英文句子</span>
          </button>
          <button type="button" onclick="launchStationActivity('listen_zh')" class="p-4 rounded-2xl nova-btn-3d bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow transition flex flex-col items-center gap-1">
            <span class="text-2xl">🀄</span><span>單元測驗：聽音選中字</span><span class="text-[11px] font-bold opacity-80">聽語音選中文翻譯</span>
          </button>`;
      } else {
        actBox.innerHTML = `
          <button type="button" onclick="launchStationActivity('vocab_cards')" class="p-4 rounded-2xl nova-btn-3d bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm shadow transition flex flex-col items-center gap-1">
            <span class="text-2xl">🃏</span><span>閃卡活動</span><span class="text-[11px] font-bold opacity-80">圖卡＋中英＋發音</span>
          </button>
          <button type="button" onclick="launchStationActivity('listen_image')" class="p-4 rounded-2xl nova-btn-3d bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow transition flex flex-col items-center gap-1">
            <span class="text-2xl">🖼️</span><span>單元測驗：聽音辨圖</span><span class="text-[11px] font-bold opacity-80">聽發音選正確圖卡</span>
          </button>
          <button type="button" onclick="launchStationActivity('listen_word')" class="p-4 rounded-2xl nova-btn-3d bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow transition flex flex-col items-center gap-1">
            <span class="text-2xl">🔤</span><span>單元測驗：聽音辨字</span><span class="text-[11px] font-bold opacity-80">聽發音選英文單字</span>
          </button>`;
      }
    }
  }

  window.launchStationActivity = function(act) {
    const curSub = activeStationObj?.subUnits?.[activeSubUnitIdx];
    if (!curSub) return;
    closeUnitStationModal();
    const fWords = (curSub.words || []).filter(it => typeof matchesGlobalEdition === "function" ? matchesGlobalEdition(it) : true);
    const fSents = (curSub.sentences || []).filter(it => typeof matchesGlobalEdition === "function" ? matchesGlobalEdition(it) : true);
    if (["vocab_cards", "listen_image", "listen_word"].includes(act) && !fWords.length) {
      alert("此版本目前於該子單元無收錄單字，請切換其他子單元或點選「全部綜合」！");
      return;
    }
    if (["sentence_cards", "listen_sentence", "listen_zh"].includes(act) && !fSents.length) {
      alert("此版本目前於該子單元無收錄句型，請切換其他子單元或點選「全部綜合」！");
      return;
    }
    if (act === "vocab_cards") {
      currentVocabList = fWords; currentUnitKey = curSub.title; showModule("vocab");
      if (typeof showVocabCards === "function") showVocabCards(currentVocabList);
    } else if (act === "listen_image") {
      currentVocabList = fWords; currentUnitKey = curSub.title; showModule("vocab");
      if (typeof startListenToImageQuiz === "function") startListenToImageQuiz(currentVocabList);
    } else if (act === "listen_word") {
      currentVocabList = fWords; currentUnitKey = curSub.title; showModule("vocab");
      if (typeof startListenToWordQuiz === "function") startListenToWordQuiz(currentVocabList);
    } else if (act === "sentence_cards") {
      currentSentenceList = fSents; currentUnitKey = curSub.title; showModule("sentence");
      if (typeof startSentencePractice === "function") startSentencePractice(currentSentenceList);
    } else if (act === "listen_sentence") {
      currentSentenceList = fSents; currentUnitKey = curSub.title; showModule("sentence");
      if (typeof startListenToSentenceQuiz === "function") startListenToSentenceQuiz(currentSentenceList);
    } else if (act === "listen_zh") {
      currentSentenceList = fSents; currentUnitKey = curSub.title; showModule("sentence");
      if (typeof startListenToChineseQuiz === "function") startListenToChineseQuiz(currentSentenceList);
    }
  };

  window.stepGlobeUnit = function(delta) {
    if (!stationMarkers.length) return;
    focusUnitOnGlobe((selectedStationIdx + delta + stationMarkers.length) % stationMarkers.length, false);
  };

  window.resetGlobeOverview = function() {
    autoRotate = true;
    targetGlobeRotY = null; targetCamY = null;
    if (controls && camera) { camera.position.set(0, 2.2, 13.0); controls.target.set(0, 0, 0); }
  };

  window.refresh3DWorldProgress = function() {};
  window.resumeNova3DLoops = function() {
    if (gInitialized && !galaxyRafId) animateGalaxy();
    if (isInitialized && !planetRafId) animate();
    window.dispatchEvent(new Event("resize"));
  };
})();

function backToActiveUnitModal() {
  if (typeof stopAllPracticeAudio === "function") stopAllPracticeAudio();
  showModule("world");
  if (typeof openUnitStationModal === "function" && window._lastActiveStationObj) {
    openUnitStationModal(window._lastActiveStationObj);
  }
}
