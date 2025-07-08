import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { useFetchData } from '../hooks/useFetchData';
import { betterConsoleLog, betterErrorLog } from '../util-methods/log-methods';
import { DressColorTypes, PurseColorTypes } from '../global/types';
import {
  notifyError,
  notifySuccess,
  notifyWarrning,
} from '../components/util-components/Notify';

interface NewProductTypes {
  name: string;
  active: boolean;
  category: string;
  stockType: string;
  price: number | string;
  colors: (DressColorTypes | PurseColorTypes)[];
  image: File | null;
  description?: string;
  supplier?: string;
  totalStock?: number | string;
}

interface NewProductContextTypes {
  newProduct: NewProductTypes;
  setNewProduct: React.Dispatch<React.SetStateAction<NewProductTypes>>;
  addProduct: () => Promise<void>;
  clearNewProductData: () => Promise<void>;
}

interface NewProductProviderProps {
  children: ReactNode;
}

export const NewProductContext = createContext<NewProductContextTypes>({
  newProduct: {
    name: '',
    active: true,
    category: '',
    stockType: '',
    price: '',
    colors: [],
    image: null,
    description: '',
    supplier: '',
    totalStock: '',
  },
  setNewProduct: () => {},
  addProduct: async () => {},
  clearNewProductData: async () => {},
});

export function NewProductContextProvider({
  children,
}: NewProductProviderProps) {
  const { handleFetchingWithFormData } = useFetchData();
  const [newProduct, setNewProduct] = useState<NewProductTypes>({
    name: '',
    active: true,
    category: 'Haljina',
    stockType: 'Boja-Veličina-Količina',
    price: '',
    colors: [],
    image: null,
    description: '',
    supplier: '',
    totalStock: '',
  });

  function validateInput(): boolean {
    if (!newProduct.name) {
      notifyWarrning('Product name is missing');
      return false;
    }
    if (!newProduct.category) {
      notifyWarrning('Category missing');
      return false;
    }
    if (!newProduct.price) {
      notifyWarrning('Price is missing');
      return false;
    }
    if (!newProduct.stockType) {
      notifyWarrning('Stock Type is missing');
      return false;
    }
    if (newProduct.colors.length === 0) {
      notifyWarrning('Please select colors');
      return false;
    }
    if (!newProduct.image) {
      notifyWarrning('Please provide product image');
      return false;
    }

    return true;
  }

  async function addProduct() {
    try {
      const isDataValid = validateInput();
      if (!isDataValid) return;
      const formData = new FormData();
      formData.append('product', JSON.stringify(newProduct));
      formData.append('image', newProduct.image as File);

      const response = await handleFetchingWithFormData(
        formData,
        'product/add',
        'POST',
      );
      const res = await response.json();
      if (response.status === 200) {
        notifySuccess(res.message);
        clearNewProductData();
      } else {
        notifyError(res.message);
      }
    } catch (err) {
      betterErrorLog('Error while creating a new product.', err);
    }
  }

  function clearNewProductData() {
    setNewProduct({
      name: '',
      active: true,
      category: '',
      stockType: 'Boja-Veličina-Količina',
      price: '',
      colors: [],
      image: null,
      description: '',
      supplier: '',
      totalStock: '',
    });
  }

  const value = { newProduct, setNewProduct, addProduct, clearNewProductData };
  return (
    <NewProductContext.Provider value={value}>
      {children}
    </NewProductContext.Provider>
  );
}

export function useNewProduct() {
  return useContext(NewProductContext);
}
