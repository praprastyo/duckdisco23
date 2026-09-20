import * as THREE from 'three';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { RockDebris, createDebrisCluster, updateDebris } from './Beach3DDebris';
import { setupBeachEnvironment } from './Beach3DEnvironment';

interface ActiveObstacle {
  event: BeatmapEvent;
  mesh: THREE.Group;
  shattered: boolean;
  debris: RockDebris[];
  laneIndices: number[];
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

  private readonly laneCoords = [-2.6, 0.0, 2.6];
  private duckLaneIndex = 1;
  private targetX = 0.0;
  private currentX = 0.0;
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
      const type = ev.obstacleType || 'ball';
      const laneIdx = ev.lane === 'left' ? 0 : ev.lane === 'right' ? 2 : 1;
      let laneIndices = [laneIdx];
      const grp = new THREE.Group();

      if (type === 'wave') {
        const safeIdx = laneIdx === 0 ? 0 : 2;
        laneIndices = safeIdx === 0 ? [1, 2] : [0, 1];
        const wave = new THREE.Mesh(
          new THREE.BoxGeometry(4.8, 0.9, 1.2),
          new THREE.MeshStandardMaterial({ color: 0x00bfff, transparent: true, opacity: 0.85 })
        );
        wave.position.set(safeIdx === 0 ? 1.3 : -1.3, 0.45, 0);
        grp.add(wave);
      } else if (type === 'crab') {
        const crab = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.5), new THREE.MeshStandardMaterial({ color: 0xf43f5e }));
        crab.position.y = 0.2;
        grp.add(crab);
      } else if (type === 'bucket') {
        const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.6, 12), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
        bucket.position.y = 0.3;
        grp.add(bucket);
      } else {
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.48, 14, 14), new THREE.MeshStandardMaterial({ color: 0xff3366 }));
        ball.position.y = 0.42;
        grp.add(ball);
      }

      const debris = createDebrisCluster(grp);
      grp.position.set(type === 'wave' ? 0 : this.laneCoords[laneIdx], 0, -100);
      grp.visible = false;
      this.scene.add(grp);
      this.obstacles.push({ event: ev, mesh: grp, shattered: false, debris, laneIndices });
    });
  }

  public moveLeft() {
    this.duckLaneIndex = Math.max(0, this.duckLaneIndex - 1);
    this.targetX = this.laneCoords[this.duckLaneIndex];
    return this.duckLaneIndex;
  }


  public moveRight() {
    this.duckLaneIndex = Math.min(2, this.duckLaneIndex + 1);
    this.targetX = this.laneCoords[this.duckLaneIndex];
    return this.duckLaneIndex;
  }

  public getLaneIndex() { return this.duckLaneIndex; }

  public resize(w: number, h: number) {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  public update(audioTime: number) {
    this.currentX += (this.targetX - this.currentX) * 0.35;
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
      this.duckGroup.position.y = 0.6 + Math.abs(Math.sin(time * 6)) * 0.14;
    }

    if (this.cameraShake > 0) {
      this.camera.position.x = (Math.random() - 0.5) * this.cameraShake;
      this.camera.position.y = 3.8 + (Math.random() - 0.5) * this.cameraShake;
    } else {
      this.camera.position.x = 0;
      this.camera.position.y = 3.8;
    }

    this.trees.forEach((t) => {
      t.position.z += 0.22;
      if (t.position.z > 8) t.position.z = -110;
    });

    this.obstacles.forEach((obs) => {
      const z = (audioTime - obs.event.time) * 12;
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
      if (obs.event.obstacleType !== 'wave') obs.mesh.rotation.x = z * 0.5;

      if (z >= -0.5 && z <= 0.5 && !obs.shattered) {
        if (obs.laneIndices.includes(this.duckLaneIndex)) {
          obs.shattered = true;
          this.isCrashing = true;
          this.crashTimer = 0.65;
          this.cameraShake = 0.4;
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

