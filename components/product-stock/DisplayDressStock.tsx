import React, { useEffect, useState } from 'react';
import './displayDressStock.scss';
import { DressTypes } from '../../global/types';

interface PropTypes {
  isExpanded: boolean;
  item: DressTypes;
}

function DisplayDressStock({ isExpanded, item }: PropTypes) {
  const [availableColors, setAvailableColors] = useState<string[]>([]);

  useEffect(() => {
    if (!item) return;
    if (item.stockType === 'Boja-Veličina-Količina') {
      const colorsWithStock = item.colors
        .filter((colorObj) =>
          colorObj.sizes.some((sizeObj) => sizeObj.stock > 0),
        )
        .map((colorObj) => colorObj.color);
      setAvailableColors(colorsWithStock);
    }
  }, [item]);

  if (!item) return null;

  return (
    <>
      {isExpanded && item.stockType === 'Boja-Veličina-Količina' && (
        <div className="dress-stock-container">
          <div className="sizes-header">
            <span className="color-header">Boja</span>
            <span>UNI</span>
            <span>XS</span>
            <span>S</span>
            <span>M</span>
            <span>L</span>
            <span>XL</span>
          </div>

          {item.colors.map((colorItem, index) => {
            const sortedSizes = [...colorItem.sizes].sort((a, b) => {
              if (a.size === 'UNI') return -1;
              if (b.size === 'UNI') return 1;
              return 0;
            });

            return (
              <div
                className={`row-container ${
                  index % 2 === 0
                    ? availableColors.length > 0
                      ? 'row-on-stock'
                      : 'row-out-of-stock'
                    : 'row-alt'
                }`}
                key={`${index}-${colorItem.color}`}
              >
                <span className="color-label">{colorItem.color}</span>
                {sortedSizes.map((size, i) => (
                  <span key={`${colorItem.color}${i}`} className="size-value">
                    {size.stock}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default DisplayDressStock;
