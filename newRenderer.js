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
  availableProviders = await window.electron.getProvidersByTest(activeTestType.id);
  activeProvider = availableProviders[0];
  availableSpecies = await window.electron.getSpeciesByTestAndProvider(
    activeTestType.id,
    activeProvider.id,
  );
  activeSpecies = availableSpecies[0];
  updateProvidersSelect();
  updateSpeciesSelect();
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
        availableProviders = await window.electron.getProvidersByTest(activeTestType.id);
        activeProvider = availableProviders[0];
        availableSpecies = await window.electron.getSpeciesByTestAndProvider(
          activeTestType.id,
          activeProvider.id,
        );
        activeSpecies = availableSpecies[0];
        updateProvidersSelect();
        updateSpeciesSelect();
        await loadForm();
      }
    });
  });
}

function attachSelectorListeners() {
  const providerSelect = document.getElementById("providerSelect");
  providerSelect.addEventListener("change", async (event) => {
    if (activeProvider.id !== event.target.value){
      const providerId = event.target.value;
      activeProvider = availableProviders.find((provider)=>{
        return provider.id === providerId;
      });
      await loadForm();
    }
  });

  const speciesSelect = document.getElementById("speciesSelect");
  speciesSelect.addEventListener("change", async (event)=>{
    if (activeSpecies !== event.target.value) {
      activeSpecies = event.target.value;
      await loadForm();
    }
  })
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateProvidersSelect() {
  document.querySelectorAll("#providerSelect option").forEach((option) => option.remove());
  const providersSelect = document.getElementById("providerSelect");
  for (const provider of availableProviders) {
    const option = new Option(provider.displayName, provider.id);
    providersSelect.options.add(option);
  }
}

function updateSpeciesSelect() {
  document.querySelectorAll("#speciesSelect option").forEach((option) => option.remove());
  const speciesSelect = document.getElementById("speciesSelect");
  for (const species of availableSpecies) {
    const option = new Option(capitalizeFirstLetter(species), species);
    speciesSelect.options.add(option);
  }
}

async function loadForm() {
  try {
    const config = await window.electron.getConfig(
      activeTestType.id,
      activeProvider.id,
      activeSpecies,
    );
    const response = await fetch(`templates/${config.formFile}`);
    const html = await response.text();
    document.getElementById("specificFormFields").innerHTML = html;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    document.getElementById("fecha").valueAsDate = today;
  } catch (error) {
    console.error("Error loading form:", error);
  }
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

  toggleVisibility(["resultadoPDF"], true);
  document.getElementById("abrirUbicacionPDF").setAttribute("data-pdf-path", rutaPDF);
});
