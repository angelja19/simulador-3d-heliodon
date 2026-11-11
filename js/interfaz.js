/* Interfaz: paneles (Cuartos, Componentes, Cables), tooltip, tarjeta de selección, etiquetas de los cuartos y de la
   caja del Arduino, y avisos. */
(function () {
  const H = window.H;
  const $ = (s) => document.querySelector(s);
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const hex = (n) => "#" + n.toString(16).padStart(6, "0");
  const masaTxt = (m) => (m == null ? "—" : m < 0.1 ? Math.round(m * 1000) + " g" : m.toFixed(3).replace(".", ",") + " kg");
  const metros = (mm) => (mm == null ? "—" : (mm / 1000).toFixed(2).replace(".", ",") + " m");
  const ORDEN_CABLES = ["313", "308d", "206c", "314", "315", "311", "cablesDS", "308c"];

  const UI = (H.UI = {
    iniciar(app) {
      this.app = app;
      this.listaCuartos();
      this.listaComponentes("");
      this.listaCables();
      document.querySelectorAll(".segmentado button").forEach((b) => b.addEventListener("click", () => this.pestana(b.dataset.pestana)));
      $("#buscar").addEventListener("input", (e) => this.listaComponentes(e.target.value));
      document.querySelectorAll("input[type=range]").forEach((r) => { this.relleno(r); r.addEventListener("input", () => this.relleno(r)); });
      $("#sel-aislar").addEventListener("click", () => { const id = this._sel; this.tarjetaSel(null); if (id) H.aislar.abrir(id); });
      $("#sel-cerrar").addEventListener("click", () => app.seleccionar(null));
    },
    pestana(n) {
      document.querySelectorAll(".segmentado button").forEach((b) => { const a = b.dataset.pestana === n; b.classList.toggle("activo", a); b.setAttribute("aria-selected", a); });
      document.querySelector(".segmentado").style.setProperty("--i", ["cuartos", "componentes", "cables"].indexOf(n));
      ["cuartos", "componentes", "cables"].forEach((p) => $("#pestana-" + p).classList.toggle("oculto", p !== n));
      if (n === "cables") this.listaCables();
    },
    relleno(r) { r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min)) * 100 + "%"); },

    // ------------------------------------------------------------ cuartos (luz y temperatura)
    listaCuartos() {
      $("#lista-cuartos").innerHTML = H.CUARTOS.map((c, i) => `
        <div class="cuarto" data-cuarto="${i}" role="button" tabindex="0">
          <span class="num" style="background:${c.color}">${c.n}</span>
          <span class="nom">Cuarto ${c.n} · ${c.pos}</span>
          <span class="val" id="lux-${i}">—</span>
          <span class="barra"><i id="barra-${i}"></i></span>
          <span class="temp" id="temp-${i}">—</span>
        </div>`).join("");
      document.querySelectorAll(".cuarto").forEach((el) => el.addEventListener("click", () => this.app.seleccionar("304_" + (+el.dataset.cuarto + 1))));
    },
    actualizarCuartos() {
      const e = H.estado, max = Math.max(...H.sim.lux);
      H.CUARTOS.forEach((c, i) => {
        const lx = H.sim.lux[i], t = H.sim.temp[i];
        $("#lux-" + i).textContent = e.simLuz ? H.fmtLux(lx) : "—";
        const b = $("#barra-" + i);
        b.style.width = (e.simLuz ? Math.max(2, Math.min(100, (Math.log10(Math.max(1, lx)) / 4) * 100)) : 0) + "%";
        b.style.background = "#" + H.colorLux(lx).getHexString();
        const tt = e.simTemp ? H.fmtNum(t) + " °C" : "— °C";
        const nivel = e.simLuz ? " · " + H.nivelLuz(lx)[0] + (lx >= max - 0.5 && max > 400 ? " · el más iluminado" : "") : "";
        $("#temp-" + i).textContent = tt + nivel;
      });
      $("#nota-cuartos").textContent = !e.simLuz && !e.simTemp ? "Los dos sensores están apagados en «Simulación»."
        : "Luz y temperatura simuladas según la posición del foco" + (!e.simLuz ? " (sensor de luz apagado)" : !e.simTemp ? " (sensor de temperatura apagado)" : "") + ".";
    },

    // ------------------------------------------------------------ componentes (todas las piezas por grupo)
    listaComponentes(filtro) {
      const f = filtro.trim().toLowerCase();
      const html = H.GRUPOS.map((g) => {
        const ps = H.PIEZAS.filter((p) => p.grupo === g && H.comps[p.id] && H.comps[p.id].objetos.length &&
          (!f || [p.nombre, p.cod, p.material, p.perfil, Object.values(p.medidas || {}).join(" ")].join(" ").toLowerCase().includes(f)));
        if (!ps.length) return "";
        const masa = ps.reduce((a, p) => a + (p.masa || 0) * p.cant, 0);
        return `<div class="grupo-comp"><span>${esc(g)}</span><span>${ps.length} · ${masa.toFixed(2).replace(".", ",")} kg</span></div>` + ps.map((p) => {
          const m = p.medidas || {}, med = m.largo || m.diametro || m.alto || "";
          return `<div class="item-comp" data-id="${esc(p.id)}" role="button" tabindex="0" title="Aislar ${esc(p.nombre)}">
            <span class="cod">${esc(p.cod)}</span>
            <span class="txt">${esc(p.nombre)}<span class="sub">${esc(p.material)}${med ? " · " + esc(med.split(" (")[0]) : ""}</span></span>
            <span class="der"><b>×${p.cant}</b><span>${masaTxt(p.masa)}</span></span></div>`;
        }).join("");
      }).join("");
      $("#lista-componentes").innerHTML = html || `<p class="nota">Ninguna pieza coincide.</p>`;
      $("#lista-componentes").querySelectorAll(".item-comp").forEach((el) => {
        const ir = () => H.aislar.abrir(el.dataset.id);
        el.addEventListener("click", ir);
        el.addEventListener("keydown", (ev) => { if (ev.key === "Enter") ir(); });
      });
    },
    // ------------------------------------------------------------ cables (todos, también los del Arduino)
    listaCables() {
      const ids = ORDEN_CABLES.concat(H.CABLES_CAJA.map((c) => c[0])).filter((id) => H.comps[id] && H.comps[id].objetos.length);
      const fila = (id) => {
        const k = H.CABLES[id], c = H.comps[id];
        const col = k.colorHex != null ? k.colorHex : H.TIPOS[k.tipo].color;
        return `<div class="item-comp" data-id="${esc(id)}" role="button" tabindex="0" title="Aislar ${esc(k.nombre)}">
          <span class="punto" style="background:${hex(col)}"></span>
          <span class="txt">${esc(k.nombre)}<span class="sub">${esc(k.clase)} · ${esc(k.awg)} · ${metros(c.largo)}</span><span class="sub">${esc(k.recorrido)}</span></span>
          <span class="der"><b>${esc(k.color.split(" (")[0])}</b><span>${k.hilos} hilo${k.hilos > 1 ? "s" : ""}</span></span></div>`;
      };
      const largos = ids.filter((id) => !H.CABLES_CAJA.some((c) => c[0] === id)), caja = ids.filter((id) => !largos.includes(id));
      $("#lista-cables").innerHTML = `<div class="grupo-comp"><span>Por los tubos y la maqueta</span><span>${largos.length}</span></div>` + largos.map(fila).join("") +
        `<div class="grupo-comp"><span>Dentro de la caja del Arduino</span><span>${caja.length}</span></div>` + caja.map(fila).join("");
      $("#lista-cables").querySelectorAll(".item-comp").forEach((el) => {
        const ir = () => H.aislar.abrir(el.dataset.id);
        el.addEventListener("click", ir);
        el.addEventListener("keydown", (ev) => { if (ev.key === "Enter") ir(); });
      });
    },
    marcarSeleccion(id) {
      document.querySelectorAll(".item-comp").forEach((el) => el.classList.toggle("sel", el.dataset.id === id));
    },

    // ------------------------------------------------------------ tarjeta de la pieza elegida (con «Aislar»)
    tarjetaSel(id) {
      const t = $("#tarjeta-sel");
      this._sel = id;
      if (!id || !H.comps[id]) { t.classList.remove("visible"); return; }
      const c = H.comps[id], p = H.pieza(c.pieza || id), a = H.ARDUINO[id];
      $("#sel-cod").textContent = c.codigo || "—";
      $("#sel-nombre").textContent = c.nombre;
      $("#sel-mat").textContent = c.cable ? (H.CABLES[id] || {}).clase + " · " + metros(c.largo) : (c.material || "") + (p && p.masa ? " · " + masaTxt(p.masa) : "") + (p && p.cant > 1 ? " · ×" + p.cant : "");
      $("#sel-ard").innerHTML = a ? `<p><b>Qué hace:</b> ${esc(a.hace)}</p><p><b>Pin:</b> ${esc(a.pin)}</p>` : c.conexion ? `<p>${esc(c.conexion)}</p>` : "";
      t.classList.add("visible");
    },

    // ------------------------------------------------------------ tooltip
    tooltip(x, y, id, piezas) {
      const t = $("#tooltip");
      if (!id || !H.comps[id]) { t.classList.add("oculto"); return; }
      const c = H.comps[id], e = H.estado;
      let extra = "";
      if (c.cuarto != null) {
        const i = c.cuarto;
        extra = `<div class="tt-fila">Cuarto <b>${i + 1}</b> · luz <b>${e.simLuz ? H.fmtLux(H.sim.lux[i]) : "—"}</b> · <b>${e.simTemp ? H.fmtNum(H.sim.temp[i]) + " °C" : "—"}</b></div>`;
      }
      const fila = (k, v) => (v ? `<div class="tt-fila">${k}: <b>${esc(v)}</b></div>` : "");
      const tipo = c.tipo && H.TIPOS[c.tipo] ? " · " + H.TIPOS[c.tipo].nombre : "";
      t.innerHTML = `<div class="tt-codigo">N° ${esc(c.codigo || "—")}${esc(tipo)}</div>
        <div class="tt-titulo">${esc(c.nombre)}</div>
        ${fila("Material", c.material)}
        ${piezas ? "" : (c.funcion ? `<div class="tt-fila">${esc(c.funcion)}</div>` : "") + fila(c.cable ? "Va" : "Conexión", c.conexion)}${extra}
        <div class="tt-pista">${c.arrastre && !piezas ? esc(c.funcion_extra || "Arrastre para moverlo") : "Toque para ver la tarjeta y «Aislar»"}</div>`;
      t.classList.remove("oculto");
      const w = t.offsetWidth, h = t.offsetHeight;
      t.style.left = Math.min(window.innerWidth - w - 12, x + 16) + "px";
      t.style.top = Math.min(window.innerHeight - h - 12, y + 16) + "px";
    },

    // ------------------------------------------------------------ etiquetas de los cuartos
    etiquetas(camara, visibles, compactas) {
      const cont = $("#etiquetas");
      if (!this._etq) {
        this._etq = H.CUARTOS.map((c) => {
          const e = document.createElement("div");
          e.className = "etiqueta";
          e.innerHTML = `<span class="n" style="background:${c.color}">${c.n}</span><span class="v"></span><span class="t"></span>`;
          cont.appendChild(e);
          return e;
        });
      }
      const CENTROS = [[-98.5, -53.5], [0, -53.5], [98.5, -53.5], [-73.5, 53.5], [73.5, 53.5]];
      const lev = H.ref.maqueta, es = H.estado;
      this._etq.forEach((e, i) => {
        if (!visibles) { e.style.opacity = 0; return; }
        const p = lev.localToWorld(new THREE.Vector3(H.mm(CENTROS[i][0]), H.mm(112), H.mm(CENTROS[i][1]))).project(camara);
        const fuera = p.z > 1 || Math.abs(p.x) > 1.1 || Math.abs(p.y) > 1.1;
        e.style.opacity = fuera ? 0 : 1;
        e.style.transform = `translate(${((p.x + 1) / 2) * window.innerWidth}px, ${((1 - p.y) / 2) * window.innerHeight}px) translate(-50%, -100%)`;
        e.classList.toggle("compacta", !!compactas);
        e.querySelector(".v").textContent = compactas ? "" : es.simLuz ? H.fmtLux(H.sim.lux[i]) : "— lx";
        e.querySelector(".t").textContent = compactas ? "" : es.simTemp ? H.fmtNum(H.sim.temp[i]) + " °C" : "— °C";
      });
    },
    // ------------------------------------------------------------ etiquetas de la caja del Arduino
    etiquetasArduino(camara, visibles) {
      const cont = $("#etq-arduino");
      if (!this._etqA) {
        this._etqA = H.ref.etqArduino.map(({ id, p }) => {
          const e = document.createElement("button");
          e.className = "etq-ard";
          e.textContent = H.ARDUINO[id].etq;
          e.addEventListener("click", () => this.app.seleccionar(id, true));
          cont.appendChild(e);
          return { e, id, p };
        });
      }
      cont.classList.toggle("visible", !!visibles);
      if (!visibles) return;
      H.ref.raiz.updateMatrixWorld();
      this._etqA.forEach(({ e, p, id }) => {
        const w = H.ref.caja.localToWorld(H.v3(...p)).project(camara);
        e.style.transform = `translate(${((w.x + 1) / 2) * window.innerWidth}px, ${((1 - w.y) / 2) * window.innerHeight}px) translate(-50%, -50%)`;
        e.classList.toggle("sel", this._sel === id);
        e.style.display = w.z > 1 ? "none" : "";
      });
    },

    aviso(texto, ms = 2600) {
      const a = $("#aviso");
      a.textContent = texto;
      a.classList.remove("oculto");
      requestAnimationFrame(() => a.classList.add("visible"));
      clearTimeout(this._tAviso);
      this._tAviso = setTimeout(() => { a.classList.remove("visible"); setTimeout(() => a.classList.add("oculto"), 400); }, ms);
    },
  });
})();
