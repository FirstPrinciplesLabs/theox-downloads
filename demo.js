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
