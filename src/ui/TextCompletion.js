import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

class TextCompletionHelper {
  constructor() {
    this.font = null;
    this.loader = new FontLoader();
  }

  async loadFont() {
    if (this.font) return this.font;
    return new Promise((resolve, reject) => {
      this.loader.load(
        "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
        (font) => {
          this.font = font;
          resolve(font);
        },
        undefined,
        (err) => reject(err)
      );
    });
  }

  async createCompleteText(parentGroup) {
    try {
      const font = await this.loadFont();
      const geometry = new TextGeometry("Complete!", {
        font,
        size: 0.6,
        height: 0.05,
      });
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(-1.4, 2.0, 0);
      parentGroup.add(mesh);
      return mesh;
    } catch (e) {
      return null;
    }
  }

  removeCompleteText(parentGroup, mesh) {
    if (mesh && parentGroup) {
      parentGroup.remove(mesh);
    }
    return null;
  }
}

export const textCompletion = new TextCompletionHelper();
