import { useState } from 'react';
import AddProduct from './AddProduct';
import './addAndEditProducts.scss';
import ProductsList from '../../../components/lists/products-list/ProductsList';

function AddAndEditProducts() {
  return (
    <>
      <section className="add-edit-products-main">
        <AddProduct />
        <ProductsList showAddBtn={false} styles={{ paddingTop: '43.6px' }} />
      </section>
    </>
  );
}

export default AddAndEditProducts;
