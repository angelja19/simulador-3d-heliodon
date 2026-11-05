/* Utilidades de geometría, materiales, cables y registro de componentes.
   Unidades: el modelo se escribe en milímetros (como SolidWorks) y la escena trabaja en metros (mm / 1000).
   Ejes: X = Este, Y = arriba, Z = Sur (−Z = Norte); origen en el piso bajo el centro de la mesa. */
(function () {
  const H = (window.H = window.H || {});
  const mm = (v) => v / 1000;
  H.mm = mm;
  H.v3 = (x, y, z) => new THREE.Vector3(mm(x), mm(y), mm(z));

  // ------------------------------------------------------------------ materiales (uno por pieza: permite resaltar)
  H.material = function (color, op = {}) {
    return new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55, metalness: 0.1 }, op));
  };
  H.COL = {
    tubo: 0x1d1e22, metal: 0xa9adb3, alu: 0xc9ccd1, acero: 0x6d7178, negro: 0x151518, goma: 0x222224, rojo: 0xd4372c,
    blanco: 0xf2f2ef, crema: 0xeee6d2, mdf: 0xe9e7e1, abs: 0x3a3d43, pcbAzul: 0x1f4fb5, pcbVerde: 0x1e7a46,
    pcbMorado: 0x3a2f8f, laton: 0xc8a74a, techo: 0xb85a3c, vidrio: 0x9fd4ff, madera: 0xb08458, foco: 0xfff2c8,
  };

  // ------------------------------------------------------------------ medidas del ensamble de SolidWorks (diseño del 05/11/2026)
  // Salen de datos_generados.js (DATOS_ENSAMBLE: cajas de cada componente y recorridos de los cables); si faltan se usan
  // los valores del diseño: estructura 1200 x 950 sin diagonales con marco cuadrado a 520 mm, caja colgada del tubo 105.
  const ENS = window.DATOS_ENSAMBLE || {};
  const DIS = ENS.diseno || {};
  const est = DIS.estructura || {};
  const cj = DIS.caja || {};
  H.DIM = {
    largo: est.largo || 1200, ancho: est.ancho || 950,
    zLarg: (est.z_largueros || [435, 475]).reduce((a, b) => a + b) / 2,        // eje de los largueros (455)
    zLargIn: (est.z_largueros || [435, 475])[0],                                 // cara interior (435)
    zMont: (est.z_montantes || [400, 440]).reduce((a, b) => a + b) / 2,         // eje de los montantes (420)
    zMontIn: (est.z_montantes || [400, 440])[0], zMontOut: (est.z_montantes || [400, 440])[1],
    yMarco: est.y_marco_medio || 520,
    xRueda: est.x_ruedas || 550, zRueda: est.z_ruedas || 455,
    caja: { x: cj.x || [25, 225], y: cj.y || [682, 822], z: cj.z || [-70, 70], bisagra: cj.bisagra || [21, 76],
      abrazaderas: cj.abrazaderas_x || [[95, 115], [195, 215]] },
    usbPanel: DIS.usb_panel || [-600, 230, -420], pg9: DIS.prensaestopas_220V || [600, 300, 420],
    masa: ENS.masa_kg || null,
    // radio de la mesa giratoria 302 (Ø640 desde el 05/11/2026: recortada para el aro a 90° N / 90° S)
    rMesa: (((ENS.componentes || []).find((c) => /^302_/.test(c.archivo)) || {}).caja || [0, 0, 0, 320])[3],
    latMax: 90,                              // el aro se inclina de 90° N a 90° S (límite simétrico en SolidWorks)
    // tubos de la estructura 25x25x2 desde el 05/11/2026 (antes 40x40 y 30x30)
    tubo: (est.tubo || [25, 2])[0],
    xCab: (est.x_caballetes || [575, 600]).reduce((a, b) => a + b) / 2,      // eje de los caballetes (587,5)
    yBase: (est.y_base || [144, 169]).reduce((a, b) => a + b) / 2,           // eje de la base (156,5)
    yBaseTop: (est.y_base || [144, 169])[1],
    yTS: (est.y_travesano_sup || [865, 890]).reduce((a, b) => a + b) / 2,    // travesaño superior (877,5)
    y105: (est.y_tubo_105 || [840, 865]).reduce((a, b) => a + b) / 2,        // tubo 105 (852,5)
    xCh: est.x_chumaceras || 584, yChBase: est.y_chumacera_base || 890,
  };
  /** Desplazamiento de la caja del Arduino: la caja y su interior se dibujan en coordenadas locales (x −100..100,
   *  y 180..320) y el grupo se coloca en su lugar real colgado del tubo 105 (x 25..225, y 682..822). */
  H.DIM.cajaOff = [H.DIM.caja.x[0] + 100, H.DIM.caja.y[0] - 180, 0];
  /** Punto local de la caja (mm) -> punto global (mm). */
  H.G = (p) => [p[0] + H.DIM.cajaOff[0], p[1] + H.DIM.cajaOff[1], p[2] + H.DIM.cajaOff[2]];
  /** Punto global (mm) -> punto local de la caja (mm). */
  H.L = (p) => [p[0] - H.DIM.cajaOff[0], p[1] - H.DIM.cajaOff[1], p[2] - H.DIM.cajaOff[2]];
  /** Recorrido de un cable modelado en SolidWorks (pieza '308d', '310', '311', '312'; k = número de cable en la pieza). */
  H.rutaSW = function (pieza, k = 0, respaldo = null) {
    const c = DIS.cables && DIS.cables[pieza] && DIS.cables[pieza][k];
    return c ? c.puntos.map((p) => p.slice()) : respaldo;
  };
  H.largoSW = function (pieza, k = 0) {
    const c = DIS.cables && DIS.cables[pieza] && DIS.cables[pieza][k];
    return c ? c.largo_mm : null;
  };
  /** Caja (mm) de todos los componentes del ensamble cuyo archivo empieza por 'pref'. */
  H.cajaSW = function (pref) {
    const cs = (ENS.componentes || []).filter((c) => c.archivo.startsWith(pref) && c.caja);
    if (!cs.length) return null;
    const b = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
    cs.forEach((c) => { for (let i = 0; i < 3; i++) { b[i] = Math.min(b[i], c.caja[i]); b[i + 3] = Math.max(b[i + 3], c.caja[i + 3]); } });
    return b;
  };

  // ------------------------------------------------------------------ registro de componentes
  H.comps = {};          // id -> entrada
  H.pickables = [];      // mallas que responden al mouse
  H.registrar = function (id, info) {
    const e = H.comps[id] || (H.comps[id] = { id, objetos: [] });
    Object.assign(e, info);
    return e;
  };
  H.marcar = function (obj, id, pick = true) {
    const e = H.comps[id];
    if (!e) throw new Error("componente sin registrar: " + id);
    e.objetos.push(obj);
    obj.traverse((o) => {
      o.userData.comp = id;
      if (o.isMesh && pick) H.pickables.push(o);
    });
    return obj;
  };

  /** Pantalla angosta (celular): el ángulo de visión horizontal es menor, la cámara se aleja en esa proporción. */
  H.movil = () => window.matchMedia("(max-width: 700px)").matches;
  H.factorPantalla = () => { const a = window.innerWidth / window.innerHeight; return a < 1 ? Math.min(2.3, 0.9 / a) : 1; };
  /** Marca un objeto (y sus hijos) como subpieza mecánica: el modo «Piezas» la puede aislar sola (un tubo, el pin...). */
  H.tagPieza = function (obj, clave) { obj.traverse((o) => { o.userData.piezaTag = clave; }); return obj; };

  // ------------------------------------------------------------------ primitivas en mm
  H.caja = function (x0, y0, z0, x1, y1, z1, mat) {
    const g = new THREE.BoxGeometry(mm(Math.abs(x1 - x0)), mm(Math.abs(y1 - y0)), mm(Math.abs(z1 - z0)));
    const m = new THREE.Mesh(g, mat);
    m.position.set(mm((x0 + x1) / 2), mm((y0 + y1) / 2), mm((z0 + z1) / 2));
    m.castShadow = m.receiveShadow = true;
    return m;
  };
  /** Cilindro entre dos puntos (mm). */
  H.cilindro = function (p0, p1, r, mat, seg = 18) {
    const a = H.v3(...p0), b = H.v3(...p1);
    const largo = a.distanceTo(b);
    const g = new THREE.CylinderGeometry(mm(r), mm(r), largo, seg);
    const m = new THREE.Mesh(g, mat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    m.castShadow = m.receiveShadow = true;
    return m;
  };
  /** Tubo cuadrado (perfil lado x lado) entre dos puntos (mm): para los tubos de la estructura. */
  H.tuboCuadrado = function (p0, p1, lado, mat) {
    const a = H.v3(...p0), b = H.v3(...p1);
    const largo = a.distanceTo(b);
    const g = new THREE.BoxGeometry(mm(lado), largo, mm(lado));
    const m = new THREE.Mesh(g, mat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    m.castShadow = m.receiveShadow = true;
    return m;
  };

  // ------------------------------------------------------------------ cables
  /** Recorrido con esquinas redondeadas (puntos en mm) -> curva en metros. */
  H.ruta = function (pts, radio = 12) {
    const P = pts.map((p) => H.v3(...p));
    const out = [P[0]];
    for (let i = 1; i < P.length - 1; i++) {
      const a = P[i - 1], b = P[i], c = P[i + 1];
      const d1 = b.clone().sub(a), d2 = c.clone().sub(b);
      const r = Math.min(mm(radio), d1.length() / 2.2, d2.length() / 2.2);
      const p1 = b.clone().sub(d1.normalize().multiplyScalar(r));
      const p2 = b.clone().add(d2.normalize().multiplyScalar(r));
      for (let k = 0; k <= 4; k++) {          // curva de Bézier cuadrática en la esquina
        const t = k / 4;
        const q = p1.clone().multiplyScalar((1 - t) * (1 - t)).add(b.clone().multiplyScalar(2 * (1 - t) * t)).add(p2.clone().multiplyScalar(t * t));
        out.push(q);
      }
    }
    out.push(P[P.length - 1]);
    // quita puntos repetidos
    const lim = [out[0]];
    for (const p of out.slice(1)) if (p.distanceTo(lim[lim.length - 1]) > 1e-5) lim.push(p);
    return new THREE.CatmullRomCurve3(lim, false, "centripetal");
  };
  H.cable = function (curva, radio, color, segmentos) {
    const n = segmentos || Math.max(24, Math.min(600, Math.round(curva.getLength() / 0.006)));
    const g = new THREE.TubeGeometry(curva, n, mm(radio), 8, false);
    const m = new THREE.Mesh(g, H.material(color, { roughness: 0.45 }));
    m.castShadow = true;
    return m;
  };
  /** Cable colgante entre dos puntos (m) con una flecha (catenaria aproximada). */
  H.curvaColgante = function (a, b, caida) {
    const pts = [];
    for (let k = 0; k <= 16; k++) {
      const t = k / 16;
      const p = a.clone().lerp(b, t);
      p.y -= caida * 4 * t * (1 - t);
      pts.push(p);
    }
    return new THREE.CatmullRomCurve3(pts);
  };

  // ------------------------------------------------------------------ textos (canvas)
  H.textura = function (dibujar, w = 256, h = 128) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    dibujar(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 4;
    return t;
  };
  /** Plano con texto (ancho en mm), mirando a +Z local. */
  H.cartel = function (texto, anchoMm, color = "#1d1d1f", fondo = null, px = 64) {
    const tex = H.textura((g, w, h) => {
      if (fondo) { g.fillStyle = fondo; g.fillRect(0, 0, w, h); }
      g.fillStyle = color;
      g.font = `600 ${px}px -apple-system, "Segoe UI", Arial, sans-serif`;
      g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText(texto, w / 2, h / 2 + 2);
    }, 256, 128);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(mm(anchoMm), mm(anchoMm / 2)),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    return m;
  };
})();
