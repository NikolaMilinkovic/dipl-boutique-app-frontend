import React, { useEffect, useState } from 'react';
import './couriersManager.scss';
import {
  notifyError,
  notifySuccess,
  notifyWarrning,
} from '../../../components/util-components/Notify';
import { betterErrorLog } from '../../../util-methods/log-methods';
import SingleInputForm from '../../../components/util-components/SingleInputForm';
import InputField from '../../../components/util-components/InputField';
import './CouriersManager';
import CouriersList from './CouriersList';
import { useAuth } from '../../../store/auth-context';
import { useFetchData } from '../../../hooks/useFetchData';
import { useCouriers } from '../../../store/couriers-context';
import { useFilterByName } from '../../../hooks/useFilterByName';
import { useUser } from '../../../store/user-context';

function CouriersManager() {
  const [courier, setCourier] = useState('');
  const [price, setPrice] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();
  const { fetchWithBodyData } = useFetchData();
  const { couriers } = useCouriers();
  const filteredCouriers = useFilterByName(couriers, searchTerm);
  const { user } = useUser();

  const addCourier = React.useCallback(async () => {
    try {
      if (!user?.permissions.courier.add) {
        notifyWarrning('You do not have permission to add couriers');
        return;
      }
      if (!courier.trim()) {
        notifyError('Ime kurira je obavezno.');
        return;
      }

      if (!price.trim()) {
        notifyError('Cena kurira je obavezna.');
        return;
      }

      function isNumeric(str) {
        if (!str || str.trim() === '') return false;
        const num = Number(str.trim());
        return !isNaN(num) && isFinite(num);
      }

      if (!isNumeric(price)) {
        notifyError('Cena kurira mora biti broj.');
        return;
      }

      const response = await fetchWithBodyData(
        'courier/add',
        { name: courier, deliveryPrice: price },
        'POST',
      );

      if (!response) return;

      const parsed = await response.json();

      if (response.status === 200) {
        notifySuccess(parsed.message);
        setCourier('');
        setPrice('');
      } else {
        notifyError(parsed.message);
      }
    } catch (err) {
      betterErrorLog('> Error while adding a new courier', err);
    }
  }, [courier, token, price]);

  return (
    <div className="app-setup-page-wrapper">
      <div className="courier-inputs-container default-card">
        <SingleInputForm
          data={courier}
          setData={setCourier}
          title="Add new courier"
          formMethod={addCourier}
          borders={false}
          label="Courier"
          btn_label="Add courier"
          tabIndex={1}
          btnTabIndex={3}
        />
        <InputField
          backgroundColor="var(--white)"
          label="Delivery price per package"
          inputText={price}
          setInputText={(value) => setPrice(value as string)}
          showClearBtn={true}
          tabIndex={2}
        />
        <div style={{ marginTop: '1rem' }}>
          <h2>Search couriers</h2>
          <InputField
            backgroundColor="var(--white)"
            label="Search couriers"
            inputText={searchTerm}
            setInputText={(value) => setSearchTerm(value as string)}
            showClearBtn={true}
          />
        </div>
      </div>
      <CouriersList couriers={filteredCouriers} />
    </div>
  );
}

export default CouriersManager;
