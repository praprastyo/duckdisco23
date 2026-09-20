import * as THREE from 'three';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { RockDebris, createDebrisCluster, updateDebris } from './Beach3DDebris';
import { setupBeachEnvironment } from './Beach3DEnvironment';

interface ActiveObstacle {
  event: BeatmapEvent;
  mesh: THREE.Group;
  shattered: boolean;
  debris: RockDebris[];
}

export class Beach3DScene {
  private scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private clock = new THREE.Clock();

  private duckGroup!: THREE.Group;
  private starsGroup!: THREE.Group;
  private trees: THREE.Group[] = [];
  private obstacles: ActiveObstacle[] = [];

  private duckLane: 'left' | 'right' = 'left';
  private targetX = -2.2;
  private currentX = -2.2;
  private isCrashing = false;
  private crashTimer = 0;
  private cameraShake = 0;

  public init(container: HTMLElement, events: BeatmapEvent[] = []) {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;

    this.scene.background = new THREE.Color(0x60c5fa);
    this.scene.fog = new THREE.FogExp2(0x93ddff, 0.012);

    this.camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    this.camera.position.set(0, 3.8, 6.8);
    this.camera.lookAt(0, 1.2, -6);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    const env = setupBeachEnvironment(this.scene);
    this.duckGroup = env.duckGroup;
    this.starsGroup = env.starsGroup;
    this.trees = env.trees;

    this.loadEvents(events);
  }

  public loadEvents(events: BeatmapEvent[]) {
    this.obstacles.forEach((o) => this.scene.remove(o.mesh));
    this.obstacles = [];

    events.forEach((ev) => {
      const lane = ev.lane || 'right';
      const grp = new THREE.Group();
      const coco = new THREE.Mesh(new THREE.SphereGeometry(0.48, 14, 14), new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.9 }));
      coco.position.y = 0.38; // Still on sand
      grp.add(coco);

      const debris = createDebrisCluster(grp);
      grp.position.set(lane === 'left' ? -2.2 : 2.2, 0, -100);
      grp.visible = false;
      this.scene.add(grp);
      this.obstacles.push({ event: ev, mesh: grp, shattered: false, debris });
    });
  }

  public setLane(lane: 'left' | 'right') {
    this.duckLane = lane;
    this.targetX = lane === 'left' ? -2.2 : 2.2;
  }

  public resize(w: number, h: number) {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  public update(audioTime: number) {
    this.currentX += (this.targetX - this.currentX) * 0.32;
    this.duckGroup.position.x = this.currentX;
    const time = this.clock.getElapsedTime();

    if (this.isCrashing) {
      this.crashTimer -= 0.016;
      this.duckGroup.rotation.x = -0.55;
      this.duckGroup.rotation.z = Math.sin(time * 35) * 0.3;
      this.duckGroup.position.y = 0.45;
      this.starsGroup.visible = true;
      this.starsGroup.rotation.y += 0.2;
      this.cameraShake = Math.max(0, this.cameraShake - 0.02);
      if (this.crashTimer <= 0) {
        this.isCrashing = false;
        this.starsGroup.visible = false;
        this.duckGroup.rotation.x = 0;
      }
    } else {
      this.starsGroup.visible = false;
      this.duckGroup.rotation.x = 0;
      this.duckGroup.rotation.z = -(this.targetX - this.currentX) * 0.35;
      this.duckGroup.position.y = 0.6 + Math.abs(Math.sin(time * 8)) * 0.15;
    }

    if (this.cameraShake > 0) {
      this.camera.position.x = (Math.random() - 0.5) * this.cameraShake;
      this.camera.position.y = 3.8 + (Math.random() - 0.5) * this.cameraShake;
    } else {
      this.camera.position.x = 0;
      this.camera.position.y = 3.8;
    }

    this.trees.forEach((t) => {
      t.position.z += 0.25;
      if (t.position.z > 8) t.position.z = -110;
    });

    // Move obstacles mathematically tied to audioTime
    this.obstacles.forEach((obs) => {
      const z = (audioTime - obs.event.time) * 16;
      if (z < -45 || z > 12) {
        obs.mesh.visible = false;
        return;
      }
      obs.mesh.visible = true;

      if (obs.shattered) {
        updateDebris(obs.debris, 0.016);
        return;
      }

      obs.mesh.position.z = z;
      obs.mesh.rotation.x = z * 0.5;

      // Real 3D collision check at target line Z = 0
      if (z >= -0.5 && z <= 0.5 && !obs.shattered) {
        const obsLane = obs.event.lane || 'right';
        if (this.duckLane === obsLane) {
          obs.shattered = true;
          this.isCrashing = true;
          this.crashTimer = 0.6;
          this.cameraShake = 0.35;
          obs.mesh.children[0].visible = false;
          obs.debris.forEach((d) => {
            d.mesh.visible = true;
            d.mesh.position.set(0, 0.4, 0);
          });
        }
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    if (this.renderer?.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer?.dispose();
  }
}
