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

interface DropdownSelectedItem {
  value: string;
  label: string;
}

interface NewProductTypes {
  name: string;
  active: boolean;
  category: DropdownSelectedItem;
  stockType: string;
  price: number | string;
  colors: (DressColorTypes | PurseColorTypes)[];
  image: File | null;
  description?: string;
  supplier?: DropdownSelectedItem;
  totalStock?: number | string;
}

interface NewProductContextTypes {
  newProduct: NewProductTypes;
  setNewProduct: React.Dispatch<React.SetStateAction<NewProductTypes>>;
  addProduct: () => Promise<boolean>;
  clearNewProductData: () => void;
}

interface NewProductProviderProps {
  children: ReactNode;
}

export const NewProductContext = createContext<NewProductContextTypes>({
  newProduct: {
    name: '',
    active: true,
    category: { label: '', value: '' },
    stockType: '',
    price: '',
    colors: [],
    image: null,
    description: '',
    supplier: { label: '', value: '' },
    totalStock: '',
  },
  setNewProduct: () => {},
  addProduct: async () => false,
  clearNewProductData: () => {},
});

export function NewProductContextProvider({
  children,
}: NewProductProviderProps) {
  const { handleFetchingWithFormData } = useFetchData();
  const [newProduct, setNewProduct] = useState<NewProductTypes>({
    name: '',
    active: true,
    category: { value: 'Boja-Veličina-Količina', label: 'Haljina' },
    stockType: 'Boja-Veličina-Količina',
    price: '',
    colors: [],
    image: null,
    description: '',
    supplier: { value: '', label: 'Supplier' },
    totalStock: '',
  });

  useEffect(() => {
    betterConsoleLog('', newProduct);
  }, [newProduct]);

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

  async function addProduct(): Promise<boolean> {
    try {
      const preparedProductData = {
        ...newProduct,
        category: newProduct.category?.label,
        supplier: newProduct.supplier?.value,
      };

      const isDataValid = validateInput();
      if (!isDataValid) return false;
      const formData = new FormData();
      formData.append('product', JSON.stringify(preparedProductData));
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
        return true;
      } else {
        notifyError(res.message);
        return false;
      }
    } catch (err) {
      betterErrorLog('Error while creating a new product.', err);
      return false;
    }
  }

  function clearNewProductData() {
    setNewProduct({
      name: '',
      active: true,
      category: { value: 'Boja-Veličina-Količina', label: 'Haljina' },
      stockType: 'Boja-Veličina-Količina',
      price: '',
      colors: [],
      image: null,
      description: '',
      supplier: { value: '', label: 'Supplier' },
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
