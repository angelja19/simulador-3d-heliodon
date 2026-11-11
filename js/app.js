/* Aplicación: escena, luces, bucle de animación, estado, interacciones, calidad automática de las sombras
   y API de prueba (window.H.app). */
(function () {
  const H = window.H;
  const $ = (s) => document.querySelector(s);
  const rad = (g) => (g * Math.PI) / 180;
  const progreso = (p) => { const e = $("#inicio-progreso"); if (e) e.style.width = p + "%"; };

  const estado = { lat: -17.4, hora: 10, dia: 80, foco: true, giro: 0, levantar: false, techos: true, etiquetas: true,
    cables: true, rayosx: false, explosion: false, conexiones: false, caja: false, arduino: false, piezas: false, paneles: true,
    simTemp: true, simLuz: true };
  const anim = { grad: -17, hora: 10, decl: 0, giro: 0, lev: 0, techos: 1, rayosx: 0, explosion: 0, caja: 0, foco: 1, arduino: 0 };
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
  const spot = new THREE.SpotLight(0xfff0d2, 2.6, 0, rad(32), 0.55, 0);
  spot.castShadow = true;
  spot.shadow.mapSize.set(2048, 2048);
  spot.shadow.camera.near = 0.05; spot.shadow.camera.far = 2.4;
  spot.shadow.bias = -0.0003; spot.shadow.normalBias = 0.002;
  escena.add(spot, spot.target);
  H.spot = spot;

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
  ref.raiz.traverse((o) => {
    if (!o.isMesh) return;
    const ms = Array.isArray(o.material) ? o.material : [o.material];
    ms.forEach((m) => { m.userData.op0 = m.opacity; m.userData.tr0 = m.transparent; m.userData.dw0 = m.depthWrite;
      if (m.emissive) { m.userData.em0 = m.emissive.getHex(); m.userData.ei0 = m.emissiveIntensity; } });
  });

  // ------------------------------------------------------------------ calidad de las sombras (baja sola si va lento)
  const CALIDAD = [
    { nombre: "baja", mapa: 512, tipo: THREE.BasicShadowMap, ratio: 1, estudio: false },
    { nombre: "media", mapa: 1024, tipo: THREE.PCFShadowMap, ratio: Math.min(window.devicePixelRatio, 1.25), estudio: true },
    { nombre: "alta", mapa: 2048, tipo: THREE.PCFSoftShadowMap, ratio: Math.min(window.devicePixelRatio, 1.75), estudio: true },
  ];
  let calidad = 2;
  function ponerCalidad(n, aviso) {
    calidad = Math.max(0, Math.min(2, n));
    const q = CALIDAD[calidad];
    renderer.shadowMap.type = q.tipo;
    renderer.setPixelRatio(q.ratio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    [spot, estudio].forEach((l) => { l.shadow.mapSize.set(q.mapa, q.mapa); if (l.shadow.map) { l.shadow.map.dispose(); l.shadow.map = null; } });
    estudio.castShadow = q.estudio;
    escena.traverse((o) => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m.needsUpdate = true; }); });
    $("#nota-calidad").textContent = "Calidad de sombras: " + q.nombre + (calidad < 2 ? " (bajada sola para ir fluido)" : "");
    if (aviso) UI.aviso("Sombras en calidad " + q.nombre + " para que vaya fluido", 2600);
  }
  const medidor = { t: 0, cuadros: 0, espera: 2.5, fps: 60 };
  function medirFluidez(dt) {
    if (document.visibilityState !== "visible" || dt > 0.25) return;
    if (medidor.espera > 0) { medidor.espera -= dt; return; }
    medidor.t += dt; medidor.cuadros++;
    if (medidor.t >= 3) {
      medidor.fps = medidor.cuadros / medidor.t;
      if (medidor.fps < 40 && calidad > 0) { ponerCalidad(calidad - 1, true); medidor.espera = 2; }
      medidor.t = 0; medidor.cuadros = 0;
    }
  }

  // ------------------------------------------------------------------ vistas
  const CAPAS_RX = new Set(["estructura", "mecanismo", "soporte", "maqueta", "techo", "caja", "kit"]);
  const CAPAS_CONEX = new Set(["sensor", "electronica", "cable", "foco"]);
  function visibilidad() {
    const e = anim.explosion > 0.02;
    ref.raiz.traverse((o) => {
      if (!o.isMesh || o.userData.capa == null) return;
      const c = o.userData.capa;
      let v = !estado.conexiones || CAPAS_CONEX.has(c) || o.userData.comp === "enchufe" || o.userData.comp === "laptop";
      if (c === "cable") v = v && estado.cables && !e;
      o.visible = v;
    });
    ref.cono.visible = anim.foco > 0.05 && !estado.conexiones;
    if (ref.colgantes) ref.colgantes.visible = ref.colgantes.visible && estado.cables && !e;
    spot.castShadow = !estado.conexiones;
    renovarSombras();
  }
  function renovarSombras() { [spot, estudio].forEach((l) => { if (l.shadow.map) { l.shadow.map.dispose(); l.shadow.map = null; } }); }
  let rxAplicado = -1;
  function rayosX() {
    const k = anim.rayosx;
    if (Math.abs(k - rxAplicado) < 0.004 && !(rxAplicado < 0)) return;
    if ((k < 0.5) !== (rxAplicado < 0.5) && rxAplicado >= 0) renovarSombras();
    rxAplicado = k;
    ref.raiz.traverse((o) => {
      if (!o.isMesh || !CAPAS_RX.has(o.userData.capa)) return;
      const ms = Array.isArray(o.material) ? o.material : [o.material];
      ms.forEach((m) => {
        const base = m.userData.op0 == null ? 1 : m.userData.op0;
        const techo = o.userData.capa === "techo" ? anim.techos : 1;
        const tapa = o.userData.comp === "305b" ? 1 - 0.88 * anim.arduino : 1;
        m.opacity = base * techo * tapa * (1 - 0.87 * k);
        const tr = m.userData.tr0 || k > 0.001 || techo < 0.999 || tapa < 0.999;
        if (m.transparent !== tr) { m.transparent = tr; m.needsUpdate = true; }
        m.depthWrite = k < 0.5 && tapa > 0.5 && m.userData.dw0 !== false;
      });
      o.castShadow = k < 0.5 && !(o.userData.comp === "305b" && anim.arduino > 0.5);
    });
  }

  // ------------------------------------------------------------------ resaltado
  let resaltados = [];
  function resaltar(ids) {
    resaltados.forEach((m) => { m.emissive.setHex(m.userData.em0); m.emissiveIntensity = m.userData.ei0; });
    resaltados = [];
    ids.filter(Boolean).forEach((id) => (H.comps[id] ? H.comps[id].objetos : []).forEach((ob) => ob.traverse((o) => {
      if (!o.isMesh) return;
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { if (m.emissive && !resaltados.includes(m)) resaltados.push(m); });
    })));
  }
  function pulsoResaltado(t) {
    const k = 0.32 + 0.22 * Math.sin(t * 5);
    resaltados.forEach((m) => { m.emissive.setHex(0x007aff); m.emissiveIntensity = k; });
  }
  function cajaDe(ids) {
    const b = new THREE.Box3();
    ref.raiz.updateMatrixWorld(true);
    ids.forEach((id) => (H.comps[id] ? H.comps[id].objetos : []).forEach((o) => { if (o.visible !== false) b.expandByObject(o); }));
    return b;
  }

  // ------------------------------------------------------------------ acciones
  const VISTA_INICIO = () => orbita.volarA(new THREE.Vector3(0, 0.62, 0), Math.min(7.2, 3.3 * H.factorPantalla()), 0.72, 1.12);
  const VISTA_ARDUINO = () => orbita.volarA(new THREE.Vector3(0.49, 0.385, 0.0), 0.56 * Math.max(1, H.factorPantalla() * 0.9), -1.22, 1.36, 1300);
  let seleccion = null, hover = null;
  const UI = H.UI;
  const app = (H.app = {
    estado, anim, orbita, camara, renderer, escena,
    set(clave, valor) {
      estado[clave] = valor;
      sincronizarControles();
      if (clave === "explosion" || clave === "conexiones" || clave === "cables") visibilidad();
      if (clave === "conexiones" && valor) { orbita.volarA(new THREE.Vector3(0.2, 0.6, 0), 3.0, 0.9, 1.05); UI.aviso("Solo conexiones: el Arduino, los sensores y los cables"); }
      if (clave === "explosion" && valor) { orbita.volarA(new THREE.Vector3(0, 0.75, 0.1), 4.0, 0.75, 1.12); UI.aviso("Vista explosionada (los cables se ocultan mientras está separada)"); }
      if (clave === "caja" && valor) { VISTA_ARDUINO(); UI.aviso("Tapa de la caja abierta (bisagra al lado Norte)"); }
      if (clave === "levantar" && valor) { orbita.volarA(new THREE.Vector3(0, 1.0, 0), 1.25, 0.6, 1.2); UI.aviso("Maqueta levantada: se ven los cables que bajan por el pin"); }
      if (clave === "techos") UI.aviso(valor ? "Techos puestos" : "Techos quitados: se ven los DS18B20 de cada cuarto");
      if (clave === "rayosx") UI.aviso(valor ? "Rayos X: se ven los cables por dentro de los tubos" : "Rayos X apagado");
      if (clave === "arduino") {
        if (valor) { VISTA_ARDUINO(); UI.aviso("Caja del Arduino: tapa transparente · toque un componente para ver qué hace y a qué pin va", 3600); }
        else { VISTA_INICIO(); app.seleccionar(null); }
      }
      if (clave === "piezas") {
        document.body.classList.toggle("modo-piezas", valor);
        UI.aviso(valor ? "Piezas: pase el mouse sobre una pieza para resaltarla; tóquela y pulse «Aislar»" : "Modo Piezas apagado", 3000);
        if (!valor) { hover = null; resaltar([seleccion]); }
      }
      if (clave === "simTemp" || clave === "simLuz") UI.actualizarCuartos();
    },
    accion(n) {
      if (H.aislar.activo) { if (n === "inicio") H.aislar.cerrar(); return; }
      const t = { foco: "foco", techos: "techos", levantar: "levantar", cables: "cables", rayosx: "rayosx", explosion: "explosion", conexiones: "conexiones", caja: "caja", arduino: "arduino", piezas: "piezas" };
      if (n === "inicio") { if (estado.arduino) app.set("arduino", false); VISTA_INICIO(); app.seleccionar(null); return; }
      if (n === "paneles") {
        if (H.movil()) {
          const b = document.body, sig = b.classList.contains("movil-izq") ? "der" : b.classList.contains("movil-der") ? "" : "izq";
          b.classList.remove("movil-izq", "movil-der");
          if (sig) b.classList.add("movil-" + sig);
          estado.paneles = !!sig; sincronizarControles();
          UI.aviso(!sig ? "Paneles ocultos" : sig === "izq" ? "Controles" : "Cuartos, componentes y cables", 1400);
          return;
        }
        app.set("paneles", !estado.paneles); document.body.classList.toggle("sin-paneles", !estado.paneles); return;
      }
      if (t[n]) app.set(t[n], !estado[t[n]]);
    },
    /** Elige un componente: lo resalta, muestra su tarjeta (con «Aislar») y, fuera de los modos Piezas y Arduino, lo enfoca. */
    seleccionar(id, sinVuelo) {
      seleccion = id;
      UI.marcarSeleccion(id);
      UI.tarjetaSel(id);
      resaltar([id, estado.piezas ? hover : null]);
      if (!id) return;
      if (!sinVuelo && !estado.piezas && !estado.arduino) {
        const b = cajaDe([id]);
        if (!b.isEmpty()) {
          const c = b.getCenter(new THREE.Vector3()), s = b.getSize(new THREE.Vector3()).length();
          orbita.volarA(c, Math.min(3.6, Math.max(0.16, s * 1.9)), null, null);
        }
      }
    },
    aislar(id) { return H.aislar.abrir(id); },
    volver() { H.aislar.cerrar(); },
    calidad(n) { if (n != null) ponerCalidad(n, false); return { nivel: calidad, nombre: CALIDAD[calidad].nombre, fps: Math.round(medidor.fps) }; },
    info() {
      const comps = Object.values(H.comps).filter((c) => c.objetos.length);
      return {
        estado: Object.assign({}, estado), lux: H.sim.lux.map((v) => Math.round(v)), temp: H.sim.temp.map((v) => +v.toFixed(2)),
        sol: Object.assign({}, ultimoSol), graduador: H.graduador(estado.lat, H.declinacion(estado.dia)).texto,
        aroGrados: +(ref.aroPivot.rotation.x * 180 / Math.PI).toFixed(2), carroGrados: +(ref.carroPivot.rotation.z * 180 / Math.PI).toFixed(2),
        componentes: comps.length, piezasSinModelo: H.PIEZAS.filter((p) => !H.comps[p.id] || !H.comps[p.id].objetos.length).map((p) => p.id),
        cablesSinModelo: Object.keys(H.CABLES).filter((k) => !H.comps[k] || !H.comps[k].objetos.length),
        aislado: H.aislar.info ? H.aislar.info() : null, calidad: app.calidad(), seleccion,
        cuartosTexto: H.CUARTOS.map((c, i) => $("#lux-" + i).textContent + " | " + $("#temp-" + i).textContent),
        llamadas: renderer.info.render.calls, triangulos: renderer.info.render.triangles,
      };
    },
  });

  // ------------------------------------------------------------------ controles HTML
  const ctl = { lat: $("#s-lat"), hora: $("#s-hora"), dia: $("#s-dia"), giro: $("#s-giro") };
  const tg = { foco: "#t-foco", levantar: "#t-levantar", techos: "#t-techos", etiquetas: "#t-etiquetas", cables: "#t-cables",
    rayosx: "#t-rayosx", explosion: "#t-explosion", conexiones: "#t-conexiones", caja: "#t-caja", simTemp: "#t-simTemp", simLuz: "#t-simLuz" };
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
    const decl = H.declinacion(estado.dia), g = H.graduador(estado.lat, decl);
    $("#v-lat").textContent = latTxt(estado.lat);
    $("#v-hora").textContent = fmtHora(estado.hora);
    $("#v-fecha").textContent = `${H.fechaDeDia(estado.dia)} · δ ${H.fmtNum(decl)}°`;
    $("#v-giro").textContent = Math.round(estado.giro) + "°";
    $("#v-grad").textContent = g.texto;
    $("#nota-grad").textContent = `Graduador = |φ − δ| = |${H.fmtNum(estado.lat)}° − (${H.fmtNum(decl)}°)| = ${H.fmtNum(Math.abs(g.exacto))}° → ${g.texto}`;
    $("#cab-sub").textContent = `Latitud ${latTxt(estado.lat)} · ${H.fechaDeDia(estado.dia)} · ${fmtHora(estado.hora)} · graduador ${g.texto} · foco ${estado.foco ? "encendido" : "apagado"}`;
    document.querySelectorAll("#chips-lat .chip").forEach((b) => b.classList.toggle("activo", Math.abs(+b.dataset.lat - estado.lat) < 0.05));
    document.querySelectorAll("#chips-fecha .chip").forEach((b) => b.classList.toggle("activo", +b.dataset.dia === estado.dia));
    document.querySelectorAll("#dock button").forEach((b) => { const a = b.dataset.accion; b.classList.toggle("activo", !!estado[a] && a !== "inicio"); });
  }
  function aplicarTema(t) {
    document.documentElement.dataset.tema = t;
    piso.material.opacity = t === "oscuro" ? 0.32 : 0.16;
    hemi.intensity = t === "oscuro" ? 0.5 : 0.62;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = t === "oscuro" ? "#000000" : "#f2f2f7";
    try { localStorage.setItem("heliodon-tema", t); } catch (e) { /* sin almacenamiento */ }
  }
  let temaIni = "claro";
  try { temaIni = localStorage.getItem("heliodon-tema") || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro"); } catch (e) { /* */ }
  aplicarTema(temaIni);
  app.tema = aplicarTema;

  // ------------------------------------------------------------------ mouse: órbita, arrastre de piezas, tooltip
  const ray = new THREE.Raycaster();
  const puntero = new THREE.Vector2();
  let mouse = null, arrastre = null, movido = false;
  function pick(x, y) {
    puntero.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
    ray.setFromCamera(puntero, camara);
    for (const h of ray.intersectObjects(H.pickables, false)) {
      let o = h.object, vis = true;
      while (o) { if (!o.visible) { vis = false; break; } o = o.parent; }
      if (!vis) continue;
      const m = Array.isArray(h.object.material) ? h.object.material[0] : h.object.material;
      if (m.opacity < 0.3) continue;
      return h.object.userData.comp;
    }
    return null;
  }
  const cv = renderer.domElement;
  const orb = () => (H.aislar.activo ? H.aislar.orbita : orbita);
  cv.addEventListener("contextmenu", (e) => e.preventDefault());
  cv.addEventListener("pointerdown", (e) => {
    cv.setPointerCapture(e.pointerId);
    movido = false;
    const pan = e.button === 2 || e.shiftKey;
    if (H.aislar.activo) { arrastre = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, modo: pan ? "pan" : "orbita" }; return; }
    const id = pick(e.clientX, e.clientY);
    const tipo = !estado.piezas && id && H.comps[id] && H.comps[id].arrastre;
    arrastre = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, modo: pan ? "pan" : tipo && e.button === 0 ? tipo : "orbita", id };
    if (tipo && !pan) { cv.style.cursor = "grabbing"; UI.tooltip(0, 0, null); }
  });
  cv.addEventListener("pointermove", (e) => {
    mouse = { x: e.clientX, y: e.clientY };
    if (!arrastre) return;
    const dx = e.clientX - arrastre.x, dy = e.clientY - arrastre.y;
    arrastre.x = e.clientX; arrastre.y = e.clientY;
    if (Math.abs(e.clientX - arrastre.x0) + Math.abs(e.clientY - arrastre.y0) > 4) movido = true;
    if (arrastre.modo === "orbita") orb().rotar(dx, dy);
    else if (arrastre.modo === "pan") orb().mover(dx, dy);
    else if (arrastre.modo === "latitud") app.set("lat", Math.max(-90, Math.min(90, +(estado.lat - dy * 0.3).toFixed(1))));
    else if (arrastre.modo === "hora") {
      const este = ref.aroPivot.localToWorld(new THREE.Vector3(0.48, 0, 0)).project(camara);
      const oeste = ref.aroPivot.localToWorld(new THREE.Vector3(-0.48, 0, 0)).project(camara);
      const s = este.x > oeste.x ? -1 : 1;
      app.set("hora", Math.max(7, Math.min(17, +(estado.hora + s * (dx - dy * 0.3) * 0.012).toFixed(2))));
    } else if (arrastre.modo === "giro") {
      let g = estado.giro + dx * 0.45;
      if (g > 180) g -= 360; if (g < -180) g += 360;
      app.set("giro", Math.round(g * 10) / 10);
    }
  });
  cv.addEventListener("pointerup", (e) => {
    if (arrastre && !movido && e.button === 0 && !H.aislar.activo) app.seleccionar(arrastre.id || null);
    if (arrastre && ["hora", "latitud"].includes(arrastre.modo) && estado.hora !== +ctl.hora.value) sincronizarControles();
    arrastre = null; cv.style.cursor = "";
  });
  cv.addEventListener("pointerleave", () => { mouse = null; UI.tooltip(0, 0, null); });
  cv.addEventListener("wheel", (e) => { e.preventDefault(); orb().zoom(e.deltaY); }, { passive: false });
  window.addEventListener("resize", () => {
    camara.aspect = window.innerWidth / window.innerHeight; camara.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" && e.target.type === "search") return;
    if (e.key === "Escape") {
      $("#ayuda").classList.add("oculto");
      if (H.aislar.activo) H.aislar.cerrar(); else if (seleccion) app.seleccionar(null); else app.accion("inicio");
      return;
    }
    const mapa = { f: "foco", t: "techos", l: "levantar", c: "cables", x: "rayosx", e: "explosion", k: "conexiones", a: "caja", u: "arduino", p: "paneles", m: "piezas" };
    const k = e.key.toLowerCase();
    if (mapa[k] && !e.ctrlKey && !e.metaKey && !e.altKey) app.accion(mapa[k]);
  });

  // ------------------------------------------------------------------ bucle
  let ultimoSol = { alt: 0, az: 0 }, tAnt = performance.now(), tUI = 0, cableClave = "", tiempo = 0;
  const suave = (a, b, k) => a + (b - a) * k;
  const centroMesa = new THREE.Vector3(0, 0.95, 0);
  const pos0 = new Map();
  const mover = (o, x, y, z) => { if (!pos0.has(o)) pos0.set(o, o.position.clone()); o.position.copy(pos0.get(o)).add(new THREE.Vector3(H.mm(x), H.mm(y), H.mm(z))); };
  function cuadro(ahora) {
    const dt = Math.min(0.05, (ahora - tAnt) / 1000);
    medirFluidez((ahora - tAnt) / 1000);
    tAnt = ahora; tiempo += dt;
    const k = 1 - Math.exp(-dt * 6), kl = 1 - Math.exp(-dt * 3.2);
    const decl = H.declinacion(estado.dia);
    anim.grad = suave(anim.grad, H.graduador(estado.lat, decl).valor, k);
    anim.hora = suave(anim.hora, estado.hora, k);
    anim.decl = suave(anim.decl, decl, k);
    let dg = estado.giro - anim.giro; if (dg > 180) dg -= 360; if (dg < -180) dg += 360;
    anim.giro += dg * k;
    for (const [c, v] of [["lev", estado.levantar], ["techos", estado.techos], ["rayosx", estado.rayosx], ["explosion", estado.explosion], ["caja", estado.caja], ["foco", estado.foco], ["arduino", estado.arduino]]) {
      const antes = anim[c];
      anim[c] = suave(anim[c], v ? 1 : 0, kl);
      if (Math.abs(anim[c] - (v ? 1 : 0)) < 0.002) anim[c] = v ? 1 : 0;
      if (c === "explosion" && (antes > 0.02) !== (anim[c] > 0.02)) visibilidad();
      if (c === "arduino" && antes !== anim[c]) rxAplicado = -1;
    }
    const e = anim.explosion, ee = e * e * (3 - 2 * e);
    const le = anim.lev * anim.lev * (3 - 2 * anim.lev);
    // mecanismo: aro inclinado en el graduador, carro con la hora, foco en el arco de declinación
    ref.aroPivot.rotation.x = rad(anim.grad);
    ref.carroPivot.rotation.z = rad((anim.hora - 12) * 15);
    ref.declPivot.rotation.x = -rad(anim.decl);
    // maqueta, techos, caja, explosión
    ref.maquetaGiro.rotation.y = rad(anim.giro);
    ref.maquetaGiro.position.y = H.mm(900 + 330 * ee);
    ref.maqueta.position.y = H.mm(250) * le;
    ref.techos.forEach((t, i) => { t.position.y = H.mm(70 * (1 - anim.techos) + 110 * ee + 6 * i * ee); t.visible = anim.techos > 0.01 && !estado.conexiones; });
    ref.tapaPivot.rotation.y = -rad(100) * Math.max(anim.caja, ee * 0.5);
    mover(ref.ruedas, 0, -120 * ee, 0);
    mover(ref.caballetes["102"], 170 * ee, 0, 0);
    mover(ref.caballetes["103"], -170 * ee, 0, 0);
    ref.inferiores.forEach((t, i) => mover(t, 0, -40 * ee, (i ? 1 : -1) * 140 * ee));
    mover(ref.mecanismo, 0, 360 * ee, 0);
    mover(ref.mesa, 0, 150 * ee, 0);
    mover(ref.caja, -260 * ee, 0, 0);
    mover(ref.interior, -110 * ee, 0, 0);
    if (anim.techos > 0.001 && anim.techos < 0.999) rxAplicado = -1;
    rayosX();
    // foco
    escena.updateMatrixWorld(true);
    const pLente = ref.lente.getWorldPosition(new THREE.Vector3());
    const dirHaz = new THREE.Vector3(0, -1, 0).transformDirection(ref.declPivot.matrixWorld);
    spot.position.copy(pLente);
    spot.target.position.copy(pLente).addScaledVector(dirHaz, 0.6);
    spot.intensity = 2.6 * anim.foco;
    ref.lente.material.emissiveIntensity = 0.05 + 1.6 * anim.foco;
    ref.cono.material.opacity = 0.05 * anim.foco;
    ref.cono.visible = anim.foco > 0.05 && !estado.conexiones;
    ref.ledLente.material.emissiveIntensity = 0.05 + 1.4 * anim.foco;
    ref.ledRele.material.emissiveIntensity = 0.05 + 0.9 * anim.foco;
    const clave = anim.hora.toFixed(3) + "|" + anim.decl.toFixed(3);
    if (clave !== cableClave) { cableClave = clave; H.actualizarCableFoco(); }
    H.actualizarColgantes(estado.cables && ee < 0.02 ? le * H.mm(250) : 0);
    // simulación: luz y temperatura con la dirección real del haz del foco; altura y azimut del Sol verdadero
    const dirFoco = pLente.clone().sub(centroMesa).normalize();
    H.sim.paso(dt, dirFoco, estado.foco, rad(anim.giro));
    ultimoSol = H.alturaAzimut(H.direccionSol(estado.lat, estado.hora, decl));
    const gris = new THREE.Color(0xdcd3c0);
    ref.pisos.forEach((p, i) => p.material.color.copy(estado.simLuz ? gris.clone().lerp(H.colorLux(H.sim.lux[i]), 0.55) : gris));
    piso.visible = mancha.visible = ee < 0.5;
    // interfaz
    if (H.aislar.activo) {
      H.aislar.cuadro();
      UI.etiquetas(camara, false); UI.etiquetasArduino(camara, false);
      H.aislar.render(renderer);
    } else {
      orbita.actualizar();
      if (mouse && !arrastre) {
        const id = pick(mouse.x, mouse.y);
        if (id !== hover) {
          hover = id;
          cv.style.cursor = id && !estado.piezas && H.comps[id] && H.comps[id].arrastre ? "grab" : id ? "pointer" : "";
          if (estado.piezas) resaltar([seleccion, hover]);
        }
        UI.tooltip(mouse.x, mouse.y, id, estado.piezas);
      }
      pulsoResaltado(tiempo);
      UI.etiquetas(camara, estado.etiquetas && !estado.conexiones && ee < 0.02 && anim.arduino < 0.5, orbita.radio > 1.7);
      UI.etiquetasArduino(camara, estado.etiquetas && anim.arduino > 0.9 && ee < 0.02);
      renderer.render(escena, camara);
    }
    tUI += dt;
    if (tUI > 0.2) {
      tUI = 0;
      UI.actualizarCuartos();
      $("#v-alt").textContent = H.fmtNum(ultimoSol.alt) + "°";
      $("#v-az").textContent = Math.round(ultimoSol.az) + "°";
    }
    requestAnimationFrame(cuadro);
  }

  // ------------------------------------------------------------------ inicio
  UI.iniciar(app);
  sincronizarControles();
  visibilidad();
  H.actualizarCableFoco();
  const q = new URLSearchParams(location.search).get("calidad");
  if (q != null && CALIDAD[+q]) { ponerCalidad(+q, false); medidor.espera = Infinity; }
  progreso(100);
  orbita.radio = Math.min(7.4, 4.4 * H.factorPantalla()); orbita.theta = 1.1; orbita.phi = 1.05; orbita.objetivo.set(0, 0.62, 0);
  if (H.movil()) { estado.paneles = false; sincronizarControles(); }
  requestAnimationFrame((t) => {
    tAnt = t;
    cuadro(t);
    setTimeout(() => { $("#inicio").classList.add("fuera"); VISTA_INICIO(); }, 700);
    setTimeout(() => UI.aviso("Arrastre la manija naranja del graduador (latitud) y el carro (hora) · botón «Piezas» para aislar", 5200), 2200);
  });
})();
