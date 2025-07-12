import React, { useState } from 'react';
import './suppliersManager.scss';
import {
  notifyError,
  notifySuccess,
} from '../../../components/util-components/Notify';
import { betterErrorLog } from '../../../util-methods/log-methods';
import SingleInputForm from '../../../components/util-components/SingleInputForm';
import InputField from '../../../components/util-components/InputField';
import SuppliersList from './SuppliersList';
import { useAuth } from '../../../store/auth-context';
import { useFetchData } from '../../../hooks/useFetchData';
import { useSuppliers } from '../../../store/suppliers-context';
import { useFilterByName } from '../../../hooks/useFilterByName';

function SuppliersManager() {
  const [supplier, setSupplier] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();
  const { fetchWithBodyData } = useFetchData();
  const { suppliers } = useSuppliers();
  const filteredSuppliers = useFilterByName(suppliers, searchTerm);

  const addSupplier = React.useCallback(async () => {
    try {
      const response = await fetchWithBodyData(
        'supplier/add',
        { name: supplier },
        'POST',
      );

      if (!response) return;

      const parsed = await response.json();

      if (response.status === 200) {
        notifySuccess(parsed.message);
        setSupplier('');
      } else {
        notifyError(parsed.message);
      }
    } catch (err) {
      betterErrorLog('> Error while adding a new supplier', err);
    }
  }, [supplier, token]);

  return (
    <div className="app-setup-page-wrapper">
      <div>
        <SingleInputForm
          data={supplier}
          setData={setSupplier}
          title="Add new supplier"
          formMethod={addSupplier}
          borders={false}
          label="Supplier"
          btn_label="Add supplier"
        />
        <div style={{ padding: '0rem 3rem' }}>
          <h2>Search suppliers</h2>
          <InputField
            backgroundColor="var(--primaryLight)"
            label="Search suppliers"
            inputText={searchTerm}
            setInputText={setSearchTerm}
            showClearBtn={true}
          />
        </div>
      </div>
      <SuppliersList suppliers={filteredSuppliers} />
    </div>
  );
}

export default SuppliersManager;
