import { useRef, useEffect } from 'react';
import './navbar.scss';
import { FaBars, FaTimes } from 'react-icons/fa';
import { MdDashboard, MdInventory2, MdSettings } from 'react-icons/md';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import NavButton from './NavButton';
import { useAuth } from '../../store/auth-context';
import { useUser } from '../../store/user-context';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { clearUser, user } = useUser();
  const navRef = useRef<HTMLElement>(null);

  // HOTKEY NAVIGATION
  const navigate = useNavigate();
  const location = useLocation();
  let navItems: string[] = [];
  if (user?.role === 'admin')
    navItems = ['/dashboard', '/', '/products', '/app-setup'];
  if (user?.role !== 'admin') navItems = ['/', '/products', '/app-setup'];
  function showNavbar() {
    navRef?.current?.classList.toggle('responsive_nav');
  }
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!e.ctrlKey) return;
      const index = navItems.indexOf(location.pathname);

      if (e.key === 'ArrowRight') {
        const next = navItems[(index + 1) % navItems.length];
        navigate(next);
      } else if (e.key === 'ArrowLeft') {
        const prev = navItems[(index - 1 + navItems.length) % navItems.length];
        navigate(prev);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname]);

  if (!isAuthenticated) return null;

  return (
    <header className="fade">
      {/* LOGO */}
      <NavLink className="nav-link" to="/orders" onClick={showNavbar}>
        <img
          src="/img/infinity-white.png"
          alt="Infinity Boutique Logo"
          className="nav-logo"
        />
      </NavLink>

      <nav ref={navRef}>
        {/* DASHBOARD */}
        {user && user.role === 'admin' && (
          <NavButton
            to="/dashboard"
            onClick={showNavbar}
            icon={<MdDashboard />}
          >
            Dashboard
          </NavButton>
        )}

        {/* ORDERS */}
        <NavButton to="/" onClick={showNavbar} icon={<MdInventory2 />}>
          Orders
        </NavButton>

        {/* PRODUCTS */}
        <NavButton to="/products" onClick={showNavbar} icon={<MdInventory2 />}>
          Products
        </NavButton>

        {/* APP SETUP */}
        <NavButton to="/app-setup" onClick={showNavbar} icon={<MdSettings />}>
          App setup
        </NavButton>

        {/* LOGOUT */}
        <NavButton
          to="/logout"
          onClick={() => {
            clearUser();
            logout();
          }}
          icon={<FiLogOut />}
        >
          Logout
        </NavButton>

        <button onClick={showNavbar} className="nav-btn nav-close-btn">
          <FaTimes />
        </button>
      </nav>

      <button onClick={showNavbar} className="nav-btn">
        <FaBars />
      </button>
    </header>
  );
}

export default Navbar;
