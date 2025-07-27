import './button.scss';

import React from 'react';

interface ButtonPropStyles {
  onClick?: (arg?: any) => void;
  label: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  tabIndex?: number;
  ref?: any;
}

function Button({
  onClick,
  label,
  type = 'button',
  className = '',
  tabIndex,
  ref,
}: ButtonPropStyles) {
  return (
    <button
      ref={ref}
      className={`button ${className}`}
      onClick={onClick}
      type={type}
      tabIndex={tabIndex}
    >
      {label}
    </button>
  );
}

export default Button;
