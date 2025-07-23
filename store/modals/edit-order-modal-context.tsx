import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  SetStateAction,
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
import { useFetchData } from '../../hooks/useFetchData';
import {
  notifyError,
  notifySuccess,
} from '../../components/util-components/Notify';
import {
  betterConsoleLog,
  betterErrorLog,
} from '../../util-methods/log-methods';

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
  removedProducts: Product[];
  setRemovedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  newProducts: Product[];
  setNewProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onSubmitOrderUpdate: () => any;
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
  const [removedProducts, setRemovedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const { handleFetchingWithFormData } = useFetchData();

  useEffect(() => {
    if (editedOrder && editedOrder.products) {
      betterConsoleLog('> Products', editedOrder.products);
    }
  }, [editedOrder]);

  async function handleUpdateOrderWithFormData() {
    try {
      const data: any = new FormData();
      if (editedOrder.buyer.profileImage instanceof File) {
        data.append(
          'profileImage',
          editedOrder.buyer.profileImage,
          editedOrder.buyer.profileImage.name,
        );
      }

      data.append('name', editedOrder.buyer.name);
      data.append('address', editedOrder.buyer.address);
      data.append('place', editedOrder.buyer.place);
      data.append('phone', editedOrder.buyer.phone);
      data.append('phone2', editedOrder.buyer.phone2);
      data.append('courier', JSON.stringify(editedOrder.courier) as string);
      data.append('products', JSON.stringify(editedOrder.products) as string);
      data.append('reservation', editedOrder.reservation ? 'true' : 'false');
      data.append('packed', editedOrder.packed ? 'true' : 'false');
      data.append('productsPrice', editedOrder.productsPrice);
      data.append('totalPrice', editedOrder.totalPrice);

      const response = await handleFetchingWithFormData(
        data,
        `orders/update/${editedOrder?._id}`,
        'PATCH',
      );

      if (!response.ok) {
        const parsedResponse = await response?.json();
        return notifyError(parsedResponse.message);
      } else {
        const parsedResponse = await response?.json();
        return notifySuccess(parsedResponse.message);
      }
    } catch (error) {
      betterErrorLog('> Error while updating an order', error);
      notifyError('There was an error while updating the order');
    }
  }

  async function onSubmitOrderUpdate() {
    await handleUpdateOrderWithFormData();
  }

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

    setNewProducts((prev) => [...prev, fullProduct]);
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

    if (newProducts.length > 0) {
      setNewProducts((prev) => {
        const updatedNewProducts = [...prev];
        if (updatedNewProducts[index]) {
          updatedNewProducts[index] = {
            ...updatedNewProducts[index],
            selectedColor: selectedColorObj.color as string,
            selectedColorId: selectedColorObj._id as string,
          };
        }
        return updatedNewProducts;
      });
    }
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

    if (newProducts.length > 0) {
      setNewProducts((prev) => {
        const updatedNewProducts = [...prev];
        if (updatedNewProducts[index]) {
          updatedNewProducts[index] = {
            ...updatedNewProducts[index],
            selectedSize: selectedSizeObj.size,
            selectedSizeId: selectedSizeObj._id,
          };
        }
        return updatedNewProducts;
      });
    }
  };

  const removeProductHandler = (index: number) => {
    // Add product to removed products
    const productToRemove = editedOrder.products[index];
    if (!productToRemove) return;
    setRemovedProducts((prev) => [...prev, productToRemove as any]);

    // Handle display
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
        removedProducts,
        setRemovedProducts,
        newProducts,
        setNewProducts,
        onSubmitOrderUpdate,
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
