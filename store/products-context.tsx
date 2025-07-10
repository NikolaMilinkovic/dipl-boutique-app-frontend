import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { useFetchData } from '../hooks/useFetchData';
import { useSocket } from './socket-context';
import {
  notifyError,
  notifySuccess,
  notifyWarrning,
} from '../components/util-components/Notify';
import { betterErrorLog } from '../util-methods/log-methods';
import { DressTypes, ProductTypes, PurseTypes } from '../global/types';

interface ProductsContextTypes {
  products: ProductContextDataTypes;
  setProducts: React.Dispatch<React.SetStateAction<ProductContextDataTypes>>;
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
  products: {
    activeProducts: [],
    inactiveProducts: [],
    allProducts: [],
  },
  setProducts: () => {},
});

export function ProductsContextProvider({ children }: ProductsProviderProps) {
  // const [productsBySuppliers, setProductsBySuppliers] =
  //   useState<ProductsBySuppliersTypes>();
  // const [productsByCategory, setProductsByCategory] =
  //   useState<ProductsByCategoryTypes>();
  const { socket } = useSocket();
  const { fetchData, handleFetchingWithFormData } = useFetchData();
  const [products, setProducts] = useState<ProductContextDataTypes>({
    activeProducts: [],
    inactiveProducts: [],
    allProducts: [],
  });

  async function handleConnect() {
    try {
      const response = await fetchData('product/get-all-products', 'GET');
      if (typeof response === 'object') {
        setProducts(response);
      } else {
        notifyError('Podaci o proizvodima nisu preuzei');
      }
    } catch (err) {
      betterErrorLog('> Error while fetching products', err);
    }
  }

  function handleAddProduct(newProduct: DressTypes | PurseTypes) {
    setProducts((prev) => ({
      ...prev,

      // All products
      allProducts: [...prev.allProducts, newProduct],

      // Active
      activeProducts: newProduct.active
        ? [...prev.activeProducts, newProduct]
        : prev.activeProducts,

      // Inactive
      inactiveProducts: !newProduct.active
        ? [...prev.inactiveProducts, newProduct]
        : prev.inactiveProducts,
    }));
  }
  function handleRemoveProduct(id: string) {
    setProducts((prev) => ({
      ...prev,

      allProducts: prev.allProducts.filter((product) => product._id !== id),

      activeProducts: prev.activeProducts.filter(
        (product) => product._id !== id,
      ),

      inactiveProducts: prev.inactiveProducts.filter(
        (product) => product._id !== id,
      ),
    }));
  }
  function handleUpdateProduct(updatedProduct: DressTypes | PurseTypes) {
    setProducts((prev) => ({
      ...prev,

      allProducts: prev.allProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product,
      ),

      activeProducts: updatedProduct.active
        ? [
            ...prev.activeProducts.filter((p) => p._id !== updatedProduct._id),
            updatedProduct,
          ]
        : prev.activeProducts.filter((p) => p._id !== updatedProduct._id),

      inactiveProducts: !updatedProduct.active
        ? [
            ...prev.inactiveProducts.filter(
              (p) => p._id !== updatedProduct._id,
            ),
            updatedProduct,
          ]
        : prev.inactiveProducts.filter((p) => p._id !== updatedProduct._id),
    }));
  }

  useEffect(() => {
    if (socket) {
      socket.on('connect', handleConnect);
      socket.on('productAdded', handleAddProduct);
      socket.on('productRemoved', handleRemoveProduct);
      socket.on('productUpdated', handleUpdateProduct);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('productAdded', handleAddProduct);
        socket.off('productRemoved', handleRemoveProduct);
        socket.off('productUpdated', handleUpdateProduct);
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
