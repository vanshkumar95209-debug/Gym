import * as THREE from 'three';

export type MuscleTargetId =
  | 'chest'
  | 'back'
  | 'arm_upper'
  | 'arm_back'
  | 'shoulder'
  | 'thigh'
  | 'glute'
  | 'calf'
  | 'core';

export type PropType =
  | 'floor'
  | 'bench_flat'
  | 'bench_incline'
  | 'bench_decline'
  | 'pullup_bar'
  | 'dip_bars'
  | 'cable_high'
  | 'cable_low'
  | 'wall'
  | 'elevated_step'
  | 'leg_machine';

export type WeightType = 'barbell' | 'dumbbell' | 'cable_handle' | 'none';

export type Vec3 = [number, number, number];

export interface Pose3D {
  rootPos: Vec3;
  rootRot: Vec3;
  spineRot: Vec3;
  headRot: Vec3;
  shoulderL: Vec3;
  shoulderR: Vec3;
  elbowL: Vec3;
  elbowR: Vec3;
  hipL: Vec3;
  hipR: Vec3;
  kneeL: Vec3;
  kneeR: Vec3;
  ankleL?: Vec3;
  ankleR?: Vec3;
}

export interface AthleteRig {
  root: THREE.Group;
  pelvisPivot: THREE.Group;
  spinePivot: THREE.Group;
  neckPivot: THREE.Group;
  shoulderPivotL: THREE.Group;
  shoulderPivotR: THREE.Group;
  elbowPivotL: THREE.Group;
  elbowPivotR: THREE.Group;
  handAnchorL: THREE.Object3D;
  handAnchorR: THREE.Object3D;
  hipPivotL: THREE.Group;
  hipPivotR: THREE.Group;
  kneePivotL: THREE.Group;
  kneePivotR: THREE.Group;
  anklePivotL: THREE.Group;
  anklePivotR: THREE.Group;
  dumbbellL: THREE.Group;
  dumbbellR: THREE.Group;
  cableHandleL: THREE.Group;
  cableHandleR: THREE.Group;
  barbellGroup: THREE.Group;
  cableLineL: THREE.Line;
  cableLineR: THREE.Line;
  propsMap: Record<PropType, THREE.Group>;
  muscleGroups: Record<MuscleTargetId, THREE.MeshStandardMaterial[]>;
  applyPose: (
    poseA: Pose3D,
    poseB: Pose3D,
    t: number,
    weightType: WeightType,
    propType: PropType,
    highlightTarget: MuscleTargetId,
    accentHex: number,
    tension01: number,
    breathCycle?: number
  ) => void;
  dispose: () => void;
}

// Reusable math helpers (zero GC inside per-frame loop)
const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _mid = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _xAxis = new THREE.Vector3(1, 0, 0);
const _quat = new THREE.Quaternion();
const _accentColor = new THREE.Color();
const _baseEmissive = new THREE.Color(0x000000);

function createLatheLimb(
  profile: Array<[number, number]>,
  segments = 20
): THREE.LatheGeometry {
  const pts = profile.map(([r, y]) => new THREE.Vector2(r, y));
  const geo = new THREE.LatheGeometry(pts, segments);
  geo.computeVertexNormals();
  return geo;
}

function createGymFloorTexture(maxAniso: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(256, 256, 24, 256, 256, 256);
  grad.addColorStop(0, '#1e293b');
  grad.addColorStop(0.65, '#0f172a');
  grad.addColorStop(1, '#070b14');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle interlocking rubber mat grid
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.07)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 512; i += 48) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  // Center lifting zone rings
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(256, 256, 175, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(256, 256, 120, 0, Math.PI * 2);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, maxAniso || 1);
  return tex;
}

function createSingletTexture(maxAniso: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Dark charcoal tech-fabric base with subtle weave
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#162033';
  for (let y = 0; y < 256; y += 6) {
    ctx.fillRect(0, y, 256, 2);
  }

  // Subtle amber side-seam stripes & FitBro crest bar
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(60, 0, 6, 256);
  ctx.fillRect(190, 0, 6, 256);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FITBRO', 128, 112);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, maxAniso || 1);
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 14, 128, 128, 124);
  grad.addColorStop(0, 'rgba(2, 6, 23, 0.7)');
  grad.addColorStop(0.55, 'rgba(2, 6, 23, 0.28)');
  grad.addColorStop(1, 'rgba(2, 6, 23, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createDumbbellMesh(
  chromeMat: THREE.Material,
  plateMat: THREE.Material,
  accentMat: THREE.Material
): THREE.Group {
  const grp = new THREE.Group();
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.16, 16), chromeMat);
  handle.rotation.z = Math.PI / 2;
  grp.add(handle);

  // Hex-style weight heads
  const plateGeo = new THREE.CylinderGeometry(0.068, 0.068, 0.036, 6);
  const collarGeo = new THREE.CylinderGeometry(0.044, 0.044, 0.04, 16);

  [-0.084, 0.084].forEach((xPos) => {
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.rotation.z = Math.PI / 2;
    plate.position.x = xPos;
    plate.castShadow = true;
    grp.add(plate);

    const ring = new THREE.Mesh(collarGeo, accentMat);
    ring.rotation.z = Math.PI / 2;
    ring.position.x = xPos;
    grp.add(ring);
  });
  return grp;
}

