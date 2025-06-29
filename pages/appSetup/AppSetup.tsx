import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from '../../components/tabs/Tabs';
import ColorsManager from './colors/ColorsManager';
import './appStup.scss';

function AppSetup() {
  return (
    <section className="fade app-setup-section">
      <Tabs>
        <Tab label="Colors">
          <ColorsManager />
        </Tab>
        <Tab label="Categories">
          <p>CATEGORIES</p>
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
