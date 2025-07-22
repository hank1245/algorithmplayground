import { AnimationMixer, LoopRepeat } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export class Player {
  constructor(info) {
    this.moving = false;
    this.info = info;
    this.actions = [];
    this.fbxLoader = new FBXLoader();
    this.animationsLoaded = 0;
    this.totalAnimations = 2;
    this.isReady = false;

    // GLB 모델 로드
    info.gltfLoader.load(info.modelSrc, (glb) => {
      glb.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });

      this.modelMesh = glb.scene.children[0];
      this.modelMesh.position.y = 0.3;
      this.modelMesh.name = "character";
      this.modelMesh.visible = false; // 애니메이션 로드 전까지 숨김

      // 초기 회전값 설정 (정면을 바라보도록)
      // 모델에 따라 Y축 회전이 필요할 수 있습니다
      this.modelMesh.rotation.y = 0;
      this.modelMesh.rotation.x = 0;
      this.modelMesh.rotation.z = 0;

      info.scene.add(this.modelMesh);
      info.meshes.push(this.modelMesh);

      this.mixer = new AnimationMixer(this.modelMesh);

      // FBX 애니메이션들 로드
      this.loadAnimations();
    });
  }

  loadAnimations() {
    // Idle 애니메이션 로드
    this.fbxLoader.load(this.info.idleAnimationSrc, (fbx) => {
      const idleAction = this.mixer.clipAction(fbx.animations[0]);
      this.actions[0] = idleAction;
      this.animationsLoaded++;
      this.checkAllAnimationsLoaded();

      // Walk 애니메이션 로드
      this.fbxLoader.load(this.info.walkAnimationSrc, (fbx) => {
        const walkAction = this.mixer.clipAction(fbx.animations[0]);
        this.actions[1] = walkAction;
        this.animationsLoaded++;
        this.checkAllAnimationsLoaded();
      });
    });
  }

  checkAllAnimationsLoaded() {
    if (this.animationsLoaded === this.totalAnimations) {
      this.isReady = true;
      this.modelMesh.visible = true; // 모든 애니메이션 로드 후 표시

      // 애니메이션 설정
      this.actions[0].setLoop(LoopRepeat);
      this.actions[1].setLoop(LoopRepeat);

      this.currentAction = this.actions[0];
      this.currentAction.play(); // Idle 애니메이션 시작
    }
  }

  fadeToAction(name, duration = 0.3) {
    if (!this.isReady) return;

    const previousAction = this.currentAction;
    const activeAction = this.actions[name];

    if (previousAction !== activeAction) {
      previousAction.fadeOut(duration);
      activeAction.reset().fadeIn(duration).play();
      this.currentAction = activeAction;
    }
  }
}
