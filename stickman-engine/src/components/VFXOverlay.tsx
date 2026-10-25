import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface VFXOverlayProps {
  headline?: string;
  subtext?: string;
  showSpeedLines?: boolean;
  accentColor?: string;
}

export const VFXOverlay: React.FC<VFXOverlayProps> = ({
  headline,
  subtext,
  showSpeedLines = false,
  accentColor = '#00f0ff',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for headline
  const headlineEntrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const headlineScale = interpolate(headlineEntrance, [0, 1], [2.2, 1]);
  const headlineOpacity = interpolate(headlineEntrance, [0, 0.4, 1], [0, 1, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 80px',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Anime / Action Speed Lines */}
      {showSpeedLines && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.25,
            background: `radial-gradient(ellipse at center, transparent 35%, ${accentColor} 90%)`,
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* Top Header / Channel Tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '24px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '14px',
              height: '14px',
              backgroundColor: accentColor,
              borderRadius: '50%',
              boxShadow: `0 0 15px ${accentColor}`,
            }}
          />
          STICKMAN 3D ENGINE
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '18px',
            fontWeight: 600,
            letterSpacing: '1px',
          }}
        >
          60 FPS · 3D KINEMATICS
        </div>
      </div>

      {/* Center Kinetic Headline */}
      {headline && (
        <div
          style={{
            textAlign: 'center',
            transform: `scale(${headlineScale})`,
            opacity: headlineOpacity,
            textShadow: `0 0 40px ${accentColor}`,
          }}
        >
          <h1
            style={{
              color: '#ffffff',
              fontSize: '84px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '6px',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {headline}
          </h1>
          {subtext && (
            <p
              style={{
                color: accentColor,
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '4px',
                marginTop: '16px',
                textTransform: 'uppercase',
              }}
            >
              {subtext}
            </p>
          )}
        </div>
      )}

      {/* Bottom Status & Caption Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '18px',
          fontWeight: 600,
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            padding: '10px 24px',
            borderRadius: '24px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          FRAME {frame}
        </div>
      </div>
    </div>
  );
};

