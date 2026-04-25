import React from 'react';
import './uiverse.css';

export function PricingCards() {
  return (
    <div className="uiverse-cards flex-row md:flex-row flex-wrap justify-center w-full max-w-4xl mx-auto">
      <div className="card red">
        <p className="tip">Basic</p>
        <p className="second-text">$0 / month</p>
      </div>
      <div className="card blue">
        <p className="tip">Pro</p>
        <p className="second-text">$15 / month</p>
      </div>
      <div className="card green">
        <p className="tip">University</p>
        <p className="second-text">$499 / month</p>
      </div>
    </div>
  );
}
