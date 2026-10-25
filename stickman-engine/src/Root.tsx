import React from 'react';
import { Composition } from 'remotion';
import { StickmanFightRecreation } from './StickmanFightRecreation';
import { StickmanShowcase } from './StickmanShowcase';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="StickmanFightRecreation"
        component={StickmanFightRecreation}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="StickmanShowcase"
        component={StickmanShowcase}
        durationInFrames={420}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
