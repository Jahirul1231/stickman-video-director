import React, { useMemo } from 'react';
import * as THREE from 'three';
import { StickmanPose, StickmanStyle } from '../types';

interface StickmanRigProps {
  pose: StickmanPose;
  style?: Partial<StickmanStyle>;
}

export const StickmanRig: React.FC<StickmanRigProps> = ({ pose, style }) => {
  const finalStyle: StickmanStyle = {
    stickColor: style?.stickColor ?? '#00f0ff',
    glowColor: style?.glowColor ?? '#0088ff',
    thickness: style?.thickness ?? 0.08,
    headRadius: style?.headRadius ?? 0.32,
    mode: style?.mode ?? 'neon',
  };

  // Create shared material
  const material = useMemo(() => {
    if (finalStyle.mode === 'neon') {
      return new THREE.MeshBasicMaterial({
        color: new THREE.Color(finalStyle.stickColor),
      });
    }
    if (finalStyle.mode === 'classic') {
      return new THREE.MeshBasicMaterial({
        color: new THREE.Color(finalStyle.stickColor),
      });
    }
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(finalStyle.stickColor),
      roughness: 0.3,
      metalness: 0.2,
    });
  }, [finalStyle.stickColor, finalStyle.mode]);

  // Limb dimensions
  const torsoLength = 1.1;
  const upperArmLength = 0.65;
  const forearmLength = 0.6;
  const thighLength = 0.8;
  const shinLength = 0.75;
  const shoulderWidth = 0.7;
  const hipWidth = 0.45;

  return (
    <group position={pose.position} rotation={pose.rotation}>
      {/* Root Pelvis */}
      <mesh material={material}>
        <sphereGeometry args={[finalStyle.thickness * 1.5, 16, 16]} />
      </mesh>

      {/* Torso & Head */}
      <group rotation={pose.torso}>
        {/* Spine Cylinder */}
        <mesh position={[0, torsoLength / 2, 0]} material={material}>
          <cylinderGeometry args={[finalStyle.thickness, finalStyle.thickness, torsoLength, 16]} />
        </mesh>

        {/* Neck / Chest Hub */}
        <group position={[0, torsoLength, 0]}>
          <mesh material={material}>
            <sphereGeometry args={[finalStyle.thickness * 1.4, 16, 16]} />
          </mesh>

          {/* Head */}
          <group position={[0, 0.45, 0]} rotation={pose.head}>
            <mesh material={material}>
              <sphereGeometry args={[finalStyle.headRadius, 32, 32]} />
            </mesh>
            {/* Visual Eyes / Visor Accent */}
            <mesh position={[0, 0.05, finalStyle.headRadius * 0.9]}>
              <boxGeometry args={[finalStyle.headRadius * 0.7, 0.06, 0.08]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Left Arm */}
          <group position={[-shoulderWidth / 2, 0, 0]} rotation={pose.leftArm.shoulder}>
            <mesh position={[0, -upperArmLength / 2, 0]} material={material}>
              <cylinderGeometry args={[finalStyle.thickness, finalStyle.thickness, upperArmLength, 16]} />
            </mesh>
            <group position={[0, -upperArmLength, 0]} rotation={pose.leftArm.elbow}>
              <mesh material={material}>
                <sphereGeometry args={[finalStyle.thickness * 1.2, 16, 16]} />
              </mesh>
              <mesh position={[0, -forearmLength / 2, 0]} material={material}>
                <cylinderGeometry args={[finalStyle.thickness * 0.9, finalStyle.thickness * 0.9, forearmLength, 16]} />
              </mesh>
              {/* Hand */}
              <mesh position={[0, -forearmLength, 0]} material={material}>
                <sphereGeometry args={[finalStyle.thickness * 1.3, 16, 16]} />
              </mesh>
            </group>
          </group>

          {/* Right Arm */}
          <group position={[shoulderWidth / 2, 0, 0]} rotation={pose.rightArm.shoulder}>
            <mesh position={[0, -upperArmLength / 2, 0]} material={material}>
              <cylinderGeometry args={[finalStyle.thickness, finalStyle.thickness, upperArmLength, 16]} />
            </mesh>
            <group position={[0, -upperArmLength, 0]} rotation={pose.rightArm.elbow}>
              <mesh material={material}>
                <sphereGeometry args={[finalStyle.thickness * 1.2, 16, 16]} />
              </mesh>
              <mesh position={[0, -forearmLength / 2, 0]} material={material}>
                <cylinderGeometry args={[finalStyle.thickness * 0.9, finalStyle.thickness * 0.9, forearmLength, 16]} />
              </mesh>
              {/* Hand */}
              <mesh position={[0, -forearmLength, 0]} material={material}>
                <sphereGeometry args={[finalStyle.thickness * 1.3, 16, 16]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* Left Leg */}
      <group position={[-hipWidth / 2, 0, 0]} rotation={pose.leftLeg.hip}>
        <mesh position={[0, -thighLength / 2, 0]} material={material}>
          <cylinderGeometry args={[finalStyle.thickness * 1.1, finalStyle.thickness, thighLength, 16]} />
        </mesh>
        <group position={[0, -thighLength, 0]} rotation={pose.leftLeg.knee}>
          <mesh material={material}>
            <sphereGeometry args={[finalStyle.thickness * 1.2, 16, 16]} />
          </mesh>
          <mesh position={[0, -shinLength / 2, 0]} material={material}>
            <cylinderGeometry args={[finalStyle.thickness * 0.9, finalStyle.thickness * 0.9, shinLength, 16]} />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -shinLength, 0.1]} material={material}>
            <boxGeometry args={[finalStyle.thickness * 1.5, finalStyle.thickness * 1.2, 0.32]} />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group position={[hipWidth / 2, 0, 0]} rotation={pose.rightLeg.hip}>
        <mesh position={[0, -thighLength / 2, 0]} material={material}>
          <cylinderGeometry args={[finalStyle.thickness * 1.1, finalStyle.thickness, thighLength, 16]} />
        </mesh>
        <group position={[0, -thighLength, 0]} rotation={pose.rightLeg.knee}>
          <mesh material={material}>
            <sphereGeometry args={[finalStyle.thickness * 1.2, 16, 16]} />
          </mesh>
          <mesh position={[0, -shinLength / 2, 0]} material={material}>
            <cylinderGeometry args={[finalStyle.thickness * 0.9, finalStyle.thickness * 0.9, shinLength, 16]} />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -shinLength, 0.1]} material={material}>
            <boxGeometry args={[finalStyle.thickness * 1.5, finalStyle.thickness * 1.2, 0.32]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

