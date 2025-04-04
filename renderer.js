document.addEventListener("DOMContentLoaded", () => {
  // Attach event listeners after the DOM is loaded
  // Handling side bar clikcs
  document
    .getElementById("hemoparasitesLink")
    .addEventListener("click", () => loadForm("hemoparasites"));
  document.getElementById("hemogramLink").addEventListener("click", () => {
    const optionSelected = document.getElementById("sucursalSelect").value;
    loadHemogramVariant(optionSelected);
  });
  document.getElementById("distemperLink").addEventListener("click", () => loadForm("distemper"));
  //Handling on change events
  document.getElementById("sucursalSelect").addEventListener("change", (event) => {
    loadHemogramVariant(event.target.value);
  });
  document.getElementById("specificFormFields").addEventListener("change", (event) => {
    if (
      event.target.id === "testFoto" &&
      (currentFormType === "hemoparasites" || currentFormType === "distemper")
    ) {
      handleTestFotoChange(event);
    }
  });
  document.getElementById("abrirUbicacionPDF").addEventListener("click", (event) => {
    console.log("this:", this);
    const pdfPath = event.currentTarget.getAttribute("data-pdf-path");
    if (pdfPath) {
      window.electron.abrirUbicacion(pdfPath);
    }
  });
  // Load default form
  loadForm("hemoparasites");
});

// Global variables
let currentFormType = "hemoparasites";
let currentFormSubmitHandler = null;

function loadHemogramVariant(formVariant) {
  if (formVariant === "Zapata") {
    loadForm("hemogram");
  } else if (formVariant === "Palenque") {
    loadForm("hemogram_palenque");
  }
}

function toggleVisibility(ids, shouldShow) {
  ids.forEach((id) => {
    const elment = document.getElementById(id);
    if (elment) {
      elment.classList.toggle("hidden", !shouldShow);
    }
  });
}

function loadForm(formType) {
  currentFormType = formType;
  fetch(`templates/${formType}.html`)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("specificFormFields").innerHTML = html;

      // Set today's date by default
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      document.getElementById("fecha").valueAsDate = today;

      // Toggle visibility for species selector
      if (formType === "hemoparasites") {
        // Show only "caninoOption" and hide the others
        toggleVisibility(["caninoOption"], true);
        toggleVisibility(["felinoOption", "equinoOption", "bovinoOption"], false);
        toggleVisibility(["sucursalWrapper"], false);
      } else if (formType === "hemogram" || formType === "hemogram_palenque") {
        // Show all species options
        toggleVisibility(["caninoOption", "felinoOption", "equinoOption", "bovinoOption"], true);
        toggleVisibility(["sucursalWrapper"], true);
      } else if (formType === "distemper") {
        //Show only "caninoOption" and hide the others
        toggleVisibility(["caninoOption"], true);
        toggleVisibility(["felinoOption", "equinoOption", "bovinoOption"], false);
        toggleVisibility(["sucursalWrapper"], false);
      }
      updateFormSubmitHandler(formType);
    })
    .catch((error) => {
      console.error("Error loading form:", error);
    });
}

function updateFormSubmitHandler(formType) {
  const button = document.getElementById("generarPDFButton");

  const formHandlers = {
    hemoparasites: handleHemoparasitesFormSubmit,
    hemogram: handleHemogramFormSubmit,
    hemogram_palenque: handleHemogramPalenqueFormSubmit,
    distemper: handleDistemperFormSubmit,
  };

  const handler =
    formHandlers[formType] ||
    function() {
      console.warn(`No handler defined for form type: ${formType}`);
    };

  if (currentFormSubmitHandler) {
    button.removeEventListener("click", currentFormSubmitHandler);
  }

  button.addEventListener("click", handler);
  currentFormSubmitHandler = handler;
}

function handleTestFotoChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.getElementById("testFotoThumbnail");
      img.src = e.target.result;
      img.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

