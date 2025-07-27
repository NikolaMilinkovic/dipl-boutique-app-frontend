import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { UserType } from '../global/types';
import { DropdownOptionType } from '../components/dropdowns/Dropdown';
import { betterConsoleLog, betterErrorLog } from '../util-methods/log-methods';
import { useSocket } from './socket-context';
import { useFetchData } from '../hooks/useFetchData';
import { notifyError } from '../components/util-components/Notify';

interface UserContextTypes {
  user: UserType | null;
  setUser: (user: UserType) => void;
  clearUser: () => void;
  getRoleDropdownOptions: () => DropdownOptionType[];
  fetchUserDataViaLocalStorage: () => any;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextTypes>({
  user: null,
  setUser: () => {},
  clearUser: () => {},
  getRoleDropdownOptions: () => [],
  fetchUserDataViaLocalStorage: () => {},
});

export function UserContextProvider({ children }: UserProviderProps) {
  const [user, setUserState] = useState<UserType | null>(null);
  const { fetchData } = useFetchData();

  useEffect(() => {
    betterConsoleLog('> User permissions: ', user?.permissions);
  }, [user]);

  function setUser(user: UserType | null) {
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

  function handleUpdateCurrentUser(newUser: UserType) {
    if (user?._id === newUser._id) {
      setUserState(newUser);
    }
  }

  async function getUser() {
    try {
      const response = await fetchData(`user/get/${user?.id}`, 'GET');
      if (response.status === 200) {
        setUserState(response);
      }
    } catch (err) {
      notifyError('Error while fetching user data');
      betterErrorLog('> Error while fetching user data', err);
    }
  }
  function getCurrentUserData() {
    getUser();
  }

  async function fetchUserDataViaLocalStorage() {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      try {
        const response = await fetchData(`user/get/${parsedUser?.id}`, 'GET');
        if (response) {
          return response;
        }
      } catch (err) {
        notifyError('Error while fetching user data');
        betterErrorLog('> Error while fetching user data', err);
      }
    }
    return false;
  }

  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;
    socket.on('connect', getCurrentUserData);
    socket.on('updateCurrentUser', handleUpdateCurrentUser);

    return () => {
      socket.off('connect', getCurrentUserData);
      socket.off('updateCurrentUser', handleUpdateCurrentUser);
    };
  }, [socket, user]);

  const value: UserContextTypes = {
    user,
    setUser,
    clearUser,
    getRoleDropdownOptions,
    fetchUserDataViaLocalStorage,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Optional helper hook
export function useUser() {
  return useContext(UserContext);
}
