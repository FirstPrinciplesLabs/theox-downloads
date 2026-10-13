const viewButtons = Array.from(document.querySelectorAll("[data-view]"));
const panels = Array.from(document.querySelectorAll("[data-panel]"));
const workspaceTitle = document.querySelector("#workspace-title");
const workspaceKicker = document.querySelector("#workspace-kicker");
const composer = document.querySelector("#demo-composer");
const messageInput = document.querySelector("#demo-message");
const conversation = document.querySelector("#conversation");
const searchButton = document.querySelector("#demo-search");
const searchDialog = document.querySelector("#search-dialog");

const viewLabels = {
  chat: ["Research advisor", "Orbit convergence time"],
  paper: ["Living manuscript", "Update-Order Compression"],
  dro: ["Discovery record", "DRO · Orbit convergence time"],
  replay: ["Research replay", "Orbit convergence time · 03:12"],
};

function setView(view) {
  if (!viewLabels[view]) return;
  panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === view));
  viewButtons.forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  workspaceKicker.textContent = viewLabels[view][0];
  workspaceTitle.textContent = viewLabels[view][1];
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  const userMessage = document.createElement("article");
  userMessage.className = "message user-message tour-generated";
  const userAuthor = document.createElement("div");
  userAuthor.className = "message-author";
  userAuthor.textContent = "You";
  const userText = document.createElement("p");
  userText.textContent = text;
  userMessage.append(userAuthor, userText);

  const response = document.createElement("article");
  response.className = "message advisor-message tour-generated";
  const responseAuthor = document.createElement("div");
  responseAuthor.className = "message-author";
  responseAuthor.textContent = "TheoX advisor · demonstration";
  const responseText = document.createElement("p");
  responseText.textContent = "In the installed product, the advisor would inspect the complete Study, choose tools, coordinate research agents, and preserve its work in the DRO. This web tour does not run a model or modify research data.";
  response.append(responseAuthor, responseText);

  conversation.append(userMessage, response);
  messageInput.value = "";
  conversation.scrollTop = conversation.scrollHeight;
});

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    composer.requestSubmit();
  }
});

searchButton.addEventListener("click", () => searchDialog.showModal());
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchDialog.showModal();
  }
});

const replayEvents = [
  {
    time: "00:00",
    category: "Study foundation",
    title: "The Study begins",
    description: "A finite-dynamics registry, its definitions, and its computation package enter the research record.",
    metric: "256 objects admitted",
    artifact: "registry.csv · definitions.yaml · computation package",
    bars: [20, 0, 0, 0, 0, 0, 0],
  },
  {
    time: "00:24",
    category: "Conjecture search",
    title: "Seventeen candidates emerge",
    description: "Agent reasoning and deterministic search agree on several scalar bounds, while relational candidates open a less familiar direction.",
    metric: "17 candidate statements",
    artifact: "kernel receipt · agent proposals · normalized corpus",
    bars: [20, 78, 0, 0, 0, 0, 0],
  },
  {
    time: "00:53",
    category: "Adversarial pressure",
    title: "Counterexamples reshape the search",
    description: "Eleven candidates fail. Their minimal witnesses are added to the Study, preventing the same weak forms from returning unchanged.",
    metric: "11 refuted · 6 survive",
    artifact: "counterexamples.jsonl · pressure-round-01.json",
    bars: [20, 78, 34, 0, 0, 0, 0],
  },
  {
    time: "01:21",
    category: "Visual conjecturing",
    title: "A separation appears",
    description: "Basin entropy rises while mean convergence time falls on a narrow family. The visual lane turns the separation into a new problem.",
    metric: "1 unexpected regime",
    artifact: "basin-entropy-vs-time.png · visual observation",
    bars: [20, 78, 34, 52, 0, 0, 0],
  },
  {
    time: "01:48",
    category: "Concept invention",
    title: "Update-order compression is defined",
    description: "The advisor introduces a condensation-order invariant that explains several surviving examples and generates a stronger conjecture.",
    metric: "1 concept · 3 descendants",
    artifact: "concepts.jsonl · descriptor implementation · fixtures",
    bars: [20, 78, 34, 52, 67, 0, 0],
  },
  {
    time: "02:26",
    category: "Independent replication",
    title: "The finite evidence reproduces",
    description: "A separate workspace reconstructs the examples from the recorded release and reproduces the observed separation without sharing cache state.",
    metric: "2 replications linked",
    artifact: "source revision 79b2e663 · replication receipt",
    bars: [20, 78, 34, 52, 67, 72, 0],
  },
  {
    time: "03:12",
    category: "Manuscript checkpoint",
    title: "A research release is preserved",
    description: "The claim remains explicitly unresolved, but its evidence, authorship, software, failures, and exact lineage are ready for continued work.",
    metric: "DRO release 8c14f01a",
    artifact: "main.tex · release manifest · license record",
    bars: [20, 78, 34, 52, 67, 72, 84],
  },
];

