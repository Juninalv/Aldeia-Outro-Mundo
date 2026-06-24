const reveals = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right, .reveal-scale",
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {
    threshold: 0.1,
  },
);

reveals.forEach((item) => {
  observer.observe(item);
});

/* força os elementos já visíveis na tela */
window.addEventListener("load", () => {
  reveals.forEach((item) => {
    const rect = item.getBoundingClientRect();

    if (rect.top < window.innerHeight) {
      item.classList.add("active");
    }
  });
});

/* TIMELINE */
const timelineItems = document.querySelectorAll(".timeline-item");

const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.3,
  },
);

timelineItems.forEach((item) => {
  timelineObserver.observe(item);
});

const slider = document.querySelector(".timeline-container");

if (slider) {
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    e.preventDefault();

    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 0.6;

    slider.scrollLeft = scrollLeft - walk;
  });
}

/* SUSTENTABILIDADE */

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".sust-card");

  const modal = document.getElementById("sustModal");
  const closeModal = document.getElementById("closeModal");

  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  const modalImg = document.getElementById("modalImg");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      /* DESKTOP */
      if (window.innerWidth > 768) {
        cards.forEach((item) => item.classList.remove("active"));
        card.classList.add("active");
        return;
      }

      /* MOBILE */
      if (!modal) return;

      const expandContent = card.querySelector(".expand-content");
      const cardImg = card.querySelector("img");

      modalTitle.textContent = card.dataset.title || "";

      modalText.innerHTML = expandContent ? expandContent.innerHTML : "";

      modalImg.src = cardImg ? cardImg.src : "";

      modalImg.alt = card.dataset.title || "";

      modal.classList.add("show");
      document.body.style.overflow = "hidden";
    });
  });

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.classList.remove("show");
      document.body.style.overflow = "";
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
        document.body.style.overflow = "";
      }
    });
  }
});
/* PROJETOS */

document.addEventListener("DOMContentLoaded", () => {
  const projetosSlider = document.querySelector(".projetos-grid");

  if (!projetosSlider) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  projetosSlider.addEventListener("mousedown", (e) => {
    isDown = true;
    projetosSlider.classList.add("dragging");

    startX = e.pageX - projetosSlider.offsetLeft;
    scrollLeft = projetosSlider.scrollLeft;
  });

  projetosSlider.addEventListener("mouseleave", () => {
    isDown = false;
    projetosSlider.classList.remove("dragging");
  });

  projetosSlider.addEventListener("mouseup", () => {
    isDown = false;
    projetosSlider.classList.remove("dragging");
  });

  projetosSlider.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    e.preventDefault();

    const x = e.pageX - projetosSlider.offsetLeft;
    const walk = (x - startX) * 2;

    projetosSlider.scrollLeft = scrollLeft - walk;
  });
});
/* GALERIA AUTOMÁTICA - PROPÓSITO */

const imagensProposito = [
  "./img/arte.jpg",
  "./img/ecologia.jpg",
  "./img/educacao.jpg",
  "./img/galeria-2.JPG",
  "./img/galeria-7.jpg",
  "./img/palco-chillout.jpg",
  "./img/galeria-8.jpg",
  "./img/gaia-conection.jpg",
  "./img/mundo-de-oz.jpg",
];

const imagens = document.querySelectorAll(".proposito-images img");

let indice = 3;
let posicao = 0;

if (imagens.length) {
  setInterval(() => {
    imagens[posicao].style.opacity = "0";

    setTimeout(() => {
      imagens[posicao].src = imagensProposito[indice];

      imagens[posicao].style.opacity = "1";

      indice++;

      if (indice >= imagensProposito.length) {
        indice = 0;
      }

      posicao++;

      if (posicao >= imagens.length) {
        posicao = 0;
      }
    }, 500);
  }, 3000);
}
