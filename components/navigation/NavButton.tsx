import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface NavButtonProps {
  to: string;
  onClick?: () => void;
  icon: ReactNode;
  children: ReactNode;
  exact?: boolean;
}

const NavButton = ({ to, onClick, icon, children, exact }: NavButtonProps) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        isActive ? 'nav-link nav-link-active' : 'nav-link'
      }
      end={exact} // exact matching if needed
    >
      {React.cloneElement(icon as React.ReactElement, {
        style: { marginRight: '8px', marginBottom: '3px' },
        className: 'nav-icon',
      })}
      {children}
    </NavLink>
  );
};

export default NavButton;
