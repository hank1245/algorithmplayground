import * as THREE from "three";
import { gsap } from "gsap";
import { textCompletion } from "../ui/TextCompletion.js";

// Color palette
const COLOR_BASE = 0x4a90e2; // base
const COLOR_HIGHLIGHT = 0xff6b6b; // compare
const COLOR_DONE = 0x51cf66; // sorted

export class BubbleSortVisualizer {
  constructor(info) {
    this.x = info.x;
    this.y = info.y;
    this.z = info.z;
    this.scene = info.scene;

    this.visible = false;
    this.isAnimating = false;
    this.shouldStop = false;

    // 데이터
    this.originalArray = [8, 3, 7, 1, 9, 2, 6, 4, 5];
    this.array = [...this.originalArray];
    this.bars = [];
    this.group = new THREE.Group();
    this.completeText = null;

    this.createBars();
    this.group.position.set(this.x, this.y - 1.5, this.z);
    this.scene.add(this.group);
  }

  createBars() {
    const barWidth = 0.3;
    const barSpacing = 0.4;
    const maxHeight = 2;

    const max = Math.max(...this.array);
    this.array.forEach((value, index) => {
      const height = (value / max) * maxHeight;
      const geometry = new THREE.BoxGeometry(barWidth, height, barWidth);
      const material = new THREE.MeshLambertMaterial({ color: COLOR_BASE });
      const bar = new THREE.Mesh(geometry, material);

      bar.position.x = (index - this.array.length / 2) * barSpacing;
      bar.position.y = height / 2;
      bar.castShadow = true;
      bar.userData = { value, originalIndex: index };

      this.bars.push(bar);
      this.group.add(bar);
    });
  }

  async startBubbleSort() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.shouldStop = false;

    const arr = [...this.array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      if (this.shouldStop) break;
      for (let j = 0; j < n - i - 1; j++) {
        if (this.shouldStop) break;
        // 최소 색상 변경: 비교 시작/끝에만 적용
        this.bars[j].material.color.set(COLOR_HIGHLIGHT);
        this.bars[j + 1].material.color.set(COLOR_HIGHLIGHT);
        await this.delay(800);
        if (this.shouldStop) break;

        if (arr[j] > arr[j + 1]) {
          await this.swapBars(j, j + 1);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }

        // 비교 종료 시 베이스 컬러로 복귀
        this.bars[j].material.color.set(COLOR_BASE);
        this.bars[j + 1].material.color.set(COLOR_BASE);
      }
      if (!this.shouldStop) this.bars[n - 1 - i].material.color.set(COLOR_DONE);
    }

    if (!this.shouldStop) {
      this.bars[0].material.color.set(COLOR_DONE);
      await this.showCompleteText();
    }
    this.isAnimating = false;
  }

  async swapBars(index1, index2) {
    const bar1 = this.bars[index1];
    const bar2 = this.bars[index2];
    const pos1 = bar1.position.x;
    const pos2 = bar2.position.x;

    return new Promise((resolve) => {
      gsap.to(bar1.position, { duration: 0.6, x: pos2, ease: "power2.inOut" });
      gsap.to(bar2.position, {
        duration: 0.6,
        x: pos1,
        ease: "power2.inOut",
        onComplete: () => {
          [this.bars[index1], this.bars[index2]] = [
            this.bars[index2],
            this.bars[index1],
          ];
          resolve();
        },
      });
    });
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async showCompleteText() {
    this.completeText = await textCompletion.createCompleteText(this.group);
  }

  hideCompleteText() {
    this.completeText = textCompletion.removeCompleteText(
      this.group,
      this.completeText
    );
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
    gsap.to(this.group.position, { duration: 0.5, y: this.y - 1.5 });
  }

  stop() {
    this.shouldStop = true;
    this.isAnimating = false;
    gsap.killTweensOf(this.group.position);
    this.bars.forEach((bar) => gsap.killTweensOf(bar.position));
  }

  reset() {
    this.stop();
    this.hideCompleteText();
    this.array = [...this.originalArray];
    this.bars.forEach((bar) => this.group.remove(bar));
    this.bars = [];
    this.createBars();
  }
}
