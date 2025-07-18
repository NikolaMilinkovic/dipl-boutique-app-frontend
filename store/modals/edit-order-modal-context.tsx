import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import './edit-order-modal-context-styles.scss';
import { OrderTypes } from '../../global/types';

type DrawerContent = ReactNode;

interface EditOrderDrawerModalContextType {
  openDrawer: (order: OrderTypes) => void;
  closeDrawer: () => void;
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
  const [editedOrder, setEditedOrder] = useState<OrderTypes | null>(null);

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

  return (
    <EditOrderDrawerModalContext.Provider
      value={{
        openDrawer,
        closeDrawer,
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
            {editedOrder && (
              <p>
                {editedOrder._id} {editedOrder.buyer.name}
              </p>
            )}
            <p>This is the edit order component</p>
            {/* <EditOrder/> */}
          </div>
        </div>
      )}
    </EditOrderDrawerModalContext.Provider>
  );
};
