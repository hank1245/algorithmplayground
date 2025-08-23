import * as THREE from "three";
import { gsap } from "gsap";
import { textCompletion } from "../ui/TextCompletion.js";

const COLOR_BASE = 0xe74c3c;
const COLOR_KEY = 0xf39c12;
const COLOR_CMP = 0xff6b6b;
const COLOR_DONE = 0x27ae60;

export class InsertionSortVisualizer {
  constructor(info) {
    this.x = info.x;
    this.y = info.y;
    this.z = info.z;
    this.scene = info.scene;

    this.visible = false;
    this.isAnimating = false;
    this.shouldStop = false;

    this.originalArray = [6, 2, 8, 4, 1, 9, 3, 7, 5];
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

  async startInsertionSort() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.shouldStop = false;

    const arr = [...this.array];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      if (this.shouldStop) break;
      const key = arr[i];
      const keyBar = this.bars[i];
      let j = i - 1;

      keyBar.material.color.set(COLOR_KEY);
      await this.delay(650);
      if (this.shouldStop) break;

      await this.liftBar(keyBar);
      if (this.shouldStop) break;

      let insertPos = i;
      while (j >= 0 && arr[j] > key && !this.shouldStop) {
        this.bars[j].material.color.set(COLOR_CMP);
        await this.delay(450);
        arr[j + 1] = arr[j];
        await this.shiftBarRight(j);
        this.bars[j].material.color.set(COLOR_BASE);
        insertPos = j;
        j--;
      }

      arr[insertPos] = key;
      await this.placeBar(keyBar, insertPos);
      this.updateBarsArray(keyBar, i, insertPos);

      for (let k = 0; k <= i; k++) this.bars[k].material.color.set(COLOR_DONE);
      await this.delay(350);
    }

    if (!this.shouldStop) await this.showCompleteText();
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

  async shiftBarRight(index) {
    const bar = this.bars[index];
    const targetX = (index + 1 - this.array.length / 2) * 0.4;
    return new Promise((resolve) => {
      gsap.to(bar.position, {
        duration: 0.5,
        x: targetX,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });
  }

  async placeBar(bar, targetIndex) {
    const targetX = (targetIndex - this.array.length / 2) * 0.4;
    const originalHeight = bar.geometry.parameters.height;
    return new Promise((resolve) => {
      gsap.to(bar.position, {
        duration: 0.5,
        x: targetX,
        y: originalHeight / 2,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });
  }

  updateBarsArray(movedBar, fromIndex, toIndex) {
    this.bars.splice(fromIndex, 1);
    this.bars.splice(toIndex, 0, movedBar);
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
