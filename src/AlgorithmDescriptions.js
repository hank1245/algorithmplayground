export const algorithmDescriptions = {
  bubbleSort: {
    name: "Bubble Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "An algorithm that sorts by comparing adjacent elements. The largest element 'bubbles' up to the end.",
    howItWorks: [
      "Traverse the array from beginning to end",
      "Compare adjacent elements",
      "Swap if they are in wrong order",
      "After one pass, the largest element is at the end",
      "Repeat until the array is sorted"
    ]
  },
  insertionSort: {
    name: "Insertion Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "An algorithm that inserts each element into its correct position in the sorted portion. Similar to sorting cards in hand.",
    howItWorks: [
      "Start from the second element",
      "Compare current element with sorted portion",
      "Find correct position and insert",
      "Repeat until all elements are processed"
    ]
  },
  selectionSort: {
    name: "Selection Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "An algorithm that finds the minimum value and moves it to the front. One of the most intuitive sorting methods.",
    howItWorks: [
      "Find minimum value in unsorted portion",
      "Swap with the first element of unsorted portion",
      "Increase the size of sorted portion by one",
      "Repeat until all elements are sorted"
    ]
  },
  quickSort: {
    name: "Quick Sort",
    timeComplexity: "O(n log n) ~ O(n²)",
    spaceComplexity: "O(log n)",
    description: "A divide-and-conquer algorithm that partitions array around a pivot. Shows excellent average performance.",
    howItWorks: [
      "Select a pivot element",
      "Partition: smaller elements left, larger elements right",
      "Recursively apply quicksort to both partitions",
      "Repeat until all parts are sorted"
    ]
  },
  heapSort: {
    name: "Heap Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    description: "A sorting algorithm using heap data structure. Builds a max heap and extracts maximum values sequentially.",
    howItWorks: [
      "Build a max heap from the array",
      "Swap root (maximum) with last element",
      "Reduce heap size and restore heap property",
      "Repeat until all elements are sorted"
    ]
  },
  mergeSort: {
    name: "Merge Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "A divide-and-conquer algorithm that divides array in half, sorts each part, then merges. Stable sort with guaranteed performance.",
    howItWorks: [
      "Divide array into two halves",
      "Recursively sort each half",
      "Merge the two sorted halves",
      "Repeat until entire array is sorted"
    ]
  },
  hanoiTower: {
    name: "Tower of Hanoi",
    timeComplexity: "O(2ⁿ)",
    spaceComplexity: "O(n)",
    description: "A puzzle with three rods and disks of different sizes. The goal is to move all disks to another rod.",
    rules: [
      "Only one disk can be moved at a time",
      "Larger disk cannot be placed on smaller disk",
      "Move all disks to the destination rod"
    ],
    howItWorks: [
      "Move n-1 disks to auxiliary rod",
      "Move the largest disk to destination rod",
      "Move n-1 disks from auxiliary to destination",
      "Solve recursively"
    ]
  },
  boids: {
    name: "Boids Algorithm",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n)",
    description: "An algorithm that simulates flocking behavior of birds. Creates complex group behavior from simple rules.",
    rules: [
      "Separation: Maintain distance from nearby neighbors",
      "Alignment: Move in same direction as neighbors",
      "Cohesion: Tendency to move toward center of neighbors"
    ],
    howItWorks: [
      "Detect neighbors around each individual",
      "Calculate forces based on three rules",
      "Combine calculated forces to determine movement",
      "Apply to all individuals simultaneously"
    ]
  }
};