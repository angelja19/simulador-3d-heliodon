/* Aplicación: escena, luces, bucle de animación, estado, interacciones y API de prueba (window.H.app). */
(function () {
  const H = window.H;
  const $ = (s) => document.querySelector(s);
  const rad = (g) => (g * Math.PI) / 180;
  const progreso = (p) => { const e = $("#inicio-progreso"); if (e) e.style.width = p + "%"; };

  const estado = { lat: -17.4, hora: 10, dia: 80, foco: true, giro: 0, levantar: false, techos: true, etiquetas: true,
    cables: true, rayosx: false, explosion: false, conexiones: false, caja: false, paneles: true };
  const anim = { lat: -17.4, hora: 10, decl: 0, giro: 0, lev: 0, techos: 1, rayosx: 0, explosion: 0, caja: 0, foco: 1 };
  H.estado = estado; H.anim = anim;

  // ------------------------------------------------------------------ renderer y escena
  progreso(15);
  const contenedor = $("#lienzo");
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  contenedor.appendChild(renderer.domElement);
  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.02, 60);
  const orbita = new H.Orbita(camara);

  // luces: cielo suave + luz de estudio (sombra difusa en el piso) + el foco del heliodón
  const hemi = new THREE.HemisphereLight(0xffffff, 0xb9b4aa, 0.62);
  escena.add(hemi);
  const estudio = new THREE.DirectionalLight(0xffffff, 0.55);
  estudio.position.set(2.2, 4.5, 2.8);
  estudio.castShadow = true;
  estudio.shadow.mapSize.set(2048, 2048);
  Object.assign(estudio.shadow.camera, { left: -1.8, right: 1.8, top: 1.8, bottom: -1.8, near: 1, far: 9 });
  estudio.shadow.radius = 6; estudio.shadow.bias = -0.0005;
  escena.add(estudio);
  const relleno = new THREE.DirectionalLight(0xdfe8ff, 0.25);
  relleno.position.set(-3, 2, -2);
  escena.add(relleno);
  const spot = new THREE.SpotLight(0xfff0d2, 2.6, 0, rad(30), 0.55, 0);
  spot.castShadow = true;
  spot.shadow.mapSize.set(2048, 2048);
  spot.shadow.camera.near = 0.05; spot.shadow.camera.far = 2.4;
  spot.shadow.bias = -0.0003; spot.shadow.normalBias = 0.002;
  escena.add(spot, spot.target);
  H.spot = spot;

  // piso: solo sombras + mancha de contacto difusa (el fondo es el degradado CSS)
  const piso = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.16 }));
  piso.rotation.x = -Math.PI / 2; piso.receiveShadow = true;
  escena.add(piso);
  const mancha = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), new THREE.MeshBasicMaterial({
    transparent: true, depthWrite: false, map: H.textura((g, w, h) => {
      const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      gr.addColorStop(0, "rgba(0,0,0,0.20)"); gr.addColorStop(0.55, "rgba(0,0,0,0.07)"); gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    }, 256, 256) }));
  mancha.rotation.x = -Math.PI / 2; mancha.position.y = 0.001;
  escena.add(mancha);

  progreso(35);
  const ref = H.construirModelo(escena);
  progreso(60);
  H.construirElectronica(escena);
  progreso(80);
  // materiales: valores originales (rayos X y resaltado)
  ref.raiz.traverse((o) => {
    if (!o.isMesh) return;
    const ms = Array.isArray(o.material) ? o.material : [o.material];
    ms.forEach((m) => { m.userData.op0 = m.opacity; m.userData.tr0 = m.transparent; m.userData.dw0 = m.depthWrite;
      if (m.emissive) { m.userData.em0 = m.emissive.getHex(); m.userData.ei0 = m.emissiveIntensity; } });
  });

  // ------------------------------------------------------------------ vistas
  const CAPAS_RX = new Set(["estructura", "mecanismo", "soporte", "maqueta", "techo", "caja", "kit"]);
  const CAPAS_CONEX = new Set(["sensor", "electronica", "cable", "foco"]);
  const EN_CONEX = new Set(["laptop", "enchufe", "empalme"]);
  function visibilidad() {
    if (H.piezas && H.piezas.activo) { H.piezas.visibilidad(); renovarSombras(); return; }
    const e = anim.explosion > 0.02;
    ref.raiz.traverse((o) => {
      if (!o.isMesh || o.userData.capa == null) return;
      const c = o.userData.capa;
      let v = !estado.conexiones || CAPAS_CONEX.has(c) || EN_CONEX.has(o.userData.comp);
      if (c === "cable") v = v && estado.cables && !e;
      o.visible = v;
    });
    ref.cono.visible = anim.foco > 0.05 && !estado.conexiones;
    if (ref.colgantes) ref.colgantes.visible = ref.colgantes.visible && estado.cables && !e;
    spot.castShadow = !estado.conexiones;        // sin la maqueta, las sombras de los sensores junto al foco confunden
    renovarSombras();
  }
  /** Rehace los mapas de sombra (si no, quedan sombras de piezas ocultas mientras el foco no se mueve). */
  function renovarSombras() {
    [spot, estudio].forEach((l) => { if (l.shadow.map) { l.shadow.map.dispose(); l.shadow.map = null; } });
  }
  let rxAplicado = -1;
  function rayosX() {
    const k = anim.rayosx;
    if (Math.abs(k - rxAplicado) < 0.004 && !(rxAplicado < 0)) return;
    if ((k < 0.5) !== (rxAplicado < 0.5) && rxAplicado >= 0) renovarSombras();    // las piezas transparentes no hacen sombra
    rxAplicado = k;
    ref.raiz.traverse((o) => {
      if (!o.isMesh || !CAPAS_RX.has(o.userData.capa)) return;
      const ms = Array.isArray(o.material) ? o.material : [o.material];
      ms.forEach((m) => {
        const base = m.userData.op0 == null ? 1 : m.userData.op0;
        const techo = o.userData.capa === "techo" ? anim.techos : 1;
        m.opacity = base * techo * (1 - 0.87 * k);
        const tr = m.userData.tr0 || k > 0.001 || techo < 0.999;
        if (m.transparent !== tr) { m.transparent = tr; m.needsUpdate = true; }   // cambia el shader (OPAQUE)
        m.depthWrite = k < 0.5 && m.userData.dw0 !== false;
      });
      o.castShadow = k < 0.5;
    });
  }

  // ------------------------------------------------------------------ resaltado
  let resaltados = [];
  function resaltar(ids) {
    resaltados.forEach((m) => { m.emissive.setHex(m.userData.em0); m.emissiveIntensity = m.userData.ei0; });
    resaltados = [];
    ids.forEach((id) => (H.comps[id] ? H.comps[id].objetos : []).forEach((ob) => ob.traverse((o) => {
      if (!o.isMesh) return;
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { if (m.emissive && !resaltados.includes(m)) resaltados.push(m); });
    })));
  }
  function pulsoResaltado(t) {
    const k = 0.35 + 0.25 * Math.sin(t * 5);
    resaltados.forEach((m) => { m.emissive.setHex(0x0a84ff); m.emissiveIntensity = k; });
  }
  function cajaDe(ids) {
    const b = new THREE.Box3();
    ref.raiz.updateMatrixWorld(true);
    ids.forEach((id) => (H.comps[id] ? H.comps[id].objetos : []).forEach((o) => { if (o.visible !== false) b.expandByObject(o); }));
    return b;
  }

  // ------------------------------------------------------------------ acciones
  const VISTA_INICIO = () => orbita.volarA(new THREE.Vector3(0, 0.72, 0), 3.15, 0.72, 1.12);
  let seleccion = null;
  const app = (H.app = {
    estado, anim, orbita, camara, renderer, escena,
    set(clave, valor) {
      estado[clave] = valor;
      sincronizarControles();
      if (clave === "explosion" || clave === "conexiones" || clave === "cables") visibilidad();
      if (clave === "conexiones" && valor) { orbita.volarA(new THREE.Vector3(-0.05, 0.55, 0), 3.0, 0.9, 1.05); UI.aviso("Vista de conexiones: solo el Arduino, los módulos, los sensores y los cables"); }
      if (clave === "explosion" && valor) { orbita.volarA(new THREE.Vector3(0, 0.75, 0.15), 3.8, 0.75, 1.12); UI.aviso("Vista explosionada (los cables se ocultan mientras está separada)"); }
      if (clave === "caja" && valor) { orbita.volarA(new THREE.Vector3(0.115, 0.755, 0.05), 0.78, 0.42, 1.3); UI.aviso("Puerta frontal de la caja abierta (bisagra al lado Oeste): se ven el Arduino, los módulos y sus cables"); }
      if (clave === "levantar" && valor) { orbita.volarA(new THREE.Vector3(0, 1.0, 0), 1.25, 0.6, 1.2); UI.aviso("Maqueta levantada: se ven los cables que bajan al conector de 12 pines"); }
      if (clave === "techos") UI.aviso(valor ? "Techos puestos" : "Techos quitados: se ven los DS18B20 de cada cuarto");
      if (clave === "rayosx") UI.aviso(valor ? "Rayos X: las piezas se vuelven transparentes para ver los cables" : "Rayos X apagado");
    },
    /** Usados por el modo «Piezas» (piezas.js). */
    resaltarIds(ids) { resaltar(ids); },
    refrescar() { rxAplicado = -1; visibilidad(); },
    vistaInicio() { VISTA_INICIO(); },
    sincronizar() { sincronizarControles(); },
    accion(n) {
      const PZ = H.piezas;
      if (n === "piezas") { PZ.alternar(); return; }
      if (PZ && PZ.activo) {
        if (n === "explosion") { PZ.explotar(); return; }
        if (n === "inicio") { PZ.ensamble(); return; }
        if (["cables", "rayosx", "conexiones", "levantar"].includes(n)) { UI.aviso("No disponible en el modo Piezas (salga con el botón Piezas)", 2400); return; }
      }
      const t = { foco: "foco", techos: "techos", levantar: "levantar", cables: "cables", rayosx: "rayosx", explosion: "explosion", conexiones: "conexiones", caja: "caja" };
      if (n === "inicio") { VISTA_INICIO(); app.seleccionar(null); return; }
      if (n === "paneles") { app.set("paneles", !estado.paneles); document.body.classList.toggle("sin-paneles", !estado.paneles); return; }
      if (t[n]) app.set(t[n], !estado[t[n]]);
    },
    seleccionar(id) {
      seleccion = id;
      UI.marcarSeleccion(id);
      if (!id) { resaltar([]); return; }
      resaltar([id]);
      const b = cajaDe([id]);
      if (!b.isEmpty()) {
        const c = b.getCenter(new THREE.Vector3()), s = b.getSize(new THREE.Vector3()).length();
        orbita.volarA(c, Math.min(3.6, Math.max(0.14, s * 1.9)), null, null);
      }
      UI.aviso(H.comps[id] ? H.comps[id].nombre : id, 2200);
    },
    resaltarTipo(tipo) {
      const ids = Object.values(H.comps).filter((c) => c.tipo === tipo && c.objetos.length).map((c) => c.id);
      resaltar(ids);
      if (!estado.cables) app.set("cables", true);
      UI.aviso(H.TIPOS[tipo].nombre + ": " + ids.length + " cable(s) resaltados");
    },
    /** Datos para las pruebas. */
    info() {
      const comps = Object.values(H.comps);
      const enLista = (n) => comps.some((c) => c.objetos.length && (String(c.codigo || "").includes("N° " + n) || String(c.lista || "").includes("N° " + n)));
      return {
        estado: Object.assign({}, estado), lux: H.sim.lux.map((v) => Math.round(v)), temp: H.sim.temp.map((v) => +v.toFixed(2)),
        sol: Object.assign({}, ultimoSol), componentes: comps.filter((c) => c.objetos.length).length, mallas: H.pickables.length,
        bomFaltan: (window.DATOS_BOM || []).map((m) => m.n).filter((n) => !enLista(n)),
        swFaltan: (window.DATOS_SOLIDWORKS || []).filter((p) => !comps.some((c) => c.objetos.length && c.archivo === p.archivo)).map((p) => p.archivo),
        llamadas: renderer.info.render.calls, triangulos: renderer.info.render.triangles,
      };
    },
  });
  const UI = H.UI;

  // ------------------------------------------------------------------ controles HTML
  const ctl = { lat: $("#s-lat"), hora: $("#s-hora"), dia: $("#s-dia"), giro: $("#s-giro") };
  const tg = { foco: "#t-foco", levantar: "#t-levantar", techos: "#t-techos", etiquetas: "#t-etiquetas", cables: "#t-cables",
    rayosx: "#t-rayosx", explosion: "#t-explosion", conexiones: "#t-conexiones", caja: "#t-caja" };
  ctl.lat.addEventListener("input", () => app.set("lat", +ctl.lat.value));
  ctl.hora.addEventListener("input", () => app.set("hora", +ctl.hora.value));
  ctl.dia.addEventListener("input", () => app.set("dia", +ctl.dia.value));
  ctl.giro.addEventListener("input", () => app.set("giro", +ctl.giro.value));
  Object.entries(tg).forEach(([k, s]) => $(s).addEventListener("change", (e) => app.set(k, e.target.checked)));
  document.querySelectorAll("#chips-lat .chip").forEach((b) => b.addEventListener("click", () => app.set("lat", +b.dataset.lat)));
  document.querySelectorAll("#chips-fecha .chip").forEach((b) => b.addEventListener("click", () => app.set("dia", +b.dataset.dia)));
  document.querySelectorAll("#dock button").forEach((b) => b.addEventListener("click", () => app.accion(b.dataset.accion)));
  $("#b-tema").addEventListener("click", () => aplicarTema(document.documentElement.dataset.tema === "oscuro" ? "claro" : "oscuro"));
  $("#b-ayuda").addEventListener("click", () => $("#ayuda").classList.toggle("oculto"));
  $("#b-cerrar-ayuda").addEventListener("click", () => $("#ayuda").classList.add("oculto"));

  function fmtHora(h) { const m = Math.round(h * 60); return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); }
  function latTxt(l) { return l === 0 ? "0°" : H.fmtNum(Math.abs(l)) + "° " + (l > 0 ? "N" : "S"); }
  function sincronizarControles() {
    for (const k of ["lat", "hora", "dia", "giro"]) { if (+ctl[k].value !== estado[k]) ctl[k].value = estado[k]; UI.relleno(ctl[k]); }
    Object.entries(tg).forEach(([k, s]) => { $(s).checked = !!estado[k]; });
    const decl = H.declinacion(estado.dia);
    $("#v-lat").textContent = latTxt(estado.lat);
    $("#v-hora").textContent = fmtHora(estado.hora);
    $("#v-fecha").textContent = `${H.fechaDeDia(estado.dia)} · δ ${H.fmtNum(decl)}°`;
    $("#v-giro").textContent = Math.round(estado.giro) + "°";
    const g5 = Math.round(estado.lat / 5) * 5;
    $("#v-grad").textContent = g5 === 0 ? "0°" : Math.abs(g5) + "° " + (g5 > 0 ? "N" : "S");
    $("#cab-sub").textContent = `Latitud ${latTxt(estado.lat)} · ${H.fechaDeDia(estado.dia)} · ${fmtHora(estado.hora)} · foco ${estado.foco ? "encendido" : "apagado"}`;
    document.querySelectorAll("#chips-lat .chip").forEach((b) => b.classList.toggle("activo", Math.abs(+b.dataset.lat - estado.lat) < 0.05));
    document.querySelectorAll("#chips-fecha .chip").forEach((b) => b.classList.toggle("activo", +b.dataset.dia === estado.dia));
    const pz = H.piezas || {};
    document.querySelectorAll("#dock button").forEach((b) => {
      const a = b.dataset.accion;
      b.classList.toggle("activo", a === "piezas" ? !!pz.activo : a === "explosion" && pz.activo ? !!pz.explosion : !!estado[a] && a !== "inicio");
    });
  }
  function aplicarTema(t) {
    document.documentElement.dataset.tema = t;
    piso.material.opacity = t === "oscuro" ? 0.32 : 0.16;
    hemi.intensity = t === "oscuro" ? 0.5 : 0.62;
    try { localStorage.setItem("heliodon-tema", t); } catch (e) { /* sin almacenamiento */ }
  }
  let temaIni = "claro";
  try { temaIni = localStorage.getItem("heliodon-tema") || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro"); } catch (e) { /* */ }
  aplicarTema(temaIni);

  // ------------------------------------------------------------------ mouse: órbita, arrastre de piezas, tooltip
  const ray = new THREE.Raycaster();
  const puntero = new THREE.Vector2();
  let mouse = null, arrastre = null, hover = null, movido = false, ultimaMalla = null;
  function pick(x, y) {
    puntero.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
    ray.setFromCamera(puntero, camara);
    ultimaMalla = null;
    let hits = ray.intersectObjects(H.pickables, false);
    if (estado.caja && !estado.conexiones) {
      // con la caja abierta, lo que está adentro tiene prioridad sobre las paredes de la caja
      const cj = H.DIM.caja;
      const dentro = hits.find((h) => ["electronica", "cable"].includes(h.object.userData.capa) && h.point.x > H.mm(cj.x[0]) && h.point.x < H.mm(cj.x[1]) &&
        h.point.y > H.mm(cj.y[0]) && h.point.y < H.mm(cj.y[1]) && Math.abs(h.point.z) < 0.07);
      if (dentro && hits[0].object.userData.capa === "caja") hits = [dentro].concat(hits);
    }
    for (const h of hits) {
      let o = h.object, vis = true;
      while (o) { if (!o.visible) { vis = false; break; } o = o.parent; }
      if (!vis) continue;
      const m = Array.isArray(h.object.material) ? h.object.material[0] : h.object.material;
      if (m.opacity < 0.3 && anim.rayosx > 0.5) continue;
      if (m.opacity < 0.05) continue;
      if (H.piezas && H.piezas.activo && h.object.userData.pzFantasma) continue;
      ultimaMalla = h.object;
      return h.object.userData.comp;
    }
    return null;
  }
  const cv = renderer.domElement;
  cv.addEventListener("contextmenu", (e) => e.preventDefault());
  cv.addEventListener("pointerdown", (e) => {
    cv.setPointerCapture(e.pointerId);
    movido = false;
    const id = pick(e.clientX, e.clientY);
    const enPiezas = H.piezas && H.piezas.activo;
    const tipo = !enPiezas && id && H.comps[id] && H.comps[id].arrastre;
    const pan = e.button === 2 || e.shiftKey;
    arrastre = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, modo: pan ? "pan" : tipo && e.button === 0 ? tipo : "orbita", id, malla: ultimaMalla };
    if (tipo && !pan) { cv.style.cursor = "grabbing"; UI.tooltip(0, 0, null); }
  });
  cv.addEventListener("pointermove", (e) => {
    mouse = { x: e.clientX, y: e.clientY };
    if (!arrastre) return;
    const dx = e.clientX - arrastre.x, dy = e.clientY - arrastre.y;
    arrastre.x = e.clientX; arrastre.y = e.clientY;
    if (Math.abs(e.clientX - arrastre.x0) + Math.abs(e.clientY - arrastre.y0) > 4) movido = true;
    if (arrastre.modo === "orbita") orbita.rotar(dx, dy);
    else if (arrastre.modo === "pan") orbita.mover(dx, dy);
    else if (arrastre.modo === "latitud") app.set("lat", Math.max(-H.DIM.latMax, Math.min(H.DIM.latMax, +(estado.lat - dy * 0.3).toFixed(1))));
    else if (arrastre.modo === "hora") {
      const este = ref.aroPivot.localToWorld(new THREE.Vector3(0.48, 0, 0)).project(camara);
      const oeste = ref.aroPivot.localToWorld(new THREE.Vector3(-0.48, 0, 0)).project(camara);
      const s = este.x > oeste.x ? -1 : 1;
      app.set("hora", Math.max(6.5, Math.min(17.5, +(estado.hora + s * (dx - dy * 0.3) * 0.012).toFixed(2))));
    } else if (arrastre.modo === "giro") {
      let g = estado.giro + dx * 0.45;
      if (g > 180) g -= 360; if (g < -180) g += 360;
      app.set("giro", Math.round(g * 10) / 10);
    }
  });
  cv.addEventListener("pointerup", (e) => {
    if (arrastre && !movido && e.button === 0) {
      if (H.piezas && H.piezas.activo) H.piezas.clic(arrastre.malla);
      else app.seleccionar(arrastre.id || null);
    }
    arrastre = null; cv.style.cursor = "";
  });
  cv.addEventListener("pointerleave", () => { mouse = null; UI.tooltip(0, 0, null); });
  cv.addEventListener("wheel", (e) => { e.preventDefault(); orbita.zoom(e.deltaY); }, { passive: false });
  window.addEventListener("resize", () => {
    camara.aspect = window.innerWidth / window.innerHeight; camara.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" && e.target.type === "search") return;
    const k = e.key.toLowerCase();
    const mapa = { f: "foco", t: "techos", l: "levantar", c: "cables", x: "rayosx", e: "explosion", k: "conexiones", a: "caja", p: "paneles", m: "piezas" };
    if (mapa[k]) app.accion(mapa[k]);
    if (H.piezas && H.piezas.activo && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { e.preventDefault(); H.piezas.paso(e.key === "ArrowRight" ? 1 : -1); }
    if (e.key === "Escape") { $("#ayuda").classList.add("oculto"); app.accion("inicio"); }
  });

  // ------------------------------------------------------------------ bucle
  let ultimoSol = { alt: 0, az: 0 }, tAnt = performance.now(), tUI = 0, cableClave = "", tiempo = 0;
  const suave = (a, b, k) => a + (b - a) * k;
  const centroMesa = new THREE.Vector3(0, 0.93, 0);
  function cuadro(ahora) {
    const dt = Math.min(0.05, (ahora - tAnt) / 1000);
    tAnt = ahora; tiempo += dt;
    const k = 1 - Math.exp(-dt * 7), kl = 1 - Math.exp(-dt * 3.2);
    anim.lat = suave(anim.lat, estado.lat, k);
    anim.hora = suave(anim.hora, estado.hora, k);
    anim.decl = suave(anim.decl, H.declinacion(estado.dia), k);
    let dg = estado.giro - anim.giro; if (dg > 180) dg -= 360; if (dg < -180) dg += 360;
    anim.giro += dg * k;
    for (const [c, v] of [["lev", estado.levantar], ["techos", estado.techos], ["rayosx", estado.rayosx], ["explosion", estado.explosion], ["caja", estado.caja], ["foco", estado.foco]]) {
      const antes = anim[c];
      anim[c] = suave(anim[c], v ? 1 : 0, kl);
      if (Math.abs(anim[c] - (v ? 1 : 0)) < 0.002) anim[c] = v ? 1 : 0;
      if ((c === "explosion") && (antes > 0.02) !== (anim[c] > 0.02)) visibilidad();
    }
    const e = anim.explosion, ee = e * e * (3 - 2 * e);
    const le = anim.lev * anim.lev * (3 - 2 * anim.lev);
    // mecanismo
    ref.aroPivot.rotation.x = rad(anim.lat);
    ref.carroPivot.rotation.z = rad((anim.hora - 12) * 15);
    ref.declPivot.rotation.x = -rad(anim.decl);
    // maqueta, techos, caja, explosión
    ref.maquetaGiro.rotation.y = rad(anim.giro);
    ref.maquetaGiro.position.y = H.mm(900 + 330 * ee);
    ref.maqueta.position.y = H.mm(250) * le;
    ref.techos.forEach((t, i) => { t.position.y = H.mm(70 * (1 - anim.techos) + 110 * ee + 6 * i * ee); t.visible = anim.techos > 0.01 && !estado.conexiones; });
    ref.puerta.rotation.y = -rad(85) * Math.max(anim.caja, ee * 0.6);       // puerta frontal: bisagra vertical al Oeste
    ref.ruedas.position.y = -H.mm(120) * ee;
    ref.caballetes["102"].position.x = H.mm(170) * ee;
    ref.caballetes["103"].position.x = -H.mm(170) * ee;
    ref.mecanismo.position.y = H.mm(360) * ee;
    ref.mesa.position.y = H.mm(150) * ee;
    ref.caja.position.set(0, -H.mm(240) * ee, H.mm(430) * ee);
    ref.interior.position.z = H.mm(170) * ee;                                   // el interior sale por el frente
    ref.marcoMedio.position.y = -H.mm(70) * ee;
    const enPiezas = H.piezas && H.piezas.activo;
    if (anim.techos > 0.001 && anim.techos < 0.999 || rxAplicado !== anim.rayosx) { rxAplicado = -1; }
    if (!enPiezas) rayosX();
    // foco
    escena.updateMatrixWorld(true);
    const pLente = ref.lente.getWorldPosition(new THREE.Vector3());
    const dirHaz = new THREE.Vector3(0, -1, 0).transformDirection(ref.declPivot.matrixWorld);
    spot.position.copy(pLente);
    spot.target.position.copy(pLente).addScaledVector(dirHaz, 0.6);
    spot.intensity = 2.6 * anim.foco;
    ref.lente.material.emissiveIntensity = 0.05 + 1.6 * anim.foco;
    ref.cono.material.opacity = 0.05 * anim.foco;
    ref.cono.visible = anim.foco > 0.05 && !estado.conexiones && !enPiezas;
    ref.leds.ledAmbar.material.emissiveIntensity = 0.05 + 1.1 * anim.foco;
    if (ref.ledRele && ref.ledRele.material.emissive) ref.ledRele.material.emissiveIntensity = 0.05 + 0.9 * anim.foco;
    // cables móviles
    const clave = anim.hora.toFixed(3) + "|" + anim.decl.toFixed(3);
    if (clave !== cableClave) { cableClave = clave; H.actualizarCableFoco(); }
    H.actualizarColgantes(estado.cables && ee < 0.02 ? le * H.mm(250) : 0);
    // simulación
    const dirSol = pLente.clone().sub(centroMesa).normalize();
    ultimoSol = H.sim.paso(dt, dirSol, estado.foco, rad(anim.giro));
    ref.pisos.forEach((p, i) => p.material.color.copy(new THREE.Color(0xdcd3c0).lerp(H.colorLux(H.sim.lux[i]), 0.55)));
    if (enPiezas) H.piezas.cuadro(dt, camara);
    piso.visible = mancha.visible = !(enPiezas && H.piezas.kExp > 0.02);
    // interfaz
    orbita.actualizar();
    pulsoResaltado(tiempo);
    UI.etiquetas(camara, estado.etiquetas && !estado.conexiones && ee < 0.02 && !enPiezas, orbita.radio > 1.7);
    tUI += dt;
    if (tUI > 0.2) {
      tUI = 0;
      UI.actualizarCuartos();
      $("#v-alt").textContent = H.fmtNum(ultimoSol.alt) + "°";
      $("#v-az").textContent = Math.round(ultimoSol.az) + "°";
    }
    if (mouse && !arrastre) {
      const id = pick(mouse.x, mouse.y);
      if (enPiezas) {
        cv.style.cursor = H.piezas.entrada(ultimaMalla) ? "pointer" : "";
        H.piezas.tooltip(mouse.x, mouse.y, ultimaMalla);
      } else {
        if (id !== hover) { hover = id; cv.style.cursor = id && H.comps[id] && H.comps[id].arrastre ? "grab" : id ? "pointer" : ""; }
        UI.tooltip(mouse.x, mouse.y, id);
      }
    }
    renderer.render(escena, camara);
    requestAnimationFrame(cuadro);
  }

  // ------------------------------------------------------------------ inicio
  UI.iniciar(app);
  if (H.piezas) H.piezas.iniciarUI();
  sincronizarControles();
  visibilidad();
  H.actualizarCableFoco();
  progreso(100);
  orbita.radio = 4.2; orbita.theta = 1.1; orbita.phi = 1.05;
  requestAnimationFrame((t) => {
    tAnt = t;
    cuadro(t);
    setTimeout(() => { $("#inicio").classList.add("fuera"); VISTA_INICIO(); }, 700);
    setTimeout(() => UI.aviso("Arrastre la manija T (lado Este) para la latitud y el foco para la hora · pase el mouse sobre las piezas", 5200), 2200);
  });
})();
