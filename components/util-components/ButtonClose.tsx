import './buttonClose.scss';

import React from 'react';

interface ButtonClosePropStyles {
  onClick?: (arg?: any) => void;
  label: any;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  tabIndex?: number;
}

function ButtonClose({
  onClick,
  label,
  type = 'button',
  className = '',
  tabIndex,
}: ButtonClosePropStyles) {
  return (
    <button
      className={`button-close ${className}`}
      onClick={onClick}
      type={type}
      tabIndex={tabIndex}
    >
      {label}
    </button>
  );
}

export default ButtonClose;
