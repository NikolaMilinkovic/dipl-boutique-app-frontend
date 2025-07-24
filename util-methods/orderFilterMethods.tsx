import { useState } from 'react';
import { OrdersDataTypes } from '../store/orders-context';
import { OrderTypes } from '../global/types';
const packedVal = ['packed', 'unpacked', 'all'] as const;
interface OrdersSearchParamTypes {
  courier: string;
  processed: boolean;
  packed: (typeof packedVal)[number];
}

export function searchOrders(
  searchTerm: string,
  orders: OrdersDataTypes,
  searchParams: OrdersSearchParamTypes,
) {
  let filteredData = searchParams.processed
    ? orders.processedOrders
    : orders.unprocessedOrders;

  filteredData = searchOrdersByTextInput(filteredData, searchTerm);
  filteredData = filterOrdersByCourier(filteredData, searchParams.courier);
  filteredData = filterOrdersViaPackedState(filteredData, searchParams.packed);
  return filteredData;
}

export function searchOrdersByTextInput(orders: OrderTypes[], query: string) {
  const lquery = query.toLowerCase();

  const buyer_name = orders.filter((order: OrderTypes) =>
    order.buyer.name.toLowerCase().includes(lquery),
  );
  const buyer_address = orders.filter((order: OrderTypes) =>
    order.buyer.address.toLowerCase().includes(lquery),
  );
  const buyer_place = orders.filter((order: OrderTypes) =>
    order.buyer.place.toLowerCase().includes(lquery),
  );
  const buyer_phone = orders.filter((order: OrderTypes) =>
    order.buyer.phone.toString().toLowerCase().includes(lquery),
  );
  const product_name = orders.filter((order: OrderTypes) =>
    order.products.some((product) =>
      product.name.toLowerCase().includes(lquery),
    ),
  );

  return [
    ...new Set([
      ...buyer_name,
      ...buyer_address,
      ...buyer_place,
      ...buyer_phone,
      ...product_name,
    ]),
  ];
}

export function filterOrdersByCourier(orders: OrderTypes[], courier: string) {
  const lcourier = courier.toLowerCase();
  return orders.filter((order: OrderTypes) =>
    order.courier.name.toLowerCase().includes(lcourier),
  );
}
export function filterOrdersViaPackedState(
  orders: OrderTypes[],
  packed: string,
) {
  if (packed === 'packed') {
    return orders.filter((order: OrderTypes) => order.packedIndicator === true);
  }
  if (packed === 'unpacked') {
    return orders.filter(
      (order: OrderTypes) => order.packedIndicator === false,
    );
  }
  return orders;
}
