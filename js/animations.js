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
/* ==========================================================
   SLIDER HORIZONTAL REUTILIZÁVEL
========================================================== */

function createHorizontalSlider({
  wrapperSelector,
  containerSelector,
  itemSelector,
  previousButtonSelector,
  nextButtonSelector,
  paginationSelector,
  dragSpeed = 1,
}) {
  const wrapper = document.querySelector(wrapperSelector);
  const container = document.querySelector(containerSelector);

  if (!container) return;

  const items = Array.from(container.querySelectorAll(itemSelector));

  if (!items.length) return;

  const previousButton = previousButtonSelector
    ? document.querySelector(previousButtonSelector)
    : null;

  const nextButton = nextButtonSelector
    ? document.querySelector(nextButtonSelector)
    : null;

  const pagination = paginationSelector
    ? document.querySelector(paginationSelector)
    : null;

  let sliderPositions = [];
  let currentPositionIndex = 0;

  let scrollTimeout;
  let animationTimeout;

  let isDragging = false;
  let isProgrammaticScroll = false;

  let dragStartX = 0;
  let initialScrollLeft = 0;

  /* ========================================================
     CALCULAR POSIÇÕES REAIS POSSÍVEIS
  ======================================================== */

  function calculatePositions() {
    const maximumScroll = container.scrollWidth - container.clientWidth;

    const containerRect = container.getBoundingClientRect();
    const positions = [];

    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();

      const itemPosition =
        container.scrollLeft + itemRect.left - containerRect.left;

      const validPosition = Math.max(0, Math.min(itemPosition, maximumScroll));

      const positionAlreadyExists = positions.some(
        (position) => Math.abs(position - validPosition) < 5,
      );

      if (!positionAlreadyExists) {
        positions.push(validPosition);
      }
    });

    /*
      Garante que o final físico do slider seja uma
      posição válida, mesmo quando o último item não
      consegue encostar totalmente na lateral esquerda.
    */

    const finalPositionAlreadyExists = positions.some(
      (position) => Math.abs(position - maximumScroll) < 5,
    );

    if (!finalPositionAlreadyExists && maximumScroll > 0) {
      positions.push(maximumScroll);
    }

    positions.sort((a, b) => a - b);

    sliderPositions = positions;
  }

  /* ========================================================
     CRIAR PAGINAÇÃO
  ======================================================== */

  function createPagination() {
    if (!pagination) return;

    pagination.innerHTML = "";

    sliderPositions.forEach((position, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.classList.add("slider-pagination-button");

      button.setAttribute("aria-label", `Ir para a posição ${index + 1}`);

      button.addEventListener("click", () => {
        goToPosition(index);
      });

      pagination.appendChild(button);
    });
  }

  /* ========================================================
     ATUALIZAR SETAS E BOLINHAS
  ======================================================== */

  function updateControls() {
    if (pagination) {
      const paginationButtons = pagination.querySelectorAll(
        ".slider-pagination-button",
      );

      paginationButtons.forEach((button, index) => {
        const isActive = index === currentPositionIndex;

        button.classList.toggle("active", isActive);

        if (isActive) {
          button.setAttribute("aria-current", "true");
        } else {
          button.removeAttribute("aria-current");
        }
      });
    }

    if (previousButton) {
      previousButton.disabled = currentPositionIndex === 0;
    }

    if (nextButton) {
      nextButton.disabled = currentPositionIndex === sliderPositions.length - 1;
    }
  }

  /* ========================================================
     IR PARA UMA POSIÇÃO
  ======================================================== */

  function goToPosition(index) {
    if (!sliderPositions.length) return;

    const validIndex = Math.max(0, Math.min(index, sliderPositions.length - 1));

    currentPositionIndex = validIndex;
    isProgrammaticScroll = true;

    clearTimeout(animationTimeout);

    container.scrollTo({
      left: sliderPositions[currentPositionIndex],
      behavior: "smooth",
    });

    updateControls();

    /*
      Evita que o evento de scroll altere o índice
      enquanto a rolagem suave ainda está acontecendo.
    */

    animationTimeout = setTimeout(() => {
      isProgrammaticScroll = false;
      updateCurrentPosition();
    }, 550);
  }

  /* ========================================================
     IDENTIFICAR POSIÇÃO ATUAL
  ======================================================== */

  function updateCurrentPosition() {
    if (!sliderPositions.length || isProgrammaticScroll) return;

    const currentScroll = container.scrollLeft;

    let closestIndex = 0;
    let closestDistance = Infinity;

    sliderPositions.forEach((position, index) => {
      const distance = Math.abs(currentScroll - position);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    currentPositionIndex = closestIndex;

    updateControls();
  }

  /* ========================================================
     SETAS
  ======================================================== */

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      goToPosition(currentPositionIndex - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      goToPosition(currentPositionIndex + 1);
    });
  }

  /* ========================================================
     ROLAGEM MANUAL
  ======================================================== */

  container.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        if (!isDragging && !isProgrammaticScroll) {
          updateCurrentPosition();
        }
      }, 120);
    },
    {
      passive: true,
    },
  );

  /* ========================================================
     ARRASTAR COM O MOUSE
  ======================================================== */

  container.addEventListener("mousedown", (event) => {
    isDragging = true;
    isProgrammaticScroll = false;

    clearTimeout(animationTimeout);

    container.classList.add("dragging");

    dragStartX = event.pageX;
    initialScrollLeft = container.scrollLeft;
  });

  container.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    event.preventDefault();

    const movement = (event.pageX - dragStartX) * dragSpeed;

    container.scrollLeft = initialScrollLeft - movement;
  });

  function stopDragging() {
    if (!isDragging) return;

    isDragging = false;

    container.classList.remove("dragging");

    updateCurrentPosition();
  }

  container.addEventListener("mouseup", stopDragging);
  container.addEventListener("mouseleave", stopDragging);

  /*
    Impede o navegador de arrastar a imagem,
    preservando o arraste do slider.
  */

  container.querySelectorAll("img").forEach((image) => {
    image.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
  });

  /* ========================================================
     TECLADO
  ======================================================== */

  if (wrapper) {
    wrapper.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();

        goToPosition(currentPositionIndex - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();

        goToPosition(currentPositionIndex + 1);
      }
    });
  }

  /* ========================================================
     RESPONSIVIDADE
  ======================================================== */

  window.addEventListener("resize", () => {
    clearTimeout(scrollTimeout);
    clearTimeout(animationTimeout);

    isProgrammaticScroll = false;

    scrollTimeout = setTimeout(() => {
      const previousProgress =
        sliderPositions.length > 1
          ? currentPositionIndex / (sliderPositions.length - 1)
          : 0;

      calculatePositions();
      createPagination();

      currentPositionIndex = Math.round(
        previousProgress * Math.max(0, sliderPositions.length - 1),
      );

      currentPositionIndex = Math.max(
        0,
        Math.min(currentPositionIndex, sliderPositions.length - 1),
      );

      container.scrollTo({
        left: sliderPositions[currentPositionIndex] || 0,
        behavior: "auto",
      });

      updateControls();
    }, 180);
  });

  /* ========================================================
     INICIALIZAÇÃO
  ======================================================== */

  calculatePositions();
  createPagination();
  updateCurrentPosition();
  updateControls();
}

