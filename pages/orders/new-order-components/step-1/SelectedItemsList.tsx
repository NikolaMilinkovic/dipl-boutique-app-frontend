import Button from '../../../../components/util-components/Button';
import { notifyError } from '../../../../components/util-components/Notify';
import { useNewOrder } from '../../../../store/new-order-context';
import SelectedItem from './SelectedItem';
import './selectedItemsList.scss';

interface SelectedItemsListPropTypes {
  onNext: () => void;
}

function SelectedItemsList({ onNext }: SelectedItemsListPropTypes) {
  const { newOrderData } = useNewOrder();
  function handleOnNext() {
    if (newOrderData.products.length === 0)
      return notifyError('Please add at least one product to the order');
    onNext();
  }

  return (
    <div className="selected-products-container">
      <div className="selected-products-list">
        {newOrderData.products.map((item, index) => (
          <SelectedItem
            key={`${index}-${item.itemReference}`}
            item={item as any}
            index={index}
          />
        ))}
      </div>

      <Button label="Next" onClick={handleOnNext} className="on-next-btn" />
    </div>
  );
}

export default SelectedItemsList;
