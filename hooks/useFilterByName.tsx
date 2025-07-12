import { useEffect, useState } from 'react';

export function useFilterByName<T>(items: T[], searchTerm: string) {
  const [filteredItems, setFilteredItems] = useState<T[]>([]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    const result = term
      ? items.filter((item: any) => item.name?.toLowerCase().includes(term))
      : items;

    setFilteredItems(result);
  }, [items, searchTerm]);

  return filteredItems;
}
