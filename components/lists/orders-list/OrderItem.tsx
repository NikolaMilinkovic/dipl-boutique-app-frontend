import React, { useEffect, useRef, useState } from 'react';
import './orderItem.scss';
import { OrderTypes } from '../../../global/types';
import { getFormattedDate } from '../../../util-methods/dateFormatters';
import { MdCheck, MdEdit } from 'react-icons/md';
import DisplayOrderProduct from './DisplayOrderProduct';
import { useImagePreviewModal } from '../../../store/modals/image-preview-modal-context';
import { useEditOrder } from '../../../store/modals/edit-order-modal-context';
import { useUser } from '../../../store/user-context';

interface SelectedOrdersTypes {
  _id: string;
}

interface PropTypes {
  order: OrderTypes;
  highlightedItems: SelectedOrdersTypes[];
  batchMode: boolean;
  onRemoveHighlight: (order: OrderTypes) => void;
  onPress: (order: OrderTypes) => void;
  onLongPress: (order: OrderTypes) => void;
  key: string;
}

const OrderItem: React.FC<PropTypes> = ({
  order,
  highlightedItems,
  batchMode,
  onRemoveHighlight,
  onPress,
  onLongPress,
}) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState('0px');
  const { openDrawer } = useEditOrder();
  const { user } = useUser();

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(
        isExpanded ? `${contentRef.current.scrollHeight}px` : '0px',
      );
    }
  }, [isExpanded]);

  useEffect(() => {
    const highlighted = highlightedItems.some((item) => item._id === order._id);
    setIsHighlighted(highlighted);
  }, [highlightedItems, order]);

  function handleClick() {
    onPress(order);
    if (!batchMode) setIsExpanded((prev) => !prev);
  }

  function handleHighlightItem(e: React.MouseEvent) {
    e.preventDefault();
    onLongPress(order);
  }

  const { showImagePreview } = useImagePreviewModal();
  const handleImageClick = (e) => {
    e.stopPropagation();
    showImagePreview(
      () => {},
      order.buyer.profileImage.uri,
      `Kupac: ${order.buyer.name}`,
    );
  };

  return (
    <div
      className={`order-item ${isHighlighted ? 'highlighted' : ''}`}
      onClick={handleClick}
      onContextMenu={handleHighlightItem}
    >
      <span className="timestamp">{getFormattedDate(order.createdAt)}</span>

      <div className="info-container">
        {/* PROFILE IMAGE */}
        <img
          src={order.buyer.profileImage?.uri || ''}
          alt="Profile"
          className="profile-image"
          onClick={handleImageClick}
        />
        <div className="order-item-info">
          {/* PROFILE DATA */}
          <h3>{order.buyer.name}</h3>
          <hr
            style={{
              marginBottom: '0.55rem',
              borderColor: isHighlighted
                ? 'var(--white)'
                : 'var(--secondaryLight)',
            }}
          />
          <div className="grid-05-1">
            <p>Address:</p>
            <p>
              {order.buyer.address}, {order.buyer.place}
            </p>
          </div>
          <div className="grid-05-1">
            <p>Phone:</p>
            <p>{order.buyer.phone}</p>
          </div>
          <div className="grid-05-1">
            <p>Buyout price:</p>
            <p>{order.totalPrice} rsd.</p>
          </div>
          <div className="grid-05-1">
            <p>Courier:</p>
            <p>{order.courier?.name}</p>
          </div>
        </div>

        {/* BUTTONS */}
        {batchMode ? (
          isHighlighted && (
            <button
              className={`order-item-control-btn ${isHighlighted ? 'order-item-control-highlighted-btn' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveHighlight(order);
              }}
            >
              <MdCheck
                style={{ color: 'var(--primaryDark)', fontSize: '26px' }}
              />
            </button>
          )
        ) : (
          <>
            {user && user.permissions.order.edit && (
              <button
                className={`order-item-control-btn ${isHighlighted ? 'order-item-control-highlighted-btn' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  openDrawer(order);
                }}
              >
                <MdEdit
                  style={{ color: 'var(--primaryDark)', fontSize: '26px' }}
                />
              </button>
            )}
          </>
        )}
        {order.deliveryRemark && <span className="note-indicator">NOTE</span>}
        {order.internalRemark && <span className="note-indicator">NOTE</span>}
        {order.packed && order.packedIndicator && (
          <span className="packed-text">PACKED</span>
        )}
      </div>

      <div
        ref={contentRef}
        className="products-container expandable-content"
        style={{ maxHeight: contentHeight }}
      >
        {/* LOWER */}
        <div className="inner-content">
          {order.internalRemark && (
            <div className="note-container">
              <span className="note-label">Internal Remark:</span>
              <span className="note-text">{order.internalRemark}</span>
            </div>
          )}
          {order.deliveryRemark && (
            <div className="note-container">
              <span className="note-label">Delivery Remark:</span>
              <span className="note-text">{order.deliveryRemark}</span>
            </div>
          )}
          <h4 className="order-item-header">
            Products List ({order.products.length})
          </h4>
          {order.products.map((product, index) => (
            <div
              className={`${
                index % 2
                  ? 'non-colored-order-product'
                  : 'colored-order-product'
              }  ${isHighlighted ? 'order-item-highlighted' : ''}`}
              style={{ marginTop: '0.5rem' }}
              key={`product_item_${product._id}`}
            >
              <DisplayOrderProduct
                passedKey={`${index}-${product._id}`}
                product={product as any}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
