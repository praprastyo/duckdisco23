import * as THREE from 'three';

export class Beach3DScene {
  private scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animId: number = 0;
  private clock = new THREE.Clock();

  private duckGroup = new THREE.Group();
  private trees: THREE.Group[] = [];
  private obstacles: { mesh: THREE.Group; lane: 'left' | 'right' }[] = [];

  private targetX = -1.5;
  private currentX = -1.5;

  public init(container: HTMLElement) {
    const w = container.clientWidth;
    const h = container.clientHeight;

    this.scene.background = new THREE.Color(0x60c5fa);
    this.scene.fog = new THREE.FogExp2(0x93ddff, 0.015);

    this.camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    this.camera.position.set(0, 3.4, 6.2);
    this.camera.lookAt(0, 1.2, -6);

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

    // Ocean
    const ocean = new THREE.Mesh(new THREE.PlaneGeometry(60, 120), new THREE.MeshStandardMaterial({ color: 0x0099dd, roughness: 0.1 }));
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.set(-28, -0.1, -30);
    this.scene.add(ocean);

    // Sand Floor
    const sand = new THREE.Mesh(new THREE.PlaneGeometry(24, 120), new THREE.MeshStandardMaterial({ color: 0xf5cb5c, roughness: 0.8 }));
    sand.rotation.x = -Math.PI / 2;
    sand.position.set(0, 0, -30);
    this.scene.add(sand);

    // Target Dodge Line
    const targetLine = new THREE.Mesh(new THREE.PlaneGeometry(8, 0.4), new THREE.MeshBasicMaterial({ color: 0x00ff88 }));
    targetLine.rotation.x = -Math.PI / 2;
    targetLine.position.set(0, 0.03, 0);
    this.scene.add(targetLine);

    // Trees
    for (let i = 0; i < 7; i++) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 4), new THREE.MeshStandardMaterial({ color: 0x8b5a2b }));
      trunk.position.y = 2;
      tree.add(trunk);

      const crown = new THREE.Mesh(new THREE.ConeGeometry(2, 2.5, 7), new THREE.MeshStandardMaterial({ color: 0x228b22 }));
      crown.position.y = 4.5;
      tree.add(crown);

      tree.position.set(8.5, 0, -i * 14);
      this.scene.add(tree);
      this.trees.push(tree);
    }

    // 3D Duck
    this.duckGroup.position.set(-1.5, 0.6, 1.2);
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
    body.scale.set(0.9, 0.9, 1.1);
    this.duckGroup.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfde047 }));
    head.position.set(0, 0.7, -0.15);
    this.duckGroup.add(head);

    const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.15), new THREE.MeshStandardMaterial({ color: 0x00bfff }));
    glasses.position.set(0, 0.78, -0.5);
    this.duckGroup.add(glasses);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.35, 12), new THREE.MeshStandardMaterial({ color: 0xff6600 }));
    beak.rotation.x = -Math.PI / 2;
    beak.position.set(0, 0.65, -0.65);
    this.duckGroup.add(beak);

    this.scene.add(this.duckGroup);

    // Obstacles
    for (let i = 0; i < 3; i++) {
      const grp = new THREE.Group();
      const coco = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 12), new THREE.MeshStandardMaterial({ color: 0x5a3d28 }));
      coco.position.y = 0.45;
      grp.add(coco);
      grp.position.set(i % 2 === 0 ? -1.5 : 1.5, 0, -30 - i * 18);
      this.scene.add(grp);
      this.obstacles.push({ mesh: grp, lane: i % 2 === 0 ? 'left' : 'right' });
    }

    this.startLoop();
  }

  public setLane(lane: 'left' | 'right') {
    this.targetX = lane === 'left' ? -1.5 : 1.5;
  }

  public resize(w: number, h: number) {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private startLoop() {
    const loop = () => {
      this.animId = requestAnimationFrame(loop);
      const time = this.clock.getElapsedTime();

      this.currentX += (this.targetX - this.currentX) * 0.18;
      this.duckGroup.position.x = this.currentX;
      this.duckGroup.rotation.z = -(this.targetX - this.currentX) * 0.25;
      this.duckGroup.position.y = 0.6 + Math.abs(Math.sin(time * 8)) * 0.15;

      this.trees.forEach((t) => {
        t.position.z += 0.25;
        if (t.position.z > 8) t.position.z = -90;
      });

      this.obstacles.forEach((obs) => {
        obs.mesh.position.z += 0.32;
        obs.mesh.rotation.x += 0.08;
        if (obs.mesh.position.z > 6) {
          obs.mesh.position.z = -45;
          const nextLane: 'left' | 'right' = Math.random() > 0.5 ? 'left' : 'right';
          obs.lane = nextLane;
          obs.mesh.position.x = nextLane === 'left' ? -1.5 : 1.5;
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
