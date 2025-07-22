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

    // Boid properties
    this.maxSpeed = 0.05;
    this.maxForce = 0.005;
    this.separationRadius = 0.3;
    this.alignmentRadius = 0.8;
    this.cohesionRadius = 0.8;

    // Visual representation
    this.mesh = null;
    this.trail = [];
    this.trailMeshes = [];
  }

  createMesh() {
    // Create a small cone to represent the boid with direction
    const geometry = new THREE.ConeGeometry(0.03, 0.08, 6);
    const material = new THREE.MeshLambertMaterial({
      color: 0x4ECDC4, // Unified teal color
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    return this.mesh;
  }

  // Separation: steer to avoid crowding local flockmates
  separate(boids) {
    const steer = new THREE.Vector3(0, 0, 0);
    let count = 0;

    for (let other of boids) {
      const distance = this.position.distanceTo(other.position);
      if (distance > 0 && distance < this.separationRadius) {
        // Calculate vector pointing away from neighbor
        const diff = new THREE.Vector3().subVectors(
          this.position,
          other.position
        );
        diff.normalize();
        diff.divideScalar(distance); // Weight by distance
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

  // Alignment: steer towards the average heading of neighbors
  align(boids) {
    const sum = new THREE.Vector3(0, 0, 0);
    let count = 0;

    for (let other of boids) {
      const distance = this.position.distanceTo(other.position);
      if (distance > 0 && distance < this.alignmentRadius) {
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

  // Cohesion: steer to move toward the average position of neighbors
  cohesion(boids) {
    const sum = new THREE.Vector3(0, 0, 0);
    let count = 0;

    for (let other of boids) {
      const distance = this.position.distanceTo(other.position);
      if (distance > 0 && distance < this.cohesionRadius) {
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

  // Seek a target position
  seek(target) {
    const desired = new THREE.Vector3().subVectors(target, this.position);
    desired.normalize();
    desired.multiplyScalar(this.maxSpeed);

    const steer = new THREE.Vector3().subVectors(desired, this.velocity);
    steer.clampLength(0, this.maxForce);
    return steer;
  }

  // Apply flocking behavior
  flock(boids) {
    const sep = this.separate(boids);
    const ali = this.align(boids);
    const coh = this.cohesion(boids);

    // Weight the forces - reduced for smoother movement
    sep.multiplyScalar(1.8);
    ali.multiplyScalar(1.0);
    coh.multiplyScalar(0.8);

    // Apply forces
    this.acceleration.add(sep);
    this.acceleration.add(ali);
    this.acceleration.add(coh);
  }

  // Keep boids within bounds (spherical boundary)
  boundaries(center, radius) {
    const distance = this.position.distanceTo(center);

    if (distance > radius) {
      const desired = new THREE.Vector3().subVectors(center, this.position);
      desired.normalize();
      desired.multiplyScalar(this.maxSpeed);
      const steer = new THREE.Vector3().subVectors(desired, this.velocity);
      steer.clampLength(0, this.maxForce * 3);
      this.acceleration.add(steer);
    }
  }

  // Update boid position and orientation
  update() {
    // Update velocity with damping for smoother movement
    this.velocity.add(this.acceleration);
    this.velocity.multiplyScalar(0.98); // Slight damping to reduce jitter
    this.velocity.clampLength(0, this.maxSpeed);

    // Update position
    this.position.add(this.velocity);

    // Update mesh position and rotation
    if (this.mesh) {
      this.mesh.position.copy(this.position);

      // Point the cone in the direction of movement with smoother rotation
      if (this.velocity.length() > 0.02) {
        const direction = this.velocity.clone().normalize();
        this.mesh.lookAt(this.position.clone().add(direction));
        this.mesh.rotateX(Math.PI / 2); // Adjust for cone orientation
      }
    }

    // Reset acceleration
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

    this.createBoids();
    this.group.position.set(this.x, this.y - 1, this.z);
    this.scene.add(this.group);

    // Animation loop
    this.animationId = null;
  }

  createBoids() {
    // Clear existing boids
    this.boids.forEach((boid) => {
      if (boid.mesh) {
        this.group.remove(boid.mesh);
      }
    });
    this.boids = [];

    // Create new boids
    for (let i = 0; i < this.boidCount; i++) {
      const x = (Math.random() - 0.5) * 4;
      const y = this.center.y + (Math.random() - 0.5) * 2;
      const z = (Math.random() - 0.5) * 4;

      const boid = new Boid(x, y, z);
      const mesh = boid.createMesh();
      this.group.add(mesh);
      this.boids.push(boid);
    }

    // Add boundary visualization
    this.createBoundary();
  }

  createBoundary() {
    // Remove existing boundary
    const existingBoundary = this.group.getObjectByName("boundary");
    if (existingBoundary) {
      this.group.remove(existingBoundary);
    }

    // Create a wireframe sphere to show the boundary
    const boundaryGeometry = new THREE.SphereGeometry(this.radius, 16, 16);
    const boundaryMaterial = new THREE.MeshBasicMaterial({
      color: 0x44aa88,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const boundaryMesh = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
    boundaryMesh.position.copy(this.center);
    boundaryMesh.name = "boundary";
    this.group.add(boundaryMesh);
  }

  updateBoids() {
    if (!this.isAnimating) return;

    // Apply flocking behavior to each boid
    for (let boid of this.boids) {
      boid.flock(this.boids);
      boid.boundaries(this.center, this.radius);
      boid.update();
    }

    // Continue animation
    this.animationId = requestAnimationFrame(() => this.updateBoids());
  }

  startBoidsAnimation() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    console.log("Boids 알고리즘 시작");
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
        // Reset boids to initial positions
        this.createBoids();
      },
    });
  }

  // Add some interactive controls
  setBoidCount(count) {
    this.boidCount = Math.max(5, Math.min(50, count));
    if (this.visible) {
      this.createBoids();
      if (this.isAnimating) {
        this.startBoidsAnimation();
      }
    }
  }

  setBoundaryRadius(radius) {
    this.radius = Math.max(2, Math.min(8, radius));
    this.createBoundary();
  }
}
