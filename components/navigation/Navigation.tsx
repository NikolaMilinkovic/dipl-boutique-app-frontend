import { useContext } from 'react';
import { Bounce, ToastContainer } from 'react-toastify';
import { AuthContext } from '../../store/auth-context';
import Login from '../../pages/login/Login';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../../pages/dashboard/Dashboard';
import AppSetup from '../../pages/appSetup/AppSetup';
import './navigation.scss';
import ProductsManager from '../../pages/products/ProductsManager';
import OrdersManager from '../../pages/orders/OrdersManager';
import Navbar from './Navbar';
import Footer from '../footer/Footer';

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
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<OrdersManager />} />
            <Route path="/products" element={<ProductsManager />} />
            <Route path="/app-setup" element={<AppSetup />} />
            <Route path="/logout" element={<Login />} />
          </Routes>
          <Footer />
        </>
      )}
    </>
  );
}

export default Navigation;
