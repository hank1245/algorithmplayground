import * as THREE from "three";
import { gsap } from "gsap";

export class InsertionSortVisualizer {
	constructor(info) {
		this.x = info.x;
		this.y = info.y;
		this.z = info.z;
		this.scene = info.scene;

		this.visible = false;
		this.isAnimating = false;

		// 삽입 정렬에 사용할 배열 데이터
		this.array = [6, 2, 8, 4, 1, 9, 3, 7, 5];
		this.bars = [];
		this.group = new THREE.Group();

		this.createBars();
		this.group.position.set(this.x, this.y - 1.5, this.z);
		this.scene.add(this.group);
	}

	createBars() {
		const barWidth = 0.3;
		const barSpacing = 0.4;
		const maxHeight = 2;

		this.array.forEach((value, index) => {
			const height = (value / Math.max(...this.array)) * maxHeight;
			const geometry = new THREE.BoxGeometry(barWidth, height, barWidth);
			const material = new THREE.MeshLambertMaterial({ color: 0xe74c3c });
			const bar = new THREE.Mesh(geometry, material);

			bar.position.x = (index - this.array.length / 2) * barSpacing;
			bar.position.y = height / 2;
			bar.castShadow = true;
			bar.userData = { value, originalIndex: index };

			this.bars.push(bar);
			this.group.add(bar);
		});
	}

	async startInsertionSort() {
		if (this.isAnimating) return;
		this.isAnimating = true;

		const arr = [...this.array];
		const n = arr.length;

		for (let i = 1; i < n; i++) {
			const key = arr[i];
			const keyBar = this.bars[i];
			let j = i - 1;

			// 현재 삽입할 요소 하이라이트
			keyBar.material.color.set(0xf39c12);
			await this.delay(800);

			// keyBar를 위로 올려서 다른 막대와 겹치지 않게 함
			await this.liftBar(keyBar);

			// 정렬된 부분과 비교하면서 위치 찾기
			let insertPos = i;
			while (j >= 0 && arr[j] > key) {
				// 비교할 요소 하이라이트
				this.bars[j].material.color.set(0xff6b6b);
				await this.delay(600);

				// 요소를 오른쪽으로 이동
				arr[j + 1] = arr[j];
				await this.shiftBarRight(j);

				// 색상 원래대로
				this.bars[j].material.color.set(0xe74c3c);
				insertPos = j;
				j--;
			}

			// key를 올바른 위치에 삽입
			arr[insertPos] = key;
			
			// keyBar를 올바른 위치에 배치
			await this.placeBar(keyBar, insertPos);
			this.updateBarsArray(keyBar, i, insertPos);
			
			// 정렬된 부분을 녹색으로 표시
			for (let k = 0; k <= i; k++) {
				this.bars[k].material.color.set(0x27ae60);
			}
			
			await this.delay(400);
		}

		this.isAnimating = false;
	}

	async liftBar(bar) {
		return new Promise((resolve) => {
			gsap.to(bar.position, {
				duration: 0.3,
				y: bar.position.y + 3,
				ease: "power2.out",
				onComplete: resolve
			});
		});
	}

	async shiftBarRight(index) {
		const bar = this.bars[index];
		const targetX = ((index + 1) - this.array.length / 2) * 0.4;

		return new Promise((resolve) => {
			gsap.to(bar.position, {
				duration: 0.4,
				x: targetX,
				ease: "power2.inOut",
				onComplete: resolve
			});
		});
	}

	async placeBar(bar, targetIndex) {
		const targetX = (targetIndex - this.array.length / 2) * 0.4;
		const originalHeight = bar.geometry.parameters.height;

		return new Promise((resolve) => {
			gsap.to(bar.position, {
				duration: 0.4,
				x: targetX,
				y: originalHeight / 2,
				ease: "power2.inOut",
				onComplete: resolve
			});
		});
	}

	updateBarsArray(movedBar, fromIndex, toIndex) {
		// bars 배열에서 막대의 위치 업데이트
		this.bars.splice(fromIndex, 1);
		this.bars.splice(toIndex, 0, movedBar);
	}

	delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	show() {
		this.visible = true;
		gsap.to(this.group.position, {
			duration: 1,
			y: this.y + 1.5,
			ease: "Bounce.easeOut",
		});
	}

	hide() {
		this.visible = false;
		gsap.to(this.group.position, {
			duration: 0.5,
			y: this.y - 1.5,
		});
	}
}