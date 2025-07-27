import * as THREE from "three";
import { gsap } from "gsap";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export class TextCompletion {
    constructor() {
        this.fontLoader = new FontLoader();
        this.font = null;
        this.loadFont();
    }

    async loadFont() {
        return new Promise((resolve) => {
            this.fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
                this.font = font;
                resolve();
            });
        });
    }

    async createCompleteText(group, position = { x: 0, y: 3, z: 0 }) {
        if (!this.font) {
            await this.loadFont();
        }

        const textGeometry = new TextGeometry('Complete!', {
            font: this.font,
            size: 0.3,
            height: 0.05,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelSegments: 3
        });

        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        textGeometry.translate(-textWidth / 2, 0, 0);

        const textMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const completeText = new THREE.Mesh(textGeometry, textMaterial);
        
        completeText.position.set(position.x, position.y, position.z);
        completeText.castShadow = true;
        group.add(completeText);

        gsap.fromTo(completeText.scale, 
            { x: 0, y: 0, z: 0 },
            { x: 1, y: 1, z: 1, duration: 0.8, ease: "back.out(1.7)" }
        );

        return completeText;
    }

    removeCompleteText(group, completeText) {
        if (completeText) {
            group.remove(completeText);
            return null;
        }
        return completeText;
    }
}

export const textCompletion = new TextCompletion();