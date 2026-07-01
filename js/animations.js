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
  "./img/proposito/proposito-et-sol.jpg",
  "./img/proposito/proposito-ecologia.jpg",
  "./img/proposito/proposito-educacao.jpg",
  "./img/proposito/proposito-alien-coffee.jpg",
  "./img/proposito/proposito-palco-chillout.jpg",
  "./img/proposito/proposito-lago-3.jpg",
  "./img/proposito/proposito-gaia-conection.jpg",
  "./img/proposito/proposito-mundo-de-oz.jpg",
  "./img/proposito/proposito-casa.jpg",
  "./img/proposito/proposito-et.jpg",
  "./img/proposito/proposito-homem.jpg",
  "./img/proposito/proposito-lago-2.jpg",
  "./img/proposito/proposito-lago.jpg",
  "./img/proposito/proposito-mao.jpg",
  "./img/proposito/proposito-rosto.jpg",
  "./img/proposito/proposito-santa.jpg",
  "./img/proposito/proposito-vista.jpg",
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
/* RELATOS */

const slides = document.querySelectorAll(".relato-slide");
const dots = document.querySelectorAll(".dot");

const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

if (slides.length && prevBtn && nextBtn) {
  let current = 0;

  function showSlide(index) {
    slides.forEach((slide) => {
      slide.classList.remove("active");
    });

    dots.forEach((dot) => {
      dot.classList.remove("active");
    });

    slides[index].classList.add("active");

    if (dots[index]) {
      dots[index].classList.add("active");
    }
  }

  nextBtn.addEventListener("click", () => {
    current++;

    if (current >= slides.length) {
      current = 0;
    }

    showSlide(current);
  });

  prevBtn.addEventListener("click", () => {
    current--;

    if (current < 0) {
      current = slides.length - 1;
    }

    showSlide(current);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      current = index;
      showSlide(current);
    });
  });

  /* AUTO PLAY */

  setInterval(() => {
    current++;

    if (current >= slides.length) {
      current = 0;
    }

    showSlide(current);
  }, 7000);
}

/* MENU MOBILE */

const menuToggle = document.querySelector("#menu-toggle");
const nav = document.querySelector("#nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");

    menuToggle.classList.toggle("open");
  });

  // fecha ao clicar em algum link

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      menuToggle.classList.remove("open");
    });
  });
}
/* INFRAESTRUTURA */

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".explore-grid");
  const pagination = document.querySelector(".explore-pagination");

  if (!slider || !pagination) return;

  /* ========= Criar bolinhas automaticamente ========= */

  const cards = slider.querySelectorAll(".explore-card");

  let cardsPerView = 5;

  if (window.innerWidth <= 768) {
    cardsPerView = 1;
  } else if (window.innerWidth <= 1024) {
    cardsPerView = 3;
  }

  const totalPages = Math.max(1, cards.length - cardsPerView + 1);

  pagination.innerHTML = "";

  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement("span");

    if (i === 0) {
      dot.classList.add("active");
    }

    pagination.appendChild(dot);
  }

  const dots = pagination.querySelectorAll("span");

  /* ========= Atualizar bolinha ativa ========= */

  function updatePagination() {
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    if (maxScroll <= 0) return;

    const progress = slider.scrollLeft / maxScroll;

    const index = Math.round(progress * (dots.length - 1));

    dots.forEach((dot) => dot.classList.remove("active"));

    if (dots[index]) {
      dots[index].classList.add("active");
    }
  }

  slider.addEventListener("scroll", updatePagination);

  updatePagination();

  /* ========= Arrastar com o mouse ========= */

  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;

    slider.classList.add("dragging");

    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("dragging");
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("dragging");
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    e.preventDefault();

    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;

    slider.scrollLeft = scrollLeft - walk;
  });
});
