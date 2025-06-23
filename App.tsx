import React, { useCallback, useContext, useEffect, useState } from 'react';
import './App.css';
import { AuthContext } from './store/auth-context';
import { betterConsoleLog } from './util-methods/log-methods';
import ContextProvider from './store/context-provider';
import Login from './pages/login/Login';
import SplashScreen from './pages/splashScreen/SplashScreen';
import LandingPage from './pages/landing/LandingPage';
import { ToastContainer, Bounce } from 'react-toastify';

function Root() {
  const [isAuthenticatingToken, setIsAuthenticatingToken] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const authCtx = useContext(AuthContext);

  /**
   * Checks the token in the localStorage upon app startup
   * Finds token => Adds it to the Auth Context
   * No token => Logout user
   */
  useEffect(() => {
    async function getToken() {
      const token = localStorage.getItem('token');
      if (token) {
        authCtx.authenticate(token);
      } else {
        authCtx.logout();
      }

      setIsAuthenticatingToken(false);
    }

    getToken();
  }, [authCtx]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3700);
    return () => clearTimeout(timer);
  }, []);

  if (isAuthenticatingToken || showSplash) {
    return <SplashScreen />;
  }

  return <Navigation />;
}

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
  betterConsoleLog('> Logging isAuthenticated', authCtx.isAuthenticated);

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
      {authCtx.isAuthenticated && <LandingPage />}
      {!authCtx.isAuthenticated && <Login />}
    </>
  );
}

export default function App() {
  return (
    <>
      <ContextProvider>
        <Root />
      </ContextProvider>
    </>
  );
}
