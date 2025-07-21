import * as THREE from "three";
import { gsap } from "gsap";

export class SelectionSortVisualizer {
	constructor(info) {
		this.x = info.x;
		this.y = info.y;
		this.z = info.z;
		this.scene = info.scene;

		this.visible = false;
		this.isAnimating = false;

		// 선택 정렬에 사용할 배열 데이터
		this.array = [4, 7, 2, 9, 1, 5, 8, 3, 6];
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
			const material = new THREE.MeshLambertMaterial({ color: 0x9b59b6 });
			const bar = new THREE.Mesh(geometry, material);

			bar.position.x = (index - this.array.length / 2) * barSpacing;
			bar.position.y = height / 2;
			bar.castShadow = true;
			bar.userData = { value, originalIndex: index };

			this.bars.push(bar);
			this.group.add(bar);
		});
	}

	async startSelectionSort() {
		if (this.isAnimating) return;
		this.isAnimating = true;

		const arr = [...this.array];
		const n = arr.length;

		for (let i = 0; i < n - 1; i++) {
			let minIndex = i;
			
			// 현재 위치 하이라이트 (시작점)
			this.bars[i].material.color.set(0x3498db);
			
			// 최소값을 찾기 위해 나머지 요소들 확인
			for (let j = i + 1; j < n; j++) {
				// 비교할 요소 하이라이트
				this.bars[j].material.color.set(0xf39c12);
				await this.delay(400);
				
				if (arr[j] < arr[minIndex]) {
					// 이전 최소값 색상 원래대로
					if (minIndex !== i) {
						this.bars[minIndex].material.color.set(0x9b59b6);
					}
					minIndex = j;
					// 새로운 최소값을 빨간색으로 표시
					this.bars[minIndex].material.color.set(0xe74c3c);
				} else {
					// 비교 후 색상 원래대로
					this.bars[j].material.color.set(0x9b59b6);
				}
				
				await this.delay(200);
			}

			// 최소값을 찾았다면 교환
			if (minIndex !== i) {
				// 교환할 두 막대를 위로 들어올림
				await Promise.all([
					this.liftBar(this.bars[i]),
					this.liftBar(this.bars[minIndex])
				]);
				
				// 교환 애니메이션
				await this.swapBars(i, minIndex);
				
				// 배열에서도 교환
				[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
			}

			// 정렬된 요소를 녹색으로 표시
			this.bars[i].material.color.set(0x27ae60);
			
			await this.delay(600);
		}

		// 마지막 요소도 녹색으로
		this.bars[n - 1].material.color.set(0x27ae60);
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

	async swapBars(index1, index2) {
		const bar1 = this.bars[index1];
		const bar2 = this.bars[index2];
		
		const pos1 = bar1.position.x;
		const pos2 = bar2.position.x;
		const originalHeight1 = bar1.geometry.parameters.height;
		const originalHeight2 = bar2.geometry.parameters.height;

		return new Promise((resolve) => {
			gsap.to(bar1.position, {
				duration: 0.5,
				x: pos2,
				y: originalHeight1 / 2,
				ease: "power2.inOut",
			});

			gsap.to(bar2.position, {
				duration: 0.5,
				x: pos1,
				y: originalHeight2 / 2,
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