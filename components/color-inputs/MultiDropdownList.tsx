import React, { useEffect, useState } from 'react';
import Select from 'react-select';

interface DataTypes {
  _id: string | number;
  name?: string;
  value?: string;
  color?: string;
}

interface OptionType {
  label: string;
  value: string | number;
  color?: string;
}

interface DropdownPropTypes {
  data: DataTypes[];
  setSelected: (selectedData: OptionType[]) => void;
  label?: string;
  placeholder?: string;
  defaultValues?: (string | number)[];
  isSearchable?: boolean;
  containerStyles?: React.CSSProperties;
  showColorBoxes?: boolean;
}

export default function MultiDropdownList({
  data,
  setSelected,
  label,
  placeholder = 'Izaberi iz liste',
  defaultValues = [],
  isSearchable = true,
  containerStyles,
  showColorBoxes = false,
}: DropdownPropTypes) {
  const [options, setOptions] = useState<OptionType[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);

  useEffect(() => {
    const newOptions = data.map((item) => ({
      label: item.name || item.value || item.color || '',
      value: item._id,
      color: item.color,
    }));
    setOptions(newOptions);
  }, [data]);

  useEffect(() => {
    // Set initial selected values based on defaultValues
    if (defaultValues.length > 0 && options.length > 0) {
      const initialSelected = options.filter((option) =>
        defaultValues.includes(option.value),
      );
      setSelectedOptions(initialSelected);
    }
  }, [defaultValues, options]);

  const handleChange = (selectedItems: OptionType[] | null) => {
    const selected = selectedItems || [];
    setSelectedOptions(selected);
    setSelected(selected);
  };

  // Custom option component to display color boxes
  const CustomOption = ({ children, data, ...props }: any) => {
    return (
      <div
        {...props.innerProps}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          cursor: 'pointer',
          backgroundColor: props.isFocused ? '#f0f0f0' : 'white',
        }}
      >
        {showColorBoxes && data.color && (
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: data.color,
              marginRight: 8,
              border: '1px solid #ccc',
              borderRadius: 2,
            }}
          />
        )}
        {children}
      </div>
    );
  };

  // Custom multi-value component to display color boxes in selected items
  const CustomMultiValue = ({ children, data, ...props }: any) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#80CBC4',
          borderRadius: 2,
          margin: '2px',
          padding: '2px 6px',
        }}
      >
        {showColorBoxes && data.color && (
          <div
            style={{
              width: 12,
              height: 12,
              backgroundColor: data.color,
              marginRight: 4,
              border: '1px solid #004D40',
              borderRadius: 1,
            }}
          />
        )}
        <span style={{ color: '#004D40', fontSize: '0.875rem' }}>
          {data.label}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const newSelected = selectedOptions.filter(
              (option) => option.value !== data.value,
            );
            handleChange(newSelected);
          }}
          style={{
            marginLeft: 4,
            background: 'none',
            border: 'none',
            color: '#004D40',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div style={containerStyles}>
      {label && (
        <label style={{ marginBottom: 6, display: 'block' }}>{label}</label>
      )}
      <Select
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        isMulti
        placeholder={placeholder}
        isSearchable={isSearchable}
        noOptionsMessage={() => 'Oof, ništa nije pronađeno pod tim imenom..'}
        components={
          showColorBoxes
            ? {
                Option: CustomOption,
                MultiValue: CustomMultiValue,
              }
            : {}
        }
        styles={{
          control: (provided) => ({
            ...provided,
            borderRadius: 4,
            borderColor: '#00796B',
            minHeight: 40,
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: showColorBoxes ? 'transparent' : '#80CBC4',
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            color: showColorBoxes ? 'transparent' : '#004D40',
            padding: showColorBoxes ? 0 : provided.padding,
          }),
          multiValueRemove: (provided) => ({
            ...provided,
            display: showColorBoxes ? 'none' : 'flex',
            color: '#004D40',
            ':hover': {
              backgroundColor: '#004D40',
              color: 'white',
            },
          }),
        }}
      />
    </div>
  );
}
