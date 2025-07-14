import { Tab, Tabs } from '../../components/tabs/Tabs';
import ProductsList from '../../components/lists/products-list/ProductsList';
import './ordersManager.scss';
import { useRef, useState } from 'react';
import NewOrderStepAccordion from '../../components/accordion/new-order-step-accordion';
import Button from '../../components/util-components/Button';
import SelectedItemsList from './new-order-components/step-1/SelectedItemsList';

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
  ) {
    if (closeRef.current && closeRef.current.close) {
      closeRef.current.close();
    }
    if (openRef.current && openRef.current.open) {
      openRef.current.open();
    }
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
            <NewOrderStepAccordion
              title="Selected products"
              ref={step1Ref}
              initialOpen={true}
            >
              <SelectedItemsList
                onNext={() => onNextStep(step1Ref, step2Ref)}
              />
            </NewOrderStepAccordion>
            <NewOrderStepAccordion title="Colors and sizes" ref={step2Ref}>
              <button onClick={() => onNextStep(step2Ref, step3Ref)}>
                Next
              </button>
            </NewOrderStepAccordion>
            <NewOrderStepAccordion title="Buyer information" ref={step3Ref}>
              <button onClick={() => onNextStep(step3Ref, step4Ref)}>
                Next
              </button>
            </NewOrderStepAccordion>
            <NewOrderStepAccordion title="Courier" ref={step4Ref}>
              <button onClick={() => onNextStep(step4Ref, step5Ref)}>
                Next
              </button>
            </NewOrderStepAccordion>
            <NewOrderStepAccordion title="New order overview" ref={step5Ref}>
              <p>OVERVIEW OF ALL ORDER DATA</p>
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
