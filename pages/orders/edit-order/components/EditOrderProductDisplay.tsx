import './editOrderProductDisplay.scss';
import { ProductTypes } from '../../../../global/types';
import { useImagePreviewModal } from '../../../../store/modals/image-preview-modal-context';
import { MdDeleteOutline } from 'react-icons/md';
import { useEditOrder } from '../../../../store/modals/edit-order-modal-context';

interface EditOrderProductDisplayTypes {
  product: ProductTypes;
  index: number;
  setProducts: (updater: (prev: ProductTypes[]) => ProductTypes[]) => void;
}

function EditOrderProductDisplay({
  product,
  index,
  setProducts,
}: EditOrderProductDisplayTypes) {
  const { showImagePreview } = useImagePreviewModal();
  const { removeProductHandler } = useEditOrder();

  const handleImageClick = (e) => {
    e.stopPropagation();
    showImagePreview(() => {}, product.image.uri, product.name);
  };

  const handleOnRemovePress = () => {
    removeProductHandler(index);
  };

  return (
    <div className="edit-order-product-display" key={index}>
      <div className="edit-order-product-sub">
        {/* Image */}
        <div
          className="edit-order-product-image-container"
          onClick={handleImageClick}
        >
          <img
            src={product.image.uri}
            alt={product.name}
            className="edit-order-product-image"
          />
        </div>

        {/* Info */}
        <div className="edit-order-product-info">
          <h3 className="edit-order-product-header">{product.name}</h3>

          <div className="edit-order-info-row">
            <span className="edit-order-info-label">Kategorija:</span>
            <span className="edit-order-info-text">{product.category}</span>
          </div>

          <div className="edit-order-info-row">
            <span className="edit-order-info-label">Cena:</span>
            <span className="edit-order-info-text">{product.price} din.</span>
          </div>

          <div className="edit-order-info-row">
            <span className="edit-order-info-label">Boja:</span>
            <span className="edit-order-info-text">
              {product.selectedColor}
            </span>
          </div>

          {product.selectedSize && (
            <div className="edit-order-info-row">
              <span className="edit-order-info-label">Veličina:</span>
              <span className="edit-order-info-text">
                {product.selectedSize}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* REMOVE BUTTON */}
      <div className="edit-order-remove-button-wrapper">
        <button onClick={handleOnRemovePress} className="edit-order-remove-btn">
          <MdDeleteOutline />
        </button>
      </div>
    </div>
  );
}

export default EditOrderProductDisplay;
