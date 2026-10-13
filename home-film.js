const filmWindow = document.querySelector("#home-film-window");
const filmCursor = document.querySelector("#home-film-cursor");
const filmToggle = document.querySelector("#home-film-toggle");
const filmTyped = document.querySelector("#home-film-typed");
const filmCaptionTitle = document.querySelector("#home-film-caption-title");
const filmCaptionCopy = document.querySelector("#home-film-caption-copy");
const filmClaim = document.querySelector("#home-film-claim");
const filmDroTarget = document.querySelector("#home-film-dro-target");
const filmEvidenceCount = document.querySelector("#home-film-evidence-count");
const filmSearchStatus = document.querySelector("#film-search-status");
const filmCompile = document.querySelector("#home-film-compile");
const filmTabs = Array.from(document.querySelectorAll("[data-home-film-tab]"));
const filmScenes = Array.from(document.querySelectorAll("[data-home-film-scene]"));
const reducedFilmMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let filmRun = 0;
let filmRunning = false;
let filmPaused = false;
let filmVisible = false;

function setFilmScene(scene) {
  filmTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.homeFilmTab === scene));
  filmScenes.forEach((panel) => panel.classList.toggle("active", panel.dataset.homeFilmScene === scene));
}

function setFilmCaption(title, copy) {
  filmCaptionTitle.textContent = title;
  filmCaptionCopy.textContent = copy;
}

function waitFilm(milliseconds, run) {
  return new Promise((resolve) => {
    let remaining = milliseconds;
    let previous = performance.now();

    function tick(now) {
      if (run !== filmRun) {
        resolve(false);
        return;
      }
      if (!filmPaused && filmVisible) remaining -= now - previous;
      previous = now;
      if (remaining <= 0) {
        resolve(true);
        return;
      }
      window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
  });
}

async function moveFilmCursor(selector, run, duration = 780) {
  const target = document.querySelector(selector);
  if (!target || run !== filmRun) return false;
  const windowRect = filmWindow.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const x = targetRect.left - windowRect.left + targetRect.width / 2 - 3;
  const y = targetRect.top - windowRect.top + targetRect.height / 2 - 4;
  const position = `translate(${x}px, ${y}px)`;
  filmCursor.style.transitionDuration = `${duration}ms`;
  filmCursor.style.setProperty("--cursor-position", position);
  filmCursor.style.transform = position;
  filmCursor.classList.add("visible");
  return waitFilm(duration + 80, run);
}

async function clickFilmControl(selector, run) {
  if (!(await moveFilmCursor(selector, run))) return false;
  const control = document.querySelector(selector);
  filmCursor.classList.add("clicking");
  control.click();
  const continued = await waitFilm(180, run);
  filmCursor.classList.remove("clicking");
  return continued;
}

function resetFilm() {
  filmRun += 1;
  setFilmScene("chat");
  setFilmCaption("Direct the research", "Work with TheoX in natural language.");
  filmTyped.textContent = "";
  filmClaim.classList.remove("dragging", "admitted");
  filmDroTarget.classList.remove("accepting");
  filmEvidenceCount.textContent = "38 assets";
  filmSearchStatus.textContent = "Running";
  filmCompile.classList.remove("compiling");
  filmCompile.textContent = "Compile";
  filmCursor.classList.remove("visible", "clicking");
  filmPaused = false;
  filmRunning = false;
  filmToggle.textContent = "Play";
  filmToggle.setAttribute("aria-label", "Play workflow film");
}

async function typeFilmDirection(text, run) {
  for (const character of text) {
    if (run !== filmRun) return false;
    filmTyped.textContent += character;
    if (!(await waitFilm(character === " " ? 22 : 35, run))) return false;
  }
  return true;
}

async function playFilm() {
  resetFilm();
  const run = filmRun;
  filmRunning = true;
  filmToggle.textContent = "Pause";
  filmToggle.setAttribute("aria-label", "Pause workflow film");

  if (!(await waitFilm(450, run))) return;
  if (!(await moveFilmCursor(".film-composer", run))) return;
  if (!(await typeFilmDirection("Find structure the current descriptors miss.", run))) return;
  if (!(await clickFilmControl("#home-film-send", run))) return;

  setFilmCaption("Search the Study", "TheoX inspects data, code, prior claims, and counterexamples.");
  if (!(await clickFilmControl('[data-home-film-tab="discover"]', run))) return;
  if (!(await waitFilm(900, run))) return;
  filmSearchStatus.textContent = "17 candidates";
  if (!(await waitFilm(900, run))) return;

  setFilmCaption("Preserve what survives", "Evidence is dragged into the versioned research record.");
  if (!(await moveFilmCursor("#home-film-claim", run))) return;
  filmCursor.classList.add("clicking");
  filmClaim.classList.add("dragging");
  filmDroTarget.classList.add("accepting");
  if (!(await moveFilmCursor("#home-film-dro-target", run, 1050))) return;
  filmCursor.classList.remove("clicking");
  filmClaim.classList.add("admitted");
  filmEvidenceCount.textContent = "39 assets";
  if (!(await waitFilm(650, run))) return;

  setFilmCaption("Inspect the lineage", "Questions, failures, evidence, and contributors remain connected.");
  if (!(await clickFilmControl('[data-home-film-tab="dro"]', run))) return;
  if (!(await waitFilm(1900, run))) return;

  setFilmCaption("Develop the manuscript", "The paper stays beside the software and evidence that produced it.");
  if (!(await clickFilmControl('[data-home-film-tab="paper"]', run))) return;
  if (!(await waitFilm(850, run))) return;
  if (!(await clickFilmControl("#home-film-compile", run))) return;
  filmCompile.classList.add("compiling");
  filmCompile.textContent = "Compiled";
  if (!(await waitFilm(2200, run))) return;

  filmCursor.classList.remove("visible");
  filmRunning = false;
  filmToggle.textContent = "Replay";
  filmToggle.setAttribute("aria-label", "Replay workflow film");
  setFilmCaption("Continue the Study", "The living record is ready for the next question.");
}

filmTabs.forEach((tab) => {
  tab.addEventListener("click", () => setFilmScene(tab.dataset.homeFilmTab));
});

filmToggle.addEventListener("click", () => {
  if (!filmRunning) {
    playFilm();
    return;
  }
  filmPaused = !filmPaused;
  filmToggle.textContent = filmPaused ? "Resume" : "Pause";
  filmToggle.setAttribute("aria-label", `${filmPaused ? "Resume" : "Pause"} workflow film`);
});

const filmObserver = new IntersectionObserver(
  ([entry]) => {
    filmVisible = entry.isIntersecting;
    if (filmVisible && !filmRunning && !reducedFilmMotion.matches && filmTyped.textContent === "") playFilm();
  },
  { threshold: 0.35 },
);

resetFilm();
filmObserver.observe(filmWindow);
