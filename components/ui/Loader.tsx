import React from 'react';
import './uiverse.css';

export function Loader() {
  return (
    <div className="loader-wrapper">
      <div className="loader">
        <div className="loader-letter">L</div>
        <div className="loader-letter">O</div>
        <div className="loader-letter">A</div>
        <div className="loader-letter">D</div>
        <div className="loader-letter">I</div>
        <div className="loader-letter">N</div>
        <div className="loader-letter">G</div>
        <div className="loader-letter">.</div>
        <div className="loader-letter">.</div>
        <div className="loader-letter">.</div>
      </div>
    </div>
  );
}
