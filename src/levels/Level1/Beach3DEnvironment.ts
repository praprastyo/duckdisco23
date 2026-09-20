import * as THREE from 'three';

export function setupBeachEnvironment(scene: THREE.Scene): { duckGroup: THREE.Group; starsGroup: THREE.Group; trees: THREE.Group[] } {
  // Lights
  scene.add(new THREE.AmbientLight(0xfff5e6, 1.6));
  const sunLight = new THREE.DirectionalLight(0xfffaed, 2.5);
  sunLight.position.set(10, 20, 10);
  scene.add(sunLight);

  // Ocean
  const ocean = new THREE.Mesh(new THREE.PlaneGeometry(80, 160), new THREE.MeshStandardMaterial({ color: 0x0099dd, roughness: 0.1 }));
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.set(-36, -0.1, -30);
  scene.add(ocean);

  // Sand
  const sand = new THREE.Mesh(new THREE.PlaneGeometry(32, 160), new THREE.MeshStandardMaterial({ color: 0xf5cb5c, roughness: 0.8 }));
  sand.rotation.x = -Math.PI / 2;
  sand.position.set(0, 0, -30);
  scene.add(sand);

  // Target Line (Z = 0)
  const targetLine = new THREE.Mesh(new THREE.PlaneGeometry(10, 0.45), new THREE.MeshBasicMaterial({ color: 0x00ff88 }));
  targetLine.rotation.x = -Math.PI / 2;
  targetLine.position.set(0, 0.03, 0);
  scene.add(targetLine);

  // Trees
  const trees: THREE.Group[] = [];
  for (let i = 0; i < 9; i++) {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 4.5), new THREE.MeshStandardMaterial({ color: 0x8b5a2b }));
    trunk.position.y = 2.25;
    tree.add(trunk);
    const crown = new THREE.Mesh(new THREE.ConeGeometry(2.4, 3.2, 7), new THREE.MeshStandardMaterial({ color: 0x228b22 }));
    crown.position.y = 5.2;
    tree.add(crown);
    tree.position.set(10, 0, -i * 14);
    scene.add(tree);
    trees.push(tree);
  }

  // 3D Duck Mascot
  const duckGroup = new THREE.Group();
  duckGroup.position.set(-2.2, 0.6, 1.0);
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
  body.scale.set(0.9, 0.9, 1.1);
  duckGroup.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.44, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfde047 }));
  head.position.set(0, 0.72, -0.15);
  duckGroup.add(head);

  const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 0.15), new THREE.MeshStandardMaterial({ color: 0x00bfff }));
  glasses.position.set(0, 0.8, -0.5);
  duckGroup.add(glasses);

  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.35, 12), new THREE.MeshStandardMaterial({ color: 0xff6600 }));
  beak.rotation.x = -Math.PI / 2;
  beak.position.set(0, 0.66, -0.65);
  duckGroup.add(beak);

  const starsGroup = new THREE.Group();
  for (let s = 0; s < 3; s++) {
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), new THREE.MeshBasicMaterial({ color: 0xffea00 }));
    star.position.set(Math.cos((s * Math.PI * 2) / 3) * 0.5, 0, Math.sin((s * Math.PI * 2) / 3) * 0.5);
    starsGroup.add(star);
  }
  starsGroup.position.set(0, 1.25, -0.2);
  duckGroup.add(starsGroup);
  starsGroup.visible = false;
  scene.add(duckGroup);

  return { duckGroup, starsGroup, trees };
}
