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
  notifyWarrning,
} from '../../../components/util-components/Notify';
import { useAuth } from '../../../store/auth-context';
import { useFetchData } from '../../../hooks/useFetchData';
import { useFilterByName } from '../../../hooks/useFilterByName';
import { useFilterByStockType } from '../../../hooks/useFilterByStockType';
import { useCategories } from '../../../store/categories-context';
import { useUser } from '../../../store/user-context';

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
  const { categories } = useCategories();
  const { user } = useUser();

  const filteredByName = useFilterByName(categories, searchTerm);
  const filteredByStockType = useFilterByStockType(
    filteredByName,
    stockTypeFilter,
  );

  const addCategory = React.useCallback(async () => {
    try {
      if (!user?.permissions.category.add) {
        notifyWarrning('You do not have permission to add categories');
        return;
      }
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
      <div className="categories-inputs-container default-card">
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
        <Dropdown
          options={stockTypeOptions}
          onSelect={(value) =>
            setCategory((prev) => ({ ...prev, stockType: value.value }))
          }
          defaultValue={{
            value: 'Boja-Veličina-Količina',
            label: 'Boja Veličina Količina',
          }}
        />
        <div
          style={{
            marginTop: '1rem',
            marginBottom: '1rem',
          }}
        >
          <h2>Search categories</h2>
          <InputField
            backgroundColor="var(--white)"
            label="Search categories via name"
            inputText={searchTerm}
            setInputText={(text) => setSearchTerm(text as string)}
            showClearBtn={true}
          />
        </div>
        <Dropdown
          options={stockTypeFilterOptions}
          onSelect={(value) => setStockTypeFilter(value.value)}
        />
      </div>
      <CategoriesList categories={filteredByStockType} />
    </div>
  );
}

export default CategoriesManager;
