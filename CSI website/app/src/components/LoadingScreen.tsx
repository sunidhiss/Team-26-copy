import React from 'react';
import Galaxy from './Galaxy';

export function LoadingScreen() {
  return (
    <div className="loading-overlay">
      {/* Black screen bottom layer */}
      <div className="loading-black-bg"></div>

      {/* Galaxy effect middle layer */}
      <Galaxy
        mouseRepulsion
        mouseInteraction
        density={1}
        glowIntensity={0.3}
        saturation={0}
        hueShift={140}
        twinkleIntensity={0.3}
        rotationSpeed={0.1}
        repulsionStrength={2}
        autoCenterRepulsion={0}
        starSpeed={0.5}
        speed={1}
      />

      {/* Planet content top layer */}
      <div className="content">
         <div className="planet">
            <div className="ring"></div>
               <div className="cover-ring"></div>
            <div className="spots">
               <span></span>
               <span></span>
               <span></span>
               <span></span>
               <span></span>
               <span></span>
               <span></span>

            </div>
         </div>
         <p>loading</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
