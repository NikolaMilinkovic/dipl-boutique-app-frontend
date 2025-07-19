import React, { useEffect, useMemo, useState } from 'react';
import { useProducts } from '../../../store/products-context';
import AnimatedList from '../AnimatedList';
import ProductDisplayItem from '../../../pages/products/ProductDisplayItem';
import InputField from '../../util-components/InputField';
import Button from '../../util-components/Button';
import './productsList.scss';
import { useDrawerModal } from '../../../store/modals/drawer-modal-contex';
import ProductFilters from '../../filters/ProductFilters';
import { searchProducts } from '../../../util-methods/productFilterMethods';
import { SearchParamsTypes } from '../../../global/types';

function ProductsList({
  showAddBtn = true,
  showEditBtn = true,
  showDeleteBtn = true,
  styles = {},
}) {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState<string | number>('');
  const { openDrawer, updateDrawerContent, isDrawerOpen } = useDrawerModal();
  const [searchParams, setSearchParams] = useState<SearchParamsTypes>({
    available: true,
    soldOut: false,
    availableAndSoldOut: false,
    onCategorySearch: '',
    onSupplierSearch: '',
    onColorsSearch: [],
    onSizeSearch: [],
    active: true,
    inactive: false,
  });

  useEffect(() => {
    // Update drawer content when searchParams change and drawer is open
    if (isDrawerOpen) {
      updateDrawerContent(
        <ProductFilters
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />,
        JSON.stringify(searchParams),
      );
    }
  }, [searchParams, isDrawerOpen]);

  const filteredData = useMemo(() => {
    return searchProducts(
      searchTerm as string,
      products.activeProducts,
      searchParams,
    );
  }, [
    products.activeProducts,
    searchTerm,
    searchParams.available,
    searchParams.soldOut,
    searchParams.availableAndSoldOut,
    searchParams.onCategorySearch,
    searchParams.onSupplierSearch,
    searchParams.onColorsSearch,
    searchParams.onSizeSearch,
    searchParams.active,
    searchParams.inactive,
  ]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        boxSizing: 'border-box',
        borderRadius: '4px',
        overflow: 'hidden',
        ...styles,
      }}
    >
      <div className="product-list-filters-container">
        <InputField
          backgroundColor="var(--primaryLight)"
          label="Search product"
          inputText={searchTerm}
          setInputText={setSearchTerm}
          showClearBtn={true}
        />
        <Button
          label="Filters"
          onClick={() => {
            openDrawer(
              <ProductFilters
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />,
              JSON.stringify(searchParams),
            );
          }}
          className="product-list-filter-btn"
        />
      </div>
      {products.allProducts.length > 0 && (
        <AnimatedList
          items={filteredData}
          renderItem={(item) => (
            <ProductDisplayItem
              data={item}
              showAddBtn={showAddBtn}
              showEditBtn={showEditBtn}
              showDeleteBtn={showDeleteBtn}
            />
          )}
          noDataImage="/img/no_data_found.png"
          noDataAlt="Infinity Boutique Logo"
          className="color-list-section"
          maxWidth="100%"
          height="100%"
          containerStyles={{ paddingBottom: '3rem' }}
        />
      )}
    </div>
  );
}

export default React.memo(ProductsList);
