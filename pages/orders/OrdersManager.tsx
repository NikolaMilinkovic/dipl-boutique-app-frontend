import React from 'react';
import { Tab, Tabs } from '../../components/tabs/Tabs';

function OrdersManager() {
  return (
    <Tabs>
      <Tab label="Create new order">
        <section className="grid-1-1">
          <p>Levo lista proizvoda, gore filter</p>
          <p>Desno pravljenje porudzbine</p>
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
