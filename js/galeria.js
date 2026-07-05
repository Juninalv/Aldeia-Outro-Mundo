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

const tracks = document.querySelectorAll(".gallery-track");

tracks.forEach((track) => {
  const nextBtn = track.parentElement.querySelector(".next");

  const prevBtn = track.parentElement.querySelector(".prev");

  nextBtn.addEventListener("click", () => {
    track.scrollBy({
      left: 450,
      behavior: "smooth",
    });
  });

  prevBtn.addEventListener("click", () => {
    track.scrollBy({
      left: -450,
      behavior: "smooth",
    });
  });

  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener("mousedown", (e) => {
    isDown = true;

    track.classList.add("active");

    startX = e.pageX - track.offsetLeft;

    scrollLeft = track.scrollLeft;
  });

  track.addEventListener("mouseleave", () => {
    isDown = false;

    track.classList.remove("active");
  });

  track.addEventListener("mouseup", () => {
    isDown = false;

    track.classList.remove("active");
  });

  track.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    e.preventDefault();

    const x = e.pageX - track.offsetLeft;

    const walk = (x - startX) * 2;

    track.scrollLeft = scrollLeft - walk;
  });
});

/* ==========================================
   LIGHTBOX
========================================== */

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");

const closeBtn = document.querySelector(".lightbox-close");
const nextLight = document.querySelector(".lightbox-next");
const prevLight = document.querySelector(".lightbox-prev");

let currentGallery = [];
let currentIndex = 0;

/* Associa cada imagem à sua própria galeria */
document.querySelectorAll(".gallery-track").forEach((track) => {
  const galleryImages = [...track.querySelectorAll(".gallery-item img")];

  galleryImages.forEach((img, index) => {
    img.addEventListener("click", () => {
      currentGallery = galleryImages;
      currentIndex = index;

      updateLightbox();

      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });
});

function updateLightbox() {
  lightboxImage.src = currentGallery[currentIndex].src;
  lightboxImage.alt = currentGallery[currentIndex].alt;
}

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

function showNext() {
  currentIndex++;

  if (currentIndex >= currentGallery.length) {
    currentIndex = 0;
  }

  updateLightbox();
}

function showPrev() {
  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = currentGallery.length - 1;
  }

  updateLightbox();
}

closeBtn.addEventListener("click", closeLightbox);

nextLight.addEventListener("click", showNext);

prevLight.addEventListener("click", showPrev);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;

  switch (e.key) {
    case "Escape":
      closeLightbox();
      break;

    case "ArrowRight":
      showNext();
      break;

    case "ArrowLeft":
      showPrev();
      break;
  }
});
