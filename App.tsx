import { useContext, useEffect, useState } from 'react';
import './App.css';
import { AuthContext } from './store/auth-context';
import ContextProvider from './store/context-provider';
import SplashScreen from './pages/splashScreen/SplashScreen';
import Navigation from './components/navigation/Navigation';
import { Bounce, ToastContainer } from 'react-toastify';
import { useUser } from './store/user-context';

function Root() {
  const [isAuthenticatingToken, setIsAuthenticatingToken] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const authCtx = useContext(AuthContext);
  const { setUser, fetchUserDataViaLocalStorage } = useUser();

  /**
   * Checks the token in the localStorage upon app startup
   * Finds token => Adds it to the Auth Context
   * No token => Logout user
   */
  useEffect(() => {
    async function getToken() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          // Fetch user data or look at local storage if we cant fetch
          const fetchedUserData = await fetchUserDataViaLocalStorage();
          const parsedUser = JSON.parse(user);
          if (fetchedUserData) {
            setUser(fetchedUserData.user);
          } else {
            setUser(parsedUser);
          }
          authCtx.authenticate(token);
        } catch {
          authCtx.logout();
        }
      } else {
        authCtx.logout();
      }

      setIsAuthenticatingToken(false);
    }

    getToken();

    if (authCtx.isAuthenticated) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [authCtx.isAuthenticated]);

  /**
   * Handles removing the initial splash screen
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3700);
    return () => clearTimeout(timer);
  }, []);

  if (isAuthenticatingToken || showSplash) {
    return <SplashScreen />;
  }

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
      <main className="fade-in">
        <Navigation />
      </main>
    </>
  );
}

export default function App() {
  return (
    <ContextProvider>
      <Root />
    </ContextProvider>
  );
}
