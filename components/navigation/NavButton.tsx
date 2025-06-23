import React from 'react';
import './NavButton.scss';

interface NavButtonPropTypes {
  icon: React.ReactNode;
}

function NavButton({ icon }: NavButtonPropTypes) {
  return <button>{icon}</button>;
}

export default NavButton;
