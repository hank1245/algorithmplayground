import * as THREE from "three";
import { gsap } from "gsap";
import { textCompletion } from "../ui/TextCompletion.js";

const COLOR_BASE = 0x16a085;
const COLOR_RANGE = 0x3498db;
const COLOR_PIVOT = 0xf1c40f;
const COLOR_SWAP = 0x9b59b6;
const COLOR_DONE = 0x27ae60;

export class QuickSortVisualizer {
  constructor(info) {
    this.x = info.x;
    this.y = info.y;
    this.z = info.z;
    this.scene = info.scene;

    this.visible = false;
    this.isAnimating = false;
    this.shouldStop = false;

    this.originalArray = [7, 2, 9, 1, 8, 3, 6, 4, 5];
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

  async startQuickSort() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.shouldStop = false;
    this.array = [...this.originalArray];
    this.resetColors();
    await this.quickSort(0, this.array.length - 1);
    if (!this.shouldStop) {
      for (let i = 0; i < this.bars.length; i++)
        this.bars[i].material.color.set(COLOR_DONE);
      await this.showCompleteText();
    }
    this.isAnimating = false;
  }

  async quickSort(low, high) {
    if (low < high && !this.shouldStop) {
      this.highlightRange(low, high, COLOR_RANGE);
      await this.delay(600);
      this.bars[high].material.color.set(COLOR_PIVOT);
      await this.delay(400);

      const pivotIndex = await this.partition(low, high);
      if (this.shouldStop) return;
      this.bars[pivotIndex].material.color.set(COLOR_DONE);
      this.resetRangeColors(low, high, pivotIndex);
      await this.quickSort(low, pivotIndex - 1);
      await this.quickSort(pivotIndex + 1, high);
    } else if (low === high && !this.shouldStop) {
      this.bars[low].material.color.set(COLOR_DONE);
    }
  }

  async partition(low, high) {
    const pivot = this.array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (this.shouldStop) return i + 1;
      if (this.array[j] < pivot) {
        i++;
        if (i !== j) {
          this.bars[i].material.color.set(COLOR_SWAP);
          this.bars[j].material.color.set(COLOR_SWAP);
          await Promise.all([
            this.liftBar(this.bars[i]),
            this.liftBar(this.bars[j]),
          ]);
          await this.swapBars(i, j);
          [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
          this.bars[i].material.color.set(COLOR_RANGE);
          this.bars[j].material.color.set(COLOR_RANGE);
        }
      }
    }
    i++;
    if (i !== high && !this.shouldStop) {
      this.bars[i].material.color.set(COLOR_SWAP);
      this.bars[high].material.color.set(COLOR_SWAP);
      await Promise.all([
        this.liftBar(this.bars[i]),
        this.liftBar(this.bars[high]),
      ]);
      await this.swapBars(i, high);
      [this.array[i], this.array[high]] = [this.array[high], this.array[i]];
    }
    return i;
  }

  highlightRange(low, high, color) {
    for (let i = low; i <= high; i++)
      if (this.bars[i].material.color.getHex() !== COLOR_DONE)
        this.bars[i].material.color.set(color);
  }

  resetRangeColors(low, high, pivotIndex) {
    for (let i = low; i <= high; i++)
      if (
        i !== pivotIndex &&
        this.bars[i].material.color.getHex() !== COLOR_DONE
      )
        this.bars[i].material.color.set(COLOR_BASE);
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

  resetColors() {
    for (let i = 0; i < this.bars.length; i++)
      this.bars[i].material.color.set(COLOR_BASE);
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
    this.bars.forEach((b) => gsap.killTweensOf(b.position));
  }
  reset() {
    this.stop();
    this.hideCompleteText();
    this.array = [...this.originalArray];
    this.bars.forEach((b) => this.group.remove(b));
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
