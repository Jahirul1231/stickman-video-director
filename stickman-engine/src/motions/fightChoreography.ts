import { StickmanPose, Vector3Tuple } from '../types';

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpV3(a: Vector3Tuple, b: Vector3Tuple, t: number): Vector3Tuple {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export interface FightFrameData {
  fighterCyan: StickmanPose;
  fighterRed: StickmanPose;
  cameraPos: Vector3Tuple;
  cameraTarget: Vector3Tuple;
  cameraFov: number;
  slowMoActive: boolean;
  impactActive: boolean;
  shockwaveProgress: number; // 0 to 1
  screenShake: number;
  headline: string;
  subtext: string;
  speedLines: boolean;
}

export function computeFightFrame(frame: number, fps = 30): FightFrameData {
  // Total 450 frames (15 seconds)

  // Default Stances
  const cyanStance: StickmanPose = {
    position: [-2.4, 1.5, 0],
    rotation: [0, 1.2, 0],
    head: [0, -0.2, 0],
    torso: [0.1, 0.2, 0],
    leftArm: { shoulder: [0.8, 0.4, 0.4], elbow: [-1.4, 0, 0] },
    rightArm: { shoulder: [0.5, -0.3, -0.3], elbow: [-1.6, 0, 0] },
    leftLeg: { hip: [0.3, 0, 0.1], knee: [0.5, 0, 0] },
    rightLeg: { hip: [-0.3, 0, -0.1], knee: [0.6, 0, 0] },
  };

  const redStance: StickmanPose = {
    position: [2.4, 1.5, 0],
    rotation: [0, -1.2, 0],
    head: [0, 0.2, 0],
    torso: [0.1, -0.2, 0],
    leftArm: { shoulder: [0.5, 0.3, 0.3], elbow: [-1.6, 0, 0] },
    rightArm: { shoulder: [0.8, -0.4, -0.4], elbow: [-1.4, 0, 0] },
    leftLeg: { hip: [-0.3, 0, 0.1], knee: [0.6, 0, 0] },
    rightLeg: { hip: [0.3, 0, -0.1], knee: [0.5, 0, 0] },
  };

  // PHASE 1: Face-off & Standoff (0 - 60)
  if (frame < 60) {
    const t = frame / 60;
    const breathe = Math.sin(t * Math.PI * 2) * 0.03;
    const camZ = lerp(6.5, 4.8, t);
    const camX = lerp(-1.5, 1.0, t);

    return {
      fighterCyan: {
        ...cyanStance,
        position: [-2.4, 1.5 + breathe, 0],
      },
      fighterRed: {
        ...redStance,
        position: [2.4, 1.5 - breathe, 0],
      },
      cameraPos: [camX, 2.0, camZ],
      cameraTarget: [0, 1.4, 0],
      cameraFov: 42,
      slowMoActive: false,
      impactActive: false,
      shockwaveProgress: 0,
      screenShake: 0,
      headline: 'NEON SHOWDOWN',
      subtext: 'CYAN VS CRIMSON',
      speedLines: false,
    };
  }

  // PHASE 2: High-Speed Dash & Mid-Range Exchange (60 - 150)
  if (frame < 150) {
    const t = (frame - 60) / 90;
    const dashProgress = Math.min(1, (frame - 60) / 25);
    const cyanX = lerp(-2.4, -0.6, dashProgress);
    const redX = lerp(2.4, 0.6, dashProgress);

    const comboCycle = (frame - 85) * 0.4;
    const punchCyan = Math.sin(comboCycle);
    const punchRed = Math.cos(comboCycle);

    return {
      fighterCyan: {
        ...cyanStance,
        position: [cyanX, 1.5, 0],
        rotation: [0, 1.4, 0],
        leftArm: { shoulder: [punchCyan * 1.5, 0.2, 0.2], elbow: [-0.4, 0, 0] },
        rightArm: { shoulder: [-punchCyan * 1.5, -0.2, -0.2], elbow: [-1.2, 0, 0] },
      },
      fighterRed: {
        ...redStance,
        position: [redX, 1.5, 0],
        rotation: [0, -1.4, 0],
        leftArm: { shoulder: [-punchRed * 1.5, 0.2, 0.2], elbow: [-1.2, 0, 0] },
        rightArm: { shoulder: [punchRed * 1.5, -0.2, -0.2], elbow: [-0.4, 0, 0] },
      },
      cameraPos: [0, 1.8, 3.8 + Math.sin(t * 10) * 0.1],
      cameraTarget: [0, 1.4, 0],
      cameraFov: 45,
      slowMoActive: false,
      impactActive: Math.abs(punchCyan) > 0.8,
      shockwaveProgress: 0,
      screenShake: Math.abs(punchCyan) > 0.8 ? 8 : 0,
      headline: 'HIGH SPEED COMBAT',
      subtext: 'RAPID STRIKES & BLOCKS',
      speedLines: true,
    };
  }

  // PHASE 3: The Launch into the Air (150 - 210)
  if (frame < 210) {
    const t = (frame - 150) / 60;
    // Parabolic leap upwards
    const jumpY = 1.5 + Math.sin(t * Math.PI * 0.5) * 2.2;

    return {
      fighterCyan: {
        ...cyanStance,
        position: [lerp(-0.6, -0.8, t), jumpY, lerp(0, -0.2, t)],
        rotation: [t * 0.6, 1.1, 0],
        leftLeg: { hip: [0.8, 0, 0], knee: [1.2, 0, 0] },
        rightLeg: { hip: [-0.4, 0, 0], knee: [0.2, 0, 0] },
      },
      fighterRed: {
        ...redStance,
        position: [lerp(0.6, 0.8, t), jumpY * 1.05, lerp(0, 0.2, t)],
        rotation: [-t * 0.8, -1.1, -0.2],
        leftArm: { shoulder: [-0.8, 0, 0.5], elbow: [-0.4, 0, 0] },
        rightArm: { shoulder: [0.8, 0, -0.5], elbow: [-0.4, 0, 0] },
      },
      cameraPos: [0, jumpY * 0.9 + 1.0, 4.2],
      cameraTarget: [0, jumpY, 0],
      cameraFov: 48,
      slowMoActive: false,
      impactActive: false,
      shockwaveProgress: 0,
      screenShake: 2,
      headline: 'AERIAL LAUNCH',
      subtext: 'GRAVITY SHIFT',
      speedLines: true,
    };
  }

  // PHASE 4: BULLET-TIME SLOW-MOTION & 3D CAMERA ORBIT (210 - 330)
  // 120 frames of continuous matrix slow-motion
  if (frame < 330) {
    const t = (frame - 210) / 120; // 0 to 1

    // Ultra-slow motion mid-air kick windup
    const kickWindup = Math.sin(t * Math.PI * 0.5);
    const aerialHeight = 3.7 - t * 0.3; // Floating slowly in air

    // 270-degree continuous seamless 3D camera orbit
    const orbitAngle = lerp(-Math.PI * 0.4, Math.PI * 1.1, t);
    const orbitRadius = 4.0;
    const camHeight = lerp(2.2, 4.2, Math.sin(t * Math.PI));

    const camX = Math.sin(orbitAngle) * orbitRadius;
    const camZ = Math.cos(orbitAngle) * orbitRadius;

    return {
      fighterCyan: {
        position: [-0.6, aerialHeight, 0],
        rotation: [0.3, orbitAngle + 0.5, 0],
        head: [0, 0.6, 0],
        torso: [0.2, 0.4, 0],
        leftArm: { shoulder: [-0.8, 0.4, 0.8], elbow: [-1.5, 0, 0] },
        rightArm: { shoulder: [0.4, -0.2, -0.8], elbow: [-1.2, 0, 0] },
        // Mid-air chambered spinning strike
        leftLeg: { hip: [0.4, 0, 0.2], knee: [1.6, 0, 0] },
        rightLeg: {
          hip: [-0.2 + kickWindup * 1.5, 0, 0.8 + kickWindup * 0.6],
          knee: [0.1, 0, 0],
        },
      },
      fighterRed: {
        position: [0.6, aerialHeight + 0.1, 0],
        rotation: [-0.4, -1.8, -0.4],
        head: [-0.2, -0.4, 0],
        torso: [-0.3, -0.2, -0.2],
        // Desperate mid-air block guard
        leftArm: { shoulder: [1.2, 0.4, 0.4], elbow: [-2.1, 0, 0] },
        rightArm: { shoulder: [1.0, -0.4, -0.4], elbow: [-2.0, 0, 0] },
        leftLeg: { hip: [-0.4, 0, 0.3], knee: [0.8, 0, 0] },
        rightLeg: { hip: [0.6, 0, -0.3], knee: [1.2, 0, 0] },
      },
      cameraPos: [camX, camHeight, camZ],
      cameraTarget: [0, aerialHeight, 0],
      cameraFov: 40,
      slowMoActive: true,
      impactActive: false,
      shockwaveProgress: 0,
      screenShake: 0,
      headline: 'BULLET TIME',
      subtext: '360° SPATIAL ORBIT',
      speedLines: false,
    };
  }

  // PHASE 5: IMPACT FRAME & GROUND SLAM (330 - 390)
  if (frame < 390) {
    const t = (frame - 330) / 60;
    const shockwave = t; // 0 to 1

    // Red gets hurled diagonally down to ground
    const redFallY = lerp(3.5, 0.2, Math.min(1, t * 1.6));
    const redFallX = lerp(0.6, 3.8, Math.min(1, t * 1.4));

    // Cyan lands with superhero pose
    const cyanFallY = lerp(3.4, 0.8, Math.min(1, t * 1.5));

    return {
      fighterCyan: {
        position: [-0.8, cyanFallY, 0],
        rotation: [0.4, 1.2, 0],
        head: [-0.2, 0, 0],
        torso: [0.4, 0, 0],
        leftArm: { shoulder: [1.2, 0, 0.3], elbow: [-0.8, 0, 0] },
        rightArm: { shoulder: [-0.5, 0, -0.5], elbow: [-1.4, 0, 0] },
        leftLeg: { hip: [1.2, 0, 0], knee: [2.1, 0, 0] },
        rightLeg: { hip: [-0.6, 0, 0], knee: [0.4, 0, 0] },
      },
      fighterRed: {
        position: [redFallX, redFallY, 0],
        rotation: [-1.2, 0, -t * 4],
        head: [-0.5, 0, 0],
        torso: [-0.4, 0, 0],
        leftArm: { shoulder: [-1.5, 0, 0], elbow: [0, 0, 0] },
        rightArm: { shoulder: [-1.5, 0, 0], elbow: [0, 0, 0] },
        leftLeg: { hip: [0.5, 0, 0], knee: [0.2, 0, 0] },
        rightLeg: { hip: [0.2, 0, 0], knee: [0.4, 0, 0] },
      },
      cameraPos: [0, 1.6, 4.5],
      cameraTarget: [1.2, 1.0, 0],
      cameraFov: 46,
      slowMoActive: false,
      impactActive: t < 0.3,
      shockwaveProgress: shockwave,
      screenShake: t < 0.4 ? (1 - t / 0.4) * 20 : 0,
      headline: 'CRITICAL IMPACT',
      subtext: 'KNOCKOUT SLAM',
      speedLines: true,
    };
  }

  // PHASE 6: Hero Landing & Victory Finish (390 - 450)
  const t = (frame - 390) / 60;
  const camZ = lerp(4.5, 3.2, t);

  return {
    fighterCyan: {
      position: [-0.8, 0.8, 0],
      rotation: [0.2, 1.3, 0],
      head: [-0.3, 0.3, 0],
      torso: [0.5, 0.2, 0],
      // One hand planted on ground (classic superhero pose)
      leftArm: { shoulder: [1.1, 0, 0.2], elbow: [-0.5, 0, 0] },
      rightArm: { shoulder: [-0.8, 0, -0.6], elbow: [-1.2, 0, 0] },
      leftLeg: { hip: [1.4, 0, 0], knee: [2.2, 0, 0] },
      rightLeg: { hip: [-0.8, 0, 0.3], knee: [0.3, 0, 0] },
    },
    fighterRed: {
      position: [3.8, 0.15, 0],
      rotation: [-Math.PI / 2, 0, 0.8],
      head: [0, 0, 0],
      torso: [0, 0, 0],
      leftArm: { shoulder: [-0.2, 0, 0.8], elbow: [-0.2, 0, 0] },
      rightArm: { shoulder: [0.4, 0, -0.6], elbow: [-0.4, 0, 0] },
      leftLeg: { hip: [0.1, 0, 0], knee: [0.1, 0, 0] },
      rightLeg: { hip: [0.2, 0, 0], knee: [0.1, 0, 0] },
    },
    cameraPos: [-0.4, 1.1, camZ],
    cameraTarget: [-0.8, 0.8, 0],
    cameraFov: 38,
    slowMoActive: false,
    impactActive: false,
    shockwaveProgress: 0,
    screenShake: 0,
    headline: 'VICTORY',
    subtext: 'PROGRAMMATIC 3D ANIMATION',
    speedLines: false,
  };
}

