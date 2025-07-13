import {
  ColorSizeTypes,
  DressTypes,
  ProductTypes,
  PurseTypes,
} from '../global/types';
import { betterConsoleLog } from './log-methods';

type ProductType = DressTypes | PurseTypes;
interface SearchParamsType {
  available: boolean;
  soldOut: boolean;
  availableAndSoldOut: boolean;
  onCategorySearch: string;
  onSupplierSearch: string;
  onColorsSearch: string[];
  onSizeSearch: string[];
}

export function searchProducts(
  searchData: string,
  allActiveProducts: ProductType[],
  searchParams: SearchParamsType,
) {
  if (allActiveProducts === undefined) return [];
  if (allActiveProducts.length === 0) return [];

  // Search items by Name
  let nameBasedSearch = allActiveProducts;
  if (searchData) {
    nameBasedSearch = searchItemsByName(allActiveProducts, searchData);
  }

  // Filter by categories
  let categoriesBasedSearch = nameBasedSearch;
  if (searchParams.onCategorySearch) {
    categoriesBasedSearch = filterByCategories(
      nameBasedSearch,
      searchParams.onCategorySearch,
    );
  }

  // Filter by supplier
  let suppliersBasedSearch = categoriesBasedSearch;
  if (searchParams.onSupplierSearch) {
    suppliersBasedSearch = filterBySuppliers(
      categoriesBasedSearch,
      searchParams.onSupplierSearch,
    );
  }

  // Filter by color
  let colorBasedSearch = suppliersBasedSearch;
  if (searchParams.onColorsSearch.length > 0) {
    colorBasedSearch = filterByColor(
      suppliersBasedSearch,
      searchParams.onColorsSearch,
    );
  }

  // Filter by availability [on stock & sold out]
  let stockFilteredResults = colorBasedSearch;
  if (colorBasedSearch.length > 0) {
    stockFilteredResults = colorBasedSearch.filter((result: ProductType) => {
      if (searchParams.availableAndSoldOut) return true;
      if (searchParams.available) return showItemsOnStock(result);
      if (searchParams.soldOut) return showItemsNotOnStock(result);

      return true;
    });
  }

  // Filter by size available stock
  let sizeFilteredResults = stockFilteredResults;
  if (stockFilteredResults.length > 0) {
    sizeFilteredResults = stockFilteredResults.filter((result: ProductType) => {
      if (searchParams.onSizeSearch.length > 0) {
        return searchItemsBySize(result, searchParams.onSizeSearch);
      }
      return true;
    });
  }

  return sizeFilteredResults;
}

// Search by inserted name compares inserted query with [Item Name, Item Colors]
export function searchItemsByName(allActiveProducts: any, searchData: string) {
  const nameBasedSearch = allActiveProducts.filter((item: ProductType) =>
    item.name.toLowerCase().includes(searchData.toLowerCase()),
  );
  const colorBasedSearch = allActiveProducts.filter((item: any) =>
    item.colors.some((colorObj: any) =>
      colorObj.color.toLowerCase().includes(searchData.toLowerCase()),
    ),
  );
  return [...new Set([...nameBasedSearch, ...colorBasedSearch])];
}

// FILTER FOR ITEMS ON STOCK
export function showItemsOnStock(result: ProductType) {
  console.log('showItemsOnStock called');
  // PURSES
  if (result.stockType === 'Boja-Veličina-Količina') {
    return result.colors.some((colorObj: any) =>
      colorObj.sizes.some(
        (sizeObj: ColorSizeTypes) => Number(sizeObj.stock) > 0,
      ),
    );

    // DRESSES
  } else if (result.stockType === 'Boja-Količina') {
    return result.colors.some((colorObj: any) => colorObj.stock > 0);

    // REST
  } else {
    return result.colors.some((colorObj: any) =>
      colorObj.sizes.some(
        (sizeObj: ColorSizeTypes) => Number(sizeObj.stock) > 0,
      ),
    );
  }
}

// FILTER FOR ITEMS NOT ON STOCK
export function showItemsNotOnStock(result: ProductType) {
  console.log('showItemsNotOnStock called');
  // PURSES
  if (result.stockType === 'Boja-Veličina-Količina') {
    return result.colors.every((colorObj: any) =>
      colorObj.sizes.every(
        (sizeObj: ColorSizeTypes) => Number(sizeObj.stock) === 0,
      ),
    );

    // DRESSES
  } else if (result.stockType === 'Boja-Količina') {
    return result.colors.every((colorObj: any) => colorObj.stock === 0);

    // REST
  } else {
    return result.colors.every((colorObj: any) =>
      colorObj.sizes.every(
        (sizeObj: ColorSizeTypes) => Number(sizeObj.stock) === 0,
      ),
    );
  }
}

// FILTER FOR ITEMS ON CATEGORY
export function filterByCategories(allActiveProducts: any, category: string) {
  const categoriesBasedSearch = allActiveProducts.filter(
    (item: any) => item.category === category,
  );
  return categoriesBasedSearch;
}

// FILTER FOR ITEMS ON SUPPLIERS
export function filterBySuppliers(allActiveProducts: any, supplier: string) {
  const suppliersBasedSearch = allActiveProducts.filter(
    (item: any) => item.supplier && item.supplier === supplier,
  );
  return suppliersBasedSearch;
}

// METHOD FOR FILTERING BY COLOR
export function filterByColor(allActiveProducts: any, searchData: string[]) {
  console.log('> filtering by color');
  betterConsoleLog('> searchData', searchData);
  const colorBasedSearch = allActiveProducts.filter((item: any) =>
    item.colors.some((colorObj: any) =>
      searchData.some((searchColor) =>
        colorObj.color.toLowerCase().includes(searchColor.toLowerCase()),
      ),
    ),
  );
  return colorBasedSearch;
}

// METHOD FOR FILTERING BY ITEMS SIZES THAT ARE ON STOCK
function searchItemsBySize(
  product: ProductType,
  searchSizes: string[],
): boolean {
  if ('sizes' in product.colors[0]) {
    const matches = product.colors.some((colorObj: any) =>
      colorObj.sizes.some(
        (sizeObj: ColorSizeTypes) =>
          searchSizes.includes(sizeObj.size) && Number(sizeObj.stock) > 0,
      ),
    );
    return matches;
  }
  return false;
}

export function filterProducts(
  products: ProductTypes[],
  searchTerm: string,
): ProductTypes[] {
  const term = searchTerm.trim().toLowerCase();

  return term
    ? products.filter((product) => {
        return (
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          product.supplier?.toLowerCase().includes(term) ||
          product.price?.toString().includes(term)
        );
      })
    : products;
}
