import React, { useEffect } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { StickmanRig } from './StickmanRig';
import { StickmanPose, StickmanStyle, Vector3Tuple } from '../types';

interface StickmanSceneProps {
  pose: StickmanPose;
  style?: Partial<StickmanStyle>;
  cameraPos?: Vector3Tuple;
  cameraTarget?: Vector3Tuple;
  accentColor?: string;
}

const CameraController: React.FC<{
  position: Vector3Tuple;
  target: Vector3Tuple;
}> = ({ position, target }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(...target);
    camera.updateProjectionMatrix();
  }, [camera, position, target]);

  return null;
};

export const StickmanScene: React.FC<StickmanSceneProps> = ({
  pose,
  style,
  cameraPos = [0, 2.2, 5.5],
  cameraTarget = [0, 1.4, 0],
  accentColor = '#00f0ff',
}) => {
  const { width, height } = useVideoConfig();

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#07080f' }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: cameraPos, fov: 45 }}
      >
        <CameraController position={cameraPos} target={cameraTarget} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 10, 5]} intensity={1.5} color={accentColor} />
        <pointLight position={[-5, 5, -5]} intensity={0.8} color="#ffffff" />

        {/* 3D Perspective Ground Grid */}
        <gridHelper
          args={[30, 30, new THREE.Color(accentColor), new THREE.Color('#151928')]}
          position={[0, 0, 0]}
        />

        {/* Shadow Plane underneath */}
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshBasicMaterial color="#07080f" />
        </mesh>

        {/* The 3D Kinematic Stickman */}
        <StickmanRig pose={pose} style={style} />
      </ThreeCanvas>
    </div>
  );
};

