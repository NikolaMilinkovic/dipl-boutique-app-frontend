import { useContext } from 'react';
import { Bounce, ToastContainer } from 'react-toastify';
import { AuthContext } from '../../store/auth-context';
import Products from '../../pages/landing/Products';
import Login from '../../pages/login/Login';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../../pages/dashboard/Dashboard';
import AppSetup from '../../pages/appSetup/AppSetup';
import './navigation.scss';

/**
 * AUTH > Imamo 2 stacka koji se nalaze u Navigation metodi
 *
 * Login tako sto saljemo username i sifru
 * Backend validira credentials i salje nazad token
 * Token se store odredjenu kolicinu vremena na racunaru
 */

/**
 * Handles different Navigation Stack based on isAuthenticated flag in the context
 */
function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        className="toast-container"
      />
      {!authCtx.isAuthenticated && <Login />}
      {authCtx.isAuthenticated && (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/app-setup" element={<AppSetup />} />
          <Route path="/logout" element={<Login />} />
        </Routes>
      )}
    </>
  );
}

export default Navigation;
