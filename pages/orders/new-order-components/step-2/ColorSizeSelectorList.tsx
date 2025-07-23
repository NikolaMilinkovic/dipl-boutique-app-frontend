import './colorSizeSelectorList.scss';
import { notifyError } from '../../../../components/util-components/Notify';
import Button from '../../../../components/util-components/Button';
import ColorSizeSelectorItem from './ColorSizeSelectorItem';
import { OrderTypes } from '../../../../global/types';
import { useEditOrder } from '../../../../store/modals/edit-order-modal-context';

interface PropTypes {
  onNext: () => void;
  orderData: any;
  updateProductColorByIndexHandler: any;
  updateProductSizeByIndexHandler: any;
  useAsEdit?: boolean;
}

function ColorSizeSelectorsList({
  onNext,
  orderData,
  updateProductColorByIndexHandler,
  updateProductSizeByIndexHandler,
  useAsEdit = false,
}: PropTypes) {
  function handleOnNext() {
    if (orderData.products.length === 0)
      return notifyError('At least one product is required per order');

    const missingColor = orderData.products.some(
      (order) => order.selectedColor === '',
    );
    if (missingColor) return notifyError('Color is required for every product');

    const productsWithSizes = orderData.products.filter(
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

  function handleOnNextAsEdit() {
    const missingColor = newProducts.some(
      (order) => order.selectedColor === '',
    );
    if (missingColor) return notifyError('Color is required for every product');

    const productsWithSizes = newProducts.filter((p) => 'selectedSize' in p);
    const missingSize = productsWithSizes.some(
      (order) =>
        order.stockType === 'Boja-Veličina-Količina' &&
        order.selectedSize === '',
    );
    if (missingSize) return notifyError('Size is required for every product');

    onNext();
  }

  const { newProducts } = useEditOrder();

  return (
    <div className="color-size-selector-container">
      <div className="color-size-selector-list">
        {/* {useAsEdit &&
          newProducts.map((product, index) => (
            <div
              key={`${index}-${product.itemReference}`}
              className="color-size-selector-buttons-wrapper"
            >
              <ColorSizeSelectorItem
                index={index}
                product={product}
                updateProductColorByIndexHandler={
                  updateProductColorByIndexHandler
                }
                updateProductSizeByIndexHandler={
                  updateProductSizeByIndexHandler
                }
              />
            </div>
          ))} */}
        {!useAsEdit &&
          orderData &&
          orderData.products.length > 0 &&
          orderData.products.map((product, index) => (
            <div
              key={`${index}-product-color-size-selector`}
              className="color-size-selector-buttons-wrapper"
            >
              <ColorSizeSelectorItem
                index={index}
                product={product}
                updateProductColorByIndexHandler={
                  updateProductColorByIndexHandler
                }
                updateProductSizeByIndexHandler={
                  updateProductSizeByIndexHandler
                }
              />
            </div>
          ))}
      </div>

      {!useAsEdit && (
        <Button label="Next" onClick={handleOnNext} className="on-next-btn" />
      )}
      {useAsEdit && (
        <Button
          label="Next"
          onClick={handleOnNextAsEdit}
          className="on-next-btn"
        />
      )}
    </div>
  );
}

export default ColorSizeSelectorsList;
