import React, { useEffect, useState } from 'react';
import './colorsManager.scss';
import { betterErrorLog } from '../../../util-methods/log-methods';
import {
  notifyError,
  notifySuccess,
} from '../../../components/util-components/Notify';
import SingleInputForm from '../../../components/util-components/SingleInputForm';
import ColorsList from './ColorsList';
import InputField from '../../../components/util-components/InputField';
import { useAuth } from '../../../store/auth-context';
import { useFetchData } from '../../../hooks/useFetchData';
import { useFilterByName } from '../../../hooks/useFilterByName';
import { useColor } from '../../../store/colors-context';

function ColorsManager() {
  const [color, setColor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();
  const { fetchWithBodyData } = useFetchData();
  const { colors } = useColor();
  const filteredColors = useFilterByName(colors, searchTerm);

  const addColor = React.useCallback(async () => {
    try {
      const response = await fetchWithBodyData(
        'colors/add',
        { name: color, colorCode: '' },
        'POST',
      );

      if (!response) return;

      const parsed = await response.json();

      if (response.status === 200) {
        notifySuccess(parsed.message);
        setColor('');
      } else {
        notifyError(parsed.message);
      }
    } catch (err) {
      betterErrorLog('> Error while adding a new color', err);
    }
  }, [color, token]);

  return (
    <div className="app-setup-page-wrapper">
      <div style={{ paddingRight: '3rem' }}>
        <SingleInputForm
          data={color}
          setData={setColor}
          title="Add new color"
          formMethod={addColor}
          borders={false}
          label="Color"
          btn_label="Add color"
        />
        <div>
          <h2>Search colors</h2>
          <InputField
            backgroundColor="var(--primaryLight)"
            label="Search colors"
            inputText={searchTerm}
            setInputText={setSearchTerm}
            showClearBtn={true}
          />
        </div>
      </div>
      <ColorsList colors={filteredColors} />
    </div>
  );
}

export default ColorsManager;
