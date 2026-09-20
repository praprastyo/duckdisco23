import * as THREE from 'three';

export interface RockDebris {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
}

export function createDebrisCluster(parent: THREE.Group): RockDebris[] {
  const debris: RockDebris[] = [];
  const mat = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.9 });

  for (let i = 0; i < 5; i++) {
    const frag = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), mat);
    frag.visible = false;
    parent.add(frag);
    debris.push({
      mesh: frag,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 5 + 2,
      vz: Math.random() * 4 - 2,
    });
  }
  return debris;
}

export function updateDebris(debris: RockDebris[], dt: number) {
  debris.forEach((d) => {
    d.mesh.position.x += d.vx * dt;
    d.mesh.position.y += d.vy * dt;
    d.mesh.position.z += d.vz * dt;
    d.vy -= 9.8 * dt; // gravity
  });
}
