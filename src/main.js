import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Player } from "./Player";
import { BubbleSortVisualizer } from "./BubbleSort";
import { InsertionSortVisualizer } from "./InsertionSort";
import { SelectionSortVisualizer } from "./SelectionSort";
import { QuickSortVisualizer } from "./QuickSort";
import { HeapSortVisualizer } from "./HeapSort";
import { MergeSortVisualizer } from "./MergeSort";
import gsap from "gsap";

// Texture
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load("/images/grid.png");
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.x = 10;
floorTexture.repeat.y = 10;

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

const cameraPosition = new THREE.Vector3(1, 5, 5);
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
    color: "yellow",
    transparent: true,
    opacity: 0.5,
  })
);
spotMesh.position.set(5, 0.005, 5);
spotMesh.rotation.x = -Math.PI / 2;
spotMesh.receiveShadow = true;
scene.add(spotMesh);

const insertionSpotMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshStandardMaterial({
    color: "orange",
    transparent: true,
    opacity: 0.5,
  })
);
insertionSpotMesh.position.set(-5, 0.005, 5);
insertionSpotMesh.rotation.x = -Math.PI / 2;
insertionSpotMesh.receiveShadow = true;
scene.add(insertionSpotMesh);

const selectionSpotMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshStandardMaterial({
    color: "purple",
    transparent: true,
    opacity: 0.5,
  })
);
selectionSpotMesh.position.set(5, 0.005, -5);
selectionSpotMesh.rotation.x = -Math.PI / 2;
selectionSpotMesh.receiveShadow = true;
scene.add(selectionSpotMesh);

const quickSpotMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshStandardMaterial({
    color: "teal",
    transparent: true,
    opacity: 0.5,
  })
);
quickSpotMesh.position.set(-5, 0.005, -5);
quickSpotMesh.rotation.x = -Math.PI / 2;
quickSpotMesh.receiveShadow = true;
scene.add(quickSpotMesh);

const heapSpotMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshStandardMaterial({
    color: "brown",
    transparent: true,
    opacity: 0.5,
  })
);
heapSpotMesh.position.set(0, 0.005, -5);
heapSpotMesh.rotation.x = -Math.PI / 2;
heapSpotMesh.receiveShadow = true;
scene.add(heapSpotMesh);

const mergeSpotMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshStandardMaterial({
    color: "indigo",
    transparent: true,
    opacity: 0.5,
  })
);
mergeSpotMesh.position.set(0, 0.005, 5);
mergeSpotMesh.rotation.x = -Math.PI / 2;
mergeSpotMesh.receiveShadow = true;
scene.add(mergeSpotMesh);

const gltfLoader = new GLTFLoader();

const bubbleSortVisualizer = new BubbleSortVisualizer({
  scene,
  x: 5,
  y: -1.3,
  z: 2,
});

const insertionSortVisualizer = new InsertionSortVisualizer({
  scene,
  x: -5,
  y: -1.3,
  z: 2,
});

const selectionSortVisualizer = new SelectionSortVisualizer({
  scene,
  x: 5,
  y: -1.3,
  z: -8,
});

const quickSortVisualizer = new QuickSortVisualizer({
  scene,
  x: -5,
  y: -1.3,
  z: -8,
});

const heapSortVisualizer = new HeapSortVisualizer({
  scene,
  x: 0,
  y: -1.3,
  z: -3,
});

const mergeSortVisualizer = new MergeSortVisualizer({
  scene,
  x: 0,
  y: -1.3,
  z: 2,
});

const player = new Player({
  scene,
  meshes,
  gltfLoader,
  modelSrc: "/models/ilbuni.glb",
});

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

      player.actions[0].stop();
      player.actions[1].play();

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
          bubbleSortVisualizer.show();
          bubbleSortVisualizer.startBubbleSort();
          spotMesh.material.color.set("seagreen");
          gsap.to(camera.position, {
            duration: 1,
            y: 3,
          });
        }
      } else if (bubbleSortVisualizer.visible) {
        console.log("버블 정렬 숨기기");
        bubbleSortVisualizer.hide();
        spotMesh.material.color.set("yellow");
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
          insertionSortVisualizer.show();
          insertionSortVisualizer.startInsertionSort();
          insertionSpotMesh.material.color.set("crimson");
          gsap.to(camera.position, {
            duration: 1,
            y: 3,
          });
        }
      } else if (insertionSortVisualizer.visible) {
        console.log("삽입 정렬 숨기기");
        insertionSortVisualizer.hide();
        insertionSpotMesh.material.color.set("orange");
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
          selectionSortVisualizer.show();
          selectionSortVisualizer.startSelectionSort();
          selectionSpotMesh.material.color.set("magenta");
          gsap.to(camera.position, {
            duration: 1,
            y: 3,
          });
        }
      } else if (selectionSortVisualizer.visible) {
        console.log("선택 정렬 숨기기");
        selectionSortVisualizer.hide();
        selectionSpotMesh.material.color.set("purple");
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
          quickSortVisualizer.show();
          quickSortVisualizer.startQuickSort();
          quickSpotMesh.material.color.set("cyan");
          gsap.to(camera.position, {
            duration: 1,
            y: 3,
          });
        }
      } else if (quickSortVisualizer.visible) {
        console.log("퀵 정렬 숨기기");
        quickSortVisualizer.hide();
        quickSpotMesh.material.color.set("teal");
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
          heapSortVisualizer.show();
          heapSortVisualizer.startHeapSort();
          heapSpotMesh.material.color.set("chocolate");
          gsap.to(camera.position, {
            duration: 1,
            y: 3,
          });
        }
      } else if (heapSortVisualizer.visible) {
        console.log("힙 정렬 숨기기");
        heapSortVisualizer.hide();
        heapSpotMesh.material.color.set("brown");
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
          mergeSortVisualizer.show();
          mergeSortVisualizer.startMergeSort();
          mergeSpotMesh.material.color.set("purple");
          gsap.to(camera.position, {
            duration: 1,
            y: 3,
          });
        }
      } else if (mergeSortVisualizer.visible) {
        console.log("병합 정렬 숨기기");
        mergeSortVisualizer.hide();
        mergeSpotMesh.material.color.set("indigo");
        gsap.to(camera.position, {
          duration: 1,
          y: 5,
        });
      }
    } else {
      // 서 있는 상태
      player.actions[1].stop();
      player.actions[0].play();
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
