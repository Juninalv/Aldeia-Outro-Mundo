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
    const walk = (x - startX) * 2;

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
  const projetoCards = document.querySelectorAll(".projeto-card");
  const dotsContainer = document.querySelector(".slider-dots");

  if (
    !projetosSlider ||
    !projetoCards.length ||
    !dotsContainer ||
    window.innerWidth > 768
  ) {
    return;
  }

  /* CRIA BOLINHAS */

  projetoCards.forEach((_, index) => {
    const dot = document.createElement("span");

    if (index === 0) {
      dot.classList.add("active");
    }

    dot.addEventListener("click", () => {
      projetosSlider.scrollTo({
        left: projetoCards[index].offsetLeft,
        behavior: "smooth",
      });
    });

    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".slider-dots span");

  /* ATUALIZA BOLINHA ATIVA */

  projetosSlider.addEventListener("scroll", () => {
    let current = 0;

    projetoCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();

      if (rect.left >= -rect.width / 2 && rect.left < window.innerWidth / 2) {
        current = index;
      }
    });

    dots.forEach((dot) => dot.classList.remove("active"));

    if (dots[current]) {
      dots[current].classList.add("active");
    }
  });

  /* BOTÃO PRÓXIMO */

  const nextBtn = document.querySelector(".next");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const cardWidth = projetoCards[0].offsetWidth + 16;

      projetosSlider.scrollBy({
        left: cardWidth,
        behavior: "smooth",
      });
    });
  }

  /* BOTÃO ANTERIOR */

  const prevBtn = document.querySelector(".prev");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const cardWidth = projetoCards[0].offsetWidth + 16;

      projetosSlider.scrollBy({
        left: -cardWidth,
        behavior: "smooth",
      });
    });
  }
});
