/* Modelo 3D del heliodón pequeño con las medidas del ensamble de SolidWorks (mm).
   Grupos: estructura (fija), mecanismo (chumaceras, graduador y aro que se inclina), mesa (plato + mesa),
   maqueta (gira y se levanta), caja (en electronica.js). Cada malla lleva userData.capa para las vistas. */
(function () {
  const H = window.H;
  const { mm, caja, cilindro, tuboCuadrado, material, COL, registrar, marcar } = H;
  const tag = H.tagPieza;          // marca una subpieza (un tubo, el pin...) para el modo «Piezas»
  const R_ARO = 480, Y_EJE = 935, Y_MESA = 900;
  H.R_ARO = R_ARO; H.Y_EJE = Y_EJE; H.Y_MESA = Y_MESA;

  function capa(obj, nombre) { obj.traverse((o) => { o.userData.capa = nombre; }); return obj; }
  H.capa = capa;
  function grupo(padre, nombre) { const g = new THREE.Group(); g.name = nombre; padre.add(g); return g; }

  H.construirModelo = function (escena) {
    const ref = (H.ref = H.ref || {});
    const raiz = grupo(escena, "heliodon");
    ref.raiz = raiz;

    // ================================================================== ESTRUCTURA (100)
    const est = grupo(raiz, "estructura");
    ref.estructura = est;
    const mTubo = () => material(COL.tubo, { roughness: 0.42, metalness: 0.35 });

    // estructura de 1200 x 950 (SolidWorks 05/11/2026): sin diagonales; el travesaño medio a 520 mm sigue por las
    // caras Norte y Sur (pieza 111) y forma un marco cuadrado cerrado con los montantes
    const D = H.DIM;
    const TB = D.tubo, XC = D.xCab;
    registrar("101", H.infoSW("101_Base_Rectangular", { grupo: "Estructura", conexion: `Tubo ${TB}x${TB}: largueros a ±${D.zLarg} mm, ancho total ${D.ancho} mm` }));
    const base = new THREE.Group();
    for (const z of [-D.zLarg, D.zLarg]) base.add(tag(tuboCuadrado([-600, D.yBase, z], [600, D.yBase, z], TB, mTubo()), z < 0 ? "101-LN" : "101-LS"));
    for (const x of [-XC, XC]) base.add(tag(tuboCuadrado([x, D.yBase, -D.zLargIn], [x, D.yBase, D.zLargIn], TB, mTubo()), x < 0 ? "101-CO" : "101-CE"));
    est.add(marcar(capa(base, "estructura"), "101"));
    // 112: placas adaptadoras de 4 mm bajo las esquinas (la placa de la rueda ya no entra bajo un tubo de 25)
    registrar("112", H.infoSW("112_Placas_Adaptadoras_Ruedas", { grupo: "Estructura",
      conexion: "Soldadas bajo las esquinas de la base; la placa de cada rueda se atornilla a ellas con 4 pernos M8" }));
    const placas = new THREE.Group();
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const x0 = sx * (D.xRueda - 60), x1 = sx * 600, z0 = sz * (D.zRueda - 45), z1 = sz * 475;
      placas.add(tag(caja(Math.min(x0, x1), 140, Math.min(z0, z1), Math.max(x0, x1), 144, Math.max(z0, z1), mTubo()), "112"));
    }
    est.add(marcar(capa(placas, "estructura"), "112"));

    const caballetes = {};
    for (const [cod, x, nom] of [["102", XC, "102_Caballete_Este"], ["103", -XC, "103_Caballete_Oeste"]]) {
      registrar(cod, H.infoSW(nom, { grupo: "Estructura", conexion: `Tubo ${TB}x${TB}, sin diagonales: el travesaño medio (520 mm) es parte del marco cuadrado` }));
      const g = new THREE.Group();
      for (const z of [-D.zMont, D.zMont]) g.add(tag(tuboCuadrado([x, D.yBaseTop, z], [x, D.yTS - TB / 2, z], TB, mTubo()), cod + (z < 0 ? "-MN" : "-MS")));
      g.add(tag(tuboCuadrado([x, D.yTS, -D.zMontOut], [x, D.yTS, D.zMontOut], TB, mTubo()), cod + "-TS"));
      g.add(tag(tuboCuadrado([x, D.yMarco, -D.zMontIn], [x, D.yMarco, D.zMontIn], TB, mTubo()), cod + "-TM"));
      est.add(marcar(capa(g, "estructura"), cod));
      caballetes[cod] = g;
    }
    ref.caballetes = caballetes;

    registrar("111", H.infoSW("111_Marco_Medio_Norte_Sur", { grupo: "Estructura",
      conexion: "Soldado a los 4 montantes a 520 mm: con los travesaños medios de 102 y 103 cierra el marco cuadrado" }));
    const marco = new THREE.Group();
    for (const z of [-D.zMont, D.zMont]) marco.add(tag(tuboCuadrado([-(XC - TB / 2), D.yMarco, z], [XC - TB / 2, D.yMarco, z], TB, mTubo()), z < 0 ? "111-N" : "111-S"));
    est.add(marcar(capa(marco, "estructura"), "111"));
    ref.marcoMedio = marco;

    registrar("105", H.infoSW("105_Tubo_Unico_Este_Oeste", { grupo: "Estructura",
      conexion: "Sostiene el plato de la mesa; de él cuelga la caja del Arduino y por dentro van los cables" }));
    est.add(marcar(capa(tuboCuadrado([-600, D.y105, 0], [600, D.y105, 0], TB, mTubo()), "estructura"), "105"));
    registrar("106", H.infoSW("106_Travesano_Caja_Arduino", { grupo: "Estructura" }));
    est.add(marcar(capa(tuboCuadrado([0, D.yBase, -D.zLargIn], [0, D.yBase, D.zLargIn], TB, mTubo()), "estructura"), "106"));

    // ruedas (107a placa, 107b horquilla, 107c llanta, 107d palanca de freno) + pernos 108 / tuercas 110
    const ruedas = grupo(raiz, "ruedas");
    ref.ruedas = ruedas;
    registrar("107a", H.infoSW("107a_Rueda_Placa_Montaje", { grupo: "Estructura" }));
    registrar("107b", H.infoSW("107b_Rueda_Horquilla_Freno", { grupo: "Estructura" }));
    registrar("107c", H.infoSW("107c_Rueda_Llanta_D100", { grupo: "Estructura", funcion: "Rueda giratoria Ø100 con freno: el heliodón se puede mover y frenar." }));
    registrar("107d", H.infoSW("107d_Rueda_Palanca_Freno", { grupo: "Estructura", funcion: "Palanca del freno de la rueda: abajo = frenada (0–20°)." }));
    registrar("108", H.infoSW("108_Perno_Hex_M8x20", { grupo: "Estructura" }));
    registrar("110", H.infoSW("110_Tuerca_Hex_M8", { grupo: "Estructura" }));
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const cx = sx * D.xRueda, cz = sz * D.zRueda, ax = cx - sx * 35;
      ruedas.add(marcar(capa(caja(cx - 50, 126, cz - 35, cx + 50, 140, cz + 35, material(COL.metal, { metalness: 0.6, roughness: 0.35 })), "estructura"), "107a"));
      const h = new THREE.Group();
      h.add(caja(cx - 30, 110, cz - 22, cx + 30, 126, cz + 22, material(COL.acero, { metalness: 0.6 })));
      for (const dz of [-19, 19]) h.add(caja(ax - 12, 40, cz + dz - 3, cx + 12, 112, cz + dz + 3, material(COL.acero, { metalness: 0.6 })));
      ruedas.add(marcar(capa(h, "estructura"), "107b"));
      const ll = new THREE.Group();
      const neum = cilindro([ax, 50, cz - 16], [ax, 50, cz + 16], 50, material(COL.goma, { roughness: 0.9 }), 28);
      const cubo = cilindro([ax, 50, cz - 17], [ax, 50, cz + 17], 20, material(COL.alu, { metalness: 0.6 }), 20);
      ll.add(neum, cubo);
      ruedas.add(marcar(capa(ll, "estructura"), "107c"));
      ruedas.add(marcar(capa(caja(cx + 31 * sx - 12, 104, cz - 10, cx + 31 * sx + 12, 110, cz + 10, material(COL.rojo)), "estructura"), "107d"));
      for (const dx of [-38, 38]) for (const dz of [-9, 9]) {
        ruedas.add(marcar(capa(cilindro([cx + dx, 126, cz + dz], [cx + dx, 131, cz + dz], 6.5, material(COL.metal, { metalness: 0.7 }), 6), "estructura"), "108"));
        ruedas.add(marcar(capa(cilindro([cx + dx, 144, cz + dz], [cx + dx, 150.5, cz + dz], 6.5, material(COL.metal, { metalness: 0.7 }), 6), "estructura"), "110"));
      }
    }

    // ================================================================== MECANISMO (200)
    const mec = grupo(raiz, "mecanismo");
    ref.mecanismo = mec;
    registrar("203", H.infoSW("203_Chumacera_D18", { grupo: "Mecanismo" }));
    registrar("109", H.infoSW("109_Perno_Hex_M8x60", { grupo: "Estructura" }));
    for (const x of [-H.DIM.xCh, H.DIM.xCh]) {
      const ch = new THREE.Group();
      ch.add(caja(x - 15, H.DIM.yChBase, -50, x + 15, 925, 50, material(COL.acero, { metalness: 0.5 })));   // con suplemento de 15 mm
      ch.add(cilindro([x - 15, Y_EJE, 0], [x + 15, Y_EJE, 0], 20, material(COL.acero, { metalness: 0.5 }), 24));
      mec.add(marcar(capa(ch, "mecanismo"), "203"));
      for (const z of [-38, 38]) mec.add(marcar(capa(cilindro([x, 853, z], [x, 931, z], 4, material(COL.metal, { metalness: 0.7 }), 6), "mecanismo"), "109"));
    }
    // graduador de latitud 207a (fijo al caballete Este): media placa con agujeros cada 5°
    registrar("207a", H.infoSW("207a_Graduador_Latitud_Placa", { grupo: "Mecanismo", conexion: "Agujeros cada 5° de 90° N a 90° S" }));
    const grad = new THREE.Group();
    const forma = new THREE.Shape();
    forma.absarc(0, 0, mm(130), Math.PI, 2 * Math.PI, false);
    forma.lineTo(mm(-130), 0);
    const gPlaca = new THREE.ExtrudeGeometry(forma, { depth: mm(5), bevelEnabled: false, curveSegments: 40 });
    const placa = new THREE.Mesh(gPlaca, material(COL.alu, { metalness: 0.55, roughness: 0.3 }));
    placa.rotation.y = Math.PI / 2;               // plano YZ
    placa.position.set(mm(600), mm(Y_EJE), 0);
    placa.castShadow = true;
    grad.add(placa);
    for (let g = -90; g <= 90; g += 5) {
      const a = (g * Math.PI) / 180;
      const y = Y_EJE - 115 * Math.cos(a), z = -115 * Math.sin(a);
      grad.add(cilindro([605, y, z], [606, y, z], g % 30 === 0 ? 4 : 2.6, material(COL.negro), 10));
      if (g % 30 === 0) {
        const t = H.cartel(g === 0 ? "0°" : Math.abs(g) + (g > 0 ? "N" : "S"), 34, "#1d1d1f");
        t.position.set(mm(606.5), mm(Y_EJE - 92 * Math.cos(a)), mm(-92 * Math.sin(a)));
        t.rotation.y = Math.PI / 2;
        grad.add(t);
      }
    }
    mec.add(marcar(capa(grad, "mecanismo"), "207a"));

    // aro que se inclina (pivote en el eje E-O a 35 mm sobre la mesa)
    const aroPivot = grupo(mec, "aroPivot");
    aroPivot.position.set(0, mm(Y_EJE), 0);
    ref.aroPivot = aroPivot;
    registrar("201", H.infoSW("201_Medio_Aro_Horas_R480", { grupo: "Mecanismo", conexion: "Escala de 6 a 18 h (15° por hora)" }));
    const fAro = new THREE.Shape();
    fAro.absarc(0, 0, mm(495), 0, Math.PI, false);
    fAro.absarc(0, 0, mm(465), Math.PI, 0, true);
    const aro = new THREE.Mesh(new THREE.ExtrudeGeometry(fAro, { depth: mm(5), bevelEnabled: false, curveSegments: 90 }),
      material(COL.alu, { metalness: 0.65, roughness: 0.28 }));
    aro.position.z = mm(-2.5);
    aro.castShadow = true;
    const aroG = new THREE.Group();
    aroG.add(aro);
    for (let h = 6; h <= 18; h += 0.5) {
      const a = Math.PI / 2 + ((h - 12) * 15 * Math.PI) / 180;
      const entera = Number.isInteger(h);
      const marca = new THREE.Mesh(new THREE.BoxGeometry(mm(2), mm(entera ? 14 : 8), mm(1)), material(COL.negro));
      marca.position.set(mm(488 * Math.cos(a)) - 0, mm(488 * Math.sin(a)), mm(3));
      marca.rotation.z = a - Math.PI / 2;
      aroG.add(marca);
      if (entera) {
        const t = H.cartel(String(h), 30, "#1d1d1f");
        t.position.set(mm(474 * Math.cos(a)), mm(474 * Math.sin(a)), mm(3.2));
        t.rotation.z = a - Math.PI / 2;
        aroG.add(t);
      }
    }
    aroPivot.add(marcar(capa(aroG, "mecanismo"), "201"));
    registrar("202", H.infoSW("202_Eje_Aro_D18", { grupo: "Mecanismo" }));
    for (const s of [-1, 1]) aroPivot.add(marcar(capa(cilindro([s * 470, 0, 0], [s * 632, 0, 0], 9, material(COL.metal, { metalness: 0.8, roughness: 0.25 })), "mecanismo"), "202"));
    // brazo 207b y manija en T 207c (solidarios al eje): se arrastran para cambiar la latitud
    registrar("207b", H.infoSW("207b_Graduador_Brazo", { grupo: "Mecanismo", arrastre: "latitud" }));
    registrar("207c", H.infoSW("207c_Graduador_Manija_T", { grupo: "Mecanismo", arrastre: "latitud", funcion_extra: "Arrastre arriba o abajo para inclinar el aro (latitud)." }));
    const brazo = caja(606, -125, -10, 612, 10, 10, material(COL.alu, { metalness: 0.6 }));
    aroPivot.add(marcar(capa(brazo, "mecanismo"), "207b"));
    const manija = new THREE.Group();
    manija.add(cilindro([598, -115, 0], [641, -115, 0], 3.5, material(COL.metal, { metalness: 0.8 })));
    manija.add(cilindro([641, -115, -22], [641, -115, 22], 6, material(COL.negro, { roughness: 0.6 })));
    aroPivot.add(marcar(capa(manija, "mecanismo"), "207c"));
    ref.manija = manija;

    // carro del foco: gira con la hora sobre el aro
    const carroPivot = grupo(aroPivot, "carroPivot");
    ref.carroPivot = carroPivot;
    registrar("204", H.infoSW("204_Carro_Foco", { grupo: "Mecanismo", arrastre: "hora", funcion_extra: "Arrastre el foco o el carro a lo largo del aro para cambiar la hora." }));
    const carro = new THREE.Group();
    carro.add(caja(-26, 461, -12, 26, 499, -4, material(COL.abs)));
    carro.add(caja(-26, 461, 4, 26, 499, 12, material(COL.abs)));
    carro.add(caja(-26, 497, -12, 26, 503, 12, material(COL.abs)));
    carro.add(cilindro([0, 503, 0], [0, 520, 0], 7, material(0xff9f0a), 16));        // perilla de freno
    for (const x of [-18, 18]) carro.add(cilindro([x, 462, -9], [x, 462, 9], 4.5, material(COL.negro), 12)); // rodillos
    carroPivot.add(marcar(capa(carro, "mecanismo"), "204"));
    registrar("205", H.infoSW("205_Arco_Declinacion_R90", { grupo: "Mecanismo", arrastre: "hora", conexion: "Marcas 21/06 · equinoccio · 21/12 (±23,45°)" }));
    const arco = new THREE.Group();
    const cArco = new THREE.Curve();
    cArco.getPoint = (t) => { const a = (-32 + 64 * t) * Math.PI / 180; return new THREE.Vector3(0, mm(432 - 90 * Math.cos(a)), mm(-90 * Math.sin(a))); };
    arco.add(new THREE.Mesh(new THREE.TubeGeometry(cArco, 40, mm(3.5), 8, false), material(COL.alu, { metalness: 0.6 })));
    for (const s of [-1, 1]) {
      const a = (32 * s * Math.PI) / 180;
      arco.add(tuboCuadrado([0, 432 - 90 * Math.cos(a), -90 * Math.sin(a)], [0, 465, -10 * s], 8, material(COL.alu, { metalness: 0.6 })));
    }
    for (const d of [-23.45, 0, 23.45]) {
      const a = (d * Math.PI) / 180;
      const m = new THREE.Mesh(new THREE.BoxGeometry(mm(12), mm(2), mm(2)), material(d === 0 ? 0x0a84ff : 0xff9f0a));
      m.position.set(0, mm(432 - 90 * Math.cos(a)), mm(-90 * Math.sin(a)));
      arco.add(m);
    }
    carroPivot.add(marcar(capa(arco, "mecanismo"), "205"));
    // declinación: el foco se mueve por el arco R90 (pivote a 432 mm del centro)
    const declPivot = grupo(carroPivot, "declPivot");
    declPivot.position.y = mm(432);
    ref.declPivot = declPivot;
    registrar("206a", H.infoSW("206a_Portafoco", { grupo: "Mecanismo", arrastre: "hora", lista: "N° 21 · Portafoco de cerámica E27" }));
    registrar("206b", H.infoSW("206b_Foco_LED", Object.assign(H.infoBOM(20), { grupo: "Mecanismo", arrastre: "hora",
      nombre: "Foco reflector PAR30 (206b)", codigo: "206b · N° 20", conexion: "Relé 1 (NO) ← COM ← fusible ← interruptor ← fase 220 V" })));
    const portafoco = new THREE.Group();
    portafoco.add(cilindro([0, -40, 0], [0, -76, 0], 18, material(0xe8e2d6, { roughness: 0.7 }), 20));
    portafoco.add(cilindro([0, -10, 0], [0, -40, 0], 5, material(COL.alu, { metalness: 0.6 }), 10));
    declPivot.add(marcar(capa(portafoco, "mecanismo"), "206a"));
    const foco = new THREE.Group();
    const cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(mm(26), mm(47), mm(58), 32, 1, true), material(0x9a9ca1, { metalness: 0.8, roughness: 0.25, side: THREE.DoubleSide }));
    cuerpo.position.y = mm(-105);
    const lente = new THREE.Mesh(new THREE.CircleGeometry(mm(46), 32), new THREE.MeshStandardMaterial({ color: COL.foco, emissive: 0xffd27a, emissiveIntensity: 1.6 }));
    lente.rotation.x = Math.PI / 2;
    lente.position.y = mm(-134);
    foco.add(cuerpo, lente);
    declPivot.add(marcar(capa(foco, "foco"), "206b"));
    ref.lente = lente;
    ref.foco = foco;
    // cono de luz (solo visual)
    const cono = new THREE.Mesh(new THREE.ConeGeometry(mm(170), mm(290), 48, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffe6a8, transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
    cono.position.y = mm(-134 - 145);
    declPivot.add(cono);
    ref.cono = cono;

    // ================================================================== MESA (300)
    const mesaG = grupo(raiz, "mesa");
    ref.mesa = mesaG;
    registrar("301", H.infoSW("301_Plato_Giratorio_D180", { grupo: "Soporte y maqueta" }));
    const plato = new THREE.Group();
    plato.add(cilindro([0, 865, 0], [0, 870, 0], 90, material(COL.tubo, { metalness: 0.5 }), 40));
    plato.add(cilindro([0, 870, 0], [0, 877, 0], 70, material(COL.acero, { metalness: 0.6 }), 40));
    plato.add(cilindro([0, 877, 0], [0, 882, 0], 90, material(COL.tubo, { metalness: 0.5 }), 40));
    mesaG.add(marcar(capa(plato, "soporte"), "301"));
    registrar("302", H.infoSW("302_Mesa_Giratoria_D700", { grupo: "Soporte y maqueta", conexion: "Encaje central Ø16,4 para el pin de la maqueta" }));
    const texMesa = H.textura((g, w, h) => {
      g.fillStyle = "#eceae4"; g.fillRect(0, 0, w, h);
      const c = w / 2, R = w / 2;
      g.strokeStyle = "#8d8a83"; g.lineWidth = 3;
      g.beginPath(); g.arc(c, c, R * 0.943, 0, 7); g.stroke();
      g.beginPath(); g.arc(c, c, R * 0.714, 0, 7); g.stroke();
      for (let a = 0; a < 360; a += 10) {
        const r0 = a % 30 === 0 ? R * 0.86 : R * 0.9, ra = ((a - 90) * Math.PI) / 180;
        g.beginPath(); g.moveTo(c + r0 * Math.cos(ra), c + r0 * Math.sin(ra)); g.lineTo(c + R * 0.943 * Math.cos(ra), c + R * 0.943 * Math.sin(ra)); g.stroke();
        if (a % 30 === 0 && a % 90 !== 0) {
          g.fillStyle = "#6f6c66"; g.font = "600 30px Arial"; g.textAlign = "center"; g.textBaseline = "middle";
          g.fillText(a + "°", c + R * 0.8 * Math.cos(ra), c + R * 0.8 * Math.sin(ra));
        }
      }
      g.fillStyle = "#d9d5cc"; g.strokeStyle = "#8d8a83"; g.lineWidth = 2;
      for (let k = 0; k < 8; k++) {         // estrella de la rosa de los vientos
        const a = (k * Math.PI) / 4 - Math.PI / 2, l = k % 2 ? R * 0.33 : R * 0.68;
        g.beginPath(); g.moveTo(c, c);
        g.lineTo(c + R * 0.08 * Math.cos(a - 0.7), c + R * 0.08 * Math.sin(a - 0.7));
        g.lineTo(c + l * Math.cos(a), c + l * Math.sin(a));
        g.lineTo(c + R * 0.08 * Math.cos(a + 0.7), c + R * 0.08 * Math.sin(a + 0.7));
        g.closePath(); g.fill(); g.stroke();
      }
      g.font = "700 70px Arial"; g.textAlign = "center"; g.textBaseline = "middle";
      [["N", 0, "#0a84ff"], ["E", 90, "#3a3a3c"], ["S", 180, "#ff453a"], ["O", 270, "#3a3a3c"]].forEach(([t, a, col]) => {
        const ra = ((a - 90) * Math.PI) / 180; g.fillStyle = col;
        g.fillText(t, c + R * 0.83 * Math.cos(ra), c + R * 0.83 * Math.sin(ra));
      });
    }, 1024, 1024);
    const mesaM = [material(COL.mdf, { roughness: 0.8 }), material(0xffffff, { map: texMesa, roughness: 0.75 }), material(COL.mdf, { roughness: 0.8 })];
    const mesa = new THREE.Mesh(new THREE.CylinderGeometry(mm(H.DIM.rMesa), mm(H.DIM.rMesa), mm(18), 96), mesaM);
    mesa.position.y = mm(891);
    mesa.castShadow = mesa.receiveShadow = true;
    mesaG.add(marcar(capa(mesa, "soporte"), "302"));
    mesaG.add(capa(cilindro([0, 899.6, 0], [0, 900.2, 0], 8.2, material(0x2c2c2e), 24), "soporte"));   // encaje Ø16,4

    // ================================================================== MAQUETA (303) con 5 cuartos
    construirMaqueta(raiz, ref);
    return ref;
  };

  // ---------------------------------------------------------------------- maqueta (marco local: y = 0 en la mesa)
  function construirMaqueta(raiz, ref) {
    const giro = new THREE.Group();          // gira sobre la mesa
    giro.name = "maquetaGiro";
    giro.position.y = mm(Y_MESA);
    raiz.add(giro);
    const lev = new THREE.Group();           // se levanta por el pin
    lev.name = "maquetaLevantar";
    giro.add(lev);
    ref.maquetaGiro = giro;
    ref.maqueta = lev;
    const Y0 = 4, Y1 = 84;                   // piso 0..4, muros hasta 84
    registrar("303", H.infoSW("303_Maqueta_Casa_5_Cuartos", { grupo: "Soporte y maqueta", arrastre: "giro",
      conexion: "Pin de centrado Ø16 en el encaje de la mesa · arrastre hacia los lados para girarla" }));
    const casa = new THREE.Group();
    const mMuro = () => material(COL.crema, { roughness: 0.85 });
    const bx = (x0, y0, z0, x1, y1, z1, m) => casa.add(caja(x0, y0, z0, x1, y1, z1, m || mMuro()));
    // piso y pin
    bx(-150, 0, -110, 150, Y0, 110, material(0xdcd3c0, { roughness: 0.9 }));
    casa.add(tag(cilindro([0, -12, 0], [0, 0, 0], 8, material(COL.crema), 24), "pin"));

    /** muro a lo largo de X (z0..z1) con huecos [x0, x1, y0, y1] */
    function muroX(z0, z1, x0, x1, huecos) {
      let x = x0;
      for (const [a0, a1, h0, h1] of huecos.sort((p, q) => p[0] - q[0])) {
        if (a0 > x) bx(x, Y0, z0, a0, Y1, z1);
        if (h0 > Y0) bx(a0, Y0, z0, a1, h0, z1);
        bx(a0, h1, z0, a1, Y1, z1);
        x = a1;
      }
      if (x < x1) bx(x, Y0, z0, x1, Y1, z1);
    }
    function muroZ(x0, x1, z0, z1, huecos) {
      let z = z0;
      for (const [a0, a1, h0, h1] of huecos.sort((p, q) => p[0] - q[0])) {
        if (a0 > z) bx(x0, Y0, z, x1, Y1, a0);
        if (h0 > Y0) bx(x0, Y0, a0, x1, h0, a1);
        bx(x0, h1, a0, x1, Y1, a1);
        z = a1;
      }
      if (z < z1) bx(x0, Y0, z, x1, Y1, z1);
    }
    const vent = (c, w) => [c - w / 2, c + w / 2, 34, 64];
    const puerta = (a0, a1) => [a0, a1, Y0, 64];
    muroX(-110, -104, -150, 150, [vent(-100, 44), vent(0, 44), vent(100, 44)]);         // Norte
    muroX(104, 110, -150, 150, [vent(-75, 60), vent(75, 60), puerta(-38, -12)]);           // Sur (con la entrada)
    muroZ(-150, -144, -104, 104, [vent(-55, 40), vent(55, 40)]);                            // Oeste
    muroZ(144, 150, -104, 104, [vent(-55, 40), vent(55, 40)]);                              // Este
    muroX(-3, 3, -144, 144, [puerta(-40, -10), puerta(10, 40)]);                            // muro central
    for (const x of [-50, 50]) muroZ(x - 3, x + 3, -104, -3, [puerta(-50, -20)]);           // divisiones Norte
    muroZ(-3, 3, 3, 104, [puerta(40, 70)]);                                                 // división Sur
    // vidrios de las ventanas
    const mVidrio = () => new THREE.MeshStandardMaterial({ color: COL.vidrio, transparent: true, opacity: 0.28, roughness: 0.05, metalness: 0.1, depthWrite: false });
    const vidrioX = (c, w, z) => { const m = caja(c - w / 2, 34, z - 0.5, c + w / 2, 64, z + 0.5, mVidrio()); m.castShadow = false; casa.add(m); };
    const vidrioZ = (c, w, x) => { const m = caja(x - 0.5, 34, c - w / 2, x + 0.5, 64, c + w / 2, mVidrio()); m.castShadow = false; casa.add(m); };
    [-100, 0, 100].forEach((c) => vidrioX(c, 44, -107));
    [-75, 75].forEach((c) => vidrioX(c, 60, 107));
    [-55, 55].forEach((c) => { vidrioZ(c, 40, -147); vidrioZ(c, 40, 147); });
    // hoja de la puerta de entrada (entreabierta) y marcos
    const hoja = caja(0, Y0, -1.2, 26, 64, 1.2, material(COL.madera, { roughness: 0.6 }));
    const bisagra = new THREE.Group();
    bisagra.position.set(mm(-38), 0, mm(110));
    hoja.position.x = mm(13);
    bisagra.add(hoja);
    bisagra.rotation.y = -0.7;
    casa.add(bisagra);
    lev.add(marcar(capa(casa, "maqueta"), "303"));
    ref.casa = casa;

    // pisos coloreados por la luz (uno por cuarto)
    const pisos = [];
    const rects = [[-144, -104, -53, -3], [-47, -104, 47, -3], [53, -104, 144, -3], [-144, 3, -3, 104], [3, 3, 144, 104]];
    rects.forEach((r, i) => {
      const m = caja(r[0], Y0, r[1], r[2], Y0 + 0.4, r[3], new THREE.MeshStandardMaterial({ color: 0xdcd3c0, roughness: 0.9 }));
      m.castShadow = false;
      lev.add(capa(m, "maqueta"));
      m.userData.comp = "303";
      pisos.push(m);
    });
    ref.pisos = pisos;

    // techos (uno por cuarto, se quitan)
    registrar("techos", { nombre: "Techos de la maqueta", grupo: "Soporte y maqueta", codigo: "303",
      funcion: "Techos de los 5 cuartos. Se quitan con el botón «Techos» para ver los sensores por dentro.", arrastre: "giro" });
    ref.techos = [];
    rects.forEach((r, i) => {
      const g = new THREE.Group();
      g.add(caja(r[0], 80, r[1], r[2], 84, r[3], material(COL.techo, { roughness: 0.85, transparent: true, opacity: 1 })));
      lev.add(marcar(capa(g, "techo"), "techos"));
      ref.techos.push(g);
    });

    // DS18B20 (304_1..5) dentro de cada cuarto
    const CENTROS = [[-100, -55], [0, -55], [100, -55], [-75, 55], [75, 55]];
    ref.ds18 = [];
    H.CUARTOS.forEach((c, i) => {
      const id = "304_" + c.n;
      registrar(id, Object.assign(H.infoSW("304_Sensor_DS18B20_" + c.n), {
        nombre: `Sensor de temperatura DS18B20 · C${c.n}`, grupo: "Sensores", arrastre: "giro", cuarto: i,
        conexion: `Bus 1-Wire: DQ → Arduino D2 (pull-up 4,7 kΩ) · cuarto ${c.n} (${c.lado}, ${c.pos})`,
        lista: "N° 5 · Sensor DS18B20 sumergible",
      }));
      const [x, z] = CENTROS[i];
      const s = new THREE.Group();
      s.add(cilindro([x, Y0, z], [x, Y0 + 3, z], 10, material(COL.abs), 20));
      s.add(cilindro([x, Y0 + 3, z], [x, Y0 + 36, z], 3, material(COL.metal, { metalness: 0.85, roughness: 0.2 }), 14));
      const flag = caja(x - 8, Y0 + 36, z - 0.75, x + 8, Y0 + 52, z + 0.75, material(0x4c9edb));
      s.add(flag);
      const num = H.cartel(String(c.n), 16, "#ffffff");
      num.position.set(mm(x), mm(Y0 + 44), mm(z + 0.9));
      s.add(num);
      lev.add(marcar(capa(s, "sensor"), id));
      ref.ds18.push(s);
    });

    // BH1750 (307_1..5) sobre el techo de cada cuarto, en un puente entre el muro exterior y el muro central
    ref.bh = [];
    H.CUARTOS.forEach((c, i) => {
      const id = "307_" + c.n;
      registrar(id, Object.assign(H.infoSW("307_Sensor_Luz_BH1750_" + c.n), {
        nombre: `Sensor de luz BH1750 · C${c.n}`, grupo: "Sensores", arrastre: "giro", cuarto: i,
        conexion: `TCA9548A canal ${c.canal} (SD${c.canal} / SC${c.canal}) · conector JST pines ${c.jst} · VCC 5 V, GND y ADDR a GND (0x23)`,
        lista: "N° 49 sensor · N° 52 puente",
      }));
      const s = c.s, cx = c.bx, zo = s * 110, zh = s * 47, zp = s * 55;
      const g = new THREE.Group();
      const z0 = Math.min(zo, 0), z1 = Math.max(zo, 0);
      g.add(tag(caja(cx - 7.5, Y1, z0, cx + 7.5, Y1 + 5, z1, material(0x4a4d55, { roughness: 0.6 })), "puente"));          // puente ABS
      g.add(tag(cilindro([cx, Y1 + 5, s * 61], [cx, Y1 + 9, s * 61], 1.5, material(COL.laton, { metalness: 0.6 }), 8), "tornM3x12"));
      g.add(caja(cx - 6.35, Y1 + 5, zh - 1.6, cx + 6.35, Y1 + 9, zh + 1.6, material(COL.negro)));          // tira de pines
      const pcb = caja(cx - 7, Y1 + 9, Math.min(s * 45.5, s * 64.5), cx + 7, Y1 + 10.6, Math.max(s * 45.5, s * 64.5), material(COL.pcbAzul, { roughness: 0.5 }));
      g.add(pcb);
      g.add(caja(cx - 1.5, Y1 + 10.6, zp - 0.8, cx + 1.5, Y1 + 11.3, zp + 0.8, material(COL.negro)));       // chip
      const tor = cilindro([cx, Y1 + 10.6, s * 61], [cx, Y1 + 12, s * 61], 2.6, material(COL.metal, { metalness: 0.8 }), 10);
      g.add(tor);
      lev.add(marcar(capa(g, "sensor"), id));
      ref.bh.push(g);
    });
  }
})();
