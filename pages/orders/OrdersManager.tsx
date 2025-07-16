import { Tab, Tabs } from '../../components/tabs/Tabs';
import ProductsList from '../../components/lists/products-list/ProductsList';
import './ordersManager.scss';
import { useRef } from 'react';
import NewOrderStepAccordion from '../../components/accordion/new-order-step-accordion';
import SelectedItemsList from './new-order-components/step-1/SelectedItemsList';
import ColorSizeSelectorsList from './new-order-components/step-2/ColorSizeSelectorList';
import BuyerInformationInputs from './new-order-components/step-3/BuyerInformationInputs';
import CourierSelection from './new-order-components/step-4/CourierSelection';
import NewOrderOverview from './new-order-components/step-5/NewOrderOverview';

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
    document.getElementById('step-1')?.scrollIntoView({ behavior: 'smooth' });
  }
  return (
    <Tabs>
      <Tab label="Create new order">
        <section className="grid-1-1 new-order-section">
          {/* LEFT */}
          <ProductsList showDeleteBtn={false} styles={{ paddingTop: '1rem' }} />

          {/* RIGHT */}
          <div
            style={{
              paddingTop: '1rem',
              gap: '0.3rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* STEP 1 - ITEMS LIST */}
            <NewOrderStepAccordion
              title="Selected products"
              ref={step1Ref}
              initialOpen={true}
              id="step-1"
            >
              <SelectedItemsList
                onNext={() => onNextStep(step1Ref, step2Ref, 'step-1')}
              />
            </NewOrderStepAccordion>

            {/* STEP 2 - COLOR SIZE SELECTORS */}
            <NewOrderStepAccordion
              title="Colors and sizes"
              ref={step2Ref}
              id="step-2"
            >
              <ColorSizeSelectorsList
                onNext={() => onNextStep(step2Ref, step3Ref, 'step-2')}
              />
            </NewOrderStepAccordion>

            {/* STEP 3 - BUYER INFORMATION INPUTS */}
            <NewOrderStepAccordion
              title="Buyer information"
              ref={step3Ref}
              id="step-3"
            >
              <BuyerInformationInputs
                onNext={() => onNextStep(step3Ref, step4Ref, 'step-3')}
              />
            </NewOrderStepAccordion>

            {/* STEP 4 - COURIER SELECTOR */}
            <NewOrderStepAccordion title="Courier" ref={step4Ref} id="step-4">
              <CourierSelection
                onNext={() => onNextStep(step4Ref, step5Ref, 'step-4')}
              />
            </NewOrderStepAccordion>

            {/* STEP 5 - ORDER OVERVIEW */}
            <NewOrderStepAccordion
              title="New order overview"
              ref={step5Ref}
              id="step-5"
            >
              <NewOrderOverview onReset={onReset} />
            </NewOrderStepAccordion>
          </div>
        </section>
      </Tab>
      <Tab label="Orders and Packaging">
        <section className="grid-1-1">
          <p>Levo lista porudzbina sa dugmicima za Edit / Delete</p>
          <p>
            Desno Pakovanje sa indikatorima i dugmetom za zavrsavanje pakovanja
          </p>
        </section>
      </Tab>
    </Tabs>
  );
}

export default OrdersManager;
