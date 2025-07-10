import React, { useState } from 'react';
import { useProducts } from '../../../store/products-context';
import AnimatedList from '../AnimatedList';
import ProductDisplayItem from '../../../pages/products/ProductDisplayItem';
import InputField from '../../util-components/InputField';

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
        height: '100.5vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        boxSizing: 'border-box',
        borderRadius: '4px',
        overflow: 'hidden',
        paddingBottom: '3rem',
      }}
    >
      <InputField
        backgroundColor="var(--primaryLight)"
        label="Search product | name | category | supplier | price"
        inputText={searchTerm}
        setInputText={setSearchTerm}
        showClearBtn={true}
      />
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
      />
    </div>
  );
}

export default React.memo(ProductsList);
