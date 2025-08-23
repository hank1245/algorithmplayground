import * as THREE from "three";
import { gsap } from "gsap";
import { textCompletion } from "../ui/TextCompletion.js";

const COLOR_BASE = 0xd35400;
const COLOR_SWAP = 0x9b59b6;
const COLOR_CURR = 0x3498db;
const COLOR_CMP = 0xe74c3c;
const COLOR_DONE = 0x27ae60;

export class HeapSortVisualizer {
  constructor(info) {
    this.x = info.x;
    this.y = info.y;
    this.z = info.z;
    this.scene = info.scene;
    this.visible = false;
    this.isAnimating = false;
    this.shouldStop = false;
    this.originalArray = [3, 7, 1, 9, 4, 8, 2, 6, 5];
    this.array = [...this.originalArray];
    this.bars = [];
    this.group = new THREE.Group();
    this.completeText = null;
    this.createBars();
    this.group.position.set(this.x, this.y - 1.5, this.z);
    this.scene.add(this.group);
  }

  createBars() {
    const barWidth = 0.3,
      barSpacing = 0.4,
      maxHeight = 2,
      max = Math.max(...this.array);
    this.array.forEach((v, i) => {
      const h = (v / max) * maxHeight;
      const g = new THREE.BoxGeometry(barWidth, h, barWidth);
      const m = new THREE.MeshLambertMaterial({ color: COLOR_BASE });
      const b = new THREE.Mesh(g, m);
      b.position.x = (i - this.array.length / 2) * barSpacing;
      b.position.y = h / 2;
      b.castShadow = true;
      b.userData = { value: v, originalIndex: i };
      this.bars.push(b);
      this.group.add(b);
    });
  }

  async startHeapSort() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.shouldStop = false;
    this.array = [...this.originalArray];
    this.resetColors();
    const n = this.array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      if (this.shouldStop) break;
      await this.heapify(n, i);
    }
    for (let i = n - 1; i > 0; i--) {
      if (this.shouldStop) break;
      await this.markSwap(0, i);
      await this.swapBars(0, i);
      [this.array[0], this.array[i]] = [this.array[i], this.array[0]];
      this.bars[i].material.color.set(COLOR_DONE);
      await this.heapify(i, 0);
    }
    if (!this.shouldStop) this.bars[0].material.color.set(COLOR_DONE);
    if (!this.shouldStop) await this.showCompleteText();
    this.isAnimating = false;
  }

  async markSwap(a, b) {
    this.bars[a].material.color.set(COLOR_SWAP);
    this.bars[b].material.color.set(COLOR_SWAP);
    await this.delay(400);
  }

  async heapify(heapSize, root) {
    let largest = root;
    const L = 2 * root + 1,
      R = 2 * root + 2;
    this.bars[root].material.color.set(COLOR_CURR);
    await this.delay(350);
    if (L < heapSize) {
      this.bars[L].material.color.set(COLOR_CMP);
      await this.delay(300);
      if (this.array[L] > this.array[largest]) largest = L;
    }
    if (R < heapSize) {
      this.bars[R].material.color.set(COLOR_CMP);
      await this.delay(300);
      if (this.array[R] > this.array[largest]) largest = R;
    }
    if (largest !== root && !this.shouldStop) {
      await this.markSwap(root, largest);
      await this.swapBars(root, largest);
      [this.array[root], this.array[largest]] = [
        this.array[largest],
        this.array[root],
      ];
      await this.heapify(heapSize, largest);
    }
    for (let i = 0; i < heapSize; i++)
      if (this.bars[i].material.color.getHex() !== COLOR_DONE)
        this.bars[i].material.color.set(COLOR_BASE);
  }

  async swapBars(i1, i2) {
    const b1 = this.bars[i1],
      b2 = this.bars[i2];
    const x1 = b1.position.x,
      x2 = b2.position.x;
    const h1 = b1.geometry.parameters.height,
      h2 = b2.geometry.parameters.height;
    return new Promise((resolve) => {
      gsap.to(b1.position, {
        duration: 0.55,
        x: x2,
        y: h1 / 2,
        ease: "power2.inOut",
      });
      gsap.to(b2.position, {
        duration: 0.55,
        x: x1,
        y: h2 / 2,
        ease: "power2.inOut",
        onComplete: () => {
          [this.bars[i1], this.bars[i2]] = [this.bars[i2], this.bars[i1]];
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
