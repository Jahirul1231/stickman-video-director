import { StickmanPose, Vector3Tuple, ArmPose, LegPose } from '../types';

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpV3(a: Vector3Tuple, b: Vector3Tuple, t: number): Vector3Tuple {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function lerpArm(a: ArmPose, b: ArmPose, t: number): ArmPose {
  return {
    shoulder: lerpV3(a.shoulder, b.shoulder, t),
    elbow: lerpV3(a.elbow, b.elbow, t),
  };
}

function lerpLeg(a: LegPose, b: LegPose, t: number): LegPose {
  return {
    hip: lerpV3(a.hip, b.hip, t),
    knee: lerpV3(a.knee, b.knee, t),
  };
}

export function blendPoses(a: StickmanPose, b: StickmanPose, weight: number): StickmanPose {
  const t = Math.max(0, Math.min(1, weight));
  return {
    position: lerpV3(a.position, b.position, t),
    rotation: lerpV3(a.rotation, b.rotation, t),
    head: lerpV3(a.head, b.head, t),
    torso: lerpV3(a.torso, b.torso, t),
    leftArm: lerpArm(a.leftArm, b.leftArm, t),
    rightArm: lerpArm(a.rightArm, b.rightArm, t),
    leftLeg: lerpLeg(a.leftLeg, b.leftLeg, t),
    rightLeg: lerpLeg(a.rightLeg, b.rightLeg, t),
  };
}

export const defaultIdlePose: StickmanPose = {
  position: [0, 1.5, 0],
  rotation: [0, 0, 0],
  head: [0, 0, 0],
  torso: [0, 0, 0],
  leftArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0] },
  rightArm: { shoulder: [0.1, 0, -0.2], elbow: [-0.2, 0, 0] },
  leftLeg: { hip: [0, 0, -0.05], knee: [0.1, 0, 0] },
  rightLeg: { hip: [0, 0, 0.05], knee: [0.1, 0, 0] },
};

export function getIdleMotion(frame: number, fps = 30): StickmanPose {
  const t = (frame / fps) * 2;
  const breath = Math.sin(t * 1.5) * 0.04;
  return {
    ...defaultIdlePose,
    position: [0, 1.5 + breath, 0],
    torso: [breath * 0.5, 0, 0],
    head: [-breath * 0.4, Math.sin(t * 0.8) * 0.08, 0],
    leftArm: {
      shoulder: [0.1 + Math.sin(t) * 0.05, 0, 0.2],
      elbow: [-0.2 - breath, 0, 0],
    },
    rightArm: {
      shoulder: [0.1 - Math.sin(t) * 0.05, 0, -0.2],
      elbow: [-0.2 - breath, 0, 0],
    },
  };
}

export function getRunMotion(frame: number, fps = 30, speed = 8): StickmanPose {
  const cycle = (frame / fps) * speed;
  const sin = Math.sin(cycle);
  const cos = Math.cos(cycle);
  const bounce = Math.abs(Math.sin(cycle)) * 0.18;

  return {
    position: [0, 1.45 + bounce, 0],
    rotation: [0.25, 0, sin * 0.05],
    head: [-0.2, 0, 0],
    torso: [0.2, sin * 0.15, 0],
    leftArm: {
      shoulder: [-sin * 1.1, 0, 0.15],
      elbow: [-Math.max(0.2, -sin * 1.4), 0, 0],
    },
    rightArm: {
      shoulder: [sin * 1.1, 0, -0.15],
      elbow: [-Math.max(0.2, sin * 1.4), 0, 0],
    },
    leftLeg: {
      hip: [sin * 0.9, 0, 0],
      knee: [sin > 0 ? sin * 1.5 : 0.1, 0, 0],
    },
    rightLeg: {
      hip: [-sin * 0.9, 0, 0],
      knee: [sin < 0 ? -sin * 1.5 : 0.1, 0, 0],
    },
  };
}

export function getBackflipMotion(progress: number): StickmanPose {
  // progress: 0 to 1
  const p = Math.max(0, Math.min(1, progress));
  
  // Parabolic jump arc: starts at 1.5, peaks at 3.4, lands at 1.5
  const jumpHeight = 1.5 + Math.sin(p * Math.PI) * 1.9;
  // Full 360-degree backflip rotation around X axis
  const flipRotation = -p * Math.PI * 2;

  // Tuck in the middle of the flip (progress 0.3 to 0.7)
  const tuck = Math.sin(p * Math.PI);

  return {
    position: [0, jumpHeight, lerp(-1.5, 1.5, p)],
    rotation: [flipRotation, 0, 0],
    head: [-tuck * 0.5, 0, 0],
    torso: [tuck * 0.8, 0, 0],
    leftArm: {
      shoulder: [-lerp(0.2, 2.5, tuck), 0, 0.3],
      elbow: [-lerp(0.2, 2.2, tuck), 0, 0],
    },
    rightArm: {
      shoulder: [-lerp(0.2, 2.5, tuck), 0, -0.3],
      elbow: [-lerp(0.2, 2.2, tuck), 0, 0],
    },
    leftLeg: {
      hip: [lerp(0.1, 1.8, tuck), 0, 0],
      knee: [lerp(0.1, 2.4, tuck), 0, 0],
    },
    rightLeg: {
      hip: [lerp(0.1, 1.8, tuck), 0, 0],
      knee: [lerp(0.1, 2.4, tuck), 0, 0],
    },
  };
}

export function getFlyingKickMotion(progress: number): StickmanPose {
  const p = Math.max(0, Math.min(1, progress));
  const jump = Math.sin(p * Math.PI) * 1.2;

  return {
    position: [lerp(-2, 2, p), 1.5 + jump, 0],
    rotation: [0, -0.6, -0.3],
    head: [0, 0.5, 0],
    torso: [0.1, -0.4, -0.3],
    leftArm: {
      shoulder: [0.3, 0.5, 0.8],
      elbow: [-1.2, 0, 0],
    },
    rightArm: {
      shoulder: [-0.6, -0.4, -0.8],
      elbow: [-1.4, 0, 0],
    },
    leftLeg: {
      // Bent support leg
      hip: [0.9, 0, -0.3],
      knee: [1.8, 0, 0],
    },
    rightLeg: {
      // Extended flying kick leg
      hip: [-0.2, 0, 1.3],
      knee: [0.05, 0, 0],
    },
  };
}

