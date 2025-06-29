import React from 'react';
import './splashScreen.scss';

function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-screen-wrapper">
        <img
          src="../public/img/infinity.png"
          alt="Infinity Boutique Logo"
          className="splash-logo"
        ></img>
        <p className="splash-text">Loading...</p>
      </div>
    </div>
  );
}

export default SplashScreen;
