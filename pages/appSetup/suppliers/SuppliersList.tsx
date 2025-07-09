import React from 'react';
import AnimatedList from '../../../components/lists/AnimatedList';
import { SupplierTypes } from '../../../global/types';
import { useCategories } from '../../../store/categories-context';
// import CategoryItem from './CategoryItem';
import './suppliersList.scss';
import { useSuppliers } from '../../../store/suppliers-context';
import SupplierItem from './SupplierItem';

interface SuppliersListProps {
  searchTerm?: string;
}
const SuppliersList = React.memo(({ searchTerm }: SuppliersListProps) => {
  const { suppliers } = useSuppliers();

  // Custom search function for colors
  const colorSearchFunction = React.useCallback(
    (supplier: SupplierTypes, term: string) => {
      return supplier.name.toLowerCase().includes(term.toLowerCase());
    },
    [],
  );

  return (
    <AnimatedList
      items={suppliers}
      searchTerm={searchTerm}
      searchFunction={colorSearchFunction}
      renderItem={(supplier) => <SupplierItem data={supplier} />}
      noDataImage="/img/no_data_found.png"
      noDataAlt="Infinity Boutique Logo"
      className="color-list-section"
      maxWidth="800px"
      height="77.5vh"
    />
  );
});

export default SuppliersList;
