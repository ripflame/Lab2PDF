document.addEventListener("DOMContentLoaded", () => {
  // Attach event listeners after the DOM is loaded
  document
    .getElementById("hemoparasitesLink")
    .addEventListener("click", () => loadForm("hemoparasites"));
  document
    .getElementById("hemogramLink")
    .addEventListener("click", () => loadForm("hemogram"));

  // Load default form
  loadForm("hemoparasites");
  //Make sidebar toggable
  document.querySelector(".sidebar h2").addEventListener("click", () => {
    document.querySelector(".sidebar").classList.toggle("open");
  });
});

function loadForm(formType) {
  fetch(`templates/${formType}.html`)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("specificFormFields").innerHTML = html;

      // Set today's date by default
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      document.getElementById("fecha").valueAsDate = today;

      if (formType === "hemoparasites") {
        document
          .getElementById("testFoto")
          .addEventListener("change", handleTestFotoChange);
      } else if (formType === "hemogram") {

      }
      updateFormSubmitHandler(formType);
    })
    .catch((error) => {
      console.error("Error loading form:", error);
    });
}

function updateFormSubmitHandler(formType) {
  const button = document.getElementById("generarPDFButton");
  button.removeEventListener("click", handleHemoparasitesFormSubmit);
  button.removeEventListener("click", handleHemogramFormSubmit);

  if (formType === "hemoparasites") {
    button.addEventListener("click", handleHemoparasitesFormSubmit);
  } else if (formType === "hemogram") {
    button.addEventListener("click", handleHemogramFormSubmit);
  }
}

function handleTestFotoChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.getElementById("testFotoThumbnail");
      img.src = e.target.result;
      img.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

function handleHemogramFormSubmit() {
  try {
    const inputs = document.querySelectorAll(
      "#commonFormFields input, #formularioHemograma input",
    );

    // Validate all inputs
    for (const input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity();
        input.focus();
        return;
      }
    }

    const button = document.getElementById("generarPDFButton");
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span> Generando PDF...';

    const datos = {
      // Generic Form Fields start here
      requerido: document.getElementById("requerido").value,
      nombrePropietario: document.getElementById("nombrePropietario").value,
      telefono: document.getElementById("telefono").value,
      nombreMascota: document.getElementById("nombreMascota").value,
      especie: document.getElementById("especie").value,
      raza: document.getElementById("raza").value,
      edad: document.getElementById("edad").value,
      sexo: document.querySelector("input[name='sexo']:checked").value,
      fecha: document.getElementById("fecha").value,
      // Specific Form Fields start here
      eritrocitos: document.getElementById("eritrocitos").value,
      hemoglobina: document.getElementById("hemoglobina").value,
      hematocrito: document.getElementById("hematocrito").value,
      volumenGlobularMedio: document.getElementById("volumenGlobularMedio")
        .value,
      hemoglobinaPromedio: document.getElementById("hemoglobinaPromedio").value,
      concentracionMediaHemoglobina: document.getElementById(
        "concentracionMediaHemoglobina",
      ).value,
      plaquetas: document.getElementById("plaquetas").value,
      leucocitos: document.getElementById("leucocitos").value,
      monocitos_rel: document.getElementById("monocitos_rel").value,
      linfocitos_rel: document.getElementById("linfocitos_rel").value,
      eosinofilos_rel: document.getElementById("eosinofilos_rel").value,
      basofilos_rel: document.getElementById("basofilos_rel").value,
      neutrofilos_segmentados_rel: document.getElementById(
        "neutrofilos_segmentados_rel",
      ).value,
      neutrofilos_banda_rel: document.getElementById("neutrofilos_banda_rel")
        .value,
      monocitos_abs: document.getElementById("monocitos_abs").value,
      linfocitos_abs: document.getElementById("linfocitos_abs").value,
      eosinofilos_abs: document.getElementById("eosinofilos_abs").value,
      basofilos_abs: document.getElementById("basofilos_abs").value,
      neutrofilos_segmentados_abs: document.getElementById(
        "neutrofilos_segmentados_abs",
      ).value,
      neutrofilos_banda_abs: document.getElementById("neutrofilos_banda_abs")
        .value,
    };

    window.electron.generarPDF(datos, "hemogram");
  } catch (error) {
    console.error("Error handling hemogram form submission:", error);
  }
}

function handleHemoparasitesFormSubmit() {
  try {
    const inputs = document.querySelectorAll(
      "#commonFormFields input, #formularioHemoparasitos input",
    );

    // Validate all inputs
    for (const input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity();
        input.focus();
        return;
      }
    }

    const button = document.getElementById("generarPDFButton");
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span> Generando PDF...';

    const datos = {
      // Generic Form Fields start here
      requerido: document.getElementById("requerido").value,
      nombrePropietario: document.getElementById("nombrePropietario").value,
      telefono: document.getElementById("telefono").value,
      nombreMascota: document.getElementById("nombreMascota").value,
      especie: document.getElementById("especie").value,
      raza: document.getElementById("raza").value,
      edad: document.getElementById("edad").value,
      sexo: document.querySelector("input[name='sexo']:checked").value,
      fecha: document.getElementById("fecha").value,
      // Specific Form Fields start here
      gusanoCorazon: document.querySelector(
        "input[name='gusanoCorazon']:checked",
      ).value,
      ehrlichiosis: document.querySelector("input[name='ehrlichiosis']:checked")
        .value,
      lyme: document.querySelector("input[name='lyme']:checked").value,
      anaplasmosis: document.querySelector("input[name='anaplasmosis']:checked")
        .value,
      testFoto: document.getElementById("testFotoThumbnail").src,
      testFotoPath: document.getElementById("testFoto").value,
    };

    window.electron.generarPDF(datos, "hemoparasites");
  } catch (error) {
    console.error("Error handling hemoparasites form submission:", error);
  }
}

// Handle PDF Generation Response
window.electron.onPDFGenerado((event, rutaPDF) => {
  const button = document.getElementById("generarPDFButton");
  button.disabled = false;
  button.innerHTML = "Generar PDF";

  if (!rutaPDF) {
    console.warn("PDF generation was canceled.");
    return;
  }

  document.getElementById("resultadoPDF").style.display = "block";
  document.getElementById("abrirUbicacionPDF").addEventListener("click", () => {
    window.electron.abrirUbicacion(rutaPDF);
  });
});