function handleHemogramPalenqueFormSubmit() {
  try {
    const inputs = document.querySelectorAll("#commonFormFields input, #formularioHemograma input");

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
      rbc: document.getElementById("rbc").value,
      hgb: document.getElementById("hgb").value,
      hct: document.getElementById("hct").value,
      mcv: document.getElementById("mcv").value,
      mch: document.getElementById("mch").value,
      mchc: document.getElementById("mchc").value,
      rdw_cv: document.getElementById("rdw_cv").value,
      rdw_sd: document.getElementById("rdw_sd").value,
      plt: document.getElementById("plt").value,
      pct: document.getElementById("pct").value,
      mpv: document.getElementById("mpv").value,
      pdw: document.getElementById("pdw").value,
      p_lcr: document.getElementById("p_lcr").value,
      p_lcc: document.getElementById("p_lcc").value,
      wbc: document.getElementById("wbc").value,
      monocitos_rel: document.getElementById("monocitos_rel").value,
      granulocitos_rel: document.getElementById("granulocitos_rel").value,
      linfocitos_rel: document.getElementById("linfocitos_rel").value,
      eosinofilos_rel: document.getElementById("eosinofilos_rel").value,
      monocitos_abs: document.getElementById("monocitos_abs").value,
      granulocitos_abs: document.getElementById("granulocitos_abs").value,
      linfocitos_abs: document.getElementById("linfocitos_abs").value,
      eosinofilos_abs: document.getElementById("eosinofilos_abs").value,
    };

    window.electron.generarPDF(datos, "hemogram_palenque");
  } catch (error) {
    console.error("Error handling hemogram form submission:", error);
  }
}

function handleHemogramFormSubmit() {
  try {
    const inputs = document.querySelectorAll("#commonFormFields input, #formularioHemograma input");

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
      volumenGlobularMedio: document.getElementById("volumenGlobularMedio").value,
      hemoglobinaPromedio: document.getElementById("hemoglobinaPromedio").value,
      concentracionMediaHemoglobina: document.getElementById("concentracionMediaHemoglobina").value,
      plaquetas: document.getElementById("plaquetas").value,
      leucocitos: document.getElementById("leucocitos").value,
      monocitos_rel: document.getElementById("monocitos_rel").value,
      linfocitos_rel: document.getElementById("linfocitos_rel").value,
      eosinofilos_rel: document.getElementById("eosinofilos_rel").value,
      basofilos_rel: document.getElementById("basofilos_rel").value,
      neutrofilos_segmentados_rel: document.getElementById("neutrofilos_segmentados_rel").value,
      neutrofilos_banda_rel: document.getElementById("neutrofilos_banda_rel").value,
      monocitos_abs: document.getElementById("monocitos_abs").value,
      linfocitos_abs: document.getElementById("linfocitos_abs").value,
      eosinofilos_abs: document.getElementById("eosinofilos_abs").value,
      basofilos_abs: document.getElementById("basofilos_abs").value,
      neutrofilos_segmentados_abs: document.getElementById("neutrofilos_segmentados_abs").value,
      neutrofilos_banda_abs: document.getElementById("neutrofilos_banda_abs").value,
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
      gusanoCorazon: document.querySelector("input[name='gusanoCorazon']:checked").value,
      ehrlichiosis: document.querySelector("input[name='ehrlichiosis']:checked").value,
      lyme: document.querySelector("input[name='lyme']:checked").value,
      anaplasmosis: document.querySelector("input[name='anaplasmosis']:checked").value,
      testFoto: document.getElementById("testFotoThumbnail").src,
      testFotoPath: document.getElementById("testFoto").value,
    };

    window.electron.generarPDF(datos, "hemoparasites");
  } catch (error) {
    console.error("Error handling hemoparasites form submission:", error);
  }
}

function handleDistemperFormSubmit() {
  try {
    const inputs = document.querySelectorAll("#commonFormFields input, #formularioDistemper input");

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
      distemper: document.querySelector("input[name='distemper']:checked").value,
      adenovirus: document.querySelector("input[name='adenovirus']:checked").value,
      testFoto: document.getElementById("testFotoThumbnail").src,
      testFotoPath: document.getElementById("testFoto").value,
    };

    window.electron.generarPDF(datos, "distemper");
  } catch (error) {
    console.error("Error handling distemper form submission:", error);
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
  document.getElementById("abrirUbicacionPDF").setAttribute("data-pdf-path", rutaPDF);
});
