/* Simulación: posición del Sol (la que reproduce el heliodón), luz y temperatura de cada cuarto. */
(function () {
  const H = (window.H = window.H || {});
  const rad = (g) => (g * Math.PI) / 180, gra = (r) => (r * 180) / Math.PI;

  /** Declinación del Sol (Cooper) para el día del año. */
  H.declinacion = (dia) => 23.45 * Math.sin(rad((360 / 365) * (284 + dia)));
  H.fechaDeDia = function (dia) {
    const d = new Date(2026, 0, 1);
    d.setDate(dia);
    return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0");
  };

  /** Dirección del Sol (vector unitario X=Este, Y=arriba, Z=Sur) para latitud φ, hora solar y declinación δ.
      Es exactamente lo que arma el heliodón: aro inclinado φ, carro a 15°/h, arco de declinación δ. */
  H.direccionSol = function (lat, hora, decl) {
    const f = rad(lat), d = rad(decl), w = rad((hora - 12) * 15);
    const E = -Math.cos(d) * Math.sin(w);
    const N = Math.cos(f) * Math.sin(d) - Math.sin(f) * Math.cos(d) * Math.cos(w);
    const U = Math.sin(f) * Math.sin(d) + Math.cos(f) * Math.cos(d) * Math.cos(w);
    return new THREE.Vector3(E, U, -N);
  };
  H.alturaAzimut = function (dir) {
    const alt = gra(Math.asin(Math.max(-1, Math.min(1, dir.y))));
    let az = gra(Math.atan2(dir.x, -dir.z));          // 0 = Norte, 90 = Este
    if (az < 0) az += 360;
    return { alt, az };
  };

  // ------------------------------------------------------------------ luz y temperatura de cada cuarto
  const E_NORMAL = 9000, TECHO = 0.55, VENTANAS = 0.45, AMBIENTE = 180;
  H.sim = {
    lux: [AMBIENTE, AMBIENTE, AMBIENTE, AMBIENTE, AMBIENTE],
    temp: [20.5, 20.4, 20.6, 20.3, 20.5],
    /** Paso de dt segundos. dir: dirección del Sol en el mundo; giro: giro de la maqueta (rad, sobre Y). */
    paso(dt, dir, foco, giro) {
      const { alt, az } = H.alturaAzimut(dir);
      const kL = 1 - Math.exp(-dt / 0.5), kT = 1 - Math.exp(-dt / 30);   // la luz llega en ~1 s, la temperatura en ~1 min
      H.CUARTOS.forEach((c, i) => {
        let e = AMBIENTE;
        if (foco && alt > 0) {
          e += E_NORMAL * TECHO * Math.sin(rad(alt));
          for (const m of c.muros) {
            const azMuro = m - gra(giro);                 // el giro de la maqueta (antihorario visto desde arriba) cambia el azimut
            e += E_NORMAL * VENTANAS * Math.cos(rad(alt)) * Math.max(0, Math.cos(rad(az - azMuro)));
          }
        }
        this.lux[i] += (e - this.lux[i]) * kL;
        const tEq = 20 + this.lux[i] * 0.0011;           // ≈ +8 °C con 7 000 lx
        this.temp[i] += (tEq - this.temp[i]) * kT;
      });
      return { alt, az };
    },
  };

  H.nivelLuz = function (lx) {
    if (lx < 10) return ["Oscuro", "#5856D6"];
    if (lx < 200) return ["Penumbra", "#0A84FF"];
    if (lx < 1000) return ["Luz de interior", "#30B0C7"];
    if (lx < 10000) return ["Luz intensa", "#E0B000"];
    return ["Luz muy intensa", "#FF9F0A"];
  };
  /** Color continuo para un valor de lux (escala logarítmica 1..100 000). */
  H.colorLux = function (lx) {
    const paradas = [[0, 0x5856d6], [0.2, 0x0a84ff], [0.46, 0x30b0c7], [0.6, 0xffd60a], [0.8, 0xff9f0a], [1, 0xff6b2c]];
    const f = Math.max(0, Math.min(1, Math.log10(Math.max(1, lx)) / 5));
    for (let k = 1; k < paradas.length; k++) {
      if (f <= paradas[k][0]) {
        const t = (f - paradas[k - 1][0]) / (paradas[k][0] - paradas[k - 1][0]);
        return new THREE.Color(paradas[k - 1][1]).lerp(new THREE.Color(paradas[k][1]), t);
      }
    }
    return new THREE.Color(paradas[paradas.length - 1][1]);
  };
  H.fmtLux = (lx) => (lx < 10 ? lx.toFixed(1).replace(".", ",") : Math.round(lx).toLocaleString("es-BO").replace(/[.,]/g, " ")) + " lx";
  H.fmtNum = (v, d = 1) => v.toFixed(d).replace(".", ",");
})();
