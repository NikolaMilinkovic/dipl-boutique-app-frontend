import { useEffect, useState } from 'react';

export function useFilterByStockType<T extends { stockType?: string }>(
  items: T[],
  stockTypeFilter: string,
) {
  const [filteredItems, setFilteredItems] = useState<T[]>([]);

  useEffect(() => {
    const filtered = stockTypeFilter
      ? items.filter((item) => item.stockType === stockTypeFilter)
      : items;

    setFilteredItems(filtered);
  }, [items, stockTypeFilter]);

  return filteredItems;
}
