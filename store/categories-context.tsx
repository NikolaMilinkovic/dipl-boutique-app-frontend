import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { fetchData } from '../util-methods/fetch-methods';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from './socket-context';
import { betterErrorLog } from '../util-methods/log-methods';
import { notifyError } from '../components/util-components/Notify';

export interface CategoryTypes {
  _id: string;
  name: string;
  stockType: string;
}

interface CategoriesContextTypes {
  categories: CategoryTypes[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryTypes[]>>;
  getCategories: () => void;
}

interface CategoriesProviderProps {
  children: ReactNode;
}

export const CategoriesContext = createContext<CategoriesContextTypes>({
  categories: [],
  setCategories: () => {},
  getCategories: () => {},
});

export function CategoriesContextProvider({
  children,
}: CategoriesProviderProps) {
  const { token } = useAuth();
  const { socket } = useSocket();
  const [categories, setCategories] = useState<CategoryTypes[]>([]);

  // Fetch method
  async function getCategories() {
    try {
      const response = await fetchData(token, 'category/get', 'GET');
      if (response && response.ok && response.status !== 304) {
        setCategories(response);
      }
    } catch (err) {
      notifyError('Error while fetching categories');
      betterErrorLog('> Error while fetching categories', err);
    }
  }

  // Initial Fetch
  useEffect(() => {
    async function getCategories() {
      try {
        const response = await fetchData(token, 'category/get', 'GET');
        setCategories(response);
      } catch (err) {}
    }
    if (!token) return;
    getCategories();
  }, [token]);

  useEffect(() => {
    if (socket) {
      const handleCategoryAdded = (newCategory: CategoryTypes) => {
        setCategories((prevCategories) => [...prevCategories, newCategory]);
      };
      const handleCategoryRemoved = (categoryId: string) => {
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== categoryId),
        );
      };
      const handleCategoryUpdated = (updatedCategory: CategoryTypes) => {
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category._id === updatedCategory._id ? updatedCategory : category,
          ),
        );
      };

      socket.on('categoryAdded', handleCategoryAdded);
      socket.on('categoryRemoved', handleCategoryRemoved);
      socket.on('categoryUpdated', handleCategoryUpdated);

      // Cleans up the listener on unmount
      // Without this we would get 2x the data as we are rendering multiple times
      return () => {
        socket.off('categoryAdded', handleCategoryAdded);
        socket.off('categoryRemoved', handleCategoryRemoved);
        socket.off('categoryUpdated', handleCategoryUpdated);
      };
    }
  }, [socket]);

  const value: CategoriesContextTypes = {
    categories,
    setCategories,
    getCategories,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

// Optional helper hook
export function useCategories() {
  return useContext(CategoriesContext);
}
