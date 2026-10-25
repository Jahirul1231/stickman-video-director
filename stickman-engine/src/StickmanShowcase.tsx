import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { StickmanScene } from './components/StickmanScene';
import { VFXOverlay } from './components/VFXOverlay';
import {
  getIdleMotion,
  getRunMotion,
  getBackflipMotion,
  getFlyingKickMotion,
  blendPoses,
  defaultIdlePose,
} from './motions/library';
import { StickmanPose, Vector3Tuple } from './types';

export const StickmanShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let pose: StickmanPose;
  let headline = '';
  let subtext = '';
  let showSpeedLines = false;
  let cameraPos: Vector3Tuple = [0, 2.2, 5.5];
  let cameraTarget: Vector3Tuple = [0, 1.4, 0];
  let accentColor = '#00f0ff';

  // SCENE 1: Idle introduction (0 - 60)
  if (frame < 60) {
    pose = getIdleMotion(frame, fps);
    headline = 'STICKMAN 3D ENGINE';
    subtext = 'Procedural 14-Joint Skeleton';
    // Gentle camera dolly
    const camZ = interpolate(frame, [0, 60], [6.5, 5.2]);
    cameraPos = [0, 2.1, camZ];
  }
  // SCENE 2: High-Speed Sprint (60 - 150)
  else if (frame < 150) {
    const runFrame = frame - 60;
    pose = getRunMotion(runFrame, fps, 9);
    headline = 'DYNAMIC SPRINT';
    subtext = 'Real-time Kinematic Physics';
    showSpeedLines = true;
    accentColor = '#ffaa00';

    // Tracking side-angle camera
    cameraPos = [3.5, 2.0, 3.8];
    cameraTarget = [0, 1.3, 0];
  }
  // SCENE 3: 360° Backflip with Orbiting Camera (150 - 240)
  else if (frame < 240) {
    const flipProgress = (frame - 150) / 90;
    pose = getBackflipMotion(flipProgress);
    headline = '360° BACKFLIP';
    subtext = 'Full 3D Spatial Freedom';
    accentColor = '#00ff88';

    // Cinematic 180-degree camera orbit around the backflip
    const orbitAngle = interpolate(flipProgress, [0, 1], [-Math.PI * 0.25, Math.PI * 0.4]);
    const radius = 5.2;
    cameraPos = [
      Math.sin(orbitAngle) * radius,
      interpolate(flipProgress, [0, 0.5, 1], [1.8, 3.2, 2.0]),
      Math.cos(orbitAngle) * radius,
    ];
    cameraTarget = [0, pose.position[1] * 0.8, 0];
  }
  // SCENE 4: Martial Arts Flying Kick (240 - 330)
  else if (frame < 330) {
    const kickProgress = (frame - 240) / 90;
    pose = getFlyingKickMotion(kickProgress);
    headline = 'FLYING STRIKE';
    subtext = 'Martial Arts Choreography';
    showSpeedLines = true;
    accentColor = '#ff0055';

    // Dramatic low-angle push-in
    const zoom = interpolate(kickProgress, [0, 0.6, 1], [5.0, 3.2, 3.8]);
    cameraPos = [1.5, 1.2, zoom];
    cameraTarget = [0, 1.6, 0];
  }
  // SCENE 5: Power Landing & Outro (330 - 420)
  else {
    const landingFrame = frame - 330;
    const blendWeight = interpolate(landingFrame, [0, 20], [0, 1]);
    const idlePose = getIdleMotion(landingFrame, fps);
    pose = blendPoses(defaultIdlePose, idlePose, blendWeight);
    headline = 'ANY ANIMATION ON COMMAND';
    subtext = 'Rendered Entirely with Code';
    accentColor = '#7000ff';

    const camZ = interpolate(landingFrame, [0, 90], [4.5, 5.8]);
    cameraPos = [0, 2.0, camZ];
    cameraTarget = [0, 1.4, 0];
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <StickmanScene
        pose={pose}
        cameraPos={cameraPos}
        cameraTarget={cameraTarget}
        accentColor={accentColor}
        style={{ stickColor: accentColor, mode: 'neon' }}
      />
      <VFXOverlay
        headline={headline}
        subtext={subtext}
        showSpeedLines={showSpeedLines}
        accentColor={accentColor}
      />
    </div>
  );
};

