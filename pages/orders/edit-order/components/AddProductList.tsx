import React, { useEffect, useMemo, useState } from 'react';
import { useProducts } from '../../../../store/products-context';
import { useDrawerModal } from '../../../../store/modals/drawer-modal-contex';
import { SearchParamsTypes } from '../../../../global/types';
import ProductFilters from '../../../../components/filters/ProductFilters';
import { searchProducts } from '../../../../util-methods/productFilterMethods';
import InputField from '../../../../components/util-components/InputField';
import Button from '../../../../components/util-components/Button';
import AnimatedList from '../../../../components/lists/AnimatedList';
import ProductDisplayItem from '../../../products/ProductDisplayItem';
import './addProductList.scss';
import { useAddProductModal } from './AddProductModal';
import { useEditOrder } from '../../../../store/modals/edit-order-modal-context';

function AddProductsList({ showAddBtn = true, styles = {}, onNext }) {
  const { products } = useProducts();
  const { addProductHandler } = useEditOrder();
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
      <div className="add-product-list-filters-container">
        <InputField
          backgroundColor="var(--white)"
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
          className="add-product-list-filter-btn"
        />
      </div>
      {products.allProducts.length > 0 && (
        <AnimatedList
          items={filteredData}
          renderItem={(item) => (
            <ProductDisplayItem
              data={item}
              showAddBtn={showAddBtn}
              showEditBtn={false}
              showDeleteBtn={false}
              addProductHandler={addProductHandler}
            />
          )}
          noDataImage="/img/no_data_found.png"
          noDataAlt="Infinity Boutique Logo"
          className="color-list-section"
          maxWidth="100%"
          height="60vh"
          containerStyles={{
            height: '60vh',
            backgroundColor: 'var(--primaryLight)',
          }}
        />
      )}
      <Button
        label="Pick colors and sizes"
        onClick={onNext}
        className="add-product-next-button"
      />
    </div>
  );
}

export default React.memo(AddProductsList);
