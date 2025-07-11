import Select, { ActionMeta, SingleValue } from 'react-select';
import './dropdown.scss';

export interface DropdownOptionType {
  value: string;
  label: string;
}

interface DropdownPropTypes {
  options: DropdownOptionType[];
  onSelect: (option: DropdownOptionType) => void;
  defaultValue?: DropdownOptionType;
  onResetText?: string;
  value: DropdownOptionType;
  isDisabled?: boolean;
}

function Dropdown({
  options,
  onSelect,
  defaultValue,
  onResetText,
  value,
  isDisabled = false,
}: DropdownPropTypes) {
  return (
    <Select
      isDisabled={isDisabled}
      defaultValue={
        defaultValue || { value: '', label: onResetText ?? 'Select...' }
      }
      value={value}
      options={options}
      onChange={(option) => {
        if (!option) {
          onSelect({ value: '', label: onResetText ?? 'Select...' });
        } else {
          onSelect(option);
        }
      }}
      classNamePrefix="react-select"
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          color: 'var(--primaryDark)',
          backgroundColor: 'transparent',
          paddingLeft: '12px',
          paddingBottom: '1.2px',
          paddingTop: '1.2px',
          borderColor: 'var(--primaryDark)',
          cursor: 'pointer',
        }),
        dropdownIndicator: (baseStyles, state) => ({
          ...baseStyles,
          color: 'var(--secondaryLight)',
          transition: 'all .2s ease',
          transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : '',
        }),
        container: (baseStyles, state) => ({
          ...baseStyles,
          cursor: 'pointer',
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? 'var(--secondaryDark)' : 'white',
          color: state.isFocused ? 'white' : 'var(--primaryDark)',
          cursor: 'pointer',
        }),
        menuList: (base, state) => ({
          ...base,
          cursor: 'pointer',
        }),
      }}
    />
  );
}

export default Dropdown;
