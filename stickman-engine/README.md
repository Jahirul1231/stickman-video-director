# Stickman 3D Motion Graphics & Animation Engine

A programmatic video creation system built with **Remotion**, **React Three Fiber (Three.js)**, and **TypeScript**. It provides a fully parametric 14-joint skeletal rig capable of executing any 3D motion, martial arts stunts, camera choreographies, and kinetic typography on command.

---

## ⚡ Architecture

```
stickman-engine/
├── src/
│   ├── types.ts                    # 3D Skeletal pose, style & camera interfaces
│   ├── motions/
│   │   └── library.ts              # Procedural motions: Idle, Run, Backflip 360°, Flying Kick, Blending
│   ├── components/
│   │   ├── StickmanRig.tsx         # 14-Joint parametric Forward Kinematics 3D mesh
│   │   ├── StickmanScene.tsx       # 3D Stage: Dynamic camera, lighting, perspective grid
│   │   └── VFXOverlay.tsx          # 2D Motion graphics: Kinetic typography, action speed lines
│   ├── StickmanShowcase.tsx        # Choreographed timeline composition
│   ├── Root.tsx                    # Remotion composition registry
│   └── index.ts                    # Remotion bundle entrypoint
└── package.json
```

---

## 🚀 Quick Start

### 1. Launch the Live Browser Studio (Real-time 60 FPS playback)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to scrub the timeline frame-by-frame, test camera angles, and inspect animations live with instant hot-reloading.

### 2. Render Full 1080p Video (.mp4)
```bash
npm run build
```
Renders the complete 60 FPS / 30 FPS composition directly to `out/stickman-showcase.mp4`.

---

## 🎭 Creating Custom Stickman Animations on Command

Every limb is controlled through Euler rotation angles (`[pitch, yaw, roll]` in radians):

```typescript
import { StickmanPose } from './types';

const myPose: StickmanPose = {
  position: [0, 1.5, 0],              // Root 3D world position [x, y, z]
  rotation: [0, 0, 0],                // Root body rotation
  head: [0, 0, 0],                    // Head tilt & turn
  torso: [0, 0, 0],                   // Torso bend
  leftArm: {
    shoulder: [-0.5, 0, 0.4],         // Shoulder pivot
    elbow: [-1.2, 0, 0],              // Forearm pivot
  },
  rightArm: { shoulder: [0, 0, -0.4], elbow: [-0.2, 0, 0] },
  leftLeg:  { hip: [0.4, 0, 0], knee: [0.8, 0, 0] },
  rightLeg: { hip: [-0.4, 0, 0], knee: [0.1, 0, 0] },
};
```

You can blend any two poses smoothly across time:
```typescript
const pose = blendPoses(poseA, poseB, progress);
```

