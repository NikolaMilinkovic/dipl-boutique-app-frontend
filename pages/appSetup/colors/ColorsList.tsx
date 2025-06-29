import { useColor } from '../../../store/colors-context';
import ColorItem from './ColorItem';
import { ColorTypes } from '../../../global/types';
import AnimatedList from '../../../components/lists/AnimatedList';

interface ColorsListProps {
  searchTerm?: string;
}

function ColorsList({ searchTerm }: ColorsListProps) {
  const { colors } = useColor();

  // Custom search function for colors
  const colorSearchFunction = (
    color: ColorTypes,
    searchTerm: string,
  ): boolean => {
    return color.name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <AnimatedList
      items={colors}
      searchTerm={searchTerm}
      searchFunction={colorSearchFunction}
      renderItem={ColorItem}
      noDataImage="../public/img/no_data_found.png"
      noDataAlt="Infinity Boutique Logo"
      className="color-list-section"
      maxWidth="800px"
      height="77.5vh"
    />
  );
}

export default ColorsList;
