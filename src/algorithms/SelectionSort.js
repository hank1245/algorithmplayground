import * as THREE from "three";
import { gsap } from "gsap";
import { textCompletion } from "../ui/TextCompletion.js";

const COLOR_BASE = 0x9b59b6;
const COLOR_START = 0x3498db;
const COLOR_MIN = 0xe74c3c;
const COLOR_DONE = 0x27ae60;

export class SelectionSortVisualizer {
  constructor(info) {
    this.x = info.x;
    this.y = info.y;
    this.z = info.z;
    this.scene = info.scene;

    this.visible = false;
    this.isAnimating = false;
    this.shouldStop = false;

    this.originalArray = [4, 7, 2, 9, 1, 5, 8, 3, 6];
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

  async startSelectionSort() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.shouldStop = false;

    const arr = [...this.array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      if (this.shouldStop) break;
      let minIndex = i;
      this.bars[i].material.color.set(COLOR_START);

      for (let j = i + 1; j < n; j++) {
        if (this.shouldStop) break;
        if (arr[j] < arr[minIndex]) {
          if (minIndex !== i)
            this.bars[minIndex].material.color.set(COLOR_BASE);
          minIndex = j;
          this.bars[minIndex].material.color.set(COLOR_MIN);
        }
      }

      if (minIndex !== i && !this.shouldStop) {
        await Promise.all([
          this.liftBar(this.bars[i]),
          this.liftBar(this.bars[minIndex]),
        ]);
        await this.swapBars(i, minIndex);
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      }

      this.bars[i].material.color.set(COLOR_DONE);
    }

    if (!this.shouldStop) {
      this.bars[n - 1].material.color.set(COLOR_DONE);
      await this.showCompleteText();
    }
    this.isAnimating = false;
  }

  async liftBar(bar) {
    return new Promise((resolve) => {
      gsap.to(bar.position, {
        duration: 0.35,
        y: bar.position.y + 3,
        ease: "power2.out",
        onComplete: resolve,
      });
    });
  }

  async swapBars(index1, index2) {
    const bar1 = this.bars[index1];
    const bar2 = this.bars[index2];
    const pos1 = bar1.position.x;
    const pos2 = bar2.position.x;
    const h1 = bar1.geometry.parameters.height;
    const h2 = bar2.geometry.parameters.height;
    return new Promise((resolve) => {
      gsap.to(bar1.position, {
        duration: 0.6,
        x: pos2,
        y: h1 / 2,
        ease: "power2.inOut",
      });
      gsap.to(bar2.position, {
        duration: 0.6,
        x: pos1,
        y: h2 / 2,
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
    return new Promise((r) => setTimeout(r, ms));
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

  async showCompleteText() {
    this.completeText = await textCompletion.createCompleteText(this.group);
  }
  hideCompleteText() {
    this.completeText = textCompletion.removeCompleteText(
      this.group,
      this.completeText
    );
  }
}