function createCableHandle(chromeMat: THREE.Material, gripMat: THREE.Material): THREE.Group {
  const grp = new THREE.Group();
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.13, 14), gripMat);
  bar.rotation.z = Math.PI / 2;
  grp.add(bar);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.005, 8, 16), chromeMat);
  ring.position.y = -0.02;
  grp.add(ring);
  return grp;
}

function createBarbellMesh(
  chromeMat: THREE.Material,
  plateMat: THREE.Material,
  accentMat: THREE.Material
): THREE.Group {
  const grp = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 1.62, 18), chromeMat);
  shaft.rotation.z = Math.PI / 2;
  shaft.castShadow = true;
  grp.add(shaft);

  const outerPlateGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.042, 26);
  const innerPlateGeo = new THREE.CylinderGeometry(0.135, 0.135, 0.036, 24);
  const collarGeo = new THREE.CylinderGeometry(0.036, 0.036, 0.045, 16);

  [-1, 1].forEach((sign) => {
    const p1 = new THREE.Mesh(outerPlateGeo, plateMat);
    p1.rotation.z = Math.PI / 2;
    p1.position.x = sign * 0.61;
    p1.castShadow = true;
    grp.add(p1);

    const p2 = new THREE.Mesh(innerPlateGeo, plateMat);
    p2.rotation.z = Math.PI / 2;
    p2.position.x = sign * 0.665;
    p2.castShadow = true;
    grp.add(p2);

    const collar = new THREE.Mesh(collarGeo, accentMat);
    collar.rotation.z = Math.PI / 2;
    collar.position.x = sign * 0.56;
    grp.add(collar);
  });

  return grp;
}

