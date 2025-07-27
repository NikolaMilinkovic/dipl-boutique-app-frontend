import React, { useEffect, useRef, useState } from 'react';
import './packOrderItem.scss';
import { OrderTypes } from '../../../../global/types';
import { getFormattedDate } from '../../../../util-methods/dateFormatters';
import DisplayOrderProduct from '../../../../components/lists/orders-list/DisplayOrderProduct';
import { MdCheck } from 'react-icons/md';
import { useFetchData } from '../../../../hooks/useFetchData';
import {
  notifyError,
  notifySuccess,
} from '../../../../components/util-components/Notify';

interface SelectedOrdersTypes {
  _id: string;
}

interface PropTypes {
  order: OrderTypes;
}

const PackOrderItem: React.FC<PropTypes> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(!order.packedIndicator);
  const [isPacked, setIsPacked] = useState(order.packedIndicator);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState('0px');
  const { fetchData } = useFetchData();

  useEffect(() => {
    setIsPacked(order.packedIndicator);
    setIsExpanded(!order.packedIndicator);
  }, [order.packedIndicator]);

  function handleClick() {
    setIsExpanded((prev) => !prev);
  }

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(
        isExpanded ? `${contentRef.current.scrollHeight}px` : '0px',
      );
    }
  }, [isExpanded]);

  async function handleCheck(e) {
    try {
      e.stopPropagation();
      setIsPacked(true);
      setIsExpanded(false);
      let response;
      if (order.packedIndicator) {
        response = await fetchData(
          `orders/packed/set-indicator-to-false/${order._id}`,
          'POST',
        );
        if (!response) {
          notifyError('There was an error while unpacking the order');
          setIsPacked(true);
          setIsExpanded(false);
        } else {
          notifySuccess(response.message);
        }
      } else {
        response = await fetchData(
          `orders/packed/set-indicator-to-true/${order._id}`,
          'POST',
        );
        if (!response) {
          notifyError('There was an error while packing the order');
          setIsPacked(false);
          setIsExpanded(true);
        } else {
          notifySuccess(response.message);
        }
      }
    } catch (err) {
      const error = err as any;
      console.error(error);
    }
  }

  return (
    <div
      className={`pack-order-item ${isPacked ? '' : 'packed-highlight'}`}
      onClick={handleClick}
    >
      <span className="timestamp">{getFormattedDate(order.createdAt)}</span>

      <div className="info-container">
        {/* PROFILE IMAGE */}

        <div className="pack-order-item-info">
          {/* PROFILE DATA */}
          <h3 style={{ marginLeft: '1rem' }}>{order.buyer.name}</h3>
          <hr
            style={{
              marginBottom: '0.55rem',
            }}
          />
          <div className="grid-05-1" style={{ marginLeft: '2rem' }}>
            <p>Address:</p>
            <p>
              {order.buyer.address}, {order.buyer.place}
            </p>
          </div>
          <div className="grid-05-1" style={{ marginLeft: '2rem' }}>
            <p>Phone:</p>
            <p>{order.buyer.phone}</p>
          </div>
          <div className="grid-05-1" style={{ marginLeft: '2rem' }}>
            <p>Buyout price:</p>
            <p>{order.totalPrice} rsd.</p>
          </div>
          <div className="grid-05-1" style={{ marginLeft: '2rem' }}>
            <p>Courier:</p>
            <p>{order.courier?.name}</p>
          </div>
        </div>

        {order.deliveryRemark && <span className="note-indicator">NOTE</span>}
        {order.internalRemark && <span className="note-indicator">NOTE</span>}

        <button
          onClick={handleCheck}
          className={`order-check-btn ${isPacked ? '' : 'unpacked-btn-hover'}`}
          style={{
            border: '3px solid',
            borderColor: isPacked ? 'var(--success)' : 'var(--error)',
            backgroundColor: isPacked ? '' : 'var(--errorBackgroundHighlight)',
          }}
        >
          {isPacked ? <MdCheck /> : <MdCheck className="check-hover" />}
        </button>
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

export default PackOrderItem;
