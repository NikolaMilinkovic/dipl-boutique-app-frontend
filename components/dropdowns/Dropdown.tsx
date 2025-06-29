import Select from 'react-select';
import './dropdown.scss';

interface DropdownOptionType {
  value: string;
  label: string;
}

interface DropdownPropTypes {
  options: DropdownOptionType[];
}

function Dropdown({ options }: DropdownPropTypes) {
  return (
    <Select
      options={options}
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
          margin: '0rem 3rem',
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
