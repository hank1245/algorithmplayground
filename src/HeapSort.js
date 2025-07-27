import * as THREE from "three";
import { gsap } from "gsap";
import { textCompletion } from "./TextCompletion.js";

export class HeapSortVisualizer {
	constructor(info) {
		this.x = info.x;
		this.y = info.y;
		this.z = info.z;
		this.scene = info.scene;

		this.visible = false;
		this.isAnimating = false;
		this.shouldStop = false;

		// 힙 정렬에 사용할 배열 데이터
		this.originalArray = [3, 7, 1, 9, 4, 8, 2, 6, 5];
		this.array = [...this.originalArray];
		this.bars = [];
		this.group = new THREE.Group();
		this.completeText = null;

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
			const material = new THREE.MeshLambertMaterial({ color: 0xd35400 });
			const bar = new THREE.Mesh(geometry, material);

			bar.position.x = (index - this.array.length / 2) * barSpacing;
			bar.position.y = height / 2;
			bar.castShadow = true;
			bar.userData = { value, originalIndex: index };

			this.bars.push(bar);
			this.group.add(bar);
		});
	}

	async startHeapSort() {
		if (this.isAnimating) return;
		this.isAnimating = true;
		this.shouldStop = false;

		// 배열 초기화
		this.array = [...this.originalArray];
		this.resetColors();

		const n = this.array.length;

		// 최대 힙 구축 (Build Max Heap)
		for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
			if (this.shouldStop) break;
			await this.heapify(n, i);
		}

		// 정렬 과정
		for (let i = n - 1; i > 0; i--) {
			if (this.shouldStop) break;
			// 루트(최대값)와 마지막 요소 교환
			this.bars[0].material.color.set(0xf39c12); // 루트를 노란색으로
			this.bars[i].material.color.set(0xf39c12); // 교환할 요소를 노란색으로
			await this.delay(600);
			if (this.shouldStop) break;

			// 막대를 들어올려서 교환
			await Promise.all([
				this.liftBar(this.bars[0]),
				this.liftBar(this.bars[i])
			]);
			if (this.shouldStop) break;

			await this.swapBars(0, i);
			if (this.shouldStop) break;
			[this.array[0], this.array[i]] = [this.array[i], this.array[0]];

			// 정렬된 요소를 녹색으로 표시
			if (!this.shouldStop) {
				this.bars[i].material.color.set(0x27ae60);
			}

			// 힙 크기를 줄이고 루트에서 다시 힙화
			await this.heapify(i, 0);
			if (this.shouldStop) break;
		}

		// 첫 번째 요소도 녹색으로 (정렬 완료)
		if (!this.shouldStop) {
			this.bars[0].material.color.set(0x27ae60);
		}

		if (!this.shouldStop) {
			await this.showCompleteText();
		}
		this.isAnimating = false;
	}

	async heapify(heapSize, rootIndex) {
		let largest = rootIndex;
		const leftChild = 2 * rootIndex + 1;
		const rightChild = 2 * rootIndex + 2;

		// 현재 노드를 파란색으로 표시 (힙화 중인 노드)
		this.bars[rootIndex].material.color.set(0x3498db);
		await this.delay(400);
		if (this.shouldStop) return;

		// 왼쪽 자식과 비교
		if (leftChild < heapSize) {
			this.bars[leftChild].material.color.set(0xe74c3c); // 비교 중인 자식을 빨간색으로
			await this.delay(300);
			if (this.shouldStop) return;
			
			if (this.array[leftChild] > this.array[largest]) {
				largest = leftChild;
			}
		}

		// 오른쪽 자식과 비교
		if (rightChild < heapSize) {
			this.bars[rightChild].material.color.set(0xe74c3c); // 비교 중인 자식을 빨간색으로
			await this.delay(300);
			if (this.shouldStop) return;
			
			if (this.array[rightChild] > this.array[largest]) {
				largest = rightChild;
			}
		}

		// 교환이 필요한 경우
		if (largest !== rootIndex && !this.shouldStop) {
			// 교환할 요소들을 보라색으로 표시
			this.bars[rootIndex].material.color.set(0x9b59b6);
			this.bars[largest].material.color.set(0x9b59b6);
			await this.delay(400);
			if (this.shouldStop) return;

			// 막대를 들어올려서 교환
			await Promise.all([
				this.liftBar(this.bars[rootIndex]),
				this.liftBar(this.bars[largest])
			]);
			if (this.shouldStop) return;

			await this.swapBars(rootIndex, largest);
			if (this.shouldStop) return;
			[this.array[rootIndex], this.array[largest]] = [this.array[largest], this.array[rootIndex]];

			// 재귀적으로 힙화 (영향받은 서브트리)
			await this.heapify(heapSize, largest);
			if (this.shouldStop) return;
		}

		// 색상 원래대로 복구 (정렬된 부분 제외)
		if (!this.shouldStop) {
			for (let i = 0; i < heapSize; i++) {
				if (this.bars[i].material.color.getHex() !== 0x27ae60) {
					this.bars[i].material.color.set(0xd35400);
				}
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
			this.bars[i].material.color.set(0xd35400);
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

	stop() {
		this.shouldStop = true;
		this.isAnimating = false;
		gsap.killTweensOf(this.group.position);
		this.bars.forEach(bar => {
			gsap.killTweensOf(bar.position);
		});
	}

	reset() {
		this.stop();
		this.hideCompleteText();
		this.array = [...this.originalArray];
		
		// 모든 바 제거
		this.bars.forEach(bar => {
			this.group.remove(bar);
		});
		this.bars = [];
		
		// 새로 생성
		this.createBars();
	}

	async showCompleteText() {
		this.completeText = await textCompletion.createCompleteText(this.group);
	}

	hideCompleteText() {
		this.completeText = textCompletion.removeCompleteText(this.group, this.completeText);
	}
}