import React, { useState } from 'react';
import './suppliersManager.scss';
import {
  notifyError,
  notifySuccess,
  notifyWarrning,
} from '../../../components/util-components/Notify';
import { betterErrorLog } from '../../../util-methods/log-methods';
import SingleInputForm from '../../../components/util-components/SingleInputForm';
import InputField from '../../../components/util-components/InputField';
import SuppliersList from './SuppliersList';
import { useAuth } from '../../../store/auth-context';
import { useFetchData } from '../../../hooks/useFetchData';
import { useSuppliers } from '../../../store/suppliers-context';
import { useFilterByName } from '../../../hooks/useFilterByName';
import { useUser } from '../../../store/user-context';

function SuppliersManager() {
  const [supplier, setSupplier] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();
  const { fetchWithBodyData } = useFetchData();
  const { suppliers } = useSuppliers();
  const filteredSuppliers = useFilterByName(suppliers, searchTerm);
  const { user } = useUser();

  const addSupplier = React.useCallback(async () => {
    try {
      if (!user?.permissions.supplier.add) {
        notifyWarrning('You do not have permission to add suppliers');
        return;
      }
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
      <div className="suppliers-inputs-container default-card">
        <SingleInputForm
          data={supplier}
          setData={setSupplier}
          title="Add new supplier"
          formMethod={addSupplier}
          borders={false}
          label="Supplier"
          btn_label="Add supplier"
        />
        <h2>Search suppliers</h2>
        <InputField
          backgroundColor="var(--white)"
          label="Search suppliers"
          inputText={searchTerm}
          setInputText={setSearchTerm}
          showClearBtn={true}
        />
      </div>
      <SuppliersList suppliers={filteredSuppliers} />
    </div>
  );
}

export default SuppliersManager;
