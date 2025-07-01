import React from 'react';
import './productsManager.scss';
import { Tab, Tabs } from '../../components/tabs/Tabs';
import AddAndEditProducts from './add-products/AddAndEditProducts';

function ProductsManager() {
  return (
    <Tabs>
      <Tab label="Create new order">
        <p>TMP</p>
      </Tab>
      <Tab label="Add | Edit products">
        <AddAndEditProducts />
      </Tab>
    </Tabs>
  );
}

export default ProductsManager;
