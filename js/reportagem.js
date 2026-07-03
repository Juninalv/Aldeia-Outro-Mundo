const reveals = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right, .reveal-scale",
);

const revealObserver = new IntersectionObserver(
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

reveals.forEach((item) => revealObserver.observe(item));

window.addEventListener("load", () => {
  reveals.forEach((item) => {
    const rect = item.getBoundingClientRect();

    if (rect.top < window.innerHeight) {
      item.classList.add("active");
    }
  });
});

/* =========================================
   MENU MOBILE
========================================== */

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

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     MÍDIAS (Vídeos, Imagens e iframes)
  ========================================== */

  const medias = document.querySelectorAll(
    ".reportagem-media video, .reportagem-media iframe, .reportagem-media img",
  );

  medias.forEach(() => {
    // reservado para melhorias futuras
  });

  /* =========================================
     PARALLAX
  ========================================== */

  const sections = document.querySelectorAll(".reportagem");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const offsetTop = section.offsetTop;
      const height = section.offsetHeight;

      if (
        scrollY > offsetTop - window.innerHeight &&
        scrollY < offsetTop + height
      ) {
        const move = (scrollY - offsetTop) * 0.03;

        section.style.setProperty("--parallax", `${move}px`);
      }
    });
  });

  /* =========================================
     REVEAL DAS REPORTAGENS
  ========================================== */

  const items = document.querySelectorAll(
    ".reportagem-content, .reportagem-media",
  );

  const itemObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  items.forEach((item) => itemObserver.observe(item));

  /* =========================================
     GARANTE VISIBILIDADE NO LOAD
  ========================================== */

  window.addEventListener("load", () => {
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();

      if (rect.top < window.innerHeight) {
        item.classList.add("active");
      }
    });
  });
});
