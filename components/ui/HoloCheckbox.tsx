import React from 'react';
import './uiverse.css';

export function HoloCheckbox({ checked, onChange }: { checked?: boolean, onChange?: (e: any) => void }) {
  return (
    <div className="holo-checkbox-container">
      <input type="checkbox" className="holo-checkbox-input" id="holo-check" checked={checked} onChange={onChange} />
      <label htmlFor="holo-check" className="holo-checkbox">
        <div className="holo-box">
          <div className="holo-inner"></div>
          <div className="scan-effect"></div>
          <div className="corner-accent"></div>
          <div className="corner-accent"></div>
          <div className="corner-accent"></div>
          <div className="corner-accent"></div>
          
          <div className="cube-transform">
            <div className="cube-face"></div><div className="cube-face"></div>
            <div className="cube-face"></div><div className="cube-face"></div>
            <div className="cube-face"></div><div className="cube-face"></div>
          </div>
          
          <div className="activation-rings">
            <div className="activation-ring"></div>
            <div className="activation-ring"></div>
            <div className="activation-ring"></div>
          </div>
          
          <div className="holo-particles">
            <div className="holo-particle"></div><div className="holo-particle"></div>
            <div className="holo-particle"></div><div className="holo-particle"></div>
            <div className="holo-particle"></div><div className="holo-particle"></div>
          </div>
        </div>
        <div className="holo-glow"></div>
      </label>
      
      <div className="status-text"></div>
      
      <div className="frequency-spectrum">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="frequency-bar"></div>
        ))}
      </div>
      <div className="holo-label">AUTH_REQUIRED</div>
    </div>
  );
}
