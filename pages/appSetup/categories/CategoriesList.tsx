import React, { useCallback } from 'react';
import AnimatedList from '../../../components/lists/AnimatedList';
import { CategoryTypes } from '../../../global/types';
import { useCategories } from '../../../store/categories-context';
import CategoryItem from './CategoryItem';
import './categoriesList.scss';

interface CategoriesListProps {
  searchTerm?: string;
  stockTypeFilter?: string;
}

const CategoriesList = React.memo(
  ({ searchTerm, stockTypeFilter }: CategoriesListProps) => {
    const { categories } = useCategories();

    // Custom search function for colors
    const categorySearchFunction = useCallback(
      (category: CategoryTypes, term: string, filter?: string) => {
        const nameMatch = category.name
          .toLowerCase()
          .includes(term.toLowerCase());
        const stockTypeMatch = !filter || category.stockType === filter;
        return nameMatch && stockTypeMatch;
      },
      [],
    );

    return (
      <AnimatedList
        items={categories}
        searchTerm={searchTerm}
        searchFunction={categorySearchFunction}
        renderItem={CategoryItem}
        noDataImage="../public/img/no_data_found.png"
        noDataAlt="Infinity Boutique Logo"
        className="color-list-section"
        maxWidth="800px"
        height="77.5vh"
        stockTypeFilter={stockTypeFilter}
      />
    );
  },
);

export default CategoriesList;