export function createGymStage(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean
): AthleteRig {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  // ================= STUDIO FLOOR & CONTACT GROUNDING =================
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const floorTex = createGymFloorTexture(maxAniso);
  const singletTex = createSingletTexture(maxAniso);
  textures.push(floorTex, singletTex);

  const floorMesh = new THREE.Mesh(
    trackGeo(new THREE.CircleGeometry(3.6, 56)),
    trackMat(
      new THREE.MeshStandardMaterial({
        map: floorTex,
        roughness: 0.75,
        metalness: 0.14,
      })
    )
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = 0;
  floorMesh.receiveShadow = !isSoftwareGl;
  scene.add(floorMesh);

  const platformRing = new THREE.Mesh(
    trackGeo(new THREE.RingGeometry(2.38, 2.44, 64)),
    trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.35,
        metalness: 0.65,
        emissive: 0x78350f,
        emissiveIntensity: 0.25,
      })
    )
  );
  platformRing.rotation.x = -Math.PI / 2;
  platformRing.position.y = 0.003;
  scene.add(platformRing);

  const shadowTex = createContactShadowTexture();
  textures.push(shadowTex);
  const contactShadow = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(1.85, 1.85)),
    trackMat(
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.58,
      })
    )
  );
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.005;
  scene.add(contactShadow);

  // ================= SHARED PBR MATERIALS =================
  const skinMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xdca078,
      roughness: 0.48,
      metalness: 0.03,
    })
  );
  const hairMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x18151d,
      roughness: 0.72,
      metalness: 0.06,
    })
  );
  const eyeWhiteMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
  );
  const irisMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.15 })
  );
  const shortsMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x182235,
      roughness: 0.82,
      metalness: 0.06,
    })
  );
  const singletMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: singletTex,
      roughness: 0.65,
      metalness: 0.08,
    })
  );
  const gloveMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.55,
      metalness: 0.2,
    })
  );
  const shoeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.55,
      metalness: 0.16,
    })
  );
  const shoeAccentMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.4,
      metalness: 0.4,
    })
  );
  const shoeSoleMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.42,
      metalness: 0.04,
    })
  );
  const chromeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.15,
      metalness: 0.95,
    })
  );
  const darkSteelMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.34,
      metalness: 0.84,
    })
  );
  const rubberPlateMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.72,
      metalness: 0.18,
    })
  );
  const benchPadMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.58,
      metalness: 0.12,
    })
  );
  const amberAccentMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.32,
      metalness: 0.68,
    })
  );

  // Per-muscle anatomical materials with smooth highlight glow
  const makeMuscleMat = (baseHex: number) =>
    trackMat(
      new THREE.MeshStandardMaterial({
        color: baseHex,
        roughness: 0.42,
        metalness: 0.06,
        emissive: 0x000000,
        emissiveIntensity: 0,
      })
    );

  const chestMat = makeMuscleMat(0xd19069);
  const backMat = makeMuscleMat(0xcc8b64);
  const coreMat = makeMuscleMat(0xd4946e);
  const shoulderMatL = makeMuscleMat(0xd4956f);
  const shoulderMatR = makeMuscleMat(0xd4956f);
  const bicepMatL = makeMuscleMat(0xd89973);
  const bicepMatR = makeMuscleMat(0xd89973);
  const tricepMatL = makeMuscleMat(0xcf8e67);
  const tricepMatR = makeMuscleMat(0xcf8e67);
  const gluteMat = makeMuscleMat(0x233044);
  const thighMatL = makeMuscleMat(0xd69670);
  const thighMatR = makeMuscleMat(0xd69670);
  const calfMatL = makeMuscleMat(0xd4946e);
  const calfMatR = makeMuscleMat(0xd4946e);

  const muscleGroups: Record<MuscleTargetId, THREE.MeshStandardMaterial[]> = {
    chest: [chestMat],
    back: [backMat],
    core: [coreMat],
    shoulder: [shoulderMatL, shoulderMatR],
    arm_upper: [bicepMatL, bicepMatR],
    arm_back: [tricepMatL, tricepMatR],
    glute: [gluteMat],
    thigh: [thighMatL, thighMatR],
    calf: [calfMatL, calfMatR],
  };

  // ================= SCULPTED ANATOMICAL 3D ATHLETE =================
  const root = new THREE.Group();
  scene.add(root);

  const pelvisPivot = new THREE.Group();
  pelvisPivot.position.set(0, 0.90, 0);
  root.add(pelvisPivot);

  // Sculpted Athletic Shorts Pelvis
  const pelvisGeo = trackGeo(
    createLatheLimb(
      [
        [0.01, -0.09],
        [0.142, -0.075],
        [0.158, -0.01],
        [0.152, 0.065],
        [0.138, 0.09],
        [0.01, 0.092],
      ],
      22
    )
  );
  const pelvisCore = new THREE.Mesh(pelvisGeo, shortsMat);
  pelvisCore.scale.set(1.16, 1, 0.84);
  pelvisCore.castShadow = !isSoftwareGl;
  pelvisPivot.add(pelvisCore);

  const waistband = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.146, 0.149, 0.036, 22)),
    amberAccentMat
  );
  waistband.scale.set(1.16, 1, 0.84);
  waistband.position.y = 0.076;
  pelvisPivot.add(waistband);

  // Sculpted Glute contours
  [-0.076, 0.076].forEach((gx) => {
    const glute = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.094, 16, 14)), gluteMat);
    glute.scale.set(0.98, 1.08, 0.86);
    glute.position.set(gx, -0.015, -0.072);
    pelvisPivot.add(glute);
  });

  // Spine / Torso Group
  const spinePivot = new THREE.Group();
  spinePivot.position.set(0, 0.085, 0);
  pelvisPivot.add(spinePivot);

  // Tapered V-Shape Anatomical Torso (LatheGeometry)
  const torsoGeo = trackGeo(
    createLatheLimb(
      [
        [0.01, 0.0],
        [0.138, 0.01],
        [0.136, 0.11], // athletic narrow waist
        [0.156, 0.22], // obliques flare
        [0.194, 0.34], // ribcage & lats
        [0.205, 0.43], // upper chest & shoulder girdle
        [0.145, 0.485], // trapezius taper
        [0.068, 0.51], // base of neck
      ],
      24
    )
  );
  const torsoMesh = new THREE.Mesh(torsoGeo, singletMat);
  torsoMesh.scale.set(1.14, 1, 0.78);
  torsoMesh.castShadow = !isSoftwareGl;
  spinePivot.add(torsoMesh);

  // Sculpted 6-Pack Abs & Obliques relief (visible when core lights up or close-up)
  for (let row = 0; row < 3; row++) {
    [-0.038, 0.038].forEach((ax) => {
      const abPad = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.034, 12, 10)), coreMat);
      abPad.scale.set(1.1, 1.2, 0.55);
      abPad.position.set(ax, 0.075 + row * 0.064, 0.104);
      spinePivot.add(abPad);
    });
  }

  // Sculpted Pectoral Muscle Plates
  [-0.082, 0.082].forEach((px) => {
    const pec = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.095, 16, 14)), chestMat);
    pec.scale.set(1.12, 0.82, 0.58);
    pec.position.set(px, 0.365, 0.112);
    pec.rotation.y = px > 0 ? 0.15 : -0.15;
    pec.castShadow = !isSoftwareGl;
    spinePivot.add(pec);
  });

  // Sculpted Lats & Upper Back + Traps
  [-0.095, 0.095].forEach((bx) => {
    const lat = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.105, 16, 14)), backMat);
    lat.scale.set(1.12, 1.38, 0.62);
    lat.position.set(bx, 0.33, -0.096);
    lat.rotation.z = bx > 0 ? -0.18 : 0.18;
    lat.castShadow = !isSoftwareGl;
    spinePivot.add(lat);
  });

  const trapsMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.072, 0.175, 0.09, 18)),
    backMat
  );
  trapsMesh.scale.set(1.25, 1, 0.72);
  trapsMesh.position.set(0, 0.475, -0.02);
  spinePivot.add(trapsMesh);

  // ================= SCULPTED HEAD, FACE & ATHLETIC HAIR =================
  const neckPivot = new THREE.Group();
  neckPivot.position.set(0, 0.49, 0);
  spinePivot.add(neckPivot);

  const neckGeo = trackGeo(
    createLatheLimb(
      [
        [0.072, 0.0],
        [0.056, 0.045],
        [0.054, 0.095],
      ],
      16
    )
  );
  const neckMesh = new THREE.Mesh(neckGeo, skinMat);
  neckPivot.add(neckMesh);

  // Cranium + Sculpted Jaw
  const headMesh = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.108, 22, 20)), skinMat);
  headMesh.scale.set(0.90, 1.08, 0.98);
  headMesh.position.y = 0.185;
  headMesh.castShadow = !isSoftwareGl;
  neckPivot.add(headMesh);

  const jawMesh = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.076, 16, 14)), skinMat);
  jawMesh.scale.set(0.92, 0.85, 0.95);
  jawMesh.position.set(0, 0.135, 0.024);
  neckPivot.add(jawMesh);

  // Ears & Nose Bridge
  [-0.096, 0.096].forEach((ex) => {
    const ear = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.022, 10, 10)), skinMat);
    ear.scale.set(0.45, 1.15, 0.75);
    ear.position.set(ex, 0.175, 0.0);
    neckPivot.add(ear);
  });
  const nose = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.016, 0.036, 8)), skinMat);
  nose.rotation.x = Math.PI * 0.42;
  nose.position.set(0, 0.172, 0.108);
  neckPivot.add(nose);

  // Expressive Eyes & Brows (unmistakable athletic face)
  [-0.036, 0.036].forEach((ex) => {
    const eyeWhite = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.014, 10, 8)), eyeWhiteMat);
    eyeWhite.scale.set(1.1, 0.72, 0.65);
    eyeWhite.position.set(ex, 0.195, 0.094);
    neckPivot.add(eyeWhite);

    const iris = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.0085, 10, 8)), irisMat);
    iris.position.set(ex, 0.195, 0.102);
    neckPivot.add(iris);

    const brow = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.032, 0.008, 0.014)), hairMat);
    brow.position.set(ex, 0.214, 0.096);
    brow.rotation.z = ex > 0 ? 0.1 : -0.1;
    neckPivot.add(brow);
  });

  // Layered Athletic Hairstyle + Headband
  const hairBack = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.114, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.58)),
    hairMat
  );
  hairBack.scale.set(0.93, 1.05, 1.02);
  hairBack.position.set(0, 0.192, -0.012);
  hairBack.rotation.x = -0.25;
  neckPivot.add(hairBack);

  const hairCrown = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.088, 16, 12)), hairMat);
  hairCrown.scale.set(0.88, 0.58, 1.12);
  hairCrown.position.set(0, 0.275, 0.012);
  hairCrown.rotation.x = -0.12;
  neckPivot.add(hairCrown);

  const headband = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.103, 0.013, 10, 26)), amberAccentMat);
  headband.rotation.x = Math.PI / 2 - 0.18;
  headband.position.set(0, 0.232, 0.004);
  neckPivot.add(headband);

  // ================= SCULPTED ARMS & LIFTING GLOVES =================
  const upperArmGeo = trackGeo(
    createLatheLimb(
      [
        [0.038, -0.275], // elbow taper
        [0.048, -0.20],
        [0.056, -0.13], // bicep/tricep fullness
        [0.052, -0.05],
        [0.048, 0.0],
      ],
      18
    )
  );

  const forearmGeo = trackGeo(
    createLatheLimb(
      [
        [0.028, -0.24], // slim wrist
        [0.034, -0.17],
        [0.045, -0.07], // brachioradialis peak
        [0.040, 0.0],
      ],
      18
    )
  );

  const buildArm = (side: 'L' | 'R') => {
    const sign = side === 'L' ? 1 : -1;
    const sMat = side === 'L' ? shoulderMatL : shoulderMatR;
    const bMat = side === 'L' ? bicepMatL : bicepMatR;
    const tMat = side === 'L' ? tricepMatL : tricepMatR;

    const shoulderPivot = new THREE.Group();
    shoulderPivot.position.set(sign * 0.235, 0.42, 0);
    spinePivot.add(shoulderPivot);

    // Sculpted 3-Head Deltoid Cap
    const delt = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.072, 16, 14)), sMat);
    delt.scale.set(1.06, 1.18, 1.04);
    shoulderPivot.add(delt);

    const upperArm = new THREE.Mesh(upperArmGeo, skinMat);
    upperArm.castShadow = !isSoftwareGl;
    shoulderPivot.add(upperArm);

    const bicepHead = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.046, 14, 12)), bMat);
    bicepHead.scale.set(0.86, 1.55, 0.88);
    bicepHead.position.set(0, -0.135, 0.024);
    shoulderPivot.add(bicepHead);

    const tricepHead = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.044, 14, 12)), tMat);
    tricepHead.scale.set(0.85, 1.5, 0.88);
    tricepHead.position.set(0, -0.135, -0.024);
    shoulderPivot.add(tricepHead);

    // Elbow Pivot
    const elbowPivot = new THREE.Group();
    elbowPivot.position.set(0, -0.28, 0);
    shoulderPivot.add(elbowPivot);

    const elbowJoint = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.04, 12, 10)), skinMat);
    elbowPivot.add(elbowJoint);

    const forearm = new THREE.Mesh(forearmGeo, skinMat);
    forearm.castShadow = !isSoftwareGl;
    elbowPivot.add(forearm);

    // Wrist Wrap + Lifting Glove + Grip Fingers
    const wristWrap = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.034, 0.032, 0.042, 14)),
      amberAccentMat
    );
    wristWrap.position.y = -0.22;
    elbowPivot.add(wristWrap);

    const glovePalm = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.052, 0.056, 0.044)),
      gloveMat
    );
    glovePalm.position.set(0, -0.265, 0.005);
    elbowPivot.add(glovePalm);

    const fingers = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.028, 10, 8)),
      skinMat
    );
    fingers.scale.set(0.95, 0.9, 1.05);
    fingers.position.set(0, -0.292, 0.015);
    elbowPivot.add(fingers);

    const handAnchor = new THREE.Object3D();
    handAnchor.position.set(0, -0.278, 0.016);
    elbowPivot.add(handAnchor);

    const dumbbell = createDumbbellMesh(chromeMat, rubberPlateMat, amberAccentMat);
    dumbbell.rotation.y = Math.PI / 2;
    dumbbell.visible = false;
    handAnchor.add(dumbbell);

    const cableHandle = createCableHandle(chromeMat, rubberPlateMat);
    cableHandle.visible = false;
    handAnchor.add(cableHandle);

    return { shoulderPivot, elbowPivot, handAnchor, dumbbell, cableHandle };
  };

  const armL = buildArm('L');
  const armR = buildArm('R');

  // ================= SCULPTED LEGS & ATHLETIC SNEAKERS =================
  const thighGeo = trackGeo(
    createLatheLimb(
      [
        [0.052, -0.41], // knee taper
        [0.066, -0.30], // teardrop quad
        [0.080, -0.17], // peak quad sweep
        [0.084, -0.06],
        [0.080, 0.0],
      ],
      20
    )
  );

  const calfGeo = trackGeo(
    createLatheLimb(
      [
        [0.034, -0.39], // Achilles ankle
        [0.040, -0.28],
        [0.058, -0.14], // gastrocnemius diamond
        [0.052, -0.05],
        [0.048, 0.0],
      ],
      18
    )
  );

  const buildLeg = (side: 'L' | 'R') => {
    const sign = side === 'L' ? 1 : -1;
    const qMat = side === 'L' ? thighMatL : thighMatR;
    const cMat = side === 'L' ? calfMatL : calfMatR;

    const hipPivot = new THREE.Group();
    hipPivot.position.set(sign * 0.106, -0.02, 0);
    pelvisPivot.add(hipPivot);

    const shortsCuff = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.088, 0.078, 0.17, 18)),
      shortsMat
    );
    shortsCuff.position.y = -0.085;
    shortsCuff.castShadow = !isSoftwareGl;
    hipPivot.add(shortsCuff);

    const thigh = new THREE.Mesh(thighGeo, skinMat);
    thigh.castShadow = !isSoftwareGl;
    hipPivot.add(thigh);

    const quad = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.068, 14, 12)), qMat);
    quad.scale.set(0.95, 2.05, 0.92);
    quad.position.set(0, -0.22, 0.026);
    hipPivot.add(quad);

    // Knee Pivot
    const kneePivot = new THREE.Group();
    kneePivot.position.set(0, -0.42, 0);
    hipPivot.add(kneePivot);

    const kneeCap = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.052, 14, 12)), skinMat);
    kneePivot.add(kneeCap);

    const shin = new THREE.Mesh(calfGeo, skinMat);
    shin.castShadow = !isSoftwareGl;
    kneePivot.add(shin);

    const calf = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.052, 14, 12)), cMat);
    calf.scale.set(0.90, 1.85, 0.94);
    calf.position.set(0, -0.145, -0.026);
    kneePivot.add(calf);

    // Ankle & Multi-Part Athletic Sneaker
    const anklePivot = new THREE.Group();
    anklePivot.position.set(0, -0.40, 0);
    kneePivot.add(anklePivot);

    const shoeCollar = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.044, 0.048, 0.045, 14)),
      shoeAccentMat
    );
    shoeCollar.position.set(0, -0.015, 0.005);
    anklePivot.add(shoeCollar);

    const shoeUpper = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.092, 0.058, 0.185)),
      shoeMat
    );
    shoeUpper.position.set(0, -0.040, 0.042);
    shoeUpper.castShadow = !isSoftwareGl;
    anklePivot.add(shoeUpper);

    const toeCap = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.048, 12, 10)), shoeMat);
    toeCap.scale.set(0.95, 0.56, 1.05);
    toeCap.position.set(0, -0.048, 0.125);
    anklePivot.add(toeCap);

    const shoeSole = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.10, 0.024, 0.215)),
      shoeSoleMat
    );
    shoeSole.position.set(0, -0.068, 0.048);
    anklePivot.add(shoeSole);

    return { hipPivot, kneePivot, anklePivot };
  };

  const legL = buildLeg('L');
  const legR = buildLeg('R');

  // Dynamic Barbell
  const barbellGroup = createBarbellMesh(chromeMat, rubberPlateMat, amberAccentMat);
  barbellGroup.visible = false;
  scene.add(barbellGroup);

  // Dynamic Cable Lines
  const cableLineMat = trackMat(new THREE.LineBasicMaterial({ color: 0x94a3b8 }));
  const cableGeoL = trackGeo(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]));
  const cableGeoR = trackGeo(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]));
  const cableLineL = new THREE.Line(cableGeoL, cableLineMat);
  const cableLineR = new THREE.Line(cableGeoR, cableLineMat);
  cableLineL.visible = false;
  cableLineR.visible = false;
  scene.add(cableLineL, cableLineR);

  // ================= ENVIRONMENT GYM PROPS =================
  const propsMap: Record<PropType, THREE.Group> = {
    floor: new THREE.Group(),
    bench_flat: new THREE.Group(),
    bench_incline: new THREE.Group(),
    bench_decline: new THREE.Group(),
    pullup_bar: new THREE.Group(),
    dip_bars: new THREE.Group(),
    cable_high: new THREE.Group(),
    cable_low: new THREE.Group(),
    wall: new THREE.Group(),
    elevated_step: new THREE.Group(),
    leg_machine: new THREE.Group(),
  };

  Object.values(propsMap).forEach((g) => {
    g.visible = false;
    scene.add(g);
  });

  // 1. Floor Mat
  const matMesh = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.08, 0.018, 2.08)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9, metalness: 0.04 }))
  );
  matMesh.position.set(0, 0.01, 0);
  matMesh.receiveShadow = !isSoftwareGl;
  propsMap.floor.add(matMesh);

  // 2. Flat Bench
  {
    const pad = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.34, 0.08, 1.25)), benchPadMat);
    pad.position.set(0, 0.42, -0.15);
    pad.castShadow = !isSoftwareGl;
    pad.receiveShadow = !isSoftwareGl;
    propsMap.bench_flat.add(pad);

    [-0.62, 0.32].forEach((zPos) => {
      const leg = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.06, 0.40, 0.06)), darkSteelMat);
      leg.position.set(0, 0.20, zPos);
      propsMap.bench_flat.add(leg);
      const foot = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.42, 0.04, 0.08)), darkSteelMat);
      foot.position.set(0, 0.02, zPos);
      propsMap.bench_flat.add(foot);
    });
  }

  // 3. Incline Bench
  {
    const seat = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.34, 0.08, 0.40)), benchPadMat);
    seat.position.set(0, 0.40, 0.16);
    propsMap.bench_incline.add(seat);

    const backrest = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.34, 0.08, 0.85)), benchPadMat);
    backrest.rotation.x = 0.65;
    backrest.position.set(0, 0.65, -0.32);
    backrest.castShadow = !isSoftwareGl;
    propsMap.bench_incline.add(backrest);

    const spineBeam = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.07, 0.40, 0.07)), darkSteelMat);
    spineBeam.position.set(0, 0.20, -0.25);
    propsMap.bench_incline.add(spineBeam);
    const frontLeg = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.07, 0.38, 0.07)), darkSteelMat);
    frontLeg.position.set(0, 0.19, 0.22);
    propsMap.bench_incline.add(frontLeg);
  }

  // 4. Decline Bench
  {
    const pad = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.34, 0.08, 1.2)), benchPadMat);
    pad.rotation.x = -0.34;
    pad.position.set(0, 0.42, -0.10);
    pad.castShadow = !isSoftwareGl;
    propsMap.bench_decline.add(pad);
    const frontPost = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.03, 0.03, 0.56, 12)), darkSteelMat);
    frontPost.position.set(0, 0.28, 0.36);
    propsMap.bench_decline.add(frontPost);
    const roller = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 0.38, 12)), benchPadMat);
    roller.rotation.z = Math.PI / 2;
    roller.position.set(0, 0.62, 0.42);
    propsMap.bench_decline.add(roller);
  }

  // 5. Pull-up Power Rack
  {
    [-0.65, 0.65].forEach((xPos) => {
      const upright = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.07, 2.25, 0.07)), darkSteelMat);
      upright.position.set(xPos, 1.125, 0);
      upright.castShadow = !isSoftwareGl;
      propsMap.pullup_bar.add(upright);
      const base = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.09, 0.05, 0.90)), darkSteelMat);
      base.position.set(xPos, 0.025, 0);
      propsMap.pullup_bar.add(base);
    });
    const topBar = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.022, 0.022, 1.38, 16)), chromeMat);
    topBar.rotation.z = Math.PI / 2;
    topBar.position.set(0, 2.15, 0);
    propsMap.pullup_bar.add(topBar);
  }

  // 6. Parallel Dip Bars
  {
    [-0.31, 0.31].forEach((xPos) => {
      const rail = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.024, 0.024, 0.85, 14)), chromeMat);
      rail.rotation.x = Math.PI / 2;
      rail.position.set(xPos, 1.15, 0);
      propsMap.dip_bars.add(rail);
      [-0.32, 0.32].forEach((zPos) => {
        const post = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.025, 0.025, 1.15, 12)), darkSteelMat);
        post.position.set(xPos, 0.575, zPos);
        propsMap.dip_bars.add(post);
      });
    });
  }

  // 7. Cable High & Low Towers
  const buildCableTower = (grp: THREE.Group, pulleyY: number) => {
    const col = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.14, 2.15, 0.14)), darkSteelMat);
    col.position.set(0, 1.075, 0.98);
    col.castShadow = !isSoftwareGl;
    grp.add(col);
    const stack = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.28, 0.85, 0.20)), rubberPlateMat);
    stack.position.set(0, 0.45, 0.98);
    grp.add(stack);
    const pulley = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16)), amberAccentMat);
    pulley.rotation.z = Math.PI / 2;
    pulley.position.set(0, pulleyY, 0.90);
    grp.add(pulley);
  };
  buildCableTower(propsMap.cable_high, 1.98);
  buildCableTower(propsMap.cable_low, 0.25);

  // 8. Wall
  {
    const wallMesh = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.6, 2.0, 0.12)),
      trackMat(new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85, metalness: 0.05 }))
    );
    wallMesh.position.set(0, 1.0, -0.32);
    wallMesh.receiveShadow = !isSoftwareGl;
    propsMap.wall.add(wallMesh);
  }

  // 9. Elevated Step
  {
    const box = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.75, 0.34, 0.50)), darkSteelMat);
    box.position.set(0, 0.17, -0.78);
    box.castShadow = !isSoftwareGl;
    box.receiveShadow = !isSoftwareGl;
    propsMap.elevated_step.add(box);
    const topCap = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.77, 0.04, 0.52)), amberAccentMat);
    topCap.position.set(0, 0.35, -0.78);
    propsMap.elevated_step.add(topCap);
  }

  // 10. Leg Machine
  {
    const seat = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.42, 0.08, 0.55)), benchPadMat);
    seat.position.set(0, 0.48, -0.05);
    propsMap.leg_machine.add(seat);
    const post = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.09, 0.48, 0.09)), darkSteelMat);
    post.position.set(0, 0.24, 0);
    propsMap.leg_machine.add(post);
  }

  // ================= POSE INTERPOLATION & SYNC =================
  const lerpVal = (a: number, b: number, t: number) => a + (b - a) * t;
  const lerpVec3 = (a: Vec3, b: Vec3, t: number, out: THREE.Vector3 | THREE.Euler) => {
    out.set(lerpVal(a[0], b[0], t), lerpVal(a[1], b[1], t), lerpVal(a[2], b[2], t));
  };

  let lastProp: PropType | null = null;
  let lastHighlight: MuscleTargetId | null = null;

  const applyPose = (
    poseA: Pose3D,
    poseB: Pose3D,
    t: number,
    weightType: WeightType,
    propType: PropType,
    highlightTarget: MuscleTargetId,
    accentHex: number,
    tension01: number,
    breathCycle = 0
  ) => {
    if (lastProp !== propType) {
      Object.entries(propsMap).forEach(([key, grp]) => {
        grp.visible = key === propType;
      });
      lastProp = propType;
    }

    if (lastHighlight && lastHighlight !== highlightTarget) {
      muscleGroups[lastHighlight].forEach((m) => {
        m.emissive.copy(_baseEmissive);
        m.emissiveIntensity = 0;
      });
    }
    lastHighlight = highlightTarget;
    _accentColor.setHex(accentHex);
    const glowStrength = 0.25 + tension01 * 0.68;
    muscleGroups[highlightTarget].forEach((m) => {
      m.emissive.copy(_accentColor);
      m.emissiveIntensity = glowStrength;
    });

    lerpVec3(poseA.rootPos, poseB.rootPos, t, pelvisPivot.position);
    lerpVec3(poseA.rootRot, poseB.rootRot, t, pelvisPivot.rotation);
    lerpVec3(poseA.spineRot, poseB.spineRot, t, spinePivot.rotation);
    lerpVec3(poseA.headRot, poseB.headRot, t, neckPivot.rotation);
    lerpVec3(poseA.shoulderL, poseB.shoulderL, t, armL.shoulderPivot.rotation);
    lerpVec3(poseA.shoulderR, poseB.shoulderR, t, armR.shoulderPivot.rotation);
    lerpVec3(poseA.elbowL, poseB.elbowL, t, armL.elbowPivot.rotation);
    lerpVec3(poseA.elbowR, poseB.elbowR, t, armR.elbowPivot.rotation);
    lerpVec3(poseA.hipL, poseB.hipL, t, legL.hipPivot.rotation);
    lerpVec3(poseA.hipR, poseB.hipR, t, legR.hipPivot.rotation);
    lerpVec3(poseA.kneeL, poseB.kneeL, t, legL.kneePivot.rotation);
    lerpVec3(poseA.kneeR, poseB.kneeR, t, legR.kneePivot.rotation);

    // Subtle organic ribcage expansion & muscle pump scale on contraction
    const chestExpand = 1 + Math.sin(breathCycle) * 0.015;
    torsoMesh.scale.set(1.14 * chestExpand, 1, 0.78 * chestExpand);

    if (poseA.ankleL && poseB.ankleL) {
      lerpVec3(poseA.ankleL, poseB.ankleL, t, legL.anklePivot.rotation);
    } else {
      legL.anklePivot.rotation.set(0, 0, 0);
    }
    if (poseA.ankleR && poseB.ankleR) {
      lerpVec3(poseA.ankleR, poseB.ankleR, t, legR.anklePivot.rotation);
    } else {
      legR.anklePivot.rotation.set(0, 0, 0);
    }

    contactShadow.position.x = pelvisPivot.position.x;
    contactShadow.position.z = pelvisPivot.position.z;

    armL.dumbbell.visible = weightType === 'dumbbell';
    armR.dumbbell.visible = weightType === 'dumbbell';
    armL.cableHandle.visible = weightType === 'cable_handle';
    armR.cableHandle.visible = weightType === 'cable_handle';
    barbellGroup.visible = weightType === 'barbell';

    if (weightType === 'barbell' || weightType === 'cable_handle') {
      root.updateMatrixWorld(true);
      armL.handAnchor.getWorldPosition(_vA);
      armR.handAnchor.getWorldPosition(_vB);

      if (weightType === 'barbell') {
        _mid.copy(_vA).add(_vB).multiplyScalar(0.5);
        barbellGroup.position.copy(_mid);
        _dir.copy(_vA).sub(_vB);
        if (_dir.lengthSq() > 0.0001) {
          _dir.normalize();
          _quat.setFromUnitVectors(_xAxis, _dir);
          barbellGroup.quaternion.copy(_quat);
        }
      }

      if (weightType === 'cable_handle') {
        const pulleyY = propType === 'cable_high' ? 1.98 : 0.25;
        const posArrL = cableGeoL.attributes.position as THREE.BufferAttribute;
        posArrL.setXYZ(0, 0, pulleyY, 0.90);
        posArrL.setXYZ(1, _vA.x, _vA.y, _vA.z);
        posArrL.needsUpdate = true;

        const posArrR = cableGeoR.attributes.position as THREE.BufferAttribute;
        posArrR.setXYZ(0, 0, pulleyY, 0.90);
        posArrR.setXYZ(1, _vB.x, _vB.y, _vB.z);
        posArrR.needsUpdate = true;

        cableLineL.visible = true;
        cableLineR.visible = true;
      } else {
        cableLineL.visible = false;
        cableLineR.visible = false;
      }
    } else {
      cableLineL.visible = false;
      cableLineR.visible = false;
    }
  };

  const dispose = () => {
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
  };

  return {
    root,
    pelvisPivot,
    spinePivot,
    neckPivot,
    shoulderPivotL: armL.shoulderPivot,
    shoulderPivotR: armR.shoulderPivot,
    elbowPivotL: armL.elbowPivot,
    elbowPivotR: armR.elbowPivot,
    handAnchorL: armL.handAnchor,
    handAnchorR: armR.handAnchor,
    hipPivotL: legL.hipPivot,
    hipPivotR: legR.hipPivot,
    kneePivotL: legL.kneePivot,
    kneePivotR: legR.kneePivot,
    anklePivotL: legL.anklePivot,
    anklePivotR: legR.anklePivot,
    dumbbellL: armL.dumbbell,
    dumbbellR: armR.dumbbell,
    cableHandleL: armL.cableHandle,
    cableHandleR: armR.cableHandle,
    barbellGroup,
    cableLineL,
    cableLineR,
    propsMap,
    muscleGroups,
    applyPose,
    dispose,
  };
}
