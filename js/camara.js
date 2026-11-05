/* Cámara orbital con inercia suave y vuelos animados (sin dependencias). */
(function () {
  const H = window.H;

  class Orbita {
    constructor(camara) {
      this.cam = camara;
      this.objetivo = new THREE.Vector3(0, 0.75, 0);
      this.radio = 3.1; this.theta = 0.72; this.phi = 1.12;          // theta: alrededor de Y desde +Z; phi: desde arriba
      this.dTheta = 0; this.dPhi = 0; this.dRadio = 0; this.dPan = new THREE.Vector3();
      this.vuelo = null;
      this.min = 0.18; this.max = 7.5;
    }
    rotar(dx, dy) { this.vuelo = null; this.dTheta -= dx * 0.0055; this.dPhi -= dy * 0.0055; }
    mover(dx, dy) {
      this.vuelo = null;
      const f = this.radio * 0.0011;
      const der = new THREE.Vector3().setFromMatrixColumn(this.cam.matrix, 0);
      const arr = new THREE.Vector3().setFromMatrixColumn(this.cam.matrix, 1);
      this.dPan.add(der.multiplyScalar(-dx * f)).add(arr.multiplyScalar(dy * f));
    }
    zoom(delta) { this.vuelo = null; this.dRadio += delta * 0.0012 * this.radio; }
    /** Vuela de forma suave a un objetivo (vector), radio y, opcionalmente, ángulos. */
    volarA(objetivo, radio, theta, phi, ms = 1100) {
      const t0 = performance.now();
      const ini = { o: this.objetivo.clone(), r: this.radio, t: this.theta, p: this.phi };
      let dt = (theta == null ? this.theta : theta) - ini.t;
      dt = Math.atan2(Math.sin(dt), Math.cos(dt));                    // por el camino más corto
      this.vuelo = { t0, ms, ini, fin: { o: objetivo.clone(), r: radio, t: ini.t + dt, p: phi == null ? this.phi : phi } };
    }
    actualizar() {
      if (this.vuelo) {
        const v = this.vuelo;
        let k = Math.min(1, (performance.now() - v.t0) / v.ms);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;          // easeInOutCubic
        this.objetivo.lerpVectors(v.ini.o, v.fin.o, e);
        this.radio = v.ini.r + (v.fin.r - v.ini.r) * e;
        this.theta = v.ini.t + (v.fin.t - v.ini.t) * e;
        this.phi = v.ini.p + (v.fin.p - v.ini.p) * e;
        if (k >= 1) this.vuelo = null;
      } else {
        this.theta += this.dTheta * 0.18; this.phi += this.dPhi * 0.18;
        this.radio = Math.min(this.max, Math.max(this.min, this.radio + this.dRadio * 0.18));
        this.objetivo.addScaledVector(this.dPan, 0.18);
        this.dTheta *= 0.82; this.dPhi *= 0.82; this.dRadio *= 0.82; this.dPan.multiplyScalar(0.82);
      }
      this.phi = Math.min(Math.PI * 0.495, Math.max(0.06, this.phi));
      const s = Math.sin(this.phi);
      this.cam.position.set(
        this.objetivo.x + this.radio * s * Math.sin(this.theta),
        this.objetivo.y + this.radio * Math.cos(this.phi),
        this.objetivo.z + this.radio * s * Math.cos(this.theta));
      this.cam.lookAt(this.objetivo);
    }
  }
  H.Orbita = Orbita;
})();
