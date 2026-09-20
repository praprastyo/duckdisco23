import * as THREE from 'three';

export class Beach3DScene {
  private scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animId: number = 0;
  private clock = new THREE.Clock();

  private duckGroup = new THREE.Group();
  private starsGroup = new THREE.Group();
  private trees: THREE.Group[] = [];
  private obstacles: { mesh: THREE.Group; lane: 'left' | 'right' }[] = [];

  private targetX = -2.5;
  private currentX = -2.5;

  private isStumbling = false;
  private stumbleTime = 0;

  private patternIndex = 0;
  // Predictable, learnable rhythmic beach lane pattern
  private readonly lanePattern: ('left' | 'right')[] = [
    'right', 'left', 'right', 'left',
    'left', 'right', 'left', 'right',
    'right', 'right', 'left', 'left',
    'right', 'left', 'right', 'left',
  ];

  public triggerCollision() {
    this.isStumbling = true;
    this.stumbleTime = 0.55;
  }

  public init(container: HTMLElement) {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;


    this.scene.background = new THREE.Color(0x60c5fa);
    this.scene.fog = new THREE.FogExp2(0x93ddff, 0.015);

    this.camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    this.camera.position.set(0, 3.8, 6.8);
    this.camera.lookAt(0, 1.3, -6);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Lights
    this.scene.add(new THREE.AmbientLight(0xfff5e6, 1.5));
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.4);
    sunLight.position.set(10, 20, 10);
    this.scene.add(sunLight);

    // Distant Sun
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(6, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffea00 }));
    sunMesh.position.set(15, 18, -80);
    this.scene.add(sunMesh);

    // Ocean on left
    const ocean = new THREE.Mesh(new THREE.PlaneGeometry(80, 140), new THREE.MeshStandardMaterial({ color: 0x0099dd, roughness: 0.1 }));
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.set(-36, -0.1, -30);
    this.scene.add(ocean);

    // Sand Floor
    const sand = new THREE.Mesh(new THREE.PlaneGeometry(30, 140), new THREE.MeshStandardMaterial({ color: 0xf5cb5c, roughness: 0.8 }));
    sand.rotation.x = -Math.PI / 2;
    sand.position.set(0, 0, -30);
    this.scene.add(sand);

    // Target Dodge Line
    const targetLine = new THREE.Mesh(new THREE.PlaneGeometry(12, 0.5), new THREE.MeshBasicMaterial({ color: 0x00ff88 }));
    targetLine.rotation.x = -Math.PI / 2;
    targetLine.position.set(0, 0.03, 0);
    this.scene.add(targetLine);

    // Trees on right edge
    for (let i = 0; i < 8; i++) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 4.5), new THREE.MeshStandardMaterial({ color: 0x8b5a2b }));
      trunk.position.y = 2.25;
      tree.add(trunk);

      const crown = new THREE.Mesh(new THREE.ConeGeometry(2.2, 3, 7), new THREE.MeshStandardMaterial({ color: 0x228b22 }));
      crown.position.y = 5;
      tree.add(crown);

      tree.position.set(9.5, 0, -i * 14);
      this.scene.add(tree);
      this.trees.push(tree);
    }

    // 3D Duck
    this.duckGroup.position.set(-2.5, 0.6, 1.2);
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
    body.scale.set(0.9, 0.9, 1.1);
    this.duckGroup.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.44, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfde047 }));
    head.position.set(0, 0.72, -0.15);
    this.duckGroup.add(head);

    const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 0.15), new THREE.MeshStandardMaterial({ color: 0x00bfff }));
    glasses.position.set(0, 0.8, -0.5);
    this.duckGroup.add(glasses);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.35, 12), new THREE.MeshStandardMaterial({ color: 0xff6600 }));
    beak.rotation.x = -Math.PI / 2;
    beak.position.set(0, 0.66, -0.65);
    this.duckGroup.add(beak);

    // Dizzy Stars on Collision
    for (let s = 0; s < 3; s++) {
      const star = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.12),
        new THREE.MeshBasicMaterial({ color: 0xffea00 })
      );
      star.position.set(Math.cos((s * Math.PI * 2) / 3) * 0.45, 0, Math.sin((s * Math.PI * 2) / 3) * 0.45);
      this.starsGroup.add(star);
    }
    this.starsGroup.position.set(0, 1.25, -0.2);
    this.duckGroup.add(this.starsGroup);
    this.starsGroup.visible = false;

    this.scene.add(this.duckGroup);

    // Obstacles - Still on the sand floor (Y = 0.38)
    for (let i = 0; i < 3; i++) {
      const grp = new THREE.Group();
      const coco = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 14), new THREE.MeshStandardMaterial({ color: 0x5a3d28 }));
      coco.position.y = 0.38;
      grp.add(coco);
      const lane = this.lanePattern[i % this.lanePattern.length];
      grp.position.set(lane === 'left' ? -2.5 : 2.5, 0, -28 - i * 18);
      this.scene.add(grp);
      this.obstacles.push({ mesh: grp, lane });
    }

    this.startLoop();
  }

  public setLane(lane: 'left' | 'right') {
    this.targetX = lane === 'left' ? -2.5 : 2.5;
  }

  public resize(w: number, h: number) {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private startLoop() {
    let lastTime = performance.now();

    const loop = () => {
      this.animId = requestAnimationFrame(loop);
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      const time = this.clock.getElapsedTime();

      // Smooth lane interpolation
      this.currentX += (this.targetX - this.currentX) * 0.28;
      this.duckGroup.position.x = this.currentX;

      // Stumble Collision Animation or Normal Run
      if (this.isStumbling) {
        this.stumbleTime -= delta;
        this.duckGroup.rotation.x = -0.45; // Lean back in shock
        this.duckGroup.rotation.z = Math.sin(time * 35) * 0.25; // Shake
        this.duckGroup.position.y = 0.45;
        this.starsGroup.visible = true;
        this.starsGroup.rotation.y += 0.2; // Stars spin around head
        if (this.stumbleTime <= 0) {
          this.isStumbling = false;
          this.starsGroup.visible = false;
          this.duckGroup.rotation.x = 0;
        }
      } else {
        this.starsGroup.visible = false;
        this.duckGroup.rotation.x = 0;
        this.duckGroup.rotation.z = -(this.targetX - this.currentX) * 0.35;
        this.duckGroup.position.y = 0.6 + Math.abs(Math.sin(time * 8)) * 0.15;
      }

      // Scroll background trees
      this.trees.forEach((t) => {
        t.position.z += 0.25;
        if (t.position.z > 8) t.position.z = -90;
      });

      // Move obstacles strictly on the sand (still, no bobbing!)
      this.obstacles.forEach((obs) => {
        obs.mesh.position.z += 0.35;
        obs.mesh.rotation.x += 0.08; // Rolling motion on sand
        if (obs.mesh.position.z > 6) {
          obs.mesh.position.z = -45;
          // Deterministic rhythmic pattern
          const nextLane = this.lanePattern[this.patternIndex % this.lanePattern.length];
          this.patternIndex++;
          obs.lane = nextLane;
          obs.mesh.position.x = nextLane === 'left' ? -2.5 : 2.5;
        }
      });

      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }


  public dispose() {
    cancelAnimationFrame(this.animId);
    if (this.renderer?.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer?.dispose();
  }
}
