import { useEffect, useState } from 'react';
import './colorsManager.scss';
import { fetchWithBodyData } from '../../../util-methods/fetch-methods';
import { useAuth } from '../../../hooks/useAuth';
import { betterErrorLog } from '../../../util-methods/log-methods';
import {
  notifyError,
  notifySuccess,
} from '../../../components/util-components/Notify';
import SingleInputForm from '../../../components/util-components/SingleInputForm';
import ColorsList from './ColorsList';
import InputField from '../../../components/util-components/InputField';

function ColorsManager() {
  const [color, setColor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();

  async function addColor() {
    try {
      const response = await fetchWithBodyData(
        token,
        'colors/add',
        { name: color, colorCode: '' },
        'POST',
      );
      if (response) {
        const parsed = await response.json();

        if (response.status === 200) {
          notifySuccess(parsed.message);
          setColor('');
        } else {
          notifyError(parsed.message);
        }
      }
    } catch (err) {
      betterErrorLog('> Error while adding a new color', err);
    }
  }

  return (
    <div className="app-setup-page-wrapper">
      <div>
        <SingleInputForm
          data={color}
          setData={setColor}
          title="Add new color"
          formMethod={addColor}
          borders={false}
          label="Color"
          btn_label="Add color"
        />
        <div style={{ padding: '0rem 3rem' }}>
          <InputField
            backgroundColor="var(--primaryLight)"
            label="Search colors"
            inputText={searchTerm}
            setInputText={setSearchTerm}
            showClearBtn={true}
          />
        </div>
      </div>
      <ColorsList searchTerm={searchTerm} />
    </div>
  );
}

export default ColorsManager;
