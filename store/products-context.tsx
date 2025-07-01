import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { useFetchData } from '../hooks/useFetchData';
import { useSocket } from './socket-context';
import { notifyError } from '../components/util-components/Notify';
import { betterErrorLog } from '../util-methods/log-methods';
import {
  CourierTypes,
  DressTypes,
  ProductsByCategoryTypes,
  ProductsBySuppliersTypes,
  ProductTypes,
  PurseTypes,
} from '../global/types';
import { useAuth } from './auth-context';

interface ProductsContextTypes {
  products: ProductTypes[];
  setProducts: React.Dispatch<React.SetStateAction<ProductTypes[]>>;
}

interface ProductsProviderProps {
  children: ReactNode;
}

interface ProductContextDataTypes {
  activeProducts: ProductTypes[];
  inactiveProducts: ProductTypes[];
  allProducts: ProductTypes[];
}

export const ProductsContext = createContext<ProductsContextTypes>({
  products: [],
  setProducts: () => {},
});

export function ProductsContextProvider({ children }: ProductsProviderProps) {
  // const [productsBySuppliers, setProductsBySuppliers] =
  //   useState<ProductsBySuppliersTypes>();
  // const [productsByCategory, setProductsByCategory] =
  //   useState<ProductsByCategoryTypes>();
  const { token, logout } = useAuth();
  const { socket } = useSocket();
  const { fetchData } = useFetchData();
  const [products, setProducts] = useState<ProductContextDataTypes>({
    activeProducts: [],
    inactiveProducts: [],
    allProducts: [],
  });

  async function handleConnect() {
    try {
      const response = await fetchData('product/get', 'GET');
      if (typeof response === 'object') {
        setProducts(response);
      } else {
        notifyError('Podaci o proizvodima nisu preuzei');
      }
    } catch (err) {
      betterErrorLog('> Error while fetching products', err);
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on('connect', handleConnect);

      return () => {
        socket.off('connect', handleConnect);
      };
    }
  }, [socket]);

  const value: ProductsContextTypes = {
    products,
    setProducts,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
