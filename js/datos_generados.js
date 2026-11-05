// Generado por herramientas/generar_datos.py (no editar a mano)
window.DATOS_BOM = [
 {
  "n": 1,
  "cat": "Electrónica",
  "nombre": "Arduino UNO R3",
  "esp": "ATmega328P, 5 V, 16 MHz, USB tipo B (clon con CH340 sirve)",
  "cant": 1,
  "uni": "u",
  "uso": "Controla el relé, el LED y lee los 5 sensores; se conecta por USB a la PC (9600 baudios)"
 },
 {
  "n": 2,
  "cat": "Electrónica",
  "nombre": "Cable USB A–B",
  "esp": "USB 2.0 A macho – B macho, 1,8 m",
  "cant": 1,
  "uni": "u",
  "uso": "Une la PC con el USB-B de panel del montante Norte del caballete Oeste (datos y alimentación de 5 V)"
 },
 {
  "n": 3,
  "cat": "Electrónica",
  "nombre": "Extensión USB B de panel",
  "esp": "USB-B hembra de panel redonda (rosca Ø 16 mm, con tuerca) – USB-B macho, 2.5 m",
  "cant": 1,
  "uni": "u",
  "uso": "Va por dentro de los tubos: del Arduino sube al techo de la caja, sigue por el tubo 105 y el caballete Oeste y deja el USB-B en el montante Norte, a 23 cm del piso (pieza 311 de SolidWorks)"
 },
 {
  "n": 4,
  "cat": "Electrónica",
  "nombre": "Módulo de relé 1 canal 5 V",
  "esp": "Bobina 5 V, contacto 10 A / 250 V CA, ACTIVO EN BAJO, con optoacoplador y LED",
  "cant": 1,
  "uni": "u",
  "uso": "Prende y apaga el foco de 220 V desde el pin D4"
 },
 {
  "n": 5,
  "cat": "Electrónica",
  "nombre": "Sensor DS18B20 sumergible",
  "esp": "Sonda de acero inox. con cable de 1 m, 3 hilos (rojo VDD, amarillo DQ, negro GND), −55 a 125 °C",
  "cant": 5,
  "uni": "u",
  "uso": "Un sensor por cuarto de la maqueta (1-2-3 Norte, 4-5 Sur), bus 1-Wire en D2"
 },
 {
  "n": 6,
  "cat": "Electrónica",
  "nombre": "Resistencia 4,7 kΩ",
  "esp": "1/4 W, 5 %, carbón (paquete de 10)",
  "cant": 1,
  "uni": "paq",
  "uso": "Pull-up del bus 1-Wire entre D2 y 5 V (se usa 1)"
 },
 {
  "n": 7,
  "cat": "Electrónica",
  "nombre": "Resistencia 220 Ω",
  "esp": "1/4 W, 5 % (paquete de 10)",
  "cant": 1,
  "uni": "paq",
  "uso": "Limita la corriente del LED indicador en D8 (se usa 1)"
 },
 {
  "n": 8,
  "cat": "Electrónica",
  "nombre": "Resistencia 1 kΩ",
  "esp": "1/4 W, 5 % (paquete de 10)",
  "cant": 1,
  "uni": "paq",
  "uso": "LED de encendido (opcional, desde 5 V, no usa pin)"
 },
 {
  "n": 9,
  "cat": "Electrónica",
  "nombre": "LED 5 mm ámbar con portaled de panel",
  "esp": "LED 5 mm difuso ámbar/amarillo + portaled cromado de 5 mm",
  "cant": 1,
  "uni": "u",
  "uso": "Indicador «foco encendido» en la puerta frontal de la caja (pin D8)"
 },
 {
  "n": 10,
  "cat": "Electrónica",
  "nombre": "LED 5 mm verde con portaled de panel",
  "esp": "LED 5 mm difuso verde + portaled cromado de 5 mm",
  "cant": 1,
  "uni": "u",
  "uso": "Indicador «Arduino con energía» (opcional, 5 V con 1 kΩ)"
 },
 {
  "n": 11,
  "cat": "Electrónica",
  "nombre": "Placa perforada",
  "esp": "Fibra de vidrio, una cara, paso 2,54 mm, 5 × 7 cm",
  "cant": 2,
  "uni": "u",
  "uso": "1: placa del circuito (resistencias, borneras) · 2: empalme de los 5 sensores bajo la maqueta"
 },
 {
  "n": 12,
  "cat": "Electrónica",
  "nombre": "Protoboard 400 puntos",
  "esp": "Media protoboard, con adhesivo",
  "cant": 1,
  "uni": "u",
  "uso": "Para probar el circuito antes de soldarlo"
 },
 {
  "n": 13,
  "cat": "Electrónica",
  "nombre": "Tira de pines macho",
  "esp": "1 × 40, paso 2,54 mm",
  "cant": 2,
  "uni": "u",
  "uso": "Conectar la placa perforada con cables Dupont"
 },
 {
  "n": 14,
  "cat": "Electrónica",
  "nombre": "Bornera de 2 vías (KF301-2P)",
  "esp": "Paso 5,08 mm, para placa, 300 V / 16 A",
  "cant": 4,
  "uni": "u",
  "uso": "Entradas de 5 V / GND en la placa"
 },
 {
  "n": 15,
  "cat": "Electrónica",
  "nombre": "Bornera de 3 vías (KF301-3P)",
  "esp": "Paso 5,08 mm, para placa",
  "cant": 7,
  "uni": "u",
  "uso": "Bus de sensores (VDD-DQ-GND): 1 en la placa del Arduino, 5 en el empalme y 1 de llegada del cable"
 },
 {
  "n": 16,
  "cat": "Electrónica",
  "nombre": "Cables Dupont macho–macho",
  "esp": "20 cm, paquete de 40",
  "cant": 1,
  "uni": "paq",
  "uso": "Pruebas en protoboard y uniones al Arduino"
 },
 {
  "n": 17,
  "cat": "Electrónica",
  "nombre": "Cables Dupont macho–hembra",
  "esp": "20 cm, paquete de 40",
  "cant": 1,
  "uni": "paq",
  "uso": "Arduino ↔ módulo de relé y placa"
 },
 {
  "n": 18,
  "cat": "Electrónica",
  "nombre": "Cables Dupont hembra–hembra",
  "esp": "20 cm, paquete de 40",
  "cant": 1,
  "uni": "paq",
  "uso": "Pines de la placa ↔ módulo de relé"
 },
 {
  "n": 19,
  "cat": "Electrónica",
  "nombre": "Cable sólido para protoboard",
  "esp": "22 AWG, 3 colores (rojo, negro, amarillo), rollo de 5 m c/u",
  "cant": 1,
  "uni": "kit",
  "uso": "Puentes soldados en la placa perforada"
 },
 {
  "n": 20,
  "cat": "Eléctrico 220 V",
  "nombre": "Foco reflector halógeno",
  "esp": "PAR30 E27, 75–100 W, 220 V, luz cálida (también sirve incandescente reflector R80 100 W)",
  "cant": 1,
  "uni": "u",
  "uso": "Hace de Sol: da luz y calor dirigidos a la maqueta"
 },
 {
  "n": 21,
  "cat": "Eléctrico 220 V",
  "nombre": "Portafoco de cerámica E27",
  "esp": "Cerámica (resiste el calor), con pestañas para tornillo",
  "cant": 1,
  "uni": "u",
  "uso": "Sujeta el foco en el carro del aro"
 },
 {
  "n": 22,
  "cat": "Eléctrico 220 V",
  "nombre": "Cable vulcanizado 2 × 1,0 mm²",
  "esp": "Flexible, 300/500 V. Foco: 3.5 m + alimentación: 3.5 m",
  "cant": 7,
  "uni": "m",
  "uso": "Cable del foco (por el aro y el caballete) y cable de alimentación"
 },
 {
  "n": 23,
  "cat": "Eléctrico 220 V",
  "nombre": "Enchufe macho 2 patas",
  "esp": "10 A / 250 V, con prensacable",
  "cant": 1,
  "uni": "u",
  "uso": "Conexión al tomacorriente"
 },
 {
  "n": 24,
  "cat": "Eléctrico 220 V",
  "nombre": "Interruptor general basculante con luz",
  "esp": "KCD3 de panel, 2 posiciones, 250 V / 10 A",
  "cant": 1,
  "uni": "u",
  "uso": "Corta la fase de 220 V de todo el equipo"
 },
 {
  "n": 25,
  "cat": "Eléctrico 220 V",
  "nombre": "Portafusible de panel",
  "esp": "Para fusible 5 × 20 mm, 250 V / 10 A",
  "cant": 1,
  "uni": "u",
  "uso": "Protección del circuito del foco"
 },
 {
  "n": 26,
  "cat": "Eléctrico 220 V",
  "nombre": "Fusible 5 × 20 mm 2 A lento",
  "esp": "Vidrio, acción lenta, 250 V (paquete de 5; 1 en uso + 4 repuestos)",
  "cant": 1,
  "uni": "paq",
  "uso": "Protege si el foco o el cable hacen cortocircuito (100 W ≈ 0,45 A)"
 },
 {
  "n": 27,
  "cat": "Eléctrico 220 V",
  "nombre": "Bornera de potencia 4 vías",
  "esp": "Regleta/bornera de tornillo 10 A, para riel o atornillar",
  "cant": 1,
  "uni": "u",
  "uso": "Empalmes de fase y neutro dentro de la caja"
 },
 {
  "n": 28,
  "cat": "Eléctrico 220 V",
  "nombre": "Terminales tipo pin/puntera",
  "esp": "Para cable 1 mm² (paquete de 20)",
  "cant": 1,
  "uni": "paq",
  "uso": "Terminar los cables de 220 V en borneras y relé (sin hilos sueltos)"
 },
 {
  "n": 29,
  "cat": "Cableado",
  "nombre": "Cable de 4 hilos 22 AWG (alarma)",
  "esp": "Multifilar, con chaqueta. Tramo del bus de sensores: 1.5 m (usar 3 hilos, 1 de reserva)",
  "cant": 1.5,
  "uni": "m",
  "uso": "Lleva VDD-DQ-GND desde la caja colgada, por el tubo 105, hasta el empalme bajo la mesa (pieza 312 de SolidWorks)"
 },
 {
  "n": 30,
  "cat": "Cableado",
  "nombre": "Termocontraíble surtido",
  "esp": "Kit de 2 a 10 mm, varios colores",
  "cant": 1,
  "uni": "kit",
  "uso": "Aislar empalmes y soldaduras"
 },
 {
  "n": 31,
  "cat": "Cableado",
  "nombre": "Cinta aislante",
  "esp": "PVC 19 mm × 10 m, negra",
  "cant": 2,
  "uni": "u",
  "uso": "Aislamiento y marcado de cables"
 },
 {
  "n": 32,
  "cat": "Cableado",
  "nombre": "Amarras plásticas 10 cm",
  "esp": "Nylon negro, paquete de 100",
  "cant": 1,
  "uni": "paq",
  "uso": "Ordenar cables dentro de la caja"
 },
 {
  "n": 33,
  "cat": "Cableado",
  "nombre": "Amarras plásticas 20 cm",
  "esp": "Nylon negro, paquete de 100",
  "cant": 1,
  "uni": "paq",
  "uso": "Sujetar cables a los tubos y al aro"
 },
 {
  "n": 34,
  "cat": "Cableado",
  "nombre": "Cubrecable en espiral 10 mm",
  "esp": "Espiral plástica, 2 m",
  "cant": 1,
  "uni": "u",
  "uso": "Cable del foco que baja por el aro hasta el eje Este"
 },
 {
  "n": 35,
  "cat": "Cableado",
  "nombre": "Pasacables de goma (ojal)",
  "esp": "Para agujero de 8 mm (paquete de 10)",
  "cant": 3,
  "uni": "paq",
  "uso": "Protegen el cable donde entra y sale de los tubos y del techo de la caja (23 pasos: 10 en el tubo 105, 5 en el caballete Este, 3 en el Oeste y 5 en la caja)"
 },
 {
  "n": 36,
  "cat": "Cableado",
  "nombre": "Etiquetas para cables",
  "esp": "Numeradas o en blanco, paquete",
  "cant": 1,
  "uni": "paq",
  "uso": "Marcar S1…S5, foco y 220 V"
 },
 {
  "n": 37,
  "cat": "Caja",
  "nombre": "Caja plástica para el Arduino",
  "esp": "ABS/PVC aprox. 200 × 140 × 140 mm, techo cerrado y frente abierto con puerta (diseño del heliodón, piezas 305 y 305b)",
  "cant": 1,
  "uni": "u",
  "uso": "Guarda el Arduino, el relé, la placa y la parte de 220 V; cuelga bajo el tubo 105 (el que sostiene la mesa), junto al pin central; los cables entran por el techo desde el tubo"
 },
 {
  "n": 38,
  "cat": "Caja",
  "nombre": "Abrazadera en U para tubo 25 × 25",
  "esp": "Fleje de acero galvanizado 20 × 3 mm doblado en U, con alas de 27 mm y 2 agujeros de 3,5 mm (pieza 305c de SolidWorks)",
  "cant": 2,
  "uni": "u",
  "uso": "Cuelgan la caja del tubo 105: abrazan el tubo y sus alas se atornillan al techo de la caja"
 },
 {
  "n": 39,
  "cat": "Caja",
  "nombre": "Prensaestopas PG9",
  "esp": "Nylon, para cable de 4–8 mm (agujero 15,5 mm)",
  "cant": 2,
  "uni": "u",
  "uso": "1 en el montante Sur del caballete Este, a 30 cm del piso: salida del cable de alimentación (+1 de reserva)"
 },
 {
  "n": 40,
  "cat": "Caja",
  "nombre": "Separadores hexagonales M3",
  "esp": "Latón o nylon, 10 mm, hembra–hembra (paquete de 10)",
  "cant": 1,
  "uni": "paq",
  "uso": "Levantan el Arduino, el relé y la placa del fondo de la caja"
 },
 {
  "n": 41,
  "cat": "Caja",
  "nombre": "Tornillos M3 × 8 mm con tuercas",
  "esp": "Cabeza Phillips, con arandelas (paquete de 20)",
  "cant": 1,
  "uni": "paq",
  "uso": "Fijar placas a los separadores"
 },
 {
  "n": 42,
  "cat": "Caja",
  "nombre": "Tornillos autorroscantes",
  "esp": "3,5 × 16 mm (paquete de 10)",
  "cant": 1,
  "uni": "paq",
  "uso": "Fijar las alas de las 2 abrazaderas al techo de la caja (4)"
 },
 {
  "n": 43,
  "cat": "Caja",
  "nombre": "Caja de empalme pequeña",
  "esp": "PVC aprox. 80 × 80 × 40 mm con tapa",
  "cant": 1,
  "uni": "u",
  "uso": "Protege la placa de empalme de los 5 sensores bajo la maqueta"
 },
 {
  "n": 44,
  "cat": "Repuestos",
  "nombre": "Sensor DS18B20 sumergible (repuesto)",
  "esp": "Igual al del ítem de sensores",
  "cant": 1,
  "uni": "u",
  "uso": "Por si uno se daña o da ERR"
 },
 {
  "n": 45,
  "cat": "Repuestos",
  "nombre": "Módulo de relé 1 canal 5 V (repuesto)",
  "esp": "Igual al del ítem de relé",
  "cant": 1,
  "uni": "u",
  "uso": "Los contactos se gastan con el uso"
 },
 {
  "n": 46,
  "cat": "Repuestos",
  "nombre": "Foco reflector (repuesto)",
  "esp": "Igual al del ítem del foco",
  "cant": 1,
  "uni": "u",
  "uso": "Se quema con el uso"
 },
 {
  "n": 47,
  "cat": "Repuestos",
  "nombre": "LED 5 mm surtidos",
  "esp": "Rojo, verde, ámbar (paquete de 10)",
  "cant": 1,
  "uni": "paq",
  "uso": "Repuesto de indicadores"
 },
 {
  "n": 48,
  "cat": "Repuestos",
  "nombre": "Borneras KF301 surtidas",
  "esp": "2 y 3 vías (5 de cada una)",
  "cant": 1,
  "uni": "kit",
  "uso": "Repuesto"
 },
 {
  "n": 49,
  "cat": "Sensor de luz",
  "nombre": "Sensor de luz BH1750 (módulo GY-302)",
  "esp": "I2C, 1–65 535 lx, 3–5 V, regulador y pull-up de SDA/SCL incluidos, 19 × 14 mm; ADDR a GND (0x23 en los 5: los separa el TCA9548A)",
  "cant": 5,
  "uni": "u",
  "uso": "Uno sobre el techo de cada cuarto. Cuarto 1 → canal 0 (SD0/SC0), cuarto 2 → canal 1, cuarto 3 → canal 2, cuarto 4 → canal 3, cuarto 5 → canal 4; VCC → 5V y GND comunes"
 },
 {
  "n": 50,
  "cat": "Sensor de luz",
  "nombre": "Cable multipolar 12 hilos 24 AWG (sensores de luz)",
  "esp": "Con chaqueta y malla, Ø ≈ 5 mm, 1 m: VCC, GND y SDA/SCL de los 5 canales (10 hilos)",
  "cant": 1,
  "uni": "m",
  "uso": "Del conector JST del encaje de la mesa al TCA9548A: baja por el plato al tubo 105 y sale por debajo del tubo directo al techo de la caja colgada (junto al pin)"
 },
 {
  "n": 51,
  "cat": "Sensor de luz",
  "nombre": "Conector JST-XH 12 pines (macho + hembra)",
  "esp": "Paso 2,5 mm, con cables pre-crimpados (par). Pines: 1 VCC, 2 GND, 3-4 SD0/SC0, 5-6 SD1/SC1, 7-8 SD2/SC2, 9-10 SD3/SC3, 11-12 SD4/SC4",
  "cant": 1,
  "uni": "par",
  "uso": "Va en el pin central de la maqueta: se desconecta al sacarla de la mesa"
 },
 {
  "n": 52,
  "cat": "Sensor de luz",
  "nombre": "Puente soporte del BH1750 sobre el techo",
  "esp": "ABS 15 × 110 × 5 mm con canal interior para el cable (impreso 3D), piezas 307_1 a 307_5 de SolidWorks",
  "cant": 5,
  "uni": "u",
  "uso": "Apoyado en el muro exterior y el muro central de cada cuarto; sostiene el sensor mirando hacia arriba"
 },
 {
  "n": 53,
  "cat": "Sensor de luz",
  "nombre": "Tornillos M3 × 12 mm con tuerca",
  "esp": "Cabeza Phillips (paquete de 10)",
  "cant": 1,
  "uni": "paq",
  "uso": "1 por módulo para fijarlo a su puente (5)"
 },
 {
  "n": 54,
  "cat": "Sensor de luz",
  "nombre": "Sensor de luz BH1750 (repuesto)",
  "esp": "Igual al del ítem del sensor de luz",
  "cant": 1,
  "uni": "u",
  "uso": "Por si se daña al sacar y poner la maqueta"
 },
 {
  "n": 55,
  "cat": "Sensor de luz",
  "nombre": "Multiplexor I2C TCA9548A (módulo)",
  "esp": "8 canales, 1,65–5,5 V, 32 × 21 mm, dirección 0x70 (A0, A1 y A2 a GND), con tiras de pines",
  "cant": 1,
  "uni": "u",
  "uso": "En la caja del Arduino: SDA → A4, SCL → A5, VIN → 5V, GND → GND; canales 0-4 → BH1750 de los cuartos 1-5 (los 5 sensores tienen la misma dirección 0x23)"
 },
 {
  "n": 56,
  "cat": "Sensor de luz",
  "nombre": "Cable plano 4 hilos 28 AWG (ramales de los sensores)",
  "esp": "Flexible, Ø ≈ 2 mm: VCC, GND, SDA, SCL. 2 m para los 5 ramales",
  "cant": 2,
  "uni": "m",
  "uso": "De cada BH1750 al centro de la maqueta: dentro de su puente, del muro central y del canal bajo el piso; los 5 ramales se unen al multipolar en el conector JST"
 },
 {
  "n": 57,
  "cat": "Sensor de luz",
  "nombre": "Separadores M2 × 5 mm con tornillos",
  "esp": "Nylon (kit de 4)",
  "cant": 1,
  "uni": "kit",
  "uso": "Fijar el TCA9548A al fondo de la caja del Arduino"
 },
 {
  "n": 58,
  "cat": "Caja",
  "nombre": "Bisagra pequeña de latón 25 × 40 mm con tornillos",
  "esp": "Con pasador de 3 mm y tornillos M2,5",
  "cant": 2,
  "uni": "u",
  "uso": "Puerta frontal de la caja (la de los 3 LED): bisagra vertical en el lado Oeste, abre 85° hacia adelante"
 },
 {
  "n": 59,
  "cat": "Caja",
  "nombre": "Cierre magnético pequeño",
  "esp": "Imán con placa metálica y tornillos",
  "cant": 1,
  "uni": "u",
  "uso": "Mantiene cerrada la puerta frontal"
 },
 {
  "n": 60,
  "cat": "Electrónica",
  "nombre": "Conector Dupont de 4 pines para la puerta",
  "esp": "Carcasa 1 × 4 hembra + macho, paso 2,54 mm, con terminales",
  "cant": 1,
  "uni": "par",
  "uso": "Desconecta los LED de la puerta; sus cables llevan un bucle de holgura de unos 18 cm para abrirla sin tirar"
 }
];
window.DATOS_CONEXIONES = [
 {
  "comp": "TCA9548A",
  "terminal": "VIN",
  "va": "Arduino 5V",
  "nota": "alimentación del multiplexor"
 },
 {
  "comp": "TCA9548A",
  "terminal": "GND",
  "va": "Arduino GND",
  "nota": "tierra común"
 },
 {
  "comp": "TCA9548A",
  "terminal": "SDA",
  "va": "Arduino A4",
  "nota": "I2C del Arduino (datos)"
 },
 {
  "comp": "TCA9548A",
  "terminal": "SCL",
  "va": "Arduino A5",
  "nota": "I2C del Arduino (reloj, 50 kHz)"
 },
 {
  "comp": "TCA9548A",
  "terminal": "A0, A1, A2",
  "va": "GND",
  "nota": "dirección 0x70"
 },
 {
  "comp": "BH1750 cuarto 1",
  "terminal": "SDA / SCL",
  "va": "TCA9548A SD0 / SC0 (canal 0)",
  "nota": "Norte, Oeste · conector JST pines 3-4"
 },
 {
  "comp": "BH1750 cuarto 2",
  "terminal": "SDA / SCL",
  "va": "TCA9548A SD1 / SC1 (canal 1)",
  "nota": "Norte, centro · conector JST pines 5-6"
 },
 {
  "comp": "BH1750 cuarto 3",
  "terminal": "SDA / SCL",
  "va": "TCA9548A SD2 / SC2 (canal 2)",
  "nota": "Norte, Este · conector JST pines 7-8"
 },
 {
  "comp": "BH1750 cuarto 4",
  "terminal": "SDA / SCL",
  "va": "TCA9548A SD3 / SC3 (canal 3)",
  "nota": "Sur, Oeste · conector JST pines 9-10"
 },
 {
  "comp": "BH1750 cuarto 5",
  "terminal": "SDA / SCL",
  "va": "TCA9548A SD4 / SC4 (canal 4)",
  "nota": "Sur, Este · conector JST pines 11-12"
 },
 {
  "comp": "BH1750 (los 5)",
  "terminal": "VCC",
  "va": "Arduino 5V",
  "nota": "conector JST pin 1"
 },
 {
  "comp": "BH1750 (los 5)",
  "terminal": "GND y ADDR",
  "va": "Arduino GND",
  "nota": "ADDR a GND → dirección 0x23; conector JST pin 2"
 },
 {
  "comp": "DS18B20 (los 5)",
  "terminal": "DQ",
  "va": "Arduino D2",
  "nota": "bus 1-Wire con pull-up de 4,7 kΩ a 5V"
 },
 {
  "comp": "Módulo de relé",
  "terminal": "IN",
  "va": "Arduino D4",
  "nota": "activo en bajo (LOW = foco encendido)"
 },
 {
  "comp": "LED ámbar",
  "terminal": "ánodo (+)",
  "va": "Arduino D8 con 220 Ω",
  "nota": "foco encendido"
 }
];
window.DATOS_SOLIDWORKS = [
 {
  "codigo": "101",
  "archivo": "101_Base_Rectangular",
  "carpeta": "100_estructura",
  "desc": "Base rectangular 1200 x 950: 2 largueros 1200 + 2 cabezales, tubo 25x25x2, soldada sobre las 4 placas adaptadoras de las ruedas (112)"
 },
 {
  "codigo": "102",
  "archivo": "102_Caballete_Este",
  "carpeta": "100_estructura",
  "desc": "Caballete Este: tubo 25x25x2; 2 montantes a ±420, travesaño superior (apoyado y soldado sobre el tubo 105) y travesaño medio a 520 (parte del marco cuadrado), sin diagonales"
 },
 {
  "codigo": "103",
  "archivo": "103_Caballete_Oeste",
  "carpeta": "100_estructura",
  "desc": "Caballete Oeste: tubo 25x25x2; 2 montantes a ±420, travesaño superior (apoyado y soldado sobre el tubo 105) y travesaño medio a 520 (parte del marco cuadrado), sin diagonales"
 },
 {
  "codigo": "105",
  "archivo": "105_Tubo_Unico_Este_Oeste",
  "carpeta": "100_estructura",
  "desc": "Tubo único Este-Oeste 25x25x2 x 1200: une los caballetes (bajo sus travesaños superiores), sostiene el plato de la mesa y de él cuelga la caja del Arduino; los cables van por dentro"
 },
 {
  "codigo": "106",
  "archivo": "106_Travesano_Caja_Arduino",
  "carpeta": "100_estructura",
  "desc": "Travesaño central de la base 25x25x2 (une los largueros en el centro)"
 },
 {
  "codigo": "107a",
  "archivo": "107a_Rueda_Placa_Montaje",
  "carpeta": "100_estructura",
  "desc": "Rueda giratoria D100: placa de montaje 100x70x4 y pivote"
 },
 {
  "codigo": "107b",
  "archivo": "107b_Rueda_Horquilla_Freno",
  "carpeta": "100_estructura",
  "desc": "Rueda giratoria D100: horquilla con eje D12 y pedal de freno (rojo)"
 },
 {
  "codigo": "107c",
  "archivo": "107c_Rueda_Llanta_D100",
  "carpeta": "100_estructura",
  "desc": "Rueda giratoria D100: llanta D100 x 32 de poliuretano"
 },
 {
  "codigo": "107d",
  "archivo": "107d_Rueda_Palanca_Freno",
  "carpeta": "100_estructura",
  "desc": "Palanca del freno de la rueda (antes lengüeta de 107b). Gira 0° libre - 20° frenado"
 },
 {
  "codigo": "108",
  "archivo": "108_Perno_Hex_M8x20",
  "carpeta": "100_estructura",
  "desc": "Perno hexagonal M8 x 20 (cabeza 13 mm)"
 },
 {
  "codigo": "109",
  "archivo": "109_Perno_Hex_M8x60",
  "carpeta": "100_estructura",
  "desc": "Perno hexagonal M8 x 60 (cabeza 13 mm)"
 },
 {
  "codigo": "110",
  "archivo": "110_Tuerca_Hex_M8",
  "carpeta": "100_estructura",
  "desc": "Tuerca hexagonal M8"
 },
 {
  "codigo": "111",
  "archivo": "111_Marco_Medio_Norte_Sur",
  "carpeta": "100_estructura",
  "desc": "Marco medio: 2 tubos 25x25x2 x 1150 a 520 del piso (cara Norte y cara Sur), soldados a los montantes; con los travesaños medios de los caballetes forman un marco cuadrado cerrado"
 },
 {
  "codigo": "112",
  "archivo": "112_Placas_Adaptadoras_Ruedas",
  "carpeta": "100_estructura",
  "desc": "4 placas adaptadoras de acero 135 x 90 x 4, soldadas bajo las esquinas de la base (largueros y cabezales 25x25); cada una lleva los 4 agujeros D9 (76 x 18) de la placa de la rueda giratoria"
 },
 {
  "codigo": "201",
  "archivo": "201_Medio_Aro_Horas_R480",
  "carpeta": "200_mecanismo",
  "desc": "Medio aro de horas R480, fleje de aluminio 30x5, escala 6-18 h (15°/h, 0° = 12:00, mañana al Este)"
 },
 {
  "codigo": "202",
  "archivo": "202_Eje_Aro_D18",
  "carpeta": "200_mecanismo",
  "desc": "Eje del aro D18 x 162 (Este y Oeste)"
 },
 {
  "codigo": "203",
  "archivo": "203_Chumacera_D18",
  "carpeta": "200_mecanismo",
  "desc": "Chumacera de pie para eje D18 sobre un suplemento de 15 mm (base 30 x 100 x 23), centrada a 584 mm del centro para que los pernos M8 entren por el medio del travesaño superior 25x25"
 },
 {
  "codigo": "204",
  "archivo": "204_Carro_Foco",
  "carpeta": "200_mecanismo",
  "desc": "Carro del foco: 2 placas, 4 rodillos D14 sobre los cantos del fleje y perilla de freno (naranja)"
 },
 {
  "codigo": "205",
  "archivo": "205_Arco_Declinacion_R90",
  "carpeta": "200_mecanismo",
  "desc": "Arco de declinación r = 90 con ranura y marcas 21/06, equinoccio, 21/12 (±23,45°)"
 },
 {
  "codigo": "206a",
  "archivo": "206a_Portafoco",
  "carpeta": "200_mecanismo",
  "desc": "Portafoco: brazo que gira en el arco de declinación, pasador y perilla de fijación"
 },
 {
  "codigo": "206b",
  "archivo": "206b_Foco_LED",
  "carpeta": "200_mecanismo",
  "desc": "Foco LED (un solo foco) D50 x 60 con lente, apunta al centro de la mesa"
 },
 {
  "codigo": "206c",
  "archivo": "206c_Cable_Espiral",
  "carpeta": "200_mecanismo",
  "desc": "Cable del foco liso D6, por detrás del aro hasta el eje Este"
 },
 {
  "codigo": "207a",
  "archivo": "207a_Graduador_Latitud_Placa",
  "carpeta": "200_mecanismo",
  "desc": "Graduador de latitud: placa semicircular R130, 90° N - 90° S, agujeros D5 cada 5° (fija al caballete Este)"
 },
 {
  "codigo": "207b",
  "archivo": "207b_Graduador_Brazo",
  "carpeta": "200_mecanismo",
  "desc": "Brazo del graduador, solidario al eje Este del aro"
 },
 {
  "codigo": "207c",
  "archivo": "207c_Graduador_Manija_T",
  "carpeta": "200_mecanismo",
  "desc": "Manija en T con pasador D4,5 que entra en los agujeros del graduador"
 },
 {
  "codigo": "301",
  "archivo": "301_Plato_Giratorio_D180",
  "carpeta": "300_soporte",
  "desc": "Plato giratorio D180 (rodamiento tipo lazy susan) sobre el tubo único"
 },
 {
  "codigo": "302",
  "archivo": "302_Mesa_Giratoria_D700",
  "carpeta": "300_soporte",
  "desc": "Mesa giratoria D640 x 18 MDF con rosa de los vientos (N, E, S, O y grados cada 30°); recortada de D700 para que el arco de declinación pase con el aro a 90° N / 90° S"
 },
 {
  "codigo": "303",
  "archivo": "303_Maqueta_Casa_5_Cuartos",
  "carpeta": "300_soporte",
  "desc": "Maqueta de casa 300x220 sin techo, 5 cuartos (3 al Norte, 2 al Sur), muros de 6 mm y ventanas; pin de centrado Ø16 x 12 hueco, canal bajo el piso y pasos por el muro central para los cables de los 5 BH1750"
 },
 {
  "codigo": "304_1",
  "archivo": "304_Sensor_DS18B20_1",
  "carpeta": "300_soporte",
  "desc": "Sensor de temperatura DS18B20 n.º 1 (cuarto 1) con banderita numerada"
 },
 {
  "codigo": "304_2",
  "archivo": "304_Sensor_DS18B20_2",
  "carpeta": "300_soporte",
  "desc": "Sensor de temperatura DS18B20 n.º 2 (cuarto 2) con banderita numerada"
 },
 {
  "codigo": "304_3",
  "archivo": "304_Sensor_DS18B20_3",
  "carpeta": "300_soporte",
  "desc": "Sensor de temperatura DS18B20 n.º 3 (cuarto 3) con banderita numerada"
 },
 {
  "codigo": "304_4",
  "archivo": "304_Sensor_DS18B20_4",
  "carpeta": "300_soporte",
  "desc": "Sensor de temperatura DS18B20 n.º 4 (cuarto 4) con banderita numerada"
 },
 {
  "codigo": "304_5",
  "archivo": "304_Sensor_DS18B20_5",
  "carpeta": "300_soporte",
  "desc": "Sensor de temperatura DS18B20 n.º 5 (cuarto 5) con banderita numerada"
 },
 {
  "codigo": "305",
  "archivo": "305_Caja_Arduino",
  "carpeta": "300_soporte",
  "desc": "Caja del Arduino 200x140x140 (ABS) colgada 3 mm bajo el tubo 105 (25x25) junto al pin central: techo cerrado, frente abierto con puerta 305b en bisagra vertical al Oeste; cables por el techo desde el tubo"
 },
 {
  "codigo": "305b",
  "archivo": "305b_Caja_Arduino_Puerta_Frontal",
  "carpeta": "300_soporte",
  "desc": "Puerta frontal de la caja del Arduino (ABS 200x140x3): 3 LED (verde energía, ámbar foco D8, rojo reserva) en portaleds, perilla, bisagra vertical al Oeste (abre 0-85° hacia adelante); los cables de los LED llevan un bucle de holgura de ~180 mm y un conector de 4 pines"
 },
 {
  "codigo": "305c",
  "archivo": "305c_Abrazaderas_Caja_Tubo_105",
  "carpeta": "300_soporte",
  "desc": "2 abrazaderas en U de fleje de acero galvanizado 20x3 alrededor del tubo 105 (25x25), con alas atornilladas al techo de la caja (tornillos autorroscantes 3,5x16): la caja cuelga a 3 mm bajo el tubo"
 },
 {
  "codigo": "314",
  "archivo": "306_Arduino_UNO_R3",
  "carpeta": "300_soporte",
  "desc": "Arduino UNO R3 (copia del heliodón grande) dentro de la caja 305"
 },
 {
  "codigo": "1",
  "archivo": "307_Sensor_Luz_BH1750_1",
  "carpeta": "300_soporte",
  "desc": "Sensor de luz BH1750 n.º 1 (cuarto 1, Norte): módulo GY-302 mirando hacia arriba sobre un puente de ABS apoyado en el techo (muro exterior y muro central); canal TCA9548A 0"
 },
 {
  "codigo": "2",
  "archivo": "307_Sensor_Luz_BH1750_2",
  "carpeta": "300_soporte",
  "desc": "Sensor de luz BH1750 n.º 2 (cuarto 2, Norte): módulo GY-302 mirando hacia arriba sobre un puente de ABS apoyado en el techo (muro exterior y muro central); canal TCA9548A 1"
 },
 {
  "codigo": "3",
  "archivo": "307_Sensor_Luz_BH1750_3",
  "carpeta": "300_soporte",
  "desc": "Sensor de luz BH1750 n.º 3 (cuarto 3, Norte): módulo GY-302 mirando hacia arriba sobre un puente de ABS apoyado en el techo (muro exterior y muro central); canal TCA9548A 2"
 },
 {
  "codigo": "4",
  "archivo": "307_Sensor_Luz_BH1750_4",
  "carpeta": "300_soporte",
  "desc": "Sensor de luz BH1750 n.º 4 (cuarto 4, Sur): módulo GY-302 mirando hacia arriba sobre un puente de ABS apoyado en el techo (muro exterior y muro central); canal TCA9548A 3"
 },
 {
  "codigo": "5",
  "archivo": "307_Sensor_Luz_BH1750_5",
  "carpeta": "300_soporte",
  "desc": "Sensor de luz BH1750 n.º 5 (cuarto 5, Sur): módulo GY-302 mirando hacia arriba sobre un puente de ABS apoyado en el techo (muro exterior y muro central); canal TCA9548A 4"
 },
 {
  "codigo": "308c",
  "archivo": "308c_Cables_BH1750_Maqueta",
  "carpeta": "300_soporte",
  "desc": "Cables de los 5 BH1750 en la maqueta: ramales de 4 hilos Ø2 por dentro de los puentes y del muro central, canal bajo el piso y tronco de 12 hilos por el pin hueco; conector JST 12 pines macho"
 },
 {
  "codigo": "308d",
  "archivo": "308d_Cable_Multipolar_BH1750_Caja",
  "carpeta": "300_soporte",
  "desc": "Cable multipolar de 12 hilos Ø5 de los 5 BH1750: conector hembra en el encaje de la mesa, baja por el plato al tubo 105, sale por debajo del tubo directo al techo de la caja colgada y llega al TCA9548A (0.32 m)"
 },
 {
  "codigo": "309",
  "archivo": "309_Multiplexor_TCA9548A",
  "carpeta": "300_soporte",
  "desc": "Multiplexor I2C TCA9548A (módulo 32 x 21 mm, dirección 0x70) sobre separadores en la caja del Arduino: SDA -> A4, SCL -> A5, VIN -> 5V, GND; canales 0-4 = BH1750 de los cuartos 1-5"
 },
 {
  "codigo": "310",
  "archivo": "310_Cables_220V_Foco_Alimentacion",
  "carpeta": "300_soporte",
  "desc": "Cables de 220 V (vulcanizado 2x1 mm², Ø6): FOCO desde el eje Este del aro, por el travesaño superior del caballete Este y el tubo 105 hasta la caja (0.75 m); ALIMENTACIÓN desde la caja por el tubo 105, el travesaño Este y el montante Sur, sale por un prensaestopas PG9 a 300 mm del piso (1.47 m)"
 },
 {
  "codigo": "311",
  "archivo": "311_Cable_USB_Caja_Panel",
  "carpeta": "300_soporte",
  "desc": "Cable USB A-B (extensión USB-B de panel): del Arduino sube al techo de la caja, va por el tubo 105 al caballete Oeste, baja por el montante Norte y termina en un USB-B de panel a 230 mm del piso (2.08 m); ahí se enchufa el cable a la PC"
 },
 {
  "codigo": "312",
  "archivo": "312_Cable_Bus_DS18B20_Caja",
  "carpeta": "300_soporte",
  "desc": "Bus 1-Wire de los 5 DS18B20 (cable de 4 hilos 22 AWG, Ø4): de la caja de empalme bajo la mesa entra por el costado del tubo 105, baja al techo de la caja colgada y llega a la placa perforada (D2) (0.33 m)"
 }
];
window.DATOS_ENSAMBLE = {"componentes": [{"nombre": "100_estructura-1/111_Marco_Medio_Norte_Sur-1", "archivo": "111_Marco_Medio_Norte_Sur", "caja": [-575.0, 507.5, -432.5, 575.0, 532.5, 432.5], "pos": [0.0, 0.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/112_Placas_Adaptadoras_Ruedas-1", "archivo": "112_Placas_Adaptadoras_Ruedas", "caja": [-600.0, 140.0, -475.0, 600.0, 144.0, 475.0], "pos": [0.0, 0.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/108_Perno_Hex_M8x20-12", "archivo": "108_Perno_Hex_M8x20", "caja": [-494.5, 130.7, -445.5, -479.5, 156.0, -432.5], "pos": [-487.0, 136.0, -439.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/108_Perno_Hex_M8x20-16", "archivo": "108_Perno_Hex_M8x20", "caja": [-570.5, 130.7, 414.5, -555.5, 156.0, 427.5], "pos": [-563.0, 136.0, 421.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-16", "archivo": "110_Tuerca_Hex_M8", "caja": [-570.5, 144.0, -445.5, -555.5, 150.5, -432.5], "pos": [-563.0, 144.0, -439.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-13", "archivo": "110_Tuerca_Hex_M8", "caja": [-494.5, 144.0, -427.5, -479.5, 150.5, -414.5], "pos": [-487.0, 144.0, -421.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-17", "archivo": "110_Tuerca_Hex_M8", "caja": [576.5, 858.5, -44.5, 591.5, 865.0, -31.5], "pos": [584.0, 865.0, -38.0], "rot": [1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-15", "archivo": "110_Tuerca_Hex_M8", "caja": [479.5, 144.0, 414.5, 494.5, 150.5, 427.5], "pos": [487.0, 144.0, 421.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/108_Perno_Hex_M8x20-15", "archivo": "108_Perno_Hex_M8x20", "caja": [479.5, 130.7, -445.5, 494.5, 156.0, -432.5], "pos": [487.0, 136.0, -439.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/108_Perno_Hex_M8x20-13", "archivo": "108_Perno_Hex_M8x20", "caja": [479.5, 130.7, 414.5, 494.5, 156.0, 427.5], "pos": [487.0, 136.0, 421.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/109_Perno_Hex_M8x60-3", "archivo": "109_Perno_Hex_M8x60", "caja": [576.5, 853.0, -44.5, 591.5, 918.3, -31.5], "pos": [584.0, 913.0, -38.0], "rot": [1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "100_estructura-1/108_Perno_Hex_M8x20-14", "archivo": "108_Perno_Hex_M8x20", "caja": [-570.5, 130.7, -445.5, -555.5, 156.0, -432.5], "pos": [-563.0, 136.0, -439.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-14", "archivo": "110_Tuerca_Hex_M8", "caja": [-494.5, 144.0, -445.5, -479.5, 150.5, -432.5], "pos": [-487.0, 144.0, -439.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-18", "archivo": "110_Tuerca_Hex_M8", "caja": [479.5, 144.0, -445.5, 494.5, 150.5, -432.5], "pos": [487.0, 144.0, -439.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/109_Perno_Hex_M8x60-4", "archivo": "109_Perno_Hex_M8x60", "caja": [-591.5, 853.0, -44.5, -576.5, 918.3, -31.5], "pos": [-584.0, 913.0, -38.0], "rot": [1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "100_estructura-1/103_Caballete_Oeste-1", "archivo": "103_Caballete_Oeste", "caja": [-600.0, 169.0, -432.5, -575.0, 890.0, 432.5], "pos": [0.0, 0.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/107a_Rueda_Placa_Montaje-1", "archivo": "107a_Rueda_Placa_Montaje", "caja": [-575.0, 126.0, 395.0, -475.0, 140.0, 465.0], "pos": [-525.0, 0.0, 430.0], "rot": [-1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-20", "archivo": "110_Tuerca_Hex_M8", "caja": [-591.5, 858.5, -44.5, -576.5, 865.0, -31.5], "pos": [-584.0, 865.0, -38.0], "rot": [1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "100_estructura-1/107a_Rueda_Placa_Montaje-3", "archivo": "107a_Rueda_Placa_Montaje", "caja": [475.0, 126.0, -465.0, 575.0, 140.0, -395.0], "pos": [525.0, 0.0, -430.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/105_Tubo_Unico_Este_Oeste-1", "archivo": "105_Tubo_Unico_Este_Oeste", "caja": [-600.0, 840.0, -12.5, 600.0, 865.0, 12.5], "pos": [0.0, 0.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/107b_Rueda_Horquilla_Freno-4", "archivo": "107b_Rueda_Horquilla_Freno", "caja": [-556.0, 40.0, -452.0, -475.0, 126.0, -408.0], "pos": [-525.0, 0.0, -430.0], "rot": [-1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "100_estructura-1/107a_Rueda_Placa_Montaje-2", "archivo": "107a_Rueda_Placa_Montaje", "caja": [475.0, 126.0, 395.0, 575.0, 140.0, 465.0], "pos": [525.0, 0.0, 430.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/107a_Rueda_Placa_Montaje-4", "archivo": "107a_Rueda_Placa_Montaje", "caja": [-575.0, 126.0, -465.0, -475.0, 140.0, -395.0], "pos": [-525.0, 0.0, -430.0], "rot": [-1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-19", "archivo": "110_Tuerca_Hex_M8", "caja": [-570.5, 144.0, 414.5, -555.5, 150.5, 427.5], "pos": [-563.0, 144.0, 421.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/101_Base_Rectangular-1", "archivo": "101_Base_Rectangular", "caja": [-600.0, 144.0, -475.0, 600.0, 169.0, 475.0], "pos": [0.0, 0.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/102_Caballete_Este-1", "archivo": "102_Caballete_Este", "caja": [575.0, 169.0, -432.5, 600.0, 890.0, 432.5], "pos": [0.0, 0.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/106_Travesano_Caja_Arduino-1", "archivo": "106_Travesano_Caja_Arduino", "caja": [-12.5, 144.0, -450.0, 12.5, 169.0, 450.0], "pos": [0.0, 0.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/107b_Rueda_Horquilla_Freno-2", "archivo": "107b_Rueda_Horquilla_Freno", "caja": [475.0, 40.0, 408.0, 556.0, 126.0, 452.0], "pos": [525.0, 0.0, 430.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/107b_Rueda_Horquilla_Freno-1", "archivo": "107b_Rueda_Horquilla_Freno", "caja": [-556.0, 40.0, 408.0, -475.0, 126.0, 452.0], "pos": [-525.0, 0.0, 430.0], "rot": [-1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "100_estructura-1/107b_Rueda_Horquilla_Freno-3", "archivo": "107b_Rueda_Horquilla_Freno", "caja": [475.0, 40.0, -452.0, 556.0, 126.0, -408.0], "pos": [525.0, 0.0, -430.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-1", "archivo": "110_Tuerca_Hex_M8", "caja": [479.5, 144.0, -427.5, 494.5, 150.5, -414.5], "pos": [487.0, 144.0, -421.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-3", "archivo": "110_Tuerca_Hex_M8", "caja": [555.5, 144.0, 432.5, 570.5, 150.5, 445.5], "pos": [563.0, 144.0, 439.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/108_Perno_Hex_M8x20-1", "archivo": "108_Perno_Hex_M8x20", "caja": [479.5, 130.7, -427.5, 494.5, 156.0, -414.5], "pos": [487.0, 136.0, -421.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-6", "archivo": "110_Tuerca_Hex_M8", "caja": [555.5, 144.0, 414.5, 570.5, 150.5, 427.5], "pos": [563.0, 144.0, 421.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/108_Perno_Hex_M8x20-2", "archivo": "108_Perno_Hex_M8x20", "caja": [-494.5, 130.7, 432.5, -479.5, 156.0, 445.5], "pos": [-487.0, 136.0, 439.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-8", "archivo": "110_Tuerca_Hex_M8", "caja": [-570.5, 144.0, 432.5, -555.5, 150.5, 445.5], "pos": [-563.0, 144.0, 439.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-2", "archivo": "110_Tuerca_Hex_M8", "caja": [-494.5, 144.0, 432.5, -479.5, 150.5, 445.5], "pos": [-487.0, 144.0, 439.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-5", "archivo": "110_Tuerca_Hex_M8", "caja": [479.5, 144.0, 432.5, 494.5, 150.5, 445.5], "pos": [487.0, 144.0, 439.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-4", "archivo": "110_Tuerca_Hex_M8", "caja": [555.5, 144.0, -427.5, 570.5, 150.5, -414.5], "pos": [563.0, 144.0, -421.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/108_Perno_Hex_M8x20-3", "archivo": "108_Perno_Hex_M8x20", "caja": [555.5, 130.7, 432.5, 570.5, 156.0, 445.5], "pos": [563.0, 136.0, 439.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/108_Perno_Hex_M8x20-5", "archivo": "108_Perno_Hex_M8x20", "caja": [479.5, 130.7, 432.5, 494.5, 156.0, 445.5], "pos": [487.0, 136.0, 439.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/108_Perno_Hex_M8x20-6", "archivo": "108_Perno_Hex_M8x20", "caja": [555.5, 130.7, 414.5, 570.5, 156.0, 427.5], "pos": [563.0, 136.0, 421.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-7", "archivo": "110_Tuerca_Hex_M8", "caja": [555.5, 144.0, -445.5, 570.5, 150.5, -432.5], "pos": [563.0, 144.0, -439.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/108_Perno_Hex_M8x20-4", "archivo": "108_Perno_Hex_M8x20", "caja": [555.5, 130.7, -427.5, 570.5, 156.0, -414.5], "pos": [563.0, 136.0, -421.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/108_Perno_Hex_M8x20-7", "archivo": "108_Perno_Hex_M8x20", "caja": [555.5, 130.7, -445.5, 570.5, 156.0, -432.5], "pos": [563.0, 136.0, -439.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/108_Perno_Hex_M8x20-8", "archivo": "108_Perno_Hex_M8x20", "caja": [-570.5, 130.7, 432.5, -555.5, 156.0, 445.5], "pos": [-563.0, 136.0, 439.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-9", "archivo": "110_Tuerca_Hex_M8", "caja": [-494.5, 144.0, 414.5, -479.5, 150.5, 427.5], "pos": [-487.0, 144.0, 421.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-10", "archivo": "110_Tuerca_Hex_M8", "caja": [-570.5, 144.0, -427.5, -555.5, 150.5, -414.5], "pos": [-563.0, 144.0, -421.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-11", "archivo": "110_Tuerca_Hex_M8", "caja": [576.5, 858.5, 31.5, 591.5, 865.0, 44.5], "pos": [584.0, 865.0, 38.0], "rot": [1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "100_estructura-1/109_Perno_Hex_M8x60-1", "archivo": "109_Perno_Hex_M8x60", "caja": [576.5, 853.0, 31.5, 591.5, 918.3, 44.5], "pos": [584.0, 913.0, 38.0], "rot": [1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "100_estructura-1/108_Perno_Hex_M8x20-9", "archivo": "108_Perno_Hex_M8x20", "caja": [-494.5, 130.7, 414.5, -479.5, 156.0, 427.5], "pos": [-487.0, 136.0, 421.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/108_Perno_Hex_M8x20-10", "archivo": "108_Perno_Hex_M8x20", "caja": [-570.5, 130.7, -427.5, -555.5, 156.0, -414.5], "pos": [-563.0, 136.0, -421.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/108_Perno_Hex_M8x20-11", "archivo": "108_Perno_Hex_M8x20", "caja": [-494.5, 130.7, -427.5, -479.5, 156.0, -414.5], "pos": [-487.0, 136.0, -421.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "100_estructura-1/110_Tuerca_Hex_M8-12", "archivo": "110_Tuerca_Hex_M8", "caja": [-591.5, 858.5, 31.5, -576.5, 865.0, 44.5], "pos": [-584.0, 865.0, 38.0], "rot": [1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "100_estructura-1/109_Perno_Hex_M8x60-2", "archivo": "109_Perno_Hex_M8x60", "caja": [-591.5, 853.0, 31.5, -576.5, 918.3, 44.5], "pos": [-584.0, 913.0, 38.0], "rot": [1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "107c_Rueda_Llanta_D100-3", "archivo": "107c_Rueda_Llanta_D100", "caja": [-540.0, 0.0, 414.0, -440.0, 100.0, 446.0], "pos": [-525.0, 0.0, 430.0], "rot": [-1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "mov_aro-1/207c_Graduador_Manija_T-1", "archivo": "207c_Graduador_Manija_T", "caja": [605.5, 813.4, 1.3, 641.0, 830.8, 42.4], "pos": [-0.0, 935.0, -0.0], "rot": [1.0, 0.0, 0.0, 0.0, 0.981766, -0.190091, 0.0, 0.190091, 0.981766]}, {"nombre": "mov_aro-1/207b_Graduador_Brazo-1", "archivo": "207b_Graduador_Brazo", "caja": [606.0, 784.9, -17.6, 614.0, 952.6, 43.2], "pos": [-0.0, 935.0, -0.0], "rot": [1.0, 0.0, 0.0, 0.0, 0.981766, -0.190091, 0.0, 0.190091, 0.981766]}, {"nombre": "mov_aro-1/201_Medio_Aro_Horas_R480-1", "archivo": "201_Medio_Aro_Horas_R480", "caja": [-495.0, 917.4, -108.8, 495.0, 1423.8, 17.6], "pos": [-0.0, 935.0, -0.0], "rot": [1.0, 0.0, 0.0, 0.0, 0.981766, -0.190091, 0.0, 0.190091, 0.981766]}, {"nombre": "mov_aro-1/206c_Cable_Espiral-1", "archivo": "206c_Cable_Espiral", "caja": [306.6, 980.7, -87.0, 480.4, 1296.2, -20.3], "pos": [-0.0, 935.0, -0.0], "rot": [1.0, 0.0, 0.0, 0.0, 0.981766, -0.190091, 0.0, 0.190091, 0.981766]}, {"nombre": "mov_aro-1/202_Eje_Aro_D18-1", "archivo": "202_Eje_Aro_D18", "caja": [470.0, 924.5, -10.5, 632.0, 945.5, 10.5], "pos": [-0.0, 935.0, -0.0], "rot": [1.0, 0.0, 0.0, 0.0, 0.981766, -0.190091, 0.0, 0.190091, 0.981766]}, {"nombre": "mov_aro-1/202_Eje_Aro_D18-2", "archivo": "202_Eje_Aro_D18", "caja": [-632.0, 924.5, -10.5, -470.0, 945.5, 10.5], "pos": [-0.0, 935.0, -0.0], "rot": [-1.0, 0.0, 0.0, 0.0, 0.981766, -0.190091, 0.0, -0.190091, -0.981766]}, {"nombre": "200_mecanismo-1/207a_Graduador_Latitud_Placa-1", "archivo": "207a_Graduador_Latitud_Placa", "caja": [600.0, 805.0, -130.0, 605.0, 947.0, 130.0], "pos": [0.0, 935.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "200_mecanismo-1/203_Chumacera_D18-1", "archivo": "203_Chumacera_D18", "caja": [569.0, 890.0, -50.0, 599.0, 955.0, 50.0], "pos": [0.0, 935.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "200_mecanismo-1/203_Chumacera_D18-2", "archivo": "203_Chumacera_D18", "caja": [-599.0, 890.0, -50.0, -569.0, 955.0, 50.0], "pos": [0.0, 935.0, 0.0], "rot": [-1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "mov_foco-1/206b_Foco_LED-1", "archivo": "206b_Foco_LED", "caja": [161.8, 1094.8, -71.8, 242.3, 1183.6, -7.3], "pos": [-0.0, 935.0, -0.0], "rot": [0.717272, -0.684088, 0.132454, 0.696793, 0.704194, -0.136347, -0.0, 0.190091, 0.981766]}, {"nombre": "mov_foco-1/206a_Portafoco-1", "archivo": "206a_Portafoco", "caja": [215.8, 1156.2, -67.2, 309.9, 1252.8, -37.2], "pos": [-0.0, 935.0, -0.0], "rot": [0.717272, -0.684088, 0.132454, 0.696793, 0.704194, -0.136347, -0.0, 0.190091, 0.981766]}, {"nombre": "107c_Rueda_Llanta_D100-1", "archivo": "107c_Rueda_Llanta_D100", "caja": [424.9, -15.1, 414.0, 555.1, 115.1, 446.0], "pos": [430.51, 36.34, 430.0], "rot": [-0.375613, -0.926777, 0.0, 0.926777, -0.375613, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "107d_Rueda_Palanca_Freno-1", "archivo": "107d_Rueda_Palanca_Freno", "caja": [556.0, 95.8, 430.0, 580.6, 109.6, 450.0], "pos": [491.3, 16.87, 430.0], "rot": [0.939693, -0.34202, 0.0, 0.34202, 0.939693, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "107d_Rueda_Palanca_Freno-2", "archivo": "107d_Rueda_Palanca_Freno", "caja": [556.0, 104.0, -430.0, 580.0, 110.0, -410.0], "pos": [525.0, 0.0, -430.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "300_soporte-1/308d_Cable_Multipolar_BH1750_Caja-1", "archivo": "308d_Cable_Multipolar_BH1750_Caja", "caja": [-2.8, 710.5, -64.5, 83.5, 888.2, 2.8], "pos": [0.0, 0.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "300_soporte-1/311_Cable_USB_Caja_Panel-1", "archivo": "311_Cable_USB_Caja_Panel", "caja": [-606.0, 219.0, -431.0, 194.5, 879.5, 64.0], "pos": [0.0, 0.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "300_soporte-1/305_Caja_Arduino-1", "archivo": "305_Caja_Arduino", "caja": [17.5, 697.0, -70.0, 225.0, 837.0, 79.5], "pos": [0.0, 0.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "300_soporte-1/309_Multiplexor_TCA9548A-1", "archivo": "309_Multiplexor_TCA9548A", "caja": [65.0, 700.0, -52.0, 145.0, 711.1, -11.0], "pos": [125.0, 517.0, -12.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "300_soporte-1/305c_Abrazaderas_Caja_Tubo_105-1", "archivo": "305c_Abrazaderas_Caja_Tubo_105", "caja": [95.0, 837.0, -42.0, 215.0, 868.1, 42.0], "pos": [0.0, 0.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "300_soporte-1/306_Arduino_UNO_R3-1", "archivo": "306_Arduino_UNO_R3", "caja": [145.0, 700.0, -21.6, 198.3, 712.6, 53.3], "pos": [145.0, 700.0, 47.0], "rot": [0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "300_soporte-1/310_Cables_220V_Foco_Alimentacion-1", "archivo": "310_Cables_220V_Foco_Alimentacion", "caja": [157.0, 290.0, -6.0, 614.0, 955.0, 430.0], "pos": [0.0, 0.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "300_soporte-1/302_Mesa_Giratoria_D700-1", "archivo": "302_Mesa_Giratoria_D700", "caja": [-320.0, 882.0, -320.0, 320.0, 900.0, 320.0], "pos": [0.0, 0.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "300_soporte-1/301_Plato_Giratorio_D180-1", "archivo": "301_Plato_Giratorio_D180", "caja": [-90.0, 865.0, -90.0, 90.0, 882.0, 90.0], "pos": [0.0, 0.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "300_soporte-1/312_Cable_Bus_DS18B20_Caja-1", "archivo": "312_Cable_Bus_DS18B20_Caja", "caja": [38.0, 753.0, -42.0, 42.0, 862.0, 182.0], "pos": [0.0, 0.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "mov_carro-1/205_Arco_Declinacion_R90-1", "archivo": "205_Arco_Declinacion_R90", "caja": [229.9, 1156.5, -116.4, 307.3, 1256.4, 11.3], "pos": [0.0, 935.0, -0.0], "rot": [0.717272, -0.684088, 0.132454, 0.696793, 0.704194, -0.136347, 0.0, 0.190091, 0.981766]}, {"nombre": "mov_carro-1/204_Carro_Foco-1", "archivo": "204_Carro_Foco", "caja": [280.8, 1218.7, -85.2, 396.5, 1335.8, -47.4], "pos": [0.0, 935.0, -0.0], "rot": [0.717272, -0.684088, 0.132454, 0.696793, 0.704194, -0.136347, 0.0, 0.190091, 0.981766]}, {"nombre": "107c_Rueda_Llanta_D100-2", "archivo": "107c_Rueda_Llanta_D100", "caja": [440.0, 0.0, -446.0, 540.0, 100.0, -414.0], "pos": [525.0, 0.0, -430.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "mov_maqueta-1/307_Sensor_Luz_BH1750_5-1", "archivo": "307_Sensor_Luz_BH1750_5", "caja": [-17.2, 984.0, 42.7, 63.9, 995.3, 137.4], "pos": [0.0, 0.0, 0.0], "rot": [0.774843, 0.0, 0.632154, 0.0, 1.0, 0.0, -0.632154, 0.0, 0.774843]}, {"nombre": "mov_maqueta-1/308c_Cables_BH1750_Maqueta-1", "archivo": "308c_Cables_BH1750_Maqueta", "caja": [-108.6, 888.2, -101.0, 108.6, 989.0, 101.0], "pos": [0.0, 0.0, 0.0], "rot": [0.774843, 0.0, 0.632154, 0.0, 1.0, 0.0, -0.632154, 0.0, 0.774843]}, {"nombre": "mov_maqueta-1/304_Sensor_DS18B20_3-1", "archivo": "304_Sensor_DS18B20_3", "caja": [98.2, 904.0, 6.5, 126.3, 956.0, 34.7], "pos": [0.0, 0.0, 0.0], "rot": [0.774843, 0.0, 0.632154, 0.0, 1.0, 0.0, -0.632154, 0.0, 0.774843]}, {"nombre": "mov_maqueta-1/304_Sensor_DS18B20_4-1", "archivo": "304_Sensor_DS18B20_4", "caja": [-107.0, 904.0, -18.9, -78.8, 956.0, 9.3], "pos": [0.0, 0.0, 0.0], "rot": [0.774843, 0.0, 0.632154, 0.0, 1.0, 0.0, -0.632154, 0.0, 0.774843]}, {"nombre": "mov_maqueta-1/307_Sensor_Luz_BH1750_1-1", "archivo": "307_Sensor_Luz_BH1750_1", "caja": [-83.3, 984.0, -153.2, -2.1, 995.3, -58.5], "pos": [0.0, 0.0, 0.0], "rot": [0.774843, 0.0, 0.632154, 0.0, 1.0, 0.0, -0.632154, 0.0, 0.774843]}, {"nombre": "mov_maqueta-1/307_Sensor_Luz_BH1750_3-1", "archivo": "307_Sensor_Luz_BH1750_3", "caja": [71.7, 984.0, -26.8, 152.8, 995.3, 68.0], "pos": [0.0, 0.0, 0.0], "rot": [0.774843, 0.0, 0.632154, 0.0, 1.0, 0.0, -0.632154, 0.0, 0.774843]}, {"nombre": "mov_maqueta-1/307_Sensor_Luz_BH1750_2-1", "archivo": "307_Sensor_Luz_BH1750_2", "caja": [-5.8, 984.0, -90.0, 75.3, 995.3, 4.7], "pos": [0.0, 0.0, 0.0], "rot": [0.774843, 0.0, 0.632154, 0.0, 1.0, 0.0, -0.632154, 0.0, 0.774843]}, {"nombre": "mov_maqueta-1/307_Sensor_Luz_BH1750_4-1", "archivo": "307_Sensor_Luz_BH1750_4", "caja": [-133.5, 984.0, -52.2, -52.3, 995.3, 42.6], "pos": [0.0, 0.0, 0.0], "rot": [0.774843, 0.0, 0.632154, 0.0, 1.0, 0.0, -0.632154, 0.0, 0.774843]}, {"nombre": "mov_maqueta-1/304_Sensor_DS18B20_2-1", "archivo": "304_Sensor_DS18B20_2", "caja": [20.7, 904.0, -56.7, 48.8, 956.0, -28.5], "pos": [0.0, 0.0, 0.0], "rot": [0.774843, 0.0, 0.632154, 0.0, 1.0, 0.0, -0.632154, 0.0, 0.774843]}, {"nombre": "mov_maqueta-1/304_Sensor_DS18B20_5-1", "archivo": "304_Sensor_DS18B20_5", "caja": [9.3, 904.0, 76.0, 37.4, 956.0, 104.1], "pos": [0.0, 0.0, 0.0], "rot": [0.774843, 0.0, 0.632154, 0.0, 1.0, 0.0, -0.632154, 0.0, 0.774843]}, {"nombre": "mov_maqueta-1/303_Maqueta_Casa_5_Cuartos-1", "archivo": "303_Maqueta_Casa_5_Cuartos", "caja": [-185.8, 888.0, -180.1, 185.8, 984.0, 180.1], "pos": [0.0, 0.0, 0.0], "rot": [0.774843, 0.0, 0.632154, 0.0, 1.0, 0.0, -0.632154, 0.0, 0.774843]}, {"nombre": "mov_maqueta-1/304_Sensor_DS18B20_1-1", "archivo": "304_Sensor_DS18B20_1", "caja": [-56.8, 904.0, -119.9, -28.6, 956.0, -91.8], "pos": [0.0, 0.0, 0.0], "rot": [0.774843, 0.0, 0.632154, 0.0, 1.0, 0.0, -0.632154, 0.0, 0.774843]}, {"nombre": "107d_Rueda_Palanca_Freno-4", "archivo": "107d_Rueda_Palanca_Freno", "caja": [-580.0, 104.0, -450.0, -556.0, 110.0, -430.0], "pos": [-525.0, 0.0, -430.0], "rot": [-1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "305b_Caja_Arduino_Puerta_Frontal-1", "archivo": "305b_Caja_Arduino_Puerta_Frontal", "caja": [17.5, 697.0, 60.0, 225.0, 837.0, 85.0], "pos": [0.0, 0.0, 0.0], "rot": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]}, {"nombre": "107c_Rueda_Llanta_D100-4", "archivo": "107c_Rueda_Llanta_D100", "caja": [-558.7, -18.7, -446.0, -421.3, 118.7, -414.0], "pos": [-545.85, 25.39, -430.0], "rot": [-0.855152, 0.518378, 0.0, 0.518378, 0.855152, 0.0, 0.0, 0.0, -1.0]}, {"nombre": "107d_Rueda_Palanca_Freno-3", "archivo": "107d_Rueda_Palanca_Freno", "caja": [-580.0, 104.0, 410.0, -556.0, 110.0, 430.0], "pos": [-525.0, 0.0, 430.0], "rot": [-1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0]}], "masa_kg": 41.21, "diseno": {"cables": {"312": [{"nombre": "bus 1-Wire DS18B20 4 hilos", "radio": 2.0, "puntos": [[40.0, 860.0, 180.0], [40.0, 860.0, 6.0], [40.0, 795.0, 6.0], [40.0, 795.0, -40.0], [40.0, 755.0, -40.0]], "largo_mm": 325.0}], "308d": [{"nombre": "12 hilos BH1750", "radio": 2.5, "puntos": [[0.0, 884.0, 0.0], [0.0, 852.5, 0.0], [55.0, 852.5, 0.0], [55.0, 775.0, 0.0], [55.0, 775.0, -62.0], [81.0, 775.0, -62.0], [81.0, 713.0, -62.0], [81.0, 713.0, -54.0]], "largo_mm": 322.0}], "310": [{"nombre": "foco 2x1 mm2", "radio": 3.0, "puntos": [[545.0, 952.0, 0.0], [545.0, 952.0, 62.0], [594.0, 952.0, 62.0], [594.0, 883.0, 62.0], [594.0, 883.0, -3.0], [581.0, 883.0, -3.0], [581.0, 857.0, -3.0], [160.0, 857.0, -3.0], [160.0, 812.0, -3.0]], "largo_mm": 750.0}, {"nombre": "alimentacion 220 V", "radio": 3.0, "puntos": [[175.0, 815.0, 5.0], [175.0, 848.0, 5.0], [594.0, 848.0, 5.0], [594.0, 872.0, 5.0], [594.0, 872.0, 420.0], [594.0, 300.0, 420.0], [604.0, 300.0, 420.0]], "largo_mm": 1473.0}], "311": [{"nombre": "USB A-B", "radio": 2.0, "puntos": [[189.0, 707.0, 62.0], [189.0, 805.0, 62.0], [189.0, 805.0, -6.0], [140.0, 805.0, -6.0], [140.0, 850.0, -6.0], [-594.0, 850.0, -6.0], [-594.0, 877.5, -6.0], [-594.0, 877.5, -420.0], [-594.0, 230.0, -420.0]], "largo_mm": 2083.0}]}, "caja": {"x": [25.0, 225.0], "y": [697.0, 837.0], "z": [-70.0, 70.0], "pared": 3.0, "bisagra": [21.0, 76.0], "leds": [[65.0, 807.0, 70.0], [80.0, 807.0, 70.0], [95.0, 807.0, 70.0]], "abrazaderas_x": [[95.0, 115.0], [195.0, 215.0]], "desplazamiento_contenido": [125.0, 517.0, -12.0]}, "estructura": {"ancho": 950.0, "largo": 1200.0, "z_largueros": [450.0, 475.0], "z_montantes": [407.5, 432.5], "y_marco_medio": 520.0, "z_ruedas": 430.0, "x_ruedas": 525.0, "tubo": [25.0, 2.0], "x_caballetes": [575.0, 600.0], "y_base": [144.0, 169.0], "y_travesano_sup": [865.0, 890.0], "y_tubo_105": [840.0, 865.0], "x_chumaceras": 584.0, "y_chumacera_base": 890.0, "placas_ruedas_y": [140.0, 144.0]}, "usb_panel": [-600.0, 230.0, -420.0], "prensaestopas_220V": [600.0, 300.0, 420.0], "mesa": {"radio": 320.0, "y": [882.0, 900.0]}, "aro": {"lat_min": -90.0, "lat_max": 90.0}}};
