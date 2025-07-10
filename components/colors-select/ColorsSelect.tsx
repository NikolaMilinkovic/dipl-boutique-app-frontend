import React, { useState } from 'react';
import { useColor } from '../../store/colors-context';
import Checkbox from '../checkbox/Checkbox';
import './colorsSelect.scss';
import InputField from '../util-components/InputField';

function ColorsSelect({ selectedColors, setSelectedColors, backgroundColor }) {
  const { colors } = useColor();
  const [searchKeyword, setSearchKeyword] = useState('');

  function handleToggle(colorName) {
    setSelectedColors((prev) => {
      if (prev.includes(colorName)) {
        return prev.filter((c) => c !== colorName);
      } else {
        return [...prev, colorName];
      }
    });
  }

  return (
    <div className="colors-select-wrapper">
      <InputField
        label="Search colors"
        backgroundColor={
          backgroundColor ? backgroundColor : 'var(--primaryLight)'
        }
        inputText={searchKeyword}
        showClearBtn={true}
        setInputText={setSearchKeyword}
      />
      <div className="colors-wrapper">
        {colors
          .filter((color) =>
            color.name.toLowerCase().includes(searchKeyword.toLowerCase()),
          )
          .map((color) => (
            <Checkbox
              key={color._id || color.name}
              label={color.name}
              checked={selectedColors.includes(color.name)}
              onCheckedChange={() => handleToggle(color.name)}
            />
          ))}
      </div>
    </div>
  );
}

export default ColorsSelect;
