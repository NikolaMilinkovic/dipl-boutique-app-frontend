import React, { useEffect, useState } from 'react';
import useCheckStockAvailability from '../../hooks/useCheckStockAvailability';
import {
  notifyError,
  notifySuccess,
} from '../../components/util-components/Notify';
import './productDisplayItem.scss';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import DisplayPurseStock from '../../components/product-stock/DisplayPurseStock';
import DisplayDressStock from '../../components/product-stock/DisplayDressStock';
import {
  DressColorTypes,
  DressTypes,
  PurseColorTypes,
  PurseTypes,
} from '../../global/types';
import { useConfirmationModal } from '../../store/confirmation-modal-context';
import { useFetchData } from '../../hooks/useFetchData';

interface ProductDisplayItemTypes {
  data: PurseTypes | DressTypes;
  showAddBtn: boolean;
  showEditBtn: boolean;
  showDeleteBtn: boolean;
}

function ProductDisplayItem({
  data,
  showAddBtn = true,
  showEditBtn = true,
  showDeleteBtn = true,
}: ProductDisplayItemTypes) {
  const [onStock, setOnStock] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { showConfirmation } = useConfirmationModal();
  const { fetchWithBodyData } = useFetchData();

  // const { createNewOrder } = useContext(NewOrderContext);
  if (data) useCheckStockAvailability(data, setOnStock);
  // if(data) useCheckStockAvailability(data, setOnStock);

  function handleOnAddPress(event) {
    event.stopPropagation();
  }
  function handleOnEditPress(event) {
    event.stopPropagation();
  }
  function handleOnDeletePress(event) {
    event.stopPropagation();
    showConfirmation(async () => {
      let colorIdsArr = [];
      data.colors.forEach((color: PurseColorTypes | DressColorTypes) =>
        colorIdsArr.push(color._id),
      );
      const bodyData = {
        colorIds: colorIdsArr,
        id: data._id,
        stockType: data.stockType,
      };
      const res = await fetchWithBodyData('product/delete', bodyData, 'DELETE');
      if (!res) return;
      const parsed = (await res.json()) as any;
      if (res.status === 200) {
        notifySuccess(parsed.message);
      } else {
        notifyError(parsed.message);
      }
    }, 'Are you sure you want to delete this item?');
  }

  return (
    <div
      style={{
        backgroundColor: onStock ? 'white' : 'var(--highlightSold)',
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
          {/* ADD BTN */}
          {onStock && showAddBtn && (
            <button
              className="product-control-btn"
              style={{
                backgroundColor: onStock ? 'white' : 'var(--highlightSold)',
              }}
              onClick={handleOnAddPress}
            >
              <MdAdd
                style={{ color: 'var(--primaryDark)', fontSize: '26px' }}
              />
            </button>
          )}

          {/* EDIT BTN */}
          {showEditBtn && (
            <button
              className="product-control-btn"
              style={{
                backgroundColor: onStock ? 'white' : 'var(--highlightSold)',
                right: showAddBtn ? '50px' : '26px',
              }}
              onClick={handleOnEditPress}
            >
              <MdEdit
                style={{ color: 'var(--primaryDark)', fontSize: '26px' }}
              />
            </button>
          )}

          {/* DELETE BTN */}
          {showDeleteBtn && (
            <button
              className="product-control-btn"
              style={{
                backgroundColor: onStock ? 'white' : 'var(--highlightSold)',
                right: '100px',
              }}
              onClick={handleOnDeletePress}
            >
              <MdDelete
                style={{ color: 'var(--primaryDark)', fontSize: '26px' }}
              />
            </button>
          )}
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
        <DisplayDressStock isExpanded={isExpanded} item={data} />
      )}
    </div>
  );
}

export default ProductDisplayItem;
