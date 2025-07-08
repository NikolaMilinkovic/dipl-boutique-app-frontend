import React, { useEffect, useState } from 'react';
import './displayPurseStock.scss';
import { PurseTypes } from '../../global/types';

interface PropTypes {
  isExpanded: boolean;
  item: PurseTypes;
}

function DisplayPurseStock({ isExpanded, item }: PropTypes) {
  const [availableColors, setAvailableColors] = useState<string[]>([]);

  useEffect(() => {
    if (!item) return;
    if (item.stockType === 'Boja-Količina') {
      const colorsWithStock = item.colors
        .filter((colorObj) => colorObj.stock > 0)
        .map((colorObj) => colorObj.color);
      setAvailableColors(colorsWithStock);
    }
  }, [item]);

  if (!item) return null;

  return (
    <>
      {isExpanded && item.stockType === 'Boja-Količina' && (
        <div className="purse-stock-container">
          <div className="sizes-header">
            <span>Boja</span>
            <span>Količina</span>
          </div>

          {item.colors.map((colorItem, index) => (
            <div
              className={`row-container ${
                index % 2 === 0
                  ? availableColors.length > 0
                    ? 'row-on-stock'
                    : 'row-out-of-stock'
                  : ''
              }`}
              key={`${index}-${colorItem.color}`}
            >
              <span className="color-label">{colorItem.color}</span>
              <span className="stock-value">{colorItem.stock}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default DisplayPurseStock;
