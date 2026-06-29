/*=========================================================
    REVEAL AO SCROLL
=========================================================*/

const reveals = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right",
);

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  const revealPoint = 120;

  reveals.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < windowHeight - revealPoint) {
      element.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/*=========================================================
    GALERIA - TROCA DE IMAGEM PRINCIPAL
=========================================================*/

const galleries = document.querySelectorAll(".vivencia-galeria");

galleries.forEach((gallery) => {
  const mainImage = gallery.querySelector(".imagem-principal");
  const thumbnails = gallery.querySelectorAll(".galeria-miniaturas img");

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", (e) => {
      e.stopPropagation();

      mainImage.style.opacity = "0";

      setTimeout(() => {
        mainImage.src = thumb.src;
        mainImage.alt = thumb.alt;
        mainImage.style.opacity = "1";
      }, 200);
    });
  });
});

/*=========================================================
    LIGHTBOX
=========================================================*/

const lightbox = document.createElement("div");

lightbox.className = "vivencias-lightbox";

lightbox.innerHTML = `
  <span class="close-vivencias-lightbox">&times;</span>
  <img class="vivencias-lightbox-image" src="" alt="">
`;

document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector(".vivencias-lightbox-image");

/* abre somente ao clicar na imagem principal */

document.querySelectorAll(".imagem-principal").forEach((image) => {
  image.addEventListener("click", () => {
    lightboxImage.src = image.src;
    lightbox.classList.add("active");
  });
});

lightbox.addEventListener("click", (event) => {
  if (
    event.target === lightbox ||
    event.target.classList.contains("close-vivencias-lightbox")
  ) {
    lightbox.classList.remove("active");
  }
});

/*=========================================================
    FECHAR LIGHTBOX COM ESC
=========================================================*/

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    lightbox.classList.remove("active");
  }
});

/*=========================================================
    ZOOM SUAVE NAS IMAGENS
=========================================================*/

const images = document.querySelectorAll(".imagem-principal");

images.forEach((image) => {
  image.addEventListener("mousemove", (event) => {
    const rect = image.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    image.style.transformOrigin = `${x}% ${y}%`;
  });
});

/*=========================================================
    LAZY LOADING
=========================================================*/

const lazyImages = document.querySelectorAll(".vivencias-page img");

const lazyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.loading = "lazy";
      lazyObserver.unobserve(entry.target);
    }
  });
});

lazyImages.forEach((img) => {
  lazyObserver.observe(img);
});

/*=========================================================
    LER MAIS DAS VIVÊNCIAS
=========================================================*/

const vivenciaButtons = document.querySelectorAll(".vivencia-toggle");

vivenciaButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.previousElementSibling;

    content.classList.toggle("active");

    button.textContent = content.classList.contains("active")
      ? "Mostrar menos"
      : "Ler mais";
  });
});

/*=========================================================
    MENU MOBILE
=========================================================*/

const menuToggle = document.querySelector("#menu-toggle");
const nav = document.querySelector("#nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuToggle.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      menuToggle.classList.remove("open");
    });
  });
}
