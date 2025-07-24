import AnimatedList from '../../../../components/lists/AnimatedList';
import { OrderTypes } from '../../../../global/types';
import PackOrderItem from './packOrderItem';
import './packOrdersList.scss';
// setEditedOrder
const PackOrdersList = ({ selectedCourier, data }) => {
  return (
    <div className="pack-order-items-wrapper">
      <AnimatedList
        items={data}
        renderItem={(item: OrderTypes) => <PackOrderItem order={item} />}
        noDataImage="/img/no_data_found.png"
        noDataAlt="Infinity Boutique Logo"
        className="color-list-section"
        maxWidth="100%"
      />
    </div>
  );
};

export default PackOrdersList;
