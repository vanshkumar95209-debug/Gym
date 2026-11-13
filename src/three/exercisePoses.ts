import { MuscleTargetId, Pose3D, PropType, WeightType } from './athleteCharacter';

export interface Anim3DSpec {
  poseA: Pose3D;
  poseB: Pose3D;
  prop: PropType;
  weight: WeightType;
  speed: number; // cycles speed (rad/sec)
  highlightJoint: MuscleTargetId;
  isHold?: boolean;
  labelEn: [string, string];
  labelHi: [string, string];
}

// Standing neutral base helper
const baseStanding = (overrides: Partial<Pose3D> = {}): Pose3D => ({
  rootPos: [0, 0.90, 0],
  rootRot: [0, 0, 0],
  spineRot: [0, 0, 0],
  headRot: [0, 0, 0],
  shoulderL: [0.05, 0, 0.14],
  shoulderR: [0.05, 0, -0.14],
  elbowL: [-0.15, 0, 0],
  elbowR: [-0.15, 0, 0],
  hipL: [0, 0, 0.06],
  hipR: [0, 0, -0.06],
  kneeL: [0.04, 0, 0],
  kneeR: [0.04, 0, 0],
  ankleL: [0, 0, 0],
  ankleR: [0, 0, 0],
  ...overrides,
});

// Flat bench supine base helper
const baseFlatBench = (overrides: Partial<Pose3D> = {}): Pose3D => ({
  rootPos: [0, 0.52, -0.04],
  rootRot: [-1.57, 0, 0],
  spineRot: [0, 0, 0],
  headRot: [0.1, 0, 0],
  shoulderL: [-1.57, 0, 0.18],
  shoulderR: [-1.57, 0, -0.18],
  elbowL: [-0.12, 0, 0],
  elbowR: [-0.12, 0, 0],
  hipL: [-0.95, 0, 0.16],
  hipR: [-0.95, 0, -0.16],
  kneeL: [2.15, 0, 0],
  kneeR: [2.15, 0, 0],
  ...overrides,
});

