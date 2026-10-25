export type Vector3Tuple = [number, number, number];

export interface ArmPose {
  shoulder: Vector3Tuple; // [pitch, yaw, roll] in radians
  elbow: Vector3Tuple;
}

export interface LegPose {
  hip: Vector3Tuple;
  knee: Vector3Tuple;
}

export interface StickmanPose {
  position: Vector3Tuple; // root position in 3D world [x, y, z]
  rotation: Vector3Tuple; // root body rotation [pitch, yaw, roll]
  head: Vector3Tuple;     // head tilt & turn
  torso: Vector3Tuple;    // torso bending
  leftArm: ArmPose;
  rightArm: ArmPose;
  leftLeg: LegPose;
  rightLeg: LegPose;
}

export interface StickmanStyle {
  stickColor: string;
  glowColor?: string;
  thickness: number;
  headRadius: number;
  mode: 'neon' | 'classic' | 'shaded';
}

export interface CameraState {
  position: Vector3Tuple;
  target: Vector3Tuple;
  fov?: number;
}

export interface SceneVFX {
  headline?: string;
  subtext?: string;
  impactShake?: number;
  actionSpeedLines?: boolean;
}

