import React, { useState } from 'react';
import SingleInputForm from '../../../components/util-components/SingleInputForm';
import InputField from '../../../components/util-components/InputField';
import CategoriesList from './CategoriesList';
import './categoriesManager.scss';
import Dropdown from '../../../components/dropdowns/Dropdown';
import { betterErrorLog } from '../../../util-methods/log-methods';
import {
  notifyError,
  notifySuccess,
} from '../../../components/util-components/Notify';
import { useAuth } from '../../../store/auth-context';
import { useFetchData } from '../../../hooks/useFetchData';

function CategoriesManager() {
  const [category, setCategory] = useState({
    id: '',
    name: '',
    stockType: 'Boja-Veličina-Količina',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [stockTypeFilter, setStockTypeFilter] = useState('');
  const { token } = useAuth();
  const { fetchWithBodyData } = useFetchData();

  const addCategory = React.useCallback(async () => {
    try {
      const response = await fetchWithBodyData(
        'category/add',
        category,
        'POST',
      );

      if (!response) return;

      const parsed = await response.json();

      if (response.status === 200) {
        notifySuccess(parsed.message);
        setCategory({ id: '', name: '', stockType: category.stockType });
      } else {
        notifyError(parsed.message);
      }
    } catch (err) {
      betterErrorLog('> Error while adding a new category', err);
    }
  }, [category, token]);

  const stockTypeOptions = [
    { value: 'Boja-Količina', label: 'Boja Količina' },
    { value: 'Boja-Veličina-Količina', label: 'Boja Veličina Količina' },
  ];
  const stockTypeFilterOptions = [
    { value: '', label: 'None - Reset selection' },
    { value: 'Boja-Količina', label: 'Boja Količina' },
    { value: 'Boja-Veličina-Količina', label: 'Boja Veličina Količina' },
  ];
  return (
    <div className="app-setup-page-wrapper">
      <div>
        <SingleInputForm
          data={category.name}
          setData={(value) =>
            setCategory((prev) => ({ ...prev, name: value as string }))
          }
          title="Add new category"
          formMethod={addCategory}
          borders={false}
          label="Category"
          btn_label="Add category"
        />
        <div style={{ margin: '0rem 3rem' }}>
          <Dropdown
            options={stockTypeOptions}
            onSelect={(value) =>
              setCategory((prev) => ({ ...prev, stockType: value }))
            }
            defaultValue={{
              value: 'Boja-Veličina-Količina',
              label: 'Boja Veličina Količina',
            }}
          />
        </div>
        <div
          style={{
            padding: '0rem 3rem',
            marginTop: '1rem',
            marginBottom: '1rem',
          }}
        >
          <h2>Search categories</h2>
          <InputField
            backgroundColor="var(--primaryLight)"
            label="Search categories via name"
            inputText={searchTerm}
            setInputText={(text) => setSearchTerm(text as string)}
            showClearBtn={true}
          />
        </div>
        <div style={{ margin: '0rem 3rem' }}>
          <Dropdown
            options={stockTypeFilterOptions}
            onSelect={setStockTypeFilter}
          />
        </div>
      </div>
      <CategoriesList
        searchTerm={searchTerm}
        stockTypeFilter={stockTypeFilter}
      />
    </div>
  );
}

export default CategoriesManager;
