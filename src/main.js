import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Player } from "./Player";
import { BubbleSortVisualizer } from "./algorithms/BubbleSort";
import { InsertionSortVisualizer } from "./algorithms/InsertionSort";
import { SelectionSortVisualizer } from "./algorithms/SelectionSort";
import { QuickSortVisualizer } from "./algorithms/QuickSort";
import { HeapSortVisualizer } from "./algorithms/HeapSort";
import { MergeSortVisualizer } from "./algorithms/MergeSort";
import { HanoiTowerVisualizer } from "./algorithms/HanoiTower";
import { BoidsVisualizer } from "./algorithms/BoidsAlgorithm";
import { createWorld } from "./world/setup";
import { createSpots } from "./world/spots";
import { createControls } from "./input/controls";
import { createVisualizerManager } from "./visualizers/manager";
import gsap from "gsap";

const canvas = document.querySelector("#three-canvas");
const overlay = document.getElementById("loading-overlay");

// World
const { scene, camera, cameraBase, renderer, textures, loadingManager } =
  createWorld(canvas);

// Spots and floor/pointer
const { meshes, floor, pointer, spots } = createSpots(scene, textures);

// Loaders (share loadingManager via GLTFLoader only, FBXLoader uses its own internally)
const gltfLoader = new GLTFLoader(loadingManager);

// Player
const player = new Player({
  scene,
  meshes,
  gltfLoader,
  modelSrc: "/models/character.glb",
  idleAnimationSrc: "/models/idle.fbx",
  walkAnimationSrc: "/models/walk.fbx",
});

// Visualizers
const visualizers = {
  bubble: new BubbleSortVisualizer({ scene, x: -8, y: -1.3, z: 6 }),
  insertion: new InsertionSortVisualizer({ scene, x: 0, y: -1.3, z: 6 }),
  selection: new SelectionSortVisualizer({ scene, x: 8, y: -1.3, z: 6 }),
  quick: new QuickSortVisualizer({ scene, x: -8, y: -1.3, z: -2 }),
  heap: new HeapSortVisualizer({ scene, x: 8, y: -1.3, z: -2 }),
  merge: new MergeSortVisualizer({ scene, x: -8, y: -1.3, z: -10 }),
  hanoi: new HanoiTowerVisualizer({ scene, x: 0, y: -1.3, z: -10 }),
  boids: new BoidsVisualizer({ scene, x: 8, y: -1.8, z: -8 }),
};

// Controls
const controls = createControls(canvas, camera, meshes);

// Manager
const manager = createVisualizerManager(
  camera,
  cameraBase,
  player,
  spots,
  visualizers
);

// Animation loop
const clock = new THREE.Clock();
let angle = 0;

function draw() {
  const delta = clock.getDelta();
  if (player.mixer) player.mixer.update(delta);

  if (player.modelMesh) {
    camera.lookAt(player.modelMesh.position);
  }
  if (player.modelMesh) {
    if (controls.isPressed())
      controls.raycasting((hit) => {
        player.modelMesh.lookAt(hit);
        player.moving = true;
        pointer.position.x = hit.x;
        pointer.position.z = hit.z;
      });

    if (player.moving) {
      angle = Math.atan2(
        controls.destinationPoint.z - player.modelMesh.position.z,
        controls.destinationPoint.x - player.modelMesh.position.x
      );
      // Movement speed (restored slower pace)
      const speed = 0.035;
      player.modelMesh.position.x += Math.cos(angle) * speed;
      player.modelMesh.position.z += Math.sin(angle) * speed;

      camera.position.x = cameraBase.x + player.modelMesh.position.x;
      camera.position.z = cameraBase.z + player.modelMesh.position.z;

      if (player.isReady) player.fadeToAction(1, 0.25);

      if (
        Math.abs(controls.destinationPoint.x - player.modelMesh.position.x) <
          0.03 &&
        Math.abs(controls.destinationPoint.z - player.modelMesh.position.z) <
          0.03
      ) {
        player.moving = false;
      }
    } else {
      if (player.isReady) player.fadeToAction(0, 0.25);
    }
    // Proximity visualizers
    manager.update();
  }

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

// Loading overlay: hide after first frame and when player is ready
let firstFrameRendered = false;
loadingManager.onLoad = () => {
  // Wait one frame to ensure textures are bound
  requestAnimationFrame(() => {
    firstFrameRendered = true;
    maybeHideOverlay();
  });
};

function maybeHideOverlay() {
  if (firstFrameRendered && player.isReady && overlay) {
    overlay.classList.add("hidden");
  }
}

// Poll player readiness briefly
const readyInterval = setInterval(() => {
  if (player.isReady) {
    clearInterval(readyInterval);
    maybeHideOverlay();
  }
}, 100);

draw();
