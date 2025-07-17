import './colorSizeSelectorList.scss';
import { notifyError } from '../../../../components/util-components/Notify';
import { useNewOrder } from '../../../../store/new-order-context';
import Button from '../../../../components/util-components/Button';
import ColorSizeSelectorItem from './ColorSizeSelectorItem';

interface PropTypes {
  onNext: () => void;
}

function ColorSizeSelectorsList({ onNext }: PropTypes) {
  const { newOrderData } = useNewOrder();

  function handleOnNext() {
    if (newOrderData.products.length === 0)
      return notifyError('At least one product is required per order');

    const missingColor = newOrderData.products.some(
      (order) => order.selectedColor === '',
    );
    if (missingColor) return notifyError('Color is required for every product');

    const productsWithSizes = newOrderData.products.filter(
      (p) => 'selectedSize' in p,
    );
    const missingSize = productsWithSizes.some(
      (order) =>
        order.stockType === 'Boja-Veličina-Količina' &&
        order.selectedSize === '',
    );
    if (missingSize) return notifyError('Size is required for every product');

    onNext();
  }

  return (
    <div className="color-size-selector-container">
      <div className="color-size-selector-list">
        {newOrderData.products.map((product, index) => (
          <div
            key={`${index}-${product.itemReference}`}
            className="color-size-selector-buttons-wrapper"
          >
            <ColorSizeSelectorItem index={index} product={product} />
          </div>
        ))}
      </div>

      <Button label="Next" onClick={handleOnNext} className="on-next-btn" />
    </div>
  );
}

export default ColorSizeSelectorsList;
