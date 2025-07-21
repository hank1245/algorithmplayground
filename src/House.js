import * as THREE from "three";
import { gsap } from "gsap";

export class BubbleSortVisualizer {
	constructor(info) {
		this.x = info.x;
		this.y = info.y;
		this.z = info.z;
		this.scene = info.scene;

		this.visible = false;
		this.isAnimating = false;

		// 버블 정렬에 사용할 배열 데이터
		this.array = [8, 3, 7, 1, 9, 2, 6, 4, 5];
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
			const material = new THREE.MeshLambertMaterial({ color: 0x4a90e2 });
			const bar = new THREE.Mesh(geometry, material);

			bar.position.x = (index - this.array.length / 2) * barSpacing;
			bar.position.y = height / 2;
			bar.castShadow = true;
			bar.userData = { value, originalIndex: index };

			this.bars.push(bar);
			this.group.add(bar);
		});
	}

	async startBubbleSort() {
		if (this.isAnimating) return;
		this.isAnimating = true;

		const arr = [...this.array];
		const n = arr.length;

		for (let i = 0; i < n - 1; i++) {
			for (let j = 0; j < n - i - 1; j++) {
				// 비교할 두 막대 하이라이트
				this.bars[j].material.color.set(0xff6b6b);
				this.bars[j + 1].material.color.set(0xff6b6b);

				await this.delay(800);

				if (arr[j] > arr[j + 1]) {
					// 교환 애니메이션
					await this.swapBars(j, j + 1);
					
					// 배열에서도 교환
					[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
				}

				// 색상 원래대로
				this.bars[j].material.color.set(0x4a90e2);
				this.bars[j + 1].material.color.set(0x4a90e2);
			}
			// 정렬된 요소를 녹색으로 표시
			this.bars[n - 1 - i].material.color.set(0x51cf66);
		}

		// 첫 번째 요소도 녹색으로
		this.bars[0].material.color.set(0x51cf66);
		this.isAnimating = false;
	}

	async swapBars(index1, index2) {
		const bar1 = this.bars[index1];
		const bar2 = this.bars[index2];
		
		const pos1 = bar1.position.x;
		const pos2 = bar2.position.x;

		return new Promise((resolve) => {
			gsap.to(bar1.position, {
				duration: 0.5,
				x: pos2,
				ease: "power2.inOut",
			});

			gsap.to(bar2.position, {
				duration: 0.5,
				x: pos1,
				ease: "power2.inOut",
				onComplete: () => {
					// 배열에서 위치 교환
					[this.bars[index1], this.bars[index2]] = [this.bars[index2], this.bars[index1]];
					resolve();
				}
			});
		});
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
