import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import './addProductModal.scss';
import StepAccordion, {
  AccordionRef,
} from '../../../../components/accordion/step-accordion';
import AddProductList from './AddProductList';
import ColorSizeSelectorsList from '../../new-order-components/step-2/ColorSizeSelectorList';
import { useEditOrder } from '../../../../store/modals/edit-order-modal-context';

interface AddProductModalContextType {
  openModal: () => void;
  closeModal: () => void;
}

const AddProductModalContext = createContext<
  AddProductModalContextType | undefined
>(undefined);

export const useAddProductModal = () => {
  const context = useContext(AddProductModalContext);
  if (!context)
    throw new Error(
      'useAddProductModal must be used within AddProductModalProvider',
    );
  return context;
};

interface AddProductModalProviderProps {
  children: ReactNode;
}

export const AddProductModalProvider: React.FC<
  AddProductModalProviderProps
> = ({ children }) => {
  const {
    editedOrder,
    newProducts,
    updateProductSizeByIndexHandler,
    updateProductColorByIndexHandler,
  } = useEditOrder();
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const step1Ref = useRef<AccordionRef>(null);
  const step2Ref = useRef<AccordionRef>(null);
  const step3Ref = useRef<AccordionRef>(null);

  function onNextStep(
    closeRef: { current: { close?: () => void } | null },
    openRef: { current: { open?: () => void } | null },
    scrollElId: string,
  ) {
    if (closeRef.current && closeRef.current.close) {
      closeRef.current.close();
    }
    if (openRef.current && openRef.current.open) {
      openRef.current.open();
    }
    const el = document.getElementById(scrollElId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function exit() {
    step1Ref.current?.close();
    step2Ref.current?.close();
  }

  const openModal = () => {
    setIsRendered(true);
    setTimeout(() => setIsVisible(true), 10);
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setIsRendered(false), 300);
  };

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  return (
    <AddProductModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isRendered && (
        <div
          className={`add-product-modal-overlay ${isVisible ? 'add-product-visible' : 'add-product-hide'}`}
          onClick={closeModal}
        >
          <div
            className={`add-product-modal ${isVisible ? 'add-product-show' : 'add-product-hide'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* PRODUCTS LIST */}
            <StepAccordion
              title="Add new products"
              ref={step1Ref}
              initialOpen={true}
              id="step-1"
            >
              <div className="add-product-accordion-content-wrapper">
                <AddProductList
                  onNext={() => onNextStep(step1Ref, step2Ref, 'step-1')}
                />
              </div>
            </StepAccordion>

            {/* COLOR SIZE PICK */}
            <StepAccordion title="Colors and sizes" ref={step2Ref} id="step-2">
              <ColorSizeSelectorsList
                updateProductSizeByIndexHandler={
                  updateProductSizeByIndexHandler
                }
                updateProductColorByIndexHandler={
                  updateProductColorByIndexHandler
                }
                orderData={editedOrder}
                useAsEdit={true}
                onNext={() => {
                  closeModal();
                }}
              />
            </StepAccordion>
          </div>
        </div>
      )}
    </AddProductModalContext.Provider>
  );
};
