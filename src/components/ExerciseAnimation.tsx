import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Maximize2, Minimize2, RotateCw } from 'lucide-react';
import { AppLanguage, MuscleGroup } from '../types';
import { createGymStage, AthleteRig } from '../three/athleteCharacter';
import { getAnim3DSpec } from '../three/exercisePoses';

interface ExerciseAnimationProps {
  animationKey: string;
  targetMuscle: MuscleGroup;
  isPlaying?: boolean;
  phase?: 'work' | 'rest';
  language?: AppLanguage;
  compact?: boolean;
}

type CameraAnglePreset = 'auto360' | '3d' | 'front' | 'side' | 'back' | 'top';

const MUSCLE_ACCENT_HEX: Record<MuscleGroup, number> = {
  chest: 0xf97316,
  back: 0x06b6d4,
  biceps: 0xf59e0b,
  triceps: 0xeab308,
  shoulders: 0xa855f7,
  legs: 0x10b981,
  abs: 0xf43f5e,
};

const ANGLE_TARGETS: Record<Exclude<CameraAnglePreset, 'auto360'>, [number, number, number]> = {
  '3d': [1.95, 1.48, 2.25],
  front: [0.0, 1.25, 2.85],
  side: [2.85, 1.22, 0.0],
  back: [0.0, 1.32, -2.85],
  top: [0.0, 3.35, 0.95],
};

// Reusable module-scope math objects (zero GC per frame)
const _camGoal = new THREE.Vector3();
const _targetGoal = new THREE.Vector3(0, 0.88, 0);

