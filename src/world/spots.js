import * as THREE from "three";
import gsap from "gsap";

// Create floor, pointer, and the 3x3 grid of spots with textures
export function createSpots(scene, textures) {
  const meshes = [];

  // Floor
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: textures.floor,
    color: new THREE.Color(0x111b2c),
    roughness: 0.95,
    metalness: 0,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), floorMaterial);
  floor.name = "floor";
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  meshes.push(floor);

  // Pointer (click indicator)
  const pointer = new THREE.Mesh(
    new THREE.RingGeometry(0.35, 0.55, 48),
    new THREE.MeshBasicMaterial({
      color: 0x6fffe9,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    })
  );
  pointer.name = "pointer";
  pointer.rotation.x = -Math.PI / 2;
  pointer.position.y = 0.02;
  pointer.material.depthWrite = false;
  pointer.material.depthTest = false;
  pointer.renderOrder = 5;

  const pointerGlow = new THREE.Mesh(
    new THREE.CircleGeometry(0.65, 48),
    new THREE.MeshBasicMaterial({
      color: 0x6fffe9,
      transparent: true,
      opacity: 0.26,
      side: THREE.DoubleSide,
    })
  );
  pointerGlow.position.z = -0.001;
  pointerGlow.material.depthWrite = false;
  pointerGlow.material.depthTest = false;
  pointerGlow.renderOrder = 4;
  pointer.add(pointerGlow);

  scene.add(pointer);

  gsap.to(pointer.scale, {
    x: 1.2,
    y: 1.2,
    duration: 1.6,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
  gsap.to(pointer.material, {
    opacity: 0.55,
    duration: 1.6,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

  // Helper to make a spot
  const makeSpot = (map, x, z, size = 3) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshBasicMaterial({
        map,
        transparent: true,
        opacity: 1,
        toneMapped: false,
      })
    );
    m.position.set(x, 0.005, z);
    m.rotation.x = -Math.PI / 2;
    m.receiveShadow = true;
    m.material.depthWrite = false;
    m.renderOrder = 2;
    scene.add(m);
    return m;
  };

  // 3x3 grid, center is welcome
  const spots = {
    bubble: makeSpot(textures.bubble, -8, 8),
    insertion: makeSpot(textures.insertion, 0, 8),
    selection: makeSpot(textures.selection, 8, 8),
    quick: makeSpot(textures.quick, -8, 0),
    heap: makeSpot(textures.heap, 8, 0),
    merge: makeSpot(textures.merge, -8, -8),
    hanoi: makeSpot(textures.hanoi, 0, -8),
    boids: makeSpot(textures.boids, 8, -8),
    welcome: makeSpot(textures.welcome, 0, 0, 4),
  };

  return { meshes, floor, pointer, spots };
}
