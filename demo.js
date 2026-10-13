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
  userMessage.className = "message user-message";
  const userAuthor = document.createElement("div");
  userAuthor.className = "message-author";
  userAuthor.textContent = "You";
  const userText = document.createElement("p");
  userText.textContent = text;
  userMessage.append(userAuthor, userText);

  const response = document.createElement("article");
  response.className = "message advisor-message";
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
