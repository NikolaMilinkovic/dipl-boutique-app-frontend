import React, { useEffect, useState } from 'react';
import useCheckStockAvailability from '../../hooks/useCheckStockAvailability';
import {
  notifyError,
  notifySuccess,
  notifyWarrning,
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
import { useConfirmationModal } from '../../store/modals/confirmation-modal-context';
import { useFetchData } from '../../hooks/useFetchData';
import { useEditProductModal } from '../../store/modals/edit-product-modal-context';
import { useImagePreviewModal } from '../../store/modals/image-preview-modal-context';
import { useNewOrder } from '../../store/new-order-context';

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
  const { fetchWithBodyData, handleFetchingWithFormData } = useFetchData();
  const { showEditModal } = useEditProductModal();
  const { showImagePreview } = useImagePreviewModal();
  const { addProductHandler } = useNewOrder();

  function validateInput(updatedProduct): boolean {
    if (!updatedProduct.name) {
      notifyWarrning('Product name is missing');
      return false;
    }
    if (!updatedProduct.category) {
      notifyWarrning('Category missing');
      return false;
    }
    if (!updatedProduct.price) {
      notifyWarrning('Price is missing');
      return false;
    }
    if (!updatedProduct.stockType) {
      notifyWarrning('Stock Type is missing');
      return false;
    }
    if (updatedProduct.colors.length === 0) {
      notifyWarrning('Please select colors');
      return false;
    }
    if (!updatedProduct.image) {
      notifyWarrning('Please provide product image');
      return false;
    }

    return true;
  }

  // const { createNewOrder } = useContext(NewOrderContext);
  if (data) useCheckStockAvailability(data, setOnStock);
  // if(data) useCheckStockAvailability(data, setOnStock);

  // ADD IN ORDER
  function handleOnAddPress(event) {
    event.stopPropagation();
    addProductHandler(data);
  }

  // EDIT
  function handleOnEditPress(event) {
    event.stopPropagation();
    showEditModal(data, async (updatedProduct: any) => {
      const preparedProductData = {
        ...updatedProduct,
        category: updatedProduct.category?.label,
        supplier: updatedProduct.supplier?.value,
      };
      if (!validateInput(preparedProductData)) {
        notifyError('Data validation failed, check all data and try again');
        return;
      }
      const formData = new FormData();
      formData.append('product', JSON.stringify(preparedProductData));
      formData.append('image', preparedProductData.image as File);

      const res = await handleFetchingWithFormData(
        formData,
        'product/update',
        'PATCH',
      );
      if (!res) return;
      const parsed = await res.json();
      if (res.status === 200) {
        notifySuccess(parsed.message);
      } else {
        notifyError(parsed.message);
      }
    });
  }

  // DELETE
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

  const handleImageClick = (e) => {
    e.stopPropagation();
    showImagePreview(
      () => {
        console.log('Preview callback (optional)');
      },
      data.image.uri,
      data.name,
    );
  };

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
          <img src={data.image.uri} alt="Product" onClick={handleImageClick} />
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
                right: showAddBtn ? '50px' : '0px',
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
                right: showAddBtn ? '100px' : '50px',
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
