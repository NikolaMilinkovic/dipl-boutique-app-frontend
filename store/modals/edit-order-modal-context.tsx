import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import './edit-order-modal-context-styles.scss';
import {
  DressColorTypes,
  OrderTypes,
  Product,
  ProductTypes,
  PurseColorTypes,
} from '../../global/types';
import EditOrder from '../../pages/orders/edit-order/EditOrder';
import { AddProductModalProvider } from '../../pages/orders/edit-order/components/AddProductModal';

type DrawerContent = ReactNode;

interface EditOrderDrawerModalContextType {
  openDrawer: (order: OrderTypes) => void;
  closeDrawer: () => void;
  addProductHandler: (product: ProductTypes) => void;
  removeProductHandler: (index: number) => void;
  editedOrder: OrderTypes;
  updateProductColorByIndexHandler: (
    index: number,
    selectedColorObj: DressColorTypes | PurseColorTypes,
  ) => void;
  updateProductSizeByIndexHandler: (
    index: number,
    selectedSizeObj: { _id: string; size: string },
  ) => void;
}

const EditOrderDrawerModalContext = createContext<
  EditOrderDrawerModalContextType | undefined
>(undefined);

export const useEditOrder = () => {
  const context = useContext(EditOrderDrawerModalContext);
  if (!context)
    throw new Error(
      'useEditOrder must be used within EditOrderDrawerModalProvider',
    );
  return context;
};

export const EditOrderDrawerModalProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [editedOrder, setEditedOrder] = useState<OrderTypes>(null);

  const openDrawer = (order: OrderTypes) => {
    setEditedOrder(order);
    setIsRendered(true);
    setTimeout(() => setIsVisible(true), 10);
  };

  const closeDrawer = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsRendered(false);
    }, 300);
  };

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  const addProductHandler = (product: ProductTypes) => {
    function getMondoDBType(stockType: string) {
      if (stockType === 'Boja-Veličina-Količina') return 'Dress';
      return 'Purse';
    }
    const fullProduct: Product = {
      category: product.category ?? '',
      image: product.image ?? { imageName: '', uri: '' },
      itemReference: product ?? null,
      mongoDB_type: getMondoDBType(product.stockType),
      name: product.name ?? '',
      price: product.price ?? 0,
      selectedColor: '',
      selectedColorId: '',
      selectedSize: '',
      selectedSizeId: '',
      stockType: product.stockType ?? '',
    };

    setEditedOrder((prev: any) => {
      if (!prev) return prev;

      return {
        ...prev,
        products: [...prev.products, fullProduct],
      };
    });
  };

  const updateProductColorByIndexHandler = (
    index: number,
    selectedColorObj: DressColorTypes | PurseColorTypes,
  ) => {
    setEditedOrder((prev) => {
      const updatedProducts = [...prev.products];
      if (updatedProducts[index]) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          selectedColor: selectedColorObj.color as string,
          selectedColorId: selectedColorObj._id as string,
        };
      }
      return {
        ...prev,
        products: updatedProducts,
      };
    });
  };

  const updateProductSizeByIndexHandler = (
    index: number,
    selectedSizeObj: { _id: string; size: string },
  ) => {
    setEditedOrder((prev) => {
      const updatedProducts = [...prev.products];
      if (updatedProducts[index]) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          selectedSize: selectedSizeObj.size,
          selectedSizeId: selectedSizeObj._id,
        };
      }
      return {
        ...prev,
        products: updatedProducts,
      };
    });
  };

  const removeProductHandler = (index: number) => {
    setEditedOrder((prev) => {
      if (!prev) return prev;
      const updatedProducts = [...prev.products];
      updatedProducts.splice(index, 1);
      return {
        ...prev,
        products: updatedProducts,
      };
    });
  };

  return (
    <EditOrderDrawerModalContext.Provider
      value={{
        editedOrder,
        openDrawer,
        closeDrawer,
        addProductHandler,
        removeProductHandler,
        updateProductColorByIndexHandler,
        updateProductSizeByIndexHandler,
      }}
    >
      {children}
      {isRendered && (
        <div
          className={`edit-order-drawer-overlay ${isVisible ? 'visible' : 'hide-overlay'}`}
          onClick={closeDrawer}
        >
          <div
            className={`edit-order-drawer ${isVisible ? 'show-drawer' : 'hide-drawer'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <AddProductModalProvider>
              {editedOrder && (
                <EditOrder
                  editedOrder={editedOrder}
                  setEditedOrder={setEditedOrder}
                  closeDrawer={closeDrawer}
                />
              )}
            </AddProductModalProvider>
          </div>
        </div>
      )}
    </EditOrderDrawerModalContext.Provider>
  );
};
