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
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.78;

  // Scene
  const scene = new THREE.Scene();
  const backgroundColor = new THREE.Color(0x05060b);
  scene.background = backgroundColor;
  renderer.setClearColor(backgroundColor, 1);

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
  const ambientLight = new THREE.AmbientLight(0xe5ecff, 0.16);
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0x2f5fff, 0x080412, 0.38);
  scene.add(hemisphereLight);

  const directionalLight = new THREE.DirectionalLight(0xf6f8ff, 0.68);
  directionalLight.position.set(18, 28, 18);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.left = -40;
  directionalLight.shadow.camera.right = 40;
  directionalLight.shadow.camera.top = 40;
  directionalLight.shadow.camera.bottom = -40;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 80;
  directionalLight.shadow.bias = -0.0006;
  scene.add(directionalLight);

  const rimLight = new THREE.DirectionalLight(0x7ec0ff, 0.32);
  rimLight.position.set(-16, 16, -12);
  scene.add(rimLight);

  const spotlight = new THREE.SpotLight(0x6fffe9, 0.2, 120, Math.PI / 4.5, 0.9, 1);
  spotlight.position.set(0, 26, 0);
  spotlight.target.position.set(0, 0, 0);
  scene.add(spotlight);
  scene.add(spotlight.target);

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
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  Object.entries(textures).forEach(([key, texture]) => {
    if (!texture) return;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(12, maxAnisotropy);
    if (key === "floor") {
      texture.repeat.set(10, 10);
    }
  });

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
