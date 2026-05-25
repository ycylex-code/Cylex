document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const savedTheme = localStorage.getItem("portfolio-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);
  if (!themeToggle || !themeLabel) return;

  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to night mode");
  themeLabel.textContent = isDark ? "Light" : "Night";
}

setTheme(initialTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});

document.querySelectorAll("[data-placeholder-image]").forEach((image) => {
  image.addEventListener("error", () => {
    image.classList.add("is-missing");
  });
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const dotsContainer = carousel.querySelector(".carousel-dots");
  const currentLabel = carousel.querySelector("[data-carousel-current]");
  const totalLabel = carousel.querySelector("[data-carousel-total]");
  const progressBar = carousel.querySelector("[data-carousel-progress]");
  const previousButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  let activeIndex = 0;
  let progress = 0;
  let autoplayTimer;
  const autoplayDelay = 5200;
  const progressStep = 100 / (autoplayDelay / 100);

  if (!track || slides.length === 0) return;

  totalLabel.textContent = String(slides.length).padStart(2, "0");

  const dots = slides.map((slide, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show screenshot ${index + 1}`);
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
    return dot;
  });

  function goToSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    progress = 0;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
    currentLabel.textContent = String(activeIndex + 1).padStart(2, "0");
    progressBar.style.width = "0%";
  }

  function startAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(() => {
      progress += progressStep;
      progressBar.style.width = `${Math.min(progress, 100)}%`;

      if (progress >= 100) {
        goToSlide(activeIndex + 1);
      }
    }, 100);
  }

  function restartAutoplay() {
    progress = 0;
    progressBar.style.width = "0%";
    startAutoplay();
  }

  previousButton.addEventListener("click", () => {
    goToSlide(activeIndex - 1);
    restartAutoplay();
  });

  nextButton.addEventListener("click", () => {
    goToSlide(activeIndex + 1);
    restartAutoplay();
  });

  carousel.addEventListener("mouseenter", () => {
    window.clearInterval(autoplayTimer);
  });

  carousel.addEventListener("mouseleave", startAutoplay);

  goToSlide(0);
  startAutoplay();
});

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get("name");
    const email = data.get("email");
    const message = data.get("message");
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

    window.location.href = `mailto:ycylex@gmail.com?subject=${subject}&body=${body}`;
  });
});
