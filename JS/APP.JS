document.addEventListener("DOMContentLoaded", () => {
  // Referencias a las pestañas
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  // Función para cambiar entre pestañas
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab");

      // Quitar la clase "active" de todas las pestañas y contenidos
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Agregar la clase "active" a la pestaña y contenido seleccionados
      tab.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Inicializar la pestaña por defecto (en este caso la de "Carreras")
  document.getElementById("races").classList.add("active");
});

document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del DOM
  const platformSelect = document.getElementById("platformSelect");
  const raceName = document.getElementById("raceName");
  const raceType = document.getElementById("raceType");
  const raceDate = document.getElementById("raceDate");
  const raceTime = document.getElementById("raceTime");
  const createRaceBtn = document.getElementById("createRace");
  const raceList = document.getElementById("raceList");

  const pilotName = document.getElementById("pilotName");
  const pilotTeam = document.getElementById("pilotTeam");
  const registerPilotBtn = document.getElementById("registerPilot");
  const pilotList = document.getElementById("pilotList");

  const resultRace = document.getElementById("resultRace");
  const resultPilot = document.getElementById("resultPilot");
  const resultPosition = document.getElementById("resultPosition");
  const resultPoints = document.getElementById("resultPoints");
  const addResultBtn = document.getElementById("addResult");
  const resultList = document.getElementById("resultList");

  const championshipTableBody = document
    .getElementById("championshipTable")
    .querySelector("tbody");

  // Datos iniciales (si no hay nada en localStorage)
  let races = JSON.parse(localStorage.getItem("races")) || [];
  let pilots = JSON.parse(localStorage.getItem("pilots")) || [];
  let results = JSON.parse(localStorage.getItem("results")) || [];

  // Función para actualizar la lista de carreras
  function updateRaceList() {
    raceList.innerHTML = "";
    races.forEach((race, index) => {
      const li = document.createElement("li");
      li.className = "item fade-in";
      li.innerHTML = `
        <div>
          <strong>${race.name}</strong><br>
          Plataforma: ${race.platform}<br>
          Tipo: ${race.type}<br>
          Fecha: ${race.date} - Hora: ${race.time}
        </div>
        <button class="delete-btn" data-index="${index}">Eliminar</button>
      `;
      raceList.appendChild(li);
    });
    localStorage.setItem("races", JSON.stringify(races));
    updateResultRaceSelect();
  }

  // Función para actualizar la lista de pilotos
  function updatePilotList() {
    pilotList.innerHTML = "";
    pilots.forEach((pilot, index) => {
      const li = document.createElement("li");
      li.className = "item fade-in";
      li.innerHTML = `
        <div>
          <strong>${pilot.name}</strong><br>
          Equipo: ${pilot.team}
        </div>
        <button class="delete-btn" data-index="${index}">Eliminar</button>
      `;
      pilotList.appendChild(li);
    });
    localStorage.setItem("pilots", JSON.stringify(pilots));
    updateResultPilotSelect();
  }

  // Función para actualizar la lista de resultados
  function updateResultList() {
    resultList.innerHTML = "";
    results.forEach((result, index) => {
      const li = document.createElement("li");
      li.className = "item fade-in";
      li.innerHTML = `
        <div>
          <strong>${result.race}</strong><br>
          Piloto: ${result.pilot}<br>
          Posición: ${result.position}<br>
          Puntos: ${result.points}
        </div>
        <button class="delete-btn" data-index="${index}">Eliminar</button>
      `;
      resultList.appendChild(li);
    });
    localStorage.setItem("results", JSON.stringify(results));
    updateChampionship();
  }

  // Función para actualizar la lista de carreras en la selección de resultados
  function updateResultRaceSelect() {
    resultRace.innerHTML = '<option value="">Selecciona una carrera</option>';
    races.forEach((race) => {
      const option = document.createElement("option");
      option.value = race.name;
      option.textContent = race.name;
      resultRace.appendChild(option);
    });
  }

  // Función para actualizar la lista de pilotos en la selección de resultados
  function updateResultPilotSelect() {
    resultPilot.innerHTML = '<option value="">Selecciona un piloto</option>';
    pilots.forEach((pilot) => {
      const option = document.createElement("option");
      option.value = pilot.name;
      option.textContent = pilot.name;
      resultPilot.appendChild(option);
    });
  }

  // Función para actualizar la clasificación del campeonato
  function updateChampionship() {
    const championship = {};

    // Calcular puntos acumulados por cada piloto
    results.forEach((result) => {
      if (!championship[result.pilot]) {
        championship[result.pilot] = { points: 0, team: "" };
      }
      championship[result.pilot].points += parseInt(result.points);
      championship[result.pilot].team =
        pilots.find((p) => p.name === result.pilot)?.team || "";
    });

    const sortedChampionship = Object.entries(championship)
      .sort((a, b) => b[1].points - a[1].points)
      .map(([pilot, data], index) => ({
        position: index + 1,
        pilot,
        ...data,
      }));

    // Limpiar la tabla antes de insertar datos nuevos
    championshipTableBody.innerHTML = "";

    // Insertar filas en la tabla de clasificación
    sortedChampionship.forEach((entry) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${entry.position}</td>
        <td>${entry.pilot}</td>
        <td>${entry.team}</td>
        <td>${entry.points}</td>
      `;
      championshipTableBody.appendChild(tr);
    });
  }

  // Eventos para la creación de carreras
  createRaceBtn.addEventListener("click", () => {
    const newRace = {
      platform: platformSelect.value,
      name: raceName.value,
      type: raceType.value,
      date: raceDate.value,
      time: raceTime.value,
    };

    if (!newRace.name || !newRace.date || !newRace.type) {
      alert("Por favor, completa todos los campos para crear una carrera.");
      return;
    }

    races.push(newRace);
    updateRaceList();

    // Limpiar los campos
    raceName.value = "";
    raceType.value = "";
    raceDate.value = "";
    raceTime.value = "";

    alert("¡Carrera creada exitosamente!");
  });

  // Eventos para registrar pilotos
  registerPilotBtn.addEventListener("click", () => {
    const newPilot = {
      name: pilotName.value,
      team: pilotTeam.value,
    };

    if (!newPilot.name || !newPilot.team) {
      alert("Por favor, completa todos los campos para registrar un piloto.");
      return;
    }

    pilots.push(newPilot);
    updatePilotList();

    // Limpiar los campos
    pilotName.value = "";
    pilotTeam.value = "";

    alert("¡Piloto registrado exitosamente!");
  });

  // Eventos para añadir resultados
  addResultBtn.addEventListener("click", () => {
    const newResult = {
      race: resultRace.value,
      pilot: resultPilot.value,
      position: resultPosition.value,
      points: resultPoints.value,
    };

    if (
      !newResult.race ||
      !newResult.pilot ||
      !newResult.position ||
      !newResult.points
    ) {
      alert(
        "Por favor, completa todos los campos antes de añadir el resultado."
      );
      return;
    }

    results.push(newResult);
    updateResultList();

    // Limpiar los campos
    resultRace.value = "";
    resultPilot.value = "";
    resultPosition.value = "";
    resultPoints.value = "";

    alert("¡Resultado añadido exitosamente!");
  });

  // Inicializar la aplicación
  updateRaceList();
  updatePilotList();
  updateResultList();
  updateChampionship();
});
