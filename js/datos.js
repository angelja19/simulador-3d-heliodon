/* Datos del heliodón pequeño con caballetes en A (SolidWorks 10-11/11/2026):
   cuartos de la maqueta, tipos de cable, catálogo de TODAS las piezas (material y masa de SolidWorks) y de TODOS
   los cables, y la función de cada componente de la caja del Arduino.
   Fuente: Heliodon pequeno SolidWorks (verificacion.txt de a\macros, scripts 45 y 49) y diseno_caballetes_A.json. */
(function () {
  const H = (window.H = window.H || {});

  // cuartos: centro (mm, marco de la maqueta), puente del BH1750 (x, lado), muros exteriores (azimut), color
  H.CUARTOS = [
    { n: 1, lado: "Norte", pos: "Noroeste", c: [-98.5, -53.5], bx: -100, s: -1, muros: [0, 270], color: "#007AFF", canal: 0 },
    { n: 2, lado: "Norte", pos: "Norte centro", c: [0, -53.5], bx: 0, s: -1, muros: [0], color: "#FF9500", canal: 1 },
    { n: 3, lado: "Norte", pos: "Noreste", c: [98.5, -53.5], bx: 100, s: -1, muros: [0, 90], color: "#34C759", canal: 2 },
    { n: 4, lado: "Sur", pos: "Suroeste", c: [-73.5, 53.5], bx: -75, s: 1, muros: [180, 270], color: "#FF3B30", canal: 3 },
    { n: 5, lado: "Sur", pos: "Sureste", c: [73.5, 53.5], bx: 75, s: 1, muros: [180, 90], color: "#AF52DE", canal: 4 },
  ];

  // tipos de cable (color por tipo): sensores en azul por la pata Norte; foco (rojo) y 220 V (negro) por la pata Sur
  H.TIPOS = {
    sensores: { nombre: "Sensores DS18B20 (bus 1-Wire)", color: 0x007aff },
    bh1750: { nombre: "Sensores de luz BH1750 (I2C, 12 hilos)", color: 0x1d4ed8 },
    foco: { nombre: "Foco 220 V", color: 0xff3b30 },
    v220: { nombre: "Alimentación 220 V", color: 0x1c1c1e },
    usb: { nombre: "USB a la PC", color: 0x8e8e93 },
    dupont: { nombre: "Cables Dupont dentro de la caja", color: 0xff9500 },
    interno220: { nombre: "Cables de 220 V dentro de la caja", color: 0x8b5a2b },
  };

  // ------------------------------------------------------------------ catálogo de piezas
  // grupo: Estructura · Mecanismo · Soporte · Electrónica · Tornillería. masa en kg por unidad (SolidWorks).
  const GAL = "Acero galvanizado tubo 40x40x1,2", A36 = "ASTM A36 Acero", ZINC = "Acero zincado (tornillería 8.8)";
  const P40 = "Tubo cuadrado 40 × 40 × 1,2 mm galvanizado";
  H.GRUPOS = ["Estructura", "Mecanismo", "Soporte", "Electrónica", "Tornillería"];
  H.PIEZAS = [
    // ---- Estructura
    { id: "102", cod: "102", nombre: "Caballete en A Este", grupo: "Estructura", material: GAL, perfil: P40, masa: 4.945, cant: 1,
      medidas: { largo: "1 050 mm (base N-S)", alto: "760 mm (y 142–901,7)", ancho: "40 mm", espesor: "1,2 mm" },
      extra: [["Patas", "2 × 855 mm a 32,9° de la vertical"], ["Travesaño", "a 380 mm del piso (y 360–400)"]],
      desc: "Una de las dos A: base N-S, dos patas inclinadas, travesaño y punta con la chumacera del aro. Lleva la caja del Arduino y el graduador." },
    { id: "103", cod: "103", nombre: "Caballete en A Oeste", grupo: "Estructura", material: GAL, perfil: P40, masa: 4.947, cant: 1,
      medidas: { largo: "1 050 mm (base N-S)", alto: "760 mm (y 142–901,7)", ancho: "40 mm", espesor: "1,2 mm" },
      extra: [["Patas", "2 × 855 mm a 32,9° de la vertical"], ["Travesaño", "a 380 mm del piso"]],
      desc: "La A del lado Oeste, igual a la del Este (sin caja ni graduador)." },
    { id: "105", cod: "105", nombre: "Tubo superior Este-Oeste", grupo: "Estructura", material: GAL, perfil: P40, masa: 1.636, cant: 1,
      medidas: { largo: "1 120 mm", ancho: "40 mm", alto: "40 mm (y 825–865)", espesor: "1,2 mm" },
      desc: "Une las dos A bajo la mesa y sostiene el plato giratorio. Por dentro pasa el cable de los sensores." },
    { id: "113", cod: "113", nombre: "Tubo inferior Este-Oeste", grupo: "Estructura", material: GAL, perfil: P40, masa: 1.637, cant: 2,
      medidas: { largo: "1 120 mm", ancho: "40 mm", alto: "40 mm (y 142–182)", espesor: "1,2 mm" },
      desc: "Dos tubos a ras del piso (Norte y Sur, z ±470) que unen las bases de las A." },
    { id: "114", cod: "114", nombre: "Placa de la punta de la A", grupo: "Estructura", material: A36, perfil: "Chapa 2 mm", masa: 0.097, cant: 2,
      medidas: { largo: "120 mm", ancho: "70 mm", espesor: "2 mm (y 899,7–901,7)" },
      desc: "Placa soldada en la punta de cada A: sobre ella se atornilla la chumacera UCP204." },
    { id: "115", cod: "115", nombre: "Cartela de la A", grupo: "Estructura", material: A36, perfil: "Chapa 3 mm", masa: 0.042, cant: 4,
      medidas: { largo: "120 mm", alto: "120 mm", espesor: "3 mm" },
      desc: "Refuerzo triangular entre la pata y la base de cada A." },
    { id: "112", cod: "112", nombre: "Placas adaptadoras de las ruedas", grupo: "Estructura", material: A36, perfil: "Chapa 2 mm", masa: 0.622, cant: 1,
      medidas: { largo: "120 mm", ancho: "80 mm", espesor: "2 mm" }, extra: [["Placas", "4 (una por rueda), soldadas bajo las bases"]],
      desc: "Cuatro placas soldadas bajo los pies de las A donde se atornilla cada rueda." },
    // ---- Mecanismo
    { id: "201", cod: "201", nombre: "Medio aro de horas R480", grupo: "Mecanismo", material: A36, perfil: "Tubo redondo Ø38 × 1,2 mm", masa: 1.636, cant: 1,
      medidas: { diametro: "Ø38 mm (tubo) · R480 al eje", largo: "960 mm entre extremos", alto: "499 mm", espesor: "1,2 mm" },
      extra: [["Escala horaria", "7 a 17 h; rayas cada hora, media hora y cuarto (15° por hora)"], ["Topes del carro", "6:45 y 17:15 (rojos)"], ["Inclinación", "90° N a 90° S"]],
      desc: "Medio aro que gira sobre el eje E-O: se inclina con el graduador y el carro corre por su escala horaria." },
    { id: "116", cod: "116", nombre: "Cubo del aro", grupo: "Mecanismo", material: A36, perfil: "Barra redonda", masa: 0.049, cant: 2,
      medidas: { diametro: "Ø40 mm", largo: "25 mm" }, desc: "Une cada extremo del aro con su eje Ø20." },
    { id: "202", cod: "202", nombre: "Eje del aro Ø20", grupo: "Mecanismo", material: A36, perfil: "Barra redonda Ø20", masa: 0.4, cant: 2,
      medidas: { diametro: "Ø20 mm", largo: "160 mm" }, desc: "Eje de giro del aro dentro de la chumacera; el del Este lleva el brazo del graduador." },
    { id: "203", cod: "203", nombre: "Chumacera UCP204", grupo: "Mecanismo", material: "Fundición gris", perfil: "Chumacera de pie, eje Ø20", masa: 0.834, cant: 2,
      medidas: { largo: "127 mm", ancho: "38 mm", alto: "65 mm (eje a 33,3 mm de la base)", diametro: "eje Ø20 mm" },
      desc: "Soporte con rodamiento del eje del aro, atornillado en la punta de cada A (eje a 935 mm del piso)." },
    { id: "204", cod: "204", nombre: "Carro del foco", grupo: "Mecanismo", material: "Aluminio 6063-T5", perfil: "Caja de chapa", masa: 0.166, cant: 1,
      medidas: { largo: "60 mm", ancho: "60 mm", alto: "60 mm", espesor: "2 mm" }, extra: [["Índice", "raya roja que marca la hora en la escala"], ["Freno", "perilla naranja"]],
      desc: "Corre sobre el aro con 4 rodillos de PLA; su índice rojo marca la hora solar." },
    { id: "117", cod: "117", nombre: "Rodillo del carro (PLA)", grupo: "Mecanismo", material: "PLA impreso 3D", perfil: "Rodillo", masa: 0.005, cant: 4,
      medidas: { diametro: "Ø16 mm", largo: "20 mm" }, desc: "Rodillos del carro que ruedan sobre el tubo del aro." },
    { id: "205", cod: "205", nombre: "Arco de declinación R90", grupo: "Mecanismo", material: "Aluminio 6063-T5", perfil: "Pletina curva", masa: 0.096, cant: 1,
      medidas: { diametro: "R90 mm", ancho: "8 mm", espesor: "4 mm" }, extra: [["Marcas", "21/06 (+23,45°) · equinoccio (0°) · 21/12 (−23,45°)"]],
      desc: "Arco bajo el carro por el que se corre el foco según la fecha (declinación)." },
    { id: "206a", cod: "206a", nombre: "Portafoco", grupo: "Mecanismo", material: "Aluminio 6063-T5", perfil: "Brazo", masa: 0.018, cant: 1,
      medidas: { largo: "70 mm", diametro: "Ø12 mm" }, desc: "Sujeta el foco al arco de declinación." },
    { id: "206b", cod: "206b", nombre: "Foco LED", grupo: "Mecanismo", material: "Aluminio 6063-T5", perfil: "Foco reflector", masa: 0.332, cant: 1,
      medidas: { diametro: "Ø60 mm", largo: "70 mm" }, desc: "El «Sol» del heliodón; se enciende con el relé (D4)." },
    { id: "207a", cod: "207a", nombre: "Graduador de latitud (placa)", grupo: "Mecanismo", material: A36, perfil: "Chapa semicircular", masa: 0.446, cant: 1,
      medidas: { diametro: "R130 mm", espesor: "5 mm" }, extra: [["Escala", "90° N – 0° – 90° S, marcas cada 1°"], ["Lado", "por fuera de la A Este"]],
      desc: "Placa fija por fuera de la A Este: indica la inclinación del aro = |φ − δ| redondeado a 1°." },
    { id: "207b", cod: "207b", nombre: "Brazo del graduador", grupo: "Mecanismo", material: A36, perfil: "Pletina", masa: 0.152, cant: 1,
      medidas: { largo: "140 mm", ancho: "20 mm", espesor: "6 mm" }, desc: "Gira con el eje Este y apunta a la marca del graduador." },
    { id: "207c", cod: "207c", nombre: "Manija en T del graduador", grupo: "Mecanismo", material: "AISI 1020", perfil: "Barra", masa: 0.029, cant: 1,
      medidas: { largo: "45 mm", diametro: "Ø10 mm" }, desc: "Fija el brazo en la marca elegida; se arrastra para inclinar el aro." },
    // ---- Soporte
    { id: "301", cod: "301", nombre: "Plato giratorio Ø180", grupo: "Soporte", material: A36, perfil: "Rodamiento de plato", masa: 2.254, cant: 1,
      medidas: { diametro: "Ø180 mm", alto: "17 mm (y 865–882)" }, desc: "Rodamiento sobre el tubo superior que deja girar la mesa." },
    { id: "302", cod: "302", nombre: "Mesa giratoria Ø700", grupo: "Soporte", material: "MDF 18 mm", perfil: "Disco", masa: 5.193, cant: 1,
      medidas: { diametro: "Ø700 mm", espesor: "18 mm (cara a 900 mm del piso)" }, extra: [["Grabado", "rosa de los vientos (N, E, S, O) y grados"]],
      desc: "Mesa redonda donde va la maqueta; gira ±180°." },
    { id: "303", cod: "303", nombre: "Maqueta de casa (5 cuartos)", grupo: "Soporte", material: "MDF 18 mm", perfil: "Maqueta", masa: 0.718, cant: 1,
      medidas: { largo: "300 mm", ancho: "220 mm", alto: "84 mm" }, extra: [["Cuartos", "1, 2 y 3 al Norte · 4 y 5 al Sur"]],
      desc: "Casa a escala con 5 cuartos; se centra con un pin en la mesa." },
    { id: "107a", cod: "107a", nombre: "Placa de montaje de la rueda", grupo: "Soporte", material: ZINC, perfil: "Placa", masa: 0.434, cant: 4,
      medidas: { largo: "100 mm", ancho: "70 mm", espesor: "8 mm" }, desc: "Placa giratoria de cada rueda, atornillada a la placa 112." },
    { id: "107b", cod: "107b", nombre: "Horquilla de rueda con freno", grupo: "Soporte", material: ZINC, perfil: "Horquilla", masa: 0.355, cant: 2,
      medidas: { largo: "60 mm", ancho: "44 mm", alto: "82 mm" }, desc: "Horquilla de las 2 ruedas con freno (lado Sur)." },
    { id: "107e", cod: "107e", nombre: "Horquilla de rueda sin freno", grupo: "Soporte", material: ZINC, perfil: "Horquilla", masa: 0.338, cant: 2,
      medidas: { largo: "60 mm", ancho: "44 mm", alto: "82 mm" }, desc: "Horquilla de las 2 ruedas libres (lado Norte)." },
    { id: "107c", cod: "107c", nombre: "Llanta Ø100", grupo: "Soporte", material: "Poliuretano", perfil: "Rueda", masa: 0.303, cant: 4,
      medidas: { diametro: "Ø100 mm", ancho: "32 mm" }, desc: "Rueda de poliuretano; gira sobre el eje de la horquilla." },
    { id: "107d", cod: "107d", nombre: "Palanca de freno", grupo: "Soporte", material: ZINC, perfil: "Palanca", masa: 0.023, cant: 2,
      medidas: { largo: "30 mm", ancho: "20 mm", espesor: "6 mm" }, desc: "Palanca roja del freno de rueda." },
    // ---- Electrónica
    { id: "305", cod: "305", nombre: "Caja del Arduino", grupo: "Electrónica", material: "ABS", perfil: "Caja", masa: 0.372, cant: 1,
      medidas: { largo: "200 mm (N-S)", alto: "140 mm", ancho: "140 mm (E-O)", espesor: "3 mm" },
      extra: [["Ubicación", "travesaño de la A Este (x 420–560, y 310–450), 2 pernos M6"]], desc: "Caja con el Arduino, el relé, la bornera y el portafusible." },
    { id: "305b", cod: "305b", nombre: "Tapa de la caja", grupo: "Electrónica", material: "ABS", perfil: "Tapa", masa: 0.101, cant: 1,
      medidas: { largo: "200 mm", alto: "140 mm", espesor: "3 mm" }, desc: "Tapa frontal (mira al centro del heliodón) con el LED indicador." },
    { id: "306", cod: "306", nombre: "Arduino UNO R3", grupo: "Electrónica", material: "FR-4 placa de circuito", perfil: "Placa", masa: 0.022, cant: 1,
      medidas: { largo: "68,6 mm", ancho: "53,4 mm", espesor: "1,6 mm" }, desc: "Lee los sensores y prende el foco; USB a 9600 baudios." },
    { id: "rele", cod: "N° 4", nombre: "Módulo de relé 1 canal 5 V", grupo: "Electrónica", material: "FR-4 + relé", perfil: "Módulo", masa: null, cant: 1,
      medidas: { largo: "50 mm", ancho: "26 mm", alto: "18 mm" }, desc: "Activo en bajo: D4 en LOW prende el foco de 220 V." },
    { id: "309", cod: "309", nombre: "Multiplexor TCA9548A", grupo: "Electrónica", material: "FR-4 placa de circuito", perfil: "Módulo", masa: 0.003, cant: 1,
      medidas: { largo: "32 mm", ancho: "21 mm" }, desc: "Reparte el I2C a los 5 sensores de luz BH1750." },
    { id: "borneraBus", cod: "Bornera", nombre: "Bornera del bus 1-Wire (3 vías)", grupo: "Electrónica", material: "Poliamida + latón", perfil: "Bornera 5 mm", masa: null, cant: 1,
      medidas: { largo: "15 mm", ancho: "10 mm", alto: "12 mm" }, desc: "Une los 3 hilos de los DS18B20 (VDD, DQ, GND) con el Arduino." },
    { id: "bornera220", cod: "Bornera", nombre: "Bornera de 220 V (4 vías)", grupo: "Electrónica", material: "Poliamida + latón", perfil: "Bornera", masa: null, cant: 1,
      medidas: { largo: "45 mm", ancho: "12 mm", alto: "14 mm" }, desc: "Fase y neutro de la red y del foco." },
    { id: "res47k", cod: "R1", nombre: "Resistencia 4,7 kΩ (pull-up)", grupo: "Electrónica", material: "Película de carbón", perfil: "1/4 W", masa: null, cant: 1,
      medidas: { largo: "6,3 mm", diametro: "Ø2,5 mm" }, desc: "Pull-up del bus 1-Wire entre DQ (D2) y 5 V." },
    { id: "res220", cod: "R2", nombre: "Resistencia 220 Ω (LED)", grupo: "Electrónica", material: "Película de carbón", perfil: "1/4 W", masa: null, cant: 1,
      medidas: { largo: "6,3 mm", diametro: "Ø2,5 mm" }, desc: "Limita la corriente del LED indicador (D8)." },
    { id: "led", cod: "LED", nombre: "LED indicador del foco", grupo: "Electrónica", material: "Epoxi", perfil: "LED 5 mm ámbar", masa: null, cant: 1,
      medidas: { diametro: "Ø5 mm", largo: "8,6 mm" }, desc: "Se enciende junto con el foco (D8)." },
    { id: "portafusible", cod: "F1", nombre: "Portafusible con fusible 2 A", grupo: "Electrónica", material: "Baquelita", perfil: "Portafusible 5 × 20", masa: null, cant: 1,
      medidas: { largo: "40 mm", diametro: "Ø12 mm" }, desc: "Protege la línea de 220 V del foco." },
    { id: "entrada", cod: "122", nombre: "Entrada de cables (pasacables)", grupo: "Electrónica", material: "Goma", perfil: "Pasacables Ø14 × Ø20 × 3", masa: null, cant: 6,
      medidas: { diametro: "Ø14 / Ø20 mm", espesor: "3 mm" }, desc: "Pasacables de goma en los agujeros de los tubos y de la caja por donde entran los cables." },
    { id: "304_1", cod: "304", nombre: "Sensor de temperatura DS18B20", grupo: "Electrónica", material: "ABS", perfil: "Sonda", masa: 0.002, cant: 5,
      medidas: { diametro: "Ø6 mm", alto: "50 mm" }, desc: "Uno por cuarto, todos en el bus 1-Wire (D2)." },
    { id: "307_1", cod: "307", nombre: "Sensor de luz BH1750", grupo: "Electrónica", material: "ABS", perfil: "Módulo GY-302", masa: 0.009, cant: 5,
      medidas: { largo: "19 mm", ancho: "14 mm" }, desc: "Uno sobre cada cuarto, por canal del TCA9548A." },
    // ---- Tornillería
    { id: "108", cod: "108", nombre: "Perno hexagonal M8 × 20", grupo: "Tornillería", material: ZINC, perfil: "M8", masa: 0.014, cant: 16,
      medidas: { diametro: "M8", largo: "20 mm" }, desc: "4 por rueda: placa de la rueda a la placa 112." },
    { id: "110", cod: "110", nombre: "Tuerca hexagonal M8", grupo: "Tornillería", material: ZINC, perfil: "M8", masa: 0.005, cant: 16,
      medidas: { diametro: "M8", alto: "6,5 mm" }, desc: "Tuercas de los pernos de las ruedas." },
    { id: "118", cod: "118", nombre: "Perno hexagonal M10 × 40", grupo: "Tornillería", material: ZINC, perfil: "M10", masa: 0.036, cant: 4,
      medidas: { diametro: "M10", largo: "40 mm" }, desc: "2 por chumacera, a la placa de la punta." },
    { id: "119", cod: "119", nombre: "Tuerca hexagonal M10", grupo: "Tornillería", material: ZINC, perfil: "M10", masa: 0.009, cant: 4,
      medidas: { diametro: "M10", alto: "8 mm" }, desc: "Tuercas de las chumaceras." },
    { id: "120", cod: "120", nombre: "Perno hexagonal M6 × 50", grupo: "Tornillería", material: ZINC, perfil: "M6", masa: 0.014, cant: 2,
      medidas: { diametro: "M6", largo: "50 mm" }, desc: "Sujetan la caja del Arduino al travesaño de la A Este." },
    { id: "121", cod: "121", nombre: "Tuerca hexagonal M6", grupo: "Tornillería", material: ZINC, perfil: "M6", masa: 0.002, cant: 2,
      medidas: { diametro: "M6", alto: "5 mm" }, desc: "Tuercas de la caja del Arduino." },
  ];
  H.pieza = (id) => H.PIEZAS.find((p) => p.id === id) || null;

  // ------------------------------------------------------------------ catálogo de cables (los recorridos están en electronica.js)
  const CU = "Cobre electrolítico", CUE = "Cobre estañado", PVC = "PVC";
  H.CABLES = {
    "313": { nombre: "Cable de los sensores DS18B20", tipo: "sensores", clase: "Multipolar apantallado 3 hilos", hilos: 3, awg: "24 AWG", diam: "Ø5 mm",
      conductor: CUE, aislante: PVC, color: "Azul", desde: "Maqueta (5 DS18B20, por el pin)", hasta: "Bornera del bus 1-Wire en la caja (D2)",
      sw: "1,92 m en SolidWorks (con 20 % de reserva: 2,31 m)", recorrido: "maqueta → plato → tubo superior → pata NORTE → travesaño → caja por debajo" },
    "308d": { nombre: "Cable de los sensores de luz BH1750", tipo: "bh1750", clase: "Multipolar 12 hilos", hilos: 12, awg: "26 AWG", diam: "Ø6 mm",
      conductor: CUE, aislante: PVC, color: "Azul oscuro", desde: "Conector JST del pin de la maqueta", hasta: "Multiplexor TCA9548A en la caja",
      recorrido: "maqueta → plato → tubo superior → pata NORTE → travesaño → caja por debajo" },
    "314": { nombre: "Cable del foco (tramo fijo)", tipo: "foco", clase: "Cable vulcanizado 2 × 16 AWG", hilos: 2, awg: "16 AWG (1,3 mm²)", diam: "Ø7 mm",
      conductor: CU, aislante: "PVC vulcanizado", color: "Rojo", desde: "Lazo junto al eje Este del aro", hasta: "Bornera de 220 V (F foco / N foco)",
      sw: "206c + 314: 2,04 m en SolidWorks (con 20 %: 2,45 m)", recorrido: "eje Este → pata SUR → travesaño → caja" },
    "206c": { nombre: "Cable del foco (tramo del aro)", tipo: "foco", clase: "Cable flexible 2 × 16 AWG en espiral protector Ø12", hilos: 2, awg: "16 AWG (1,3 mm²)", diam: "Ø7 mm (espiral Ø12)",
      conductor: CU, aislante: "PVC + espiral gris", color: "Rojo", desde: "Foco (portafoco del carro)", hasta: "Lazo junto al eje Este",
      recorrido: "foco → carro → por el costado del aro en espiral → eje Este (cambia con la hora)" },
    "315": { nombre: "Cable de alimentación 220 V", tipo: "v220", clase: "Cable vulcanizado 2 × 16 AWG con enchufe", hilos: 2, awg: "16 AWG (1,3 mm²)", diam: "Ø7 mm",
      conductor: CU, aislante: "PVC vulcanizado", color: "Negro", desde: "Tomacorriente (enchufe)", hasta: "Bornera de 220 V (F red / N red)",
      sw: "1,18 m en SolidWorks (con 20 %: 1,42 m)", recorrido: "caja → travesaño → pata SUR → sale 11 cm sobre la base junto a la rueda → piso" },
    "311": { nombre: "Cable USB A–B", tipo: "usb", clase: "USB 2.0 A–B", hilos: 4, awg: "28 AWG datos / 24 AWG alimentación", diam: "Ø5 mm",
      conductor: CUE, aislante: PVC, color: "Gris", desde: "USB-B del Arduino", hasta: "Laptop (Simulador Solar, 9600 baudios)",
      recorrido: "Arduino → piso de la caja → baja al piso → laptop" },
    cablesDS: { nombre: "Sondas de los 5 DS18B20 (en la maqueta)", tipo: "sensores", clase: "Cable de sonda 3 hilos", hilos: 3, awg: "28 AWG", diam: "Ø4 mm",
      conductor: CUE, aislante: PVC, color: "Negro (rojo VDD, amarillo DQ, negro GND)", desde: "Sonda de cada cuarto", hasta: "Pin central de la maqueta → cable 313",
      recorrido: "cuarto → piso de la maqueta → pin central" },
    "308c": { nombre: "Ramales de los BH1750 (en la maqueta)", tipo: "bh1750", clase: "Cable plano 4 hilos", hilos: 4, awg: "28 AWG", diam: "Ø3 mm",
      conductor: CUE, aislante: PVC, color: "Azul", desde: "BH1750 de cada cuarto", hasta: "Conector JST del pin → cable 308d",
      recorrido: "puente del sensor → muro central → canal bajo el piso → pin" },
  };
  // cables Dupont y de 220 V dentro de la caja: [id, nombre, desde, hasta, color, tipo, nombre del color]
  const DUP = { clase: "Cable Dupont", hilos: 1, awg: "22 AWG", diam: "Ø1,6 mm", conductor: CUE, aislante: PVC };
  const C220 = { clase: "Cable flexible 1 mm²", hilos: 1, awg: "18 AWG (1 mm²)", diam: "Ø2,8 mm", conductor: CU, aislante: "PVC 600 V" };
  H.CABLES_CAJA = [
    ["w_rele_in", "Señal del relé (D4)", "Arduino D4", "Relé IN (activo en bajo)", 0xff9500, "Naranja", DUP],
    ["w_rele_vcc", "+5 V del relé", "Arduino 5V", "Relé VCC", 0xff3b30, "Rojo", DUP],
    ["w_rele_gnd", "GND del relé", "Arduino GND", "Relé GND", 0x1c1c1e, "Negro", DUP],
    ["w_led", "LED indicador (D8)", "Arduino D8", "Resistencia 220 Ω → ánodo del LED", 0xffcc00, "Amarillo", DUP],
    ["w_led_gnd", "GND del LED", "Cátodo del LED", "Arduino GND", 0x3a3a3c, "Negro", DUP],
    ["w_bus_dq", "Bus 1-Wire DQ (D2)", "Arduino D2", "Bornera del bus: DQ (con pull-up 4,7 kΩ)", 0x5ac8fa, "Celeste", DUP],
    ["w_bus_vdd", "+5 V del bus 1-Wire", "Arduino 5V", "Bornera del bus: VDD", 0xff3b30, "Rojo", DUP],
    ["w_bus_gnd", "GND del bus 1-Wire", "Arduino GND", "Bornera del bus: GND", 0x1c1c1e, "Negro", DUP],
    ["w_tca_sda", "I2C SDA (A4)", "Arduino A4", "TCA9548A SDA", 0x34c759, "Verde", DUP],
    ["w_tca_scl", "I2C SCL (A5)", "Arduino A5", "TCA9548A SCL", 0xf2f2f7, "Blanco", DUP],
    ["w_tca_vin", "+5 V del TCA9548A", "Arduino 5V", "TCA9548A VIN", 0xff3b30, "Rojo", DUP],
    ["w_tca_gnd", "GND del TCA9548A", "Arduino GND", "TCA9548A GND", 0x1c1c1e, "Negro", DUP],
    ["w220_fase", "Fase de la red → portafusible", "Bornera 220 V: F red", "Portafusible (fusible 2 A)", 0x8b5a2b, "Marrón", C220],
    ["w220_com", "Portafusible → COM del relé", "Portafusible", "Relé COM", 0x8b5a2b, "Marrón", C220],
    ["w220_no", "NO del relé → foco", "Relé NO", "Bornera 220 V: F foco", 0x8b5a2b, "Marrón", C220],
    ["w220_n", "Puente de neutro", "Bornera 220 V: N red", "Bornera 220 V: N foco", 0x007aff, "Azul", C220],
  ];
  H.CABLES_CAJA.forEach(([id, nombre, desde, hasta, col, colNom, base]) => {
    H.CABLES[id] = Object.assign({ nombre, desde, hasta, color: colNom, colorHex: col, tipo: base === C220 ? "interno220" : "dupont",
      recorrido: "dentro de la caja del Arduino" }, base);
  });

  // ------------------------------------------------------------------ componentes de la caja: qué hacen y a qué pin van
  H.ARDUINO = {
    "306": { etq: "Arduino UNO", hace: "Cerebro del heliodón: recibe las órdenes de la PC por USB (PING, R1, OFF, T, ESTADO), prende el foco y lee los 5 DS18B20.",
      pin: "D4 → relé · D8 → LED · D2 → bus 1-Wire · A4/A5 → TCA9548A · USB 9600 baudios" },
    rele: { etq: "Relé", hace: "Conecta la fase de 220 V al foco. Es activo en bajo: con D4 en LOW el foco se enciende.", pin: "IN → D4 · VCC → 5V · GND → GND · COM/NO en la línea del foco" },
    borneraBus: { etq: "Bornera 1-Wire", hace: "Une los 3 hilos de los 5 DS18B20 (en paralelo) con el Arduino.", pin: "DQ → D2 (pull-up 4,7 kΩ a 5V) · VDD → 5V · GND → GND" },
    bornera220: { etq: "Bornera 220 V", hace: "Reparte la fase y el neutro de la red y del foco.", pin: "F red → portafusible · N red ↔ N foco · F foco ← NO del relé" },
    res47k: { etq: "4,7 kΩ", hace: "Resistencia pull-up obligatoria del bus 1-Wire: mantiene DQ en alto.", pin: "Entre D2 (DQ) y 5V" },
    res220: { etq: "220 Ω", hace: "Limita la corriente del LED indicador a ~13 mA.", pin: "D8 → 220 Ω → ánodo del LED" },
    led: { etq: "LED", hace: "Indicador: se enciende cuando el foco está encendido.", pin: "Ánodo ← 220 Ω ← D8 · cátodo → GND" },
    portafusible: { etq: "Portafusible", hace: "Fusible de 2 A en la fase: protege el cable y el relé.", pin: "Fase de la red → fusible → COM del relé" },
    entrada: { etq: "Entrada de cables", hace: "Pasacables de goma por donde entran a la caja los cables de sensores (por abajo), foco y 220 V (por el travesaño) y el USB.", pin: "Sensores por la pata Norte · foco y 220 V por la pata Sur" },
    "309": { etq: "TCA9548A", hace: "Multiplexor I2C: un canal para cada sensor de luz BH1750 (todos tienen la misma dirección 0x23).", pin: "SDA → A4 · SCL → A5 · VIN → 5V · GND → GND" },
  };
})();
