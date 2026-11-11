/* Modelo 3D del heliodón pequeño con CABALLETES EN A (SolidWorks 10-11/11/2026), en mm.
   Estructura: una A en cada extremo (Este x +580 y Oeste x −580) de tubo galvanizado 40 x 40 x 1,2, base N-S de
   1050 mm, patas a 32,9° y travesaño a 380 mm; unidas solo por el tubo superior E-O (105) bajo la mesa y dos tubos
   inferiores (113) a ras del piso: el centro queda libre. Mecanismo: medio aro R480 de tubo Ø38 con la escala
   horaria, carro con índice rojo, arco de declinación y foco; graduador por fuera de la A Este. Mesa Ø700 con rosa
   de los vientos y maqueta de 5 cuartos. Cada malla lleva userData.capa para las vistas. */
(function () {
  const H = window.H;
  const { mm, caja, cilindro, tuboCuadrado, material, COL, registrar, marcar } = H;
  const tag = H.tagPieza;
  const D = H.DIM;
  const R_ARO = D.rAro, Y_EJE = D.yEje, Y_MESA = 900, RT = D.dAro / 2;
  H.R_ARO = R_ARO; H.Y_EJE = Y_EJE; H.Y_MESA = Y_MESA;

  function capa(obj, nombre) { obj.traverse((o) => { o.userData.capa = nombre; }); return obj; }
  H.capa = capa;
  function grupo(padre, nombre) { const g = new THREE.Group(); g.name = nombre; padre.add(g); return g; }
  /** Registra un componente con los datos del catálogo (H.PIEZAS). */
  function reg(id, extra = {}) {
    const p = H.pieza(id) || {};
    return registrar(id, Object.assign({ nombre: p.nombre, codigo: p.cod, grupo: p.grupo, material: p.material, funcion: p.desc, pieza: p.id ? id : null }, extra));
  }
  H.reg = reg;
  /** Placa plana en el plano YZ (puntos [z, y] en mm) con espesor en X, centrada en x. */
  function placaYZ(puntos, x, esp, mat) {
    const s = new THREE.Shape();
    puntos.forEach(([z, y], i) => (i ? s.lineTo(mm(-z), mm(y)) : s.moveTo(mm(-z), mm(y))));
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: mm(esp), bevelEnabled: false }), mat);
    m.rotation.y = Math.PI / 2;
    m.position.x = mm(x - esp / 2);
    m.castShadow = m.receiveShadow = true;
    return m;
  }
  const mGal = () => material(0xa4aab1, { roughness: 0.4, metalness: 0.55 });
  const mA36 = () => material(0x7d838b, { roughness: 0.45, metalness: 0.5 });
  const mZinc = () => material(0xc9ccd1, { metalness: 0.75, roughness: 0.3 });
  const mFund = () => material(0x34373c, { roughness: 0.7, metalness: 0.3 });

  H.construirModelo = function (escena) {
    const ref = (H.ref = H.ref || {});
    const raiz = grupo(escena, "heliodon");
    ref.raiz = raiz;

    // ================================================================== ESTRUCTURA
    const est = grupo(raiz, "estructura");
    ref.estructura = est;
    const caballetes = {};
    for (const [cod, sx] of [["102", 1], ["103", -1]]) {
      reg(cod, { conexion: sx > 0 ? "Lleva la caja del Arduino en el travesaño y el graduador por fuera" : "Sostiene el eje Oeste del aro" });
      const g = new THREE.Group();
      const x = sx * D.xA;
      g.add(tag(tuboCuadrado([x, D.yBase, -D.zBase], [x, D.yBase, D.zBase], 40, mGal()), cod + "-base"));
      for (const sz of [-1, 1]) {
        const y0 = 170, y1 = 884;
        g.add(tag(tuboCuadrado([x, y0, sz * H.zPata(y0)], [x, y1, sz * H.zPata(y1)], 40, mGal()), cod + (sz < 0 ? "-PN" : "-PS")));
      }
      g.add(caja(x - 20, 866, -24, x + 20, D.yPunta, 24, mGal()));          // nudo de la punta
      const zt = H.zPata(D.yTrav);
      g.add(tag(tuboCuadrado([x, D.yTrav, -zt], [x, D.yTrav, zt], 40, mGal()), cod + "-TR"));
      est.add(marcar(capa(g, "estructura"), cod));
      caballetes[cod] = g;
      // 114 placa de la punta y 115 cartelas en los pies (lado interior)
      reg("114");
      g.add(marcar(capa(caja(x - 35, D.yPlaca[0], -60, x + 35, D.yPlaca[1], 60, mA36()), "estructura"), "114"));
      reg("115");
      for (const sz of [-1, 1]) {
        const pts = [[sz * 441, 182], [sz * 330, 182], [sz * 376, 282]];
        g.add(marcar(capa(placaYZ(pts, x, 3, mA36()), "estructura"), "115"));
      }
    }
    ref.caballetes = caballetes;
    reg("105", { conexion: "Por dentro pasan los cables de los sensores (azul) desde la mesa hasta la A Este" });
    ref.tubo105 = marcar(capa(tuboCuadrado([-560, D.ySup, 0], [560, D.ySup, 0], 40, mGal()), "estructura"), "105");
    est.add(ref.tubo105);
    reg("113");
    ref.inferiores = [];
    for (const sz of [-1, 1]) {
      const t = marcar(capa(tuboCuadrado([-560, D.yBase, sz * D.zInf], [560, D.yBase, sz * D.zInf], 40, mGal()), "estructura"), "113");
      est.add(t); ref.inferiores.push(t);
    }
    reg("112");
    const placas = new THREE.Group();
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) placas.add(caja(sx * D.xRueda - 60, 140, sz * D.zRueda - 40, sx * D.xRueda + 60, 142, sz * D.zRueda + 40, mA36()));
    est.add(marcar(capa(placas, "estructura"), "112"));

    // ruedas: 107a placa, 107b/107e horquilla (con / sin freno), 107c llanta, 107d palanca + pernos 108 / tuercas 110
    const ruedas = grupo(raiz, "ruedas");
    ref.ruedas = ruedas;
    ["107a", "107b", "107e", "107c", "107d", "108", "110"].forEach((c) => reg(c));
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const cx = sx * D.xRueda, cz = sz * D.zRueda, freno = sz > 0;
      const pl = new THREE.Group();
      pl.add(caja(cx - 50, 132, cz - 35, cx + 50, 140, cz + 35, mZinc()));
      pl.add(cilindro([cx, 124, cz], [cx, 132, cz], 28, mZinc(), 24));
      ruedas.add(marcar(capa(pl, "estructura"), "107a"));
      const h = new THREE.Group();
      h.add(caja(cx - 30, 116, cz - 22, cx + 30, 124, cz + 22, mZinc()));
      for (const dz of [-20, 20]) h.add(caja(cx - 12, 44, cz + dz - 2, cx + 12, 118, cz + dz + 2, mZinc()));
      h.add(cilindro([cx, 50, cz - 22], [cx, 50, cz + 22], 6, mZinc(), 12));
      ruedas.add(marcar(capa(h, "estructura"), freno ? "107b" : "107e"));
      const ll = new THREE.Group();
      ll.add(cilindro([cx, 50, cz - 16], [cx, 50, cz + 16], 50, material(0x26272b, { roughness: 0.85 }), 32));
      ll.add(cilindro([cx, 50, cz - 17], [cx, 50, cz + 17], 22, material(0xb8bcc2, { metalness: 0.6 }), 20));
      ruedas.add(marcar(capa(ll, "estructura"), "107c"));
      if (freno) ruedas.add(marcar(capa(caja(cx + sx * 14 - 10, 100, cz - 10, cx + sx * 14 + 10, 106, cz + 10, material(0xff3b30, { roughness: 0.5 })), "estructura"), "107d"));
      for (const dx of [-38, 38]) for (const dz of [-25, 25]) {
        ruedas.add(marcar(capa(cilindro([cx + dx, 127, cz + dz], [cx + dx, 132, cz + dz], 6.5, mZinc(), 6), "estructura"), "108"));
        ruedas.add(marcar(capa(cilindro([cx + dx, 142, cz + dz], [cx + dx, 148.5, cz + dz], 6.5, mZinc(), 6), "estructura"), "110"));
      }
    }

    // ================================================================== MECANISMO
    const mec = grupo(raiz, "mecanismo");
    ref.mecanismo = mec;
    reg("203"); reg("118"); reg("119");
    for (const x of [-D.xA, D.xA]) {
      const ch = new THREE.Group();
      ch.add(caja(x - 19, D.yPlaca[1], -63.5, x + 19, 915, 63.5, mFund()));
      ch.add(caja(x - 15, 914, -26, x + 15, 935, 26, mFund()));
      ch.add(cilindro([x - 17, Y_EJE, 0], [x + 17, Y_EJE, 0], 31, mFund(), 32));
      ch.add(cilindro([x - 18, Y_EJE, 0], [x + 18, Y_EJE, 0], 17, mZinc(), 24));
      ch.add(cilindro([x, Y_EJE + 30, 0], [x, Y_EJE + 37, 0], 3, mZinc(), 8));      // engrasador
      mec.add(marcar(capa(ch, "mecanismo"), "203"));
      for (const z of [-47, 47]) {
        mec.add(marcar(capa(cilindro([x, 915, z], [x, 921.4, z], 8.5, mZinc(), 6), "mecanismo"), "118"));
        mec.add(marcar(capa(cilindro([x, 880, z], [x, 915, z], 5, mZinc(), 10), "mecanismo"), "118"));
        mec.add(marcar(capa(cilindro([x, 891.7, z], [x, 899.7, z], 8.5, mZinc(), 6), "mecanismo"), "119"));
      }
    }

    // graduador 207a (fijo, por fuera de la A Este): placa semicircular R130 con marcas cada 1°
    reg("207a", { conexion: "Inclinación del aro = |φ − δ| redondeado a 1° (de 90° N a 90° S)" });
    const XG = 612;
    const grad = new THREE.Group();
    const forma = new THREE.Shape();
    forma.absarc(0, 0, mm(130), Math.PI, 2 * Math.PI, false);
    forma.lineTo(mm(-130), 0);
    const placa = new THREE.Mesh(new THREE.ExtrudeGeometry(forma, { depth: mm(5), bevelEnabled: false, curveSegments: 48 }), material(0xe9e9ec, { roughness: 0.5, metalness: 0.2 }));
    placa.rotation.y = Math.PI / 2;
    placa.position.set(mm(XG - 5), mm(Y_EJE), 0);
    placa.castShadow = true;
    grad.add(placa);
    const texGrad = H.textura((g, w, h) => {
      const c = w / 2, R = w / 2;
      g.clearRect(0, 0, w, h);
      g.strokeStyle = "#1c1c1e"; g.fillStyle = "#1c1c1e";
      for (let v = -90; v <= 90; v++) {
        const a = (v * Math.PI) / 180, L = v % 10 === 0 ? 0.13 : v % 5 === 0 ? 0.09 : 0.05;
        g.lineWidth = v % 5 === 0 ? 4 : 2;
        g.beginPath(); g.moveTo(c + R * 0.97 * Math.sin(a), c + R * 0.97 * Math.cos(a));
        g.lineTo(c + R * (0.97 - L) * Math.sin(a), c + R * (0.97 - L) * Math.cos(a)); g.stroke();
        if (v % 10 === 0) {
          g.font = "600 34px Arial"; g.textAlign = "center"; g.textBaseline = "middle";
          g.fillText(String(Math.abs(v)), c + R * 0.74 * Math.sin(a), c + R * 0.74 * Math.cos(a));
        }
      }
      g.font = "800 64px Arial";
      g.fillStyle = "#ff3b30"; g.fillText("S", c - R * 0.42, c + R * 0.36);
      g.fillStyle = "#007aff"; g.fillText("N", c + R * 0.42, c + R * 0.36);
    }, 1024, 1024);
    const cara = new THREE.Mesh(new THREE.CircleGeometry(mm(129), 64, Math.PI, Math.PI), new THREE.MeshStandardMaterial({ map: texGrad, transparent: true, roughness: 0.6 }));
    cara.rotation.y = Math.PI / 2;
    cara.position.set(mm(XG + 0.3), mm(Y_EJE), 0);
    grad.add(cara);
    mec.add(marcar(capa(grad, "mecanismo"), "207a"));

    // aro que se inclina (pivote en el eje E-O a 935 mm del piso)
    const aroPivot = grupo(mec, "aroPivot");
    aroPivot.position.set(0, mm(Y_EJE), 0);
    ref.aroPivot = aroPivot;
    reg("201", { conexion: "Escala horaria de 7 a 17 h (rayas cada hora, media hora y cuarto)" });
    const aroG = new THREE.Group();
    const cAro = new THREE.Curve();
    cAro.getPoint = (t) => new THREE.Vector3(mm(R_ARO * Math.cos(Math.PI * t)), mm(R_ARO * Math.sin(Math.PI * t)), 0);
    const tuboAro = new THREE.Mesh(new THREE.TubeGeometry(cAro, 160, mm(RT), 24, false), material(0xb9bec4, { metalness: 0.55, roughness: 0.32 }));
    tuboAro.castShadow = true;
    aroG.add(tuboAro);
    const anillo = (h, grados, color, ancho = 1.6) => {      // raya alrededor del tubo (centrada hacia el Sur, +z)
      const f = ((h - 12) * 15 * Math.PI) / 180, th = (grados * Math.PI) / 180;
      const m = new THREE.Mesh(new THREE.CylinderGeometry(mm(RT + 0.35), mm(RT + 0.35), mm(ancho), 24, 1, true, -th / 2, th),
        new THREE.MeshStandardMaterial({ color, roughness: 0.6, side: THREE.DoubleSide }));
      m.position.set(mm(-R_ARO * Math.sin(f)), mm(R_ARO * Math.cos(f)), 0);
      m.rotation.z = f + Math.PI / 2;
      return m;
    };
    for (let q = 26; q <= 70; q++) {            // de 6:30 a 17:30 cada cuarto de hora
      const h = q / 4;
      if (h < 6.75 || h > 17.25) continue;
      const k = q % 4;
      aroG.add(anillo(h, k === 0 ? 360 : k === 2 ? 180 : 90, 0x111114, k === 0 ? 2.2 : 1.6));
    }
    for (const h of [6.75, 17.25]) aroG.add(anillo(h, 360, 0xff3b30, 3));        // topes del carro
    for (let h = 7; h <= 17; h++) {
      const f = ((h - 12) * 15 * Math.PI) / 180;
      const t = H.cartel(String(h), 64, "#1d1d1f", null, 80);
      t.material.side = THREE.DoubleSide;
      t.position.set(mm(-(R_ARO + 42) * Math.sin(f)), mm((R_ARO + 42) * Math.cos(f)), 0);
      t.rotation.z = f;
      aroG.add(t);
    }
    aroPivot.add(marcar(capa(aroG, "mecanismo"), "201"));
    ref.aro = aroG;
    reg("116"); reg("202");
    for (const s of [-1, 1]) {
      aroPivot.add(marcar(capa(cilindro([s * 462, 0, 0], [s * 487, 0, 0], 20, mA36(), 24), "mecanismo"), "116"));
      aroPivot.add(marcar(capa(cilindro([s * 470, 0, 0], [s * (s > 0 ? 640 : 615), 0, 0], 10, material(0xd1d4d8, { metalness: 0.85, roughness: 0.22 }), 20), "mecanismo"), "202"));
    }
    // brazo 207b y manija en T 207c (solidarios al eje Este): se arrastran para cambiar la latitud
    reg("207b", { arrastre: "latitud" });
    reg("207c", { arrastre: "latitud", funcion_extra: "Arrastre arriba o abajo para inclinar el aro." });
    const brazo = new THREE.Group();
    brazo.add(caja(617, -140, -10, 623, 8, 10, mA36()));
    brazo.add(cilindro([616, 0, 0], [626, 0, 0], 17, mA36(), 24));
    aroPivot.add(marcar(capa(brazo, "mecanismo"), "207b"));
    const manija = new THREE.Group();
    manija.add(cilindro([608, -118, 0], [648, -118, 0], 3.5, mZinc()));
    manija.add(cilindro([648, -118, -22], [648, -118, 22], 5, material(0xff9500, { roughness: 0.45 }), 16));
    aroPivot.add(marcar(capa(manija, "mecanismo"), "207c"));
    ref.manija = manija;

    // carro del foco: corre por el aro con la hora (rodillos PLA) y su índice rojo marca la hora
    const carroPivot = grupo(aroPivot, "carroPivot");
    ref.carroPivot = carroPivot;
    reg("204", { arrastre: "hora", funcion_extra: "Arrastre el carro o el foco a lo largo del aro para cambiar la hora." });
    const Rc = R_ARO;
    const carro = new THREE.Group();
    const mCar = () => material(0x55595f, { metalness: 0.6, roughness: 0.38 });
    carro.add(caja(-30, Rc + 35, -30, 30, Rc + 38, 30, mCar()));
    carro.add(caja(-30, Rc - 38, -30, 30, Rc - 35, 30, mCar()));
    carro.add(caja(-30, Rc - 38, 27, 30, Rc + 38, 30, mCar()));
    carro.add(caja(-30, Rc - 38, -30, 30, Rc + 38, -27, mCar()));
    carro.add(cilindro([12, Rc + 38, 0], [12, Rc + 48, 0], 7, material(0xff9500), 18));                  // perilla de freno
    const indice = new THREE.Group();                                                                     // índice rojo (frente Sur)
    indice.add(caja(-1.2, Rc - 38, 30, 1.2, Rc + 38, 31.5, material(0xff3b30, { roughness: 0.4 })));
    const flecha = new THREE.Shape(); flecha.moveTo(0, 0); flecha.lineTo(mm(-7), mm(-12)); flecha.lineTo(mm(7), mm(-12)); flecha.closePath();
    const fl = new THREE.Mesh(new THREE.ShapeGeometry(flecha), new THREE.MeshStandardMaterial({ color: 0xff3b30, side: THREE.DoubleSide }));
    fl.position.set(0, mm(Rc - 38), mm(31.6));
    indice.add(fl);
    carro.add(indice);
    carroPivot.add(marcar(capa(carro, "mecanismo"), "204"));
    ref.indice = indice;
    reg("117", { arrastre: "hora" });
    for (const dx of [-18, 18]) for (const dy of [-27, 27]) {
      carroPivot.add(marcar(capa(cilindro([dx, Rc + dy, -10], [dx, Rc + dy, 10], 8, material(0xff9f0a, { roughness: 0.55 }), 16), "mecanismo"), "117"));
    }
    reg("205", { arrastre: "hora", conexion: "Marcas 21/06 · equinoccio · 21/12 (±23,45°)" });
    const YA = 410;                                   // centro del arco de declinación (en el marco del carro)
    const arco = new THREE.Group();
    const cArco = new THREE.Curve();
    cArco.getPoint = (t) => { const a = (-32 + 64 * t) * Math.PI / 180; return new THREE.Vector3(0, mm(YA - 90 * Math.cos(a)), mm(-90 * Math.sin(a))); };
    arco.add(new THREE.Mesh(new THREE.TubeGeometry(cArco, 40, mm(3.5), 8, false), material(0xc9ccd1, { metalness: 0.6 })));
    for (const s of [-1, 1]) {
      const a = (32 * s * Math.PI) / 180;
      arco.add(tuboCuadrado([0, YA - 90 * Math.cos(a), -90 * Math.sin(a)], [0, Rc - 38, -12 * s], 8, material(0xc9ccd1, { metalness: 0.6 })));
    }
    for (const d of [-23.45, 0, 23.45]) {
      const a = (d * Math.PI) / 180;
      const m = new THREE.Mesh(new THREE.BoxGeometry(mm(14), mm(2.4), mm(2.4)), material(d === 0 ? 0x007aff : 0xff9500));
      m.position.set(0, mm(YA - 90 * Math.cos(a)), mm(-90 * Math.sin(a)));
      arco.add(m);
    }
    carroPivot.add(marcar(capa(arco, "mecanismo"), "205"));
    const declPivot = grupo(carroPivot, "declPivot");
    declPivot.position.y = mm(YA);
    ref.declPivot = declPivot;
    reg("206a", { arrastre: "hora" });
    reg("206b", { arrastre: "hora", conexion: "Relé (NO) ← COM ← fusible 2 A ← fase 220 V · se enciende con D4 en LOW" });
    const portafoco = new THREE.Group();
    portafoco.add(cilindro([0, -84, 0], [0, -94, 0], 6, material(0xff9500), 12));
    portafoco.add(cilindro([0, -94, 0], [0, -102, 0], 4, material(0xd1d4d8, { metalness: 0.7 }), 10));
    declPivot.add(marcar(capa(portafoco, "mecanismo"), "206a"));
    const foco = new THREE.Group();
    const cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(mm(24), mm(30), mm(60), 32, 1, false), material(0xc7cad0, { metalness: 0.85, roughness: 0.22 }));
    cuerpo.position.y = mm(-130);
    const lente = new THREE.Mesh(new THREE.CircleGeometry(mm(28), 32), new THREE.MeshStandardMaterial({ color: COL.foco, emissive: 0xffd27a, emissiveIntensity: 1.6 }));
    lente.rotation.x = Math.PI / 2;
    lente.position.y = mm(-160.5);
    foco.add(cuerpo, lente);
    declPivot.add(marcar(capa(foco, "foco"), "206b"));
    ref.lente = lente;
    ref.foco = foco;
    const cono = new THREE.Mesh(new THREE.ConeGeometry(mm(150), mm(260), 48, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffe6a8, transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
    cono.position.y = mm(-160.5 - 130);
    declPivot.add(cono);
    ref.cono = cono;

    // ================================================================== MESA
    const mesaG = grupo(raiz, "mesa");
    ref.mesa = mesaG;
    reg("301");
    const plato = new THREE.Group();
    plato.add(cilindro([0, 865, 0], [0, 870, 0], 90, mA36(), 40));
    plato.add(cilindro([0, 870, 0], [0, 877, 0], 72, material(0x3a3d42, { metalness: 0.6 }), 40));
    plato.add(cilindro([0, 877, 0], [0, 882, 0], 90, mA36(), 40));
    mesaG.add(marcar(capa(plato, "soporte"), "301"));
    reg("302", { conexion: "Encaje central para el pin de la maqueta · gira ±180°" });
    const texMesa = H.textura((g, w, h) => {
      g.fillStyle = "#eceae4"; g.fillRect(0, 0, w, h);
      const c = w / 2, R = w / 2;
      g.strokeStyle = "#8d8a83"; g.lineWidth = 3;
      g.beginPath(); g.arc(c, c, R * 0.95, 0, 7); g.stroke();
      g.beginPath(); g.arc(c, c, R * 0.73, 0, 7); g.stroke();
      for (let a = 0; a < 360; a += 5) {
        const r0 = a % 30 === 0 ? R * 0.87 : a % 10 === 0 ? R * 0.9 : R * 0.925, ra = ((a - 90) * Math.PI) / 180;
        g.lineWidth = a % 30 === 0 ? 3 : 1.5;
        g.beginPath(); g.moveTo(c + r0 * Math.cos(ra), c + r0 * Math.sin(ra)); g.lineTo(c + R * 0.95 * Math.cos(ra), c + R * 0.95 * Math.sin(ra)); g.stroke();
        if (a % 30 === 0 && a % 90 !== 0) {
          g.fillStyle = "#6f6c66"; g.font = "600 30px Arial"; g.textAlign = "center"; g.textBaseline = "middle";
          g.fillText(a + "°", c + R * 0.81 * Math.cos(ra), c + R * 0.81 * Math.sin(ra));
        }
      }
      g.fillStyle = "#d9d5cc"; g.strokeStyle = "#8d8a83"; g.lineWidth = 2;
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4 - Math.PI / 2, l = k % 2 ? R * 0.33 : R * 0.68;
        g.fillStyle = k === 0 ? "#ff3b30" : "#d9d5cc";
        g.beginPath(); g.moveTo(c, c);
        g.lineTo(c + R * 0.08 * Math.cos(a - 0.7), c + R * 0.08 * Math.sin(a - 0.7));
        g.lineTo(c + l * Math.cos(a), c + l * Math.sin(a));
        g.lineTo(c + R * 0.08 * Math.cos(a + 0.7), c + R * 0.08 * Math.sin(a + 0.7));
        g.closePath(); g.fill(); g.stroke();
      }
      g.font = "700 70px Arial"; g.textAlign = "center"; g.textBaseline = "middle";
      [["N", 0, "#ff3b30"], ["E", 90, "#3a3a3c"], ["S", 180, "#3a3a3c"], ["O", 270, "#3a3a3c"]].forEach(([t, a, col]) => {
        const ra = ((a - 90) * Math.PI) / 180; g.fillStyle = col;
        g.fillText(t, c + R * 0.83 * Math.cos(ra), c + R * 0.83 * Math.sin(ra));
      });
    }, 1024, 1024);
    const mesaM = [material(0xc49a6c, { roughness: 0.8 }), material(0xffffff, { map: texMesa, roughness: 0.75 }), material(0xc49a6c, { roughness: 0.8 })];
    const mesa = new THREE.Mesh(new THREE.CylinderGeometry(mm(D.rMesa), mm(D.rMesa), mm(18), 96), mesaM);
    mesa.position.y = mm(891);
    mesa.castShadow = mesa.receiveShadow = true;
    mesaG.add(marcar(capa(mesa, "soporte"), "302"));
    mesaG.add(capa(cilindro([0, 899.6, 0], [0, 900.2, 0], 8.2, material(0x2c2c2e), 24), "soporte"));

    // ================================================================== MAQUETA (303) con 5 cuartos
    construirMaqueta(raiz, ref);
    return ref;
  };

  // ---------------------------------------------------------------------- maqueta (marco local: y = 0 en la mesa)
  function construirMaqueta(raiz, ref) {
    const giro = new THREE.Group();
    giro.name = "maquetaGiro";
    giro.position.y = mm(Y_MESA);
    raiz.add(giro);
    const lev = new THREE.Group();
    lev.name = "maquetaLevantar";
    giro.add(lev);
    ref.maquetaGiro = giro;
    ref.maqueta = lev;
    const Y0 = 4, Y1 = 84;
    reg("303", { arrastre: "giro", conexion: "Pin de centrado en el encaje de la mesa · arrastre hacia los lados para girarla" });
    const casa = new THREE.Group();
    const mMuro = () => material(0xc8a27a, { roughness: 0.85 });
    const bx = (x0, y0, z0, x1, y1, z1, m) => casa.add(caja(x0, y0, z0, x1, y1, z1, m || mMuro()));
    bx(-150, 0, -110, 150, Y0, 110, material(0xb88d63, { roughness: 0.9 }));
    casa.add(tag(cilindro([0, -12, 0], [0, 0, 0], 8, material(0xb88d63), 24), "pin"));
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
    muroX(-110, -104, -150, 150, [vent(-100, 44), vent(0, 44), vent(100, 44)]);
    muroX(104, 110, -150, 150, [vent(-75, 60), vent(75, 60), puerta(-38, -12)]);
    muroZ(-150, -144, -104, 104, [vent(-55, 40), vent(55, 40)]);
    muroZ(144, 150, -104, 104, [vent(-55, 40), vent(55, 40)]);
    muroX(-3, 3, -144, 144, [puerta(-40, -10), puerta(10, 40)]);
    for (const x of [-50, 50]) muroZ(x - 3, x + 3, -104, -3, [puerta(-50, -20)]);
    muroZ(-3, 3, 3, 104, [puerta(40, 70)]);
    const mVidrio = () => new THREE.MeshStandardMaterial({ color: COL.vidrio, transparent: true, opacity: 0.28, roughness: 0.05, metalness: 0.1, depthWrite: false });
    const vidrioX = (c, w, z) => { const m = caja(c - w / 2, 34, z - 0.5, c + w / 2, 64, z + 0.5, mVidrio()); m.castShadow = false; casa.add(m); };
    const vidrioZ = (c, w, x) => { const m = caja(x - 0.5, 34, c - w / 2, x + 0.5, 64, c + w / 2, mVidrio()); m.castShadow = false; casa.add(m); };
    [-100, 0, 100].forEach((c) => vidrioX(c, 44, -107));
    [-75, 75].forEach((c) => vidrioX(c, 60, 107));
    [-55, 55].forEach((c) => { vidrioZ(c, 40, -147); vidrioZ(c, 40, 147); });
    const hoja = caja(0, Y0, -1.2, 26, 64, 1.2, material(COL.madera, { roughness: 0.6 }));
    const bisagra = new THREE.Group();
    bisagra.position.set(mm(-38), 0, mm(110));
    hoja.position.x = mm(13);
    bisagra.add(hoja);
    bisagra.rotation.y = -0.7;
    casa.add(bisagra);
    lev.add(marcar(capa(casa, "maqueta"), "303"));
    ref.casa = casa;

    const pisos = [];
    const rects = [[-144, -104, -53, -3], [-47, -104, 47, -3], [53, -104, 144, -3], [-144, 3, -3, 104], [3, 3, 144, 104]];
    rects.forEach((r) => {
      const m = caja(r[0], Y0, r[1], r[2], Y0 + 0.4, r[3], new THREE.MeshStandardMaterial({ color: 0xdcd3c0, roughness: 0.9 }));
      m.castShadow = false;
      lev.add(capa(m, "maqueta"));
      m.userData.comp = "303";
      pisos.push(m);
    });
    ref.pisos = pisos;

    registrar("techos", { nombre: "Techos de la maqueta", grupo: "Soporte", codigo: "303", material: "MDF 3 mm",
      funcion: "Techos de los 5 cuartos. Se quitan con el botón «Techos» para ver los sensores por dentro.", arrastre: "giro" });
    ref.techos = [];
    rects.forEach((r) => {
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
      registrar(id, { nombre: `Sensor de temperatura DS18B20 · cuarto ${c.n}`, codigo: "304_" + c.n, grupo: "Electrónica", material: "ABS", pieza: "304_1",
        funcion: "Mide la temperatura del cuarto (±0,5 °C).", arrastre: "giro", cuarto: i,
        conexion: `Bus 1-Wire: DQ → Arduino D2 (pull-up 4,7 kΩ) · cuarto ${c.n} (${c.lado}, ${c.pos})` });
      const [x, z] = CENTROS[i];
      const s = new THREE.Group();
      s.add(cilindro([x, Y0, z], [x, Y0 + 3, z], 10, material(COL.abs), 20));
      s.add(cilindro([x, Y0 + 3, z], [x, Y0 + 36, z], 3, material(COL.metal, { metalness: 0.85, roughness: 0.2 }), 14));
      s.add(caja(x - 8, Y0 + 36, z - 0.75, x + 8, Y0 + 52, z + 0.75, material(0x007aff)));
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
      registrar(id, { nombre: `Sensor de luz BH1750 · cuarto ${c.n}`, codigo: "307_" + c.n, grupo: "Electrónica", material: "ABS", pieza: "307_1",
        funcion: "Mide la luz del cuarto en lux.", arrastre: "giro", cuarto: i,
        conexion: `TCA9548A canal ${c.canal} (SD${c.canal} / SC${c.canal}) · VCC 5 V, GND, dirección 0x23` });
      const s = c.s, cx = c.bx, zo = s * 110, zh = s * 47, zp = s * 55;
      const g = new THREE.Group();
      const z0 = Math.min(zo, 0), z1 = Math.max(zo, 0);
      g.add(caja(cx - 7.5, Y1, z0, cx + 7.5, Y1 + 5, z1, material(0x4a4d55, { roughness: 0.6 })));
      g.add(caja(cx - 6.35, Y1 + 5, zh - 1.6, cx + 6.35, Y1 + 9, zh + 1.6, material(COL.negro)));
      g.add(caja(cx - 7, Y1 + 9, Math.min(s * 45.5, s * 64.5), cx + 7, Y1 + 10.6, Math.max(s * 45.5, s * 64.5), material(COL.pcbAzul, { roughness: 0.5 })));
      g.add(caja(cx - 1.5, Y1 + 10.6, zp - 0.8, cx + 1.5, Y1 + 11.3, zp + 0.8, material(COL.negro)));
      lev.add(marcar(capa(g, "sensor"), id));
      ref.bh.push(g);
    });
  }
})();
