import React, { useEffect, useState } from 'react';
import useCheckStockAvailability from '../../hooks/useCheckStockAvailability';
import {
  notifyError,
  notifySuccess,
} from '../../components/util-components/Notify';
import './productDisplayItem.scss';
import { MdAdd, MdEdit } from 'react-icons/md';
import DisplayPurseStock from '../../components/product-stock/DisplayPurseStock';

function ProductDisplayItem({ data, showAddBtn = true }) {
  const [onStock, setOnStock] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  // const { createNewOrder } = useContext(NewOrderContext);
  if (data) useCheckStockAvailability(data, setOnStock);
  // if(data) useCheckStockAvailability(data, setOnStock);

  function handleOnAddPress(event) {
    event.stopPropagation();
    if (onStock) {
      notifySuccess(
        `${data.name} dodat u porudžbinu.\nTrenuthin artikala u porudžbini: #NUM`,
      );
      //  ${order.productData.length + 1}
    } else {
      notifyError(`${data.name} je rasprodati i nije dodat u porudžbinu!`);
    }
  }

  return (
    <div
      style={{
        backgroundColor: onStock ? 'white' : 'var(--secondaryHighlight)',
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      className="product-display-item"
    >
      {/* Top section */}
      <div className="product-top-section">
        {/* Image */}
        <div className="product-image-container">
          <img src={data.image.uri} alt="Product" />
        </div>

        {/* Text data */}
        <div className="product-info-container">
          {/* Naziv */}
          <p className="product-name">{data.name}</p>

          {/* Kategorija */}
          <div className="grid-05-1">
            <p>Category:</p>
            <p>{data.category}</p>
          </div>

          {/* Cena */}
          <div className="grid-05-1">
            <p>Price:</p>
            <p>{data.price} RSD</p>
          </div>

          {/* Dobavljac */}
          <div className="grid-05-1">
            <p>Supplier:</p>
            <p>{data.supplier}</p>
          </div>

          {/* Cena */}
          <div className="grid-05-1">
            <p>Description:</p>
            <p>{data.description}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="product-controls">
          {onStock && showAddBtn && (
            // ADD BTN
            <button
              className="product-control-btn"
              style={{
                backgroundColor: onStock
                  ? 'white'
                  : 'var(--secondaryHighlight)',
              }}
              onClick={handleOnAddPress}
            >
              <MdAdd
                style={{ color: 'var(--primaryDark)', fontSize: '26px' }}
              />
            </button>
          )}

          {/* EDIT BTN */}
          <button
            className="product-control-btn"
            style={{
              backgroundColor: onStock ? 'white' : 'var(--secondaryHighlight)',
              right: '56px',
            }}
          >
            <MdEdit style={{ color: 'var(--primaryDark)', fontSize: '26px' }} />
          </button>
        </div>

        {/* Stock availability */}
        {!onStock && <p className="sold-out-text">SOLD OUT</p>}
        {onStock && <p className="on-stock-text">AVAILABLE</p>}
      </div>

      {/* Expanded section */}
      {data.stockType === 'Boja-Količina' && (
        <DisplayPurseStock isExpanded={isExpanded} item={data} />
      )}
      {data.stockType === 'Boja-Veličina-Količina' && (
        <DisplayPurseStock isExpanded={isExpanded} item={data} />
      )}
    </div>
  );
}

export default ProductDisplayItem;
