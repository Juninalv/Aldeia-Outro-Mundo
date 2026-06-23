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
