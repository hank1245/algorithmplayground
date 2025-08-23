import { algorithmDescriptions } from "./AlgorithmDescriptions";

const descriptionElement = document.getElementById("algorithm-description");
const algorithmNameElement = document.getElementById("algorithm-name");
const timeComplexityElement = document.getElementById("time-complexity");
const spaceComplexityElement = document.getElementById("space-complexity");
const descriptionTextElement = document.getElementById(
  "algorithm-description-text"
);
const worksTitleElement = document.getElementById("works-title");
const howItWorksListElement = document.getElementById("how-it-works-list");

let currentAlgorithm = null;

export function showDescription(algorithmKey) {
  const algorithm = algorithmDescriptions[algorithmKey];
  if (!algorithm || currentAlgorithm === algorithmKey) return;

  currentAlgorithm = algorithmKey;
  algorithmNameElement.textContent = algorithm.name;
  timeComplexityElement.textContent = algorithm.timeComplexity;
  spaceComplexityElement.textContent = algorithm.spaceComplexity;
  descriptionTextElement.textContent = algorithm.description;

  if (algorithmKey === "hanoiTower" || algorithmKey === "boids") {
    worksTitleElement.textContent = "Rules:";
    howItWorksListElement.innerHTML = "";
    (algorithm.rules || []).forEach((rule) => {
      const li = document.createElement("li");
      li.textContent = rule;
      howItWorksListElement.appendChild(li);
    });
  } else {
    worksTitleElement.textContent = "How it works:";
    howItWorksListElement.innerHTML = "";
    (algorithm.howItWorks || []).forEach((step) => {
      const li = document.createElement("li");
      li.textContent = step;
      howItWorksListElement.appendChild(li);
    });
  }

  descriptionElement.classList.remove("hidden");
}

export function hideDescription() {
  if (!currentAlgorithm) return;
  currentAlgorithm = null;
  descriptionElement.classList.add("hidden");
}