// Smooth natural exercise rep curve with subtle peak squeeze dwell
function repCadenceCurve(rawPhase: number): number {
  const s = 0.5 - 0.5 * Math.cos(rawPhase);
  return s * s * (3 - 2 * s);
}

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({
  animationKey,
  targetMuscle,
  isPlaying = true,
  phase = 'work',
  language = 'en',
  compact = false,
}) => {
  const isEn = language === 'en';
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [anglePreset, setAnglePreset] = useState<CameraAnglePreset>('auto360');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [repDirection, setRepDirection] = useState<0 | 1>(0);

  // Refs for live props inside persistent WebGL loop (no canvas teardown on prop updates)
  const animKeyRef = useRef<string>(animationKey);
  const muscleRef = useRef<MuscleGroup>(targetMuscle);
  const isPlayingRef = useRef<boolean>(isPlaying);
  const phaseRef = useRef<'work' | 'rest'>(phase);
  const anglePresetRef = useRef<CameraAnglePreset>(anglePreset);
  const cameraTransitionRef = useRef<boolean>(false);

  animKeyRef.current = animationKey;
  muscleRef.current = targetMuscle;
  isPlayingRef.current = isPlaying;
  phaseRef.current = phase;

  const handleSelectAngle = (preset: CameraAnglePreset) => {
    anglePresetRef.current = preset;
    setAnglePreset(preset);
    cameraTransitionRef.current = preset !== 'auto360';
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL detection (only used for rendering cost / pacing)
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = Math.max(container.clientWidth || 400, 200);
    const height = Math.max(container.clientHeight || 220, 160);

    // 2. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.14;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Scene, Environment & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b14);
    scene.fog = new THREE.Fog(0x070b14, 5.8, 12.0);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 30);
    camera.position.set(1.95, 1.48, 2.25);

    // 4. OrbitControls (full 360° interactive drag + zoom)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.88, 0);
    controls.enablePan = false;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 1.45;
    controls.maxDistance = 4.8;
    controls.minPolarAngle = 0.12;
    controls.maxPolarAngle = Math.PI * 0.48;

    const onControlStart = () => {
      cameraTransitionRef.current = false;
      if (anglePresetRef.current === 'auto360') {
        anglePresetRef.current = '3d';
        setAnglePreset('3d');
      }
    };
    controls.addEventListener('start', onControlStart);

    // 5. Balanced 3-Point Warm/Cool Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xc7e2ff, 0x1e293b, 0.82);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.25);
    keyLight.position.set(2.8, 4.2, 3.0);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 12;
      keyLight.shadow.camera.left = -2.2;
      keyLight.shadow.camera.right = 2.2;
      keyLight.shadow.camera.top = 2.6;
      keyLight.shadow.camera.bottom = -2.2;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.12);
    rimLight.position.set(-2.6, 2.4, -2.8);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xfef3c7, 0.6);
    fillLight.position.set(-2.4, 1.4, 2.2);
    scene.add(fillLight);

    // 6. Sculpted Anatomical Athlete Character & Gym Stage
    const rig: AthleteRig = createGymStage(scene, renderer, isSoftwareGl);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 7. ResizeObserver for responsive layout & Expand toggle
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(Math.floor(entry.contentRect.width), 200);
        const h = Math.max(Math.floor(entry.contentRect.height), 160);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // 8. Frame-rate independent animation & software-WebGL pacing loop
    let frameId = 0;
    let disposed = false;
    let lastTime = performance.now();
    let repPhase = 0;
    let breathTime = 0;
    let orbitTheta = Math.atan2(camera.position.x, camera.position.z);
    let lastDir: 0 | 1 = 0;

    const afterDraw = (cb: () => void) => {
      try {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        if (gl && typeof gl.fenceSync === 'function') {
          const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
          gl.flush();
          const poll = () => {
            if (disposed) return;
            const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
            if (state === gl.UNSIGNALED) {
              frameId = window.setTimeout(poll, 5);
            } else {
              if (sync) gl.deleteSync(sync);
              frameId = window.setTimeout(cb, 80);
            }
          };
          frameId = window.setTimeout(poll, 5);
          return;
        }
      } catch {
        // Fallback pacing
      }
      frameId = window.setTimeout(cb, 80);
    };

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      const spec = getAnim3DSpec(animKeyRef.current);
      const accentHex = MUSCLE_ACCENT_HEX[muscleRef.current] ?? 0xf59e0b;

      breathTime += dt * 2.2;
      const shouldMove = isPlayingRef.current && phaseRef.current === 'work';
      if (shouldMove) {
        repPhase += dt * spec.speed;
      }

      const t = phaseRef.current === 'rest' ? 0.5 : repCadenceCurve(repPhase);
      const dir: 0 | 1 = Math.sin(repPhase) >= 0 ? 1 : 0;
      if (dir !== lastDir) {
        lastDir = dir;
        setRepDirection(dir);
      }

      const targetCenterY =
        spec.prop === 'pullup_bar'
          ? 1.32
          : spec.prop === 'floor' && Math.abs(spec.poseA.rootRot[0]) > 1.0
          ? 0.34
          : 0.86;
      _targetGoal.set(0, targetCenterY, 0);
      controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetGoal.y, 6, dt);

      rig.applyPose(
        spec.poseA,
        spec.poseB,
        t,
        spec.weight,
        spec.prop,
        spec.highlightJoint,
        accentHex,
        t,
        breathTime
      );

      if (anglePresetRef.current === 'auto360') {
        orbitTheta += dt * 0.52;
        const radius = 2.8;
        const camY = targetCenterY + 0.5;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, Math.sin(orbitTheta) * radius, 5, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, Math.cos(orbitTheta) * radius, 5, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, camY, 5, dt);
      } else if (cameraTransitionRef.current) {
        const presetVec = ANGLE_TARGETS[anglePresetRef.current];
        _camGoal.set(presetVec[0], presetVec[1] + (targetCenterY - 0.85) * 0.65, presetVec[2]);
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _camGoal.x, 7, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _camGoal.y, 7, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _camGoal.z, 7, dt);
        if (camera.position.distanceToSquared(_camGoal) < 0.002) {
          cameraTransitionRef.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.dispose();
      rig.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const spec = getAnim3DSpec(animationKey);
  const moveText =
    phase === 'rest'
      ? isEn
        ? 'Rest Interval'
        : 'रेस्ट समय'
      : spec.isHold
      ? isEn
        ? spec.labelEn[0]
        : spec.labelHi[0]
      : repDirection === 1
      ? isEn
        ? spec.labelEn[1]
        : spec.labelHi[1]
      : isEn
      ? spec.labelEn[0]
      : spec.labelHi[0];

  const heightClass = isExpanded
    ? 'h-80 sm:h-96'
    : compact
    ? 'h-56 sm:h-64'
    : 'h-64 sm:h-72';

  const angleButtons: { id: CameraAnglePreset; labelEn: string; labelHi: string }[] = [
    { id: 'auto360', labelEn: '360°', labelHi: '360°' },
    { id: '3d', labelEn: '3D', labelHi: '3D' },
    { id: 'front', labelEn: 'Front', labelHi: 'सामने' },
    { id: 'side', labelEn: 'Side', labelHi: 'साइड' },
    { id: 'back', labelEn: 'Back', labelHi: 'पीछे' },
    { id: 'top', labelEn: 'Top', labelHi: 'ऊपर' },
  ];

  return (
    <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
      {/* Clean Top Bar (Zero pulsating dots, zero Inhale/Exhale clutter) */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/95 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-sm shrink-0"
            style={{
              backgroundColor: `#${(MUSCLE_ACCENT_HEX[targetMuscle] ?? 0xf59e0b)
                .toString(16)
                .padStart(6, '0')}`,
            }}
          />
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 truncate">
            {isEn ? '3D Character' : '3D एनिमेशन'}
          </span>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            • {isEn ? 'Drag to rotate' : 'घुमाने के लिए ड्रैग करें'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-emerald-950/70 text-emerald-300 border-emerald-700/50">
            {moveText}
          </span>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition"
            title={isExpanded ? (isEn ? 'Compact View' : 'छोटा देखें') : (isEn ? 'Larger View' : 'बड़ा देखें')}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Isolated 3D WebGL Viewport Container */}
      <div className="relative w-full">
        <div
          ref={mountRef}
          className={`w-full ${heightClass} transition-[height] duration-300 cursor-grab active:cursor-grabbing touch-none`}
        />

        {/* Unified Bottom Angle Dock */}
        <div className="bg-slate-900/95 border-t border-slate-800/90 px-2.5 py-2 flex items-center justify-center gap-1.5 flex-wrap">
          {angleButtons.map((btn) => {
            const active = anglePreset === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => handleSelectAngle(btn.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition flex items-center gap-1 ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {btn.id === 'auto360' && <RotateCw className="w-3 h-3" />}
                <span>{isEn ? btn.labelEn : btn.labelHi}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
