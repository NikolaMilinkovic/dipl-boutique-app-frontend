import InputField from '../../util-components/InputField';
import Button from '../../util-components/Button';
import './ordersFilter.scss';

function OrdersFilter({ searchTerm, setSearchTerm }) {
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
          // openDrawer(
          //   <ProductFilters
          //     searchParams={searchParams}
          //     setSearchParams={setSearchParams}
          //   />,
          //   JSON.stringify(searchParams),
          // );
        }}
        className="orders-list-filter-btn"
      />
    </div>
  );
}

export default OrdersFilter;