const replayTitle = document.querySelector("#replay-title");
const replayCategory = document.querySelector("#replay-category");
const replayDescription = document.querySelector("#replay-description");
const replayMetric = document.querySelector("#replay-metric");
const replayArtifact = document.querySelector("#replay-artifact");
const replayEventNumber = document.querySelector("#replay-event-number");
const replayCurrentTime = document.querySelector("#replay-current-time");
const replayScrubber = document.querySelector("#replay-scrubber");
const replayToggle = document.querySelector("#replay-toggle");
const replaySpeed = document.querySelector("#replay-speed");
const replaySteps = Array.from(document.querySelectorAll("[data-replay-step]"));
const replayBars = Array.from(document.querySelectorAll("[data-replay-bar]"));
let replayIndex = 0;
let replayTimer = null;

function renderReplay(index) {
  replayIndex = Math.max(0, Math.min(replayEvents.length - 1, index));
  const event = replayEvents[replayIndex];
  replayTitle.textContent = event.title;
  replayCategory.textContent = event.category;
  replayDescription.textContent = event.description;
  replayMetric.textContent = event.metric;
  replayArtifact.textContent = event.artifact;
  replayEventNumber.textContent = String(replayIndex + 1).padStart(2, "0");
  replayCurrentTime.textContent = event.time;
  replayScrubber.value = String(replayIndex);
  replaySteps.forEach((step, position) => step.parentElement.classList.toggle("active", position === replayIndex));
  replayBars.forEach((bar, position) => {
    bar.style.height = `${event.bars[position]}%`;
    bar.classList.toggle("current", position === replayIndex);
    bar.classList.toggle("future", position > replayIndex);
  });
}

function stopReplay() {
  window.clearInterval(replayTimer);
  replayTimer = null;
  replayToggle.textContent = "▶";
  replayToggle.setAttribute("aria-label", "Play research replay");
}

function startReplay() {
  if (replayIndex === replayEvents.length - 1) renderReplay(0);
  const delay = 1800 / Number(replaySpeed.value);
  replayTimer = window.setInterval(() => {
    if (replayIndex >= replayEvents.length - 1) {
      stopReplay();
      return;
    }
    renderReplay(replayIndex + 1);
  }, delay);
  replayToggle.textContent = "Ⅱ";
  replayToggle.setAttribute("aria-label", "Pause research replay");
}

replayToggle.addEventListener("click", () => {
  if (replayTimer) stopReplay();
  else startReplay();
});

replayScrubber.addEventListener("input", () => {
  stopReplay();
  renderReplay(Number(replayScrubber.value));
});

replaySpeed.addEventListener("change", () => {
  if (!replayTimer) return;
  stopReplay();
  startReplay();
});

replaySteps.forEach((step) => {
  step.addEventListener("click", () => {
    stopReplay();
    renderReplay(Number(step.dataset.replayStep));
  });
});

renderReplay(0);

const tourScreen = document.querySelector("#tour-screen");
const tourCursor = document.querySelector("#tour-cursor");
const tourToggle = document.querySelector("#tour-toggle");
const tourRestart = document.querySelector("#tour-restart");
const tourSceneTitle = document.querySelector("#tour-scene-title");
const tourSceneCopy = document.querySelector("#tour-scene-copy");
const tourProgressBar = document.querySelector("#tour-progress-bar");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let tourRun = 0;
let tourPaused = false;
let tourRunning = false;
let tourPausedReplay = false;

function setTourScene(title, copy, progress) {
  tourSceneTitle.textContent = title;
  tourSceneCopy.textContent = copy;
  tourProgressBar.style.width = `${progress}%`;
}

