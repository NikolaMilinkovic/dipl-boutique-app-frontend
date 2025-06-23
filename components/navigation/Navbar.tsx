import React from 'react';
import './navbar.scss';
import { useAuth } from '../../hooks/useAuth';

function Navbar() {
  const { logout } = useAuth();

  return (
    <>
      <button onClick={logout}>Logout</button>
    </>
  );
}

export default Navbar;