export function getAnim3DSpec(key: string): Anim3DSpec {
  switch (key) {
    // ===================== CHEST =====================
    case 'bench_press':
      return {
        prop: 'bench_flat',
        weight: 'barbell',
        speed: 2.3,
        highlightJoint: 'chest',
        labelEn: ['Lower Bar to Chest', 'Press Up Strong'],
        labelHi: ['बार छाती तक लाएं', 'ऊपर पुश करें'],
        poseA: baseFlatBench({
          shoulderL: [-1.05, 0, 0.72],
          shoulderR: [-1.05, 0, -0.72],
          elbowL: [-1.55, 0, -0.25],
          elbowR: [-1.55, 0, 0.25],
        }),
        poseB: baseFlatBench({
          shoulderL: [-1.57, 0, 0.20],
          shoulderR: [-1.57, 0, -0.20],
          elbowL: [-0.08, 0, 0],
          elbowR: [-0.08, 0, 0],
        }),
      };

    case 'incline_dumbbell_press':
      return {
        prop: 'bench_incline',
        weight: 'dumbbell',
        speed: 2.3,
        highlightJoint: 'chest',
        labelEn: ['Stretch Upper Chest', 'Press & Squeeze'],
        labelHi: ['नीचे स्ट्रेच करें', 'ऊपर प्रेस करें'],
        poseA: {
          rootPos: [0, 0.48, 0.08],
          rootRot: [-0.95, 0, 0],
          spineRot: [0.05, 0, 0],
          headRot: [0.15, 0, 0],
          shoulderL: [-1.15, 0, 0.78],
          shoulderR: [-1.15, 0, -0.78],
          elbowL: [-1.50, 0, -0.2],
          elbowR: [-1.50, 0, 0.2],
          hipL: [-0.65, 0, 0.18],
          hipR: [-0.65, 0, -0.18],
          kneeL: [1.55, 0, 0],
          kneeR: [1.55, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.48, 0.08],
          rootRot: [-0.95, 0, 0],
          spineRot: [0.05, 0, 0],
          headRot: [0.15, 0, 0],
          shoulderL: [-2.05, 0, 0.14],
          shoulderR: [-2.05, 0, -0.14],
          elbowL: [-0.15, 0, 0],
          elbowR: [-0.15, 0, 0],
          hipL: [-0.65, 0, 0.18],
          hipR: [-0.65, 0, -0.18],
          kneeL: [1.55, 0, 0],
          kneeR: [1.55, 0, 0],
        },
      };

    case 'decline_dumbbell_press':
      return {
        prop: 'bench_decline',
        weight: 'dumbbell',
        speed: 2.3,
        highlightJoint: 'chest',
        labelEn: ['Lower Control', 'Drive Up'],
        labelHi: ['धीरे नीचे लाएं', 'ऊपर पुश करें'],
        poseA: {
          rootPos: [0, 0.48, 0.04],
          rootRot: [-1.88, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [0.15, 0, 0],
          shoulderL: [-0.85, 0, 0.75],
          shoulderR: [-0.85, 0, -0.75],
          elbowL: [-1.55, 0, 0],
          elbowR: [-1.55, 0, 0],
          hipL: [0.1, 0, 0.15],
          hipR: [0.1, 0, -0.15],
          kneeL: [1.35, 0, 0],
          kneeR: [1.35, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.48, 0.04],
          rootRot: [-1.88, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [0.15, 0, 0],
          shoulderL: [-1.25, 0, 0.15],
          shoulderR: [-1.25, 0, -0.15],
          elbowL: [-0.12, 0, 0],
          elbowR: [-0.12, 0, 0],
          hipL: [0.1, 0, 0.15],
          hipR: [0.1, 0, -0.15],
          kneeL: [1.35, 0, 0],
          kneeR: [1.35, 0, 0],
        },
      };

    case 'dumbbell_fly':
      return {
        prop: 'bench_flat',
        weight: 'dumbbell',
        speed: 2.1,
        highlightJoint: 'chest',
        labelEn: ['Wide Chest Stretch', 'Squeeze Together'],
        labelHi: ['बाहर फैलाएं', 'बीच में स्क्वीज़ करें'],
        poseA: baseFlatBench({
          shoulderL: [-0.25, 0, 1.48],
          shoulderR: [-0.25, 0, -1.48],
          elbowL: [-0.35, 0, 0],
          elbowR: [-0.35, 0, 0],
        }),
        poseB: baseFlatBench({
          shoulderL: [-1.57, 0, 0.12],
          shoulderR: [-1.57, 0, -0.12],
          elbowL: [-0.25, 0, 0.12],
          elbowR: [-0.25, 0, -0.12],
        }),
      };

    case 'cable_fly':
      return {
        prop: 'cable_high',
        weight: 'cable_handle',
        speed: 2.2,
        highlightJoint: 'chest',
        labelEn: ['Open Arms Wide', 'Cross & Squeeze'],
        labelHi: ['हाथ खोलें', 'आगे स्क्वीज़ करें'],
        poseA: baseStanding({
          rootPos: [0, 0.88, -0.15],
          spineRot: [0.22, 0, 0],
          shoulderL: [-0.95, 0, 1.25],
          shoulderR: [-0.95, 0, -1.25],
          elbowL: [-0.32, 0, 0],
          elbowR: [-0.32, 0, 0],
          hipL: [-0.28, 0, 0.08],
          hipR: [0.25, 0, -0.08],
          kneeL: [0.28, 0, 0],
          kneeR: [0.12, 0, 0],
        }),
        poseB: baseStanding({
          rootPos: [0, 0.88, -0.15],
          spineRot: [0.28, 0, 0],
          shoulderL: [-0.90, 0, -0.10],
          shoulderR: [-0.90, 0, 0.10],
          elbowL: [-0.32, 0, 0.18],
          elbowR: [-0.32, 0, -0.18],
          hipL: [-0.28, 0, 0.08],
          hipR: [0.25, 0, -0.08],
          kneeL: [0.28, 0, 0],
          kneeR: [0.12, 0, 0],
        }),
      };

    case 'pec_deck':
      return {
        prop: 'bench_incline',
        weight: 'none',
        speed: 2.2,
        highlightJoint: 'chest',
        labelEn: ['Stretch Pecs Open', 'Squeeze Center'],
        labelHi: ['पीछे खोलें', 'आगे मिलाएं'],
        poseA: baseStanding({
          rootPos: [0, 0.45, 0.10],
          shoulderL: [-1.45, -1.1, 1.15],
          shoulderR: [-1.45, 1.1, -1.15],
          elbowL: [-1.35, 0, 0],
          elbowR: [-1.35, 0, 0],
          hipL: [-1.52, 0, 0.15],
          hipR: [-1.52, 0, -0.15],
          kneeL: [1.55, 0, 0],
          kneeR: [1.55, 0, 0],
        }),
        poseB: baseStanding({
          rootPos: [0, 0.45, 0.10],
          shoulderL: [-1.48, 0, 0.05],
          shoulderR: [-1.48, 0, -0.05],
          elbowL: [-1.25, 0, -0.35],
          elbowR: [-1.25, 0, 0.35],
          hipL: [-1.52, 0, 0.15],
          hipR: [-1.52, 0, -0.15],
          kneeL: [1.55, 0, 0],
          kneeR: [1.55, 0, 0],
        }),
      };

    case 'pushup':
    case 'diamond_pushup': {
      const narrow = key === 'diamond_pushup';
      return {
        prop: 'floor',
        weight: 'none',
        speed: 2.4,
        highlightJoint: narrow ? 'arm_back' : 'chest',
        labelEn: ['Lower Chest Close', 'Push Floor Away'],
        labelHi: ['नीचे जाएं', 'ऊपर पुश करें'],
        poseA: {
          rootPos: [0, 0.21, -0.06],
          rootRot: [1.44, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [-0.35, 0, 0],
          shoulderL: [-0.78, 0, narrow ? 0.14 : 0.62],
          shoulderR: [-0.78, 0, narrow ? -0.14 : -0.62],
          elbowL: [-1.62, 0, 0],
          elbowR: [-1.62, 0, 0],
          hipL: [0.05, 0, 0.07],
          hipR: [0.05, 0, -0.07],
          kneeL: [0.04, 0, 0],
          kneeR: [0.04, 0, 0],
          ankleL: [1.05, 0, 0],
          ankleR: [1.05, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.36, -0.04],
          rootRot: [1.18, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [-0.25, 0, 0],
          shoulderL: [-1.18, 0, narrow ? -0.10 : 0.16],
          shoulderR: [-1.18, 0, narrow ? 0.10 : -0.16],
          elbowL: [-0.06, 0, 0],
          elbowR: [-0.06, 0, 0],
          hipL: [0.02, 0, 0.07],
          hipR: [0.02, 0, -0.07],
          kneeL: [0.02, 0, 0],
          kneeR: [0.02, 0, 0],
          ankleL: [1.02, 0, 0],
          ankleR: [1.02, 0, 0],
        },
      };
    }

    case 'decline_pushup':
      return {
        prop: 'elevated_step',
        weight: 'none',
        speed: 2.4,
        highlightJoint: 'chest',
        labelEn: ['Lower Upper Chest', 'Press Explosive'],
        labelHi: ['नीचे लाएं', 'ऊपर पुश करें'],
        poseA: {
          rootPos: [0, 0.28, -0.10],
          rootRot: [1.62, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [-0.35, 0, 0],
          shoulderL: [-0.95, 0, 0.65],
          shoulderR: [-0.95, 0, -0.65],
          elbowL: [-1.62, 0, 0],
          elbowR: [-1.62, 0, 0],
          hipL: [0, 0, 0.07],
          hipR: [0, 0, -0.07],
          kneeL: [0.04, 0, 0],
          kneeR: [0.04, 0, 0],
          ankleL: [1.0, 0, 0],
          ankleR: [1.0, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.43, -0.08],
          rootRot: [1.46, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [-0.25, 0, 0],
          shoulderL: [-1.42, 0, 0.20],
          shoulderR: [-1.42, 0, -0.20],
          elbowL: [-0.10, 0, 0],
          elbowR: [-0.10, 0, 0],
          hipL: [0, 0, 0.07],
          hipR: [0, 0, -0.07],
          kneeL: [0.04, 0, 0],
          kneeR: [0.04, 0, 0],
          ankleL: [1.0, 0, 0],
          ankleR: [1.0, 0, 0],
        },
      };

    case 'dips':
      return {
        prop: 'dip_bars',
        weight: 'none',
        speed: 2.3,
        highlightJoint: 'chest',
        labelEn: ['Lower Until 90°', 'Press Up Full'],
        labelHi: ['नीचे जाएं', 'ऊपर पुश करें'],
        poseA: {
          rootPos: [0, 0.65, 0],
          rootRot: [0.22, 0, 0],
          spineRot: [0.25, 0, 0],
          headRot: [0.1, 0, 0],
          shoulderL: [0.55, 0, 0.28],
          shoulderR: [0.55, 0, -0.28],
          elbowL: [-1.62, 0, 0],
          elbowR: [-1.62, 0, 0],
          hipL: [-0.20, 0, 0.06],
          hipR: [-0.20, 0, -0.06],
          kneeL: [1.35, 0, 0],
          kneeR: [1.35, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.98, 0],
          rootRot: [0.12, 0, 0],
          spineRot: [0.18, 0, 0],
          headRot: [0.1, 0, 0],
          shoulderL: [-0.12, 0, 0.16],
          shoulderR: [-0.12, 0, -0.16],
          elbowL: [-0.10, 0, 0],
          elbowR: [-0.10, 0, 0],
          hipL: [-0.15, 0, 0.06],
          hipR: [-0.15, 0, -0.06],
          kneeL: [1.20, 0, 0],
          kneeR: [1.20, 0, 0],
        },
      };

    // ===================== BACK =====================
    case 'deadlift':
      return {
        prop: 'floor',
        weight: 'barbell',
        speed: 2.0,
        highlightJoint: 'back',
        labelEn: ['Hinge & Grip Bar', 'Lockout Hips'],
        labelHi: ['नीचे ग्रिप करें', 'सीधे खड़े हों'],
        poseA: baseStanding({
          rootPos: [0, 0.68, -0.10],
          spineRot: [0.95, 0, 0],
          headRot: [-0.45, 0, 0],
          shoulderL: [-0.90, 0, 0.12],
          shoulderR: [-0.90, 0, -0.12],
          elbowL: [-0.05, 0, 0],
          elbowR: [-0.05, 0, 0],
          hipL: [-1.05, 0, 0.08],
          hipR: [-1.05, 0, -0.08],
          kneeL: [0.95, 0, 0],
          kneeR: [0.95, 0, 0],
        }),
        poseB: baseStanding({
          rootPos: [0, 0.90, 0],
          spineRot: [0.02, 0, 0],
          shoulderL: [-0.10, 0, 0.15],
          shoulderR: [-0.10, 0, -0.15],
          elbowL: [-0.06, 0, 0],
          elbowR: [-0.06, 0, 0],
        }),
      };

    case 'pull_up':
    case 'chin_up': {
      const wide = key === 'pull_up';
      return {
        prop: 'pullup_bar',
        weight: 'none',
        speed: 2.1,
        highlightJoint: wide ? 'back' : 'arm_upper',
        labelEn: ['Full Hang Stretch', 'Pull Chest to Bar'],
        labelHi: ['पूरा नीचे लटकें', 'ऊपर बार तक खींचें'],
        poseA: {
          rootPos: [0, 1.08, 0],
          rootRot: [0, 0, 0],
          spineRot: [-0.05, 0, 0],
          headRot: [-0.25, 0, 0],
          shoulderL: [-2.95, 0, wide ? 0.35 : 0.08],
          shoulderR: [-2.95, 0, wide ? -0.35 : -0.08],
          elbowL: [-0.08, 0, 0],
          elbowR: [-0.08, 0, 0],
          hipL: [0.05, 0, 0.05],
          hipR: [0.05, 0, -0.05],
          kneeL: [0.65, 0, 0],
          kneeR: [0.65, 0, 0],
        },
        poseB: {
          rootPos: [0, 1.54, 0],
          rootRot: [0, 0, 0],
          spineRot: [-0.12, 0, 0],
          headRot: [-0.15, 0, 0],
          shoulderL: [-1.15, 0, wide ? 0.72 : 0.22],
          shoulderR: [-1.15, 0, wide ? -0.72 : -0.22],
          elbowL: [-2.18, 0, 0],
          elbowR: [-2.18, 0, 0],
          hipL: [0.05, 0, 0.05],
          hipR: [0.05, 0, -0.05],
          kneeL: [0.85, 0, 0],
          kneeR: [0.85, 0, 0],
        },
      };
    }

    case 'lat_pulldown':
      return {
        prop: 'cable_high',
        weight: 'cable_handle',
        speed: 2.2,
        highlightJoint: 'back',
        labelEn: ['Stretch Lats High', 'Pull to Collarbone'],
        labelHi: ['ऊपर स्ट्रेच करें', 'छाती तक खींचें'],
        poseA: baseStanding({
          rootPos: [0, 0.45, 0.20],
          spineRot: [-0.12, 0, 0],
          headRot: [-0.15, 0, 0],
          shoulderL: [-2.85, 0, 0.35],
          shoulderR: [-2.85, 0, -0.35],
          elbowL: [-0.15, 0, 0],
          elbowR: [-0.15, 0, 0],
          hipL: [-1.55, 0, 0.14],
          hipR: [-1.55, 0, -0.14],
          kneeL: [1.55, 0, 0],
          kneeR: [1.55, 0, 0],
        }),
        poseB: baseStanding({
          rootPos: [0, 0.45, 0.20],
          spineRot: [-0.22, 0, 0],
          headRot: [-0.10, 0, 0],
          shoulderL: [-0.95, 0, 0.85],
          shoulderR: [-0.95, 0, -0.85],
          elbowL: [-2.10, 0, 0],
          elbowR: [-2.10, 0, 0],
          hipL: [-1.55, 0, 0.14],
          hipR: [-1.55, 0, -0.14],
          kneeL: [1.55, 0, 0],
          kneeR: [1.55, 0, 0],
        }),
      };

    case 'barbell_row':
    case 'tbar_row':
      return {
        prop: 'floor',
        weight: 'barbell',
        speed: 2.3,
        highlightJoint: 'back',
        labelEn: ['Lower Weight', 'Row to Stomach'],
        labelHi: ['नीचे छोड़ें', 'कमर तक खींचें'],
        poseA: baseStanding({
          rootPos: [0, 0.80, -0.05],
          spineRot: [0.95, 0, 0],
          headRot: [-0.35, 0, 0],
          shoulderL: [-0.95, 0, 0.14],
          shoulderR: [-0.95, 0, -0.14],
          elbowL: [-0.10, 0, 0],
          elbowR: [-0.10, 0, 0],
          hipL: [-0.55, 0, 0.08],
          hipR: [-0.55, 0, -0.08],
          kneeL: [0.55, 0, 0],
          kneeR: [0.55, 0, 0],
        }),
        poseB: baseStanding({
          rootPos: [0, 0.80, -0.05],
          spineRot: [0.90, 0, 0],
          headRot: [-0.35, 0, 0],
          shoulderL: [0.45, 0, 0.22],
          shoulderR: [0.45, 0, -0.22],
          elbowL: [-1.95, 0, 0],
          elbowR: [-1.95, 0, 0],
          hipL: [-0.55, 0, 0.08],
          hipR: [-0.55, 0, -0.08],
          kneeL: [0.55, 0, 0],
          kneeR: [0.55, 0, 0],
        }),
      };

    case 'one_arm_dumbbell_row':
      return {
        prop: 'bench_flat',
        weight: 'dumbbell',
        speed: 2.3,
        highlightJoint: 'back',
        labelEn: ['Lower Dumbbell', 'Pull Elbow High'],
        labelHi: ['डंबल नीचे लाएं', 'कोहनी ऊपर खींचें'],
        poseA: baseStanding({
          rootPos: [0, 0.72, -0.10],
          spineRot: [1.18, 0, 0],
          headRot: [-0.30, 0, 0],
          shoulderL: [-1.15, 0, 0.05],
          shoulderR: [-1.15, 0, -0.10],
          elbowL: [-0.08, 0, 0],
          elbowR: [-0.08, 0, 0],
          hipL: [-0.65, 0, 0.12],
          hipR: [-0.25, 0, -0.12],
          kneeL: [0.95, 0, 0],
          kneeR: [0.35, 0, 0],
        }),
        poseB: baseStanding({
          rootPos: [0, 0.72, -0.10],
          spineRot: [1.14, 0.14, 0],
          headRot: [-0.30, 0, 0],
          shoulderL: [0.45, 0, 0.15],
          shoulderR: [-1.15, 0, -0.10],
          elbowL: [-1.95, 0, 0],
          elbowR: [-0.08, 0, 0],
          hipL: [-0.65, 0, 0.12],
          hipR: [-0.25, 0, -0.12],
          kneeL: [0.95, 0, 0],
          kneeR: [0.35, 0, 0],
        }),
      };

    case 'seated_cable_row':
      return {
        prop: 'cable_low',
        weight: 'cable_handle',
        speed: 2.2,
        highlightJoint: 'back',
        labelEn: ['Extend Forward', 'Row & Squeeze Back'],
        labelHi: ['आगे स्ट्रेच करें', 'पीठ स्क्वीज़ करें'],
        poseA: {
          rootPos: [0, 0.18, -0.20],
          rootRot: [0, 0, 0],
          spineRot: [0.22, 0, 0],
          headRot: [-0.1, 0, 0],
          shoulderL: [-1.42, 0, 0.08],
          shoulderR: [-1.42, 0, -0.08],
          elbowL: [-0.10, 0, 0],
          elbowR: [-0.10, 0, 0],
          hipL: [-1.48, 0, 0.08],
          hipR: [-1.48, 0, -0.08],
          kneeL: [0.20, 0, 0],
          kneeR: [0.20, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.18, -0.20],
          rootRot: [0, 0, 0],
          spineRot: [-0.12, 0, 0],
          headRot: [0.05, 0, 0],
          shoulderL: [0.38, 0, 0.18],
          shoulderR: [0.38, 0, -0.18],
          elbowL: [-1.85, 0, 0],
          elbowR: [-1.85, 0, 0],
          hipL: [-1.48, 0, 0.08],
          hipR: [-1.48, 0, -0.08],
          kneeL: [0.20, 0, 0],
          kneeR: [0.20, 0, 0],
        },
      };

    case 'doorframe_row':
      return {
        prop: 'pullup_bar',
        weight: 'none',
        speed: 2.3,
        highlightJoint: 'back',
        labelEn: ['Lean Back', 'Pull Chest Forward'],
        labelHi: ['पीछे झुकें', 'आगे खींचें'],
        poseA: baseStanding({
          rootPos: [0, 0.72, -0.28],
          rootRot: [-0.48, 0, 0],
          spineRot: [0.05, 0, 0],
          shoulderL: [-1.55, 0, 0.12],
          shoulderR: [-1.55, 0, -0.12],
          elbowL: [-0.08, 0, 0],
          elbowR: [-0.08, 0, 0],
          hipL: [0.10, 0, 0.08],
          hipR: [0.10, 0, -0.08],
          kneeL: [0.30, 0, 0],
          kneeR: [0.30, 0, 0],
        }),
        poseB: baseStanding({
          rootPos: [0, 0.82, -0.04],
          rootRot: [-0.22, 0, 0],
          spineRot: [-0.08, 0, 0],
          shoulderL: [0.35, 0, 0.24],
          shoulderR: [0.35, 0, -0.24],
          elbowL: [-1.95, 0, 0],
          elbowR: [-1.95, 0, 0],
          hipL: [0.08, 0, 0.08],
          hipR: [0.08, 0, -0.08],
          kneeL: [0.18, 0, 0],
          kneeR: [0.18, 0, 0],
        }),
      };

    case 'hyperextension':
    case 'superman':
      return {
        prop: 'floor',
        weight: 'none',
        speed: 2.0,
        highlightJoint: 'back',
        labelEn: ['Lower Control', 'Arch & Squeeze Back'],
        labelHi: ['नीचे रिलैक्स करें', 'ऊपर आर्च होल्ड करें'],
        poseA: {
          rootPos: [0, 0.13, 0],
          rootRot: [1.57, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [-0.2, 0, 0],
          shoulderL: [-2.85, 0, 0.18],
          shoulderR: [-2.85, 0, -0.18],
          elbowL: [-0.1, 0, 0],
          elbowR: [-0.1, 0, 0],
          hipL: [0, 0, 0.08],
          hipR: [0, 0, -0.08],
          kneeL: [0.04, 0, 0],
          kneeR: [0.04, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.14, 0],
          rootRot: [1.57, 0, 0],
          spineRot: [-0.38, 0, 0],
          headRot: [-0.35, 0, 0],
          shoulderL: [-2.55, 0, 0.25],
          shoulderR: [-2.55, 0, -0.25],
          elbowL: [-0.15, 0, 0],
          elbowR: [-0.15, 0, 0],
          hipL: [0.28, 0, 0.08],
          hipR: [0.28, 0, -0.08],
          kneeL: [0.06, 0, 0],
          kneeR: [0.06, 0, 0],
        },
      };

    // ===================== BICEPS =====================
    case 'bicep_curl':
    case 'cable_bicep_curl':
    case 'reverse_curl':
      return {
        prop: key === 'cable_bicep_curl' ? 'cable_low' : 'floor',
        weight: key === 'cable_bicep_curl' ? 'cable_handle' : 'barbell',
        speed: 2.3,
        highlightJoint: 'arm_upper',
        labelEn: ['Full Stretch Down', 'Curl & Squeeze Peak'],
        labelHi: ['नीचे पूरा खोलें', 'ऊपर कर्ल व स्क्वीज़ करें'],
        poseA: baseStanding({
          shoulderL: [-0.08, 0, 0.14],
          shoulderR: [-0.08, 0, -0.14],
          elbowL: [-0.12, 0, 0],
          elbowR: [-0.12, 0, 0],
        }),
        poseB: baseStanding({
          shoulderL: [-0.18, 0, 0.14],
          shoulderR: [-0.18, 0, -0.14],
          elbowL: [-2.28, 0, 0],
          elbowR: [-2.28, 0, 0],
        }),
      };

    case 'hammer_curl':
      return {
        prop: 'floor',
        weight: 'dumbbell',
        speed: 2.4,
        highlightJoint: 'arm_upper',
        labelEn: ['Lower Controlled', 'Hammer Curl Up'],
        labelHi: ['नीचे लाएं', 'हैमर कर्ल ऊपर'],
        poseA: baseStanding({
          shoulderL: [0, 0.3, 0.16],
          shoulderR: [0, -0.3, -0.16],
          elbowL: [-0.14, 0, 0],
          elbowR: [-0.14, 0, 0],
        }),
        poseB: baseStanding({
          shoulderL: [-0.18, 0.3, 0.16],
          shoulderR: [-0.18, -0.3, -0.16],
          elbowL: [-2.25, 0, 0],
          elbowR: [-2.25, 0, 0],
        }),
      };

    case 'incline_bicep_curl':
      return {
        prop: 'bench_incline',
        weight: 'dumbbell',
        speed: 2.1,
        highlightJoint: 'arm_upper',
        labelEn: ['Deep Bicep Stretch', 'Curl Up Slow'],
        labelHi: ['पीछे बाइसेप स्ट्रेच', 'धीरे कर्ल करें'],
        poseA: {
          rootPos: [0, 0.48, 0.08],
          rootRot: [-0.88, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [0.25, 0, 0],
          shoulderL: [0.85, 0, 0.22],
          shoulderR: [0.85, 0, -0.22],
          elbowL: [-0.12, 0, 0],
          elbowR: [-0.12, 0, 0],
          hipL: [-0.72, 0, 0.16],
          hipR: [-0.72, 0, -0.16],
          kneeL: [1.55, 0, 0],
          kneeR: [1.55, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.48, 0.08],
          rootRot: [-0.88, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [0.25, 0, 0],
          shoulderL: [0.70, 0, 0.22],
          shoulderR: [0.70, 0, -0.22],
          elbowL: [-2.22, 0, 0],
          elbowR: [-2.22, 0, 0],
          hipL: [-0.72, 0, 0.16],
          hipR: [-0.72, 0, -0.16],
          kneeL: [1.55, 0, 0],
          kneeR: [1.55, 0, 0],
        },
      };

    case 'concentration_curl':
      return {
        prop: 'bench_flat',
        weight: 'dumbbell',
        speed: 2.1,
        highlightJoint: 'arm_upper',
        labelEn: ['Stretch Arm Down', 'Peak Squeeze Up'],
        labelHi: ['नीचे स्ट्रेच करें', 'ऊपर पीक स्क्वीज़'],
        poseA: {
          rootPos: [0, 0.48, 0.10],
          rootRot: [0, 0, 0],
          spineRot: [0.55, 0, 0],
          headRot: [0.25, 0, 0],
          shoulderL: [-0.72, 0, -0.15],
          shoulderR: [-0.65, 0, -0.28],
          elbowL: [-0.15, 0, 0],
          elbowR: [-1.10, 0, 0.25],
          hipL: [-1.50, 0, 0.35],
          hipR: [-1.50, 0, -0.35],
          kneeL: [1.52, 0, 0],
          kneeR: [1.52, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.48, 0.10],
          rootRot: [0, 0, 0],
          spineRot: [0.55, 0, 0],
          headRot: [0.25, 0, 0],
          shoulderL: [-0.72, 0, -0.15],
          shoulderR: [-0.65, 0, -0.28],
          elbowL: [-2.28, 0, 0],
          elbowR: [-1.10, 0, 0.25],
          hipL: [-1.50, 0, 0.35],
          hipR: [-1.50, 0, -0.35],
          kneeL: [1.52, 0, 0],
          kneeR: [1.52, 0, 0],
        },
      };

    // ===================== TRICEPS =====================
    case 'tricep_pushdown':
      return {
        prop: 'cable_high',
        weight: 'cable_handle',
        speed: 2.4,
        highlightJoint: 'arm_back',
        labelEn: ['Bend Elbows Up', 'Lockout Down'],
        labelHi: ['कोहनी ऊपर मोड़ें', 'नीचे लॉक करें'],
        poseA: baseStanding({
          spineRot: [0.14, 0, 0],
          shoulderL: [-0.20, 0, 0.12],
          shoulderR: [-0.20, 0, -0.12],
          elbowL: [-2.05, 0, 0],
          elbowR: [-2.05, 0, 0],
        }),
        poseB: baseStanding({
          spineRot: [0.14, 0, 0],
          shoulderL: [-0.12, 0, 0.12],
          shoulderR: [-0.12, 0, -0.12],
          elbowL: [-0.12, 0, 0],
          elbowR: [-0.12, 0, 0],
        }),
      };

    case 'skull_crusher':
      return {
        prop: 'bench_flat',
        weight: 'barbell',
        speed: 2.2,
        highlightJoint: 'arm_back',
        labelEn: ['Lower Behind Brow', 'Extend Triceps'],
        labelHi: ['माथे के पीछे लाएं', 'ऊपर सीधा करें'],
        poseA: baseFlatBench({
          shoulderL: [-1.75, 0, 0.12],
          shoulderR: [-1.75, 0, -0.12],
          elbowL: [-1.95, 0, 0],
          elbowR: [-1.95, 0, 0],
        }),
        poseB: baseFlatBench({
          shoulderL: [-1.58, 0, 0.12],
          shoulderR: [-1.58, 0, -0.12],
          elbowL: [-0.08, 0, 0],
          elbowR: [-0.08, 0, 0],
        }),
      };

    case 'overhead_tricep_extension':
      return {
        prop: 'floor',
        weight: 'dumbbell',
        speed: 2.2,
        highlightJoint: 'arm_back',
        labelEn: ['Stretch Behind Head', 'Extend Overhead'],
        labelHi: ['सिर के पीछे लाएं', 'ऊपर पूरा सीधा करें'],
        poseA: baseStanding({
          shoulderL: [-2.95, 0, 0.08],
          shoulderR: [-2.95, 0, -0.08],
          elbowL: [-2.15, 0, 0],
          elbowR: [-2.15, 0, 0],
        }),
        poseB: baseStanding({
          shoulderL: [-2.95, 0, 0.08],
          shoulderR: [-2.95, 0, -0.08],
          elbowL: [-0.12, 0, 0],
          elbowR: [-0.12, 0, 0],
        }),
      };

    case 'close_grip_bench':
      return {
        prop: 'bench_flat',
        weight: 'barbell',
        speed: 2.3,
        highlightJoint: 'arm_back',
        labelEn: ['Tuck Elbows In', 'Lockout Triceps'],
        labelHi: ['कोहनी अंदर रखकर नीचे', 'ऊपर लॉक करें'],
        poseA: baseFlatBench({
          shoulderL: [-0.85, 0, 0.16],
          shoulderR: [-0.85, 0, -0.16],
          elbowL: [-1.65, 0, 0],
          elbowR: [-1.65, 0, 0],
        }),
        poseB: baseFlatBench({
          shoulderL: [-1.57, 0, 0.10],
          shoulderR: [-1.57, 0, -0.10],
          elbowL: [-0.08, 0, 0],
          elbowR: [-0.08, 0, 0],
        }),
      };

    case 'bench_dips':
      return {
        prop: 'bench_flat',
        weight: 'none',
        speed: 2.4,
        highlightJoint: 'arm_back',
        labelEn: ['Dip Below Bench', 'Press Up Straight'],
        labelHi: ['नीचे डिप करें', 'ऊपर पुश करें'],
        poseA: {
          rootPos: [0, 0.25, 0.28],
          rootRot: [0, 0, 0],
          spineRot: [0.15, 0, 0],
          headRot: [0, 0, 0],
          shoulderL: [1.05, 0, 0.14],
          shoulderR: [1.05, 0, -0.14],
          elbowL: [-1.55, 0, 0],
          elbowR: [-1.55, 0, 0],
          hipL: [-1.25, 0, 0.08],
          hipR: [-1.25, 0, -0.08],
          kneeL: [0.95, 0, 0],
          kneeR: [0.95, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.44, 0.28],
          rootRot: [0, 0, 0],
          spineRot: [0.10, 0, 0],
          headRot: [0, 0, 0],
          shoulderL: [0.42, 0, 0.12],
          shoulderR: [0.42, 0, -0.12],
          elbowL: [-0.10, 0, 0],
          elbowR: [-0.10, 0, 0],
          hipL: [-1.42, 0, 0.08],
          hipR: [-1.42, 0, -0.08],
          kneeL: [0.95, 0, 0],
          kneeR: [0.95, 0, 0],
        },
      };

    // ===================== SHOULDERS =====================
    case 'shoulder_press':
    case 'arnold_press':
      return {
        prop: 'floor',
        weight: key === 'arnold_press' ? 'dumbbell' : 'barbell',
        speed: 2.2,
        highlightJoint: 'shoulder',
        labelEn: ['Start at Chin Level', 'Press Overhead'],
        labelHi: ['कंधे के पास से', 'सीधा ऊपर पुश करें'],
        poseA: baseStanding({
          shoulderL: [-0.85, 0, 0.65],
          shoulderR: [-0.85, 0, -0.65],
          elbowL: [-1.75, 0, 0],
          elbowR: [-1.75, 0, 0],
        }),
        poseB: baseStanding({
          shoulderL: [-2.95, 0, 0.20],
          shoulderR: [-2.95, 0, -0.20],
          elbowL: [-0.10, 0, 0],
          elbowR: [-0.10, 0, 0],
        }),
      };

    case 'lateral_raise':
      return {
        prop: 'floor',
        weight: 'dumbbell',
        speed: 2.3,
        highlightJoint: 'shoulder',
        labelEn: ['Sides Controlled', 'Raise to Shoulder Line'],
        labelHi: ['नीचे कंट्रोल में', 'कंधे की सीध तक उठाएं'],
        poseA: baseStanding({
          shoulderL: [-0.05, 0, 0.14],
          shoulderR: [-0.05, 0, -0.14],
          elbowL: [-0.22, 0, 0],
          elbowR: [-0.22, 0, 0],
        }),
        poseB: baseStanding({
          shoulderL: [-0.10, 0, 1.48],
          shoulderR: [-0.10, 0, -1.48],
          elbowL: [-0.28, 0, 0],
          elbowR: [-0.28, 0, 0],
        }),
      };

    case 'front_raise':
      return {
        prop: 'floor',
        weight: 'dumbbell',
        speed: 2.3,
        highlightJoint: 'shoulder',
        labelEn: ['Down Front Thighs', 'Raise Eye Level'],
        labelHi: ['नीचे सामने रखें', 'आंखों के स्तर तक उठाएं'],
        poseA: baseStanding({
          shoulderL: [-0.10, 0, 0.10],
          shoulderR: [-0.10, 0, -0.10],
          elbowL: [-0.15, 0, 0],
          elbowR: [-0.15, 0, 0],
        }),
        poseB: baseStanding({
          shoulderL: [-1.62, 0, 0.08],
          shoulderR: [-1.62, 0, -0.08],
          elbowL: [-0.15, 0, 0],
          elbowR: [-0.15, 0, 0],
        }),
      };

    case 'face_pull':
      return {
        prop: 'cable_high',
        weight: 'cable_handle',
        speed: 2.3,
        highlightJoint: 'shoulder',
        labelEn: ['Reach Forward', 'Pull to Forehead'],
        labelHi: ['आगे स्ट्रेच करें', 'चेहरे की ओर खींचें'],
        poseA: baseStanding({
          spineRot: [-0.05, 0, 0],
          shoulderL: [-1.65, 0, 0.18],
          shoulderR: [-1.65, 0, -0.18],
          elbowL: [-0.15, 0, 0],
          elbowR: [-0.15, 0, 0],
        }),
        poseB: baseStanding({
          spineRot: [-0.12, 0, 0],
          shoulderL: [-1.45, -0.6, 1.15],
          shoulderR: [-1.45, 0.6, -1.15],
          elbowL: [-1.85, 0, 0],
          elbowR: [-1.85, 0, 0],
        }),
      };

    case 'shrugs':
      return {
        prop: 'floor',
        weight: 'dumbbell',
        speed: 2.5,
        highlightJoint: 'shoulder',
        labelEn: ['Relax Traps Down', 'Shrug High & Hold'],
        labelHi: ['कंधे नीचे ढीले छोड़ें', 'कंधे ऊपर उचकाएं'],
        poseA: baseStanding({
          shoulderL: [0.05, 0, 0.16],
          shoulderR: [0.05, 0, -0.16],
          headRot: [0, 0, 0],
        }),
        poseB: baseStanding({
          shoulderL: [-0.22, 0, 0.26],
          shoulderR: [-0.22, 0, -0.26],
          headRot: [0.08, 0, 0],
        }),
      };

    // ===================== LEGS =====================
    case 'barbell_squat':
      return {
        prop: 'floor',
        weight: 'barbell',
        speed: 2.0,
        highlightJoint: 'thigh',
        labelEn: ['Squat Deep Parallel', 'Drive Up Strong'],
        labelHi: ['नीचे पूरा स्क्वाट करें', 'ऊपर उठें'],
        poseA: baseStanding({
          rootPos: [0, 0.56, -0.05],
          spineRot: [0.42, 0, 0],
          headRot: [-0.25, 0, 0],
          shoulderL: [-1.25, 0, 0.85],
          shoulderR: [-1.25, 0, -0.85],
          elbowL: [-1.85, 0, 0],
          elbowR: [-1.85, 0, 0],
          hipL: [-1.35, 0, 0.16],
          hipR: [-1.35, 0, -0.16],
          kneeL: [1.55, 0, 0],
          kneeR: [1.55, 0, 0],
        }),
        poseB: baseStanding({
          shoulderL: [-1.25, 0, 0.85],
          shoulderR: [-1.25, 0, -0.85],
          elbowL: [-1.85, 0, 0],
          elbowR: [-1.85, 0, 0],
        }),
      };

    case 'air_squat':
      return {
        prop: 'floor',
        weight: 'none',
        speed: 2.3,
        highlightJoint: 'thigh',
        labelEn: ['Sit Hips Back', 'Stand Tall'],
        labelHi: ['हिप्स पीछे ले जाकर बैठें', 'सीधे खड़े हों'],
        poseA: baseStanding({
          rootPos: [0, 0.56, -0.05],
          spineRot: [0.40, 0, 0],
          headRot: [-0.22, 0, 0],
          shoulderL: [-1.45, 0, 0.08],
          shoulderR: [-1.45, 0, -0.08],
          elbowL: [-0.20, 0, 0],
          elbowR: [-0.20, 0, 0],
          hipL: [-1.35, 0, 0.16],
          hipR: [-1.35, 0, -0.16],
          kneeL: [1.55, 0, 0],
          kneeR: [1.55, 0, 0],
        }),
        poseB: baseStanding(),
      };

    case 'wall_sit':
      return {
        prop: 'wall',
        weight: 'none',
        speed: 1.5,
        isHold: true,
        highlightJoint: 'thigh',
        labelEn: ['Hold 90° Wall Sit', 'Hold Steady'],
        labelHi: ['दीवार से टिककर 90° होल्ड करें', 'स्थिर रखें'],
        poseA: baseStanding({
          rootPos: [0, 0.52, -0.16],
          spineRot: [-0.04, 0, 0],
          shoulderL: [-0.95, 0, 0.12],
          shoulderR: [-0.95, 0, -0.12],
          elbowL: [-0.30, 0, 0],
          elbowR: [-0.30, 0, 0],
          hipL: [-1.52, 0, 0.10],
          hipR: [-1.52, 0, -0.10],
          kneeL: [1.55, 0, 0],
          kneeR: [1.55, 0, 0],
        }),
        poseB: baseStanding({
          rootPos: [0, 0.53, -0.16],
          spineRot: [-0.04, 0, 0],
          shoulderL: [-0.90, 0, 0.12],
          shoulderR: [-0.90, 0, -0.12],
          elbowL: [-0.30, 0, 0],
          elbowR: [-0.30, 0, 0],
          hipL: [-1.52, 0, 0.10],
          hipR: [-1.52, 0, -0.10],
          kneeL: [1.55, 0, 0],
          kneeR: [1.55, 0, 0],
        }),
      };

    case 'romanian_deadlift':
      return {
        prop: 'floor',
        weight: 'barbell',
        speed: 2.0,
        highlightJoint: 'thigh',
        labelEn: ['Hinge Hips Back', 'Squeeze Glutes Up'],
        labelHi: ['हिप्स पीछे मोड़ें', 'ऊपर ग्लूट्स स्क्वीज़'],
        poseA: baseStanding({
          rootPos: [0, 0.84, -0.08],
          spineRot: [1.18, 0, 0],
          headRot: [-0.45, 0, 0],
          shoulderL: [-1.15, 0, 0.12],
          shoulderR: [-1.15, 0, -0.12],
          elbowL: [-0.05, 0, 0],
          elbowR: [-0.05, 0, 0],
          hipL: [-0.28, 0, 0.07],
          hipR: [-0.28, 0, -0.07],
          kneeL: [0.28, 0, 0],
          kneeR: [0.28, 0, 0],
        }),
        poseB: baseStanding(),
      };

    case 'bulgarian_split_squat':
      return {
        prop: 'elevated_step',
        weight: 'dumbbell',
        speed: 2.1,
        highlightJoint: 'thigh',
        labelEn: ['Drop Back Knee Low', 'Drive Front Heel'],
        labelHi: ['नीचे डिप करें', 'फ्रंट पैर से ऊपर उठें'],
        poseA: baseStanding({
          rootPos: [0, 0.60, 0.02],
          spineRot: [0.18, 0, 0],
          hipL: [-1.25, 0, 0.08],
          kneeL: [1.45, 0, 0],
          hipR: [0.45, 0, -0.08],
          kneeR: [1.25, 0, 0],
        }),
        poseB: baseStanding({
          rootPos: [0, 0.88, 0.02],
          hipL: [-0.30, 0, 0.08],
          kneeL: [0.25, 0, 0],
          hipR: [0.42, 0, -0.08],
          kneeR: [0.80, 0, 0],
        }),
      };

    case 'lunges':
      return {
        prop: 'floor',
        weight: 'dumbbell',
        speed: 2.2,
        highlightJoint: 'thigh',
        labelEn: ['Drop Knee 90°', 'Step Back Up'],
        labelHi: ['नीचे 90° लंज करें', 'वापस ऊपर आएं'],
        poseA: baseStanding({
          rootPos: [0, 0.58, 0],
          spineRot: [0.08, 0, 0],
          hipL: [-1.35, 0, 0.07],
          kneeL: [1.45, 0, 0],
          hipR: [0.48, 0, -0.07],
          kneeR: [1.25, 0, 0],
        }),
        poseB: baseStanding(),
      };

    case 'leg_press':
      return {
        prop: 'leg_machine',
        weight: 'none',
        speed: 2.2,
        highlightJoint: 'thigh',
        labelEn: ['Tuck Knees In', 'Press Strong'],
        labelHi: ['घुटने छाती की तरफ', 'आगे पूरा पुश करें'],
        poseA: {
          rootPos: [0, 0.56, -0.08],
          rootRot: [-0.75, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [0.25, 0, 0],
          shoulderL: [-0.15, 0, 0.18],
          shoulderR: [-0.15, 0, -0.18],
          elbowL: [-0.45, 0, 0],
          elbowR: [-0.45, 0, 0],
          hipL: [-1.45, 0, 0.12],
          hipR: [-1.45, 0, -0.12],
          kneeL: [1.75, 0, 0],
          kneeR: [1.75, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.56, -0.08],
          rootRot: [-0.75, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [0.25, 0, 0],
          shoulderL: [-0.15, 0, 0.18],
          shoulderR: [-0.15, 0, -0.18],
          elbowL: [-0.45, 0, 0],
          elbowR: [-0.45, 0, 0],
          hipL: [-0.95, 0, 0.12],
          hipR: [-0.95, 0, -0.12],
          kneeL: [0.15, 0, 0],
          kneeR: [0.15, 0, 0],
        },
      };

    case 'leg_extension':
      return {
        prop: 'leg_machine',
        weight: 'none',
        speed: 2.3,
        highlightJoint: 'thigh',
        labelEn: ['Bend Down', 'Extend & Squeeze Quads'],
        labelHi: ['नीचे मोड़ें', 'ऊपर पूरा सीधा करें'],
        poseA: baseStanding({
          rootPos: [0, 0.54, 0],
          spineRot: [-0.12, 0, 0],
          shoulderL: [0.10, 0, 0.25],
          shoulderR: [0.10, 0, -0.25],
          hipL: [-1.52, 0, 0.12],
          hipR: [-1.52, 0, -0.12],
          kneeL: [1.55, 0, 0],
          kneeR: [1.55, 0, 0],
        }),
        poseB: baseStanding({
          rootPos: [0, 0.54, 0],
          spineRot: [-0.12, 0, 0],
          shoulderL: [0.10, 0, 0.25],
          shoulderR: [0.10, 0, -0.25],
          hipL: [-1.52, 0, 0.12],
          hipR: [-1.52, 0, -0.12],
          kneeL: [0.08, 0, 0],
          kneeR: [0.08, 0, 0],
        }),
      };

    case 'lying_leg_curl':
      return {
        prop: 'bench_flat',
        weight: 'none',
        speed: 2.3,
        highlightJoint: 'thigh',
        labelEn: ['Legs Extended', 'Curl Heels to Glutes'],
        labelHi: ['पैर सीधे रखें', 'एड़ी ऊपर कर्ल करें'],
        poseA: {
          rootPos: [0, 0.54, -0.05],
          rootRot: [1.57, 0, 0],
          spineRot: [-0.08, 0, 0],
          headRot: [-0.2, 0, 0],
          shoulderL: [-0.85, 0, 0.25],
          shoulderR: [-0.85, 0, -0.25],
          elbowL: [-1.2, 0, 0],
          elbowR: [-1.2, 0, 0],
          hipL: [0, 0, 0.08],
          hipR: [0, 0, -0.08],
          kneeL: [0.12, 0, 0],
          kneeR: [0.12, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.54, -0.05],
          rootRot: [1.57, 0, 0],
          spineRot: [-0.08, 0, 0],
          headRot: [-0.2, 0, 0],
          shoulderL: [-0.85, 0, 0.25],
          shoulderR: [-0.85, 0, -0.25],
          elbowL: [-1.2, 0, 0],
          elbowR: [-1.2, 0, 0],
          hipL: [0, 0, 0.08],
          hipR: [0, 0, -0.08],
          kneeL: [2.05, 0, 0],
          kneeR: [2.05, 0, 0],
        },
      };

    case 'calf_raise':
      return {
        prop: 'floor',
        weight: 'dumbbell',
        speed: 2.5,
        highlightJoint: 'calf',
        labelEn: ['Lower Heels', 'Push High on Toes'],
        labelHi: ['एड़ी नीचे लाएं', 'पंजों पर ऊंचा उठाएं'],
        poseA: baseStanding({
          rootPos: [0, 0.90, 0],
          ankleL: [0, 0, 0],
          ankleR: [0, 0, 0],
        }),
        poseB: baseStanding({
          rootPos: [0, 0.99, 0],
          ankleL: [0.48, 0, 0],
          ankleR: [0.48, 0, 0],
        }),
      };

    case 'glute_bridge':
      return {
        prop: 'floor',
        weight: 'none',
        speed: 2.2,
        highlightJoint: 'glute',
        labelEn: ['Lower Hips Lightly', 'Bridge & Squeeze Glutes'],
        labelHi: ['हिप्स नीचे लाएं', 'ऊपर उठाकर स्क्वीज़ करें'],
        poseA: {
          rootPos: [0, 0.13, 0],
          rootRot: [-1.57, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [0.15, 0, 0],
          shoulderL: [-0.15, 0, 0.25],
          shoulderR: [-0.15, 0, -0.25],
          elbowL: [-0.05, 0, 0],
          elbowR: [-0.05, 0, 0],
          hipL: [-1.15, 0, 0.10],
          hipR: [-1.15, 0, -0.10],
          kneeL: [1.95, 0, 0],
          kneeR: [1.95, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.34, 0.06],
          rootRot: [-1.18, 0, 0],
          spineRot: [-0.10, 0, 0],
          headRot: [0.25, 0, 0],
          shoulderL: [0.25, 0, 0.25],
          shoulderR: [0.25, 0, -0.25],
          elbowL: [-0.05, 0, 0],
          elbowR: [-0.05, 0, 0],
          hipL: [-0.35, 0, 0.10],
          hipR: [-0.35, 0, -0.10],
          kneeL: [1.55, 0, 0],
          kneeR: [1.55, 0, 0],
        },
      };

    // ===================== ABS / CORE =====================
    case 'hanging_leg_raise':
      return {
        prop: 'pullup_bar',
        weight: 'none',
        speed: 2.1,
        highlightJoint: 'core',
        labelEn: ['Hang Controlled', 'Lift Legs 90°+'],
        labelHi: ['सीधे लटकें', 'पैर ऊपर 90° उठाएं'],
        poseA: {
          rootPos: [0, 1.08, 0],
          rootRot: [0, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [0, 0, 0],
          shoulderL: [-3.02, 0, 0.18],
          shoulderR: [-3.02, 0, -0.18],
          elbowL: [-0.05, 0, 0],
          elbowR: [-0.05, 0, 0],
          hipL: [0, 0, 0.04],
          hipR: [0, 0, -0.04],
          kneeL: [0.05, 0, 0],
          kneeR: [0.05, 0, 0],
        },
        poseB: {
          rootPos: [0, 1.08, 0],
          rootRot: [-0.15, 0, 0],
          spineRot: [0.15, 0, 0],
          headRot: [0.1, 0, 0],
          shoulderL: [-3.02, 0, 0.18],
          shoulderR: [-3.02, 0, -0.18],
          elbowL: [-0.05, 0, 0],
          elbowR: [-0.05, 0, 0],
          hipL: [-1.72, 0, 0.04],
          hipR: [-1.72, 0, -0.04],
          kneeL: [0.10, 0, 0],
          kneeR: [0.10, 0, 0],
        },
      };

    case 'floor_leg_raises':
      return {
        prop: 'floor',
        weight: 'none',
        speed: 2.1,
        highlightJoint: 'core',
        labelEn: ['Lower Just Above Mat', 'Raise Legs 90°'],
        labelHi: ['जमीन से हल्का ऊपर', 'पैर 90° ऊपर उठाएं'],
        poseA: {
          rootPos: [0, 0.13, 0],
          rootRot: [-1.57, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [0.1, 0, 0],
          shoulderL: [-0.1, 0, 0.2],
          shoulderR: [-0.1, 0, -0.2],
          elbowL: [-0.05, 0, 0],
          elbowR: [-0.05, 0, 0],
          hipL: [-0.12, 0, 0.04],
          hipR: [-0.12, 0, -0.04],
          kneeL: [0.05, 0, 0],
          kneeR: [0.05, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.13, 0],
          rootRot: [-1.57, 0, 0],
          spineRot: [0.15, 0, 0],
          headRot: [0.15, 0, 0],
          shoulderL: [-0.1, 0, 0.2],
          shoulderR: [-0.1, 0, -0.2],
          elbowL: [-0.05, 0, 0],
          elbowR: [-0.05, 0, 0],
          hipL: [-1.55, 0, 0.04],
          hipR: [-1.55, 0, -0.04],
          kneeL: [0.05, 0, 0],
          kneeR: [0.05, 0, 0],
        },
      };

    case 'bicycle_crunches':
      return {
        prop: 'floor',
        weight: 'none',
        speed: 3.0,
        highlightJoint: 'core',
        labelEn: ['Twist Left Side', 'Twist Right Side'],
        labelHi: ['बाएं ट्विस्ट करें', 'दाएं ट्विस्ट करें'],
        poseA: {
          rootPos: [0, 0.13, 0],
          rootRot: [-1.57, 0, 0],
          spineRot: [0.42, -0.38, 0],
          headRot: [0.25, 0, 0],
          shoulderL: [-2.1, 0, 0.55],
          shoulderR: [-2.1, 0, -0.55],
          elbowL: [-2.05, 0, 0],
          elbowR: [-2.05, 0, 0],
          hipL: [-1.65, 0, 0.06],
          kneeL: [1.65, 0, 0],
          hipR: [-0.25, 0, -0.06],
          kneeR: [0.12, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.13, 0],
          rootRot: [-1.57, 0, 0],
          spineRot: [0.42, 0.38, 0],
          headRot: [0.25, 0, 0],
          shoulderL: [-2.1, 0, 0.55],
          shoulderR: [-2.1, 0, -0.55],
          elbowL: [-2.05, 0, 0],
          elbowR: [-2.05, 0, 0],
          hipL: [-0.25, 0, 0.06],
          kneeL: [0.12, 0, 0],
          hipR: [-1.65, 0, -0.06],
          kneeR: [1.65, 0, 0],
        },
      };

    case 'russian_twists':
      return {
        prop: 'floor',
        weight: 'none',
        speed: 2.9,
        highlightJoint: 'core',
        labelEn: ['Rotate Left', 'Rotate Right'],
        labelHi: ['बाएं घूमें', 'दाएं घूमें'],
        poseA: {
          rootPos: [0, 0.18, 0],
          rootRot: [-0.42, 0, 0],
          spineRot: [0.25, 0.72, 0],
          headRot: [0.1, -0.35, 0],
          shoulderL: [-1.1, 0, 0.05],
          shoulderR: [-1.1, 0, -0.05],
          elbowL: [-1.2, 0, -0.3],
          elbowR: [-1.2, 0, 0.3],
          hipL: [-1.45, 0, 0.06],
          hipR: [-1.45, 0, -0.06],
          kneeL: [1.35, 0, 0],
          kneeR: [1.35, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.18, 0],
          rootRot: [-0.42, 0, 0],
          spineRot: [0.25, -0.72, 0],
          headRot: [0.1, 0.35, 0],
          shoulderL: [-1.1, 0, 0.05],
          shoulderR: [-1.1, 0, -0.05],
          elbowL: [-1.2, 0, -0.3],
          elbowR: [-1.2, 0, 0.3],
          hipL: [-1.45, 0, 0.06],
          hipR: [-1.45, 0, -0.06],
          kneeL: [1.35, 0, 0],
          kneeR: [1.35, 0, 0],
        },
      };

    case 'plank':
      return {
        prop: 'floor',
        weight: 'none',
        speed: 1.4,
        isHold: true,
        highlightJoint: 'core',
        labelEn: ['Brace Core & Glutes', 'Hold Straight Line'],
        labelHi: ['कोर टाइट होल्ड करें', 'शरीर सीधा रखें'],
        poseA: {
          rootPos: [0, 0.25, -0.06],
          rootRot: [1.42, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [-0.30, 0, 0],
          shoulderL: [-1.42, 0, 0.08],
          shoulderR: [-1.42, 0, -0.08],
          elbowL: [-1.55, 0, 0],
          elbowR: [-1.55, 0, 0],
          hipL: [0, 0, 0.06],
          hipR: [0, 0, -0.06],
          kneeL: [0.02, 0, 0],
          kneeR: [0.02, 0, 0],
          ankleL: [1.05, 0, 0],
          ankleR: [1.05, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.26, -0.06],
          rootRot: [1.41, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [-0.30, 0, 0],
          shoulderL: [-1.42, 0, 0.08],
          shoulderR: [-1.42, 0, -0.08],
          elbowL: [-1.55, 0, 0],
          elbowR: [-1.55, 0, 0],
          hipL: [0, 0, 0.06],
          hipR: [0, 0, -0.06],
          kneeL: [0.02, 0, 0],
          kneeR: [0.02, 0, 0],
          ankleL: [1.05, 0, 0],
          ankleR: [1.05, 0, 0],
        },
      };

    case 'mountain_climbers':
      return {
        prop: 'floor',
        weight: 'none',
        speed: 4.2,
        highlightJoint: 'core',
        labelEn: ['Drive Left Knee', 'Drive Right Knee'],
        labelHi: ['बायां घुटना आगे', 'दायां घुटना आगे'],
        poseA: {
          rootPos: [0, 0.36, -0.04],
          rootRot: [1.18, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [-0.28, 0, 0],
          shoulderL: [-1.18, 0, 0.14],
          shoulderR: [-1.18, 0, -0.14],
          elbowL: [-0.06, 0, 0],
          elbowR: [-0.06, 0, 0],
          hipL: [-1.62, 0, 0.06],
          kneeL: [1.72, 0, 0],
          hipR: [0.04, 0, -0.06],
          kneeR: [0.04, 0, 0],
        },
        poseB: {
          rootPos: [0, 0.36, -0.04],
          rootRot: [1.18, 0, 0],
          spineRot: [0, 0, 0],
          headRot: [-0.28, 0, 0],
          shoulderL: [-1.18, 0, 0.14],
          shoulderR: [-1.18, 0, -0.14],
          elbowL: [-0.06, 0, 0],
          elbowR: [-0.06, 0, 0],
          hipL: [0.04, 0, 0.06],
          kneeL: [0.04, 0, 0],
          hipR: [-1.62, 0, -0.06],
          kneeR: [1.72, 0, 0],
        },
      };

    default:
      return {
        prop: 'floor',
        weight: 'none',
        speed: 2.2,
        highlightJoint: 'core',
        labelEn: ['Control Down', 'Power Up'],
        labelHi: ['नियंत्रण में नीचे', 'ताकत से ऊपर'],
        poseA: baseStanding({
          rootPos: [0, 0.70, 0],
          hipL: [-0.95, 0, 0.12],
          hipR: [-0.95, 0, -0.12],
          kneeL: [1.15, 0, 0],
          kneeR: [1.15, 0, 0],
        }),
        poseB: baseStanding(),
      };
  }
}
