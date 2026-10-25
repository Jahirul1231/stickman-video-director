import React, { useEffect } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { StickmanRig } from './StickmanRig';
import { FightFrameData } from '../motions/fightChoreography';

interface StickmanFightSceneProps {
  data: FightFrameData;
}

const FightCameraController: React.FC<{
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  shake: number;
}> = ({ position, target, fov, shake }) => {
  const { camera } = useThree();

  useEffect(() => {
    const shakeX = (Math.random() - 0.5) * (shake * 0.015);
    const shakeY = (Math.random() - 0.5) * (shake * 0.015);

    camera.position.set(position[0] + shakeX, position[1] + shakeY, position[2]);
    camera.lookAt(target[0], target[1], target[2]);
    if ('fov' in camera) {
      (camera as THREE.PerspectiveCamera).fov = fov;
    }
    camera.updateProjectionMatrix();
  }, [camera, position, target, fov, shake]);

  return null;
};

export const StickmanFightScene: React.FC<StickmanFightSceneProps> = ({ data }) => {
  const { width, height } = useVideoConfig();

  // Expanding 3D Shockwave ring calculations
  const shockwaveRadius = data.shockwaveProgress * 7;
  const shockwaveOpacity = Math.max(0, 1 - data.shockwaveProgress);

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#05070d' }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: data.cameraPos, fov: data.cameraFov }}
      >
        <FightCameraController
          position={data.cameraPos}
          target={data.cameraTarget}
          fov={data.cameraFov}
          shake={data.screenShake}
        />

        {/* Dynamic Arena Lighting */}
        <ambientLight intensity={0.35} />
        <pointLight position={[-4, 8, 4]} intensity={2.0} color="#00f0ff" />
        <pointLight position={[4, 8, 4]} intensity={2.0} color="#ff0055" />
        <pointLight position={[0, -2, 0]} intensity={0.5} color="#ffffff" />

        {/* 3D Perspective Arena Grid */}
        <gridHelper
          args={[35, 35, new THREE.Color('#00f0ff'), new THREE.Color('#161828')]}
          position={[0, 0, 0]}
        />

        {/* Fighter 1: Cyan Hero */}
        <StickmanRig
          pose={data.fighterCyan}
          style={{ stickColor: '#00f0ff', mode: 'neon', thickness: 0.085 }}
        />

        {/* Fighter 2: Crimson Rival */}
        <StickmanRig
          pose={data.fighterRed}
          style={{ stickColor: '#ff0055', mode: 'neon', thickness: 0.085 }}
        />

        {/* 3D Impact Shockwave Rings */}
        {data.shockwaveProgress > 0 && (
          <group position={[0.6, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <ringGeometry args={[Math.max(0.1, shockwaveRadius - 0.2), shockwaveRadius, 64]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={shockwaveOpacity}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh>
              <ringGeometry
                args={[Math.max(0.1, shockwaveRadius * 0.7 - 0.15), shockwaveRadius * 0.7, 64]}
              />
              <meshBasicMaterial
                color="#00f0ff"
                transparent
                opacity={shockwaveOpacity * 0.8}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        )}
      </ThreeCanvas>
    </div>
  );
};

