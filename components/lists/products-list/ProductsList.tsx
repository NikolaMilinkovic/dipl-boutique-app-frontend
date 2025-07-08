import React from 'react';
import { useProducts } from '../../../store/products-context';
import AnimatedList from '../AnimatedList';
import ProductDisplayItem from '../../../pages/products/ProductDisplayItem';

function ProductsList({ searchTerm }: { searchTerm: string }) {
  const { products } = useProducts();

  const colorSearchFunction = React.useCallback(
    (product, term: string) =>
      product.name.toLowerCase().includes(term.toLowerCase()),
    [],
  );

  if (products.allProducts.length === 0) return <></>;

  return (
    <div style={{ paddingTop: '43.6px', width: '100%' }}>
      {products.allProducts.length > 0 && (
        <AnimatedList
          items={products.allProducts}
          searchTerm={searchTerm}
          searchFunction={colorSearchFunction}
          renderItem={ProductDisplayItem}
          noDataImage="/img/no_data_found.png"
          noDataAlt="Infinity Boutique Logo"
          className="color-list-section"
          maxWidth="100%"
          height="90vh"
        />
      )}
    </div>
  );
}

export default React.memo(ProductsList);
