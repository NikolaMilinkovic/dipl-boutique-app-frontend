import React, { useEffect, useMemo } from 'react';
import './dressStockInput.scss';
import { DressColorTypes } from '../../../global/types';
import { betterConsoleLog } from '../../../util-methods/log-methods';

interface PropTypes {
  colorsData: DressColorTypes[];
  setColorsData: (data: DressColorTypes[]) => void;
}

function DressStockInput({ colorsData, setColorsData }: PropTypes) {
  // Ensure all sizes have a stock value initialized to 0 if undefined
  const initializedColorsData = colorsData.map((item) => ({
    ...item,
    sizes: item.sizes.map((sizeItem) => ({
      ...sizeItem,
      stock: sizeItem.stock ?? 0,
    })),
  }));

  // Method for handling input changes
  function handleInputChange(color: string, size: string, value: string) {
    const newStock = parseInt(value, 10) || 0;
    const updatedColors = initializedColorsData.map((item) => {
      if (item.color === color) {
        const updatedSizes = item.sizes.map((s) =>
          s.size === size ? { ...s, stock: newStock } : s,
        );
        return { ...item, sizes: updatedSizes };
      }
      return item;
    });

    setColorsData(updatedColors);
  }

  // If no colors present
  if (colorsData.length < 1) {
    return null;
  }

  return (
    <div className="container">
      <div className="sizesContainer">
        <p className="header-first-item">Boja</p>
        <p className="header">UNI</p>
        <p className="header">XS</p>
        <p className="header">S</p>
        <p className="header">M</p>
        <p className="header">L</p>
        <p className="header">XL</p>
      </div>
      {initializedColorsData.map((item, index) => (
        <div
          className={`row-container ${index % 2 === 0 ? 'row-color-1' : 'row-color-2'}`}
          key={`${index}-${item.color}`}
        >
          <p className="colorLabel">{item.color}</p>

          {item.sizes.map((sizeObj) => (
            <input
              key={`${item._id}-${sizeObj.size}`}
              type="number"
              placeholder="0"
              className="input"
              value={String(sizeObj.stock)}
              onChange={(e) =>
                handleInputChange(item.color, sizeObj.size, e.target.value)
              }
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default DressStockInput;
