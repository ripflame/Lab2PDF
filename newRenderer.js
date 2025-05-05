let activeTestType = {};
let activeProvider = {};
let activeSpecies = "";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const availableTests = await window.electron.getAllTests();
    await initDefaults(availableTests);
    buildSidebarMenu(availableTests);
    await loadForm();
  } catch (error) {
    console.error("Failed to initialize application: ", error);
  }
});

async function initDefaults(availableTests) {
  activeTestType = availableTests[0];
  const providers = await window.electron.getProvidersByTest(activeTestType);
  activeProvider = providers[0];
  const species = await window.electron.getSpeciesByTestAndProvider(
    activeTestType.id,
    activeProvider.id,
  );
  activeSpecies = species;
  // activeSpecies = species.charAt(0).toUpperCase() + species.slice(1);
}

function buildSidebarMenu(menuItems) {
  const sidebar = document.querySelector(".sidebar");
  const menuList = sidebar.querySelector("ul");
  menuList.innerHTML = "";

  menuItems.forEach((item, index) => {
    const li = document.createElement("li");
    if (index === 0) {
      li.classList.add("selected");
    }
    const a = document.createElement("a");
    a.href = "#";
    a.id = `${item.id}Link`;

    a.textContent = item.displayName;

    li.appendChild(a);
    menuList.appendChild(li);
  });

  attachMenuEventListeners();
}

function attachMenuEventListeners() {
  const menuItems = document.querySelectorAll(".sidebar ul li a");

  menuItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault();

      document.querySelectorAll(".sidebar ul li").forEach((li) => {
        li.classList.remove("selected");
      });

      this.parentElement.classList.add("selected");
    });
  });
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
    // Additional processing can go here
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
