import * as THREE from "three";
import { gsap } from "gsap";
import { textCompletion } from "../ui/TextCompletion.js";

const COLOR_BASE = 0x8e44ad;
const COLOR_LEFT = 0x3498db;
const COLOR_RIGHT = 0xe67e22;
const COLOR_PICK = 0xe74c3c;
const COLOR_MERGED = 0x1abc9c;
const COLOR_DONE = 0x27ae60;

export class MergeSortVisualizer {
  constructor(info) {
    this.x = info.x;
    this.y = info.y;
    this.z = info.z;
    this.scene = info.scene;
    this.visible = false;
    this.isAnimating = false;
    this.shouldStop = false;
    this.originalArray = [5, 2, 8, 1, 9, 3, 7, 4, 6];
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

  async startMergeSort() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.shouldStop = false;
    this.array = [...this.originalArray];
    this.resetColors();
    await this.mergeSort(0, this.array.length - 1);
    if (!this.shouldStop) {
      for (let i = 0; i < this.bars.length; i++)
        this.bars[i].material.color.set(COLOR_DONE);
      await this.showCompleteText();
    }
    this.isAnimating = false;
  }

  async mergeSort(left, right) {
    if (left < right && !this.shouldStop) {
      const mid = Math.floor((left + right) / 2);
      this.highlightRange(left, mid, COLOR_LEFT);
      this.highlightRange(mid + 1, right, COLOR_RIGHT);
      await this.delay(600);
      await this.mergeSort(left, mid);
      await this.mergeSort(mid + 1, right);
      await this.merge(left, mid, right);
    }
  }

  async merge(left, mid, right) {
    const leftArr = [],
      rightArr = [],
      leftBars = [],
      rightBars = [];
    for (let i = left; i <= mid; i++) {
      leftArr.push(this.array[i]);
      leftBars.push(this.bars[i]);
    }
    for (let i = mid + 1; i <= right; i++) {
      rightArr.push(this.array[i]);
      rightBars.push(this.bars[i]);
    }

    for (let i = left; i <= right; i++) {
      await this.liftBar(this.bars[i]);
    }
    await this.delay(300);

    let i = 0,
      j = 0,
      k = left;
    const mergedBars = [];
    while (i < leftArr.length && j < rightArr.length && !this.shouldStop) {
      leftBars[i].material.color.set(COLOR_PICK);
      rightBars[j].material.color.set(COLOR_PICK);
      await this.delay(450);
      let pickBar;
      if (leftArr[i] <= rightArr[j]) {
        this.array[k] = leftArr[i];
        pickBar = leftBars[i];
        i++;
      } else {
        this.array[k] = rightArr[j];
        pickBar = rightBars[j];
        j++;
      }
      mergedBars.push(pickBar);
      await this.placeBarAtPosition(pickBar, k);
      pickBar.material.color.set(COLOR_MERGED);
      k++;
      await this.delay(250);
    }
    while (i < leftArr.length && !this.shouldStop) {
      this.array[k] = leftArr[i];
      mergedBars.push(leftBars[i]);
      await this.placeBarAtPosition(leftBars[i], k);
      leftBars[i].material.color.set(COLOR_MERGED);
      i++;
      k++;
    }
    while (j < rightArr.length && !this.shouldStop) {
      this.array[k] = rightArr[j];
      mergedBars.push(rightBars[j]);
      await this.placeBarAtPosition(rightBars[j], k);
      rightBars[j].material.color.set(COLOR_MERGED);
      j++;
      k++;
    }

    for (let t = 0; t < mergedBars.length; t++)
      this.bars[left + t] = mergedBars[t];
  }

  highlightRange(s, e, c) {
    for (let i = s; i <= e && i < this.bars.length; i++)
      this.bars[i].material.color.set(c);
  }
  async placeBarAtPosition(bar, index) {
    const x = (index - this.array.length / 2) * 0.4;
    const h = bar.geometry.parameters.height;
    return new Promise((resolve) => {
      gsap.to(bar.position, {
        duration: 0.6,
        x,
        y: h / 2,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });
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
    this.bars.forEach((b) => {
      gsap.killTweensOf(b.position);
      // normalize Y back to base (height/2) to avoid floating bars when hidden
      const h = b.geometry?.parameters?.height || 1;
      b.position.y = h / 2;
    });
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
