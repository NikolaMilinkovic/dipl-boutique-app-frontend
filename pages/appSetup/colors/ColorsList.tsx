import { useColor } from '../../../store/colors-context';
import ColorItem from './ColorItem';
import { ColorTypes } from '../../../global/types';
import AnimatedList from '../../../components/lists/AnimatedList';
import React from 'react';

interface ColorsListProps {
  searchTerm?: string;
}

const ColorsList = React.memo(({ searchTerm }: ColorsListProps) => {
  const { colors } = useColor();

  // Custom search function for colors
  const colorSearchFunction = React.useCallback(
    (color: ColorTypes, term: string) => {
      return color.name.toLowerCase().includes(term.toLowerCase());
    },
    [],
  );

  return (
    <AnimatedList
      items={colors}
      searchTerm={searchTerm}
      renderItem={(color) => <ColorItem data={color} />}
      noDataImage="/img/no_data_found.png"
      noDataAlt="Infinity Boutique Logo"
      className="color-list-section"
      maxWidth="800px"
      height="77.5vh"
    />
  );
});

export default ColorsList;
