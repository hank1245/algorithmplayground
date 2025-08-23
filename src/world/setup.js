import * as THREE from "three";

// Create the core Three.js world: renderer, scene, camera, lights, and a shared LoadingManager
export function createWorld(canvas) {
  // Shared loading manager to track textures, GLTF, and FBX assets
  const loadingManager = new THREE.LoadingManager();

  // Texture loader using the shared manager
  const textureLoader = new THREE.TextureLoader(loadingManager);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Scene
  const scene = new THREE.Scene();

  // Camera (orthographic)
  const camera = new THREE.OrthographicCamera(
    -(window.innerWidth / window.innerHeight),
    window.innerWidth / window.innerHeight,
    1,
    -1,
    -1000,
    1000
  );
  const cameraBase = new THREE.Vector3(1, 7, 8);
  camera.position.copy(cameraBase);
  camera.zoom = 0.2;
  camera.updateProjectionMatrix();
  scene.add(camera);

  // Lights
  const ambientLight = new THREE.AmbientLight("white", 0.7);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 0.5);
  const directionalLightOriginPosition = new THREE.Vector3(1, 1, 1);
  directionalLight.position.copy(directionalLightOriginPosition);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.left = -100;
  directionalLight.shadow.camera.right = 100;
  directionalLight.shadow.camera.top = 100;
  directionalLight.shadow.camera.bottom = -100;
  directionalLight.shadow.camera.near = -100;
  directionalLight.shadow.camera.far = 100;
  scene.add(directionalLight);

  // Export textures used by world spots
  const textures = {
    floor: textureLoader.load("/images/grid.avif"),
    bubble: textureLoader.load("/images/bubbleSort.avif"),
    insertion: textureLoader.load("/images/insertionSort.avif"),
    selection: textureLoader.load("/images/selectionSort.avif"),
    quick: textureLoader.load("/images/quickSort.avif"),
    heap: textureLoader.load("/images/heapSort.avif"),
    merge: textureLoader.load("/images/mergeSort.avif"),
    hanoi: textureLoader.load("/images/hanoiTower.avif"),
    boids: textureLoader.load("/images/boids.avif"),
    welcome: textureLoader.load("/images/welcome.avif"),
  };
  // Repeat floor
  textures.floor.wrapS = THREE.RepeatWrapping;
  textures.floor.wrapT = THREE.RepeatWrapping;
  textures.floor.repeat.set(10, 10);

  function onResize() {
    camera.left = -(window.innerWidth / window.innerHeight);
    camera.right = window.innerWidth / window.innerHeight;
    camera.top = 1;
    camera.bottom = -1;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", onResize);

  return {
    scene,
    camera,
    cameraBase,
    renderer,
    textures,
    loadingManager,
    dispose: () => window.removeEventListener("resize", onResize),
  };
}
