import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { useSocket } from './socket-context';
import { betterErrorLog } from '../util-methods/log-methods';
import { notifyError } from '../components/util-components/Notify';
import { useAuth } from './auth-context';
import { useFetchData } from '../hooks/useFetchData';
import { DropdownOptionType } from '../components/dropdowns/Dropdown';
import { OrderTypes } from '../global/types';

export interface CategoryTypes {
  _id: string;
  name: string;
  stockType: string;
}

interface CategoriesContextTypes {
  categories: CategoryTypes[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryTypes[]>>;
  getCategories: () => void;
  getCategoryDropdownItems: () => DropdownOptionType[];
}

interface CategoriesProviderProps {
  children: ReactNode;
}

export const CategoriesContext = createContext<CategoriesContextTypes>({
  categories: [],
  setCategories: () => {},
  getCategories: () => {},
  getCategoryDropdownItems: () => [],
});

export function CategoriesContextProvider({
  children,
}: CategoriesProviderProps) {
  const { token, logout } = useAuth();
  const { socket } = useSocket();
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const { fetchData } = useFetchData();

  // Fetch method
  async function getCategories() {
    try {
      const response = await fetchData('category/get', 'GET');
      if (Array.isArray(response)) {
        setCategories(response);
      } else {
        notifyError('Podaci o bojama nisu preuzei');
        setCategories([]);
      }
    } catch (err) {
      notifyError('Error while fetching categories');
      betterErrorLog('> Error while fetching categories', err);
    }
  }

  async function handleConnect() {
    if (!token) return logout();
    getCategories();
  }

  function getCategoryDropdownItems() {
    const items: DropdownOptionType[] = [];
    categories.forEach((category) => {
      items.push({
        value: category.stockType,
        label: category.name,
      });
    });

    return items;
  }

  useEffect(() => {
    if (socket) {
      /**
       * Adds a new category to the state.
       * @param newCategory - The category to add.
       */
      const handleCategoryAdded = (newCategory: CategoryTypes) => {
        setCategories((prevCategories) => [...prevCategories, newCategory]);
      };

      /**
       * Removes a category from the state by ID.
       * @param categoryId - ID of the category to remove.
       */
      const handleCategoryRemoved = (categoryId: string) => {
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== categoryId),
        );
      };

      /**
       * Updates an existing category in the state.
       * @param updatedCategory - The updated category data.
       */
      const handleCategoryUpdated = (updatedCategory: CategoryTypes) => {
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category._id === updatedCategory._id ? updatedCategory : category,
          ),
        );
      };

      socket.on('connect', handleConnect);
      socket.on('categoryAdded', handleCategoryAdded);
      socket.on('categoryRemoved', handleCategoryRemoved);
      socket.on('categoryUpdated', handleCategoryUpdated);

      return () => {
        socket.off('connect', handleConnect);
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
    getCategoryDropdownItems,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoriesContext);
}
