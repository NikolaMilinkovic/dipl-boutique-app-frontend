import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useFetchData } from '../hooks/useFetchData';
import { notifyError } from '../components/util-components/Notify';
import { betterErrorLog } from '../util-methods/log-methods';
import { CourierTypes, OrderTypes } from '../global/types';
import { useSocket } from './socket-context';

export interface OrdersDataTypes {
  processedOrders: OrderTypes[];
  unprocessedOrders: OrderTypes[];
  unpackedOrders: OrderTypes[];
}
interface OrdersContextTypes {
  orders: OrdersDataTypes;
  combinedOrders: OrderTypes[];
}

export const OrdersContext = createContext<OrdersContextTypes>({
  orders: {
    processedOrders: [],
    unprocessedOrders: [],
    unpackedOrders: [],
  },
  combinedOrders: [],
});

interface OrdersContextProviderTypes {
  children: ReactNode;
}

function OrdersContextProvider({ children }: OrdersContextProviderTypes) {
  const { fetchData } = useFetchData();
  const { socket } = useSocket();
  const [orders, setOrders] = useState<OrdersDataTypes>({
    processedOrders: [],
    unprocessedOrders: [],
    unpackedOrders: [],
  });
  const [combinedOrders, setCombinedOrders] = useState([
    ...orders.processedOrders,
    ...orders.unprocessedOrders,
  ]);
  useEffect(() => {
    setCombinedOrders([...orders.processedOrders, ...orders.unprocessedOrders]);
  }, [orders.processedOrders, orders.unprocessedOrders]);

  async function handleConnect() {
    try {
      const response = await fetchData('orders/get', 'GET');
      if (typeof response === 'object') {
        setOrders(response.orders);
      } else {
        notifyError('Fetching orders failed');
      }
    } catch (err) {
      betterErrorLog('> Error while fetching orders', err);
    }
  }

  function handleOrderRemoved(orderId: string) {
    setOrders((prev) => ({
      ...prev,
      unprocessedOrders: prev.unprocessedOrders.filter(
        (o: OrderTypes) => o._id !== orderId,
      ),
      processedOrders: prev.processedOrders.filter(
        (o: OrderTypes) => o._id !== orderId,
      ),
    }));
  }

  function handleBatchOrderRemoved(orderIds: string[]) {
    setOrders((prev) => ({
      ...prev,
      unprocessedOrders: prev.unprocessedOrders.filter(
        (o: OrderTypes) => !orderIds.includes(o._id),
      ),
      processedOrders: prev.processedOrders.filter(
        (o: OrderTypes) => !orderIds.includes(o._id),
      ),
    }));
  }

  function handleOrderAdded(newOrder: OrderTypes) {
    setOrders((prev) => ({
      ...prev,
      unprocessedOrders: [newOrder, ...prev.unprocessedOrders],
    }));
  }

  function handleOrderUpdated(updatedOrder: OrderTypes) {
    const hasAllIds = updatedOrder.products.every((p) => p._id);
    if (!hasAllIds) {
      console.warn(
        'Updated order contains products without _id fields:',
        updatedOrder,
      );
    }

    setOrders((prev) => ({
      ...prev,
      unprocessedOrders: prev.unprocessedOrders.map((order: OrderTypes) =>
        order._id === updatedOrder._id ? updatedOrder : order,
      ),
    }));
  }

  function handlePackedIndicatorToTrue(id: string) {
    setOrders((prev) => ({
      ...prev,
      unpackedOrders: prev.unpackedOrders.map((order: OrderTypes) =>
        order._id === id ? { ...order, packedIndicator: true } : order,
      ),
    }));
  }
  function handlePackedIndicatorToFalse(id: string) {
    setOrders((prev) => ({
      ...prev,
      unpackedOrders: prev.unpackedOrders.map((order: OrderTypes) =>
        order._id === id ? { ...order, packedIndicator: false } : order,
      ),
    }));
  }
  function handlePackOrders(orderIds: string[]) {
    console.log('> handlePackOrders running');
    setOrders((prev) => ({
      ...prev,
      unprocessedOrders: prev.unprocessedOrders.map((order: OrderTypes) =>
        orderIds.includes(order._id)
          ? { ...order, packed: true, packedIndicator: true }
          : order,
      ),
      processedOrders: prev.processedOrders.map((order: OrderTypes) =>
        orderIds.includes(order._id)
          ? { ...order, packed: true, packedIndicator: true }
          : order,
      ),
    }));
  }
  interface ReservationType {
    _id: string;
  }

  function handleProcessOrdersByIds(orderIds: string[]) {
    const ids = orderIds.map((id) => String(id));
    let movedOrders: OrderTypes[] = [];

    setOrders((prev) => {
      const remainingUnprocessed = prev.unprocessedOrders.filter(
        (order: OrderTypes) => {
          if (ids.includes(order._id)) {
            movedOrders.push({ ...order, processed: true });
            return false;
          }
          return true;
        },
      );

      return {
        ...prev,
        unprocessedOrders: remainingUnprocessed,
        processedOrders: [...prev.processedOrders, ...movedOrders],
      };
    });
  }

  function handleStockIndicatorToTrue(id: string) {
    setOrders((prev) => ({
      ...prev,
      unpackedOrders: prev.unpackedOrders.map((order) =>
        order._id === id ? { ...order, packedIndicator: true } : order,
      ),
      unprocessedOrders: prev.unprocessedOrders.map((order) =>
        order._id === id ? { ...order, packedIndicator: true } : order,
      ),
    }));
  }

  function handleStockIndicatorToFalse(id: string) {
    setOrders((prev) => ({
      ...prev,
      unpackedOrders: prev.unpackedOrders.map((order) =>
        order._id === id ? { ...order, packedIndicator: false } : order,
      ),
      unprocessedOrders: prev.unprocessedOrders.map((order) =>
        order._id === id ? { ...order, packedIndicator: false } : order,
      ),
    }));
  }

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', handleConnect);
    socket.on('orderAdded', handleOrderAdded);
    socket.on('orderRemoved', handleOrderRemoved);
    socket.on('orderBatchRemoved', handleBatchOrderRemoved);
    socket.on('orderUpdated', handleOrderUpdated);
    socket.on('setPackedIndicatorToTrue', handlePackedIndicatorToTrue);
    socket.on('setPackedIndicatorToFalse', handlePackedIndicatorToFalse);
    socket.on('packOrdersByIds', handlePackOrders);
    socket.on('processOrdersByIds', handleProcessOrdersByIds);
    socket.on('setStockIndicatorToTrue', handleStockIndicatorToTrue);
    socket.on('setStockIndicatorToFalse', handleStockIndicatorToFalse);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('orderAdded', handleOrderAdded);
      socket.off('orderRemoved', handleOrderRemoved);
      socket.off('orderBatchRemoved', handleBatchOrderRemoved);
      socket.off('orderUpdated', handleOrderUpdated);
      socket.off('setPackedIndicatorToTrue', handlePackedIndicatorToTrue);
      socket.off('setPackedIndicatorToFalse', handlePackedIndicatorToFalse);
      socket.off('packOrdersByIds', handlePackOrders);
      socket.off('processOrdersByIds', handleProcessOrdersByIds);
      socket.off('setStockIndicatorToTrue', handleStockIndicatorToTrue);
      socket.off('setStockIndicatorToFalse', handleStockIndicatorToFalse);
    };
  }, [socket]);

  // Memoizing the getters
  const value = useMemo(
    () => ({
      orders,
      combinedOrders,
    }),
    [orders, combinedOrders],
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}

export default OrdersContextProvider;
