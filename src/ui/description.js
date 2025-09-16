import gsap from "gsap";
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
const descriptionContentElement = document.querySelector(
  ".description-content"
);
const root = document.documentElement;

const accentColors = {
  default: "#6fffe9",
  bubbleSort: "#ff9ad5",
  insertionSort: "#94f0ff",
  selectionSort: "#f8d57e",
  quickSort: "#ff9378",
  heapSort: "#8ce37b",
  mergeSort: "#9cb8ff",
  hanoiTower: "#ffb677",
  boids: "#7df4c4",
};

let currentAlgorithm = null;
let hideTween = null;

export function showDescription(algorithmKey) {
  const algorithm = algorithmDescriptions[algorithmKey];
  if (!algorithm || currentAlgorithm === algorithmKey) return;

  if (hideTween) {
    hideTween.kill();
    hideTween = null;
  }

  currentAlgorithm = algorithmKey;
  algorithmNameElement.textContent = algorithm.name;
  timeComplexityElement.textContent = algorithm.timeComplexity;
  spaceComplexityElement.textContent = algorithm.spaceComplexity;
  descriptionTextElement.textContent = algorithm.description;

  const isRulesVariant = algorithmKey === "hanoiTower" || algorithmKey === "boids";
  const listItems = isRulesVariant ? algorithm.rules || [] : algorithm.howItWorks || [];
  worksTitleElement.textContent = isRulesVariant ? "Rules:" : "How it works:";
  howItWorksListElement.innerHTML = "";
  listItems.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;
    howItWorksListElement.appendChild(li);
  });

  const accent = accentColors[algorithmKey] || accentColors.default;
  root.style.setProperty("--accent-color", accent);

  if (descriptionContentElement) {
    descriptionContentElement.scrollTop = 0;
  }

  gsap.killTweensOf(descriptionElement);
  descriptionElement.classList.remove("hidden");
  gsap.fromTo(
    descriptionElement,
    { y: 28, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    }
  );
}

export function hideDescription() {
  if (!currentAlgorithm) return;
  currentAlgorithm = null;
  root.style.setProperty("--accent-color", accentColors.default);
  gsap.killTweensOf(descriptionElement);
  hideTween = gsap.to(descriptionElement, {
    y: 24,
    opacity: 0,
    duration: 0.28,
    ease: "power2.in",
    onComplete: () => {
      descriptionElement.classList.add("hidden");
      descriptionElement.style.removeProperty("transform");
      descriptionElement.style.removeProperty("opacity");
      hideTween = null;
    },
  });
}
