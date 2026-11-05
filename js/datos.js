/* Datos del heliodón pequeño: cuartos, tipos de cable y acceso a la lista de materiales / piezas de SolidWorks
   (datos_generados.js sale del Excel y de las propiedades de las piezas de SolidWorks). */
(function () {
  const H = (window.H = window.H || {});

  // cuartos: centro (mm, marco de la maqueta), puente del BH1750 (x, lado), muros exteriores (azimut), color
  H.CUARTOS = [
    { n: 1, lado: "Norte", pos: "Noroeste", c: [-98.5, -53.5], bx: -100, s: -1, muros: [0, 270], color: "#0A84FF", canal: 0, jst: "3-4" },
    { n: 2, lado: "Norte", pos: "Norte centro", c: [0, -53.5], bx: 0, s: -1, muros: [0], color: "#FF9F0A", canal: 1, jst: "5-6" },
    { n: 3, lado: "Norte", pos: "Noreste", c: [98.5, -53.5], bx: 100, s: -1, muros: [0, 90], color: "#30D158", canal: 2, jst: "7-8" },
    { n: 4, lado: "Sur", pos: "Suroeste", c: [-73.5, 53.5], bx: -75, s: 1, muros: [180, 270], color: "#FF453A", canal: 3, jst: "9-10" },
    { n: 5, lado: "Sur", pos: "Sureste", c: [73.5, 53.5], bx: 75, s: 1, muros: [180, 90], color: "#BF5AF2", canal: 4, jst: "11-12" },
  ];

  // tipos de cable (color por tipo)
  H.TIPOS = {
    i2c: { nombre: "I2C de los sensores de luz (SDA/SCL)", color: 0x5e5ce6 },
    multipolar: { nombre: "Cable multipolar 12 hilos (5 BH1750)", color: 0x3a3a8c },
    onewire: { nombre: "Bus 1-Wire de los DS18B20", color: 0xffd60a },
    v5: { nombre: "+5 V", color: 0xff453a },
    gnd: { nombre: "GND (tierra)", color: 0x2c2c2e },
    senal: { nombre: "Señal D4 → relé", color: 0x64d2ff },
    led: { nombre: "Señal D8 → LED", color: 0xff9f0a },
    v220: { nombre: "220 V (fase y neutro)", color: 0xa2845e },
    usb: { nombre: "USB a la PC", color: 0x8e8e93 },
  };

  H.bom = (n) => (window.DATOS_BOM || []).find((m) => m.n === n) || null;
  H.sw = (archivo) => (window.DATOS_SOLIDWORKS || []).find((p) => p.archivo === archivo) || null;
  H.conexionesDe = (texto) => (window.DATOS_CONEXIONES || []).filter((c) => c.comp.toLowerCase().includes(texto.toLowerCase()));

  /** Información de una pieza de SolidWorks para el registro. */
  H.infoSW = function (archivo, extra = {}) {
    const p = H.sw(archivo);
    return Object.assign({
      nombre: archivo.replace(/^[0-9a-z]+_/, "").replace(/_/g, " "),
      codigo: p ? p.codigo : archivo.split("_")[0], archivo,
      origen: "SolidWorks · " + (p ? p.carpeta : "") + " · " + archivo,
      funcion: p ? p.desc : "",
    }, extra);
  };
  /** Información de un ítem de la lista de materiales. */
  H.infoBOM = function (n, extra = {}) {
    const m = H.bom(n);
    if (!m) return Object.assign({ nombre: "Ítem " + n }, extra);
    const cant = (typeof m.cant === "number" ? String(m.cant).replace(".", ",") : m.cant) + " " + m.uni;
    return Object.assign({
      nombre: m.nombre, codigo: "N° " + n, origen: "Lista de materiales · " + m.cat + " · " + cant,
      funcion: m.uso, especificacion: m.esp,
    }, extra);
  };
})();
