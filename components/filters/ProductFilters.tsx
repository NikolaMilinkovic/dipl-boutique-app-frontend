import './productFilters.scss';
import Checkbox from '../checkbox/Checkbox';
import { SearchParamsTypes } from '../../global/types';
import Dropdown from '../dropdowns/Dropdown';
import { useCategories } from '../../store/categories-context';
import { useEffect, useState } from 'react';
import { useSuppliers } from '../../store/suppliers-context';
import ColorsSelect from '../colors-select/ColorsSelect';
import Button from '../util-components/Button';
import { useDrawerModal } from '../../store/modals/drawer-modal-contex';

interface ProductFiltersPropTypes {
  searchParams: SearchParamsTypes;
  setSearchParams: (param: any) => void;
}

function ProductFilters({
  searchParams,
  setSearchParams,
}: ProductFiltersPropTypes) {
  // =================================================[ CATEGORY ]=================================================
  const { getCategoryDropdownItems } = useCategories();
  const { closeDrawer } = useDrawerModal();
  const tempItems = getCategoryDropdownItems();
  const categoryDropdownOptions = [
    { label: 'Reset selection', value: '' },
    ...tempItems,
  ];
  const getInitialSelectedCategory = () => {
    if (searchParams.onCategorySearch) {
      // Find the option that matches the current search parameter
      const foundOption = categoryDropdownOptions.find(
        (option) => option.label === searchParams.onCategorySearch,
      );
      return foundOption || { label: 'Choose a category', value: '' };
    }
    return { label: 'Choose a category', value: '' };
  };

  const [selectedCategory, setSelectedCategory] = useState(
    getInitialSelectedCategory,
  );

  // Update selectedCategory when searchParams.onCategorySearch changes
  useEffect(() => {
    const newSelectedCategory = getInitialSelectedCategory();
    setSelectedCategory(newSelectedCategory);
  }, [searchParams.onCategorySearch]);

  function handleCategorySelect(option) {
    setSelectedCategory(option);

    // Update searchParams directly
    setSearchParams((prev) => ({
      ...prev,
      onCategorySearch: option.label === 'Reset selection' ? '' : option.label,
    }));
  }
  // =================================================[ \CATEGORY ]=================================================

  // =================================================[ SUPPLIER ]=================================================
  const { getSupplierDropdownItems } = useSuppliers();
  let supplierDropdownOptions = getSupplierDropdownItems();
  supplierDropdownOptions[0].label = 'Reset selection';

  const getInitialSelectedSupplier = () => {
    if (searchParams.onSupplierSearch) {
      // Find the option that matches the current search parameter
      const foundOption = supplierDropdownOptions.find(
        (option) => option.label === searchParams.onSupplierSearch,
      );
      return foundOption || { label: 'Choose a supplier', value: '' };
    }
    return { label: 'Choose a supplier', value: '' };
  };

  const [selectedSupplier, setSelectedSupplier] = useState(
    getInitialSelectedSupplier,
  );

  // Update selectedSupplier  when searchParams.onSupplierSearch changes
  useEffect(() => {
    const newSelectedSupplier = getInitialSelectedSupplier();
    setSelectedSupplier(newSelectedSupplier);
  }, [searchParams.onSupplierSearch]);

  function handleSupplierSelect(option) {
    setSelectedSupplier(option);

    // Update searchParams directly
    setSearchParams((prev) => ({
      ...prev,
      onSupplierSearch: option.label === 'Reset selection' ? '' : option.label,
    }));
  }
  // =================================================[ \SUPPLIER ]=================================================

  function handleStockToggle(
    selected: 'available' | 'soldOut' | 'availableAndSoldOut',
  ) {
    setSearchParams((prev) => ({
      ...prev,
      available: false,
      soldOut: false,
      availableAndSoldOut: false,
      [selected]: true,
    }));
  }

  function handleSizeSelect(size: string) {
    setSearchParams((prev) => {
      const exists = prev.onSizeSearch.includes(size);
      const newSizes = exists
        ? prev.onSizeSearch.filter((s) => s !== size)
        : [...prev.onSizeSearch, size];

      return {
        ...prev,
        onSizeSearch: newSizes,
      };
    });
  }

  function handleColorSelect(colors) {
    const resolvedColors =
      typeof colors === 'function'
        ? colors(searchParams.onColorsSearch)
        : colors;

    setSearchParams((prev) => ({
      ...prev,
      onColorsSearch: resolvedColors,
    }));
  }

  function handleReset() {
    setSearchParams({
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
  }

  return (
    <section className="product-filters-section">
      <h2>Product Filters</h2>
      {/* Stanje na lageru */}
      <div>
        <h3>Stock availability</h3>
        <div className="product-filters-stock">
          <Checkbox
            label="Available"
            checked={searchParams.available}
            onCheckedChange={() => handleStockToggle('available')}
          />
          <Checkbox
            label="Sold Out"
            checked={searchParams.soldOut}
            onCheckedChange={() => handleStockToggle('soldOut')}
          />
          <Checkbox
            label="All"
            checked={searchParams.availableAndSoldOut}
            onCheckedChange={() => handleStockToggle('availableAndSoldOut')}
          />
        </div>
      </div>

      <div>
        <h3>Category filter</h3>
        <Dropdown
          options={categoryDropdownOptions}
          onSelect={handleCategorySelect}
          value={selectedCategory}
        />
      </div>

      <div>
        <h3>Supplier filter</h3>
        <Dropdown
          options={supplierDropdownOptions}
          onSelect={handleSupplierSelect}
          value={selectedSupplier}
        />
      </div>

      <div>
        <h3>Size filter</h3>
        <div className="product-filter-size">
          <Checkbox
            label="UNI"
            checked={searchParams.onSizeSearch.includes('UNI')}
            onCheckedChange={() => handleSizeSelect('UNI')}
          />
          <Checkbox
            label="XS"
            checked={searchParams.onSizeSearch.includes('XS')}
            onCheckedChange={() => handleSizeSelect('XS')}
          />
          <Checkbox
            label="S"
            checked={searchParams.onSizeSearch.includes('S')}
            onCheckedChange={() => handleSizeSelect('S')}
          />
          <Checkbox
            label="M"
            checked={searchParams.onSizeSearch.includes('M')}
            onCheckedChange={() => handleSizeSelect('M')}
          />
          <Checkbox
            label="L"
            checked={searchParams.onSizeSearch.includes('L')}
            onCheckedChange={() => handleSizeSelect('L')}
          />
          <Checkbox
            label="XL"
            checked={searchParams.onSizeSearch.includes('XL')}
            onCheckedChange={() => handleSizeSelect('XL')}
          />
        </div>
      </div>

      <div>
        <h3>Color filter</h3>
        <br />
        <div>
          <ColorsSelect
            selectedColors={searchParams.onColorsSearch || []}
            setSelectedColors={handleColorSelect}
            backgroundColor="var(--white)"
          />
        </div>
      </div>

      <div className="product-filter-buttons">
        <Button label="Close" onClick={closeDrawer} />
        <Button label="Reset Filters" onClick={handleReset} />
      </div>
    </section>
  );
}

export default ProductFilters;