/* ==========================================================
   ANIMAÇÃO DA TIMELINE
========================================================== */

const timelineItems = document.querySelectorAll(".timeline-item");

if (timelineItems.length) {
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
}

/* ==========================================================
   INICIALIZAR TIMELINE
========================================================== */

createHorizontalSlider({
  wrapperSelector: ".timeline-slider",
  containerSelector: ".timeline-container",
  itemSelector: ".timeline-item",
  previousButtonSelector: ".timeline-arrow-prev",
  nextButtonSelector: ".timeline-arrow-next",
  paginationSelector: ".timeline-pagination",
  dragSpeed: 0.6,
});

/* ==========================================================
   INICIALIZAR PROJETOS
========================================================== */

createHorizontalSlider({
  wrapperSelector: ".projetos-container",
  containerSelector: ".projetos-grid",
  itemSelector: ".projeto-card",
  previousButtonSelector: ".projetos-arrow-prev",
  nextButtonSelector: ".projetos-arrow-next",
  paginationSelector: ".slider-dots",
  dragSpeed: 2,
});

/* ==========================================================
   INICIALIZAR INFRAESTRUTURA
========================================================== */

createHorizontalSlider({
  wrapperSelector: ".explore-slider",
  containerSelector: ".explore-grid",
  itemSelector: ".explore-card",
  previousButtonSelector: ".explore-arrow-prev",
  nextButtonSelector: ".explore-arrow-next",
  paginationSelector: ".explore-pagination",
  dragSpeed: 2,
});

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

/* VÍDEO APRESENTAÇÃO */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".video-card").forEach((card) => {
    const video = card.querySelector("video");
    const button = card.querySelector(".play-button");

    if (!video || !button) return;

    const showButton = () => button.classList.remove("hide");
    const hideButton = () => button.classList.add("hide");

    // CLICK NO BOTÃO (PLAY)
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      video.play();
      hideButton();
    });

    // CLICK NO VÍDEO (PAUSE/PLAY TOGGLE)
    video.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        hideButton();
      } else {
        video.pause();
        showButton();
      }
    });

    // QUANDO TOCAR
    video.addEventListener("play", hideButton);

    // QUANDO PAUSAR
    video.addEventListener("pause", () => {
      if (!video.ended) showButton();
    });

    // QUANDO TERMINAR
    video.addEventListener("ended", showButton);
  });
});
