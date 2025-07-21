import * as THREE from "three";
import { gsap } from "gsap";

export class QuickSortVisualizer {
	constructor(info) {
		this.x = info.x;
		this.y = info.y;
		this.z = info.z;
		this.scene = info.scene;

		this.visible = false;
		this.isAnimating = false;

		// 퀵 정렬에 사용할 배열 데이터
		this.array = [7, 2, 9, 1, 8, 3, 6, 4, 5];
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
			const material = new THREE.MeshLambertMaterial({ color: 0x16a085 });
			const bar = new THREE.Mesh(geometry, material);

			bar.position.x = (index - this.array.length / 2) * barSpacing;
			bar.position.y = height / 2;
			bar.castShadow = true;
			bar.userData = { value, originalIndex: index };

			this.bars.push(bar);
			this.group.add(bar);
		});
	}

	async startQuickSort() {
		if (this.isAnimating) return;
		this.isAnimating = true;

		// 배열 초기화
		this.array = [7, 2, 9, 1, 8, 3, 6, 4, 5];
		this.resetColors();

		await this.quickSort(0, this.array.length - 1);

		// 모든 막대를 녹색으로 표시
		for (let i = 0; i < this.bars.length; i++) {
			this.bars[i].material.color.set(0x27ae60);
		}

		this.isAnimating = false;
	}

	async quickSort(low, high) {
		if (low < high) {
			// 파티션 범위 표시
			this.highlightRange(low, high, 0x3498db);
			await this.delay(600);

			// 피벗을 노란색으로 강조
			this.bars[high].material.color.set(0xf1c40f);
			await this.delay(400);

			const pivotIndex = await this.partition(low, high);

			// 피벗을 올바른 위치에 배치했으므로 녹색으로 표시
			this.bars[pivotIndex].material.color.set(0x27ae60);
			await this.delay(400);

			// 범위 색상 원래대로
			this.resetRangeColors(low, high, pivotIndex);

			// 재귀적으로 정렬
			await this.quickSort(low, pivotIndex - 1);
			await this.quickSort(pivotIndex + 1, high);
		} else if (low === high) {
			// 단일 요소는 이미 정렬된 것으로 표시
			this.bars[low].material.color.set(0x27ae60);
		}
	}

	async partition(low, high) {
		const pivot = this.array[high];
		let i = low - 1;

		for (let j = low; j < high; j++) {
			// 현재 비교 중인 요소 하이라이트
			this.bars[j].material.color.set(0xe74c3c);
			await this.delay(400);

			if (this.array[j] < pivot) {
				i++;
				
				// 교환이 필요한 경우
				if (i !== j) {
					// 교환할 요소들을 보라색으로 표시
					this.bars[i].material.color.set(0x9b59b6);
					this.bars[j].material.color.set(0x9b59b6);
					await this.delay(200);

					// 막대를 들어올려서 교환
					await Promise.all([
						this.liftBar(this.bars[i]),
						this.liftBar(this.bars[j])
					]);

					await this.swapBars(i, j);
					
					// 배열에서도 교환
					[this.array[i], this.array[j]] = [this.array[j], this.array[i]];
				}
			}

			// 색상 리셋
			this.bars[j].material.color.set(0x3498db);
			if (i >= 0 && i !== j) {
				this.bars[i].material.color.set(0x3498db);
			}
		}

		// 피벗과 i+1 위치 교환
		i++;
		if (i !== high) {
			this.bars[i].material.color.set(0x9b59b6);
			this.bars[high].material.color.set(0x9b59b6);
			await this.delay(200);

			await Promise.all([
				this.liftBar(this.bars[i]),
				this.liftBar(this.bars[high])
			]);

			await this.swapBars(i, high);
			
			// 배열에서도 교환
			[this.array[i], this.array[high]] = [this.array[high], this.array[i]];
		}

		return i;
	}

	highlightRange(low, high, color) {
		for (let i = low; i <= high; i++) {
			if (this.bars[i].material.color.getHex() !== 0x27ae60) {
				this.bars[i].material.color.set(color);
			}
		}
	}

	resetRangeColors(low, high, pivotIndex) {
		for (let i = low; i <= high; i++) {
			if (i !== pivotIndex && this.bars[i].material.color.getHex() !== 0x27ae60) {
				this.bars[i].material.color.set(0x16a085);
			}
		}
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

	resetColors() {
		for (let i = 0; i < this.bars.length; i++) {
			this.bars[i].material.color.set(0x16a085);
		}
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