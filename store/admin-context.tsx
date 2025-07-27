import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { NewUserTypes, User, UserType } from '../global/types';
import { useUser } from './user-context';
import { useFetchData } from '../hooks/useFetchData';
import { notifyError } from '../components/util-components/Notify';
import { useSocket } from './socket-context';

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
  const { socket } = useSocket();
  const { user, setUser } = useUser();
  const { fetchWithBodyData } = useFetchData();
  const [usersData, setUsersData] = useState<UserType[]>([]);
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

  async function handleConnect() {
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
          setUsersData(parsed.users);
        } else {
          notifyError(parsed.message);
        }
      }
    }
    await getAllUsers(user);
  }

  async function handleNewUserAdded(user) {
    setUsersData((prev) => [user, ...prev]);
  }
  async function handleRemoveUser(id: string) {
    setUsersData((prev) => prev.filter((user) => user._id !== id));
  }
  async function handleUpdateUser(updatedUser) {
    setUsersData((prev) =>
      prev.map((user) => (user._id === updatedUser._id ? updatedUser : user)),
    );
    if (updatedUser._id === user?.id) {
      setUser(updatedUser);
    }
  }

  useEffect(() => {
    if (!socket) return;
    socket.on('connect', handleConnect);
    socket.on('newUserAdded', handleNewUserAdded);
    socket.on('removeUser', handleRemoveUser);
    socket.on('updateUser', handleUpdateUser);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('newUserAdded', handleNewUserAdded);
      socket.off('removeUser', handleRemoveUser);
      socket.off('updateUser', handleUpdateUser);
    };
  }, [socket, user]);

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
