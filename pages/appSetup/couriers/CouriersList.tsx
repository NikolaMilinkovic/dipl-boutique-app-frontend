import React from 'react';
import AnimatedList from '../../../components/lists/AnimatedList';
import { CourierTypes } from '../../../global/types';
import './couriersList.scss';
import { useCouriers } from '../../../store/couriers-context';
import CourierItem from './CourierItem';

interface CouriersListProps {
  searchTerm?: string;
}

const CouriersList = React.memo(({ searchTerm }: CouriersListProps) => {
  const { couriers } = useCouriers();

  const couriersSearchFunction = React.useCallback(
    (courier: CourierTypes, term: string) => {
      return courier.name.toLowerCase().includes(term.toLowerCase());
    },
    [],
  );

  return (
    <AnimatedList
      items={couriers}
      searchTerm={searchTerm}
      searchFunction={couriersSearchFunction}
      renderItem={CourierItem}
      noDataImage="/img/no_data_found.png"
      noDataAlt="Infinity Boutique Logo"
      className="color-list-section"
      maxWidth="800px"
      height="77.5vh"
    />
  );
});

export default CouriersList;
