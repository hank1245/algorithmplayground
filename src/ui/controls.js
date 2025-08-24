import * as THREE from "three";

export function createControls(canvas, camera, meshes) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const destinationPoint = new THREE.Vector3();
  let isPressed = false;

  function calculateMousePosition(e) {
    mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);
  }

  function checkIntersects(onHit) {
    const intersects = raycaster.intersectObjects(meshes);
    for (const item of intersects) {
      if (item.object.name === "floor") {
        destinationPoint.set(item.point.x, 0.3, item.point.z);
        onHit(destinationPoint);
      }
      break;
    }
  }

  function raycasting(onHit) {
    raycaster.setFromCamera(mouse, camera);
    checkIntersects(onHit);
  }

  // Mouse
  canvas.addEventListener("mousedown", (e) => {
    isPressed = true;
    calculateMousePosition(e);
  });
  canvas.addEventListener("mouseup", () => {
    isPressed = false;
  });
  canvas.addEventListener("mousemove", (e) => {
    if (isPressed) calculateMousePosition(e);
  });

  // Touch
  canvas.addEventListener("touchstart", (e) => {
    isPressed = true;
    calculateMousePosition(e.touches[0]);
  });
  canvas.addEventListener("touchend", () => {
    isPressed = false;
  });
  canvas.addEventListener("touchmove", (e) => {
    if (isPressed) calculateMousePosition(e.touches[0]);
  });

  return { raycasting, isPressed: () => isPressed, destinationPoint };
}
