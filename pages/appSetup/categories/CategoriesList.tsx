import AnimatedList from '../../../components/lists/AnimatedList';
import { CategoryTypes } from '../../../global/types';
import { useCategories } from '../../../store/categories-context';
import CategoryItem from './CategoryItem';

interface CategoriesListProps {
  searchTerm?: string;
}

function CategoriesList({ searchTerm }: CategoriesListProps) {
  const { categories } = useCategories();

  // Custom search function for colors
  const colorSearchFunction = (
    category: CategoryTypes,
    searchTerm: string,
  ): boolean => {
    return category.name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <AnimatedList
      items={categories}
      searchTerm={searchTerm}
      searchFunction={colorSearchFunction}
      renderItem={CategoryItem}
      noDataImage="../public/img/no_data_found.png"
      noDataAlt="Infinity Boutique Logo"
      className="color-list-section"
      maxWidth="800px"
      height="77.5vh"
    />
  );
}

export default CategoriesList;
