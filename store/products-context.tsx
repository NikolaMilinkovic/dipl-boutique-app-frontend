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
import { DressTypes, ProductTypes, PurseTypes } from '../global/types';
import {
  DressStockDataDecrease,
  PurseStockDataDecrease,
} from '../util-methods/stockMethods';

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
  const { fetchData } = useFetchData();
  const [products, setProducts] = useState<ProductContextDataTypes>({
    activeProducts: [],
    inactiveProducts: [],
    allProducts: [],
  });

  // Update all products upon active / inactive product changes
  useEffect(() => {
    setProducts((prev) => ({
      ...prev,
      allProducts: [...products.activeProducts, ...products.inactiveProducts],
    }));
  }, [products.activeProducts, products.inactiveProducts]);

  async function handleConnect() {
    try {
      const response = await fetchData('product/get-all-products', 'GET');
      if (typeof response === 'object') {
        setProducts(response);
      } else {
        notifyError('Fetching products failed');
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

  // function decreasePurseStockHandler(data: any) {
  //   console.log('> decreasePurseStockHandler called');
  //   if (data.stockType === 'Boja-Količina') {
  //     decreasePurseStock(
  //       data,
  //       setActivePurses as React.Dispatch<React.SetStateAction<PurseTypes[]>>,
  //     );
  //   }
  // }
  // function increasePurseStockHandler(data: any) {
  //   console.log('> increasePurseStockHandler called');
  //   if (data.stockType === 'Boja-Količina') {
  //     increasePurseStock(
  //       data,
  //       setActivePurses as React.Dispatch<React.SetStateAction<PurseTypes[]>>,
  //     );
  //   }
  // }

  // function decreaseDressStockHandler(data: any) {
  //   if (data.length > 0) {
  //     for (const dress of data) {
  //       decreaseDressStock(
  //         dress,
  //         setActiveDresses as React.Dispatch<
  //           React.SetStateAction<DressTypes[]>
  //         >,
  //       );
  //     }
  //   }
  // }
  // function increaseDressStockHandler(data: any) {
  //   if (data.stockType === 'Boja-Veličina-Količina') {
  //     increaseDressStock(
  //       data,
  //       setActiveDresses as React.Dispatch<React.SetStateAction<DressTypes[]>>,
  //     );
  //   }
  // }
  function handleStockDecrease(
    data: (DressStockDataDecrease | PurseStockDataDecrease)[],
  ) {
    setProducts((prev) => {
      const updated = prev.activeProducts.map((product) => {
        const match = data.find(
          (d) => d.dressId === product._id || d.purseId === product._id,
        );
        if (!match) return product;

        const newProduct = { ...product, totalStock: product.totalStock - 1 };

        if ('sizeId' in match) {
          // Dress update
          newProduct.colors = newProduct.colors.map((color) =>
            color._id === match.colorId
              ? {
                  ...color,
                  sizes: color.sizes.map((size) =>
                    size._id === match.sizeId
                      ? { ...size, stock: size.stock - 1 }
                      : size,
                  ),
                }
              : color,
          );
        } else {
          // Purse update
          newProduct.colors = newProduct.colors.map((color) =>
            color._id === match.colorId
              ? {
                  ...color,
                  stock:
                    color.stock - match.decrement >= 0
                      ? color.stock - match.decrement
                      : color.stock,
                }
              : color,
          );
        }

        return newProduct;
      });

      return { ...prev, activeProducts: updated };
    });
  }

  useEffect(() => {
    if (!socket) return;
    if (socket) {
      socket.on('connect', handleConnect);
      socket.on('productAdded', handleAddProduct);
      socket.on('productRemoved', handleRemoveProduct);
      socket.on('productUpdated', handleUpdateProduct);
      socket.on('handleProductStockDecrease', handleStockDecrease);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('productAdded', handleAddProduct);
        socket.off('productRemoved', handleRemoveProduct);
        socket.off('productUpdated', handleUpdateProduct);
        socket.off('handleProductStockDecrease', handleStockDecrease);
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
