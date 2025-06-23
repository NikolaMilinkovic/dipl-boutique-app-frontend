import React from 'react';
import './landingPage.scss';
import Navbar from '../../components/navigation/Navbar';

function LandingPage() {
  return (
    <div className="landing-page-wrapper fade-in">
      <p>THIS IS THE LANDING PAGE</p>
      <p>WE ARE AUTHENTICATED!</p>
      <Navbar />
    </div>
  );
}

export default LandingPage;
