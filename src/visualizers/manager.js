import gsap from "gsap";
import { showDescription, hideDescription } from "../ui/description";

export function createVisualizerManager(
  camera,
  cameraBase,
  player,
  spots,
  visualizers
) {
  const PROX = 1.5;

  function near(spotMesh) {
    return (
      Math.abs(spotMesh.position.x - player.modelMesh.position.x) < PROX &&
      Math.abs(spotMesh.position.z - player.modelMesh.position.z) < PROX
    );
  }

  function engage(key, startFn) {
    const v = visualizers[key];
    const spot = spots[key];
    if (!v.visible) {
      v.reset?.();
      v.show();
      startFn?.();
      spot.material.color.set("seagreen");
      showDescription(keyMapToDescKey(key));
      gsap.to(camera.position, { duration: 1, y: 3 });
    }
  }

  function disengage(key) {
    const v = visualizers[key];
    const spot = spots[key];
    if (v.visible) {
      v.stop?.();
      v.hide();
      spot.material.color.set("white");
      hideDescription();
      gsap.to(camera.position, { duration: 1, y: 5 });
      if (key !== "boids") {
        gsap.delayedCall(0.6, () => {
          if (!v.visible) v.reset?.();
        });
      }
    }
  }

  function keyMapToDescKey(key) {
    if (key === "bubble") return "bubbleSort";
    if (key === "insertion") return "insertionSort";
    if (key === "selection") return "selectionSort";
    if (key === "quick") return "quickSort";
    if (key === "heap") return "heapSort";
    if (key === "merge") return "mergeSort";
    if (key === "hanoi") return "hanoiTower";
    if (key === "boids") return "boids";
    return key;
  }

  function update() {
    if (!player.modelMesh) return;
    if (near(spots.bubble))
      engage("bubble", () => visualizers.bubble.startBubbleSort());
    else disengage("bubble");

    if (near(spots.insertion))
      engage("insertion", () => visualizers.insertion.startInsertionSort());
    else disengage("insertion");

    if (near(spots.selection))
      engage("selection", () => visualizers.selection.startSelectionSort());
    else disengage("selection");

    if (near(spots.quick))
      engage("quick", () => visualizers.quick.startQuickSort());
    else disengage("quick");

    if (near(spots.heap))
      engage("heap", () => visualizers.heap.startHeapSort());
    else disengage("heap");

    if (near(spots.merge))
      engage("merge", () => visualizers.merge.startMergeSort());
    else disengage("merge");

    if (near(spots.hanoi))
      engage("hanoi", () => visualizers.hanoi.startHanoiAnimation());
    else disengage("hanoi");

    if (near(spots.boids)) engage("boids", () => visualizers.boids.show());
    else disengage("boids");
  }

  return { update };
}
