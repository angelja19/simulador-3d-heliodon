/* Interfaz: paneles, listas, tooltip, etiquetas de los cuartos y avisos. */
(function () {
  const H = window.H;
  const $ = (s) => document.querySelector(s);
  const ORDEN = ["Estructura", "Mecanismo", "Soporte y maqueta", "Sensores", "Caja del Arduino", "220 V", "Cables", "Cableado", "Kit, PC y repuestos"];
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const hex = (n) => "#" + n.toString(16).padStart(6, "0");

  const UI = (H.UI = {
    iniciar(app) {
      this.app = app;
      this.listaCuartos();
      this.listaComponentes("");
      this.listaCables();
      document.querySelectorAll(".segmentado button").forEach((b) => b.addEventListener("click", () => this.pestana(b.dataset.pestana)));
      $("#buscar").addEventListener("input", (e) => this.listaComponentes(e.target.value));
      document.querySelectorAll('input[type=range]').forEach((r) => { this.relleno(r); r.addEventListener("input", () => this.relleno(r)); });
    },
    pestana(n) {
      document.querySelectorAll(".segmentado button").forEach((b) => b.classList.toggle("activo", b.dataset.pestana === n));
      ["cuartos", "componentes", "cables"].forEach((p) => $("#pestana-" + p).classList.toggle("oculto", p !== n));
    },
    relleno(r) {
      const p = ((r.value - r.min) / (r.max - r.min)) * 100;
      r.style.setProperty("--p", p + "%");
    },

    // ------------------------------------------------------------ cuartos
    listaCuartos() {
      const cont = $("#lista-cuartos");
      cont.innerHTML = H.CUARTOS.map((c, i) => `
        <div class="cuarto" data-cuarto="${i}">
          <span class="num" style="background:${c.color}">${c.n}</span>
          <span class="nom">C${c.n} · ${c.pos}</span>
          <span class="val" id="lux-${i}">—</span>
          <span class="barra"><i id="barra-${i}"></i></span>
          <span class="temp" id="temp-${i}" style="grid-column:2/4">—</span>
        </div>`).join("");
      cont.querySelectorAll(".cuarto").forEach((el) => el.addEventListener("click", () => this.app.seleccionar("307_" + (+el.dataset.cuarto + 1))));
    },
    actualizarCuartos() {
      const max = Math.max(...H.sim.lux);
      H.CUARTOS.forEach((c, i) => {
        const lx = H.sim.lux[i], t = H.sim.temp[i];
        $("#lux-" + i).textContent = H.fmtLux(lx);
        const b = $("#barra-" + i);
        b.style.width = Math.max(2, Math.min(100, (Math.log10(Math.max(1, lx)) / 4) * 100)) + "%";
        b.style.background = "#" + H.colorLux(lx).getHexString();
        $("#temp-" + i).textContent = `${H.fmtNum(t)} °C · ${H.nivelLuz(lx)[0]}${lx >= max - 0.5 && max > 400 ? " · el más iluminado" : ""}`;
      });
    },

    // ------------------------------------------------------------ componentes
    listaComponentes(filtro) {
      const f = filtro.trim().toLowerCase();
      const comps = Object.values(H.comps).filter((c) => c.objetos.length && c.grupo &&
        (!f || [c.nombre, c.codigo, c.conexion, c.funcion, c.lista, c.origen].join(" ").toLowerCase().includes(f)));
      const grupos = {};
      comps.forEach((c) => (grupos[c.grupo] = grupos[c.grupo] || []).push(c));
      const html = ORDEN.filter((g) => grupos[g]).map((g) => `<div class="grupo-comp">${esc(g)} · ${grupos[g].length}</div>` +
        grupos[g].sort((a, b) => String(a.codigo || "zz").localeCompare(String(b.codigo || "zz"), "es", { numeric: true }))
          .map((c) => `<div class="item-comp" data-id="${esc(c.id)}">
            ${c.tipo ? `<span class="punto" style="background:${hex(H.TIPOS[c.tipo].color)}"></span>` : `<span class="cod">${esc((c.codigo || "").split(" ")[0])}</span>`}
            <span>${esc(c.nombre)}<span class="sub">${esc(c.conexion || c.funcion || "")}</span></span></div>`).join("")).join("");
      $("#lista-componentes").innerHTML = html || `<p class="nota">Ningún componente coincide.</p>`;
      $("#lista-componentes").querySelectorAll(".item-comp").forEach((el) => el.addEventListener("click", () => this.app.seleccionar(el.dataset.id)));
    },
    marcarSeleccion(id) {
      document.querySelectorAll(".item-comp").forEach((el) => el.classList.toggle("sel", el.dataset.id === id));
      const el = document.querySelector(`.item-comp[data-id="${CSS.escape(id || "")}"]`);
      if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    },
    listaCables() {
      const cuenta = {};
      Object.values(H.comps).forEach((c) => { if (c.tipo && c.objetos.length) cuenta[c.tipo] = (cuenta[c.tipo] || 0) + 1; });
      $("#lista-cables").innerHTML = Object.entries(H.TIPOS).map(([k, t]) => `
        <div class="item-comp" data-tipo="${k}"><span class="punto" style="background:${hex(t.color)}"></span>
        <span>${esc(t.nombre)}<span class="sub">${cuenta[k] || 0} cable(s)</span></span></div>`).join("");
      $("#lista-cables").querySelectorAll(".item-comp").forEach((el) => el.addEventListener("click", () => this.app.resaltarTipo(el.dataset.tipo)));
    },

    // ------------------------------------------------------------ tooltip
    tooltip(x, y, id) {
      const t = $("#tooltip");
      if (!id) { t.classList.add("oculto"); return; }
      const c = H.comps[id];
      if (!c) { t.classList.add("oculto"); return; }
      let extra = "";
      if (c.cuarto != null) {
        const i = c.cuarto;
        extra = `<div class="tt-fila">Cuarto <b>C${i + 1}</b> · luz <b>${H.fmtLux(H.sim.lux[i])}</b> · <b>${H.fmtNum(H.sim.temp[i])} °C</b></div>`;
      }
      const fila = (k, v) => (v ? `<div class="tt-fila">${k}: <b>${esc(v)}</b></div>` : "");
      t.innerHTML = `<div class="tt-codigo">${esc(c.codigo || "")}${c.tipo ? " · " + esc(H.TIPOS[c.tipo].nombre) : ""}</div>
        <div class="tt-titulo">${esc(c.nombre)}</div>
        ${c.funcion ? `<div class="tt-fila">${esc(c.funcion)}</div>` : ""}
        ${fila("Pin / canal", c.conexion)}${fila("Lista", c.lista)}${extra}
        ${c.funcion_extra ? `<div class="tt-fila" style="color:var(--acento)">${esc(c.funcion_extra)}</div>` : ""}`;
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
          e.innerHTML = `<span class="n" style="background:${c.color}">C${c.n}</span><span class="v"></span><span class="t"></span>`;
          cont.appendChild(e);
          return e;
        });
      }
      const CENTROS = [[-98.5, -53.5], [0, -53.5], [98.5, -53.5], [-73.5, 53.5], [73.5, 53.5]];
      const lev = H.ref.maqueta;
      this._etq.forEach((e, i) => {
        if (!visibles) { e.style.opacity = 0; return; }
        const p = lev.localToWorld(new THREE.Vector3(H.mm(CENTROS[i][0]), H.mm(112), H.mm(CENTROS[i][1]))).project(camara);
        const fuera = p.z > 1 || Math.abs(p.x) > 1.1 || Math.abs(p.y) > 1.1;
        e.style.opacity = fuera ? 0 : 1;
        e.style.left = ((p.x + 1) / 2) * window.innerWidth + "px";
        e.style.top = ((1 - p.y) / 2) * window.innerHeight + "px";
        e.classList.toggle("compacta", !!compactas);
        e.querySelector(".v").textContent = compactas ? "" : H.fmtLux(H.sim.lux[i]);
        e.querySelector(".t").textContent = compactas ? "" : H.fmtNum(H.sim.temp[i]) + " °C";
      });
    },

    aviso(texto, ms = 2600) {
      const a = $("#aviso");
      a.textContent = texto;
      a.classList.remove("oculto");
      a.style.opacity = 1;
      clearTimeout(this._tAviso);
      this._tAviso = setTimeout(() => { a.style.opacity = 0; setTimeout(() => a.classList.add("oculto"), 400); }, ms);
    },
  });
})();
