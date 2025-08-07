import InputField from '../../util-components/InputField';
import Button from '../../util-components/Button';
import './ordersFilter.scss';
import { useDrawerModal } from '../../../store/modals/drawer-modal-contex';
import { useEffect } from 'react';
import Dropdown from '../../dropdowns/Dropdown';
import { useCategories } from '../../../store/categories-context';
import { useCouriers } from '../../../store/couriers-context';
import Checkbox from '../../checkbox/Checkbox';

function OrdersFilter({
  searchTerm,
  setSearchTerm,
  searchParams,
  setSearchParams,
}) {
  const { openDrawer, updateDrawerContent, isDrawerOpen } = useDrawerModal();
  useEffect(() => {
    // Update drawer content when searchParams change and drawer is open
    if (isDrawerOpen) {
      updateDrawerContent(
        <OrdersFilterDrawerControls
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />,
        JSON.stringify(searchParams),
      );
    }
  }, [searchParams, isDrawerOpen]);
  return (
    <div className="orders-list-filters-container">
      <InputField
        backgroundColor="var(--white)"
        label="Search orders"
        inputText={searchTerm}
        setInputText={setSearchTerm}
        showClearBtn={true}
      />
      <Button
        label="Filters"
        onClick={() => {
          openDrawer(
            <OrdersFilterDrawerControls
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />,
            JSON.stringify(searchParams),
          );
        }}
        className="orders-list-filter-btn"
      />
    </div>
  );
}

export default OrdersFilter;

function OrdersFilterDrawerControls({ searchParams, setSearchParams }) {
  const { closeDrawer } = useDrawerModal();
  const { getCouriersDropdownItems } = useCouriers();
  const options = getCouriersDropdownItems(true);

  function handleReset() {
    setSearchParams({
      courier: '',
      processed: false,
      packed: 'all',
    });
  }

  // Find the option matching the current searchParams.courier
  const selectedOption = options.find(
    (opt) => opt.label === searchParams.courier,
  ) || { value: '', label: 'Select...' };

  return (
    <section className="orders-filters-section">
      <h2>Order Filters</h2>

      {/* COURIER */}
      <div>
        <h3>Courier filter</h3>
        <Dropdown
          options={options as any}
          onSelect={(option) => {
            setSearchParams((prev) => ({
              ...prev,
              courier: option.value === '' ? '' : option.label,
            }));
          }}
          value={selectedOption}
        />
      </div>

      {/* PROCESSED */}
      <div>
        <h3>Processed</h3>
        <div className="order-filters-processed">
          <Checkbox
            label="Processed"
            checked={searchParams.processed}
            onCheckedChange={() => {
              setSearchParams((prev) => ({
                ...prev,
                processed: true,
              }));
            }}
          />
          <Checkbox
            label="Unprocessed"
            checked={!searchParams.processed}
            onCheckedChange={() => {
              setSearchParams((prev) => ({
                ...prev,
                processed: false,
              }));
            }}
          />
        </div>
      </div>

      {/* PACKED */}
      <div>
        <h3>Packed</h3>
        <div className="order-filters-packed">
          <Checkbox
            label="Packed"
            checked={searchParams.packed === 'packed'}
            onCheckedChange={() => {
              setSearchParams((prev) => ({
                ...prev,
                packed: 'packed',
              }));
            }}
          />
          <Checkbox
            label="Unpacked"
            checked={searchParams.packed === 'unpacked'}
            onCheckedChange={() => {
              setSearchParams((prev) => ({
                ...prev,
                packed: 'unpacked',
              }));
            }}
          />
          <Checkbox
            label="All"
            checked={searchParams.packed === 'all'}
            onCheckedChange={() => {
              setSearchParams((prev) => ({
                ...prev,
                packed: 'all',
              }));
            }}
          />
        </div>
      </div>

      <div className="order-filter-buttons">
        <Button label="Close" onClick={closeDrawer} />
        <Button label="Reset Filters" onClick={handleReset} />
      </div>
    </section>
  );
}

// const [searchParams, setSearchParams] = useState<OrdersSearchParamTypes>({
//   courier: '',
//   processed: false,
//   packed: 'all',
// });
