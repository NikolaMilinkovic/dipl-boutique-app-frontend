import React from 'react';
import AnimatedList from '../../../components/lists/AnimatedList';
import { CourierTypes } from '../../../global/types';
import './couriersList.scss';
import CourierItem from './CourierItem';

interface CouriersListProps {
  couriers: CourierTypes[];
}

const CouriersList = React.memo(({ couriers }: CouriersListProps) => {
  return (
    <AnimatedList
      items={couriers}
      renderItem={(courier) => <CourierItem data={courier} />}
      noDataImage="/img/no_data_found.png"
      noDataAlt="Infinity Boutique Logo"
      className="color-list-section"
      maxWidth="800px"
      height="77.5vh"
    />
  );
});

export default CouriersList;
