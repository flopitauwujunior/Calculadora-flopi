let ramos = JSON.parse(localStorage.getItem("ramosFlopi")) || [];

function guardar() {
  localStorage.setItem("ramosFlopi", JSON.stringify(ramos));
}

function agregarRamo() {
  const nombre = document.getElementById("nombreRamo").value.trim();
  if (!nombre) return;

  ramos.push({
    nombre,
    notas: [],
    inasistencias: 0,
    tareas: []
  });

  guardar();
  document.getElementById("nombreRamo").value = "";
  renderRamos();
}

function renderRamos() {
  const contenedor = document.getElementById("contenedorRamos");
  contenedor.innerHTML = "";

  ramos.forEach((ramo, index) => {
    const div = document.createElement("div");
    div.className = "ramo";

    const h2 = document.createElement("h2");
    h2.textContent = ramo.nombre;

    const eliminar = document.createElement("span");
    eliminar.textContent = "🗑️";
    eliminar.className = "eliminar-ramo";
    eliminar.onclick = () => {
      ramos.splice(index, 1);
      guardar();
      renderRamos();
    };

    div.appendChild(h2);
    div.appendChild(eliminar);

    // Evaluaciones
    const evaluaciones = document.createElement("div");
    evaluaciones.className = "evaluaciones";

    const notaInput = document.createElement("input");
    notaInput.placeholder = "Nota";

    const porcentajeInput = document.createElement("input");
    porcentajeInput.placeholder = "%";

    const agregarEval = document.createElement("button");
    agregarEval.textContent = "➕";
    agregarEval.onclick = () => {
      const nota = parseFloat(notaInput.value);
      const porcentaje = parseFloat(porcentajeInput.value);
      if (!isNaN(nota) && !isNaN(porcentaje)) {
        ramo.notas.push({ nota, porcentaje });
        guardar();
        renderRamos();
      }
    };

    evaluaciones.appendChild(notaInput);
    evaluaciones.appendChild(porcentajeInput);
    evaluaciones.appendChild(agregarEval);
    div.appendChild(evaluaciones);

    ramo.notas.forEach((n, i) => {
      const evalDiv = document.createElement("div");
      evalDiv.className = "evaluacion";
      evalDiv.textContent = `Nota: ${n.nota} (${n.porcentaje}%)`;

      const eliminarEval = document.createElement("span");
      eliminarEval.textContent = "🗑️";
      eliminarEval.className = "eliminar-eval";
      eliminarEval.onclick = () => {
        ramo.notas.splice(i, 1);
        guardar();
        renderRamos();
      };

      evalDiv.appendChild(eliminarEval);
      div.appendChild(evalDiv);
    });

    // Promedio
    const resultado = document.createElement("p");
    const sumaP = ramo.notas.reduce((acc, n) => acc + n.porcentaje, 0);
    const sumaN = ramo.notas.reduce((acc, n) => acc + n.nota * n.porcentaje, 0);
    const promedio = sumaP ? (sumaN / sumaP).toFixed(2) : "-";
    const necesario = (4 * 100 - sumaN) / (100 - sumaP);

    resultado.innerHTML = `Promedio: ${promedio} ${
      sumaP < 100 ? `<br>Necesitas: ${necesario.toFixed(2)} para aprobar` : ""
    }`;
    div.appendChild(resultado);

    // Inasistencias
    const inasDiv = document.createElement("div");
    inasDiv.className = "inasistencias";

    const inasTexto = document.createElement("span");
    inasTexto.textContent = `Inasistencias: ${ramo.inasistencias}`;

    const mas = document.createElement("button");
    mas.textContent = "➕";
    mas.onclick = () => {
      ramo.inasistencias++;
      guardar();
      renderRamos();
    };

    const menos = document.createElement("button");
    menos.textContent = "➖";
    menos.onclick = () => {
      if (ramo.inasistencias > 0) {
        ramo.inasistencias--;
        guardar();
        renderRamos();
      }
    };

    inasDiv.appendChild(inasTexto);
    inasDiv.appendChild(mas);
    inasDiv.appendChild(menos);
    div.appendChild(inasDiv);

    // Tareas
    const tareasDiv = document.createElement("div");
    tareasDiv.className = "tareas";

    const tareasTitulo = document.createElement("h3");
    tareasTitulo.textContent = "Tareas / Metas";

    const agregarTarea = document.createElement("span");
    agregarTarea.textContent = "➕";
    agregarTarea.style.cursor = "pointer";
    agregarTarea.onclick = () => {
      const txt = prompt("Escribe tu tarea:");
      if (txt) {
        ramo.tareas.push({ texto: txt, hecho: false });
        guardar();
        renderRamos();
      }
    };

    tareasTitulo.appendChild(agregarTarea);
    tareasDiv.appendChild(tareasTitulo);

    ramo.tareas.forEach((tarea, i) => {
      const tareaDiv = document.createElement("div");
      tareaDiv.className = "tarea";
      tareaDiv.textContent = tarea.texto;

      if (tarea.hecho) tareaDiv.classList.add("tachada");

      tareaDiv.onclick = () => {
        tarea.hecho = !tarea.hecho;
        guardar();
        renderRamos();
      };

      const eliminarTarea = document.createElement("span");
      eliminarTarea.textContent = "🗑️";
      eliminarTarea.className = "eliminar-tarea";
      eliminarTarea.onclick = (e) => {
        e.stopPropagation();
        ramo.tareas.splice(i, 1);
        guardar();
        renderRamos();
      };

      tareaDiv.appendChild(eliminarTarea);
      tareasDiv.appendChild(tareaDiv);
    });

    div.appendChild(tareasDiv);
    contenedor.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", renderRamos);
