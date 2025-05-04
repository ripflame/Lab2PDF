document.addEventListener("DOMContentLoaded", () => {
  window.electron
    .getAllTests()
    .then((menuItems) => {
      buildSidebarMenu(menuItems);
    })
    .catch((error) => {
      console.error("Failed to get menu items: ", error);
    });
});

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
    item.addEventListener("click", function(event) {
      event.preventDefault();

      document.querySelectorAll(".sidebar ul li").forEach((li) => {
        li.classList.remove("selected");
      });

      this.parentElement.classList.add("selected");
      const id = this.id.replace("Link", "");

      console.log("HANDLE SENDING SELECTED ITEM");
    });
  });
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
