import { useColor } from '../../../store/colors-context';
import ColorItem from './ColorItem';
import { ColorTypes } from '../../../global/types';
import AnimatedList from '../../../components/lists/AnimatedList';
import React from 'react';

interface ColorsListProps {
  colors: ColorTypes[];
}

const ColorsList = React.memo(({ colors }: ColorsListProps) => {
  return (
    <AnimatedList
      items={colors}
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
