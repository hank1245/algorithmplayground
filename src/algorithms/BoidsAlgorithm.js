import * as THREE from "three";
import { gsap } from "gsap";

class Boid {
  constructor(x, y, z) {
    this.position = new THREE.Vector3(x, y, z);
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.8) * 0.3,
      (Math.random() - 0.8) * 0.3,
      (Math.random() - 0.8) * 0.3
    );
    this.acceleration = new THREE.Vector3(0, 0, 0);
    this.maxSpeed = 0.05;
    this.maxForce = 0.005;
    this.separationRadius = 0.3;
    this.alignmentRadius = 0.8;
    this.cohesionRadius = 0.8;
    this.mesh = null;
  }
  createMesh() {
    const geometry = new THREE.ConeGeometry(0.03, 0.08, 6);
    const material = new THREE.MeshLambertMaterial({ color: 0x4ecdc4 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    return this.mesh;
  }
  separate(boids) {
    const steer = new THREE.Vector3(0, 0, 0);
    let count = 0;
    for (let other of boids) {
      const d = this.position.distanceTo(other.position);
      if (d > 0 && d < this.separationRadius) {
        const diff = new THREE.Vector3().subVectors(
          this.position,
          other.position
        );
        diff.normalize();
        diff.divideScalar(d);
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.divideScalar(count);
      steer.normalize();
      steer.multiplyScalar(this.maxSpeed);
      steer.sub(this.velocity);
      steer.clampLength(0, this.maxForce);
    }
    return steer;
  }
  align(boids) {
    const sum = new THREE.Vector3(0, 0, 0);
    let count = 0;
    for (let other of boids) {
      const d = this.position.distanceTo(other.position);
      if (d > 0 && d < this.alignmentRadius) {
        sum.add(other.velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.divideScalar(count);
      sum.normalize();
      sum.multiplyScalar(this.maxSpeed);
      const steer = new THREE.Vector3().subVectors(sum, this.velocity);
      steer.clampLength(0, this.maxForce);
      return steer;
    }
    return new THREE.Vector3(0, 0, 0);
  }
  cohesion(boids) {
    const sum = new THREE.Vector3(0, 0, 0);
    let count = 0;
    for (let other of boids) {
      const d = this.position.distanceTo(other.position);
      if (d > 0 && d < this.cohesionRadius) {
        sum.add(other.position);
        count++;
      }
    }
    if (count > 0) {
      sum.divideScalar(count);
      return this.seek(sum);
    }
    return new THREE.Vector3(0, 0, 0);
  }
  seek(target) {
    const desired = new THREE.Vector3().subVectors(target, this.position);
    desired.normalize();
    desired.multiplyScalar(this.maxSpeed);
    const steer = new THREE.Vector3().subVectors(desired, this.velocity);
    steer.clampLength(0, this.maxForce);
    return steer;
  }
  flock(boids) {
    const sep = this.separate(boids);
    const ali = this.align(boids);
    const coh = this.cohesion(boids);
    sep.multiplyScalar(1.8);
    ali.multiplyScalar(1.0);
    coh.multiplyScalar(0.8);
    this.acceleration.add(sep);
    this.acceleration.add(ali);
    this.acceleration.add(coh);
  }
  boundaries(center, radius) {
    const d = this.position.distanceTo(center);
    if (d > radius) {
      const desired = new THREE.Vector3().subVectors(center, this.position);
      desired.normalize();
      desired.multiplyScalar(this.maxSpeed);
      const steer = new THREE.Vector3().subVectors(desired, this.velocity);
      steer.clampLength(0, this.maxForce * 3);
      this.acceleration.add(steer);
    }
  }
  update() {
    this.velocity.add(this.acceleration);
    this.velocity.multiplyScalar(0.98);
    this.velocity.clampLength(0, this.maxSpeed);
    this.position.add(this.velocity);
    if (this.mesh) {
      this.mesh.position.copy(this.position);
      if (this.velocity.length() > 0.02) {
        const dir = this.velocity.clone().normalize();
        this.mesh.lookAt(this.position.clone().add(dir));
        this.mesh.rotateX(Math.PI / 2);
      }
    }
    this.acceleration.set(0, 0, 0);
  }
}

export class BoidsVisualizer {
  constructor(info) {
    this.x = info.x;
    this.y = info.y;
    this.z = info.z;
    this.scene = info.scene;
    this.visible = false;
    this.isAnimating = false;
    this.boids = [];
    this.boidCount = 60;
    this.group = new THREE.Group();
    this.center = new THREE.Vector3(0, 3.5, 0);
    this.radius = 3;
    this.animationId = null;
    this.createBoids();
    this.group.position.set(this.x, this.y - 1, this.z);
    this.scene.add(this.group);
  }
  createBoids() {
    this.boids.forEach((b) => {
      if (b.mesh) this.group.remove(b.mesh);
    });
    this.boids = [];
    for (let i = 0; i < this.boidCount; i++) {
      const x = (Math.random() - 0.5) * 4;
      const y = this.center.y + (Math.random() - 0.5) * 2;
      const z = (Math.random() - 0.5) * 4;
      const boid = new Boid(x, y, z);
      const mesh = boid.createMesh();
      this.group.add(mesh);
      this.boids.push(boid);
    }
    this.createBoundary();
  }
  createBoundary() {
    const existing = this.group.getObjectByName("boundary");
    if (existing) this.group.remove(existing);
    const g = new THREE.SphereGeometry(this.radius, 16, 16);
    const m = new THREE.MeshBasicMaterial({
      color: 0x44aa88,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.copy(this.center);
    mesh.name = "boundary";
    this.group.add(mesh);
  }
  updateBoids() {
    if (!this.isAnimating) return;
    for (let boid of this.boids) {
      boid.flock(this.boids);
      boid.boundaries(this.center, this.radius);
      boid.update();
    }
    this.animationId = requestAnimationFrame(() => this.updateBoids());
  }
  startBoidsAnimation() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.updateBoids();
  }
  stopBoidsAnimation() {
    this.isAnimating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  show() {
    this.visible = true;
    gsap.to(this.group.position, {
      duration: 1,
      y: this.y + 1,
      ease: "Bounce.easeOut",
    });
    this.startBoidsAnimation();
  }
  hide() {
    this.visible = false;
    this.stopBoidsAnimation();
    gsap.to(this.group.position, {
      duration: 0.5,
      y: this.y - 1,
      onComplete: () => {
        this.createBoids();
      },
    });
  }
  setBoidCount(count) {
    this.boidCount = Math.max(5, Math.min(50, count));
    if (this.visible) {
      this.createBoids();
      if (this.isAnimating) this.startBoidsAnimation();
    }
  }
  setBoundaryRadius(radius) {
    this.radius = Math.max(2, Math.min(8, radius));
    this.createBoundary();
  }
  stop() {
    this.stopBoidsAnimation();
  }
  reset() {
    this.stop();
    this.createBoids();
  }
}

// end of file
