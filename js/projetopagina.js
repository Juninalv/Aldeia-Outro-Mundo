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
    CONTADORES
=========================================================*/

const counters = document.querySelectorAll(".counter");

function startCounter(counter) {
  const target = Number(counter.dataset.target);

  let current = 0;

  const increment = target / 120;

  const timer = setInterval(() => {
    current += increment;

    if (current >= target) {
      counter.textContent = target.toLocaleString("pt-BR");

      clearInterval(timer);
    } else {
      counter.textContent = Math.floor(current).toLocaleString("pt-BR");
    }
  }, 15);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        startCounter(entry.target);

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.6,
  },
);

counters.forEach((counter) => {
  observer.observe(counter);
});

/*=========================================================
    LIGHTBOX
=========================================================*/

const images = document.querySelectorAll(".project-gallery img");

const lightbox = document.createElement("div");

lightbox.classList.add("lightbox");

lightbox.innerHTML = `
    <span class="close-lightbox">&times;</span>
    <img src="">
`;

document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector("img");

images.forEach((image) => {
  image.addEventListener("click", () => {
    lightbox.classList.add("show");

    lightboxImg.src = image.src;
  });
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target.classList.contains("close-lightbox")) {
    lightbox.classList.remove("show");
  }
});

/*=========================================================
    FECHAR COM ESC
=========================================================*/

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    lightbox.classList.remove("show");
  }
});

/*=========================================================
    ZOOM SUAVE NAS IMAGENS
=========================================================*/

const projectImages = document.querySelectorAll(".project-image img");

projectImages.forEach((image) => {
  image.addEventListener("mousemove", (e) => {
    const rect = image.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;

    const y = ((e.clientY - rect.top) / rect.height) * 100;

    image.style.transformOrigin = `${x}% ${y}%`;
  });
});

/*=========================================================
    LAZY LOADING
=========================================================*/

const lazyImages = document.querySelectorAll("img");

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
    SCROLL SUAVE DOS BOTÕES
=========================================================*/

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

/*=========================================================
    LER MAIS DOS PROJETOS
=========================================================*/

const projectToggles = document.querySelectorAll(".project-toggle");

projectToggles.forEach((button) => {
  button.addEventListener("click", () => {
    const projectExtra = button.nextElementSibling;

    projectExtra.classList.toggle("active");

    if (projectExtra.classList.contains("active")) {
      button.textContent = "Mostrar menos";
    } else {
      button.textContent = "Ler mais";
    }
  });
});
