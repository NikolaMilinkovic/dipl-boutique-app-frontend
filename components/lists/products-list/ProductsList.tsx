import React, { useState } from 'react';
import { useProducts } from '../../../store/products-context';
import AnimatedList from '../AnimatedList';
import ProductDisplayItem from '../../../pages/products/ProductDisplayItem';
import InputField from '../../util-components/InputField';
import Button from '../../util-components/Button';
import './productsList.scss';

function ProductsList() {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState<string | number>('');

  const productSearchFunction = React.useCallback((product, term: string) => {
    const lowerTerm = term.toLowerCase();

    return (
      product.name.toLowerCase().includes(lowerTerm) ||
      product.category.toLowerCase().includes(lowerTerm) ||
      product.supplier?.toLowerCase().includes(lowerTerm) ||
      product.price?.toString().includes(lowerTerm)
    );
  }, []);

  return (
    <div
      style={{
        paddingTop: '43.6px',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        boxSizing: 'border-box',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <div className="product-list-filters-container">
        <InputField
          backgroundColor="var(--primaryLight)"
          label="Search product | name | category | supplier | price"
          inputText={searchTerm}
          setInputText={setSearchTerm}
          showClearBtn={true}
        />
        <Button
          label="Filters"
          onClick={() => {}}
          className="product-list-filter-btn"
        />
      </div>
      <AnimatedList
        items={products.allProducts}
        searchTerm={searchTerm}
        searchFunction={productSearchFunction}
        renderItem={(item) => (
          <ProductDisplayItem
            data={item}
            showAddBtn
            showEditBtn
            showDeleteBtn
          />
        )}
        noDataImage="/img/no_data_found.png"
        noDataAlt="Infinity Boutique Logo"
        className="color-list-section"
        maxWidth="100%"
        height="100%"
        containerStyles={{ paddingBottom: '3rem' }}
      />
    </div>
  );
}

export default React.memo(ProductsList);
