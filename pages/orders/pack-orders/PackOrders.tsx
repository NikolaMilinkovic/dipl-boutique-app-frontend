import { useEffect, useState } from 'react';
import { useOrders } from '../../../store/orders-context';
import { OrderTypes } from '../../../global/types';
import PackOrdersControls from './components/PackOrdersControls';
import { DropdownOptionType } from '../../../components/dropdowns/Dropdown';
import PackOrdersList from './components/PackOrdersList';

function PackOrders() {
  const [selectedCourier, setSelectedCourier] =
    useState<DropdownOptionType | null>(null);
  useEffect(() => {
    if (selectedCourier && selectedCourier.value === '') {
      setSelectedCourier(null);
    }
  }, [selectedCourier]);
  const { orders } = useOrders();
  const [filteredOrders, setFilteredOrders] = useState<OrderTypes[]>([]);
  useEffect(() => {
    if (selectedCourier === null) {
      setFilteredOrders(() =>
        orders.unprocessedOrders.filter((order) => order.packed === false),
      );
    } else {
      const filteredUnpackedOrders = orders.unprocessedOrders.filter(
        (order) =>
          order.packed === false &&
          order?.courier?.name === selectedCourier.label &&
          order.reservation === false,
      );
      setFilteredOrders(() => [...filteredUnpackedOrders]);
    }
  }, [orders.unprocessedOrders, selectedCourier]);

  return (
    <>
      <PackOrdersControls
        selectedCourier={selectedCourier}
        setSelectedCourier={setSelectedCourier}
        orders={orders.unprocessedOrders}
      />
      <PackOrdersList selectedCourier={selectedCourier} data={filteredOrders} />
    </>
  );
}

export default PackOrders;
