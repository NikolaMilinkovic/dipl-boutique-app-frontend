import { useEffect, useState } from 'react';
import { ProductTypes } from '../global/types';

export function useFilterProducts(
  products: ProductTypes[],
  searchTerm: string,
) {
  const [filteredProducts, setFilteredProducts] = useState<ProductTypes[]>([]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    const result = term
      ? products.filter((product) => {
          return (
            product.name.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term) ||
            product.supplier?.toLowerCase().includes(term) ||
            product.price?.toString().includes(term)
          );
        })
      : products;

    setFilteredProducts(result);
  }, [products, searchTerm]);

  return filteredProducts;
}
