import * as THREE from "three";
import { gsap } from "gsap";
import { textCompletion } from "../ui/TextCompletion.js";

export class HanoiTowerVisualizer {
  constructor(info) {
    this.x = info.x;
    this.y = info.y;
    this.z = info.z;
    this.scene = info.scene;

    this.visible = false;
    this.isAnimating = false;
    this.isPaused = false;

    // 설정
    this.diskCount = 4;
    this.towers = [[], [], []];
    this.diskObjects = [];
    this.towerBases = [];
    this.towerPoles = [];
    this.moves = [];
    this.currentMoveIndex = 0;
    this.animationSpeed = 1;
    this.completeText = null;

    this.group = new THREE.Group();
    this.createTowers();
    this.group.position.set(this.x, this.y - 2, this.z);
    this.scene.add(this.group);
  }

  createTowers() {
    this.clearTowers();
    this.towers = [[], [], []];
    this.diskObjects = [];

    for (let i = 0; i < 3; i++) {
      const baseGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.15);
      const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.set((i - 1) * 2.5, 0, 0);
      base.castShadow = true;
      base.receiveShadow = true;
      this.group.add(base);
      this.towerBases.push(base);

      const poleGeometry = new THREE.CylinderGeometry(0.06, 0.06, 2.5);
      const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.set((i - 1) * 2.5, 1.25, 0);
      pole.castShadow = true;
      this.group.add(pole);
      this.towerPoles.push(pole);
    }

    const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xffa07a, 0xdda0dd];
    for (let i = 0; i < this.diskCount; i++) {
      const radius = 0.25 + (this.diskCount - i) * 0.12;
      const diskGeometry = new THREE.CylinderGeometry(radius, radius, 0.2);
      const diskMaterial = new THREE.MeshLambertMaterial({
        color: colors[i % colors.length],
      });
      const disk = new THREE.Mesh(diskGeometry, diskMaterial);
      disk.position.set(-2.5, 0.175 + i * 0.2, 0);
      disk.castShadow = true;
      disk.receiveShadow = true;
      this.group.add(disk);
      this.diskObjects.push(disk);
      this.towers[0].push(i);
    }
    this.calculateMoves();
  }

  clearTowers() {
    this.diskObjects.forEach((disk) => {
      this.group.remove(disk);
    });
    this.towerBases.forEach((base) => {
      this.group.remove(base);
    });
    this.towerPoles.forEach((pole) => {
      this.group.remove(pole);
    });
    this.diskObjects = [];
    this.towerBases = [];
    this.towerPoles = [];
  }

  calculateMoves() {
    this.moves = [];
    this.hanoi(this.diskCount, 0, 2, 1, this.moves);
  }
  hanoi(n, from, to, aux, moves) {
    if (n === 1) {
      moves.push({ from, to });
      return;
    }
    this.hanoi(n - 1, from, aux, to, moves);
    moves.push({ from, to });
    this.hanoi(n - 1, aux, to, from, moves);
  }

  async startHanoiAnimation() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.isPaused = false;
    this.currentMoveIndex = 0;
    for (let i = 0; i < this.moves.length; i++) {
      if (!this.isAnimating || this.isPaused) break;
      const move = this.moves[i];
      await this.moveDisk(move.from, move.to);
      await this.delay(400 / this.animationSpeed);
    }
    if (this.isAnimating) await this.showCompleteText();
    this.isAnimating = false;
  }

  async moveDisk(fromTower, toTower) {
    if (this.towers[fromTower].length === 0) return;
    const diskIndex = this.towers[fromTower].pop();
    const disk = this.diskObjects[diskIndex];
    const fromX = (fromTower - 1) * 2.5;
    const toX = (toTower - 1) * 2.5;
    const toY = 0.175 + this.towers[toTower].length * 0.2;
    await this.animatePosition(disk, fromX, 3, 0, 300 / this.animationSpeed);
    await this.animatePosition(disk, toX, 3, 0, 400 / this.animationSpeed);
    await this.animatePosition(disk, toX, toY, 0, 300 / this.animationSpeed);
    this.towers[toTower].push(diskIndex);
  }

  async animatePosition(object, x, y, z, duration) {
    return new Promise((resolve) => {
      gsap.to(object.position, {
        duration: duration / 1000,
        x,
        y,
        z,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });
  }
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  show() {
    this.visible = true;
    gsap.to(this.group.position, {
      duration: 1,
      y: this.y + 2,
      ease: "Bounce.easeOut",
    });
  }
  hide() {
    this.visible = false;
    this.isAnimating = false;
    this.isPaused = false;
    this.currentMoveIndex = 0;
    this.hideCompleteText();
    gsap.to(this.group.position, {
      duration: 0.5,
      y: this.y - 2,
      onComplete: () => {
        this.createTowers();
      },
    });
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

// end of file
