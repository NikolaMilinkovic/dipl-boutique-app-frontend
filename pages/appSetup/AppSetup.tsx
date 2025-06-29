import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from '../../components/tabs/Tabs';
import ColorsManager from './colors/ColorsManager';
import './appStup.scss';
import CategoriesManager from './categories/CategoriesManager';

function AppSetup() {
  return (
    <section className="fade app-setup-section">
      <Tabs>
        <Tab label="Colors">
          <ColorsManager />
        </Tab>
        <Tab label="Categories">
          <CategoriesManager />
        </Tab>
        <Tab label="Suppliers">
          <p>SUPPLIERS</p>
        </Tab>
        <Tab label="Couriers">
          <p>COURIERS</p>
        </Tab>
      </Tabs>
    </section>
  );
}

export default AppSetup;