function waitForTour(milliseconds, run) {
  return new Promise((resolve) => {
    let remaining = milliseconds;
    let previous = performance.now();

    function tick(now) {
      if (run !== tourRun) {
        resolve(false);
        return;
      }
      if (!tourPaused) remaining -= now - previous;
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

async function moveTourCursor(selector, run) {
  const target = document.querySelector(selector);
  if (!target || run !== tourRun) return false;
  const screenRect = tourScreen.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  tourCursor.style.left = `${targetRect.left - screenRect.left + targetRect.width / 2}px`;
  tourCursor.style.top = `${targetRect.top - screenRect.top + targetRect.height / 2}px`;
  tourCursor.classList.add("visible");
  return waitForTour(850, run);
}

async function clickForTour(selector, run) {
  if (!(await moveTourCursor(selector, run))) return false;
  const target = document.querySelector(selector);
  tourCursor.classList.add("clicking");
  target.classList.add("tour-pressed");
  target.click();
  const continued = await waitForTour(220, run);
  tourCursor.classList.remove("clicking");
  target.classList.remove("tour-pressed");
  return continued;
}

async function typeForTour(text, run) {
  if (!(await moveTourCursor("#demo-message", run))) return false;
  messageInput.focus({ preventScroll: true });
  messageInput.value = "";
  for (const character of text) {
    if (run !== tourRun) return false;
    messageInput.value += character;
    messageInput.dispatchEvent(new Event("input", { bubbles: true }));
    if (!(await waitForTour(character === " " ? 28 : 43, run))) return false;
  }
  return true;
}

function resetTour() {
  tourRun += 1;
  stopReplay();
  renderReplay(0);
  setView("chat");
  messageInput.value = "";
  document.querySelectorAll(".tour-generated").forEach((element) => element.remove());
  conversation.scrollTop = 0;
  document.querySelectorAll(".tour-pressed").forEach((element) => element.classList.remove("tour-pressed"));
  tourCursor.classList.remove("visible", "clicking");
  tourPaused = false;
  tourPausedReplay = false;
  tourRunning = false;
  tourToggle.textContent = "Play";
  tourToggle.setAttribute("aria-label", "Play product film");
  setTourScene(
    "Begin with a direction",
    "A scientist asks TheoX to inspect a pattern the current Study may be missing.",
    4,
  );
}

async function startTour() {
  resetTour();
  const run = tourRun;
  tourRunning = true;
  tourToggle.textContent = "Pause";
  tourToggle.setAttribute("aria-label", "Pause product film");

  if (!(await waitForTour(650, run))) return;
  setTourScene(
    "Direct the research",
    "Natural language becomes a concrete scientific action inside the Study.",
    14,
  );
  if (!(await typeForTour("Compare the surviving claim with the replication evidence.", run))) return;
  if (!(await waitForTour(380, run))) return;
  if (!(await clickForTour(".send-button", run))) return;

  setTourScene(
    "Inspect the complete Study",
    "The advisor grounds its response in the files, evidence, and accumulated history.",
    31,
  );
  if (!(await waitForTour(2200, run))) return;

  setTourScene(
    "Follow the evidence",
    "Search, refutation, visual discovery, concept invention, and replication remain inspectable.",
    48,
  );
  if (!(await clickForTour('.view-switcher [data-view="replay"]', run))) return;
  replaySpeed.value = "2";
  if (!(await clickForTour("#replay-toggle", run))) return;
  if (!(await waitForTour(5600, run))) return;
  stopReplay();

  setTourScene(
    "Inspect the research record",
    "The DRO preserves exact lineage, authorship, software, evidence, failures, and releases.",
    72,
  );
  if (!(await clickForTour('.view-switcher [data-view="dro"]', run))) return;
  if (!(await waitForTour(2400, run))) return;

  setTourScene(
    "Develop the result",
    "Source and compiled manuscript stay beside the living scientific record.",
    89,
  );
  if (!(await clickForTour('.view-switcher [data-view="paper"]', run))) return;
  if (!(await waitForTour(1200, run))) return;
  if (!(await clickForTour(".paper-toolbar button", run))) return;
  if (!(await waitForTour(1800, run))) return;

  tourCursor.classList.remove("visible");
  tourRunning = false;
  tourToggle.textContent = "Replay";
  tourToggle.setAttribute("aria-label", "Replay product film");
  setTourScene(
    "Continue the Study",
    "The research remains editable, reproducible, attributable, and ready for its next question.",
    100,
  );
}

tourToggle.addEventListener("click", () => {
  if (!tourRunning) {
    startTour();
    return;
  }
  tourPaused = !tourPaused;
  if (tourPaused) {
    tourPausedReplay = Boolean(replayTimer);
    if (tourPausedReplay) stopReplay();
    tourToggle.textContent = "Resume";
    tourToggle.setAttribute("aria-label", "Resume product film");
  } else {
    if (tourPausedReplay) startReplay();
    tourPausedReplay = false;
    tourToggle.textContent = "Pause";
    tourToggle.setAttribute("aria-label", "Pause product film");
  }
});

tourRestart.addEventListener("click", startTour);

resetTour();
if (!reducedMotion.matches) startTour();
