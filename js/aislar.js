/* Modo «Aislar» (como en SolidWorks): una pieza, un cable o un componente del Arduino solo, en el centro de la
   pantalla, girable y con zoom, con sus cotas en 3D y una tarjeta con sus datos. «Volver» (o Esc) regresa al ensamble.
   Se dibuja en una escena aparte con copias de las mallas (el modelo principal no se toca). */
(function () {
  const H = window.H;
  const $ = (s) => document.querySelector(s);
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const n0 = (v) => Math.round(v).toLocaleString("es-BO").replace(/[.,]/g, " ");
  const metros = (mm) => (mm / 1000).toFixed(2).replace(".", ",") + " m";
  const hex = (n) => "#" + n.toString(16).padStart(6, "0");

  const AIS = (H.aislar = { activo: false, id: null });
  let escena, camara, orbita, grupo = null, etiquetas = [], luz;

  function iniciar() {
    escena = new THREE.Scene();
    camara = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.002, 40);
    orbita = new H.Orbita(camara);
    escena.add(new THREE.HemisphereLight(0xffffff, 0xa9a59c, 0.85));
    luz = new THREE.DirectionalLight(0xffffff, 0.75);
    escena.add(luz);
    const rel = new THREE.DirectionalLight(0xdfe8ff, 0.35);
    rel.position.set(-2, 1, -2);
    escena.add(rel);
    AIS.orbita = orbita; AIS.camara = camara; AIS.escena = escena;
    window.addEventListener("resize", () => { camara.aspect = window.innerWidth / window.innerHeight; camara.updateProjectionMatrix(); });
    $("#ais-volver").addEventListener("click", () => AIS.cerrar());
  }

  // ------------------------------------------------------------------ copia de las mallas
  function copiar(id) {
    const c = H.comps[id];
    H.ref.raiz.updateMatrixWorld(true);
    const objs = c.cable ? c.objetos : [c.objetos[0]];
    const marco = c.cable || c.objetos[0].isMesh ? c.objetos[0].parent : c.objetos[0];      // una malla suelta: en el marco de su grupo
    const inv = new THREE.Matrix4().copy(marco.matrixWorld).invert();
    const g = new THREE.Group();
    objs.forEach((o) => o.traverse((m) => {
      if (!m.isMesh || m.userData.cota || (!c.cable && m.userData.comp !== id)) return;
      const mats = (Array.isArray(m.material) ? m.material : [m.material]).map((x) => {
        const k = x.clone();
        if (x.userData.op0 != null) { k.opacity = x.userData.op0; k.transparent = !!x.userData.tr0; k.depthWrite = x.userData.dw0 !== false; }
        if (k.emissive && x.userData.em0 != null) { k.emissive.setHex(x.userData.em0); k.emissiveIntensity = x.userData.ei0; }
        return k;
      });
      const k = new THREE.Mesh(m.geometry, Array.isArray(m.material) ? mats : mats[0]);
      k.matrixAutoUpdate = false;
      k.matrix.multiplyMatrices(inv, m.matrixWorld);
      g.add(k);
    }));
    return g;
  }

  // ------------------------------------------------------------------ cotas
  const AZUL = 0x007aff;
  function lineas(pts, color = AZUL, opac = 0.95) {
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const l = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: opac, depthTest: false }));
    l.renderOrder = 999;
    return l;
  }
  function etiqueta(texto, pos, clase = "") {
    const el = document.createElement("div");
    el.className = "ais-cota " + clase;
    el.innerHTML = texto;
    $("#ais-etq").appendChild(el);
    etiquetas.push({ el, pos: pos.clone() });
  }
  /** Cotas de la caja envolvente de una pieza (en su propio marco) con el nombre de cada medida. */
  function cotasPieza(b, p) {
    const s = b.getSize(new THREE.Vector3()), mmS = s.clone().multiplyScalar(1000);
    const M = Math.max(s.x, s.y, s.z), d = M * 0.12;
    const { min: a, max: z } = b;
    const V = (x, y, w) => new THREE.Vector3(x, y, w);
    const L = [];
    const tick = (q, u, v) => { const k = d * 0.18; L.push(q.clone().addScaledVector(u, -k).addScaledVector(v, -k), q.clone().addScaledVector(u, k).addScaledVector(v, k)); };
    const med = (p && p.medidas) || {};
    const redondo = med.diametro && !/^M\d/.test(med.diametro);
    // nombres: el mayor horizontal = largo, el otro = ancho, el vertical = alto
    const horiz = mmS.x >= mmS.z ? ["x", "z"] : ["z", "x"];
    const nom = { [horiz[0]]: "Largo", [horiz[1]]: "Ancho", y: "Alto" };
    const parecidos = (u, v) => Math.abs(mmS[u] - mmS[v]) < 0.08 * Math.max(mmS[u], mmS[v]);
    if (redondo) {
      if (parecidos("x", "y")) { nom.x = "Ø"; nom.y = "Ø"; } else if (parecidos("x", "z")) { nom.x = "Ø"; nom.z = "Ø"; } else if (parecidos("y", "z")) { nom.y = "Ø"; nom.z = "Ø"; }
    }
    const txt = (k) => `<span>${nom[k]}</span> ${n0(mmS[k])} mm`;
    const yb = a.y - d, xr = z.x + d;
    // X: abajo y adelante
    L.push(V(a.x, a.y, z.z), V(a.x, yb - d * 0.2, z.z), V(z.x, a.y, z.z), V(z.x, yb - d * 0.2, z.z), V(a.x, yb, z.z), V(z.x, yb, z.z));
    tick(V(a.x, yb, z.z), V(1, 0, 0), V(0, 1, 0)); tick(V(z.x, yb, z.z), V(1, 0, 0), V(0, 1, 0));
    etiqueta(txt("x"), V((a.x + z.x) / 2, yb, z.z));
    // Y: a la derecha y adelante
    if (!(nom.y === "Ø" && nom.x === "Ø")) {
      L.push(V(z.x, a.y, z.z), V(xr + d * 0.2, a.y, z.z), V(z.x, z.y, z.z), V(xr + d * 0.2, z.y, z.z), V(xr, a.y, z.z), V(xr, z.y, z.z));
      tick(V(xr, a.y, z.z), V(0, 1, 0), V(1, 0, 0)); tick(V(xr, z.y, z.z), V(0, 1, 0), V(1, 0, 0));
      etiqueta(txt("y"), V(xr, (a.y + z.y) / 2, z.z));
    }
    // Z: abajo a la derecha
    if (!(nom.z === "Ø" && nom.x === "Ø")) {
      L.push(V(z.x, a.y, a.z), V(xr + d * 0.2, a.y, a.z), V(z.x, a.y, z.z), V(xr + d * 0.2, a.y, z.z), V(xr, a.y, a.z), V(xr, a.y, z.z));
      tick(V(xr, a.y, a.z), V(0, 0, 1), V(1, 0, 0)); tick(V(xr, a.y, z.z), V(0, 0, 1), V(1, 0, 0));
      etiqueta(txt("z"), V(xr, a.y, (a.z + z.z) / 2));
    }
    if (med.espesor) etiqueta(`<span>Espesor</span> ${esc(med.espesor.split(" (")[0])}`, V(a.x, z.y + d * 0.6, a.z), "suave");
    const caja = new THREE.Box3Helper(b, AZUL);
    caja.material.transparent = true; caja.material.opacity = 0.22; caja.material.depthTest = false; caja.renderOrder = 998;
    grupo.add(lineas(L), caja);
  }
  /** Cota de cada tramo de un cable (largo y nombre) y puntos donde empieza cada tramo. */
  function cotasCable(c, centro) {
    const tr = c.tramos || [];
    const P = (q) => new THREE.Vector3(q[0] / 1000, q[1] / 1000, q[2] / 1000).sub(centro);
    const marcas = new THREE.Group();
    tr.forEach(([nombre, pts], i) => {
      if (!pts || pts.length < 2) return;
      const largo = H.largoPoli(pts);
      etiqueta(`<b>${i + 1}</b> ${metros(largo)}`, P(H.mitadPoli(pts)), "tramo");
      const s = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), new THREE.MeshBasicMaterial({ color: AZUL, depthTest: false }));
      s.position.copy(P(pts[0])); s.renderOrder = 999; s.userData.punto = true;
      marcas.add(s);
      if (i === tr.length - 1) { const f = s.clone(); f.position.copy(P(pts[pts.length - 1])); marcas.add(f); }
    });
    grupo.add(marcas);
    AIS._marcas = marcas;
  }

  // ------------------------------------------------------------------ tarjeta
  const fila = (k, v) => `<div><span>${esc(k)}</span><b>${v == null || v === "" ? "—" : v}</b></div>`;
  function tarjeta(id) {
    const c = H.comps[id] || {};
    const p = H.pieza(c.pieza || id);
    const ard = H.ARDUINO[id];
    let cod = c.codigo || "", tipo = "", filas = "", extra = "";
    if (c.cable) {
      const k = H.CABLES[id] || {};
      tipo = "Cable · " + (H.TIPOS[k.tipo] ? H.TIPOS[k.tipo].nombre : "");
      const col = k.colorHex != null ? k.colorHex : H.TIPOS[k.tipo] ? H.TIPOS[k.tipo].color : 0x888888;
      filas = [fila("Tipo", esc(k.clase)), fila("Hilos", k.hilos), fila("Calibre", esc(k.awg)), fila("Diámetro", esc(k.diam)),
        fila("Conductor", esc(k.conductor)), fila("Aislante", esc(k.aislante)),
        fila("Color", `<i class="punto" style="background:${hex(col)}"></i> ${esc(k.color)}`),
        fila("Largo total", (c.largo ? metros(c.largo) + " (modelo 3D)" : "—") + (k.sw ? `<small>${esc(k.sw)}</small>` : "")),
        fila("Desde", esc(k.desde)), fila("Hasta", esc(k.hasta))].join("");
      extra = `<h3>Tramos</h3><ol class="ais-tramos">${(c.tramos || []).map(([nm, pts]) => `<li><span>${esc(nm)}</span><b>${metros(H.largoPoli(pts))}</b></li>`).join("")}</ol>`;
    } else if (p) {
      tipo = p.grupo;
      const m = p.medidas || {};
      const masa = p.masa != null ? (p.masa < 0.1 ? n0(p.masa * 1000) + " g" : p.masa.toFixed(3).replace(".", ",") + " kg") + (p.cant > 1 ? ` c/u · ${(p.masa * p.cant).toFixed(3).replace(".", ",")} kg las ${p.cant}` : "") : "—";
      filas = [fila("Nombre", esc(p.nombre)), fila("Número", esc(p.cod)), fila("Material", esc(p.material)), fila("Perfil", esc(p.perfil)),
        fila("Masa", masa), fila("Cantidad", p.cant)].join("");
      extra = `<h3>Cotas</h3><div class="ais-tabla">${[["Largo", m.largo], ["Ancho", m.ancho], ["Alto", m.alto], ["Diámetro", m.diametro], ["Espesor", m.espesor]]
        .map(([k, v]) => fila(k, esc(v))).join("")}${(p.extra || []).map(([k, v]) => fila(k, esc(v))).join("")}</div>`;
    } else {
      tipo = c.grupo || "";
      filas = [fila("Nombre", esc(c.nombre)), fila("Material", esc(c.material))].join("");
    }
    if (ard) extra = `<div class="ais-ard"><div><span>Qué hace</span><p>${esc(ard.hace)}</p></div><div><span>Pin</span><p>${esc(ard.pin)}</p></div></div>` + extra;
    const desc = c.cable ? (H.CABLES[id] || {}).recorrido : (p ? p.desc : c.funcion);
    $("#ais-cod").textContent = cod || "—";
    $("#ais-tipo").textContent = tipo;
    $("#ais-nombre").textContent = c.nombre || id;
    $("#ais-desc").textContent = desc ? (c.cable ? "Recorrido: " + desc : desc) : "";
    $("#ais-filas").innerHTML = filas;
    $("#ais-extra").innerHTML = extra;
  }

  // ------------------------------------------------------------------ abrir / cerrar
  AIS.abrir = function (id) {
    const c = H.comps[id];
    if (!c || !c.objetos.length) return false;
    if (!escena) iniciar();
    limpiar();
    if (id === "206c") H.actualizarCableFoco();
    AIS.id = id;
    grupo = new THREE.Group();
    const piezaG = copiar(id);
    grupo.add(piezaG);
    piezaG.updateMatrixWorld(true);
    const b = new THREE.Box3();
    piezaG.traverse((m) => { if (m.isMesh) { m.geometry.computeBoundingBox(); b.union(m.geometry.boundingBox.clone().applyMatrix4(m.matrix)); } });
    const centro = b.getCenter(new THREE.Vector3());
    piezaG.position.copy(centro).negate();
    piezaG.updateMatrixWorld(true);
    const bc = b.clone().translate(centro.clone().negate());
    const tam = bc.getSize(new THREE.Vector3());
    const M = Math.max(tam.x, tam.y, tam.z, 0.004);
    if (c.cable) cotasCable(c, centro); else cotasPieza(bc, H.pieza(c.pieza || id));
    if (AIS._marcas) AIS._marcas.children.forEach((s) => s.scale.setScalar(M * 0.008));
    escena.add(grupo);
    tarjeta(id);
    const f = H.factorPantalla() * (H.movil() ? 1.25 : 1) * (window.innerWidth > 900 ? 1.25 : 1);
    orbita.min = M * 0.25; orbita.max = M * 8;
    orbita.objetivo.set(0, 0, 0);
    orbita.radio = M * 6; orbita.theta = 0.9; orbita.phi = 1.1;
    orbita.volarA(new THREE.Vector3(c.cable ? 0 : -M * 0.06, 0, 0), M * 2.3 * f, 0.62, 1.12, 900);
    const lz = $("#lienzo");
    lz.classList.add("cambio");
    setTimeout(() => {
      AIS.activo = true;
      document.body.classList.add("aislando");
      $("#aislado").classList.remove("oculto");
      lz.classList.remove("cambio");
      H.UI && H.UI.tooltip(0, 0, null);
    }, 180);
    return true;
  };
  function limpiar() {
    etiquetas.forEach(({ el }) => el.remove());
    etiquetas = [];
    AIS._marcas = null;
    if (grupo) {
      escena.remove(grupo);
      grupo.traverse((o) => {
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        if (o.geometry && (o.isLineSegments || o.type === "Box3Helper" || o.userData.punto)) o.geometry.dispose();
      });
      grupo = null;
    }
  }
  AIS.cerrar = function () {
    if (!AIS.activo) return;
    const lz = $("#lienzo");
    lz.classList.add("cambio");
    $("#aislado").classList.add("saliendo");
    setTimeout(() => {
      AIS.activo = false;
      AIS.id = null;
      limpiar();
      document.body.classList.remove("aislando");
      $("#aislado").classList.add("oculto");
      $("#aislado").classList.remove("saliendo");
      lz.classList.remove("cambio");
    }, 200);
  };
  AIS.cuadro = function () {
    orbita.actualizar();
    luz.position.copy(camara.position).add(new THREE.Vector3(0.4, 0.8, 0.2));
    const W = window.innerWidth, Hh = window.innerHeight, v = new THREE.Vector3();
    etiquetas.forEach(({ el, pos }) => {
      v.copy(pos).project(camara);
      const fuera = v.z > 1;
      el.style.opacity = fuera ? 0 : 1;
      el.style.transform = `translate(${((v.x + 1) / 2) * W}px, ${((1 - v.y) / 2) * Hh}px) translate(-50%, -50%)`;
    });
  };
  AIS.render = function (renderer) { renderer.render(escena, camara); };
  AIS.info = () => ({ activo: AIS.activo, id: AIS.id, cotas: etiquetas.map((e) => e.el.textContent), nombre: $("#ais-nombre").textContent });
})();
