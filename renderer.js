let activeTestConfig = null;
let availableTestTypes = [];
let activeTestType = {};
let availableProviders = [];
let activeProvider = {};
let availableSpecies = [];
let activeSpecies = "";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    availableTestTypes = await window.electron.getAllTests();
    buildSidebarMenu();
    attachSelectorListeners();
    attachFormHandlers();
    await initDefaults();
    await loadForm();
  } catch (error) {
    console.error("Failed to initialize application: ", error);
  }
});

/**
 * Initializes the availableProviders and availableSpecies arrays with the first test found
 * @param(Object)availableTestTypes - Object for availableTestTypes with id and displayName
 **/
async function initDefaults() {
  activeTestType = availableTestTypes[0];
  await updateProvidersSelect();
  await updateSpeciesSelect();
}

function buildSidebarMenu() {
  const sidebar = document.querySelector(".sidebar");
  const menuList = sidebar.querySelector("ul");
  menuList.innerHTML = "";

  availableTestTypes.forEach((item, index) => {
    const li = document.createElement("li");
    if (index === 0) {
      li.classList.add("selected");
    }
    const a = document.createElement("a");
    a.href = "#";
    a.id = item.id;

    a.textContent = item.displayName;

    li.appendChild(a);
    menuList.appendChild(li);
  });

  attachMenuEventListeners();
}

function attachMenuEventListeners() {
  const menuItems = document.querySelectorAll(".sidebar ul li a");

  menuItems.forEach((item) => {
    item.addEventListener("click", async function (event) {
      event.preventDefault();

      document.querySelectorAll(".sidebar ul li").forEach((li) => {
        li.classList.remove("selected");
      });
      this.parentElement.classList.add("selected");
      if (this.id !== activeTestType.id) {
        const testId = this.id;
        activeTestType = availableTestTypes.find((test) => {
          return test.id === testId;
        });
        await updateProvidersSelect();
        await updateSpeciesSelect();
        await loadForm();
      }
    });
  });
}

function attachSelectorListeners() {
  const providerSelect = document.getElementById("proveedorSelect");
  providerSelect.addEventListener("change", async (event) => {
    if (activeProvider.id !== event.target.value) {
      const providerId = event.target.value;
      activeProvider = availableProviders.find((provider) => {
        return provider.id === providerId;
      });
      await loadForm();
    }
  });

  const speciesSelect = document.getElementById("especieSelect");
  speciesSelect.addEventListener("change", async (event) => {
    if (activeSpecies !== event.target.value) {
      activeSpecies = event.target.value;
      await loadForm();
    }
  });
}

function attachFormHandlers() {
  const generatePDFButton = document.getElementById("generarPDFButton");
  generatePDFButton.addEventListener("click", (event) => {
    event.preventDefault();
    handleFormSubmit();
  });

  document.getElementById("abrirUbicacionPDF").addEventListener("click", (event) => {
    const pdfPath = event.currentTarget.getAttribute("data-pdf-path");
    if (pdfPath) {
      window.electron.abrirUbicacion(pdfPath);
    }
  });

  document.getElementById("specificFormFields").addEventListener("change", (event) => {
    if (event.target.id === "testFoto") {
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
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function updateProvidersSelect() {
  availableProviders = await window.electron.getProvidersByTest(activeTestType.id);
  activeProvider = availableProviders[0];
  document.querySelectorAll("#proveedorSelect option").forEach((option) => option.remove());
  const providersSelect = document.getElementById("proveedorSelect");
  for (const provider of availableProviders) {
    const option = new Option(provider.displayName, provider.id);
    providersSelect.options.add(option);
  }
}

async function updateSpeciesSelect() {
  availableSpecies = await window.electron.getSpeciesByTestAndProvider(
    activeTestType.id,
    activeProvider.id,
  );
  activeSpecies = availableSpecies[0];
  document.querySelectorAll("#especieSelect option").forEach((option) => option.remove());
  const speciesSelect = document.getElementById("especieSelect");
  for (const species of availableSpecies) {
    const option = new Option(capitalizeFirstLetter(species), capitalizeFirstLetter(species));
    speciesSelect.options.add(option);
  }
}

async function loadForm() {
  try {
    activeTestConfig = await window.electron.getConfig(
      activeTestType.id,
      activeProvider.id,
      activeSpecies,
    );
    const response = await fetch(`templates/${activeTestConfig.formFile}`);
    const html = await response.text();
    document.getElementById("specificFormFields").innerHTML = html;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    document.getElementById("fecha").valueAsDate = today;
  } catch (error) {
    console.error("Error loading form:", error);
  }
}

function getGenericFormFields() {
  const datos = {
    requerido: document.getElementById("requerido").value,
    nombrePropietario: document.getElementById("nombrePropietario").value,
    telefono: document.getElementById("telefono").value,
    nombreMascota: document.getElementById("nombreMascota").value,
    especie: document.getElementById("especieSelect").value,
    raza: document.getElementById("raza").value,
    edad: document.getElementById("edad").value,
    sexo: document.querySelector("input[name='sexo']:checked").value,
    fecha: document.getElementById("fecha").value,
  };

  return datos;
}

function handleFormSubmit() {
  document.getElementById("resultadoPDF").classList.add("hidden");
  // Validate all inputs
  const inputs = document.querySelectorAll("#commonFormFields input, #specificFormFields input");
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

  const datos = getGenericFormFields();
  if (activeTestConfig.type === "table") {
    for (const field of activeTestConfig.fields) {
      datos[field.id] = document.getElementById(`${field.templateField || field.id}`).value;
    }
  } else if (activeTestConfig.type === "testWithPhoto") {
    for (const field of activeTestConfig.fields) {
      datos[field.id] = document.querySelector(
        `input[name=${field.templateField || field.id}]:checked`,
      ).value;
      datos["testFoto"] = document.getElementById("testFotoThumbnail").src;
      datos["testFotoPath"] = document.getElementById("testFoto").value;
    }
  }

  window.electron.generarPDF(datos, activeTestConfig.id);
}

// Handle PDF Generation Response
window.electron.onPDFGenerado((rutaPDF) => {
  const button = document.getElementById("generarPDFButton");
  button.disabled = false;
  button.innerHTML = "Generar PDF";

  if (!rutaPDF) {
    console.warn("PDF generation was canceled.");
    return;
  }

  document.getElementById("resultadoPDF").classList.remove("hidden");
  document.getElementById("abrirUbicacionPDF").setAttribute("data-pdf-path", rutaPDF);
});
