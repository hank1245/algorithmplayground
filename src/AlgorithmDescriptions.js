export const algorithmDescriptions = {
  bubbleSort: {
    name: "버블 정렬 (Bubble Sort)",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "인접한 두 원소를 비교하여 정렬하는 알고리즘입니다. 가장 큰 원소가 마지막으로 '버블링'되어 올라갑니다.",
    howItWorks: [
      "배열을 처음부터 끝까지 순회",
      "인접한 두 원소를 비교",
      "순서가 잘못되었으면 교환",
      "한 번의 순회가 끝나면 가장 큰 원소가 맨 끝에 위치",
      "배열이 정렬될 때까지 반복"
    ]
  },
  insertionSort: {
    name: "삽입 정렬 (Insertion Sort)",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "정렬된 부분에 새로운 원소를 올바른 위치에 삽입하는 알고리즘입니다. 카드 게임에서 카드를 정렬하는 방식과 유사합니다.",
    howItWorks: [
      "두 번째 원소부터 시작",
      "현재 원소를 정렬된 부분과 비교",
      "올바른 위치를 찾아 삽입",
      "모든 원소가 처리될 때까지 반복"
    ]
  },
  selectionSort: {
    name: "선택 정렬 (Selection Sort)",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "매번 최솟값을 찾아서 맨 앞으로 보내는 알고리즘입니다. 가장 직관적인 정렬 방법 중 하나입니다.",
    howItWorks: [
      "정렬되지 않은 부분에서 최솟값 찾기",
      "최솟값을 정렬된 부분의 끝과 교환",
      "정렬된 부분의 크기를 하나 증가",
      "모든 원소가 정렬될 때까지 반복"
    ]
  },
  quickSort: {
    name: "퀵 정렬 (Quick Sort)",
    timeComplexity: "O(n log n) ~ O(n²)",
    spaceComplexity: "O(log n)",
    description: "피벗을 기준으로 배열을 분할하여 정렬하는 분할정복 알고리즘입니다. 평균적으로 매우 빠른 성능을 보입니다.",
    howItWorks: [
      "피벗 원소 선택",
      "피벗보다 작은 원소는 왼쪽, 큰 원소는 오른쪽으로 분할",
      "분할된 두 부분에 대해 재귀적으로 퀵 정렬 적용",
      "모든 부분이 정렬될 때까지 반복"
    ]
  },
  heapSort: {
    name: "힙 정렬 (Heap Sort)",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    description: "힙 자료구조를 이용한 정렬 알고리즘입니다. 최대 힙을 구성하여 루트의 최댓값을 차례로 추출합니다.",
    howItWorks: [
      "배열을 최대 힙으로 구성",
      "루트(최댓값)를 배열의 끝과 교환",
      "힙의 크기를 하나 줄이고 다시 힙 속성 복원",
      "모든 원소가 정렬될 때까지 반복"
    ]
  },
  mergeSort: {
    name: "병합 정렬 (Merge Sort)",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "배열을 절반으로 나누어 각각 정렬한 후 병합하는 분할정복 알고리즘입니다. 안정 정렬이며 일정한 성능을 보장합니다.",
    howItWorks: [
      "배열을 절반으로 분할",
      "각 부분을 재귀적으로 정렬",
      "정렬된 두 부분을 병합",
      "전체 배열이 정렬될 때까지 반복"
    ]
  },
  hanoiTower: {
    name: "하노이의 탑 (Tower of Hanoi)",
    timeComplexity: "O(2ⁿ)",
    spaceComplexity: "O(n)",
    description: "세 개의 기둥과 크기가 다른 원반들을 이용한 퍼즐입니다. 모든 원반을 다른 기둥으로 옮기는 것이 목표입니다.",
    rules: [
      "한 번에 하나의 원반만 이동 가능",
      "큰 원반을 작은 원반 위에 올릴 수 없음",
      "모든 원반을 목적지 기둥으로 이동"
    ],
    howItWorks: [
      "n-1개의 원반을 보조 기둥으로 이동",
      "가장 큰 원반을 목적지 기둥으로 이동",
      "보조 기둥의 n-1개 원반을 목적지 기둥으로 이동",
      "재귀적으로 문제 해결"
    ]
  },
  boids: {
    name: "보이드 알고리즘 (Boids Algorithm)",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n)",
    description: "새 떼의 집단 행동을 시뮬레이션하는 알고리즘입니다. 간단한 규칙들로 복잡한 집단 행동을 만들어냅니다.",
    rules: [
      "분리(Separation): 너무 가까운 개체들과 거리 유지",
      "정렬(Alignment): 주변 개체들과 같은 방향으로 이동",
      "응집(Cohesion): 주변 개체들의 중심으로 향하는 경향"
    ],
    howItWorks: [
      "각 개체의 주변 이웃들 탐지",
      "세 가지 규칙에 따른 힘 계산",
      "계산된 힘을 종합하여 이동 방향 결정",
      "모든 개체에 대해 동시에 적용"
    ]
  }
};