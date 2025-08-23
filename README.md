# Algorithm Playground
<img width="1929" height="852" alt="스크린샷 2025-08-01 오전 8 23 46" src="https://github.com/user-attachments/assets/b736cb49-9873-4b49-92d6-5e06ed40dcb6" />

An interactive 3D visualization platform for learning sorting algorithms and computational concepts. Control a character to explore different algorithm demonstrations in a virtual environment.

## Features

- **Interactive 3D Environment**: Navigate with a character through algorithm stations
- **Sorting Algorithms**: Bubble Sort, Insertion Sort, Selection Sort, Quick Sort, Heap Sort, Merge Sort
- **Classical Problems**: Tower of Hanoi puzzle
- **Simulation**: Boids flocking behavior algorithm
- **Real-time Descriptions**: Get detailed explanations, time/space complexity, and step-by-step breakdowns

## Tech Stack

- **Three.js** - 3D graphics and visualization
- **GSAP** - Smooth animations
- **Webpack** - Module bundling and development server

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## How to Use

1. Click or touch to move your character around the environment
2. Approach algorithm stations to automatically trigger demonstrations
3. View detailed descriptions and complexity analysis in the side panel
4. Watch real-time visualizations of each algorithm in action

## Algorithms Included

| Algorithm | Time Complexity | Space Complexity |
|-----------|----------------|-----------------|
| Bubble Sort | O(n²) | O(1) |
| Insertion Sort | O(n²) | O(1) |
| Selection Sort | O(n²) | O(1) |
| Quick Sort | O(n log n) ~ O(n²) | O(log n) |
| Heap Sort | O(n log n) | O(1) |
| Merge Sort | O(n log n) | O(n) |
| Tower of Hanoi | O(2ⁿ) | O(n) |
| Boids Algorithm | O(n²) | O(n) |
