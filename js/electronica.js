/* Electrónica y cables del heliodón con caballetes en A (SolidWorks 11/11/2026, scripts 47 y 49).
   Caja del Arduino (305) atornillada con 2 M6 al travesaño de la A Este (x 420..560, y 310..450, z −100..100); su tapa
   (305b) mira al centro libre. Adentro, sobre la pared Este: Arduino UNO, relé de 1 canal, TCA9548A, bornera del bus
   1-Wire con la pull-up de 4,7 kΩ, bornera de 220 V y portafusible; el LED indicador (con 220 Ω) va en el techo.
   Cables por dentro de los tubos: sensores por la pata Norte (azul), foco y 220 V por la pata Sur (rojo y negro).
   Cada cable guarda sus tramos (nombre y puntos en mm) para las cotas del modo «Aislar». */
(function () {
  const H = window.H;
  const { mm, caja, cilindro, material, registrar, marcar, ruta, cable, capa } = H;
  const T = H.TIPOS;

  // ------------------------------------------------------------------ pines (mm, coordenadas globales; frente de cada pieza hacia −x)
  const ARD = { D2: [536, 432.5, -36], D4: [536, 432.5, -41], D8: [536, 432.5, -52], "5V": [536, 384.5, -62], GND: [536, 384.5, -57],
    GND2: [536, 384.5, -54], A4: [536, 384.5, -40], A5: [536, 384.5, -37], USB: [528, 426, -86] };
  const REL = { IN: [536, 426, -6], VCC: [536, 421, -6], GND: [536, 416, -6], COM: [529, 421, 37], NO: [529, 428, 37], NC: [529, 414, 37] };
  const TCA = { VIN: [536, 416.5, 56], GND: [536, 416.5, 60], SDA: [536, 416.5, 64], SCL: [536, 416.5, 68] };
  const BUS = { VDD: [529, 348, -9], DQ: [529, 348, -3], GND: [529, 348, 3] };
  const B220 = { Fred: [527, 338, 46], Nred: [527, 338, 58], Ffoco: [527, 338, 70], Nfoco: [527, 338, 82] };
  const PF = { ent: [536, 368, 88], sal: [536, 368, 42] };
  const LEDP = { an: [445, 440, 70], ca: [445, 440, 74] };
  H.PINES = { ARD, REL, TCA, BUS, B220 };

  /** Registra un cable con los datos del catálogo y sus tramos [[nombre, [puntos mm]], ...]. */
  function regCable(id, tramos, extra = {}) {
    const c = H.CABLES[id] || {};
    const pts = [];
    (tramos || []).forEach(([, p]) => p.forEach((q) => { const u = pts[pts.length - 1]; if (!u || Math.hypot(u[0] - q[0], u[1] - q[1], u[2] - q[2]) > 0.01) pts.push(q); }));
    return registrar(id, Object.assign({ nombre: c.nombre, codigo: id, grupo: "Cables", tipo: c.tipo, cable: true,
      material: c.conductor ? c.conductor + " · aislante " + c.aislante : "", funcion: c.recorrido ? "Recorrido: " + c.recorrido : "",
      conexion: c.desde ? c.desde + " → " + c.hasta : "", tramos, puntos: pts, largo: pts.length ? H.largoPoli(pts) : null }, extra));
  }
  /** Cable por tramos: un solo tubo 3D por todo el recorrido. */
  function cableTramos(id, tramos, radio, color, padre, curva = 18) {
    const e = regCable(id, tramos);
    const m = cable(ruta(e.puntos, curva), radio, color);
    (padre || H.ref.cables).add(marcar(capa(m, "cable"), id));
    return m;
  }
  let nAlt = 0;
  /** Cable Dupont / de 220 V dentro de la caja: sale del pin hacia −x (frente) y llega al otro pin. */
  function alambre(id, a, b, radio = 0.8, salto) {
    const c = H.CABLES[id];
    const k = salto == null ? 6 + (nAlt++ % 6) * 2 : salto;
    const pts = [a, [a[0] - k, a[1], a[2]], [b[0] - k, b[1], b[2]], b];
    const tramos = [["Salida del pin (" + c.desde + ")", pts.slice(0, 2)], ["Tramo libre dentro de la caja", pts.slice(1, 3)], ["Llegada (" + c.hasta + ")", pts.slice(2)]];
    regCable(id, tramos);
    const m = cable(ruta(pts, 4), radio, c.colorHex);
    H.ref.cablesCaja.add(marcar(capa(m, "cable"), id));
    return m;
  }

  H.construirElectronica = function () {
    const ref = H.ref;
    const cables = new THREE.Group(); cables.name = "cables"; ref.raiz.add(cables); ref.cables = cables;
    const cajaG = new THREE.Group(); cajaG.name = "caja"; ref.raiz.add(cajaG); ref.caja = cajaG;
    const interior = new THREE.Group(); interior.name = "interior"; cajaG.add(interior); ref.interior = interior;
    const cablesCaja = new THREE.Group(); cablesCaja.name = "cablesCaja"; interior.add(cablesCaja); ref.cablesCaja = cablesCaja;
    const reg = H.reg;
    ref.etqArduino = [];
    const etq = (id, p) => ref.etqArduino.push({ id, p });

    // ================================================================ CAJA 305 + TAPA 305b + PERNOS 120/121
    reg("305", { conexion: "Atornillada con 2 pernos M6 × 50 al travesaño de la A Este (x 420–560, y 310–450)" });
    const mCaja = () => material(0x2c2c30, { roughness: 0.55 });
    const shell = new THREE.Group();
    shell.add(caja(420, 310, -100, 560, 313, 100, mCaja()));       // piso
    shell.add(caja(420, 447, -100, 560, 450, 100, mCaja()));       // techo
    shell.add(caja(557, 313, -100, 560, 447, 100, mCaja()));       // pared Este (contra el travesaño)
    shell.add(caja(423, 313, -100, 557, 447, -97, mCaja()));       // pared Norte
    shell.add(caja(423, 313, 97, 557, 447, 100, mCaja()));         // pared Sur
    shell.add(caja(552, 315, -95, 556.5, 445, 95, material(0xe5e5ea, { roughness: 0.7 })));     // placa de montaje
    cajaG.add(marcar(capa(shell, "caja"), "305"));
    reg("305b", { conexion: "Tapa frontal que mira al centro del heliodón (bisagra al lado Norte)" });
    const tapaPiv = new THREE.Group();
    tapaPiv.position.set(mm(420), 0, mm(-100));
    cajaG.add(tapaPiv);
    ref.tapaPivot = tapaPiv;
    const tapa = caja(0, 310, 0, 3, 450, 200, material(0x3a3a40, { roughness: 0.5, transparent: true, opacity: 1 }));
    tapa.position.x = mm(-1.5);
    tapaPiv.add(marcar(capa(tapa, "caja"), "305b"));
    ref.tapa = tapa;
    H.reg("120"); H.reg("121");
    for (const z of [-50, 50]) {
      cajaG.add(marcar(capa(cilindro([600, 380, z], [606, 380, z], 5.5, material(0xc9ccd1, { metalness: 0.75 }), 6), "caja"), "120"));
      cajaG.add(marcar(capa(cilindro([552, 380, z], [606, 380, z], 3, material(0xc9ccd1, { metalness: 0.75 }), 10), "caja"), "120"));
      cajaG.add(marcar(capa(cilindro([547, 380, z], [552, 380, z], 5.5, material(0xc9ccd1, { metalness: 0.75 }), 6), "caja"), "121"));
    }

    // ================================================================ INTERIOR (sobre la placa de montaje, mirando a −x)
    const sep = (z, y) => { interior.add(capa(cilindro([544.6, y, z], [552, y, z], 2.2, material(0xc8a74a, { metalness: 0.7 }), 6), "electronica")); };
    reg("306", { conexion: H.ARDUINO["306"].pin });
    const ard = new THREE.Group();
    ard.add(caja(543, 382, -92, 544.6, 435.4, -23.4, material(0x1f4fb5, { roughness: 0.45 })));
    ard.add(caja(529, 418, -95, 543, 431, -82, material(0xb8bcc2, { metalness: 0.8, roughness: 0.3 })));     // USB-B
    ard.add(caja(532, 388, -95, 543, 397, -85, material(0x1c1c1e)));                                          // jack
    ard.add(caja(539, 398, -72, 543, 406, -36, material(0x1c1c1e)));                                          // ATmega328P
    ard.add(caja(535, 431, -88, 543, 434, -30, material(0x1c1c1e)));                                          // pines digitales
    ard.add(caja(535, 383, -80, 543, 386, -34, material(0x1c1c1e)));                                          // alimentación y analógicos
    const rot = H.cartel("UNO", 26, "#ffffff");
    rot.rotation.y = -Math.PI / 2; rot.position.set(mm(542.9), mm(415), mm(-55));
    ard.add(rot);
    interior.add(marcar(capa(ard, "electronica"), "306"));
    [[-90, 384], [-26, 384], [-90, 433], [-26, 433]].forEach(([z, y]) => sep(z, y));
    etq("306", [535, 442, -58]);
    reg("rele", { conexion: H.ARDUINO.rele.pin });
    const rel = new THREE.Group();
    rel.add(caja(543, 408, -8, 544.6, 434, 42, material(0x1f4fb5, { roughness: 0.45 })));
    rel.add(caja(524, 410, 2, 543, 429, 24, material(0x1d6fe8, { roughness: 0.35 })));
    rel.add(caja(530, 410, 31, 543, 432, 42, material(0x1f9d55)));
    rel.add(caja(536, 413, -8, 543, 429, -4, material(0x1c1c1e)));
    const ledRel = cilindro([541, 431, 0], [543, 431, 0], 1.3, new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0xff3b30, emissiveIntensity: 0.1 }), 8);
    rel.add(ledRel);
    interior.add(marcar(capa(rel, "electronica"), "rele"));
    ref.ledRele = ledRel;
    [[-5, 410], [39, 410], [-5, 432], [39, 432]].forEach(([z, y]) => sep(z, y));
    etq("rele", [528, 438, 12]);
    reg("309", { conexion: H.ARDUINO["309"].pin });
    const tca = new THREE.Group();
    tca.add(caja(543, 414, 52, 544.6, 435, 84, material(0x3a2f8f, { roughness: 0.45 })));
    tca.add(caja(540, 424, 62, 543, 430, 72, material(0x1c1c1e)));
    tca.add(caja(536, 415, 54, 543, 418, 82, material(0x1c1c1e)));
    interior.add(marcar(capa(tca, "electronica"), "309"));
    etq("309", [535, 442, 68]);
    reg("borneraBus", { conexion: H.ARDUINO.borneraBus.pin });
    const bb = new THREE.Group();
    bb.add(caja(530, 338, -12, 552, 352, 6, material(0x1f9d55)));
    for (const z of [-9, -3, 3]) bb.add(cilindro([530, 352, z], [530, 354, z], 1.8, material(0xc9ccd1, { metalness: 0.8 }), 8));
    interior.add(marcar(capa(bb, "electronica"), "borneraBus"));
    etq("borneraBus", [528, 332, -3]);
    reg("res47k", { conexion: H.ARDUINO.res47k.pin });
    const r47 = new THREE.Group();
    r47.add(cilindro([527, 358, -10.5], [527, 358, -1.5], 1.4, material(0xd9c39a), 10));
    for (const [z, zz] of [[-10.5, -9], [-1.5, -3]]) r47.add(cilindro([527, 358, z], [529, 349, zz], 0.3, material(0xc9ccd1, { metalness: 0.8 }), 6));
    [-9, -7, -5].forEach((z, i) => r47.add(cilindro([527, 358, z], [527, 358, z + 0.6], 1.45, material([0xffcc00, 0x8e44ad, 0xff3b30][i]), 10)));
    interior.add(marcar(capa(r47, "electronica"), "res47k"));
    etq("res47k", [524, 364, -6]);
    reg("bornera220", { conexion: H.ARDUINO.bornera220.pin });
    const b2 = new THREE.Group();
    b2.add(caja(528, 330, 40, 552, 346, 88, material(0x8e8e93)));
    for (const z of [46, 58, 70, 82]) b2.add(cilindro([527, 338, z], [528, 338, z], 2.5, material(0xc8a74a, { metalness: 0.7 }), 10));
    interior.add(marcar(capa(b2, "electronica"), "bornera220"));
    etq("bornera220", [526, 326, 64]);
    reg("portafusible", { conexion: H.ARDUINO.portafusible.pin });
    const pf = new THREE.Group();
    pf.add(cilindro([536, 368, 44], [536, 368, 86], 7, material(0x1c1c1e), 18));
    pf.add(cilindro([536, 368, 86], [536, 368, 90], 8.5, material(0x3a3a3c), 18));
    pf.add(caja(543, 362, 50, 552, 374, 80, material(0x1c1c1e)));
    interior.add(marcar(capa(pf, "electronica"), "portafusible"));
    etq("portafusible", [528, 380, 66]);
    reg("led", { conexion: H.ARDUINO.led.pin });
    const led = new THREE.Group();
    led.add(cilindro([445, 446, 72], [445, 452, 72], 4, material(0xc7c7cc, { metalness: 0.8, roughness: 0.25 }), 16));
    const lenteLed = cilindro([445, 452, 72], [445, 458, 72], 2.6, new THREE.MeshStandardMaterial({ color: 0xffb000, emissive: 0xffb000, emissiveIntensity: 0.05 }), 14);
    led.add(lenteLed);
    cajaG.add(marcar(capa(led, "electronica"), "led"));
    ref.ledLente = lenteLed;
    etq("led", [445, 466, 72]);
    reg("res220", { conexion: H.ARDUINO.res220.pin });
    const r22 = new THREE.Group();
    r22.add(cilindro([462, 440, 70], [452, 440, 70], 1.4, material(0xd9c39a), 10));
    [0xff3b30, 0xff3b30, 0x8b5a2b].forEach((col, i) => r22.add(cilindro([460 - i * 2, 440, 70], [459.4 - i * 2, 440, 70], 1.45, material(col), 10)));
    interior.add(marcar(capa(r22, "electronica"), "res220"));
    etq("res220", [458, 432, 70]);
    reg("entrada", { conexion: H.ARDUINO.entrada.pin });
    const ojal = (p, n) => {
      const t = new THREE.Mesh(new THREE.TorusGeometry(mm(8.5), mm(2.2), 8, 20), material(0x1c1c1e, { roughness: 0.9 }));
      t.position.set(mm(p[0]), mm(p[1]), mm(p[2]));
      t.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...n).normalize());
      return marcar(capa(t, "electronica"), "entrada");
    };
    const NP = [0, 0.5437, 0.8392];
    [[[188.9, 856, -20], [0, 0, -1]], [[580, 760, 114.3], NP], [[574.5, 295, 415.6], NP], [[560, 368.3, -171.7], [-1, 0, 0]],
      [[560, 368.3, 85.4], [-1, 0, 0]], [[560, 388, -80.2], [-1, 0, 0]]].forEach(([p, n]) => cables.add(ojal(p, n)));
    for (const z of [-60, -52, -85]) cajaG.add(ojal([500, 310.5, z], [0, 1, 0]));
    etq("entrada", [500, 318, -66]);

    // ================================================================ CABLES DENTRO DE LA CAJA (Dupont y 220 V)
    alambre("w_rele_in", ARD.D4, REL.IN);
    alambre("w_rele_vcc", ARD["5V"], REL.VCC);
    alambre("w_rele_gnd", ARD.GND, REL.GND);
    alambre("w_led", ARD.D8, [462, 440, 70], 0.8, 14);
    alambre("w_led_gnd", LEDP.ca, ARD.GND2, 0.8, 10);
    cablesCaja.add(capa(cable(ruta([[452, 440, 70], [446, 440, 70], LEDP.an], 2), 0.35, 0xc9ccd1), "electronica"));
    alambre("w_bus_dq", ARD.D2, BUS.DQ);
    alambre("w_bus_vdd", ARD["5V"], BUS.VDD);
    alambre("w_bus_gnd", ARD.GND2, BUS.GND);
    alambre("w_tca_sda", ARD.A4, TCA.SDA);
    alambre("w_tca_scl", ARD.A5, TCA.SCL);
    alambre("w_tca_vin", ARD["5V"], TCA.VIN);
    alambre("w_tca_gnd", ARD.GND, TCA.GND);
    alambre("w220_fase", B220.Fred, PF.ent, 1.3, 16);
    alambre("w220_com", PF.sal, REL.COM, 1.3, 12);
    alambre("w220_no", REL.NO, B220.Ffoco, 1.3, 20);
    alambre("w220_n", B220.Nred, B220.Nfoco, 1.3, 8);

    // ================================================================ CABLES LARGOS POR LOS TUBOS
    const PN = (y) => [580, y, -H.zPata(y)], PS = (y) => [580, y, H.zPata(y)];
    cableTramos("313", [
      ["Maqueta → bajo la mesa (pin y plato)", [[0, 884, 0], [0, 875, 0], [95, 875, 0]]],
      ["Espiral bajo la mesa → agujero del tubo 105", [[95, 875, 0], [189, 870, -36], [189, 856, -36], [189, 856, -20]]],
      ["Dentro del tubo superior 105", [[189, 856, -20], [189, 845, 0], [556, 845, 0]]],
      ["Pata Norte de la A Este", [[556, 845, 0], [580, 845, -36], PN(380)]],
      ["Travesaño → caja (por debajo)", [PN(380), [580, 380, -172], [548, 368, -172], [510, 300, -120], [500, 300, -60], [500, 313, -60]]],
      ["Dentro de la caja → bornera 1-Wire", [[500, 313, -60], [505, 330, -40], BUS.DQ]],
    ], 2.5, T.sensores.color);
    cableTramos("308d", [
      ["Maqueta → bajo la mesa (pin y plato)", [[6, 884, 0], [6, 875, 6], [95, 875, 8]]],
      ["Espiral bajo la mesa → agujero del tubo 105", [[95, 875, 8], [196, 870, -36], [196, 856, -36], [196, 856, -20]]],
      ["Dentro del tubo superior 105", [[196, 856, -20], [196, 845, 8], [552, 845, 8]]],
      ["Pata Norte de la A Este", [[552, 845, 8], [580, 845, -28], [580, 380, -H.zPata(380) + 8]]],
      ["Travesaño → caja (por debajo)", [[580, 380, -H.zPata(380) + 8], [580, 380, -164], [548, 368, -164], [512, 300, -112], [500, 300, -52], [500, 313, -52]]],
      ["Dentro de la caja → TCA9548A", [[500, 313, -52], [512, 360, 20], [528, 416, 76], [536, 418, 76]]],
    ], 3, T.bh1750.color);
    cableTramos("314", [
      ["Lazo junto al eje Este", [[500, 935, 0], [522, 962, 40], [548, 930, 80], [562, 822, 110]]],
      ["Entrada a la pata Sur (agujero Ø14)", [[562, 822, 110], [580, 780, 126], [580, 760, 114.3], PS(760)]],
      ["Pata Sur de la A Este", [PS(760), PS(380)]],
      ["Travesaño → caja", [PS(380), [580, 380, 85.4], [560, 368.3, 85.4], [548, 368, 85]]],
      ["Dentro de la caja → bornera 220 V", [[548, 368, 85], [534, 352, 80], [527, 338, 76]]],
    ], 3.5, T.foco.color, null, 25);
    cableTramos("315", [
      ["Bornera 220 V → pared Este de la caja", [[527, 338, 52], [540, 360, 30], [548, 388, -80], [557, 388, -80]]],
      ["Travesaño (hacia la pata Sur)", [[557, 388, -80], [580, 388, -80], PS(380)]],
      ["Pata Sur de la A Este (bajando)", [PS(380), PS(295)]],
      ["Salida a 11 cm de la base (agujero Ø14)", [PS(295), [574.5, 295, 415.6], [586, 288, 440]]],
      ["Junto a la rueda → piso", [[586, 288, 440], [604, 120, 520], [626, 12, 600]]],
      ["Piso → tomacorriente", [[626, 12, 600], [900, 12, 720], [990, 31, 720]]],
    ], 3.5, T.v220.color, null, 30);
    cableTramos("311", [
      ["Arduino → piso de la caja", [ARD.USB, [512, 426, -86], [505, 340, -85], [505, 313, -85]]],
      ["Caja → piso", [[505, 313, -85], [503, 15, -85]]],
      ["Piso → mesa de la laptop", [[503, 15, -85], [503, 12, -1000], [1220, 12, -1000], [1235, 700, -1000]]],
      ["Mesa → laptop", [[1235, 700, -1000], [1305, 728, -1022]]],
    ], 2.5, T.usb.color, null, 30);

    registrar("enchufe", { nombre: "Tomacorriente 220 V", grupo: "Electrónica", codigo: "—", funcion: "Alimenta el heliodón (cable 315).", material: "PVC" });
    const toma = new THREE.Group();
    toma.add(caja(1000, 0, 680, 1080, 90, 760, material(0xe5e5ea)));
    toma.add(caja(990, 22, 708, 1000, 40, 732, material(0x1c1c1e)));
    ref.raiz.add(marcar(capa(toma, "kit"), "enchufe"));
    construirMesaAuxiliar(ref);
    construirCablesMaqueta(ref);
    regCable("206c", null);
    ref.cableAro = null;
    return ref;
  };

  // ---------------------------------------------------------------------- cables dentro de la maqueta (marco local)
  function construirCablesMaqueta(ref) {
    const lev = ref.maqueta;
    const tramosBH = [];
    const gBH = new THREE.Group();
    H.CUARTOS.forEach((c) => {
      const s = c.s, cx = c.bx;
      const pts = [[cx, 89, s * 47], [cx, 86.75, s * 47], [cx, 86.75, s * 1.5], [cx, 1.5, s * 1.5]];
      if (cx !== 0) pts.push([0, 1.5, s * 1.5]);
      pts.push([0, -9, 0]);
      tramosBH.push(["Cuarto " + c.n + " → pin", pts]);
      gBH.add(cable(ruta(pts, 4), 1, T.bh1750.color));
    });
    const c8 = H.CABLES["308c"];
    registrar("308c", { nombre: c8.nombre, codigo: "308c", grupo: "Cables", tipo: "bh1750", cable: true, tramos: tramosBH, local: true,
      material: c8.conductor, funcion: "Recorrido: " + c8.recorrido, conexion: c8.desde + " → " + c8.hasta,
      largo: tramosBH.reduce((a, [, p]) => a + H.largoPoli(p), 0) });
    lev.add(marcar(capa(gBH, "cable"), "308c"));
    const CENTROS = [[-100, -55], [0, -55], [100, -55], [-75, 55], [75, 55]];
    const tramosDS = [];
    const gDS = new THREE.Group();
    CENTROS.forEach(([x, z], i) => {
      const s = Math.sign(z);
      const pts = [[x + 9, 5, z], [x + 9, 5.5, s * 9], [x + 9, 1.5, s * 2.4], [4, 1.5, s * 2.4], [4, -9, 1]];
      tramosDS.push(["Sonda del cuarto " + (i + 1) + " → pin", pts]);
      gDS.add(cable(ruta(pts, 4), 0.9, 0x1c1c1e));
    });
    const cd = H.CABLES.cablesDS;
    registrar("cablesDS", { nombre: cd.nombre, codigo: "DS18B20", grupo: "Cables", tipo: "sensores", cable: true, tramos: tramosDS, local: true,
      material: cd.conductor, funcion: "Recorrido: " + cd.recorrido, conexion: cd.desde + " → " + cd.hasta,
      largo: tramosDS.reduce((a, [, p]) => a + H.largoPoli(p), 0) });
    lev.add(marcar(capa(gDS, "cable"), "cablesDS"));
  }

  // ---------------------------------------------------------------------- mesa auxiliar y laptop
  function construirMesaAuxiliar(ref) {
    const g = new THREE.Group(); g.name = "mesaAuxiliar"; ref.raiz.add(g); ref.mesaAux = g;
    registrar("mesaAux", { nombre: "Mesa auxiliar", grupo: "Soporte", codigo: "—", material: "Melamina", funcion: "Mesa de trabajo junto al heliodón con la laptop." });
    const t = new THREE.Group();
    t.add(caja(1200, 700, -1300, 1800, 720, -800, material(0xf0eee9, { roughness: 0.7 })));
    for (const [x, z] of [[1220, -1280], [1780, -1280], [1220, -820], [1780, -820]]) t.add(caja(x - 12, 0, z - 12, x + 12, 700, z + 12, material(0xc7c7cc, { metalness: 0.5 })));
    g.add(marcar(capa(t, "kit"), "mesaAux"));
    registrar("laptop", { nombre: "Laptop con el Simulador Solar", grupo: "Electrónica", codigo: "PC", material: "—",
      funcion: "PC que controla el heliodón por USB (app de PC «Simulador Solar»).", conexion: "USB ↔ Arduino (9600 baudios)" });
    const lap = new THREE.Group();
    lap.add(caja(1300, 720, -1180, 1610, 735, -960, material(0xc7c9ce, { metalness: 0.6, roughness: 0.35 })));
    const tex = H.textura((c, w, h) => {
      const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, "#f2f2f7"); gr.addColorStop(1, "#dfe5ef");
      c.fillStyle = gr; c.fillRect(0, 0, w, h);
      c.fillStyle = "#007aff"; c.font = "700 40px Arial"; c.fillText("Simulador Solar", 30, 70);
      c.fillStyle = "#6e6e73"; c.font = "26px Arial"; c.fillText("Heliodón pequeño · UMSS", 30, 110);
      ["#007AFF", "#FF9500", "#34C759", "#FF3B30", "#AF52DE"].forEach((col, k) => { c.fillStyle = col; c.fillRect(30 + k * 90, 160, 70, 120); });
    }, 512, 320);
    const pantalla = new THREE.Group();
    pantalla.position.set(mm(1455), mm(735), mm(-1180));
    const tapaP = caja(-155, 0, 0, 155, 210, 6, material(0xc7c9ce, { metalness: 0.6 }));
    const vid = new THREE.Mesh(new THREE.PlaneGeometry(mm(290), mm(190)), new THREE.MeshBasicMaterial({ map: tex }));
    vid.position.set(0, mm(105), mm(6.5));
    pantalla.add(tapaP, vid);
    pantalla.rotation.x = 0.32;
    lap.add(pantalla);
    g.add(marcar(capa(lap, "kit"), "laptop"));
  }

  /** Cable del foco a lo largo del aro (206c, marco del aroPivot): del foco y el carro hasta el eje Este, con su espiral. */
  H.actualizarCableFoco = function () {
    const ref = H.ref, piv = ref.aroPivot, R = H.R_ARO;
    ref.raiz.updateMatrixWorld(true);
    const tc = Math.PI / 2 + ref.carroPivot.rotation.z;
    const zc = -24;                                               // por el costado Norte del tubo
    const pf = piv.worldToLocal(ref.declPivot.localToWorld(new THREE.Vector3(0, mm(-110), mm(-14))));
    const pc = piv.worldToLocal(ref.carroPivot.localToWorld(new THREE.Vector3(mm(-26), mm(R - 30), mm(zc))));
    const pts = [pf, pf.clone().lerp(pc, 0.5).add(new THREE.Vector3(0, 0, mm(-12))), pc];
    const n = Math.max(4, Math.round((tc / Math.PI) * 60));
    const t0 = tc - 0.075;
    for (let k = 0; k <= n; k++) {
      const t = t0 - (t0 - 0.04) * (k / n);
      pts.push(new THREE.Vector3(mm(R * Math.cos(t)), mm(R * Math.sin(t)), mm(zc)));
    }
    pts.push(new THREE.Vector3(mm(500), 0, mm(-10)), new THREE.Vector3(mm(500), 0, 0));
    const curva = new THREE.CatmullRomCurve3(pts, false, "centripetal");
    const geo = new THREE.TubeGeometry(curva, 180, mm(3.5), 8, false);
    const hel = [];
    const m = 8 * n;
    for (let k = 0; k <= m; k++) {
      const t = t0 - (t0 - 0.04) * (k / m), fase = k * 0.9;
      const radial = new THREE.Vector3(Math.cos(t), Math.sin(t), 0), z = new THREE.Vector3(0, 0, 1);
      const c = radial.clone().multiplyScalar(mm(R)).add(new THREE.Vector3(0, 0, mm(zc)));
      hel.push(c.add(radial.multiplyScalar(mm(6) * Math.cos(fase))).add(z.multiplyScalar(mm(6) * Math.sin(fase))));
    }
    const geoE = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hel), Math.min(1800, m * 2), mm(1.1), 5, false);
    if (!ref.cableAro) {
      ref.cableAro = new THREE.Mesh(geo, material(T.foco.color, { roughness: 0.5 }));
      ref.espiral = new THREE.Mesh(geoE, material(0x8e8e93, { roughness: 0.5 }));
      ref.cableAro.castShadow = true;
      piv.add(marcar(capa(ref.cableAro, "cable"), "206c"), marcar(capa(ref.espiral, "cable"), "206c"));
    } else {
      ref.cableAro.geometry.dispose(); ref.cableAro.geometry = geo;
      ref.espiral.geometry.dispose(); ref.espiral.geometry = geoE;
    }
    const W = (v) => [v.x * 1000, v.y * 1000, v.z * 1000];          // mm en el marco del aro (el del cable)
    const e = H.comps["206c"];
    const arc = pts.slice(2, pts.length - 2).map(W);
    e.tramos = [["Foco → carro", pts.slice(0, 3).map(W)], ["Por el costado del aro (en espiral)", arc], ["Llegada al eje Este", [arc[arc.length - 1]].concat(pts.slice(-2).map(W))]];
    e.puntos = e.tramos.flatMap(([, p], i) => (i ? p.slice(1) : p));
    e.largo = H.largoPoli(e.puntos);
  };

  /** Cables colgantes entre el pin de la maqueta levantada y la mesa. */
  H.actualizarColgantes = function (subida) {
    const ref = H.ref;
    if (!ref.colgantes) {
      ref.colgantes = new THREE.Group();
      ref.raiz.add(ref.colgantes);
      ref.colgantes.add(capa(new THREE.Mesh(new THREE.BufferGeometry(), material(T.bh1750.color)), "cable"));
      ref.colgantes.add(capa(new THREE.Mesh(new THREE.BufferGeometry(), material(T.sensores.color)), "cable"));
    }
    const g = ref.colgantes;
    g.visible = subida > 0.004;
    if (!g.visible) return;
    ref.raiz.updateMatrixWorld(true);
    const a = ref.maqueta.localToWorld(new THREE.Vector3(0, mm(-12), 0));
    const b = new THREE.Vector3(0, mm(888.5), 0);
    const caida = Math.min(mm(70), subida * 0.25);
    const ladeo = new THREE.Vector3(mm(25), 0, mm(18));
    [[0, 3], [mm(6), 2.5]].forEach(([dx, r], k) => {
      const c = new THREE.CatmullRomCurve3([a.clone().add(new THREE.Vector3(dx, 0, 0)),
        a.clone().lerp(b, 0.35).add(ladeo).add(new THREE.Vector3(dx, -caida, 0)),
        a.clone().lerp(b, 0.75).add(ladeo.clone().multiplyScalar(0.6)).add(new THREE.Vector3(dx, -caida * 0.6, 0)),
        b.clone().add(new THREE.Vector3(dx, mm(6), 0)), b.clone().add(new THREE.Vector3(dx, 0, 0))]);
      const m = g.children[k];
      m.geometry.dispose();
      m.geometry = new THREE.TubeGeometry(c, 60, mm(r), 8, false);
    });
  };
})();
