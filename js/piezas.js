/* Modo «Piezas»: separa y muestra cada pieza mecánica del heliodón con sus medidas reales.
   - Catálogo de piezas mecánicas (sin electrónica ni cables) con medidas, material, masa y cantidad tomados de:
     datos_generados.js (piezas y cajas del ensamble de SolidWorks, lista de materiales), los macros de a\macros
     (01_piezas, 30c, 35a) y el registro de ejecución (masa y material de cada pieza). Lo que no está en los datos
     se marca «pendiente» (no se inventa).
   - Clic en una pieza (o en la lista): se aísla (el resto transparente u oculto), la cámara la centra y se dibujan
     sus cotas en 3D (mm). Ficha en el panel izquierdo; lista, búsqueda y opciones en el derecho.
   - Vista explosionada solo de las piezas mecánicas, con el nombre de cada una. */
(function () {
  const H = window.H;
  const $ = (s) => document.querySelector(s);
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const D = H.DIM;
  const ENS = window.DATOS_ENSAMBLE || {};
  const EST = (ENS.diseno || {}).estructura || {};

  // ------------------------------------------------------------------ números y datos auxiliares
  const n = (v, d = 1) => String(Math.round(v * 10 ** d) / 10 ** d).replace(".", ",");
  const mmT = (v) => n(v) + " mm";
  const kg = (v) => n(v, 3) + " kg";
  const TB = D.tubo, PARED = (EST.tubo || [25, 2])[1];
  const AREA = TB * TB - Math.pow(TB - 2 * PARED, 2);            // 25x25x2 -> 184 mm²
  const RHO_ACERO = 7.9e-6;                                      // kg/mm³ (AISI 1020 de SolidWorks: 1200 mm de tubo = 1,744 kg)
  const cuenta = (pref) => (ENS.componentes || []).filter((c) => c.archivo.startsWith(pref)).length;
  const archivoSW = (cod) => ((window.DATOS_SOLIDWORKS || []).find((p) => p.archivo.startsWith(cod + "_")) || {}).archivo || null;
  const descSW = (cod) => ((window.DATOS_SOLIDWORKS || []).find((p) => p.archivo.startsWith(cod + "_")) || {}).desc || "";
  const bom = (k) => (H.bom ? H.bom(k) : null) || {};
  const LARGO = {                                                // largos de los tubos (macro 35a y diseno_marco_cuadrado.json)
    larguero: D.largo, cabezal: 2 * D.zLargIn, montante: D.yTS - TB / 2 - D.yBaseTop,
    trSup: 2 * D.zMontOut, trMed: 2 * D.zMontIn, marco: 2 * (D.xCab - TB / 2), t105: D.largo, t106: 2 * D.zLargIn,
  };
  const SW = "SolidWorks";
  const masaTubo = (L) => ({ v: L * AREA * RHO_ACERO, nota: `calculada: ${n(L, 0)} mm × ${AREA} mm² × 7,9 g/cm³ (como SolidWorks)` });

  // ------------------------------------------------------------------ catálogo
  const G = { est: "Estructura (100)", rue: "Ruedas y frenos (107, 112)", tor: "Tornillería (108–110)", mec: "Mecanismo: aro, foco y graduador (200)",
    mesa: "Mesa y maqueta (300)", caja: "Caja del Arduino (305)", acc: "Accesorios mecánicos (lista de materiales)" };
  const ORDEN_G = Object.values(G);
  const P = [];
  const add = (e) => { P.push(e); return e; };

  function tubo(id, comp, tag, nombre, L, eje, donde, exp) {
    const cot = { x: TB + " mm", y: TB + " mm", z: TB + " mm" };
    cot[eje] = mmT(L);
    return add({ id, grupo: G.est, nombre, cod: comp, sel: { comp, tag }, cant: 1, cantNota: "1 tubo de la pieza " + comp,
      material: "Acero AISI 1020 (tubo cuadrado negro)", masa: masaTubo(L),
      medidas: [["Perfil", `${TB} × ${TB} × ${PARED} mm`], ["Largo", mmT(L)], ["Ubicación", donde]], cotas: cot, exp, corto: mmT(L) });
  }

  // ---- 100 estructura
  add({ id: "101", grupo: G.est, nombre: "Base rectangular (completa)", cod: "101", sel: { comp: "101", conjunto: true }, cant: cuenta("101_"),
    material: "Acero AISI 1020", masa: { v: 6.105, nota: SW },
    medidas: [["Largo (E-O)", mmT(D.largo)], ["Ancho (N-S)", mmT(D.ancho)], ["Perfil", `${TB} × ${TB} × ${PARED} mm`], ["Altura del eje", "y 144–169 mm del piso"],
      ["Tubos", "2 largueros de " + mmT(LARGO.larguero) + " + 2 cabezales de " + mmT(LARGO.cabezal)]],
    cotas: { x: mmT(D.largo), y: TB + " mm", z: mmT(D.ancho) }, conjunto: true, corto: `${D.largo} × ${D.ancho}` });
  tubo("101-LN", "101", "101-LN", "Larguero Norte de la base", LARGO.larguero, "x", "cara Norte, z −475…−450, y 144–169", [0, -0.05, -0.12]);
  tubo("101-LS", "101", "101-LS", "Larguero Sur de la base", LARGO.larguero, "x", "cara Sur, z 450…475, y 144–169", [0, -0.05, 0.12]);
  tubo("101-CE", "101", "101-CE", "Cabezal Este de la base", LARGO.cabezal, "z", "lado Este, x 575…600, entre los largueros", [0.12, -0.05, 0]);
  tubo("101-CO", "101", "101-CO", "Cabezal Oeste de la base", LARGO.cabezal, "z", "lado Oeste, x −600…−575, entre los largueros", [-0.12, -0.05, 0]);
  tubo("106", "106", null, "Travesaño central de la base", LARGO.t106, "z", "centro de la base (x ±12,5), une los largueros", [0, -0.08, 0]);
  P[P.length - 1].sel = { comp: "106" };
  for (const [cod, lado, sx] of [["102", "Este", 1], ["103", "Oeste", -1]]) {
    add({ id: cod, grupo: G.est, nombre: `Caballete ${lado} (completo)`, cod, sel: { comp: cod, conjunto: true }, cant: cuenta(cod + "_"),
      material: "Acero AISI 1020", masa: { v: 4.461, nota: SW },
      medidas: [["Alto", "721 mm (y 169–890)"], ["Ancho (N-S)", mmT(LARGO.trSup)], ["Perfil", `${TB} × ${TB} × ${PARED} mm`],
        ["Tubos", "2 montantes, travesaño superior y travesaño medio a " + D.yMarco + " mm"], ["Diagonales", "ninguna (marco cuadrado)"]],
      cotas: { x: TB + " mm", y: "721 mm", z: mmT(LARGO.trSup) }, conjunto: true, corto: "721 × " + LARGO.trSup });
    tubo(cod + "-MN", cod, cod + "-MN", `Montante Norte (caballete ${lado})`, LARGO.montante, "y", `x ${sx > 0 ? "575…600" : "−600…−575"}, z −432,5…−407,5, y 169–865`, [sx * 0.1, 0, -0.1]);
    tubo(cod + "-MS", cod, cod + "-MS", `Montante Sur (caballete ${lado})`, LARGO.montante, "y", `x ${sx > 0 ? "575…600" : "−600…−575"}, z 407,5…432,5, y 169–865`, [sx * 0.1, 0, 0.1]);
    const ts = tubo(cod + "-TS", cod, cod + "-TS", `Travesaño superior (caballete ${lado})`, LARGO.trSup, "z", "y 865–890, apoyado y soldado sobre el tubo 105", [sx * 0.1, 0.1, 0]);
    ts.medidas.push(["Agujeros", `2 × Ø9 para los pernos de la chumacera (x ${sx > 0 ? "" : "−"}${D.xCh}, z ±38)`]);
    tubo(cod + "-TM", cod, cod + "-TM", `Travesaño medio (caballete ${lado})`, LARGO.trMed, "z", `y ${D.yMarco} mm (marco cuadrado)`, [sx * 0.1, 0, 0]);
  }
  add({ id: "111", grupo: G.est, nombre: "Marco medio Norte-Sur (completo)", cod: "111", sel: { comp: "111", conjunto: true }, cant: cuenta("111_"),
    material: "Acero AISI 1020", masa: { v: 3.343, nota: SW },
    medidas: [["Tubos", "2 × " + mmT(LARGO.marco) + " (cara Norte y cara Sur)"], ["Altura", D.yMarco + " mm del piso"], ["Perfil", `${TB} × ${TB} × ${PARED} mm`]],
    cotas: { x: mmT(LARGO.marco), y: TB + " mm", z: "865 mm" }, conjunto: true, corto: "2 × " + LARGO.marco });
  tubo("111-N", "111", "111-N", "Tubo del marco medio Norte", LARGO.marco, "x", `cara Norte, y ${D.yMarco}, soldado a los montantes`, [0, 0, -0.14]);
  tubo("111-S", "111", "111-S", "Tubo del marco medio Sur", LARGO.marco, "x", `cara Sur, y ${D.yMarco}, soldado a los montantes`, [0, 0, 0.14]);
  tubo("105", "105", null, "Tubo único Este-Oeste", LARGO.t105, "x", "y 840–865, bajo los travesaños superiores; sostiene la mesa", [0, 0.06, 0]);
  P[P.length - 1].sel = { comp: "105" };
  P[P.length - 1].medidas.push(["Función", "sostiene el plato de la mesa; de él cuelga la caja del Arduino; cables por dentro"]);

  // ---- ruedas y frenos
  add({ id: "112", grupo: G.rue, nombre: "Placa adaptadora de rueda", cod: "112", sel: { comp: "112", tag: "112" }, cant: 4, cantNota: "4 placas en la pieza 112",
    material: "Acero AISI 1020", masa: { v: 1.504 / 4, nota: "SolidWorks: 1,504 kg las 4 placas" },
    medidas: [["Placa", "135 × 90 × 4 mm"], ["Agujeros", "4 × Ø9 a 76 × 18 mm (placa de la rueda)"], ["Ubicación", "bajo las esquinas de la base (y 140–144)"]],
    cotas: { x: "135 mm", y: "4 mm", z: "90 mm" }, exp: [0, 0.02, 0], corto: "135 × 90 × 4" });
  add({ id: "107a", grupo: G.rue, nombre: "Placa de montaje de la rueda", cod: "107a", sel: { comp: "107a" }, cant: cuenta("107a_"),
    material: "Acero AISI 1020", masa: { v: 0.437, nota: SW },
    medidas: [["Placa", "100 × 70 × 4 mm"], ["Pivote", "Ø60 × 10 mm"], ["Alto total", "14 mm"], ["Agujeros", "4 × Ø9 a 76 × 18 mm"], ["Rueda", "giratoria Ø100 (ejes en x ±" + D.xRueda + ", z ±" + D.zRueda + ")"]],
    cotas: { x: "100 mm", y: "14 mm", z: "70 mm" }, exp: [0, -0.06, 0], corto: "100 × 70 × 4" });
  add({ id: "107b", grupo: G.rue, nombre: "Horquilla de la rueda", cod: "107b", sel: { comp: "107b" }, cant: cuenta("107b_"),
    material: "Acero AISI 1020", masa: null, masaNota: "pendiente (0,380 kg antes de separar la palanca 107d)",
    medidas: [["Total", "81 × 86 × 44 mm"], ["Placa", "75 × 44 × 6 mm"], ["Brazos", "2 × 30 × 80 × 4 mm"], ["Eje de la llanta", "Ø12 × 44 mm"]],
    cotas: { x: "81 mm", y: "86 mm", z: "44 mm" }, exp: [0, -0.13, 0], corto: "81 × 86 × 44" });
  add({ id: "107c", grupo: G.rue, nombre: "Llanta de la rueda", cod: "107c", sel: { comp: "107c" }, cant: cuenta("107c_"),
    material: "Poliuretano (en SolidWorks: Caucho)", masa: { v: 0.248, nota: SW },
    medidas: [["Diámetro", "Ø100 mm"], ["Ancho", "32 mm"], ["Agujero del eje", "Ø12 mm"]],
    cotas: { x: "Ø100 mm", y: "Ø100 mm", z: "32 mm" }, exp: [0, -0.24, 0], corto: "Ø100 × 32" });
  add({ id: "107d", grupo: G.rue, nombre: "Palanca del freno", cod: "107d", sel: { comp: "107d" }, cant: cuenta("107d_"),
    material: null, masa: null,
    medidas: [["Palanca", "24 × 6 × 20 mm"], ["Giro", "0° libre – 20° frenado"]],
    cotas: { x: "24 mm", y: "6 mm", z: "20 mm" }, exp: [0.06, -0.12, 0], corto: "24 × 6 × 20" });

  // ---- tornillería
  add({ id: "108", grupo: G.tor, nombre: "Perno hexagonal M8 × 20", cod: "108", sel: { comp: "108" }, cant: cuenta("108_"), cantNota: "4 por rueda",
    material: "Acero AISI 1020", masa: { v: 0.014, nota: SW },
    medidas: [["Rosca", "M8 (Ø8) × 20 mm"], ["Cabeza", "hexagonal 13 mm entre caras × 5,3 mm"], ["Largo total", "25,3 mm"]],
    cotas: { x: "15 mm", y: "25,3 mm" }, exp: [0, -0.03, 0], corto: "M8 × 20" });
  add({ id: "109", grupo: G.tor, nombre: "Perno hexagonal M8 × 60", cod: "109", sel: { comp: "109" }, cant: cuenta("109_"), cantNota: "2 por chumacera",
    material: "Acero AISI 1020", masa: { v: 0.030, nota: SW },
    medidas: [["Rosca", "M8 (Ø8) × 60 mm"], ["Cabeza", "hexagonal 13 mm entre caras × 5,3 mm"], ["Largo total", "65,3 mm"]],
    cotas: { x: "15 mm", y: "65,3 mm" }, exp: [0, 0.12, 0], corto: "M8 × 60" });
  add({ id: "110", grupo: G.tor, nombre: "Tuerca hexagonal M8", cod: "110", sel: { comp: "110" }, cant: cuenta("110_"), cantNota: "16 de las ruedas + 4 de las chumaceras",
    material: "Acero AISI 1020", masa: { v: 0.005, nota: SW },
    medidas: [["Rosca", "M8"], ["Hexágono", "13 mm entre caras (15 entre vértices)"], ["Alto", "6,5 mm"]],
    cotas: { x: "15 mm", y: "6,5 mm" }, exp: [0, 0.08, 0], corto: "M8" });

  // ---- 200 mecanismo
  add({ id: "203", grupo: G.mec, nombre: "Chumacera de pie D18", cod: "203", sel: { comp: "203" }, cant: cuenta("203_"),
    material: "Acero AISI 1020", masa: { v: 0.785, nota: SW },
    medidas: [["Base", "30 × 100 × 23 mm (con suplemento de 15)"], ["Anillo", "Ø40 × 30 mm, agujero Ø18"], ["Alto total", "65 mm (y 890–955)"],
      ["Eje", "a 45 mm de la base (y 935)"], ["Pernos", "2 × Ø9 a 76 mm, centrada en x ±" + D.xCh]],
    cotas: { x: "30 mm", y: "65 mm", z: "100 mm" }, exp: [0, 0.1, 0], corto: "30 × 100 × 65" });
  add({ id: "202", grupo: G.mec, nombre: "Eje del aro D18", cod: "202", sel: { comp: "202" }, cant: cuenta("202_"), cantNota: "Este y Oeste",
    material: "Acero AISI 1020", masa: { v: 0.326, nota: SW },
    medidas: [["Diámetro", "Ø18 mm"], ["Largo", "162 mm (x 470–632)"]],
    cotas: { x: "162 mm", y: "Ø18 mm" }, exp: [0, 0.16, 0], corto: "Ø18 × 162" });
  add({ id: "201", grupo: G.mec, nombre: "Medio aro de horas R480", cod: "201", sel: { comp: "201" }, cant: cuenta("201_"),
    material: "Aluminio 6061", masa: { v: 0.678, nota: SW },
    medidas: [["Radio medio", "480 mm"], ["Fleje", "30 × 5 mm"], ["Diámetro exterior", "Ø990 mm (interior Ø930)"], ["Cubos", "Ø30 en los extremos, agujero Ø18"],
      ["Escala", "6–18 h, 15° por hora"], ["Inclinación", "90° N a 90° S"]],
    cotas: { x: "Ø990 mm", y: "495 mm", z: "5 mm" }, exp: [0, 0.3, 0], corto: "R480, fleje 30 × 5" });
  add({ id: "207a", grupo: G.mec, nombre: "Graduador de latitud (placa)", cod: "207a", sel: { comp: "207a" }, cant: cuenta("207a_"),
    material: "Aluminio 6061", masa: { v: 0.385, nota: SW },
    medidas: [["Placa", "semicircular R130 × 5 mm (Ø260)"], ["Alto total", "142 mm (con la pestaña de 12)"], ["Agujeros", "37 × Ø5 cada 5° a R115"],
      ["Agujero central", "Ø22 mm"], ["Escala", "90° N – 90° S"]],
    cotas: { x: "5 mm", y: "R130 mm", z: "Ø260 mm" }, exp: [0.18, 0.1, 0], corto: "R130 × 5" });
  add({ id: "207b", grupo: G.mec, nombre: "Brazo del graduador", cod: "207b", sel: { comp: "207b" }, cant: cuenta("207b_"),
    material: "Acero AISI 1020", masa: { v: 0.157, nota: SW },
    medidas: [["Brazo", "150 × 20 × 6 mm"], ["Cubo", "Ø30 × 8 mm, agujero Ø18"], ["Agujero del pasador", "Ø5 a 115 mm del eje"]],
    cotas: { x: "6 mm", y: "150 mm", z: "20 mm" }, exp: [0.26, 0.1, 0], corto: "150 × 20 × 6" });
  add({ id: "207c", grupo: G.mec, nombre: "Manija en T del graduador", cod: "207c", sel: { comp: "207c" }, cant: cuenta("207c_"),
    material: "Acero AISI 1020", masa: { v: 0.029, nota: SW },
    medidas: [["Pasador", "Ø4,5 × 30,5 mm"], ["Collar", "Ø8 × 3 mm"], ["Mango", "Ø10 × 40 mm"], ["Total", "35,5 × 41 mm"]],
    cotas: { x: "35,5 mm", z: "40 mm" }, exp: [0.34, 0.1, 0], corto: "T 35,5 × 40" });
  add({ id: "204", grupo: G.mec, nombre: "Carro del foco", cod: "204", sel: { comp: "204" }, cant: cuenta("204_"),
    material: "Aluminio 6061", masa: { v: 0.153, nota: SW },
    medidas: [["Placas", "2 × 70 × 70 × 4 mm"], ["Tacos", "2 × 70 × 6 × 14 mm"], ["Rodillos", "4 × Ø14 sobre los cantos del fleje"],
      ["Perilla de freno", "Ø16 × 12 mm"], ["Total", "70 × 94 × 14 mm"], ["Recorrido", "6:30 a 17:30 h"]],
    cotas: { x: "70 mm", y: "94 mm", z: "14 mm" }, exp: [0, 0.42, 0], corto: "70 × 94 × 14" });
  add({ id: "205", grupo: G.mec, nombre: "Arco de declinación R90", cod: "205", sel: { comp: "205" }, cant: cuenta("205_"),
    material: "Aluminio 6061", masa: { v: 0.062, nota: SW },
    medidas: [["Radio", "90 mm (borde R100, sector de 70°)"], ["Ranura", "6 mm (R87–R93), ±30°"], ["Espesor", "4 mm"], ["Marcas", "21/06 · equinoccio · 21/12 (±23,45°)"]],
    cotas: { x: "4 mm", y: "R100 mm" }, exp: [0, 0.36, 0.08], corto: "R90 × 4" });
  add({ id: "206a", grupo: G.mec, nombre: "Portafoco (soporte del foco)", cod: "206a", sel: { comp: "206a" }, cant: cuenta("206a_"),
    material: "Aluminio 6061", masa: { v: 0.018, nota: SW },
    medidas: [["Brazo", "110 × 12 × 4 mm"], ["Pasador", "Ø6 mm"], ["Perilla de fijación", "Ø12 × 6 mm"],
      ["En el simulador", "se dibuja el portafoco de cerámica E27 (N° 21 de la lista); su medida no está en los datos"]],
    cotas: { x: "12 mm", y: "110 mm" }, exp: [0, 0.3, 0.2], corto: "110 × 12 × 4" });
  add({ id: "206b", grupo: G.mec, nombre: "Foco (carcasa)", cod: "206b", sel: { comp: "206b" }, cant: cuenta("206b_"),
    material: null, masa: { v: 0.25, nota: "SolidWorks (masa de catálogo)" },
    medidas: [["Cuerpo (SolidWorks)", "Ø50 × 60 mm"], ["Lente", "Ø40 × 4 mm"], ["Foco de la lista (N° 20)", "reflector PAR30 E27, 75–100 W, 220 V"],
      ["Diámetro del PAR30", null]],
    cotas: { x: "Ø50 mm", y: "64 mm" }, exp: [0, 0.24, 0.3], corto: "Ø50 × 64" });

  // ---- 300 mesa y maqueta
  add({ id: "301", grupo: G.mesa, nombre: "Plato giratorio D180", cod: "301", sel: { comp: "301" }, cant: cuenta("301_"),
    material: "Acero AISI 1020", masa: { v: 2.271, nota: SW },
    medidas: [["Diámetro", "Ø180 mm"], ["Alto", "17 mm (y 865–882)"], ["Discos", "2 × Ø180 × 5 mm"], ["Rodamiento", "anillo Ø160 / Ø140 × 7 mm (lazy susan)"]],
    cotas: { x: "Ø180 mm", y: "17 mm" }, exp: [0, 0.12, 0], corto: "Ø180 × 17" });
  add({ id: "302", grupo: G.mesa, nombre: "Mesa giratoria D640", cod: "302", sel: { comp: "302" }, cant: cuenta("302_"),
    material: "MDF (750 kg/m³)", masa: { v: 5771008 * 750e-9, nota: "calculada: volumen 5 771 008 mm³ × 750 kg/m³; SolidWorks guarda 5,181 kg fijados para la mesa de Ø700" },
    medidas: [["Diámetro", "Ø" + 2 * D.rMesa + " mm (recortada de Ø700)"], ["Espesor", "18 mm"], ["Cara superior", "900 mm del piso"],
      ["Encaje central", "Ø16,4 × 12 mm para el pin de la maqueta"], ["Grabado", "rosa de los vientos y grados cada 30°"]],
    cotas: { x: "Ø" + 2 * D.rMesa + " mm", y: "18 mm" }, exp: [0, 0.2, 0], corto: "Ø" + 2 * D.rMesa + " × 18" });
  add({ id: "303", grupo: G.mesa, nombre: "Maqueta de casa (5 cuartos)", cod: "303", sel: { comp: "303" }, cant: cuenta("303_"),
    material: null, materialNota: "pendiente (SolidWorks usa 600 kg/m³)", masa: { v: 957631 * 600e-9, nota: "calculada: volumen 957 631 mm³ × 600 kg/m³ (densidad de SolidWorks)" },
    medidas: [["Planta", "300 × 220 mm"], ["Alto", "84 mm (piso 4 + muros 80)"], ["Muros", "6 mm"], ["Ventanas", "44 × 30, 60 × 30 y 40 × 30 mm"],
      ["Cuartos", "3 al Norte, 2 al Sur"], ["Pin de centrado", "Ø16 × 12 mm, hueco Ø6"]],
    cotas: { x: "300 mm", y: "84 + pin 12 mm", z: "220 mm" }, exp: [0, 0.34, 0], corto: "300 × 220 × 84" });
  add({ id: "pin", grupo: G.mesa, nombre: "Pin central de la maqueta", cod: "303", sel: { comp: "303", tag: "pin" }, cant: 1, cantNota: "parte de la pieza 303",
    material: null, materialNota: "pendiente (es parte de la maqueta 303)", masa: null, masaNota: "pendiente (incluida en la maqueta 303)",
    medidas: [["Diámetro", "Ø16 mm"], ["Largo", "12 mm (bajo el piso de la maqueta)"], ["Hueco", "Ø6 mm (pasa el cable de 12 hilos)"], ["Encaje en la mesa", "Ø16,4 × 12 mm"]],
    cotas: { x: "Ø16 mm", y: "12 mm" }, exp: [0, -0.08, 0], corto: "Ø16 × 12" });
  add({ id: "techos", grupo: G.mesa, nombre: "Techos de la maqueta", cod: "—", sel: { comp: "techos" }, cant: 5, cantNota: "uno por cuarto (solo en el simulador)",
    material: null, masa: null,
    medidas: [["Pieza de SolidWorks", "no existe (la maqueta 303 es «sin techo»)"], ["Medidas", null]],
    cotas: { x: null, z: null }, exp: [0, 0.5, 0], corto: "5 techos" });

  // ---- caja del Arduino
  add({ id: "305", grupo: G.caja, nombre: "Caja del Arduino (cuerpo)", cod: "305", sel: { comp: "305" }, cant: cuenta("305_"),
    material: "ABS", masa: { v: 0.95, nota: "SolidWorks (masa de catálogo)" },
    medidas: [["Exterior", "200 × 140 × 140 mm"], ["Pared", "3 mm"], ["Ubicación", "x 25–225, y 697–837 (3 mm bajo el tubo 105)"], ["Frente", "abierto, con la puerta 305b"]],
    cotas: { x: "200 mm", y: "140 mm", z: "140 mm" }, exp: [0, -0.2, 0.25], corto: "200 × 140 × 140" });
  add({ id: "305b", grupo: G.caja, nombre: "Puerta frontal de la caja", cod: "305b", sel: { comp: "305b" }, cant: cuenta("305b_"),
    material: "ABS", masa: { v: 0.25, nota: "SolidWorks (masa de catálogo)" },
    medidas: [["Puerta", "200 × 140 × 3 mm"], ["Portaleds", "3 × Ø8 mm"], ["Bisagra", "vertical al lado Oeste, abre 0–85°"]],
    cotas: { x: "200 mm", y: "140 mm", z: "3 mm" }, exp: [0, -0.2, 0.45], corto: "200 × 140 × 3" });
  add({ id: "perilla", grupo: G.caja, nombre: "Perilla de la puerta", cod: "305b", sel: { comp: "perilla" }, cant: 1, cantNota: "parte de la puerta 305b",
    material: null, masa: null,
    medidas: [["Diámetro", "Ø12 mm"], ["Largo", "12 mm"]],
    cotas: { x: "Ø12 mm", z: "12 mm" }, exp: [0, -0.2, 0.55], corto: "Ø12 × 12" });
  add({ id: "305c", grupo: G.caja, nombre: "Abrazaderas de la caja al tubo 105", cod: "305c", sel: { comp: "305c" }, cant: 2, cantNota: "2 abrazaderas en la pieza 305c (N° 38)",
    material: "Fleje de acero galvanizado (AISI 1020 en SolidWorks)", masa: { v: 0.132, nota: "SolidWorks: las 2 abrazaderas" },
    medidas: [["Fleje", "20 × 3 mm"], ["Ancho con alas", "84 mm (alas de 27)"], ["Alto", "31,1 mm"], ["Agujeros", "2 × Ø3,5 por abrazadera"], ["Separación", "x 95–115 y 195–215"]],
    cotas: { x: "2 × 20 mm", y: "31,1 mm", z: "84 mm" }, exp: [0, 0.05, 0.15], corto: "fleje 20 × 3" });
  add({ id: "bisagras", grupo: G.caja, nombre: "Bisagras de la puerta", cod: "N° 58", sel: { comp: "bisagras" }, cant: 2, cantNota: "lista de materiales",
    material: "Latón", masa: null,
    medidas: [["Hoja", bom(58).esp ? "25 × 40 mm" : null], ["Pasador", "Ø3 mm"], ["Tornillos", "M2,5"]],
    cotas: { y: "40 mm (hoja 25 × 40)" }, exp: [-0.06, -0.2, 0.3], corto: "25 × 40" });
  add({ id: "cierre", grupo: G.caja, nombre: "Cierre magnético", cod: "N° 59", sel: { comp: "cierre" }, cant: 1,
    material: "Imán con placa metálica", masa: null,
    medidas: [["Medidas", null]], cotas: { y: null }, exp: [0.08, -0.2, 0.3], corto: "imán" });
  add({ id: "autorroscantes", grupo: G.caja, nombre: "Tornillo autorroscante 3,5 × 16", cod: "N° 42", sel: { comp: "autorroscantes" }, cant: 4, cantNota: "en uso (paquete de 10)",
    material: null, masa: null,
    medidas: [["Medida", "3,5 × 16 mm"], ["Uso", "alas de las abrazaderas al techo de la caja"]],
    cotas: { x: "Ø3,5 mm", y: "16 mm" }, exp: [0, -0.05, 0.15], corto: "3,5 × 16" });
  add({ id: "sepM3", grupo: G.caja, nombre: "Separador hexagonal M3", cod: "N° 40", sel: { comp: "sepM3" }, cant: null, cantNota: "en uso (paquete de 10)",
    material: "Latón o nylon", masa: null,
    medidas: [["Rosca", "M3, hembra–hembra"], ["Largo", "10 mm"]],
    cotas: { x: "M3", y: "10 mm" }, exp: [0, -0.2, 0.62], corto: "M3 × 10" });
  add({ id: "tornM3", grupo: G.caja, nombre: "Tornillo M3 × 8 con tuerca", cod: "N° 41", sel: { comp: "tornM3" }, cant: null, cantNota: "en uso (paquete de 20)",
    material: null, masa: null,
    medidas: [["Medida", "M3 × 8 mm, cabeza Phillips, con arandela"]],
    cotas: { x: "M3", y: "8 mm" }, exp: [0, -0.16, 0.62], corto: "M3 × 8" });
  add({ id: "sepM2", grupo: G.caja, nombre: "Separador M2 × 5", cod: "N° 57", sel: { comp: "sepM2" }, cant: null, cantNota: "en uso (kit de 4)",
    material: "Nylon", masa: null,
    medidas: [["Medida", "M2 × 5 mm, con tornillos"], ["Uso", "bajo el multiplexor TCA9548A"]],
    cotas: { x: "M2", y: "5 mm" }, exp: [0, -0.18, 0.62], corto: "M2 × 5" });

  // ---- accesorios mecánicos de la lista de materiales
  add({ id: "pasacables", grupo: G.acc, nombre: "Pasacables de goma (ojal)", cod: "N° 35", sel: { comp: "pasacables" }, cant: null, cantNota: "23 pasos (3 paquetes de 10)",
    material: "Goma", masa: null,
    medidas: [["Agujero", "8 mm"], ["Uso", "en cada paso de cable por un tubo o por el techo de la caja"]],
    cotas: { x: "agujero 8 mm" }, exp: [0, 0.04, 0], corto: "agujero 8" });
  add({ id: "pg9", grupo: G.acc, nombre: "Prensaestopas PG9", cod: "N° 39", sel: { comp: "pg9" }, cant: 2, cantNota: "1 en uso + 1 de reserva",
    material: "Nylon", masa: null,
    medidas: [["Cable", "4–8 mm"], ["Agujero", "15,5 mm"], ["Cuerpo (SolidWorks 310)", "Ø15 × 18 mm"], ["Tuerca (SolidWorks 310)", "Ø20 × 6 mm"],
      ["Ubicación", "montante Sur del caballete Este, a 300 mm del piso"]],
    cotas: { x: "18 mm", y: "Ø20 mm" }, exp: [0.12, 0, 0.08], corto: "PG9" });
  add({ id: "empalme", grupo: G.acc, nombre: "Caja de empalme", cod: "N° 43", sel: { comp: "empalme", tag: "empalme-caja" }, cant: 1,
    material: "PVC", masa: null,
    medidas: [["Medidas", "aprox. 80 × 80 × 40 mm, con tapa"], ["Ubicación", "bajo la mesa (protege la placa de empalme de los DS18B20)"]],
    cotas: { x: "80 mm", y: "40 mm", z: "80 mm" }, exp: [0, 0.05, 0.3], corto: "80 × 80 × 40" });
  add({ id: "puente", grupo: G.acc, nombre: "Puente soporte del BH1750", cod: "N° 52", sel: { comp: ["307_1", "307_2", "307_3", "307_4", "307_5"], tag: "puente" }, cant: 5,
    material: "ABS (impreso 3D)", masa: null,
    medidas: [["Medidas", "15 × 110 × 5 mm"], ["Canal", "interior para el cable"], ["Apoyo", "muro exterior y muro central de cada cuarto"]],
    cotas: { x: "15 mm", y: "5 mm", z: "110 mm" }, exp: [0, 0.42, 0], corto: "15 × 110 × 5" });
  add({ id: "tornM3x12", grupo: G.acc, nombre: "Tornillo M3 × 12 del BH1750", cod: "N° 53", sel: { comp: ["307_1", "307_2", "307_3", "307_4", "307_5"], tag: "tornM3x12" }, cant: 5,
    material: null, masa: null,
    medidas: [["Medida", "M3 × 12 mm con tuerca, cabeza Phillips"], ["Uso", "1 por módulo, lo fija a su puente"]],
    cotas: { x: "M3", y: "12 mm" }, exp: [0, 0.46, 0], corto: "M3 × 12" });

  P.forEach((e) => {
    if (!e.archivo && /^[0-9]/.test(e.cod)) e.archivo = archivoSW(e.cod);
    if (!e.desc) e.desc = /^[0-9]/.test(e.cod) ? descSW(e.cod) : (bom(+String(e.cod).replace(/\D/g, "")).uso || "");
    if (/^N°/.test(e.cod)) { const b = bom(+e.cod.replace(/\D/g, "")); e.bom = b; if (e.cant == null && b.cant != null) e.cantLista = b.cant + " " + b.uni; }
  });

  /** Lista de lo que falta en los datos (se muestra «pendiente»). */
  function pendientes(e) {
    const out = [];
    if (!e.material) out.push("material");
    if (!e.masa) out.push("masa");
    e.medidas.forEach(([k, v]) => { if (v == null) out.push(k.toLowerCase()); });
    Object.entries(e.cotas || {}).forEach(([k, v]) => { if (v === null) out.push("cota " + k.toUpperCase()); });
    return out;
  }

  // ------------------------------------------------------------------ estado del modo
  const PZ = (H.piezas = { activo: false, lista: P, sel: null, resto: "fantasma", cotas: true, explosion: false, kExp: 0 });
  let instancias = new Map();     // id -> [[obj...]]
  let mallasDe = new Map();       // "id|i" -> Set(mallas)
  let entradaDeMalla = new Map(); // malla -> { e, i }
  let todas = [];                 // todas las mallas del modelo
  let mecanicas = new Set();      // mallas mecánicas (se ven en el modo)
  let listo = false, animando = false;
  const FANTASMA = 0.1;

  function comps(e) { return [].concat(e.sel.comp); }
  function resolver(e) {
    const ids = comps(e), out = [];
    if (e.sel.conjunto) {
      const objs = ids.flatMap((id) => (H.comps[id] ? H.comps[id].objetos : []));
      if (objs.length) out.push(objs);
      return out;
    }
    ids.forEach((id) => (H.comps[id] ? H.comps[id].objetos : []).forEach((o) => {
      if (e.sel.tag) {
        o.traverse((x) => { if (x.userData.piezaTag === e.sel.tag && !(x.parent && x.parent.userData.piezaTag === e.sel.tag)) out.push([x]); });
      } else out.push([o]);
    }));
    return out;
  }
  function mallasInst(e, objs) {
    const ids = new Set(comps(e)), s = new Set();
    objs.forEach((o) => o.traverse((x) => {
      if (!x.isMesh || !ids.has(x.userData.comp)) return;
      if (e.sel.tag && x.userData.piezaTag !== e.sel.tag) return;
      s.add(x);
    }));
    return s;
  }
  function preparar() {
    if (listo) return;
    listo = true;
    H.ref.raiz.traverse((o) => { if (o.isMesh) { todas.push(o); o.userData.cs0 = o.castShadow; } });
    // primero los conjuntos, después las piezas sueltas (la más específica gana el clic)
    const orden = P.filter((e) => e.conjunto).concat(P.filter((e) => !e.conjunto));
    orden.forEach((e) => {
      const ins = resolver(e);
      instancias.set(e.id, ins);
      if (e.cant == null) e.cant = ins.length;
      ins.forEach((objs, i) => {
        const s = mallasInst(e, objs);
        mallasDe.set(e.id + "|" + i, s);
        s.forEach((m) => { mecanicas.add(m); if (!e.conjunto || !entradaDeMalla.has(m)) entradaDeMalla.set(m, { e, i }); });
      });
    });
    // contexto mecánico sin pieza propia: pisos y vidrios de la maqueta, encaje de la mesa
    todas.forEach((m) => {
      const c = m.userData.comp, capa = m.userData.capa;
      if (c === "303" || (!c && ["estructura", "mecanismo", "soporte", "maqueta"].includes(capa))) mecanicas.add(m);
    });
    P.forEach((e) => { e.pendientes = pendientes(e); e.n = (instancias.get(e.id) || []).length; });
  }

  // ------------------------------------------------------------------ opacidad suave por malla
  const mats = (o) => (Array.isArray(o.material) ? o.material : [o.material]);
  function aplicar(o, f) {
    o.userData.pzF = f;
    o.visible = f > 0.004;
    mats(o).forEach((m) => {
      const op0 = m.userData.op0 == null ? 1 : m.userData.op0;
      m.opacity = op0 * f;
      const tr = !!m.userData.tr0 || f < 0.999;
      if (m.transparent !== tr) { m.transparent = tr; m.needsUpdate = true; }
      m.depthWrite = m.userData.dw0 !== false && f > 0.6;
    });
    o.castShadow = !!o.userData.cs0 && f > 0.6;
    o.userData.pzFantasma = f < 0.6;
  }
  function objetivos() {
    const sel = PZ.sel ? selMallas() : null;
    todas.forEach((m) => {
      let t = 0;
      if (mecanicas.has(m)) t = !sel || sel.has(m) ? 1 : PZ.resto === "oculto" ? 0 : FANTASMA;
      if (m.userData.capa === "techo" && H.anim.techos < 0.01) t = 0;
      m.userData.pzT = t;
      if (m.userData.pzF == null) m.userData.pzF = m.visible ? 1 : 0;
    });
    animando = true;
  }
  function selMallas() {
    const { e, i } = PZ.sel, s = new Set();
    const ins = instancias.get(e.id) || [];
    (i < 0 ? ins.map((_, k) => k) : [i]).forEach((k) => (mallasDe.get(e.id + "|" + k) || new Set()).forEach((m) => s.add(m)));
    return s;
  }
  function selObjetos() {
    const { e, i } = PZ.sel, ins = instancias.get(e.id) || [];
    return i < 0 ? ins.flat() : ins[i] || [];
  }

  // ------------------------------------------------------------------ cotas 3D
  let cotasG = [];                 // [{ g, padre, inst }]
  const AZUL = 0x0a84ff;
  function textura(texto, pendiente) {
    const c = document.createElement("canvas");
    const g = c.getContext("2d");
    const f = "600 44px -apple-system, 'Segoe UI', Arial, sans-serif";
    g.font = f;
    const w = Math.ceil(g.measureText(texto).width) + 40;
    c.width = w; c.height = 72;
    g.font = f;
    const r = 30;
    g.fillStyle = pendiente ? "rgba(255,159,10,0.95)" : "rgba(10,132,255,0.95)";
    g.beginPath(); g.moveTo(r, 4); g.lineTo(w - r, 4); g.arc(w - r, 36, 32, -Math.PI / 2, Math.PI / 2); g.lineTo(r, 68); g.arc(r, 36, 32, Math.PI / 2, -Math.PI / 2); g.fill();
    g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(texto, w / 2, 38);
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
    return { t, asp: w / 72 };
  }
  function etiqueta(texto, pos, h) {
    const pend = texto == null;
    const { t, asp } = textura(pend ? "pendiente" : texto, pend);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, depthWrite: false, transparent: true }));
    s.scale.set(h * asp, h, 1);
    s.position.copy(pos);
    s.renderOrder = 1000;
    s.userData.cota = true;
    s.userData.texto = pend ? "pendiente" : texto;
    return s;
  }
  /** Caja de las mallas en el marco del objeto 'padre' (sin el desplazamiento de la explosión). */
  function cajaEn(padre, mallas, offLocal) {
    const inv = new THREE.Matrix4().copy(padre.matrixWorld).invert();
    const b = new THREE.Box3(), m = new THREE.Matrix4(), bb = new THREE.Box3();
    mallas.forEach((o) => {
      if (!o.geometry) return;
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      m.multiplyMatrices(inv, o.matrixWorld);
      bb.copy(o.geometry.boundingBox).applyMatrix4(m);
      b.union(bb);
    });
    if (offLocal) b.translate(offLocal.clone().negate());
    return b;
  }
  function borrarCotas() {
    cotasG.forEach(({ g }) => {
      g.parent && g.parent.remove(g);
      g.traverse((o) => { if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } if (o.geometry) o.geometry.dispose(); });
    });
    cotasG = [];
  }
  function dibujarCotas() {
    borrarCotas();
    if (!PZ.sel || !PZ.cotas) return;
    const { e } = PZ.sel;
    const objs = selObjetos();
    if (!objs.length) return;
    H.ref.raiz.updateMatrixWorld(true);
    // cotas sobre la primera instancia (si se aíslan todas, sobre la primera)
    const inst = objs[0];
    const padre = e.sel.conjunto ? objs[0].parent : inst.parent;
    const mallas = e.sel.conjunto ? [...selMallas()] : [...(mallasDe.get(e.id + "|" + Math.max(0, PZ.sel.i)) || [])];
    if (!mallas.length || !padre) return;
    const off = inst.userData.pzOffLocal ? inst.userData.pzOffLocal.clone() : null;
    const b = cajaEn(padre, mallas, off);
    if (b.isEmpty()) return;
    const s = b.getSize(new THREE.Vector3());
    const M = Math.max(s.x, s.y, s.z);
    const d = Math.min(0.09, Math.max(0.0015, M * 0.16));      // separación de la línea de cota
    const h = Math.min(0.036, Math.max(0.0009, M * 0.055));    // alto del rótulo
    const g = new THREE.Group();
    g.name = "cotas";
    const pts = [];
    const L = (a, bq) => pts.push(a.clone(), bq.clone());
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    const tick = (p, dirA, dirB) => { const k = d * 0.22; L(p.clone().addScaledVector(dirA, -k).addScaledVector(dirB, -k), p.clone().addScaledVector(dirA, k).addScaledVector(dirB, k)); };
    const { min: a, max: z } = b;
    const C = e.cotas || {};
    if ("x" in C) {               // a lo largo de X, abajo y adelante
      const y = a.y - d, p0 = V(a.x, y, z.z), p1 = V(z.x, y, z.z);
      L(V(a.x, a.y, z.z), V(a.x, y - d * 0.25, z.z)); L(V(z.x, a.y, z.z), V(z.x, y - d * 0.25, z.z)); L(p0, p1);
      tick(p0, V(1, 0, 0), V(0, 1, 0)); tick(p1, V(1, 0, 0), V(0, 1, 0));
      g.add(etiqueta(C.x, V((a.x + z.x) / 2, y - h * 0.75, z.z), h));
    }
    if ("y" in C) {               // vertical, a la derecha y adelante
      const x = z.x + d, p0 = V(x, a.y, z.z), p1 = V(x, z.y, z.z);
      L(V(z.x, a.y, z.z), V(x + d * 0.25, a.y, z.z)); L(V(z.x, z.y, z.z), V(x + d * 0.25, z.y, z.z)); L(p0, p1);
      tick(p0, V(0, 1, 0), V(1, 0, 0)); tick(p1, V(0, 1, 0), V(1, 0, 0));
      const sp = etiqueta(C.y, V(x + h * 0.3, (a.y + z.y) / 2, z.z), h);
      sp.center.set(0, 0.5);
      g.add(sp);
    }
    if ("z" in C) {               // a lo largo de Z, abajo a la derecha
      const x = z.x + d, y = a.y, p0 = V(x, y, a.z), p1 = V(x, y, z.z);
      L(V(z.x, y, a.z), V(x + d * 0.25, y, a.z)); L(V(z.x, y, z.z), V(x + d * 0.25, y, z.z)); L(p0, p1);
      tick(p0, V(0, 0, 1), V(1, 0, 0)); tick(p1, V(0, 0, 1), V(1, 0, 0));
      const sp = etiqueta(C.z, V(x + h * 0.3, y, (a.z + z.z) / 2), h);
      sp.center.set(0, 0.5);
      g.add(sp);
    }
    // contorno fino de la caja de la pieza
    const caja = new THREE.Box3Helper(b, AZUL);
    caja.material.transparent = true; caja.material.opacity = 0.28; caja.material.depthTest = false;
    caja.renderOrder = 998;
    g.add(caja);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const lin = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: AZUL, depthTest: false, transparent: true, opacity: 0.95 }));
    lin.renderOrder = 999;
    g.add(lin);
    padre.add(g);
    cotasG.push({ g, inst });
    g.userData.inst = inst;
  }

  // ------------------------------------------------------------------ explosión de las piezas
  const C_EXP = new THREE.Vector3(0, 0.55, 0), F_EXP = 0.6;
  let expData = null;              // [{ obj, p0, dW, anidada }]
  function prepararExplosion() {
    H.ref.raiz.updateMatrixWorld(true);
    const instObjs = new Set();
    const lista = [];
    P.filter((e) => !e.conjunto).forEach((e) => (instancias.get(e.id) || []).forEach((objs, i) => {
      objs.forEach((o) => instObjs.add(o));
      lista.push({ e, i, obj: objs[0] });
    }));
    expData = lista.map(({ e, i, obj }) => {
      const p0 = obj.userData.pzP0 ? obj.userData.pzP0.clone() : obj.position.clone();
      obj.userData.pzP0 = p0.clone();
      let anidada = false;
      for (let q = obj.parent; q; q = q.parent) if (instObjs.has(q)) { anidada = true; break; }
      const ms = [...(mallasDe.get(e.id + "|" + i) || [])];
      const b = new THREE.Box3();
      ms.forEach((m) => b.expandByObject(m));
      const c = b.isEmpty() ? obj.getWorldPosition(new THREE.Vector3()) : b.getCenter(new THREE.Vector3());
      if (obj.userData.pzOffW) c.sub(obj.userData.pzOffW);
      const dW = anidada ? new THREE.Vector3() : c.clone().sub(C_EXP).multiplyScalar(F_EXP);
      if (e.exp) dW.add(new THREE.Vector3(...e.exp));
      return { e, i, obj, p0, dW, c0: c, tam: b.isEmpty() ? 0 : b.getSize(new THREE.Vector3()).length() };
    });
  }
  const m3 = new THREE.Matrix3();
  function moverExplosion(k) {
    if (!expData) return;
    expData.forEach((x) => {
      const o = x.obj;
      const w = x.dW.clone().multiplyScalar(k);
      o.userData.pzOffW = w;
      const loc = w.clone().applyMatrix3(m3.setFromMatrix4(o.parent.matrixWorld).invert());
      o.userData.pzOffLocal = loc;
      o.position.copy(x.p0).add(loc);
    });
    cotasG.forEach(({ g, inst }) => { g.position.copy(inst.userData.pzOffLocal || new THREE.Vector3()); });
  }
  function restaurarPosiciones() {
    if (!expData) return;
    expData.forEach((x) => { x.obj.position.copy(x.p0); delete x.obj.userData.pzOffW; delete x.obj.userData.pzOffLocal; delete x.obj.userData.pzP0; });
    expData = null;
  }

  // ------------------------------------------------------------------ etiquetas de la vista explosionada
  let etqs = [];
  function crearEtiquetas() {
    const cont = $("#pz-etiquetas");
    cont.innerHTML = "";
    etqs = [];
    if (!expData) return;
    const vistos = new Set();
    expData.forEach((x) => {
      if (vistos.has(x.e.id)) return;
      vistos.add(x.e.id);
      const el = document.createElement("button");
      el.className = "pz-etq";
      el.textContent = x.e.nombre;
      el.addEventListener("click", () => PZ.seleccionar(x.e.id, x.i));
      cont.appendChild(el);
      etqs.push({ el, x });
    });
    etqs.sort((a, b) => b.x.tam - a.x.tam);
  }
  const tmpV = new THREE.Vector3();
  function moverEtiquetas(cam) {
    const k = PZ.kExp;
    const cont = $("#pz-etiquetas");
    cont.style.opacity = k > 0.5 ? (k - 0.5) * 2 : 0;
    cont.style.pointerEvents = k > 0.9 ? "auto" : "none";
    if (k < 0.5) return;
    const W = window.innerWidth, Hh = window.innerHeight;
    // con una pieza elegida no hay rótulos (su nombre está en la ficha y sus cotas en 3D);
    // sin elegir: las piezas grandes primero y se omiten los rótulos que se encimarían
    const puestos = [];
    etqs.forEach((q) => {
      const { el, x } = q;
      tmpV.copy(x.c0).add(x.obj.userData.pzOffW || new THREE.Vector3()).project(cam);
      let vis = !PZ.sel && tmpV.z < 1 && Math.abs(tmpV.x) < 1.02 && Math.abs(tmpV.y) < 1.02;
      const px = ((tmpV.x + 1) / 2) * W, py = ((1 - tmpV.y) / 2) * Hh;
      if (vis) {
        if (!q.w) { el.style.display = ""; q.w = el.offsetWidth + 6; q.h = el.offsetHeight + 4; }
        const r = [px - q.w / 2, py - q.h / 2, px + q.w / 2, py + q.h / 2];
        if (puestos.some((o) => r[0] < o[2] && r[2] > o[0] && r[1] < o[3] && r[3] > o[1])) vis = false;
        else puestos.push(r);
      }
      el.style.display = vis ? "" : "none";
      if (vis) el.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`;
    });
  }

  // ------------------------------------------------------------------ cámara
  function enfocar(mallas) {
    const app = H.app;
    const b = new THREE.Box3();
    H.ref.raiz.updateMatrixWorld(true);
    mallas.forEach((m) => b.expandByObject(m));
    if (b.isEmpty()) return;
    const c = b.getCenter(new THREE.Vector3());
    const s = b.getSize(new THREE.Vector3()).length();
    const ancho = window.innerWidth - (H.movil() || document.body.classList.contains("sin-paneles") ? 0 : 660);
    const f = Math.max(1, window.innerWidth / Math.max(420, ancho)) * H.factorPantalla();   // deja espacio a los paneles; celular vertical: más lejos
    app.orbita.volarA(c, Math.min(5.5, Math.max(0.07, s * 1.45 * f * (H.movil() ? 1.3 : 1))), null, null, 950);
  }

  // ------------------------------------------------------------------ interfaz
  function grupoLista(filtro) {
    const f = (filtro || "").trim().toLowerCase();
    const html = ORDEN_G.map((g) => {
      const es = P.filter((e) => e.grupo === g && e.n && (!f || [e.nombre, e.cod, e.archivo, e.corto, e.material].join(" ").toLowerCase().includes(f)));
      if (!es.length) return "";
      return `<div class="grupo-comp">${esc(g)} · ${es.length}</div>` + es.map((e) => `
        <div class="item-comp pz-item${e.conjunto ? " pz-conj" : ""}" data-pieza="${esc(e.id)}" role="button" tabindex="0">
          <span class="cod">${esc(e.cod)}</span>
          <span class="pz-txt">${esc(e.nombre)}<span class="sub">${esc(e.corto || "")}${e.pendientes.length ? ' · <i class="pz-pend-txt">pendiente</i>' : ""}</span></span>
          <span class="pz-cant">×${esc(e.cant)}</span>
        </div>`).join("");
    }).join("");
    $("#pz-lista").innerHTML = html || `<p class="nota">Ninguna pieza coincide.</p>`;
    $("#pz-lista").querySelectorAll(".pz-item").forEach((el) => {
      el.addEventListener("click", () => PZ.seleccionar(el.dataset.pieza, 0));
      el.addEventListener("keydown", (ev) => { if (ev.key === "Enter") PZ.seleccionar(el.dataset.pieza, 0); });
    });
    marcarLista();
  }
  function marcarLista() {
    const id = PZ.sel ? PZ.sel.e.id : null;
    document.querySelectorAll(".pz-item").forEach((el) => el.classList.toggle("sel", el.dataset.pieza === id));
    const el = id && document.querySelector(`.pz-item[data-pieza="${CSS.escape(id)}"]`);
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  const vPend = (v, nota) => (v == null || v === "" ? `<span class="pz-pend">${esc(nota || "pendiente")}</span>` : esc(v));
  function ficha() {
    const visibles = P.filter((e) => e.n);
    if (!PZ.sel) {
      const total = visibles.filter((e) => !e.conjunto).reduce((a, e) => a + (e.cant || 0), 0);
      $("#pz-cod").textContent = "Ensamble";
      $("#pz-grupo").textContent = "Piezas mecánicas";
      $("#pz-nombre").textContent = "Heliodón pequeño";
      $("#pz-desc").textContent = "Toque una pieza en el modelo o en la lista para aislarla y ver sus cotas. Las flechas ← → pasan a la pieza anterior o siguiente.";
      $("#pz-pos").textContent = `${visibles.length} piezas`;
      $("#pz-instancias").innerHTML = "";
      $("#pz-medidas").innerHTML = [
        ["Estructura", `${D.largo} × ${D.ancho} mm, tubo ${TB} × ${TB} × ${PARED}`], ["Mesa", `Ø${2 * D.rMesa} a 900 mm del piso`],
        ["Aro", "R480, de 90° N a 90° S"], ["Piezas en la lista", `${visibles.length} tipos · ${total} unidades`],
      ].map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("");
      $("#pz-datos").innerHTML = `<div><span>Masa total</span><b>${ENS.masa_kg ? n(ENS.masa_kg, 2) + " kg" : '<span class="pz-pend">pendiente</span>'}</b></div>
        <div><span>Material</span><b>Acero, aluminio, MDF, ABS</b></div><div><span>Fuente</span><b>SW + lista</b></div>`;
      $("#pz-origen").textContent = "Medidas del ensamble 000 de SolidWorks (datos_generados.js), de los macros de a\\macros y de la lista de materiales.";
      $("#pz-pendientes").innerHTML = "";
      return;
    }
    const { e, i } = PZ.sel;
    const ins = instancias.get(e.id) || [];
    const k = visibles.indexOf(e);
    $("#pz-cod").textContent = e.cod;
    $("#pz-grupo").textContent = e.grupo;
    $("#pz-nombre").textContent = e.nombre;
    $("#pz-desc").textContent = e.desc || "";
    $("#pz-pos").textContent = `${k + 1} de ${visibles.length}`;
    $("#pz-instancias").innerHTML = ins.length > 1 && ins.length <= 24
      ? `<button class="chip${i < 0 ? " activo" : ""}" data-inst="-1">Todas</button>` + ins.map((_, j) => `<button class="chip${j === i ? " activo" : ""}" data-inst="${j}">${j + 1}</button>`).join("")
      : "";
    $("#pz-instancias").querySelectorAll(".chip").forEach((b) => b.addEventListener("click", () => PZ.seleccionar(e.id, +b.dataset.inst)));
    $("#pz-medidas").innerHTML = e.medidas.map(([kk, v]) => `<div><span>${esc(kk)}</span><b>${vPend(v)}</b></div>`).join("");
    const cant = e.cant != null ? e.cant + (e.cantNota ? ` <small>(${esc(e.cantNota)})</small>` : "") : (e.cantLista ? esc(e.cantLista) : "");
    $("#pz-datos").innerHTML = `
      <div><span>Material</span><b>${vPend(e.material, e.materialNota || "pendiente")}</b></div>
      <div><span>Masa</span><b>${e.masa ? esc(kg(e.masa.v)) : vPend(null, e.masaNota || "pendiente")}</b>${e.masa ? `<small>${esc(e.masa.nota)}</small>` : ""}</div>
      <div><span>Cantidad</span><b>${cant}</b></div>`;
    $("#pz-origen").textContent = e.archivo ? `SolidWorks · ${e.archivo}.SLDPRT` : e.bom && e.bom.nombre ? `Lista de materiales · ${e.cod} · ${e.bom.nombre}${e.bom.esp ? " (" + e.bom.esp + ")" : ""}` : "Solo en el simulador";
    $("#pz-pendientes").innerHTML = e.pendientes.length ? `<span class="pz-pend">Pendiente en los datos: ${esc(e.pendientes.join(", "))}</span>` : "";
  }

  function tooltip(x, y, obj) {
    const t = $("#tooltip");
    const r = obj && entradaDeMalla.get(obj);
    if (!r) { t.classList.add("oculto"); return; }
    t.innerHTML = `<div class="tt-codigo">${esc(r.e.cod)} · ${esc(r.e.grupo)}</div><div class="tt-titulo">${esc(r.e.nombre)}</div>
      <div class="tt-fila">${esc(r.e.corto || "")}</div><div class="tt-fila" style="color:var(--acento)">Clic para aislarla y ver sus cotas</div>`;
    t.classList.remove("oculto");
    t.style.left = Math.min(window.innerWidth - t.offsetWidth - 12, x + 16) + "px";
    t.style.top = Math.min(window.innerHeight - t.offsetHeight - 12, y + 16) + "px";
  }

  // ------------------------------------------------------------------ API
  let previo = null;
  Object.assign(PZ, {
    alternar() { return PZ.activo ? PZ.salir() : PZ.entrar(); },
    entrar() {
      if (PZ.activo) return;
      preparar();
      const app = H.app, est = app.estado;
      previo = { explosion: est.explosion, conexiones: est.conexiones, rayosx: est.rayosx, levantar: est.levantar, min: app.orbita.min, near: app.camara.near };
      ["explosion", "conexiones", "rayosx", "levantar"].forEach((k) => { if (est[k]) app.set(k, false); });
      PZ.activo = true;
      app.resaltarIds([]);
      app.orbita.min = 0.035;
      app.camara.near = 0.004; app.camara.updateProjectionMatrix();
      document.body.classList.add("modo-piezas");
      $("#panel-ficha").classList.remove("oculto");
      $("#panel-piezas").classList.remove("oculto");
      grupoLista($("#pz-buscar").value);
      PZ.sel = null;
      ficha();
      objetivos();
      app.orbita.volarA(new THREE.Vector3(0, 0.66, 0), 3.0 * H.factorPantalla(), null, 1.05);
      H.UI.aviso("Modo Piezas: toque una pieza para aislarla y ver sus medidas", 3200);
      app.sincronizar();
    },
    salir() {
      if (!PZ.activo) return;
      const app = H.app;
      PZ.explosion = false; PZ.kExp = 0;
      moverExplosion(0); restaurarPosiciones();
      $("#pz-etiquetas").innerHTML = ""; etqs = [];
      borrarCotas();
      PZ.sel = null;
      todas.forEach((m) => { aplicar(m, 1); delete m.userData.pzF; delete m.userData.pzT; m.userData.pzFantasma = false; });
      PZ.activo = false;
      document.body.classList.remove("modo-piezas");
      $("#panel-ficha").classList.add("oculto");
      $("#panel-piezas").classList.add("oculto");
      $("#tooltip").classList.add("oculto");
      app.orbita.min = previo ? previo.min : 0.18;
      app.camara.near = previo ? previo.near : 0.02; app.camara.updateProjectionMatrix();
      app.refrescar();
      if (previo) ["explosion", "conexiones", "rayosx", "levantar"].forEach((k) => { if (previo[k]) app.set(k, true); });
      app.vistaInicio();
      app.sincronizar();
    },
    /** Selecciona una pieza por id; i = instancia (−1 = todas). */
    seleccionar(id, i = 0) {
      if (!PZ.activo) PZ.entrar();
      const e = P.find((x) => x.id === id);
      if (!e || !(instancias.get(id) || []).length) return false;
      const ins = instancias.get(id);
      PZ.sel = { e, i: i < 0 ? -1 : Math.min(i, ins.length - 1) };
      objetivos();
      ficha();
      marcarLista();
      dibujarCotas();
      enfocar([...selMallas()]);
      H.UI.aviso(e.nombre + (e.corto ? " · " + e.corto : ""), 1800);
      return true;
    },
    ensamble() {
      PZ.sel = null;
      borrarCotas();
      objetivos(); ficha(); marcarLista();
      H.app.orbita.volarA(new THREE.Vector3(0, PZ.explosion ? 0.72 : 0.66, 0), (PZ.explosion ? 4.0 : 3.0) * H.factorPantalla(), null, 1.05);
    },
    paso(d) {
      const vis = P.filter((e) => e.n);
      let k = PZ.sel ? vis.indexOf(PZ.sel.e) : d > 0 ? -1 : vis.length;
      k = (k + d + vis.length) % vis.length;
      PZ.seleccionar(vis[k].id, 0);
    },
    explotar(v) {
      PZ.explosion = v == null ? !PZ.explosion : !!v;
      if (PZ.explosion) { prepararExplosion(); crearEtiquetas(); }
      $("#pz-t-exp").checked = PZ.explosion;
      H.app.sincronizar();
      if (!PZ.sel) H.app.orbita.volarA(new THREE.Vector3(0, PZ.explosion ? 0.72 : 0.66, 0), Math.min(7.4, (PZ.explosion ? 4.0 : 3.0) * H.factorPantalla()), null, 1.05);
      H.UI.aviso(PZ.explosion ? "Vista explosionada de las piezas mecánicas" : "Piezas en su lugar", 1800);
    },
    ponerResto(r) {
      PZ.resto = r;
      document.querySelectorAll("#pz-resto button").forEach((b) => b.classList.toggle("activo", b.dataset.resto === r));
      objetivos();
    },
    ponerCotas(v) { PZ.cotas = !!v; $("#pz-t-cotas").checked = PZ.cotas; dibujarCotas(); },
    clic(obj) {
      const r = obj && entradaDeMalla.get(obj);
      if (r && !obj.userData.pzFantasma) PZ.seleccionar(r.e.id, r.i);
    },
    entrada(obj) { return obj ? entradaDeMalla.get(obj) || null : null; },
    tooltip,
    /** Se llama en cada cuadro (después de mover el mecanismo y antes de dibujar). */
    cuadro(dt, cam) {
      if (!PZ.activo) return;
      const obj = PZ.explosion ? 1 : 0;
      const kp = PZ.kExp;
      PZ.kExp += (obj - PZ.kExp) * (1 - Math.exp(-dt * 3.4));
      if (Math.abs(PZ.kExp - obj) < 0.002) PZ.kExp = obj;
      if (PZ.kExp !== kp || PZ.kExp > 0) {
        H.ref.raiz.updateMatrixWorld(true);
        const e = PZ.kExp * PZ.kExp * (3 - 2 * PZ.kExp);
        moverExplosion(e);
        if (PZ.kExp === 0 && !PZ.explosion) { restaurarPosiciones(); $("#pz-etiquetas").innerHTML = ""; etqs = []; }
      }
      if (animando) {
        const k = 1 - Math.exp(-dt * 9);
        let falta = false;
        todas.forEach((m) => {
          const t = m.userData.pzT == null ? 1 : m.userData.pzT;
          let f = m.userData.pzF == null ? 1 : m.userData.pzF;
          if (Math.abs(f - t) < 0.004) { if (f !== t) aplicar(m, t); return; }
          f += (t - f) * k;
          aplicar(m, f);
          falta = true;
        });
        if (!falta) animando = false;
      }
      moverEtiquetas(cam);
    },
    /** La app llama esto en lugar de su propia visibilidad mientras el modo está activo. */
    visibilidad() { objetivos(); },
    info() {
      preparar();
      const vis = P.filter((e) => e.n);
      return {
        activo: PZ.activo, piezas: vis.length, sinModelo: P.filter((e) => !e.n).map((e) => e.id),
        ids: vis.map((e) => e.id), sel: PZ.sel ? { id: PZ.sel.e.id, i: PZ.sel.i } : null,
        cotas: cotasG.reduce((a, { g }) => a + g.children.filter((c) => c.isSprite).length, 0),
        rotulos: cotasG.flatMap(({ g }) => g.children.filter((c) => c.isSprite).map((c) => c.userData.texto || "")),
        pendientes: vis.filter((e) => e.pendientes.length).map((e) => ({ id: e.id, nombre: e.nombre, falta: e.pendientes })),
        kExp: PZ.kExp, etiquetas: etqs.length,
        visiblesMecanicas: todas.filter((m) => m.visible && mecanicas.has(m)).length,
        visiblesNoMecanicas: todas.filter((m) => m.visible && !mecanicas.has(m)).length,
      };
    },
  });

  // ------------------------------------------------------------------ eventos de los paneles
  PZ.iniciarUI = function () {
    $("#pz-ant").addEventListener("click", () => PZ.paso(-1));
    $("#pz-sig").addEventListener("click", () => PZ.paso(1));
    $("#pz-ensamble").addEventListener("click", () => PZ.ensamble());
    $("#pz-salir").addEventListener("click", () => PZ.salir());
    $("#pz-buscar").addEventListener("input", (ev) => grupoLista(ev.target.value));
    $("#pz-t-exp").addEventListener("change", (ev) => PZ.explotar(ev.target.checked));
    $("#pz-t-cotas").addEventListener("change", (ev) => PZ.ponerCotas(ev.target.checked));
    document.querySelectorAll("#pz-resto button").forEach((b) => b.addEventListener("click", () => PZ.ponerResto(b.dataset.resto)));
  };
})();
