import React, { useState } from 'react';
import SingleInputForm from '../../../components/util-components/SingleInputForm';
import InputField from '../../../components/util-components/InputField';
import CategoriesList from './CategoriesList';
import './categoriesManager.scss';
import Dropdown from '../../../components/dropdowns/dropdown';

function CategoriesManager() {
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  async function addCategory() {}

  const stockTypeOptions = [
    { value: 'Boja-Količina', label: 'Boja Količina' },
    { value: 'Boja-Veličina-Količina', label: 'Boja Veličina Količina' },
  ];
  return (
    <div className="app-setup-page-wrapper">
      <div>
        <SingleInputForm
          data={category}
          setData={setCategory}
          title="Add new category"
          formMethod={addCategory}
          borders={false}
          label="Category"
          btn_label="Add category"
        />
        <Dropdown options={stockTypeOptions} />
        <div style={{ padding: '0rem 3rem', marginTop: '1rem' }}>
          <h2>Search categories</h2>
          <InputField
            backgroundColor="var(--primaryLight)"
            label="Search categories via name"
            inputText={searchTerm}
            setInputText={setSearchTerm}
            showClearBtn={true}
          />
        </div>
      </div>
      <CategoriesList searchTerm={searchTerm} />
    </div>
  );
}

export default CategoriesManager;
