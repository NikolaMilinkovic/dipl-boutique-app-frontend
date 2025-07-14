import React from 'react';
import './selectedItem.scss';
import { useNewOrder } from '../../../../store/new-order-context';

interface ProductTypes {
  _id: string;
  name: string;
}

interface NewOrderContextTypes {
  removeProductReference: (index: number) => void;
  removeProduct: (index: number) => void;
}

interface SelectedItemProps {
  item: ProductTypes;
  index: number;
}

const SelectedItem: React.FC<SelectedItemProps> = ({ item, index }) => {
  const { removeProductByIndexHandler } = useNewOrder();
  const onClickHandler = () => {
    removeProductByIndexHandler(index);
  };

  return (
    <div
      className="selected-item fade"
      onClick={onClickHandler}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === 'Enter' && onClickHandler()}
      key={`${index}-${item._id}`}
    >
      {index + 1}) {item.name}
    </div>
  );
};

export default SelectedItem;
