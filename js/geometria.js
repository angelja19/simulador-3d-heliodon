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

  // ------------------------------------------------------------------ medidas del ensamble de SolidWorks (caballetes en A, 10-11/11/2026)
  // Salen de a\macros\diseno_caballetes_A.json y de verificacion.txt (45_verificar_A.py y 49_verificar_cables.py).
  // Estructura de 1200 x 1050 mm en tubo galvanizado 40 x 40 x 1,2: una A en cada extremo (Este y Oeste), unidas
  // solo por el tubo superior E-O (105, bajo la mesa) y dos tubos inferiores a ras del piso (113). Centro libre.
  H.DIM = {
    largo: 1200, ancho: 1050, tubo: 40, pared: 1.2,
    xA: 580, xA0: 560, xA1: 600,                 // eje de las A (x 560..600)
    yBase: 162, yBase0: 142, yBase1: 182, zBase: 525,
    zPie: 465, yPunta: 899.7, yPlaca: [899.7, 901.7], anguloPata: 32.94, largoPata: 855.2,
    yTrav: 380, yTrav0: 360, yTrav1: 400,          // travesaño de cada A
    ySup: 845, ySup0: 825, ySup1: 865,             // tubo superior E-O (105)
    zInf: 470, xRueda: 540, zRueda: 470,           // tubos inferiores (113) y ruedas
    yEje: 935, rMesa: 350, yMesa0: 882, yMesa1: 900, rAro: 480, dAro: 38,
    caja: { x: [420, 560], y: [310, 450], z: [-100, 100] },
    latMax: 90, masa: 35.02,
  };
  /** |z| del eje de una pata de la A a la altura y (mm): del pie (z 465, y 182) a la punta (z 0, y 899,7). */
  H.zPata = (y) => (465 * (899.7 - y)) / 717.7;
  /** Largo (mm) de una polilínea en mm. */
  H.largoPoli = (pts) => pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1], p[2] - pts[i][2]), 0);
  /** Punto a la mitad (por largo) de una polilínea en mm. */
  H.mitadPoli = function (pts) {
    const L = H.largoPoli(pts) / 2;
    let acc = 0;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      if (acc + d >= L && d > 0) { const t = (L - acc) / d; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
      acc += d;
    }
    return pts[pts.length - 1].slice();
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
