import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Player } from "./Player";
import { BubbleSortVisualizer } from "./BubbleSort";
import { InsertionSortVisualizer } from "./InsertionSort";
import { SelectionSortVisualizer } from "./SelectionSort";
import { QuickSortVisualizer } from "./QuickSort";
import { HeapSortVisualizer } from "./HeapSort";
import { MergeSortVisualizer } from "./MergeSort";
import { HanoiTowerVisualizer } from "./HanoiTower";
import { BoidsVisualizer } from "./BoidsAlgorithm";
import { algorithmDescriptions } from "./AlgorithmDescriptions";
import gsap from "gsap";

// Texture
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load("/images/grid.png");
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.x = 10;
floorTexture.repeat.y = 10;

const bubbleSortTexture = textureLoader.load("/images/bubbleSort.png");
const insertionSortTexture = textureLoader.load("/images/insertionSort.png");
const selectionSortTexture = textureLoader.load("/images/selectionSort.png");
const quickSortTexture = textureLoader.load("/images/quickSort.png");
const heapSortTexture = textureLoader.load("/images/heapSort.png");
const mergeSortTexture = textureLoader.load("/images/mergeSort.png");
const hanoiTowerTexture = textureLoader.load("/images/hanoiTower.png");
const boidsTexture = textureLoader.load("/images/boids.png");
const welcomeTexture = textureLoader.load("/images/welcome.png");

// Renderer
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.OrthographicCamera(
  -(window.innerWidth / window.innerHeight), // left
  window.innerWidth / window.innerHeight, // right,
  1, // top
  -1, // bottom
  -1000,
  1000
);

const cameraPosition = new THREE.Vector3(1, 7, 8);
camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
camera.zoom = 0.2;
camera.updateProjectionMatrix();
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight("white", 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("white", 0.5);
const directionalLightOriginPosition = new THREE.Vector3(1, 1, 1);
directionalLight.position.x = directionalLightOriginPosition.x;
directionalLight.position.y = directionalLightOriginPosition.y;
directionalLight.position.z = directionalLightOriginPosition.z;
directionalLight.castShadow = true;

// mapSize 세팅으로 그림자 퀄리티 설정
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
// 그림자 범위
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.camera.near = -100;
directionalLight.shadow.camera.far = 100;
scene.add(directionalLight);

// Mesh
const meshes = [];
const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({
    map: floorTexture,
  })
);
floorMesh.name = "floor";
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);
meshes.push(floorMesh);

const pointerMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    color: "crimson",
    transparent: true,
    opacity: 0.5,
  })
);
pointerMesh.rotation.x = -Math.PI / 2;
pointerMesh.position.y = 0.01;
pointerMesh.receiveShadow = true;
scene.add(pointerMesh);

const spotMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshStandardMaterial({
    map: bubbleSortTexture,
    transparent: true,
    opacity: 0.8,
  })
);
// 3x3 grid layout spots with center (0,0) empty
spotMesh.position.set(-8, 0.005, 8);
spotMesh.rotation.x = -Math.PI / 2;
spotMesh.receiveShadow = true;
scene.add(spotMesh);

const insertionSpotMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshStandardMaterial({
    map: insertionSortTexture,
    transparent: true,
    opacity: 0.8,
  })
);
insertionSpotMesh.position.set(0, 0.005, 8);
insertionSpotMesh.rotation.x = -Math.PI / 2;
insertionSpotMesh.receiveShadow = true;
scene.add(insertionSpotMesh);

const selectionSpotMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshStandardMaterial({
    map: selectionSortTexture,
    transparent: true,
    opacity: 0.8,
  })
);
selectionSpotMesh.position.set(8, 0.005, 8);
selectionSpotMesh.rotation.x = -Math.PI / 2;
selectionSpotMesh.receiveShadow = true;
scene.add(selectionSpotMesh);

const quickSpotMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshStandardMaterial({
    map: quickSortTexture,
    transparent: true,
    opacity: 0.8,
  })
);
quickSpotMesh.position.set(-8, 0.005, 0);
quickSpotMesh.rotation.x = -Math.PI / 2;
quickSpotMesh.receiveShadow = true;
scene.add(quickSpotMesh);

const heapSpotMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshStandardMaterial({
    map: heapSortTexture,
    transparent: true,
    opacity: 0.8,
  })
);
heapSpotMesh.position.set(8, 0.005, 0);
heapSpotMesh.rotation.x = -Math.PI / 2;
heapSpotMesh.receiveShadow = true;
scene.add(heapSpotMesh);

const mergeSpotMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshStandardMaterial({
    map: mergeSortTexture,
    transparent: true,
    opacity: 0.8,
  })
);
mergeSpotMesh.position.set(-8, 0.005, -8);
mergeSpotMesh.rotation.x = -Math.PI / 2;
mergeSpotMesh.receiveShadow = true;
scene.add(mergeSpotMesh);

const hanoiSpotMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshStandardMaterial({
    map: hanoiTowerTexture,
    transparent: true,
    opacity: 0.8,
  })
);
hanoiSpotMesh.position.set(0, 0.005, -8);
hanoiSpotMesh.rotation.x = -Math.PI / 2;
hanoiSpotMesh.receiveShadow = true;
scene.add(hanoiSpotMesh);

const boidsSpotMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshStandardMaterial({
    map: boidsTexture,
    transparent: true,
    opacity: 0.8,
  })
);
boidsSpotMesh.position.set(8, 0.005, -8);
boidsSpotMesh.rotation.x = -Math.PI / 2;
boidsSpotMesh.receiveShadow = true;
scene.add(boidsSpotMesh);

const welcomeSpotMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 4),
  new THREE.MeshStandardMaterial({
    map: welcomeTexture,
    transparent: true,
    opacity: 0.8,
  })
);
welcomeSpotMesh.position.set(0, 0.005, 0);
welcomeSpotMesh.rotation.x = -Math.PI / 2;
welcomeSpotMesh.receiveShadow = true;
scene.add(welcomeSpotMesh);

const gltfLoader = new GLTFLoader();

// 3x3 grid layout with center (0,0) empty - spacing of 8 units
const bubbleSortVisualizer = new BubbleSortVisualizer({
  scene,
  x: -8,
  y: -1.3,
  z: 6,
});

const insertionSortVisualizer = new InsertionSortVisualizer({
  scene,
  x: 0,
  y: -1.3,
  z: 6,
});

const selectionSortVisualizer = new SelectionSortVisualizer({
  scene,
  x: 8,
  y: -1.3,
  z: 6,
});

const quickSortVisualizer = new QuickSortVisualizer({
  scene,
  x: -8,
  y: -1.3,
  z: -2,
});

const heapSortVisualizer = new HeapSortVisualizer({
  scene,
  x: 8,
  y: -1.3,
  z: -2,
});

const mergeSortVisualizer = new MergeSortVisualizer({
  scene,
  x: -8,
  y: -1.3,
  z: -10,
});

const hanoiTowerVisualizer = new HanoiTowerVisualizer({
  scene,
  x: 0,
  y: -1.3,
  z: -10,
});

const boidsVisualizer = new BoidsVisualizer({
  scene,
  x: 8,
  y: -1.3,
  z: -10,
});

const player = new Player({
  scene,
  meshes,
  gltfLoader,
  modelSrc: "/models/character.glb", // GLB 모델 경로
  idleAnimationSrc: "/models/idle.fbx", // Idle FBX 애니메이션 경로
  walkAnimationSrc: "/models/walk.fbx", // Walk FBX 애니메이션 경로
});

// Description UI elements
const descriptionElement = document.getElementById('algorithm-description');
const algorithmNameElement = document.getElementById('algorithm-name');
const timeComplexityElement = document.getElementById('time-complexity');
const spaceComplexityElement = document.getElementById('space-complexity');
const descriptionTextElement = document.getElementById('algorithm-description-text');
const worksTitleElement = document.getElementById('works-title');
const howItWorksListElement = document.getElementById('how-it-works-list');

let currentAlgorithm = null;

