import * as THREE from "three";
import { gsap } from "gsap";

export class MergeSortVisualizer {
  constructor(info) {
    this.x = info.x;
    this.y = info.y;
    this.z = info.z;
    this.scene = info.scene;

    this.visible = false;
    this.isAnimating = false;
    this.shouldStop = false;

    // 병합 정렬에 사용할 배열 데이터
    this.originalArray = [5, 2, 8, 1, 9, 3, 7, 4, 6];
    this.array = [...this.originalArray];
    this.bars = [];
    this.group = new THREE.Group();

    this.createBars();
    this.group.position.set(this.x, this.y - 1.5, this.z);
    this.scene.add(this.group);
  }

  createBars() {
    const barWidth = 0.3;
    const barSpacing = 0.4;
    const maxHeight = 2;

    this.array.forEach((value, index) => {
      const height = (value / Math.max(...this.array)) * maxHeight;
      const geometry = new THREE.BoxGeometry(barWidth, height, barWidth);
      const material = new THREE.MeshLambertMaterial({ color: 0x8e44ad });
      const bar = new THREE.Mesh(geometry, material);

      bar.position.x = (index - this.array.length / 2) * barSpacing;
      bar.position.y = height / 2;
      bar.castShadow = true;
      bar.userData = { value, originalIndex: index };

      this.bars.push(bar);
      this.group.add(bar);
    });
  }

  async startMergeSort() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.shouldStop = false;

    // 배열 초기화
    this.array = [...this.originalArray];
    this.resetColors();

    await this.mergeSort(0, this.array.length - 1);

    // 모든 막대를 녹색으로 표시 (정렬 완료)
    if (!this.shouldStop) {
      for (let i = 0; i < this.bars.length; i++) {
        this.bars[i].material.color.set(0x27ae60);
      }
    }

    this.isAnimating = false;
  }

  async mergeSort(left, right) {
    if (left < right && !this.shouldStop) {
      const middle = Math.floor((left + right) / 2);

      // 분할 범위 표시
      this.highlightRange(left, middle, 0x3498db); // 왼쪽 부분을 파란색으로
      this.highlightRange(middle + 1, right, 0xe67e22); // 오른쪽 부분을 주황색으로
      await this.delay(800);
      if (this.shouldStop) return;

      // 재귀적으로 분할
      await this.mergeSort(left, middle);
      if (this.shouldStop) return;
      await this.mergeSort(middle + 1, right);
      if (this.shouldStop) return;

      // 병합
      await this.merge(left, middle, right);
    }
  }

  async merge(left, middle, right) {
    // 병합할 두 부분을 다른 색상으로 표시
    this.highlightRange(left, middle, 0x9b59b6); // 왼쪽을 보라색으로
    this.highlightRange(middle + 1, right, 0xf39c12); // 오른쪽을 노란색으로
    await this.delay(600);
    if (this.shouldStop) return;

    // 원본 데이터 백업
    const originalArray = [...this.array];
    const originalBars = [...this.bars];

    // 병합할 데이터 복사
    const leftArray = [];
    const rightArray = [];
    const leftBars = [];
    const rightBars = [];

    for (let i = left; i <= middle; i++) {
      leftArray.push(this.array[i]);
      leftBars.push(this.bars[i]);
    }

    for (let i = middle + 1; i <= right; i++) {
      rightArray.push(this.array[i]);
      rightBars.push(this.bars[i]);
    }

    // 모든 막대를 높이 들어올림 (겹침 방지)
    for (let i = left; i <= right; i++) {
      if (this.shouldStop) return;
      await this.liftBar(this.bars[i]);
    }
    await this.delay(300);
    if (this.shouldStop) return;

    let i = 0,
      j = 0,
      k = left;
    const mergedBars = [];

    // 병합 과정
    while (i < leftArray.length && j < rightArray.length && !this.shouldStop) {
      // 비교할 요소들을 빨간색으로 강조
      leftBars[i].material.color.set(0xe74c3c);
      rightBars[j].material.color.set(0xe74c3c);
      await this.delay(400);
      if (this.shouldStop) return;

      let selectedBar, selectedValue;

      if (leftArray[i] <= rightArray[j]) {
        selectedValue = leftArray[i];
        selectedBar = leftBars[i];
        i++;
      } else {
        selectedValue = rightArray[j];
        selectedBar = rightBars[j];
        j++;
      }

      // 배열 업데이트
      this.array[k] = selectedValue;
      mergedBars.push(selectedBar);

      // 선택된 막대를 최종 위치로 배치
      await this.placeBarAtPosition(selectedBar, k);
      if (this.shouldStop) return;
      selectedBar.material.color.set(0x2ecc71);

      k++;
      await this.delay(200);
    }

    // 남은 요소들 처리
    while (i < leftArray.length && !this.shouldStop) {
      this.array[k] = leftArray[i];
      mergedBars.push(leftBars[i]);
      await this.placeBarAtPosition(leftBars[i], k);
      if (this.shouldStop) return;
      leftBars[i].material.color.set(0x2ecc71);
      i++;
      k++;
      await this.delay(200);
    }

    while (j < rightArray.length && !this.shouldStop) {
      this.array[k] = rightArray[j];
      mergedBars.push(rightBars[j]);
      await this.placeBarAtPosition(rightBars[j], k);
      if (this.shouldStop) return;
      rightBars[j].material.color.set(0x2ecc71);
      j++;
      k++;
      await this.delay(200);
    }

    // bars 배열 업데이트
    if (!this.shouldStop) {
      for (let i = 0; i < mergedBars.length; i++) {
        this.bars[left + i] = mergedBars[i];
      }
    }

    // 병합된 범위를 잠시 강조
    if (!this.shouldStop) {
      this.highlightRange(left, right, 0x1abc9c);
      await this.delay(400);
    }
  }

  highlightRange(start, end, color) {
    for (let i = start; i <= end && i < this.bars.length; i++) {
      this.bars[i].material.color.set(color);
    }
  }

  async placeBarAtPosition(bar, targetIndex) {
    const targetX = (targetIndex - this.array.length / 2) * 0.4;
    const originalHeight = bar.geometry.parameters.height;

    return new Promise((resolve) => {
      // 막대를 목표 위치로 이동하면서 동시에 내림
      gsap.to(bar.position, {
        duration: 0.6,
        x: targetX,
        y: originalHeight / 2,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });
  }

  async liftBar(bar) {
    return new Promise((resolve) => {
      gsap.to(bar.position, {
        duration: 0.3,
        y: bar.position.y + 3,
        ease: "power2.out",
        onComplete: resolve,
      });
    });
  }

  resetColors() {
    for (let i = 0; i < this.bars.length; i++) {
      this.bars[i].material.color.set(0x8e44ad);
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  show() {
    this.visible = true;
    gsap.to(this.group.position, {
      duration: 1,
      y: this.y + 1.5,
      ease: "Bounce.easeOut",
    });
  }

  hide() {
    this.visible = false;
    gsap.to(this.group.position, {
      duration: 0.5,
      y: this.y - 1.5,
    });
  }

  stop() {
    this.shouldStop = true;
    this.isAnimating = false;
    gsap.killTweensOf(this.group.position);
    this.bars.forEach(bar => {
      gsap.killTweensOf(bar.position);
    });
  }

  reset() {
    this.stop();
    this.array = [...this.originalArray];
    
    // 모든 바 제거
    this.bars.forEach(bar => {
      this.group.remove(bar);
    });
    this.bars = [];
    
    // 새로 생성
    this.createBars();
  }
}
