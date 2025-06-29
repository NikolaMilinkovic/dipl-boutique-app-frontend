import React, { createContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifyError } from '../components/util-components/Notify';
interface LoginResultType {
  isAuthenticated: boolean;
  message: string;
  token: string;
}
interface AuthContextTypes {
  token: string | null;
  isAuthenticated: boolean;
  authenticate: (token: string | null) => void;
  logout: () => void;
  login: (username: string, password: string) => Promise<void>;
}
interface AuthContextProviderType {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextTypes>({
  token: '',
  isAuthenticated: false,
  authenticate: (token: string | null) => {},
  logout: () => {},
  login: async (username: string, password: string) => {},
});

function AuthContextProvider({ children }: AuthContextProviderType) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const navigate = useNavigate();

  // TODO > ADD USER TYPES
  const [user, setUser] = useState<any>(null);

  /**
   * Authenticates the user, stores token in localStorage, and updates auth state.
   * @param token - Authentication token
   */
  function authenticate(token: string | null): void {
    setAuthToken(token);
    localStorage.setItem('token', token ? token : '');
  }

  /**
   * Logs out the user by clearing the auth token from state and localStorage.
   */
  function logout(): void {
    setAuthToken(null);
    localStorage.removeItem('token');
  }

  /**
   * Sends username & password to the server for authentication
   * Receives token from the server and calls auth-context > authenticate(token) method
   * @param {String} username
   * @param {String} password
   * @param {String | null} expoPushToken
   * @returns {Promise<void>}
   */
  async function login(username: string, password: string): Promise<void> {
    if (!username || !password) {
      return notifyError(
        'Invalid input, please provide a valid username & password.',
      );
    }

    try {
      const result: LoginResultType = await loginUser({
        username,
        password,
      });

      if (result.isAuthenticated === false) {
        return notifyError(result.message);
      }

      authenticate(result.token);
      navigate('/');
    } catch (err) {
      setLoginErrorMessage(`Issue logging in user: ${err}`);
    }
  }

  async function loginUser({ username, password }: any): Promise<any> {
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      // Parsing server response
      const parsedResponse = await response.json();

      // Auth Fail
      if (!response.ok) {
        const authStatus = {
          isAuthenticated: response.ok,
          message: parsedResponse.message || 'Login failed. Please try again.',
          token: '',
        };
        return authStatus;

        // Auth Success
      } else {
        const authStatus = {
          isAuthenticated: response.ok,
          message: parsedResponse.message || 'Login successful.',
          token: parsedResponse.token || '',
        };

        return authStatus;
      }
    } catch (error) {
      console.error(`[ERROR] Failed to login user: ` + error);
      return {
        isAuthenticated: false,
        message:
          'Network error. Please check your connection or try again later.',
        token: '',
      };
    }
  }

  const value: AuthContextTypes = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
    login: login,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
