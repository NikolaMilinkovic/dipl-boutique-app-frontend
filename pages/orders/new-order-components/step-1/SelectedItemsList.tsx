import Button from '../../../../components/util-components/Button';
import { useNewOrder } from '../../../../store/new-order-context';
import SelectedItem from './SelectedItem';
import './selectedItemsList.scss';

interface SelectedItemsListPropTypes {
  onNext: () => void;
}

function SelectedItemsList({ onNext }: SelectedItemsListPropTypes) {
  const { newOrderData } = useNewOrder();

  return (
    <div className="selected-products-container">
      <div className="selected-products-list">
        {newOrderData.products.map((item, index) => (
          <SelectedItem
            key={`${index}-${item.itemReference}`}
            item={item}
            index={index}
          />
        ))}
      </div>

      <Button label="Next" onClick={onNext} className="on-next-btn" />
    </div>
  );
}

export default SelectedItemsList;
