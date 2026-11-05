/* Electrónica y cables (diseño del 05/11/2026): caja del Arduino 305 COLGADA bajo el tubo 105 junto al pin central,
   con techo cerrado, PUERTA FRONTAL 305b (bisagra al Oeste, los 3 LED) y abrazaderas 305c; adentro el Arduino UNO,
   el módulo de 4 relés HW-316, el multiplexor TCA9548A, la placa del bus 1-Wire y la parte de 220 V con cada cable
   en su pin real. Cables largos por dentro de los tubos con los recorridos de SolidWorks: 12 hilos de los BH1750
   (308d), bus de los DS18B20 (312), foco y alimentación (310) y USB al panel del montante (311).
   Medidas en mm: la caja y su interior en el marco local de la caja (ver H.DIM.cajaOff), el resto en el marco global. */
(function () {
  const H = window.H;
  const { mm, caja, cilindro, material, COL, registrar, marcar, ruta, cable, capa } = H;
  const T = H.TIPOS;

  // ------------------------------------------------------------------ pines reales (mm, cima del pin)
  const ARD = { "5V": [22.5, 199, 21.6], GND: [22.5, 199, 24.1], GND2: [22.5, 199, 26.7], VIN: [22.5, 199, 29.2],
    A4: [22.5, 199, 44.5], A5: [22.5, 199, 47.0], D2: [71, 199, 44.9], D4: [71, 199, 39.8], D8: [71, 199, 30.5], USB: [36, 196, 66] };
  const REL = { GND: [-28, 199, 20], IN1: [-28, 199, 25], IN2: [-28, 199, 30], IN3: [-28, 199, 35], IN4: [-28, 199, 40], VCC: [-28, 199, 45] };
  const relTerm = (k, t) => [-92, 201, 14 + 12.5 * k + { NC: 0, COM: 3.5, NO: 7 }[t]];
  const tcaFila1 = ["VIN", "GND", "SDA", "SCL", "RST", "A0", "A1", "A2", "SD7", "SC7", "SD6", "SC6"];
  const tcaFila2 = ["SD0", "SC0", "SD1", "SC1", "SD2", "SC2", "SD3", "SC3", "SD4", "SC4", "SD5", "SC5"];
  const TCA = {};
  tcaFila1.forEach((n, k) => (TCA[n] = [-57.5 + 2.54 * k, 192.1, -20.25]));
  tcaFila2.forEach((n, k) => (TCA[n] = [-57.5 + 2.54 * k, 192.1, -38.75]));
  const PLACA = { "5V": [11, 197, -20], GND: [11, 197, -22.54], DQ: [11, 197, -25.08], VDDo: [-12, 198, -59], DQo: [-7, 198, -59], GNDo: [-2, 198, -59] };
  const LED = { verde: [-60, 290, 66], ambar: [-45, 290, 66], rojo: [-30, 290, 66] };
  const BP = { Fred: [-88, 197, -57], Nred: [-77, 197, -57], Ffoco: [-66, 197, -57], Nfoco: [-55, 197, -57] };
  const ARD_DZ = -12;                 // el Arduino va 12 mm más atrás (como en SolidWorks): la ficha USB entra antes de la puerta
  Object.values(ARD).forEach((p) => { p[2] += ARD_DZ; });
  H.PINES = { ARD, REL, TCA, PLACA };

  let nAlt = 0;
  /** Cable Dupont / de conexión entre dos pines (arco por arriba). */
  function alambre(id, info, a, b, tipo, r = 0.75, alto) {
    const h = alto || 214 + (nAlt++ % 9) * 2.2;
    const pts = [a, [a[0], a[1] + 5, a[2]], [a[0], h, a[2]], [b[0], h, b[2]], [b[0], b[1] + 5, b[2]], b];
    registrar(id, Object.assign({ grupo: "Cables", tipo, lista: "N° 17 · Cables Dupont macho–hembra" }, info));
    const m = cable(ruta(pts, 5), r, T[tipo].color);
    (H.ref.cablesCaja || H.ref.cables).add(marcar(capa(m, "cable"), id));      // cables Dupont: dentro de la caja (marco local)
    return m;
  }
  function tramo(id, info, pts, r, tipo, radio = 14, padre) {
    registrar(id, Object.assign({ grupo: "Cables", tipo }, info));
    const m = cable(ruta(pts, radio), r, T[tipo].color);
    (padre || H.ref.cables).add(marcar(capa(m, "cable"), id));
    return m;
  }

  H.construirElectronica = function (escena) {
    const ref = H.ref, D = H.DIM, G = H.G;
    const cables = new THREE.Group(); cables.name = "cables"; ref.raiz.add(cables); ref.cables = cables;

    // ================================================================ CAJA 305 COLGADA + PUERTA 305b + ABRAZADERAS 305c
    // cajaG: grupo de la caja (se mueve en la vista explosionada). cl: marco local de la caja (x −100..100, y 180..320,
    // z −70..70) colocado en su lugar real, colgado 3 mm bajo el tubo 105 junto al pin central (x 25..225, y 697..837 con los tubos de 25x25).
    const cajaG = new THREE.Group(); cajaG.name = "caja"; ref.raiz.add(cajaG); ref.caja = cajaG;
    const cl = new THREE.Group(); cl.name = "cajaLocal"; cl.position.set(mm(D.cajaOff[0]), mm(D.cajaOff[1]), mm(D.cajaOff[2]));
    cajaG.add(cl); ref.cajaLocal = cl;
    const cablesCaja = new THREE.Group(); cablesCaja.name = "cablesCaja"; cl.add(cablesCaja); ref.cablesCaja = cablesCaja;
    registrar("305", Object.assign(H.infoSW("305_Caja_Arduino"), { grupo: "Caja del Arduino", lista: "N° 37 · Caja plástica",
      conexion: "Colgada bajo el tubo 105 (el que sostiene la mesa), junto al pin central, con 2 abrazaderas · techo cerrado (sin tapa) · los cables entran por el techo desde el tubo" }));
    const mCaja = () => material(0xf4f4f2, { roughness: 0.6 });
    const shell = new THREE.Group();
    shell.add(caja(-100, 180, -70, 100, 183, 70, mCaja()));          // piso
    shell.add(caja(-100, 317, -70, 100, 320, 70, mCaja()));          // techo cerrado
    shell.add(caja(-100, 183, -70, -97, 317, 70, mCaja()));          // lado Oeste
    shell.add(caja(97, 183, -70, 100, 317, 70, mCaja()));            // lado Este
    shell.add(caja(-97, 183, -70, 97, 317, -67, mCaja()));           // fondo (Norte); el frente (Sur) es la puerta
    cl.add(marcar(capa(shell, "caja"), "305"));
    // bisagra: eje vertical en la esquina Oeste del frente (global x 21, z 76)
    const BX = D.caja.bisagra[0] - D.cajaOff[0], BZ = D.caja.bisagra[1];
    registrar("bisagras", Object.assign(H.infoBOM(58), { grupo: "Caja del Arduino", conexion: "Bisagra vertical en el lado Oeste del frente: la puerta abre 85° hacia adelante (botón «Caja»)" }));
    const bis = new THREE.Group();
    for (const [y0, y1] of [[186, 210], [290, 314]]) {
      bis.add(caja(BX + 1, y0, 40, -100, y1, BZ, material(0xc8a74a, { metalness: 0.7, roughness: 0.35 })));
      bis.add(cilindro([BX, y0, BZ], [BX, y1, BZ], 3.5, material(0xc8a74a, { metalness: 0.7, roughness: 0.35 }), 14));
    }
    bis.add(cilindro([BX, 186, BZ], [BX, 314, BZ], 1.5, material(COL.metal, { metalness: 0.8 }), 8));
    cl.add(marcar(capa(bis, "caja"), "bisagras"));

    // puerta frontal 305b (gira sobre el eje de la bisagra): 3 LED, perilla, cables con bucle de holgura y conector
    registrar("305b", Object.assign(H.infoSW("305b_Caja_Arduino_Puerta_Frontal"), { grupo: "Caja del Arduino",
      conexion: "Puerta de la cara frontal (Sur) con los 3 LED · bisagra vertical al Oeste · abre 0–85° hacia adelante (botón «Caja»)" }));
    const puerta = new THREE.Group();
    puerta.position.set(mm(BX), 0, mm(BZ));
    cl.add(puerta);
    ref.puerta = puerta;
    const P = (x, y, z) => [x - BX, y, z - BZ];                 // punto local de la caja -> marco de la puerta
    const hoja = new THREE.Group();
    hoja.add(caja(...P(-99.5, 180, 70), ...P(100, 320, 73), mCaja()));
    hoja.add(caja(...P(BX, 212, 73), ...P(-65, 288, BZ), mCaja()));
    hoja.add(cilindro(P(BX, 212, BZ), P(BX, 288, BZ), 3.5, mCaja(), 14));
    puerta.add(marcar(capa(hoja, "caja"), "305b"));
    registrar("cierre", Object.assign(H.infoBOM(59), { grupo: "Caja del Arduino", conexion: "Imán en el lado Este de la caja y placa en la puerta: la mantiene cerrada" }));
    cl.add(marcar(capa(caja(93, 245, 58, 97, 259, 67, material(COL.negro)), "caja"), "cierre"));
    puerta.add(marcar(capa(caja(...P(90, 244, 68), ...P(97, 260, 70), material(COL.metal, { metalness: 0.7 })), "caja"), "cierre"));
    registrar("perilla", { nombre: "Perilla de la puerta", grupo: "Caja del Arduino", codigo: "305b", funcion: "Para abrir la puerta frontal de la caja." });
    puerta.add(marcar(capa(cilindro(P(80, 250, 73), P(80, 250, 85), 6, material(COL.negro), 18), "caja"), "perilla"));
    registrar("ledVerde", Object.assign(H.infoBOM(10), { grupo: "Caja del Arduino", conexion: "En la puerta · ánodo ← 1 kΩ ← 5V · cátodo → GND (encendido = hay energía)" }));
    registrar("ledAmbar", Object.assign(H.infoBOM(9), { grupo: "Caja del Arduino", conexion: "En la puerta · ánodo ← 220 Ω ← Arduino D8 · cátodo → GND (encendido = foco encendido)" }));
    registrar("ledRojo", Object.assign(H.infoBOM(47), { grupo: "Caja del Arduino", nombre: "LED rojo (tercer agujero de la puerta, reserva)", conexion: "Sin conectar (reserva)" }));
    ref.leds = {};
    [["ledVerde", -60, 0x30d158], ["ledAmbar", -45, 0xffb000], ["ledRojo", -30, 0xff453a]].forEach(([id, x, col]) => {
      const g = new THREE.Group();
      g.add(cilindro(P(x, 290, 63), P(x, 290, 76.5), 4, material(0xc7c7cc, { metalness: 0.8, roughness: 0.25 }), 16));
      const lente = cilindro(P(x, 290, 76.5), P(x, 290, 80), 2.5, new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: id === "ledVerde" ? 1.2 : 0.05 }), 14);
      g.add(lente);
      puerta.add(marcar(capa(g, "electronica"), id));
      ref.leds[id] = lente;
    });
    registrar("res220", Object.assign(H.infoBOM(7), { grupo: "Caja del Arduino", conexion: "En serie con el LED ámbar (D8), en la pata del LED, cubierta con termocontraíble" }));
    registrar("res1k", Object.assign(H.infoBOM(8), { grupo: "Caja del Arduino", conexion: "En serie con el LED verde (5V), en la pata del LED" }));
    registrar("termo", Object.assign(H.infoBOM(30), { grupo: "Cableado", conexion: "Cubre las resistencias de los LED y los empalmes" }));
    puerta.add(marcar(capa(cilindro(P(-45, 268, 62), P(-45, 283, 62), 1.6, material(0xd9c39a), 10), "electronica"), "res220"));
    puerta.add(marcar(capa(cilindro(P(-60, 268, 62), P(-60, 283, 62), 1.6, material(0xd9c39a), 10), "electronica"), "res1k"));
    for (const x of [-45, -60]) puerta.add(marcar(capa(cilindro(P(x, 265, 62), P(x, 286, 62), 2.2, material(COL.negro, { transparent: true, opacity: 0.55 }), 10), "electronica"), "termo"));
    // cables de los LED dentro de la puerta: bucle en U de holgura (~18 cm) y conector de 4 pines junto a la bisagra
    registrar("conectorPuerta", Object.assign(H.infoBOM(60), { grupo: "Caja del Arduino",
      conexion: "Une los LED de la puerta con D8, 5V y GND; el bucle de holgura deja abrir la puerta sin tirar" }));
    const arnes = cable(ruta([P(-30, 268, 64), P(-91, 268, 64), P(-91, 203, 64), P(-81, 203, 64), P(-81, 255, 64)], 6), 1.2, 0x3a3a3c);
    puerta.add(marcar(capa(arnes, "cable"), "conectorPuerta"));
    puerta.add(marcar(capa(caja(...P(-86, 255, 60), ...P(-76, 266, 66), material(COL.blanco)), "electronica"), "conectorPuerta"));
    const CONECTOR = [-81, 262, 58];              // mitad fija del conector (lado del Arduino)
    cl.add(marcar(capa(caja(-86, 255, 54, -76, 266, 59, material(COL.negro)), "electronica"), "conectorPuerta"));

    // lado Oeste: interruptor (24) y portafusible (25); techo: pasacables (35) donde bajan los cables del tubo
    registrar("interruptor", Object.assign(H.infoBOM(24), { grupo: "220 V", conexion: "Lado Oeste de la caja · fase de la red → interruptor → portafusible → COM del relé 1" }));
    const intr = new THREE.Group();
    intr.add(caja(-106, 265, -48, -100, 285, -32, material(COL.negro)));
    intr.add(caja(-109, 268, -45, -106, 282, -35, new THREE.MeshStandardMaterial({ color: 0xff453a, emissive: 0xff453a, emissiveIntensity: 0.6 })));
    cl.add(marcar(capa(intr, "electronica"), "interruptor"));
    registrar("portafusible", Object.assign(H.infoBOM(25), { grupo: "220 V", conexion: "Entre el interruptor y el COM del relé 1 · lleva el fusible de 2 A (N° 26)" }));
    registrar("fusible", Object.assign(H.infoBOM(26), { grupo: "220 V", conexion: "Dentro del portafusible (1 en uso + repuestos en el kit)" }));
    const pf = new THREE.Group();
    pf.add(cilindro([-114, 275, -15], [-100, 275, -15], 6.5, material(COL.negro), 18));
    cl.add(marcar(capa(pf, "electronica"), "portafusible"));
    cl.add(marcar(capa(cilindro([-98, 275, -15], [-78, 275, -15], 2.5, material(0xdfe6ee, { transparent: true, opacity: 0.8 }), 10), "electronica"), "fusible"));
    registrar("pasacables", Object.assign(H.infoBOM(35), { grupo: "Cableado", conexion: "En cada agujero por donde un cable entra o sale de un tubo o del techo de la caja (23 pasos)" }));
    const ojal = (p, eje = "y") => {
      const t = new THREE.Mesh(new THREE.TorusGeometry(mm(4.2), mm(1.1), 8, 18), material(COL.goma));
      if (eje === "y") t.rotation.x = Math.PI / 2; else if (eje === "x") t.rotation.y = Math.PI / 2;
      t.position.set(mm(p[0]), mm(p[1]), mm(p[2]));
      return marcar(capa(t, "cable"), "pasacables");
    };
    // techo de la caja y fondo del tubo 105 (12 hilos x 55, bus x 40, USB x 140, foco x 160, alimentación x 175)
    const YC = D.caja.y[1], Y5 = D.y105, TB2 = D.tubo / 2;      // techo de la caja y eje del tubo 105
    for (const [x, z] of [[55, 0], [40, 6], [140, -6], [160, -3], [175, 5]]) { cajaG.add(ojal([x, YC + 0.5, z])); cajaG.add(ojal([x, Y5 - TB2 - 0.5, z])); }
    for (const p of [[0, Y5 + TB2 + 0.5, 0], [581, Y5 + TB2 + 0.5, -3], [594, Y5 + TB2 + 0.5, 5], [-594, Y5 + TB2 + 0.5, -6], [594, D.yTS + TB2 + 0.5, 62], [594, D.yTS - TB2 + 0.5, 420], [-594, D.yTS - TB2 + 0.5, -420]]) cables.add(ojal(p));
    cables.add(ojal([40, 860, TB2 + 0.5], "z"));

    // abrazaderas 305c (N° 38) con sus autorroscantes (N° 42): la caja cuelga del tubo 105
    registrar("305c", Object.assign(H.infoSW("305c_Abrazaderas_Caja_Tubo_105"), H.infoBOM(38), { grupo: "Caja del Arduino", codigo: "305c · N° 38",
      conexion: "Abrazan el tubo 105 a 95–115 y 195–215 mm del pin; sus alas se atornillan al techo de la caja (la caja queda 3 mm bajo el tubo)" }));
    const abz = new THREE.Group();
    const mGalv = () => material(0xb9bdc3, { metalness: 0.75, roughness: 0.3 });
    for (const [x0, x1] of D.caja.abrazaderas) {
      const yb = Y5 - TB2, yt = Y5 + TB2, h = TB2 + 0.1;       // fleje 3 mm alrededor del tubo 105 de 25x25
      abz.add(caja(x0, yt + 0.1, -h - 3, x1, yt + 3.1, h + 3, mGalv()));
      abz.add(caja(x0, yb - 3, -h - 3, x1, yt + 3.1, -h, mGalv()));
      abz.add(caja(x0, yb - 3, h, x1, yt + 3.1, h + 3, mGalv()));
      abz.add(caja(x0, yb - 3, -42, x1, yb, -h - 3, mGalv()));
      abz.add(caja(x0, yb - 3, h + 3, x1, yb, 42, mGalv()));
    }
    cajaG.add(marcar(capa(abz, "caja"), "305c"));
    registrar("autorroscantes", Object.assign(H.infoBOM(42), { grupo: "Caja del Arduino", conexion: "4 tornillos: las alas de las abrazaderas al techo de la caja" }));
    for (const [x0, x1] of D.caja.abrazaderas) for (const z of [-30, 30]) {
      const x = (x0 + x1) / 2;
      cajaG.add(marcar(capa(cilindro([x, Y5 - TB2, z], [x, Y5 - TB2 + 2.5, z], 3.5, material(COL.metal, { metalness: 0.8 }), 10), "caja"), "autorroscantes"));
    }

    // ================================================================ INTERIOR (sale por el frente en la vista explosionada)
    const int = new THREE.Group(); int.name = "interior"; cl.add(int); ref.interior = int;
    const sep = (x, z, h, id) => int.add(marcar(capa(cilindro([x, 183, z], [x, 183 + h, z], 2.2, material(COL.laton, { metalness: 0.7 }), 6), "electronica"), id));
    registrar("sepM3", Object.assign(H.infoBOM(40), { grupo: "Caja del Arduino", conexion: "Bajo el Arduino, el módulo de relés y la placa perforada" }));
    registrar("tornM3", Object.assign(H.infoBOM(41), { grupo: "Caja del Arduino", conexion: "Fijan las placas a los separadores" }));
    registrar("sepM2", Object.assign(H.infoBOM(57), { grupo: "Caja del Arduino", conexion: "Bajo el TCA9548A" }));

    // Arduino UNO 306 (12 mm más atrás que antes: deja lugar a la ficha USB, que sube por el techo)
    registrar("306", Object.assign(H.infoSW("306_Arduino_UNO_R3"), H.infoBOM(1), { grupo: "Caja del Arduino", codigo: "306 · N° 1",
      conexion: "D2 bus 1-Wire · D4 relé 1 · D8 LED ámbar · A4/A5 I2C al TCA9548A · 5V y GND · USB (por los tubos) al USB-B de panel del montante" }));
    const ard = new THREE.Group();
    ard.position.z = mm(ARD_DZ);
    ard.add(caja(20, 189, -6, 73.4, 190.6, 62.6, material(COL.pcbAzul, { roughness: 0.45 })));
    ard.add(caja(30, 190.6, 52, 42, 201.5, 66, material(0xb8bcc2, { metalness: 0.8, roughness: 0.3 })));       // USB-B
    ard.add(caja(55, 190.6, 55, 64, 201, 66, material(COL.negro)));                                            // jack
    ard.add(caja(42, 190.6, 12, 50, 194, 48, material(COL.negro)));                                            // ATmega328P
    ard.add(caja(69.7, 190.6, 2, 72.3, 199, 50, material(COL.negro)));                                         // pines digitales
    ard.add(caja(21.2, 190.6, 12.7, 23.8, 199, 30.5, material(COL.negro)));                                    // pines de alimentación
    ard.add(caja(21.2, 190.6, 33, 23.8, 199, 48.3, material(COL.negro)));                                      // pines analógicos
    ard.add(caja(55, 190.6, 20, 64, 193, 30, material(0xc7c7cc, { metalness: 0.8 })));                         // cristal
    const rotulo = H.cartel("UNO", 22, "#ffffff");
    rotulo.rotation.x = -Math.PI / 2; rotulo.position.set(mm(60), mm(190.7), mm(40));
    ard.add(rotulo);
    int.add(marcar(capa(ard, "electronica"), "306"));
    for (const [x, z] of [[24, -2], [69, -2], [24, 58], [69, 58]]) { sep(x, z + ARD_DZ, 6, "sepM3"); int.add(marcar(capa(cilindro([x, 190.6, z + ARD_DZ], [x, 192, z + ARD_DZ], 2.6, material(COL.metal, { metalness: 0.8 }), 8), "electronica"), "tornM3")); }

    // módulo de 4 relés HW-316 (relé 1 = foco)
    registrar("rele", Object.assign(H.infoBOM(4), { grupo: "Caja del Arduino", nombre: "Módulo de 4 relés HW-316 (relé 1 = foco)", codigo: "N° 4",
      conexion: "IN1 ← Arduino D4 (activo en bajo) · VCC ← 5V · GND ← GND · relé 1: COM ← fase, NO → foco (relés 2-4 libres)" }));
    const rel = new THREE.Group();
    rel.add(caja(-95, 189, 10, -25, 190.6, 64, material(COL.pcbAzul, { roughness: 0.45 })));
    for (let k = 0; k < 4; k++) {
      const z0 = 12.5 * k + 11;
      rel.add(caja(-74, 190.6, z0, -55, 206, z0 + 11.5, material(0x1d4ed8, { roughness: 0.4 })));             // relé azul
      rel.add(caja(-95, 190.6, z0 + 0.5, -86, 201, z0 + 11, material(0x1f9d55)));                             // bornera
      for (const t of ["NC", "COM", "NO"]) { const p = relTerm(k, t); rel.add(cilindro([p[0], 200, p[2]], [p[0], 201.2, p[2]], 1.2, material(COL.metal, { metalness: 0.8 }), 8)); }
      rel.add(caja(-45, 190.6, z0 + 2, -38, 194, z0 + 8, material(COL.negro)));                              // optoacoplador
      rel.add(cilindro([-34, 190.6, z0 + 5], [-34, 192.5, z0 + 5], 1.2, new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0xff3b30, emissiveIntensity: k === 0 ? 0.2 : 0.05 }), 8));
    }
    rel.add(caja(-29.3, 190.6, 17.5, -26.7, 199, 47.5, material(COL.negro)));                                  // pines de entrada
    int.add(marcar(capa(rel, "electronica"), "rele"));
    ref.ledRele = rel.children[7];                  // LED del relé 1
    for (const [x, z] of [[-91, 13], [-29, 13], [-91, 61], [-29, 61]]) sep(x, z, 6, "sepM3");

    // multiplexor TCA9548A (309)
    registrar("309", Object.assign(H.infoSW("309_Multiplexor_TCA9548A"), H.infoBOM(55), { grupo: "Caja del Arduino", codigo: "309 · N° 55",
      conexion: "VIN ← 5V · GND ← GND · SDA ← A4 · SCL ← A5 · A0-A2 a GND (0x70) · canales 0-4 → BH1750 de los cuartos 1-5" }));
    const tca = new THREE.Group();
    tca.add(caja(-60, 188, -40, -28, 189.6, -19, material(COL.pcbMorado, { roughness: 0.45 })));
    tca.add(caja(-47.25, 189.6, -31.7, -40.75, 190.6, -27.3, material(COL.negro)));
    tca.add(caja(-58.8, 189.6, -21.5, -28.6, 192.1, -19, material(COL.negro)));
    tca.add(caja(-58.8, 189.6, -40, -28.6, 192.1, -37.5, material(COL.negro)));
    int.add(marcar(capa(tca, "electronica"), "309"));
    for (const [x, z] of [[-57, -37], [-31, -37], [-57, -22], [-31, -22]]) sep(x, z, 5, "sepM2");

    // placa perforada del bus 1-Wire: pull-up 4,7 kΩ, borneras, tira de pines, puentes de cable sólido
    registrar("placa", Object.assign(H.infoBOM(11), { grupo: "Caja del Arduino", nombre: "Placa perforada del bus 1-Wire (1 de 2)",
      conexion: "5V, GND y D2 del Arduino → pull-up 4,7 kΩ → bornera de salida VDD-DQ-GND al bus de los DS18B20" }));
    const placa = new THREE.Group();
    placa.add(caja(-18, 189, -62, 14, 190.6, -12, material(0xc9a66b, { roughness: 0.7 })));
    int.add(marcar(capa(placa, "electronica"), "placa"));
    for (const [x, z] of [[-15, -59], [11, -59], [-15, -15], [11, -15]]) sep(x, z, 6, "sepM3");
    registrar("res47k", Object.assign(H.infoBOM(6), { grupo: "Caja del Arduino", conexion: "Pull-up entre DQ (D2) y 5V, en la placa perforada" }));
    int.add(marcar(capa(cilindro([-5, 192, -40], [5, 192, -40], 1.4, material(0xd9c39a), 10), "electronica"), "res47k"));
    registrar("bornera3", Object.assign(H.infoBOM(15), { grupo: "Caja del Arduino", conexion: "1 en la placa (salida del bus VDD-DQ-GND) + 5 en la caja de empalme + 1 de llegada" }));
    int.add(marcar(capa(caja(-15, 190.6, -62, 1, 198, -56, material(0x1f9d55)), "electronica"), "bornera3"));
    registrar("bornera2", Object.assign(H.infoBOM(14), { grupo: "Caja del Arduino", conexion: "Entradas de 5V y GND en la placa" }));
    int.add(marcar(capa(caja(-15, 190.6, -32, -5, 198, -26, material(0x1f9d55)), "electronica"), "bornera2"));
    registrar("tiraPines", Object.assign(H.infoBOM(13), { grupo: "Caja del Arduino", conexion: "Pines 5V / GND / DQ de la placa (cables Dupont al Arduino)" }));
    int.add(marcar(capa(caja(9.7, 190.6, -27, 12.3, 197, -18, material(COL.negro)), "electronica"), "tiraPines"));
    registrar("cableSolido", Object.assign(H.infoBOM(19), { grupo: "Caja del Arduino", conexion: "Puentes soldados en la placa perforada (rojo 5V, negro GND, amarillo DQ)" }));
    [[0xff453a, -20], [0x2c2c2e, -23], [0xffd60a, -26]].forEach(([c, z]) => int.add(marcar(capa(cable(ruta([[8, 191, z], [-2, 191, z], [-2, 191, -50]], 2), 0.5, c), "electronica"), "cableSolido")));

    // parte de 220 V: bornera de potencia (27) con punteras (28)
    registrar("bornera220", Object.assign(H.infoBOM(27), { grupo: "220 V", conexion: "F red · N red · F foco · N foco (neutro con puente)" }));
    int.add(marcar(capa(caja(-95, 183, -64, -50, 195, -50, material(0x8e8e93)), "electronica"), "bornera220"));
    registrar("punteras", Object.assign(H.infoBOM(28), { grupo: "220 V", conexion: "En las puntas de los cables de 220 V (bornera y relé)" }));
    for (const k in BP) int.add(marcar(capa(cilindro([BP[k][0], 195, BP[k][2] + 3], [BP[k][0], 199, BP[k][2] + 3], 1.6, material(0xc8a74a, { metalness: 0.7 }), 8), "electronica"), "punteras"));

    // ================================================================ CABLES DENTRO DE LA CAJA (marco local)
    const W = (id, nombre, a, b, tipo, conexion, extra = {}) => alambre(id, Object.assign({ nombre, conexion }, extra), a, b, tipo);
    W("w_rel_vcc", "+5 V al módulo de relés", ARD["5V"], REL.VCC, "v5", "Arduino 5V → HW-316 VCC");
    W("w_rel_gnd", "GND al módulo de relés", ARD.GND, REL.GND, "gnd", "Arduino GND → HW-316 GND");
    W("w_rel_in1", "Señal del foco (D4)", ARD.D4, REL.IN1, "senal", "Arduino D4 → HW-316 IN1 (LOW = foco encendido)");
    W("w_tca_vin", "+5 V al TCA9548A", ARD["5V"], TCA.VIN, "v5", "Arduino 5V → TCA9548A VIN", { lista: "Cable de 4 hilos del 309 (Dupont)" });
    W("w_tca_gnd", "GND al TCA9548A", ARD.GND, TCA.GND, "gnd", "Arduino GND → TCA9548A GND", { lista: "Cable de 4 hilos del 309 (Dupont)" });
    W("w_tca_sda", "I2C SDA (A4)", ARD.A4, TCA.SDA, "i2c", "Arduino A4 → TCA9548A SDA", { lista: "Cable de 4 hilos del 309 (Dupont)" });
    W("w_tca_scl", "I2C SCL (A5)", ARD.A5, TCA.SCL, "i2c", "Arduino A5 → TCA9548A SCL", { lista: "Cable de 4 hilos del 309 (Dupont)" });
    for (const a of ["A0", "A1", "A2"]) alambre("w_tca_" + a, { nombre: `Dirección ${a} a GND`, conexion: `TCA9548A ${a} → GND (dirección 0x70)` }, TCA[a], TCA.GND, "gnd", 0.5, 197);
    W("w_placa_5v", "+5 V a la placa del bus", ARD["5V"], PLACA["5V"], "v5", "Arduino 5V → placa perforada (VDD y pull-up)");
    W("w_placa_gnd", "GND a la placa del bus", ARD.GND2, PLACA.GND, "gnd", "Arduino GND → placa perforada (GND del bus)");
    W("w_placa_dq", "Bus 1-Wire (D2)", ARD.D2, PLACA.DQ, "onewire", "Arduino D2 → placa perforada DQ (pull-up 4,7 kΩ a 5V)");
    // LED de la puerta: llegan a la mitad fija del conector de 4 pines junto a la bisagra
    W("w_led_d8", "LED ámbar (D8 con 220 Ω)", ARD.D8, [CONECTOR[0] - 3, CONECTOR[1], CONECTOR[2]], "led", "Arduino D8 → conector de la puerta → 220 Ω → ánodo del LED ámbar", { lista: "N° 60 · Conector de 4 pines de la puerta" });
    W("w_led_5v", "LED verde (5V con 1 kΩ)", ARD["5V"], [CONECTOR[0] - 1, CONECTOR[1], CONECTOR[2]], "v5", "Arduino 5V → conector de la puerta → 1 kΩ → ánodo del LED verde", { lista: "N° 60 · Conector de 4 pines de la puerta" });
    W("w_led_gnd", "GND de los LED", ARD.GND2, [CONECTOR[0] + 2, CONECTOR[1], CONECTOR[2]], "gnd", "Cátodos de los LED → conector de la puerta → Arduino GND", { lista: "N° 60 · Conector de 4 pines de la puerta" });

    // 220 V dentro de la caja: la alimentación y el cable del foco bajan del tubo 105 por el techo (pasacables)
    const ALIM = H.L([175, D.caja.y[1] - 2, 5]), FOCO = H.L([160, D.caja.y[1] - 2, -3]);
    const W220 = (id, nombre, pts, conexion) => tramo(id, { nombre, conexion, lista: "N° 22 · Cable vulcanizado 2 × 1,0 mm² (con punteras N° 28)" }, pts, 1.2, "v220", 6, cablesCaja);
    W220("w220_fred", "Fase de la red → bornera", [[ALIM[0], ALIM[1], ALIM[2] - 1.3], [ALIM[0], 292, -10.3], [-20, 250, -36], [-88, 215, -50], BP.Fred], "Alimentación (fase, entra por el techo) → bornera F red");
    W220("w220_nred", "Neutro de la red → bornera", [[ALIM[0], ALIM[1], ALIM[2] + 1.3], [ALIM[0], 292, -7.7], [-14, 248, -34], [-77, 215, -50], BP.Nred], "Alimentación (neutro, entra por el techo) → bornera N red");
    W220("w220_int", "Fase → interruptor", [BP.Fred, [-88, 220, -57], [-96, 275, -40]], "Bornera F red → interruptor general");
    W220("w220_fus", "Interruptor → portafusible", [[-96, 275, -40], [-90, 275, -26], [-96, 275, -15]], "Interruptor → portafusible (fusible 2 A lento)");
    W220("w220_com", "Portafusible → COM del relé 1", [[-78, 275, -15], [-80, 240, 0], [-92, 215, 17.5], relTerm(0, "COM")], "Portafusible → relé 1 COM");
    W220("w220_no", "NO del relé 1 → bornera F foco", [relTerm(0, "NO"), [-92, 215, 22], [-66, 215, -40], BP.Ffoco], "Relé 1 NO → bornera F foco (el contacto NC no se usa)");
    W220("w220_puente", "Puente de neutro", [BP.Nred, [-77, 205, -60], [-55, 205, -60], BP.Nfoco], "N red → N foco (el neutro no pasa por el relé)");
    W220("w220_salida", "Fase y neutro al cable del foco", [BP.Ffoco, [-66, 222, -40], [10, 262, 0], [FOCO[0], 292, FOCO[2]], FOCO], "Bornera F foco / N foco → sube por el techo al cable del foco (tubo 105)");

    // BH1750: abanico del cable de 12 hilos sobre el TCA
    H.CUARTOS.forEach((c) => {
      const k = c.canal;
      for (const [s, tipo] of [["SD", "i2c"], ["SC", "i2c"]]) {
        const p = TCA[s + k];
        alambre(`w_ch${k}_${s}`, { nombre: `${s === "SD" ? "SDA" : "SCL"} del cuarto ${c.n} (canal ${k})`,
          conexion: `Multipolar (JST pin ${s === "SD" ? c.jst.split("-")[0] : c.jst.split("-")[1]}) → TCA9548A ${s}${k} · BH1750 C${c.n}`, lista: "N° 50 · Cable multipolar 12 hilos" },
        [-44 + (k - 2) * 1.2, 196, -44], p, tipo, 0.45, 202 + k);
      }
    });
    alambre("w_bh_vcc", { nombre: "+5 V de los 5 BH1750", conexion: "Multipolar (JST pin 1) → 5V (TCA9548A VIN)", lista: "N° 50 · Cable multipolar 12 hilos" }, [-47, 196, -44], TCA.VIN, "v5", 0.45, 208);
    alambre("w_bh_gnd", { nombre: "GND y ADDR de los 5 BH1750", conexion: "Multipolar (JST pin 2) → GND (dirección 0x23)", lista: "N° 50 · Cable multipolar 12 hilos" }, [-41, 196, -44], TCA.GND, "gnd", 0.45, 209);

    // ================================================================ CABLES LARGOS POR LOS TUBOS (recorridos de SolidWorks)
    const sw = (pieza, k, ini, fin, respaldo) => (H.rutaSW(pieza, k, respaldo) || respaldo).slice(ini, fin);
    // 308d: 12 hilos de los BH1750: JST del encaje → plato → tubo 105 → sale por abajo a 55 mm del pin → techo de la caja → TCA
    registrar("308d", Object.assign(H.infoSW("308d_Cable_Multipolar_BH1750_Caja"), H.infoBOM(50), { grupo: "Cables", tipo: "multipolar", codigo: "308d · N° 50",
      conexion: `Conector JST hembra (encaje de la mesa) → plato → tubo 105 → techo de la caja colgada → TCA9548A (${H.fmtNum((H.largoSW("308d") || 337) / 1000, 2)} m)` }));
    const tronco = sw("308d", 0, 0, 3, [[0, 884, 0], [0, 852.5, 0], [55, 852.5, 0]])
      .concat([[55, D.caja.y[1] + 1, 0]], [[-70, 317, 0], [-70, 240, 0], [-70, 240, -48], [-44, 215, -48], [-44, 196, -44]].map(G));
    cables.add(marcar(capa(cable(ruta(tronco, 12), 2.5, T.multipolar.color), "cable"), "308d"));
    registrar("jst", Object.assign(H.infoBOM(51), { grupo: "Sensores", conexion: "Macho en la punta del pin de la maqueta · hembra en el fondo del encaje de la mesa. Pines: 1 VCC, 2 GND, 3-12 SD0/SC0…SD4/SC4" }));
    ref.jstHembra = cilindro([0, 883, 0], [0, 888.2, 0], 2.8, material(0xf2f2f2), 16);
    ref.raiz.add(marcar(capa(ref.jstHembra, "cable"), "jst"));
    registrar("etiquetas", Object.assign(H.infoBOM(36), { grupo: "Cableado", conexion: "Marcan S1…S5, el bus, el foco y el 220 V" }));
    for (const p of [[-44, 199, -48], [7, 199, -58]]) cablesCaja.add(marcar(capa(caja(p[0] - 4, p[1], p[2] - 1, p[0] + 4, p[1] + 6, p[2] + 1, material(0xffffff)), "cable"), "etiquetas"));
    cables.add(marcar(capa(caja(636, 296, 419, 644, 304, 421, material(0xffffff)), "cable"), "etiquetas"));
    registrar("amarras10", Object.assign(H.infoBOM(32), { grupo: "Cableado", conexion: "Ordenan los cables dentro de la caja" }));
    registrar("amarras20", Object.assign(H.infoBOM(33), { grupo: "Cableado", conexion: "Sujetan los cables a los tubos y al aro" }));
    const amarra = (p, rot, id, padre) => {
      const t = new THREE.Mesh(new THREE.TorusGeometry(mm(4.5), mm(0.9), 6, 14), material(COL.negro));
      t.position.set(mm(p[0]), mm(p[1]), mm(p[2])); t.rotation.set(rot[0], rot[1], rot[2]);
      (padre || cables).add(marcar(capa(t, "cable"), id));
    };
    amarra([-300, 850, -6], [0, Math.PI / 2, 0], "amarras20");
    amarra([350, 857, -3], [0, Math.PI / 2, 0], "amarras20");
    amarra([-594, 600, -420], [Math.PI / 2, 0, 0], "amarras20");
    amarra([594, 600, 420], [Math.PI / 2, 0, 0], "amarras20");
    amarra([-20, 196, -50], [0, 0, 0], "amarras10", cablesCaja);

    // caja de empalme bajo la mesa (43) con la 2.ª placa y 5 borneras: llegan los 5 DS18B20 y sale el bus (29)
    registrar("empalme", Object.assign(H.infoBOM(43), { grupo: "Sensores", conexion: "Bajo la mesa: 5 borneras de 3 vías en paralelo (VDD-DQ-GND), una por DS18B20" }));
    const emp = new THREE.Group();
    emp.add(H.tagPieza(caja(-40, 842, 140, 40, 880, 220, material(0x9b9ea4, { roughness: 0.6 })), "empalme-caja"));
    for (let k = 0; k < 5; k++) emp.add(caja(-32 + k * 14, 840, 205, -22 + k * 14, 842, 215, material(0x1f9d55)));
    ref.raiz.add(marcar(capa(emp, "electronica"), "empalme"));
    registrar("cablesDS", Object.assign(H.infoBOM(5), { grupo: "Cables", tipo: "onewire", nombre: "Cables de los 5 DS18B20 (sondas de 1 m)",
      conexion: "Rojo VDD · amarillo DQ · negro GND: de cada cuarto por el canal y el pin hasta la caja de empalme" }));
    tramo("cablesDS_fijo", { nombre: "Cables de los DS18B20 (bajo la mesa)", conexion: "Del pin de la maqueta → plato → tubo 105 → caja de empalme" },
      [[5, 884, 5], [5, 857, 5], [-60, 857, 5], [-60, 860, 5], [-60, 860, 180], [-40, 860, 180]], 1.5, "onewire", 12);
    // 312: bus 1-Wire (cable de 4 hilos, N° 29): caja de empalme → costado del tubo 105 → techo de la caja → placa (D2)
    tramo("bus29", Object.assign(H.infoSW("312_Cable_Bus_DS18B20_Caja"), H.infoBOM(29), { codigo: "312 · N° 29", nombre: "Bus 1-Wire de los DS18B20 (cable de 4 hilos, pieza 312)",
      conexion: "Caja de empalme → entra por el costado del tubo 105 → baja al techo de la caja colgada (pasacables) → placa perforada (D2)" }),
    sw("312", 0, 0, 2, [[40, 860, 180], [40, 860, 6]]).concat([[40, D.caja.y[1] - 5, 6]],
      [[-85, 317, 6], [-85, 250, 6], [-20, 215, -40], [-7, 205, -59], PLACA.DQo].map(G)), 2, "onewire", 12);

    // 310 (1): cable del foco (fijo): eje Este → travesaño superior Este → tubo 105 → techo de la caja → relé (por la bornera)
    registrar("cableFoco", Object.assign(H.infoBOM(22), { grupo: "220 V", tipo: "v220", nombre: "Cable del foco (vulcanizado 2 × 1,0 mm²)",
      conexion: "Relé 1 NO / neutro → techo de la caja → tubo 105 → travesaño superior del caballete Este → eje → por el aro (espiral) → foco" }));
    const focoFijo = [[480, 935, 0]].concat(sw("310", 0, 0, 8, [[545, 952, 0], [545, 952, 62], [594, 952, 62], [594, 883, 62], [594, 883, -3], [581, 883, -3], [581, 857, -3], [160, 857, -3]]), [[160, D.caja.y[1] - 4, -3]]);
    const mFoco = cable(ruta(focoFijo, 12), 3, T.v220.color);
    cables.add(marcar(capa(mFoco, "cable"), "cableFoco"));
    registrar("espiral", Object.assign(H.infoBOM(34), { grupo: "220 V", conexion: "Cubre el cable del foco a lo largo del aro, del eje Este hasta el carro" }));
    registrar("206c", Object.assign(H.infoSW("206c_Cable_Espiral"), { grupo: "220 V", tipo: "v220", conexion: "Tramo móvil del cable del foco: eje Este → aro → carro → portafoco" }));
    ref.cableAro = null;
    ref.espiral = null;

    // 310 (2): alimentación: techo de la caja → tubo 105 → caballete Este → montante Sur → prensaestopas PG9 → enchufe (23)
    registrar("alimentacion", Object.assign(H.infoSW("310_Cables_220V_Foco_Alimentacion"), H.infoBOM(22), { codigo: "310 · N° 22", grupo: "220 V", tipo: "v220", nombre: "Cable de alimentación 220 V",
      conexion: "Tomacorriente → enchufe → PG9 del montante Sur (caballete Este, 30 cm del piso) → montante → travesaño superior → tubo 105 → techo de la caja → bornera F red / N red" }));
    const alimTubos = [[175, D.caja.y[1] - 4, 5]].concat(sw("310", 1, 1, 7, [[175, 848, 5], [594, 848, 5], [594, 872, 5], [594, 872, 420], [594, 300, 420], [604, 300, 420]]));
    alimTubos[alimTubos.length - 1] = [614, 300, 420];
    const mAl1 = cable(ruta(alimTubos, 12), 3, 0xf2f2f2);
    cables.add(marcar(capa(mAl1, "cable"), "alimentacion"));
    cables.add(marcar(capa(cable(ruta([[614, 300, 420], [660, 300, 420], [720, 120, 470], [820, 12, 560], [930, 12, 630], [968, 31, 630]], 40), 3, 0xf2f2f2), "cable"), "alimentacion"));
    registrar("pg9", Object.assign(H.infoBOM(39), { grupo: "220 V", conexion: "En el montante Sur del caballete Este, a 30 cm del piso: salida del cable de alimentación (+1 de reserva)" }));
    const pg = new THREE.Group();
    pg.add(cilindro([596, D.pg9[1], D.pg9[2]], [614, D.pg9[1], D.pg9[2]], 7.5, material(COL.negro), 16));
    pg.add(cilindro([600, D.pg9[1], D.pg9[2]], [606, D.pg9[1], D.pg9[2]], 10, material(COL.negro), 6));
    ref.caballetes["102"].add(marcar(capa(pg, "electronica"), "pg9"));
    registrar("enchufe", Object.assign(H.infoBOM(23), { grupo: "220 V", conexion: "Al tomacorriente de la pared" }));
    const toma = new THREE.Group();
    toma.add(caja(1000, 0, 580, 1100, 90, 680, material(0xe5e5ea)));
    toma.add(caja(970, 20, 615, 1000, 42, 645, material(0xf8f8f8)));
    toma.add(caja(950, 22, 618, 970, 40, 642, material(COL.negro)));
    ref.raiz.add(marcar(capa(toma, "kit"), "enchufe"));

    // ================================================================ USB: Arduino → techo → tubo 105 → caballete Oeste → USB-B de panel → PC
    construirMesaAuxiliar(ref);
    registrar("usbInterno", Object.assign(H.infoSW("311_Cable_USB_Caja_Panel"), H.infoBOM(3), { grupo: "Cables", tipo: "usb", codigo: "311 · N° 3",
      nombre: "Extensión USB-B de panel (por dentro de los tubos)",
      conexion: `USB del Arduino → techo de la caja → tubo 105 → travesaño superior Oeste → montante Norte → USB-B de panel a 23 cm del piso (${H.fmtNum((H.largoSW("311") || 2100) / 1000, 1)} m)` }));
    const U = ARD.USB;
    const usbIn = [[U[0], U[1], U[2]], [U[0], U[1], U[2] + 9], [U[0], 290, U[2] + 9], [U[0], 290, -6], [15, 290, -6], [15, 317, -6]].map(G)
      .concat(sw("311", 0, 4, 9, [[140, 850, -6], [-594, 850, -6], [-594, 877.5, -6], [-594, 877.5, -420], [-594, 230, -420]]), [[-588, 230, -420]]);
    const mUsb = cable(ruta(usbIn, 10), 2.2, T.usb.color);
    cables.add(marcar(capa(mUsb, "cable"), "usbInterno"));
    cajaG.add(marcar(capa(caja(...G([U[0] - 6, U[1] - 5, U[2]]), ...G([U[0] + 6, U[1] + 6, U[2] + 10]), material(0x8e8e93, { metalness: 0.6 })), "electronica"), "usbInterno"));      // ficha USB-B
    registrar("usbPanel", Object.assign(H.infoBOM(3), { grupo: "Cables", nombre: "USB-B de panel (montante Norte del caballete Oeste)",
      conexion: "En la cara exterior del montante Norte del caballete Oeste, a 23 cm del piso: ahí se enchufa el cable USB de la PC" }));
    const up = new THREE.Group(), [ux, uy, uz] = D.usbPanel;
    up.add(cilindro([ux - 4, uy, uz], [ux + 12, uy, uz], 7.5, material(0x2c2c2e), 18));
    up.add(cilindro([ux - 6, uy, uz], [ux, uy, uz], 11, material(0xc7c7cc, { metalness: 0.8, roughness: 0.3 }), 24));
    up.add(caja(ux - 6.6, uy - 5.5, uz - 6, ux - 6, uy + 5.5, uz + 6, material(COL.negro)));
    ref.caballetes["103"].add(marcar(capa(up, "electronica"), "usbPanel"));
    registrar("usb", Object.assign(H.infoBOM(2), { grupo: "Cables", tipo: "usb", nombre: "Cable USB A–B a la PC",
      conexion: "USB-B de panel del montante Norte (caballete Oeste) → USB de la laptop · 9600 baudios" }));
    cables.add(marcar(capa(cable(ruta([[ux - 7, uy, uz], [ux - 40, uy, uz], [-700, 60, -330], [-760, 12, 150], [-630, 12, 410], [-622, 400, 412], [-626, 722, 430], [-728, 723, 600]], 40), 2.5, T.usb.color), "cable"), "usb"));

    // ================================================================ MAQUETA: ramales (308c) y cables de los DS18B20
    construirCablesMaqueta(ref);
    return ref;
  };

  // ---------------------------------------------------------------------- cables dentro de la maqueta (marco local)
  function construirCablesMaqueta(ref) {
    const lev = ref.maqueta;
    registrar("308c", Object.assign(H.infoSW("308c_Cables_BH1750_Maqueta"), H.infoBOM(56), { grupo: "Cables", tipo: "i2c", codigo: "308c · N° 56",
      conexion: "Ramal de 4 hilos de cada BH1750: puente → muro central → canal bajo el piso → pin hueco → JST macho" }));
    const L = (x, y, z) => [x, y, z];          // mm locales (y = 0 en la mesa)
    H.CUARTOS.forEach((c) => {
      const s = c.s, cx = c.bx;
      const pts = [L(cx, 89, s * 47), L(cx, 86.75, s * 47), L(cx, 86.75, s * 1.5), L(cx, 1.5, s * 1.5)];
      if (cx !== 0) pts.push(L(0, 1.5, s * 1.5));
      pts.push(L(0, -9, 0));
      const m = cable(ruta(pts, 4), 1, T.i2c.color);
      lev.add(marcar(capa(m, "cable"), "308c"));
    });
    lev.add(marcar(capa(cable(ruta([L(0, 1, 0), L(0, -9, 0)], 2), 2.5, T.multipolar.color), "cable"), "308c"));
    ref.jstMacho = cilindro([0, -11.8, 0], [0, -7, 0], 2.8, material(0xf2f2f2), 16);
    lev.add(marcar(capa(ref.jstMacho, "cable"), "jst"));
    // cables de las sondas DS18B20: por el piso hasta el canal y el pin
    const CENTROS = [[-100, -55], [0, -55], [100, -55], [-75, 55], [75, 55]];
    CENTROS.forEach(([x, z], i) => {
      const s = Math.sign(z);
      const pts = [L(x + 9, 5, z), L(x + 9, 5.5, s * 9), L(x + 9, 1.5, s * 2.4), L(4, 1.5, s * 2.4), L(4, -9, 1)];
      lev.add(marcar(capa(cable(ruta(pts, 4), 0.9, T.onewire.color), "cable"), "cablesDS"));
    });
  }

  // ---------------------------------------------------------------------- mesa auxiliar, laptop y kit de repuestos
  function construirMesaAuxiliar(ref) {
    const g = new THREE.Group(); g.name = "mesaAuxiliar"; ref.raiz.add(g); ref.mesaAux = g;
    registrar("mesaAux", { nombre: "Mesa auxiliar", grupo: "Kit, PC y repuestos", funcion: "Mesa de trabajo junto al heliodón: la laptop con el simulador, el kit de prueba y los repuestos." });
    const t = new THREE.Group();
    t.add(caja(-1300, 700, 400, -600, 720, 900, material(0xf0eee9, { roughness: 0.7 })));
    for (const [x, z] of [[-1280, 420], [-620, 420], [-1280, 880], [-620, 880]]) t.add(caja(x - 12, 0, z - 12, x + 12, 700, z + 12, material(0xc7c7cc, { metalness: 0.5 })));
    g.add(marcar(capa(t, "kit"), "mesaAux"));
    registrar("laptop", { nombre: "Laptop con el Simulador Solar", grupo: "Kit, PC y repuestos", funcion: "PC que controla el heliodón por USB (app de PC «Simulador Solar»).", conexion: "USB ↔ Arduino (9600 baudios)" });
    const lap = new THREE.Group();
    lap.add(caja(-1040, 720, 520, -730, 735, 740, material(0xc7c9ce, { metalness: 0.6, roughness: 0.35 })));
    const pantallaTex = H.textura((c, w, h) => {
      const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, "#f2f4f8"); gr.addColorStop(1, "#dfe5ef");
      c.fillStyle = gr; c.fillRect(0, 0, w, h);
      c.fillStyle = "#0a84ff"; c.font = "700 40px Arial"; c.fillText("Simulador Solar", 30, 70);
      c.fillStyle = "#6e6e73"; c.font = "26px Arial"; c.fillText("Heliodón pequeño · UMSS", 30, 110);
      ["#0A84FF", "#FF9F0A", "#30D158", "#FF453A", "#BF5AF2"].forEach((col, k) => { c.fillStyle = col; c.fillRect(30 + k * 90, 160, 70, 120); });
    }, 512, 320);
    const pantalla = new THREE.Group();
    pantalla.position.set(mm(-885), mm(735), mm(520));
    const tapaP = caja(-155, 0, -6, 155, 210, 0, material(0xc7c9ce, { metalness: 0.6 }));
    const vid = new THREE.Mesh(new THREE.PlaneGeometry(mm(290), mm(190)), new THREE.MeshBasicMaterial({ map: pantallaTex }));
    vid.position.set(0, mm(105), mm(0.5));
    pantalla.add(tapaP, vid);
    pantalla.rotation.x = -0.32;
    lap.add(pantalla);
    g.add(marcar(capa(lap, "kit"), "laptop"));
    // kit: protoboard, packs y repuestos (todo lo de la lista que no va instalado)
    const piezas = [
      [12, 0xffffff, [83, 8, 55]], [16, 0xff453a, [60, 12, 40]], [17, 0x0a84ff, [60, 12, 40]], [18, 0x30d158, [60, 12, 40]],
      [19, 0xffd60a, [45, 30, 45]], [26, 0xdfe6ee, [40, 10, 25]], [28, 0xc8a74a, [40, 10, 25]], [30, 0x2c2c2e, [55, 12, 35]],
      [31, 0x1d1d1f, [50, 20, 50]], [32, 0x3a3a3c, [55, 8, 30]], [33, 0x3a3a3c, [70, 8, 30]], [36, 0xffffff, [45, 6, 30]],
      [41, 0x8e8e93, [40, 15, 30]], [42, 0x8e8e93, [40, 15, 30]], [53, 0x8e8e93, [40, 15, 30]], [44, 0x4c9edb, [55, 15, 35]],
      [45, 0x1d4ed8, [55, 20, 35]], [46, 0xfff2c8, [60, 45, 60]], [47, 0xff9f0a, [40, 10, 25]], [48, 0x1f9d55, [45, 15, 30]],
      [54, 0x1f4fb5, [40, 10, 30]], [6, 0xd9c39a, [35, 6, 20]], [7, 0xd9c39a, [35, 6, 20]], [8, 0xd9c39a, [35, 6, 20]],
      [13, 0x1d1d1f, [50, 6, 15]], [11, 0xc9a66b, [70, 4, 50]],
    ];
    const filas = [860, 790, 440];
    let x = -1285, f = 0;
    piezas.forEach(([n, col, [w, h, d]]) => {
      if (x + w > -615) { x = -1285; f++; }
      const z = filas[Math.min(f, filas.length - 1)];
      const id = "kit" + n;
      const info = H.infoBOM(n);
      registrar(id, Object.assign(info, { grupo: "Kit, PC y repuestos", nombre: info.nombre + (n === 11 ? " (2.ª placa: va en la caja de empalme)" : ""),
        conexion: info.origen && info.origen.includes("Repuestos") ? "Repuesto: se guarda en el kit" : "En el kit de trabajo (pruebas, consumibles o sobrante)" }));
      const m = caja(x, 720, z - d / 2, x + w, 720 + h, z + d / 2, material(col, { roughness: 0.6 }));
      g.add(marcar(capa(m, "kit"), id));
      x += w + 8;
    });
  }

  // ---------------------------------------------------------------------- tramos que se mueven
  /** Cable del foco a lo largo del aro (marco del aroPivot) con la espiral (34), del eje Este al carro y al foco. */
  H.actualizarCableFoco = function () {
    const ref = H.ref, piv = ref.aroPivot;
    const tc = Math.PI / 2 + ref.carroPivot.rotation.z;
    const R = 480, zc = -14;
    const pts = [new THREE.Vector3(mm(480), 0, 0), new THREE.Vector3(mm(482), mm(8), mm(zc))];
    const n = Math.max(4, Math.round((tc / Math.PI) * 60));
    for (let k = 1; k <= n; k++) {
      const t = 0.03 + (tc - 0.09) * (k / n);
      pts.push(new THREE.Vector3(mm((R + 2) * Math.cos(t)), mm((R + 2) * Math.sin(t)), mm(zc)));
    }
    // del carro al portafoco (posición actual del foco en el marco del aro)
    ref.raiz.updateMatrixWorld(true);
    const pf = piv.worldToLocal(ref.declPivot.localToWorld(new THREE.Vector3(0, mm(-20), mm(-12))));
    const pc = piv.worldToLocal(ref.carroPivot.localToWorld(new THREE.Vector3(0, mm(455), mm(-14))));
    pts.push(pc, pc.clone().lerp(pf, 0.5).add(new THREE.Vector3(0, 0, mm(-10))), pf);
    const curva = new THREE.CatmullRomCurve3(pts, false, "centripetal");
    const geo = new THREE.TubeGeometry(curva, 160, mm(3), 8, false);
    // espiral: hélice alrededor del tramo del aro
    const hel = [];
    const m = 8 * n;
    for (let k = 0; k <= m; k++) {
      const t = 0.03 + (tc - 0.09) * (k / m), fase = k * 0.9;
      const radial = new THREE.Vector3(Math.cos(t), Math.sin(t), 0), z = new THREE.Vector3(0, 0, 1);
      const c = radial.clone().multiplyScalar(mm(R + 2)).add(new THREE.Vector3(0, 0, mm(zc)));
      hel.push(c.add(radial.multiplyScalar(mm(5) * Math.cos(fase))).add(z.multiplyScalar(mm(5) * Math.sin(fase))));
    }
    const geoE = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hel), Math.min(1600, m * 2), mm(1), 5, false);
    if (!ref.cableAro) {
      ref.cableAro = new THREE.Mesh(geo, material(T.v220.color, { roughness: 0.5 }));
      ref.espiral = new THREE.Mesh(geoE, material(0x2c2c2e, { roughness: 0.5 }));
      ref.cableAro.castShadow = true;
      piv.add(marcar(capa(ref.cableAro, "cable"), "206c"), marcar(capa(ref.espiral, "cable"), "espiral"));
    } else {
      ref.cableAro.geometry.dispose(); ref.cableAro.geometry = geo;
      ref.espiral.geometry.dispose(); ref.espiral.geometry = geoE;
    }
  };

  /** Cables colgantes entre el pin de la maqueta levantada y el encaje de la mesa (12 hilos + DS18B20). */
  H.actualizarColgantes = function (subida) {
    const ref = H.ref;
    if (!ref.colgantes) {
      registrar("colgante", { nombre: "Cables colgando (maqueta levantada)", grupo: "Cables", tipo: "multipolar",
        funcion: "Al levantar la maqueta se ve el tronco de 12 hilos de los BH1750 y los cables de los DS18B20 que bajan por el pin hasta el conector JST de 12 pines.",
        conexion: "Pin de la maqueta → conector JST 12 pines (encaje de la mesa)" });
      ref.colgantes = new THREE.Group();
      ref.raiz.add(ref.colgantes);
      ref.colgantes.add(marcar(capa(new THREE.Mesh(new THREE.BufferGeometry(), material(T.multipolar.color)), "cable"), "colgante"));
      ref.colgantes.add(marcar(capa(new THREE.Mesh(new THREE.BufferGeometry(), material(T.onewire.color)), "cable"), "colgante"));
    }
    const g = ref.colgantes;
    g.visible = subida > 0.004;
    if (!g.visible) return;
    ref.raiz.updateMatrixWorld(true);
    const a = ref.maqueta.localToWorld(new THREE.Vector3(0, mm(-12), 0));
    const b = new THREE.Vector3(0, mm(888.5), 0);
    const caida = Math.min(mm(70), subida * 0.25);
    const ladeo = new THREE.Vector3(mm(25), 0, mm(18));
    [[0, 2.5], [mm(5), 1.5]].forEach(([dx, r], k) => {
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
