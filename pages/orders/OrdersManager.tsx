import { Tab, Tabs } from '../../components/tabs/Tabs';
import ProductsList from '../../components/lists/products-list/ProductsList';
import './ordersManager.scss';
import { useMemo, useRef, useState } from 'react';
import StepAccordion from '../../components/accordion/step-accordion';
import SelectedItemsList from './new-order-components/step-1/SelectedItemsList';
import ColorSizeSelectorsList from './new-order-components/step-2/ColorSizeSelectorList';
import BuyerInformationInputs from './new-order-components/step-3/BuyerInformationInputs';
import CourierSelection from './new-order-components/step-4/CourierSelection';
import NewOrderOverview from './new-order-components/step-5/NewOrderOverview';
import OrdersList from '../../components/lists/orders-list/OrdersList';
import { useOrders } from '../../store/orders-context';
import { useNewOrder } from '../../store/new-order-context';
import PackOrders from './pack-orders/PackOrders';
import OrdersFilter from '../../components/lists/orders-list/OrdersFilter';
import { searchOrders } from '../../util-methods/orderFilterMethods';

export interface AccordionRef {
  open: () => void;
  close: () => void;
}

function OrdersManager() {
  const step1Ref = useRef<AccordionRef>(null);
  const step2Ref = useRef<AccordionRef>(null);
  const step3Ref = useRef<AccordionRef>(null);
  const step4Ref = useRef<AccordionRef>(null);
  const step5Ref = useRef<AccordionRef>(null);
  const buyerProfileImageRef = useRef<{ resetImage: () => void }>(null);
  const {
    newOrderData,
    updateProductColorByIndexHandler,
    updateProductSizeByIndexHandler,
  } = useNewOrder();

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

  function onReset() {
    step1Ref.current?.open();
    step2Ref.current?.close();
    step3Ref.current?.close();
    step4Ref.current?.close();
    step5Ref.current?.close();
    buyerProfileImageRef.current?.resetImage();
    document.getElementById('step-1')?.scrollIntoView({ behavior: 'smooth' });
  }

  // TEMPORARY FOR TESTING > PUT INTO A MODAL
  const { orders } = useOrders();

  const packedVal = ['packed', 'unpacked', 'all'] as const;
  interface OrdersSearchParamTypes {
    courier: string;
    processed: boolean;
    packed: (typeof packedVal)[number];
  }

  // ORDER FILTERING
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useState<OrdersSearchParamTypes>({
    courier: '',
    processed: false,
    packed: 'all',
  });

  const filteredData = useMemo(() => {
    return searchOrders(searchTerm as string, orders, searchParams);
  }, [
    orders,
    searchParams.courier,
    searchParams.packed,
    searchParams.processed,
    searchTerm,
  ]);

  return (
    <Tabs>
      {/* CREATE NEW ORDER */}
      <Tab label="Create new order">
        <section className="orders-manager-section">
          {/* LEFT */}
          <ProductsList showDeleteBtn={false} styles={{ paddingTop: '1rem' }} />

          {/* RIGHT */}
          <div
            className="default-card"
            style={{
              paddingTop: '1rem',
              gap: '0.3rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h2>New Order</h2>
            {/* STEP 1 - ITEMS LIST */}
            <StepAccordion
              title="Selected products"
              ref={step1Ref}
              initialOpen={true}
              id="step-1"
            >
              <SelectedItemsList
                onNext={() => onNextStep(step1Ref, step2Ref, 'step-1')}
              />
            </StepAccordion>

            {/* STEP 2 - COLOR SIZE SELECTORS */}
            <StepAccordion title="Colors and sizes" ref={step2Ref} id="step-2">
              <ColorSizeSelectorsList
                orderData={newOrderData}
                updateProductColorByIndexHandler={
                  updateProductColorByIndexHandler
                }
                updateProductSizeByIndexHandler={
                  updateProductSizeByIndexHandler
                }
                onNext={() => onNextStep(step2Ref, step3Ref, 'step-2')}
              />
            </StepAccordion>

            {/* STEP 3 - BUYER INFORMATION INPUTS */}
            <StepAccordion title="Buyer information" ref={step3Ref} id="step-3">
              <BuyerInformationInputs
                onNext={() => onNextStep(step3Ref, step4Ref, 'step-3')}
                ref={buyerProfileImageRef}
              />
            </StepAccordion>

            {/* STEP 4 - COURIER SELECTOR */}
            <StepAccordion title="Courier" ref={step4Ref} id="step-4">
              <CourierSelection
                onNext={() => onNextStep(step4Ref, step5Ref, 'step-4')}
              />
            </StepAccordion>

            {/* STEP 5 - ORDER OVERVIEW */}
            <StepAccordion
              title="New order overview"
              ref={step5Ref}
              id="step-5"
            >
              <NewOrderOverview onReset={onReset} />
            </StepAccordion>
          </div>
        </section>
      </Tab>

      {/* ORDERS AND PACKAGING */}
      <Tab label="Orders and Packaging">
        <section className="orders-manager-section">
          <div className="packaging-orders-list-container default-card">
            <h2>Orders List</h2>
            <OrdersFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
            <OrdersList data={filteredData} />
          </div>
          <div className="packaging-pack-orders-container default-card">
            <h2>Pack Orders</h2>
            <PackOrders />
          </div>
        </section>
      </Tab>
    </Tabs>
  );
}

export default OrdersManager;
