import React from 'react';
import './uiverse.css';

export function FeatureCard({ prompt, title, icon }: { prompt: string, title: string, icon?: React.ReactNode }) {
  return (
    <div className="feature-card-container">
      <div className="feature-canvas">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className={`feature-tracker tr-${i + 1}`}></div>
        ))}
        <div id="feature-card">
          <div className="card-glare"></div>
          <div className="cyber-lines">
            <span></span><span></span><span></span><span></span>
          </div>
          <div className="corner-elements">
            <span></span><span></span><span></span><span></span>
          </div>
          <div className="scan-line"></div>
          
          <div className="card-content">
            <div className="glowing-elements">
              <div className="glow-1"></div>
              <div className="glow-2"></div>
              <div className="glow-3"></div>
            </div>
            
            <div className="card-particles">
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
            </div>
            
            <div id="feature-prompt">
              {icon}
              <div className="mt-2">{prompt}</div>
            </div>
            
            <div className="feature-title">{title}</div>
            <div className="feature-subtitle">
              ACCESS <span className="highlight">GRANTED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
