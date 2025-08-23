export const algorithmDescriptions = {
  bubbleSort: {
    name: "Bubble Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description:
      "Compare neighbors and swap so larger items float right each pass.",
    howItWorks: [
      "Scan left→right",
      "Swap out-of-order neighbors",
      "Repeat passes until no swaps",
    ],
  },
  insertionSort: {
    name: "Insertion Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description:
      "Insert each item into its place within the left (sorted) part.",
    howItWorks: [
      "Pick next item",
      "Shift bigger items right",
      "Place item into the gap",
    ],
  },
  selectionSort: {
    name: "Selection Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description:
      "Select the minimum and put it at the front of the unsorted part.",
    howItWorks: ["Scan for minimum", "Swap with front", "Grow sorted prefix"],
  },
  quickSort: {
    name: "Quick Sort",
    timeComplexity: "O(n log n) ~ O(n²)",
    spaceComplexity: "O(log n)",
    description: "Partition around a pivot; sort left and right subarrays.",
    howItWorks: ["Choose a pivot", "Partition by pivot", "Recurse on parts"],
  },
  heapSort: {
    name: "Heap Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    description: "Build a max-heap and repeatedly pop the max to the end.",
    howItWorks: [
      "Heapify array",
      "Swap root with end",
      "Heapify reduced range",
    ],
  },
  mergeSort: {
    name: "Merge Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "Split, sort halves, and merge back while keeping order.",
    howItWorks: ["Divide in halves", "Sort each half", "Merge sorted halves"],
  },
  hanoiTower: {
    name: "Tower of Hanoi",
    timeComplexity: "O(2ⁿ)",
    spaceComplexity: "O(n)",
    description: "Move stacked disks to a target peg obeying size rules.",
    rules: [
      "Move one disk at a time",
      "No big-on-small",
      "Move all to target peg",
    ],
    howItWorks: [
      "Move n-1 to aux",
      "Move largest to target",
      "Move n-1 from aux to target",
    ],
  },
  boids: {
    name: "Boids Algorithm",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n)",
    description: "Flocking via three simple local rules.",
    rules: ["Separation", "Alignment", "Cohesion"],
    howItWorks: ["Find neighbors", "Apply 3 forces", "Update positions"],
  },
};
