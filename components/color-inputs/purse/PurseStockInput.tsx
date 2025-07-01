import React, { useEffect } from 'react';
import './purseStockInput.scss';
import { PurseColorTypes } from '../../../global/types';

interface PropTypes {
  colorsData: PurseColorTypes[];
  setColorsData: (data: PurseColorTypes[]) => void;
}

function PurseStockInput({ colorsData, setColorsData }: PropTypes) {
  // Initialize stock to 0 if undefined
  const initializedColorsData = colorsData.map((item) => ({
    ...item,
    stock: item.stock ?? 0,
  }));

  // Method for handling input changes
  function handleInputChange(color, value) {
    const newStock = parseInt(value, 10) || 0;
    const updatedColorStock = initializedColorsData.map((item) => {
      if (item.color === color) {
        return { ...item, stock: newStock };
      }
      return item;
    });

    setColorsData(updatedColorStock);
  }

  // If no colors present
  if (initializedColorsData.length < 1) {
    return null;
  }

  return (
    <div className="purse-stock-input-container">
      <div className="sizes-container">
        <p style={{ width: 100, fontWeight: 'bold', textAlign: 'center' }}>
          Color
        </p>
        <p className="purse-stock-input-header">Amount</p>
      </div>
      {initializedColorsData.map((item, index) => (
        <div
          className={`row-container ${index % 2 === 0 ? 'row-color-1' : 'row-color-2'}`}
          key={`${index}-${item.color}`}
        >
          <p className="purse-stock-input-color-label">{item.color}</p>
          <input
            key={`${item._id}-${item.color}`}
            type="number"
            placeholder="0"
            className="input"
            value={String(item.stock)}
            onChange={(e) => handleInputChange(item.color, e.target.value)}
            onFocus={(e) => e.target.select()}
          />
        </div>
      ))}
    </div>
  );
}

export default PurseStockInput;
