import Select from 'react-select';
import './dropdown.scss';

export interface DropdownOptionType {
  value: string;
  label: string;
}

interface DropdownPropTypes {
  options: DropdownOptionType[];
  onSelect: (value: string) => void;
  defaultValue?: DropdownOptionType;
  onResetText?: string;
}

function Dropdown({
  options,
  onSelect,
  defaultValue,
  onResetText,
}: DropdownPropTypes) {
  return (
    <Select
      defaultValue={defaultValue || 'Select'}
      options={options}
      onChange={(option) => {
        if (option?.value === '') {
          option.label = onResetText ?? 'Select...';
        }
        onSelect((option as DropdownOptionType)?.value || '');
      }}
      classNamePrefix="react-select"
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          color: 'var(--primaryDark)',
          backgroundColor: 'transparent',
          paddingLeft: '12px',
          paddingBottom: '4px',
          paddingTop: '4px',
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
