import './button.scss';

import React from 'react';

interface ButtonPropStyles {
  onClick?: (arg?: any) => void;
  label: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

function Button({
  onClick,
  label,
  type = 'button',
  className = '',
}: ButtonPropStyles) {
  return (
    <button className={`button ${className}`} onClick={onClick} type={type}>
      {label}
    </button>
  );
}

export default Button;
