const featureFilms = Array.from(document.querySelectorAll("[data-feature-film]"));
const reducedFeatureMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function positionFeatureCursor(film, step) {
  const stage = film.querySelector(".feature-stage");
  const cursor = film.querySelector(".feature-cursor");
  const stageRect = stage.getBoundingClientRect();
  const stepRect = step.getBoundingClientRect();
  cursor.style.left = `${stepRect.left - stageRect.left + stepRect.width * 0.78}px`;
  cursor.style.top = `${stepRect.top - stageRect.top + Math.min(stepRect.height * 0.45, 34)}px`;
  cursor.classList.add("visible", "clicking");
  window.setTimeout(() => cursor.classList.remove("clicking"), 180);
}

async function playFeatureFilm(film) {
  const steps = Array.from(film.querySelectorAll("[data-feature-step]"));
  const caption = film.querySelector("[data-feature-caption]");
  const replay = film.querySelector("[data-feature-replay]");
  const cursor = film.querySelector(".feature-cursor");
  const run = String(Number(film.dataset.run || "0") + 1);
  film.dataset.run = run;
  film.dataset.played = "true";
  replay.textContent = "Playing";
  steps.forEach((step) => step.classList.remove("active"));
  cursor.classList.remove("visible", "clicking");

  for (const step of steps) {
    if (film.dataset.run !== run) return;
    step.classList.add("active");
    caption.textContent = step.dataset.caption;
    if (!reducedFeatureMotion.matches) positionFeatureCursor(film, step);
    await wait(reducedFeatureMotion.matches ? 80 : 1450);
  }

  if (film.dataset.run !== run) return;
  cursor.classList.remove("visible");
  replay.textContent = "Replay";
}

featureFilms.forEach((film) => {
  const replay = film.querySelector("[data-feature-replay]");
  replay.addEventListener("click", () => playFeatureFilm(film));
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && film.dataset.played !== "true") playFeatureFilm(film);
    },
    { threshold: 0.45 },
  );
  observer.observe(film);
});
