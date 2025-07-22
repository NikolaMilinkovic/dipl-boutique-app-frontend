import { useEffect, useState } from 'react';
import './ordersList.scss';
import { OrderTypes } from '../../../global/types';
import { useFetchData } from '../../../hooks/useFetchData';
import { notifyError, notifySuccess } from '../../util-components/Notify';
import BatchModeOrderControlls from './BatchModeOrderControls';
import OrderItem from './OrderItem';
import AnimatedList from '../AnimatedList';
import { useConfirmationModal } from '../../../store/modals/confirmation-modal-context';
// setEditedOrder
const OrdersList = ({ data }) => {
  const [editedOrder, setEditedOrder] = useState<OrderTypes | null>(null);
  const { fetchWithBodyData } = useFetchData();
  const [batchMode, setBatchMode] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<OrderTypes[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [longPressActivated, setLongPressActivated] = useState(false);
  const { showConfirmation } = useConfirmationModal();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && batchMode) {
        resetBatch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [batchMode]);

  function resetBatch() {
    setBatchMode(false);
    setSelectedOrders([]);
    setIsAllSelected(false);
  }

  function handleLongPress(order) {
    if (batchMode) return;
    setLongPressActivated(true);
    setTimeout(() => setLongPressActivated(false), 500);
    if (selectedOrders.length === 0) setSelectedOrders([order as OrderTypes]);
    setBatchMode(true);
  }

  function handlePress(order) {
    if (!batchMode || longPressActivated || selectedOrders.length === 0) return;

    const isSelected = selectedOrders.some((item) => item._id === order._id);

    if (isSelected) {
      const updated = selectedOrders.filter((item) => item._id !== order._id);
      setSelectedOrders(updated);
      if (updated.length === 0) resetBatch();
      setIsAllSelected(false);
    } else {
      const updated = [...selectedOrders, order];
      setSelectedOrders(updated);
      if (updated.length === data.length) setIsAllSelected(true);
    }
  }

  async function removeBatchOrdersHandler() {
    showConfirmation(async () => {
      notifySuccess('> Deleting orders');
      // showModal(async () => {
      const ids = selectedOrders.map((order) => order._id);
      const response = await fetchWithBodyData(
        'orders/remove-orders-batch',
        ids,
        'DELETE',
      );

      if (!response) {
        notifyError('There was an error while deleting orders');
        return;
      }

      const result = await response.json();
      notifySuccess(result.message);
      if (response.ok) resetBatch();
    }, 'Are you sure you want to delete these orders?');
  }

  function selectAllOrdarsHandler() {
    if (isAllSelected) {
      resetBatch();
    } else {
      setSelectedOrders(data);
      setIsAllSelected(true);
      setBatchMode(true);
    }
  }

  function getTotalOrdersCount() {
    return `Ukupno Porudžbina: ${data.length}`;
  }

  return (
    <div className="order-items-wrapper">
      <p className="order-items-header">{getTotalOrdersCount()}</p>
      {batchMode && (
        <BatchModeOrderControlls
          active={batchMode}
          onRemoveBatchPress={removeBatchOrdersHandler}
          onSelectAllOrders={selectAllOrdarsHandler}
          isAllSelected={isAllSelected}
        />
      )}

      <div className={`order-items-list ${batchMode ? 'batch' : ''}`}>
        {/* {data.map((item) => ( */}
        <AnimatedList
          items={data}
          renderItem={(item: OrderTypes) => (
            <div
              onClick={() => handlePress(item)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleLongPress(item);
              }}
              key={`order-${item._id}`}
            >
              <OrderItem
                order={item as OrderTypes}
                setEditedOrder={setEditedOrder}
                highlightedItems={selectedOrders}
                batchMode={batchMode}
                onRemoveHighlight={handlePress}
                onPress={handlePress}
                onLongPress={handleLongPress}
                key={`order-${item._id}`}
              />
            </div>
          )}
          noDataImage="/img/no_data_found.png"
          noDataAlt="Infinity Boutique Logo"
          className="color-list-section"
          maxWidth="100%"
          height="100%"
        />
        {/* ))} */}
      </div>
    </div>
  );
};

export default OrdersList;