function showDescription(algorithmKey) {
  const algorithm = algorithmDescriptions[algorithmKey];
  if (!algorithm || currentAlgorithm === algorithmKey) return;

  currentAlgorithm = algorithmKey;
  
  algorithmNameElement.textContent = algorithm.name;
  timeComplexityElement.textContent = algorithm.timeComplexity;
  spaceComplexityElement.textContent = algorithm.spaceComplexity;
  descriptionTextElement.textContent = algorithm.description;
  
  // Handle special case for hanoiTower
  if (algorithmKey === 'hanoiTower') {
    worksTitleElement.textContent = '규칙:';
    howItWorksListElement.innerHTML = '';
    algorithm.rules.forEach(rule => {
      const li = document.createElement('li');
      li.textContent = rule;
      howItWorksListElement.appendChild(li);
    });
  } else {
    worksTitleElement.textContent = '작동 방식:';
    howItWorksListElement.innerHTML = '';
    algorithm.howItWorks.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      howItWorksListElement.appendChild(li);
    });
  }
  
  descriptionElement.classList.remove('hidden');
}

function hideDescription() {
  if (!currentAlgorithm) return;
  currentAlgorithm = null;
  descriptionElement.classList.add('hidden');
}

const raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let destinationPoint = new THREE.Vector3();
let angle = 0;
let isPressed = false; // 마우스를 누르고 있는 상태

// 그리기
const clock = new THREE.Clock();

