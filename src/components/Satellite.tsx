'use client';

import React, { useEffect, useRef, useState } from 'react';
import './Satellite.css';

interface SatelliteProps {
  top: string;
  left: string;
  label?: string;
  appearDelay?: string;
  pulseDelay?: string;
  isDeactivating?: boolean;
  onClick?: () => void;
  isActive?: boolean;
  showConnection?: boolean;
  isSubSatellite?: boolean;
  connectionTarget?: { top: string; left: string };
  isTracking?: boolean;
  satelliteImage?: string;
}

const Satellite: React.FC<SatelliteProps> = ({
  top,
  left,
  label = '',
  appearDelay = '0.2s',
  pulseDelay = '1s',
  isDeactivating = false,
  onClick,
  isActive = false,
  showConnection = true,
  isSubSatellite = false,
  connectionTarget,
  isTracking = false,
  satelliteImage,
}) => {
  const connectionRef = useRef<HTMLDivElement>(null);
  const [connectionStyle, setConnectionStyle] = useState<React.CSSProperties>({});
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    if (connectionRef.current && showConnection) {
      // 使用 requestAnimationFrame 确保在 DOM 更新后计算
      requestAnimationFrame(() => {
        const satelliteRect = connectionRef.current!.getBoundingClientRect();
        
        let targetX: number, targetY: number;
        
        if (connectionTarget) {
          const tempDiv = document.createElement('div');
          tempDiv.style.position = 'absolute';
          tempDiv.style.top = connectionTarget.top;
          tempDiv.style.left = connectionTarget.left;
          document.body.appendChild(tempDiv);
          const targetRect = tempDiv.getBoundingClientRect();
          document.body.removeChild(tempDiv);
          targetX = targetRect.left;
          targetY = targetRect.top;
        } else {
          targetX = window.innerWidth / 2;
          targetY = window.innerHeight / 2;
        }
        
        const satelliteX = satelliteRect.left;
        const satelliteY = satelliteRect.top;
        
        const dx = targetX - satelliteX;
        const dy = targetY - satelliteY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        setConnectionStyle({
          width: `${distance}px`,
          height: '1px',
          transform: `translate(0, -50%) rotate(${angle}deg)`,
          transformOrigin: 'left center',
        });
      });
    }
  }, [connectionTarget, showConnection, top, left]);

  const handleClick = () => {
    if (onClick) {
      setIsClicking(true);
      onClick();
      setTimeout(() => setIsClicking(false), 500);
    }
  };

  return (
    <>
      {showConnection && (
        <div
          ref={connectionRef}
          className={`satellite-connection ${isSubSatellite ? 'sub-satellite' : ''} ${isActive || isHovered ? 'active' : ''}`}
          style={{
            top,
            left,
            ...connectionStyle,
            animation: isDeactivating
              ? `connection-disappear 0.4s ease-in forwards ${appearDelay}`
              : `connection-appear 0.8s ease-out forwards ${appearDelay}`,
          }}
        />
      )}
      <div
        className={`satellite ${isSubSatellite ? 'sub-satellite' : ''} ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''} ${isClicking ? 'clicking' : ''} ${isTracking ? 'tracking' : ''}`}
        style={{
          top,
          left,
          animation: isDeactivating
            ? `satellite-disappear 0.4s ease-in forwards ${appearDelay}`
            : isClicking
              ? `satellite-click-pulse 0.5s ease-out`
              : isTracking
                ? `tracking-focus 1s ease-out infinite`
                : `satellite-appear 0.8s ease-out forwards ${appearDelay}, wave-pulse 3s ease-in-out infinite ${pulseDelay}`,
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="satellite-wave sw1" style={{ transform: 'rotate(-8deg)' }} />
        <div className="satellite-wave sw2" style={{ transform: 'rotate(12deg)' }} />
        <div className="satellite-wave sw3" style={{ transform: 'rotate(-15deg)' }} />
        
        <div className="center-particle cp1" />
        <div className="center-particle cp2" />
        <div className="center-particle cp3" />
        <div className="center-particle cp4" />
        <div className="center-particle cp5" />
        <div className="center-particle cp6" />
        <div className="center-particle cp7" />
        <div className="center-particle cp8" />
        
        <div className="satellite-particle p1" />
        <div className="satellite-particle p2" />
        <div className="satellite-particle p3" />
        <div className="satellite-particle p4" />
        <div className="satellite-particle p5" />
        <div className="satellite-particle p6" />
        <div className="satellite-particle p7" />
        <div className="satellite-particle p8" />
        <div className="satellite-particle p9" />
        <div className="satellite-particle p10" />
        
        <div className="tracker-particle" style={{ animation: 'tracker-orbit 8s linear infinite' }} />
        <div className="tracker-particle" style={{ animation: 'tracker-orbit 8s linear infinite 2s' }} />
        <div className="tracker-particle" style={{ animation: 'tracker-orbit 8s linear infinite 4s' }} />
        <div className="tracker-particle" style={{ animation: 'tracker-orbit 8s linear infinite 6s' }} />
        
        {label && <div className="satellite-label">{label}</div>}
        
        {satelliteImage && (
          <img
            src={satelliteImage}
            alt={label || 'satellite'}
            className="satellite-image"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isSubSatellite ? '100%' : '100%',
              height: isSubSatellite ? '100%' : '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
              zIndex: 20,
              borderRadius: '50%',
            }}
          />
        )}
      </div>
    </>
  );
};

export default Satellite;
