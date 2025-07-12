import React, { useCallback } from 'react';
import AnimatedList from '../../../components/lists/AnimatedList';
import { CategoryTypes } from '../../../global/types';
import CategoryItem from './CategoryItem';
import './categoriesList.scss';

interface CategoriesListProps {
  categories: CategoryTypes[];
}

const CategoriesList = React.memo(({ categories }: CategoriesListProps) => {
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
      renderItem={(category) => <CategoryItem data={category} />}
      noDataImage="/img/no_data_found.png"
      noDataAlt="Infinity Boutique Logo"
      className="color-list-section"
      maxWidth="800px"
      height="77.5vh"
    />
  );
});

export default CategoriesList;
