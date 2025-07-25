import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { User } from '../global/types';
import { DropdownOptionType } from '../components/dropdowns/Dropdown';

interface UserContextTypes {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  getRoleDropdownOptions: () => DropdownOptionType[];
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextTypes>({
  user: null,
  setUser: () => {},
  clearUser: () => {},
  getRoleDropdownOptions: () => [],
});

export function UserContextProvider({ children }: UserProviderProps) {
  const [user, setUserState] = useState<User | null>(null);

  function setUser(user: User | null) {
    setUserState(user);
  }

  function clearUser() {
    setUserState(null);
  }

  function getRoleDropdownOptions(): DropdownOptionType[] {
    return [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
    ];
  }

  const value: UserContextTypes = {
    user,
    setUser,
    clearUser,
    getRoleDropdownOptions,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Optional helper hook
export function useUser() {
  return useContext(UserContext);
}