function draw() {
  const delta = clock.getDelta();

  if (player.mixer) player.mixer.update(delta);

  if (player.modelMesh) {
    camera.lookAt(player.modelMesh.position);
  }

  if (player.modelMesh) {
    if (isPressed) {
      raycasting();
    }

    if (player.moving) {
      // 걸어가는 상태
      angle = Math.atan2(
        destinationPoint.z - player.modelMesh.position.z,
        destinationPoint.x - player.modelMesh.position.x
      );
      player.modelMesh.position.x += Math.cos(angle) * 0.05;
      player.modelMesh.position.z += Math.sin(angle) * 0.05;

      camera.position.x = cameraPosition.x + player.modelMesh.position.x;
      camera.position.z = cameraPosition.z + player.modelMesh.position.z;

      if (player.isReady) {
        player.fadeToAction(1, 0.2); // Walk 애니메이션으로 전환
      }

      if (
        Math.abs(destinationPoint.x - player.modelMesh.position.x) < 0.03 &&
        Math.abs(destinationPoint.z - player.modelMesh.position.z) < 0.03
      ) {
        player.moving = false;
        console.log("멈춤");
      }

      if (
        Math.abs(spotMesh.position.x - player.modelMesh.position.x) < 1.5 &&
        Math.abs(spotMesh.position.z - player.modelMesh.position.z) < 1.5
      ) {
        if (!bubbleSortVisualizer.visible) {
          console.log("버블 정렬 시작");
          bubbleSortVisualizer.reset?.();
          bubbleSortVisualizer.show();
          bubbleSortVisualizer.startBubbleSort();
          spotMesh.material.color.set("seagreen");
          showDescription('bubbleSort');
          gsap.to(camera.position, {
            duration: 1,
            y: 3,
          });
        }
      } else if (bubbleSortVisualizer.visible) {
        console.log("버블 정렬 숨기기");
        bubbleSortVisualizer.stop?.();
        bubbleSortVisualizer.reset?.();
        bubbleSortVisualizer.hide();
        spotMesh.material.color.set("white");
        hideDescription();
        gsap.to(camera.position, {
          duration: 1,
          y: 5,
        });
      }

      if (
        Math.abs(insertionSpotMesh.position.x - player.modelMesh.position.x) <
          1.5 &&
        Math.abs(insertionSpotMesh.position.z - player.modelMesh.position.z) <
          1.5
      ) {
        if (!insertionSortVisualizer.visible) {
          console.log("삽입 정렬 시작");
          insertionSortVisualizer.reset?.();
          insertionSortVisualizer.show();
          insertionSortVisualizer.startInsertionSort();
          insertionSpotMesh.material.color.set("crimson");
          showDescription('insertionSort');
          gsap.to(camera.position, {
            duration: 1,
            y: 3,
          });
        }
      } else if (insertionSortVisualizer.visible) {
        console.log("삽입 정렬 숨기기");
        insertionSortVisualizer.stop?.();
        insertionSortVisualizer.reset?.();
        insertionSortVisualizer.hide();
        insertionSpotMesh.material.color.set("white");
        hideDescription();
        gsap.to(camera.position, {
          duration: 1,
          y: 5,
        });
      }

      if (
        Math.abs(selectionSpotMesh.position.x - player.modelMesh.position.x) <
          1.5 &&
        Math.abs(selectionSpotMesh.position.z - player.modelMesh.position.z) <
          1.5
      ) {
        if (!selectionSortVisualizer.visible) {
          console.log("선택 정렬 시작");
          selectionSortVisualizer.reset?.();
          selectionSortVisualizer.show();
          selectionSortVisualizer.startSelectionSort();
          selectionSpotMesh.material.color.set("magenta");
          showDescription('selectionSort');
          gsap.to(camera.position, {
            duration: 1,
            y: 3,
          });
        }
      } else if (selectionSortVisualizer.visible) {
        console.log("선택 정렬 숨기기");
        selectionSortVisualizer.stop?.();
        selectionSortVisualizer.reset?.();
        selectionSortVisualizer.hide();
        selectionSpotMesh.material.color.set("white");
        hideDescription();
        gsap.to(camera.position, {
          duration: 1,
          y: 5,
        });
      }

      if (
        Math.abs(quickSpotMesh.position.x - player.modelMesh.position.x) <
          1.5 &&
        Math.abs(quickSpotMesh.position.z - player.modelMesh.position.z) < 1.5
      ) {
        if (!quickSortVisualizer.visible) {
          console.log("퀵 정렬 시작");
          quickSortVisualizer.reset?.();
          quickSortVisualizer.show();
          quickSortVisualizer.startQuickSort();
          quickSpotMesh.material.color.set("cyan");
          showDescription('quickSort');
          gsap.to(camera.position, {
            duration: 1,
            y: 3,
          });
        }
      } else if (quickSortVisualizer.visible) {
        console.log("퀵 정렬 숨기기");
        quickSortVisualizer.stop?.();
        quickSortVisualizer.reset?.();
        quickSortVisualizer.hide();
        quickSpotMesh.material.color.set("white");
        hideDescription();
        gsap.to(camera.position, {
          duration: 1,
          y: 5,
        });
      }

      if (
        Math.abs(heapSpotMesh.position.x - player.modelMesh.position.x) < 1.5 &&
        Math.abs(heapSpotMesh.position.z - player.modelMesh.position.z) < 1.5
      ) {
        if (!heapSortVisualizer.visible) {
          console.log("힙 정렬 시작");
          heapSortVisualizer.reset?.();
          heapSortVisualizer.show();
          heapSortVisualizer.startHeapSort();
          heapSpotMesh.material.color.set("chocolate");
          showDescription('heapSort');
          gsap.to(camera.position, {
            duration: 1,
            y: 3,
          });
        }
      } else if (heapSortVisualizer.visible) {
        console.log("힙 정렬 숨기기");
        heapSortVisualizer.stop?.();
        heapSortVisualizer.reset?.();
        heapSortVisualizer.hide();
        heapSpotMesh.material.color.set("white");
        hideDescription();
        gsap.to(camera.position, {
          duration: 1,
          y: 5,
        });
      }

      if (
        Math.abs(mergeSpotMesh.position.x - player.modelMesh.position.x) <
          1.5 &&
        Math.abs(mergeSpotMesh.position.z - player.modelMesh.position.z) < 1.5
      ) {
        if (!mergeSortVisualizer.visible) {
          console.log("병합 정렬 시작");
          mergeSortVisualizer.reset?.();
          mergeSortVisualizer.show();
          mergeSortVisualizer.startMergeSort();
          mergeSpotMesh.material.color.set("purple");
          showDescription('mergeSort');
          gsap.to(camera.position, {
            duration: 1,
            y: 3,
          });
        }
      } else if (mergeSortVisualizer.visible) {
        console.log("병합 정렬 숨깰기");
        mergeSortVisualizer.stop?.();
        mergeSortVisualizer.reset?.();
        mergeSortVisualizer.hide();
        mergeSpotMesh.material.color.set("white");
        hideDescription();
        gsap.to(camera.position, {
          duration: 1,
          y: 5,
        });
      }

      if (
        Math.abs(hanoiSpotMesh.position.x - player.modelMesh.position.x) <
          1.5 &&
        Math.abs(hanoiSpotMesh.position.z - player.modelMesh.position.z) < 1.5
      ) {
        if (!hanoiTowerVisualizer.visible) {
          console.log("하노이의 탑 시작");
          hanoiTowerVisualizer.show();
          hanoiTowerVisualizer.startHanoiAnimation();
          hanoiSpotMesh.material.color.set("orange");
          showDescription('hanoiTower');
          gsap.to(camera.position, {
            duration: 1,
            y: 3,
          });
        }
      } else if (hanoiTowerVisualizer.visible) {
        console.log("하노이의 탑 숨기기");
        hanoiTowerVisualizer.hide();
        hanoiSpotMesh.material.color.set("white");
        hideDescription();
        gsap.to(camera.position, {
          duration: 1,
          y: 5,
        });
      }

      if (
        Math.abs(boidsSpotMesh.position.x - player.modelMesh.position.x) <
          1.5 &&
        Math.abs(boidsSpotMesh.position.z - player.modelMesh.position.z) < 1.5
      ) {
        if (!boidsVisualizer.visible) {
          console.log("Boids 알고리즘 시작");
          boidsVisualizer.show();
          boidsSpotMesh.material.color.set("lightblue");
          showDescription('boids');
          gsap.to(camera.position, {
            duration: 1,
            y: 3,
          });
        }
      } else if (boidsVisualizer.visible) {
        console.log("Boids 알고리즘 숨기기");
        boidsVisualizer.hide();
        boidsSpotMesh.material.color.set("white");
        hideDescription();
        gsap.to(camera.position, {
          duration: 1,
          y: 5,
        });
      }
    } else {
      // 서 있는 상태
      if (player.isReady) {
        player.fadeToAction(0, 0.2); // Idle 애니메이션으로 전환
      }
    }
  }

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

function checkIntersects() {
  // raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(meshes);
  for (const item of intersects) {
    if (item.object.name === "floor") {
      destinationPoint.x = item.point.x;
      destinationPoint.y = 0.3;
      destinationPoint.z = item.point.z;
      player.modelMesh.lookAt(destinationPoint);

      // console.log(item.point)

      player.moving = true;

      pointerMesh.position.x = destinationPoint.x;
      pointerMesh.position.z = destinationPoint.z;
    }
    break;
  }
}

function setSize() {
  camera.left = -(window.innerWidth / window.innerHeight);
  camera.right = window.innerWidth / window.innerHeight;
  camera.top = 1;
  camera.bottom = -1;

  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

// 이벤트
window.addEventListener("resize", setSize);

// 마우스 좌표를 three.js에 맞게 변환
function calculateMousePosition(e) {
  mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
  mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);
}

// 변환된 마우스 좌표를 이용해 래이캐스팅
function raycasting() {
  raycaster.setFromCamera(mouse, camera);
  checkIntersects();
}

// 마우스 이벤트
canvas.addEventListener("mousedown", (e) => {
  isPressed = true;
  calculateMousePosition(e);
});
canvas.addEventListener("mouseup", () => {
  isPressed = false;
});
canvas.addEventListener("mousemove", (e) => {
  if (isPressed) {
    calculateMousePosition(e);
  }
});

// 터치 이벤트
canvas.addEventListener("touchstart", (e) => {
  isPressed = true;
  calculateMousePosition(e.touches[0]);
});
canvas.addEventListener("touchend", () => {
  isPressed = false;
});
canvas.addEventListener("touchmove", (e) => {
  if (isPressed) {
    calculateMousePosition(e.touches[0]);
  }
});

draw();
