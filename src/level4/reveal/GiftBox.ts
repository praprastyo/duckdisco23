import * as THREE from 'three';
import { GiftDimensions, GiftTexturesConfig } from '../types/level4Types';

export interface GiftBoxModel {
  rootGroup: THREE.Group;
  lidGroup: THREE.Group;
  envelopeMesh: THREE.Mesh;
  silhouetteMesh: THREE.Mesh;
  setOpenProgress: (progress: number) => void;
  setMode: (mode: 'closed' | 'silhouette' | 'revealed') => void;
  setTremor: (intensity: number) => void;
}

function createFallbackTexture(label: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 512);

  // Decorative diagonal gold stripes
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 14;
  for (let i = -512; i < 1024; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 512, 512);
    ctx.stroke();
  }

  // Golden Ribbon across center
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(226, 0, 60, 512);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(250, 0, 12, 512);

  // Center Duck Emblem
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(256, 256, 75, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🦆', 256, 240);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px monospace';
  ctx.fillText(label.toUpperCase(), 256, 285);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function enhanceTextureContrast(image: HTMLImageElement): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth || image.width || 1024;
  canvas.height = image.naturalHeight || image.height || 1024;
  const ctx = canvas.getContext('2d')!;

  // Boost contrast (+32%) and saturation (+22%) to eliminate faded appearance
  ctx.filter = 'contrast(1.32) saturate(1.22) brightness(1.02)';
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function loadFaceTexture(url: string, label: string, fallbackColor: string): THREE.Material {
  const textureLoader = new THREE.TextureLoader();
  const fallback = createFallbackTexture(label, fallbackColor);

  const mat = new THREE.MeshStandardMaterial({
    map: fallback,
    roughness: 0.6,
    metalness: 0.0, // Non-metallic prevents milky white specular washout
  });

  const extensions = ['.jpeg', '.jpg', '.png'];
  const baseName = url.replace(/\.(jpeg|jpg|png)$/i, '');
  const candidateUrls = [url, ...extensions.map((ext) => `${baseName}${ext}`)].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  let triedIndex = 0;
  const tryNext = () => {
    if (triedIndex >= candidateUrls.length) return;
    const currentUrl = candidateUrls[triedIndex++];
    textureLoader.load(
      currentUrl,
      (loadedTex) => {
        if (loadedTex.image && loadedTex.image instanceof HTMLImageElement) {
          try {
            const enhanced = enhanceTextureContrast(loadedTex.image);
            mat.map = enhanced;
          } catch {
            loadedTex.colorSpace = THREE.SRGBColorSpace;
            mat.map = loadedTex;
          }
        } else {
          loadedTex.colorSpace = THREE.SRGBColorSpace;
          mat.map = loadedTex;
        }
        mat.needsUpdate = true;
      },
      undefined,
      () => {
        tryNext();
      }
    );
  };

  tryNext();
  return mat;
}

export function createGiftBoxMesh(
  dims: GiftDimensions,
  textures: GiftTexturesConfig
): GiftBoxModel {
  const rootGroup = new THREE.Group();

  // Box face order in Three.js BoxGeometry: [right (+X), left (-X), top (+Y), bottom (-Y), front (+Z), back (-Z)]
  const rightMat = loadFaceTexture(textures.right, 'Right', '#7c2d12');
  const leftMat = loadFaceTexture(textures.left, 'Left', '#7c2d12');
  const topMat = loadFaceTexture(textures.top, 'Top', '#991b1b');
  const bottomMat = loadFaceTexture(textures.bottom, 'Bottom', '#451a03');
  const frontMat = loadFaceTexture(textures.front, 'Front', '#9a3412');
  const backMat = loadFaceTexture(textures.back, 'Back', '#9a3412');

  const baseHeight = dims.height * 0.88;
  const baseGeo = new THREE.BoxGeometry(dims.width, baseHeight, dims.depth);
  const baseMesh = new THREE.Mesh(baseGeo, [
    rightMat,
    leftMat,
    topMat,
    bottomMat,
    frontMat,
    backMat,
  ]);
  baseMesh.position.y = baseHeight / 2;
  rootGroup.add(baseMesh);

  // Hinged Top Lid (clean surface to showcase top.jpeg)
  const lidGroup = new THREE.Group();
  const lidHeight = dims.height * 0.14;
  const lidWidth = dims.width * 1.02;
  const lidDepth = dims.depth * 1.02;

  const lidGeo = new THREE.BoxGeometry(lidWidth, lidHeight, lidDepth);
  const lidMesh = new THREE.Mesh(lidGeo, [
    rightMat,
    leftMat,
    topMat,
    bottomMat,
    frontMat,
    backMat,
  ]);
  lidMesh.position.set(0, lidHeight / 2, lidDepth / 2);
  lidGroup.position.set(0, baseHeight, -dims.depth / 2);
  lidGroup.add(lidMesh);
  rootGroup.add(lidGroup);

  // Interior Golden Bloom Light
  const interiorLight = new THREE.PointLight(0xfef08a, 0, 8);
  interiorLight.position.set(0, baseHeight * 0.7, 0);
  rootGroup.add(interiorLight);

  // 1. Mysterious Dark Silhouette Mesh (Unlit pure dark shape floating during mystery phase)
  const silGeo = new THREE.PlaneGeometry(1.2, 0.85);
  const silMat = new THREE.MeshBasicMaterial({
    color: 0x07050d,
    side: THREE.DoubleSide,
  });
  const silhouetteMesh = new THREE.Mesh(silGeo, silMat);
  silhouetteMesh.position.set(0, baseHeight * 0.45, 0);
  silhouetteMesh.rotation.x = -Math.PI / 8;
  silhouetteMesh.visible = false;
  rootGroup.add(silhouetteMesh);

  // 2. Closed Letter Envelope with Wax Seal (Only revealed after the final flash)
  const envGeo = new THREE.PlaneGeometry(1.2, 0.85);
  const envMat = new THREE.MeshStandardMaterial({
    color: 0xfffbeb,
    emissive: 0xfef08a,
    emissiveIntensity: 0.25,
    side: THREE.DoubleSide,
    roughness: 0.35,
  });
  const envelopeMesh = new THREE.Mesh(envGeo, envMat);
  envelopeMesh.position.set(0, baseHeight * 0.45, 0);
  envelopeMesh.rotation.x = -Math.PI / 8;
  envelopeMesh.visible = false;

  // Add decorative red wax seal emblem to envelope
  const sealGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 16);
  const sealMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    roughness: 0.2,
    metalness: 0.1,
  });
  const sealMesh = new THREE.Mesh(sealGeo, sealMat);
  sealMesh.rotation.x = Math.PI / 2;
  sealMesh.position.set(0, 0, 0.02);
  envelopeMesh.add(sealMesh);

  rootGroup.add(envelopeMesh);

  const setMode = (mode: 'closed' | 'silhouette' | 'revealed') => {
    if (mode === 'closed') {
      silhouetteMesh.visible = false;
      envelopeMesh.visible = false;
    } else if (mode === 'silhouette') {
      silhouetteMesh.visible = true;
      envelopeMesh.visible = false;
    } else if (mode === 'revealed') {
      silhouetteMesh.visible = false;
      envelopeMesh.visible = true;
    }
  };

  const setOpenProgress = (p: number) => {
    const clamped = Math.max(0, Math.min(1, p));
    lidGroup.rotation.x = -clamped * (Math.PI * 0.65);
    interiorLight.intensity = clamped * 5.0;

    const targetY = baseHeight * 0.45 + clamped * (baseHeight * 1.15);
    silhouetteMesh.position.y = targetY;
    silhouetteMesh.rotation.y = clamped * Math.PI * 0.15;

    envelopeMesh.position.y = targetY;
    envelopeMesh.rotation.y = clamped * Math.PI * 0.08;
    envelopeMesh.scale.setScalar(1 + clamped * 0.25);
  };

  const setTremor = (magnitude: number) => {
    rootGroup.position.x = (Math.random() - 0.5) * magnitude;
    rootGroup.position.y = baseHeight / 2 + (Math.random() - 0.5) * (magnitude * 0.5);
    rootGroup.rotation.z = (Math.random() - 0.5) * (magnitude * 0.6);
  };

  setOpenProgress(0);
  setMode('closed');

  return {
    rootGroup,
    lidGroup,
    envelopeMesh,
    silhouetteMesh,
    setOpenProgress,
    setMode,
    setTremor,
  };
}
