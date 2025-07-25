import { OrderTypes } from '../global/types';

export const OrderStatistics = {
  getCategoryCountData(orders: OrderTypes[]) {
    const categoryMap: Record<string, number> = {};

    orders.forEach((order) => {
      order.products.forEach((product) => {
        const { category } = product;
        categoryMap[category] = (categoryMap[category] || 0) + 1;
      });
    });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));
  },

  getCategoryValueData(orders: OrderTypes[]) {
    const categoryMap: Record<string, number> = {};

    orders.forEach((order) => {
      order.products.forEach((product) => {
        const { category, price } = product;
        categoryMap[category] = (categoryMap[category] || 0) + price;
      });
    });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));
  },

  getOrderCountPerDay(orders: OrderTypes[]) {
    const dateMap: Record<string, number> = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      dateMap[date] = (dateMap[date] || 0) + 1;
    });

    return Object.entries(dateMap)
      .map(([date, count]) => ({ date, value: count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  getOrderValuePerDay(orders: OrderTypes[]) {
    const dateMap: Record<string, number> = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      const total = order.products.reduce((sum, p) => sum + p.price, 0);
      dateMap[date] = (dateMap[date] || 0) + total;
    });

    return Object.entries(dateMap)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
};
