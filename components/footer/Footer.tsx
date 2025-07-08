import React from 'react';
import './footer.scss';
import { FaCode, FaGithub } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../store/auth-context';

function Footer() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return;
  const date = new Date();

  return (
    <footer style={{ marginTop: '4rem' }} className="fade">
      {/* COPYRIGHT */}
      <section>
        <a
          href="https://github.com/NikolaMilinkovic"
          className="copyright-link"
          target="_blank"
        >
          ©{date.getFullYear()} nikolamlinkovic221@gmail.com
        </a>

        {/* LOGO */}
        <div className="nav-logo">
          <NavLink className="nav-link" to="/">
            <img
              src="/img/infinity-white.png"
              alt="Infinity Boutique Logo"
              className="nav-logo"
            />
          </NavLink>
        </div>

        {/* SOCIALS */}
        <div className="socials">
          <p>Socials:</p>
          <a
            href="https://nikola-portfolio-website.vercel.app/"
            target="_blank"
          >
            <FaCode />
          </a>
          <a href="https://github.com/NikolaMilinkovic" target="_blank">
            <FaGithub />
          </a>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
