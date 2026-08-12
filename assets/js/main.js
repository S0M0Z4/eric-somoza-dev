const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const scrollTopBtn = document.getElementById("scrollTop");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

const projects = {
  plantel09: {
    category: "Página / Sistema Web",
    title: "Plantel 09",
    description: "Proyecto web con secciones institucionales e información organizada.",
    longDescription: "Proyecto web institucional desarrollado durante un periodo de estancia, enfocado en mejorar la presencia digital del Plantel 09 mediante una plataforma moderna, responsiva y organizada. El sitio permite mostrar información relevante, avisos, servicios, galerías y contenido institucional de forma clara para estudiantes, docentes y visitantes. Después de su desarrollo inicial, el proyecto continúa en proceso de mejora mediante actualizaciones, ajustes visuales, optimización de contenido y la incorporación de nuevas funcionalidades según las necesidades del plantel.",
    status: "Terminado / Entregado",
    cost: "Editable",
    type: "Proyecto web",
    tags: ["HTML", "CSS", "JavaScript", "PHP"],
    images: [
      "assets/img/proyectos/plantel-09/Captura-1.png",
      "assets/img/proyectos/plantel-09/captura-2.png",
      "assets/img/proyectos/plantel-09/captura-3.png",
      "assets/img/proyectos/plantel-09/captura-4.png",
      "assets/img/proyectos/plantel-09/captura-5.png",
      "assets/img/proyectos/plantel-09/captura-6.png",
      "assets/img/proyectos/plantel-09/captura-7.png",
     

    ]
  },
  gestion: {
    category: "Sistema Administrativo",
    title: "Sistema de Gestión",
    description: "Sistema para administrar información, registros y módulos internos.",
    longDescription: "Core 360 es un sistema de gestión de ventas desarrollado para una tienda que necesitaba mejorar el control de sus procesos internos. El proyecto fue diseñado para administrar productos, inventario, ventas, proveedores, sucursales, usuarios y reportes desde una plataforma web clara y organizada. Su objetivo principal fue facilitar el manejo diario del negocio, optimizando el registro de ventas y el control de existencias. El sistema fue adaptado a las necesidades del cliente, ofreciendo una interfaz práctica, módulos bien estructurados y herramientas que ayudan a mantener la información más ordenada y accesible. para procesos donde se necesita orden, búsqueda y administración visual.",
    status: "Funcional",
    cost: "Editable",
    type: "Sistema administrativo",
    tags: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
    images: [
      "assets/img/proyectos/sistema-gestion/captura-1.png",
      "assets/img/proyectos/sistema-gestion/captura-1.1.png",
      "assets/img/proyectos/sistema-gestion/captura-2.png",
      "assets/img/proyectos/sistema-gestion/captura-3.png",
      "assets/img/proyectos/sistema-gestion/captura-4.png",
      "assets/img/proyectos/sistema-gestion/captura-5.png",
      "assets/img/proyectos/sistema-gestion/captura-6.png", 
      "assets/img/proyectos/sistema-gestion/captura-7.png",
      "assets/img/proyectos/sistema-gestion/captura-8.png",
      "assets/img/proyectos/sistema-gestion/captura-9.png",
      "assets/img/proyectos/sistema-gestion/captura-10.png",
      "assets/img/proyectos/sistema-gestion/captura-11.png",
      "assets/img/proyectos/sistema-gestion/captura-12.png",
      "assets/img/proyectos/sistema-gestion/captura-13.png",
      "assets/img/proyectos/sistema-gestion/captura-17.png"

    ]
  },
};

let modalIndex = 0;
let modalImages = [];

const modal = document.getElementById("projectModal");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalLongDescription = document.getElementById("modalLongDescription");
const modalStatus = document.getElementById("modalStatus");
const modalCost = document.getElementById("modalCost");
const modalType = document.getElementById("modalType");
const modalTags = document.getElementById("modalTags");
const modalTrack = document.getElementById("modalTrack");
const modalDots = document.getElementById("modalDots");
const modalPrev = document.getElementById("modalPrev");
const modalNext = document.getElementById("modalNext");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navLinks.classList.toggle("open");
  document.body.classList.toggle("menu-open");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 30);
  scrollTopBtn.classList.toggle("show", window.scrollY > 500);
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => {
  revealObserver.observe(element);
});

const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 130;
    if (scrollY >= sectionTop) current = section.getAttribute("id");
  });

  navItems.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

function openProject(projectKey) {
  const project = projects[projectKey];
  if (!project) return;

  modalCategory.textContent = project.category;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalLongDescription.textContent = project.longDescription;
  modalStatus.textContent = project.status;
  modalCost.textContent = project.cost;
  modalType.textContent = project.type;

  modalTags.innerHTML = "";
  project.tags.forEach(tag => {
    const span = document.createElement("span");
    span.textContent = tag;
    modalTags.appendChild(span);
  });

  modalImages = project.images;
  modalIndex = 0;

  modalTrack.innerHTML = "";
  modalDots.innerHTML = "";

  modalImages.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `${project.title} captura ${index + 1}`;
    modalTrack.appendChild(img);

    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Ver captura ${index + 1}`);
    dot.addEventListener("click", () => {
      modalIndex = index;
      updateModalCarousel();
    });
    modalDots.appendChild(dot);
  });

  updateModalCarousel();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function updateModalCarousel() {
  modalTrack.style.transform = `translateX(-${modalIndex * 100}%)`;

  Array.from(modalDots.children).forEach(dot => dot.classList.remove("active"));
  if (modalDots.children[modalIndex]) {
    modalDots.children[modalIndex].classList.add("active");
  }
}

modalPrev.addEventListener("click", () => {
  modalIndex = modalIndex === 0 ? modalImages.length - 1 : modalIndex - 1;
  updateModalCarousel();
});

modalNext.addEventListener("click", () => {
  modalIndex = modalIndex === modalImages.length - 1 ? 0 : modalIndex + 1;
  updateModalCarousel();
});

document.querySelectorAll(".project-open").forEach(button => {
  button.addEventListener("click", () => {
    openProject(button.dataset.project);
  });
});

document.querySelectorAll("[data-close-modal]").forEach(element => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeModal();
  }
});
