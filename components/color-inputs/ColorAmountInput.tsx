import React from 'react';
import './colorAmountInput.scss';
import DressStockInput from './dress/DressStockInput';
import PurseStockInput from './purse/PurseStockInput';
import { DressColorTypes, PurseColorTypes } from '../../global/types';

function ColorAmountInput({ stockType, colors, setColors }) {
  const isValidDressColors =
    colors &&
    colors.every((color) => color.sizes && Array.isArray(color.sizes));
  const isValidPurseColors =
    colors && colors.every((color) => typeof color.stock === 'number');

  return (
    <>
      {stockType === 'Boja-Veličina-Količina' && isValidDressColors && (
        <DressStockInput
          colorsData={colors as DressColorTypes[]}
          setColorsData={setColors}
        />
      )}
      {stockType === 'Boja-Količina' && isValidPurseColors && (
        <PurseStockInput
          colorsData={colors as PurseColorTypes[]}
          setColorsData={setColors}
        />
      )}
    </>
  );
}

export default ColorAmountInput;
