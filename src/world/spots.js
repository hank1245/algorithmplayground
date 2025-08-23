import * as THREE from "three";

// Create floor, pointer, and the 3x3 grid of "spots" with textures
export function createSpots(scene, textures) {
  const meshes = [];

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ map: textures.floor })
  );
  floor.name = "floor";
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  meshes.push(floor);

  // Pointer (click indicator)
  const pointer = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      color: "crimson",
      transparent: true,
      opacity: 0.5,
    })
  );
  pointer.rotation.x = -Math.PI / 2;
  pointer.position.y = 0.01;
  pointer.receiveShadow = true;
  scene.add(pointer);

  // Helper to make a spot
  const makeSpot = (map, x, z, size = 3) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshStandardMaterial({ map, transparent: true, opacity: 0.8 })
    );
    m.position.set(x, 0.005, z);
    m.rotation.x = -Math.PI / 2;
    m.receiveShadow = true;
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
