import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { User } from '../global/types';

interface UserContextTypes {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextTypes>({
  user: null,
  setUser: () => {},
  clearUser: () => {},
});

export function UserContextProvider({ children }: UserProviderProps) {
  const [user, setUserState] = useState<User | null>(null);

  function setUser(user: User | null) {
    setUserState(user);
  }

  function clearUser() {
    setUserState(null);
  }

  const value: UserContextTypes = {
    user,
    setUser,
    clearUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Optional helper hook
export function useUser() {
  return useContext(UserContext);
}
