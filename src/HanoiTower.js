import * as THREE from "three";
import { gsap } from "gsap";
import { textCompletion } from "./TextCompletion.js";

export class HanoiTowerVisualizer {
    constructor(info) {
        this.x = info.x;
        this.y = info.y;
        this.z = info.z;
        this.scene = info.scene;
        
        this.visible = false;
        this.isAnimating = false;
        this.isPaused = false;
        
        // 하노이의 탑 설정
        this.diskCount = 4;
        this.towers = [[], [], []]; // 3개의 탑
        this.diskObjects = [];
        this.towerBases = [];
        this.towerPoles = [];
        this.moves = [];
        this.currentMoveIndex = 0;
        this.animationSpeed = 1;
        this.completeText = null;
        
        this.group = new THREE.Group();
        this.createTowers();
        this.group.position.set(this.x, this.y - 2, this.z);
        this.scene.add(this.group);
    }
    
    createTowers() {
        // 기존 객체들 제거
        this.clearTowers();
        
        // 탑 초기화
        this.towers = [[], [], []];
        this.diskObjects = [];
        
        // 탑 베이스와 기둥 생성
        for (let i = 0; i < 3; i++) {
            // 베이스
            const baseGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.15);
            const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            base.position.set((i - 1) * 2.5, 0, 0);
            base.castShadow = true;
            base.receiveShadow = true;
            this.group.add(base);
            this.towerBases.push(base);
            
            // 기둥
            const poleGeometry = new THREE.CylinderGeometry(0.06, 0.06, 2.5);
            const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
            const pole = new THREE.Mesh(poleGeometry, poleMaterial);
            pole.position.set((i - 1) * 2.5, 1.25, 0);
            pole.castShadow = true;
            this.group.add(pole);
            this.towerPoles.push(pole);
        }
        
        // 원판 생성
        const colors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 0xFFA07A, 0xDDA0DD];
        
        for (let i = 0; i < this.diskCount; i++) {
            const radius = 0.25 + (this.diskCount - i) * 0.12;
            const diskGeometry = new THREE.CylinderGeometry(radius, radius, 0.2);
            const diskMaterial = new THREE.MeshLambertMaterial({ 
                color: colors[i % colors.length]
            });
            const disk = new THREE.Mesh(diskGeometry, diskMaterial);
            
            disk.position.set(-2.5, 0.175 + i * 0.2, 0);
            disk.castShadow = true;
            disk.receiveShadow = true;
            
            this.group.add(disk);
            this.diskObjects.push(disk);
            this.towers[0].push(i);
        }
        
        // 이동 경로 계산
        this.calculateMoves();
    }
    
    clearTowers() {
        // 기존 원판들 제거
        this.diskObjects.forEach(disk => {
            this.group.remove(disk);
        });
        
        // 기존 베이스와 기둥들 제거
        this.towerBases.forEach(base => {
            this.group.remove(base);
        });
        this.towerPoles.forEach(pole => {
            this.group.remove(pole);
        });
        
        this.diskObjects = [];
        this.towerBases = [];
        this.towerPoles = [];
    }
    
    calculateMoves() {
        this.moves = [];
        this.hanoi(this.diskCount, 0, 2, 1, this.moves);
    }
    
    hanoi(n, from, to, aux, moves) {
        if (n === 1) {
            moves.push({ from, to });
            return;
        }
        this.hanoi(n - 1, from, aux, to, moves);
        moves.push({ from, to });
        this.hanoi(n - 1, aux, to, from, moves);
    }
    
    async startHanoiAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.isPaused = false;
        this.currentMoveIndex = 0;
        
        for (let i = 0; i < this.moves.length; i++) {
            if (!this.isAnimating || this.isPaused) break;
            
            const move = this.moves[i];
            await this.moveDisk(move.from, move.to);
            
            // 애니메이션 속도에 따른 대기
            await this.delay(400 / this.animationSpeed);
        }
        
        if (this.isAnimating) {
            await this.showCompleteText();
        }
        this.isAnimating = false;
    }
    
    async moveDisk(fromTower, toTower) {
        if (this.towers[fromTower].length === 0) return;
        
        const diskIndex = this.towers[fromTower].pop();
        const disk = this.diskObjects[diskIndex];
        
        const fromX = (fromTower - 1) * 2.5;
        const toX = (toTower - 1) * 2.5;
        const toY = 0.175 + this.towers[toTower].length * 0.2;
        
        // 위로 들어올리기
        await this.animatePosition(disk, fromX, 3, 0, 300 / this.animationSpeed);
        
        // 수평으로 이동
        await this.animatePosition(disk, toX, 3, 0, 400 / this.animationSpeed);
        
        // 아래로 내리기
        await this.animatePosition(disk, toX, toY, 0, 300 / this.animationSpeed);
        
        this.towers[toTower].push(diskIndex);
    }
    
    async animatePosition(object, x, y, z, duration) {
        return new Promise(resolve => {
            gsap.to(object.position, {
                duration: duration / 1000,
                x: x,
                y: y,
                z: z,
                ease: "power2.inOut",
                onComplete: resolve
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
            y: this.y + 2,
            ease: "Bounce.easeOut",
        });
    }
    
    hide() {
        this.visible = false;
        this.isAnimating = false;
        this.isPaused = false;
        this.currentMoveIndex = 0;
        this.hideCompleteText();
        
        gsap.to(this.group.position, {
            duration: 0.5,
            y: this.y - 2,
            onComplete: () => {
                // 리셋 상태로 되돌리기
                this.createTowers();
            }
        });
    }

    async showCompleteText() {
        this.completeText = await textCompletion.createCompleteText(this.group);
    }

    hideCompleteText() {
        this.completeText = textCompletion.removeCompleteText(this.group, this.completeText);
    }
}