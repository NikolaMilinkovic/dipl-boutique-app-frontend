import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { NewUserTypes, User } from '../global/types';
import { useUser } from './user-context';
import { useFetchData } from '../hooks/useFetchData';
import {
  notifyError,
  notifySuccess,
} from '../components/util-components/Notify';
import { betterConsoleLog } from '../util-methods/log-methods';

interface AdminContextTypes {
  usersData: User[];
  setUsersData: (user: User[]) => void;
  newUser: NewUserTypes;
  setNewUser: (user: NewUserTypes) => void;
  getDefaultUserObject: () => NewUserTypes;
}

interface AdminContextProviderProps {
  children: ReactNode;
}

export const AdminContext = createContext<AdminContextTypes>({
  usersData: [],
  setUsersData: () => {},
  newUser: {
    username: '',
    password: '',
    role: 'user',
    permissions: {
      category: { add: false, edit: false, remove: false },
      color: { add: false, edit: false, remove: false },
      courier: { add: false, edit: false, remove: false },
      supplier: { add: false, edit: false, remove: false },
      order: { add: false, edit: false, remove: false },
      product: { add: false, edit: false, remove: false },
    },
  },
  setNewUser: () => {},
  getDefaultUserObject: () => ({
    username: '',
    password: '',
    role: 'user',
    permissions: {
      category: { add: false, edit: false, remove: false },
      color: { add: false, edit: false, remove: false },
      courier: { add: false, edit: false, remove: false },
      supplier: { add: false, edit: false, remove: false },
      order: { add: false, edit: false, remove: false },
      product: { add: false, edit: false, remove: false },
    },
  }),
});

export function AdminContextProvider({ children }: AdminContextProviderProps) {
  const { user } = useUser();
  const { fetchWithBodyData } = useFetchData();
  const [usersData, setUsersData] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<NewUserTypes>({
    username: '',
    password: '',
    role: 'user',
    permissions: {
      category: {
        add: false,
        edit: false,
        remove: false,
      },
      color: {
        add: false,
        edit: false,
        remove: false,
      },
      courier: {
        add: false,
        edit: false,
        remove: false,
      },
      supplier: {
        add: false,
        edit: false,
        remove: false,
      },
      order: {
        add: false,
        edit: false,
        remove: false,
      },
      product: {
        add: false,
        edit: false,
        remove: false,
      },
    },
  });

  function getDefaultUserObject() {
    return {
      username: '',
      password: '',
      role: 'user',
      permissions: {
        category: {
          add: false,
          edit: false,
          remove: false,
        },
        color: {
          add: false,
          edit: false,
          remove: false,
        },
        courier: {
          add: false,
          edit: false,
          remove: false,
        },
        supplier: {
          add: false,
          edit: false,
          remove: false,
        },
        order: {
          add: false,
          edit: false,
          remove: false,
        },
        product: {
          add: false,
          edit: false,
          remove: false,
        },
      },
    };
  }

  useEffect(() => {
    async function getAllUsers(user) {
      if (usersData.length !== 0) return;
      if (!user) {
        setUsersData([]);
        return;
      }
      if (user.role === 'admin') {
        const user_id = user.id;
        const response = await fetchWithBodyData(
          'user/get-all',
          { user_id },
          'POST',
        );
        if (!response) return;
        const parsed = (await response.json()) as any;
        if (response.status === 200) {
          betterConsoleLog('> Users', parsed.users);
          setUsersData(parsed.users);
        } else {
          notifyError(parsed.message);
        }
      }
    }
    getAllUsers(user);
  }, [user]);

  const value: AdminContextTypes = {
    usersData,
    setUsersData,
    getDefaultUserObject,
    newUser,
    setNewUser,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

// Optional helper hook
export function useAdmin() {
  return useContext(AdminContext);
}
