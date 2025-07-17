import { useState } from 'react';
import './displayOrderProduct.scss';
import { ProductTypes } from '../../../global/types';
import { useImagePreviewModal } from '../../../store/modals/image-preview-modal-context';

export interface ProductItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: {
    imageName: string;
    uri: string;
  };
  itemReference: string;
  mongoDB_type: string;
  selectedColor: string;
  selectedColorId: string;
  selectedSize: string;
  selectedSizeId: string;
  stockType: string;
}
interface DisplayOrderProductPropTypes {
  product: ProductItem;
}

function DisplayOrderProduct({ product }: DisplayOrderProductPropTypes) {
  const { showImagePreview } = useImagePreviewModal();
  const handleImageClick = (e) => {
    e.stopPropagation();
    showImagePreview(() => {}, product.image.uri, product.name);
  };

  return (
    <div className="order-product-container">
      {product?.image && (
        <img
          src={product.image.uri}
          alt={product.name}
          className="order-product-image"
          onClick={handleImageClick}
        />
      )}
      <div className="order-product-info-container">
        <h3>{product.name}</h3>
        <hr />
        <div className="order-product-info">
          <div className="row">
            <span className="label">Category:</span>
            <span className="data bold">{product.category ?? '/'}</span>
          </div>
          <div className="row">
            <span className="label">Color:</span>
            <span className="data bold">{product.selectedColor}</span>
          </div>
          {product.selectedSize && (
            <div className="row">
              <span className="label">Size:</span>
              <span className="data bold">{product.selectedSize}</span>
            </div>
          )}
          <div className="row">
            <span className="label">Price:</span>
            <span className="data bold">{product.price} rsd.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayOrderProduct;
