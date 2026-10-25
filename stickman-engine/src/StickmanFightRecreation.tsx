import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { computeFightFrame } from './motions/fightChoreography';
import { StickmanFightScene } from './components/StickmanFightScene';

export const StickmanFightRecreation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const data = computeFightFrame(frame, fps);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#05070d',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* 3D Dual Stickman Fight Stage */}
      <StickmanFightScene data={data} />

      {/* Screen Impact Flash */}
      {data.impactActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#ffffff',
            opacity: 0.35,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Speed Lines */}
      {data.speedLines && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at center, transparent 30%, rgba(0, 240, 255, 0.2) 90%)',
            pointerEvents: 'none',
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* Slow-Motion Bullet-Time Vignette */}
      {data.slowMoActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: '8px solid rgba(0, 240, 255, 0.4)',
            boxShadow: 'inset 0 0 120px rgba(0, 240, 255, 0.3)',
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '30px',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 240, 255, 0.15)',
              border: '1px solid #00f0ff',
              padding: '6px 20px',
              borderRadius: '20px',
              color: '#00f0ff',
              fontWeight: 800,
              fontSize: '16px',
              letterSpacing: '3px',
              backdropFilter: 'blur(8px)',
            }}
          >
            ● BULLET TIME · 0.15x SLOW MOTION
          </div>
        </div>
      )}

      {/* Combat UI Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '50px 70px',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Health / Versus Bars */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '30px' }}>
          {/* Cyan Player */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00f0ff', fontWeight: 800, fontSize: '18px', letterSpacing: '2px' }}>
              <span>CYAN STRIKER</span>
              <span>100%</span>
            </div>
            <div style={{ width: '100%', height: '14px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '7px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', backgroundColor: '#00f0ff', boxShadow: '0 0 15px #00f0ff' }} />
            </div>
          </div>

          {/* VS Center Tag */}
          <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '28px', letterSpacing: '4px', padding: '0 10px' }}>
            VS
          </div>

          {/* Crimson Player */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff0055', fontWeight: 800, fontSize: '18px', letterSpacing: '2px' }}>
              <span>CRIMSON RIVAL</span>
              <span>{frame > 340 ? 'K.O.' : '85%'}</span>
            </div>
            <div style={{ width: '100%', height: '14px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '7px', overflow: 'hidden' }}>
              <div
                style={{
                  width: frame > 340 ? '0%' : '85%',
                  height: '100%',
                  backgroundColor: '#ff0055',
                  boxShadow: '0 0 15px #ff0055',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        </div>

        {/* Center Dynamic Headline */}
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              color: '#ffffff',
              fontSize: '76px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '6px',
              margin: 0,
              textShadow: '0 0 35px rgba(0, 240, 255, 0.7)',
            }}
          >
            {data.headline}
          </h1>
          <p
            style={{
              color: '#00f0ff',
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '4px',
              margin: '12px 0 0 0',
              textTransform: 'uppercase',
            }}
          >
            {data.subtext}
          </p>
        </div>

        {/* Bottom Time & 3D Camera Indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '1px',
          }}
        >
          <div>SEAMLESS 3D CAMERA PATH</div>
          <div>FRAME {frame} / 450</div>
        </div>
      </div>
    </div>
  );
};

