import React, { useCallback, useState } from 'react';
import './colorsManager.scss';
import { betterErrorLog } from '../../../util-methods/log-methods';
import {
  notifyError,
  notifySuccess,
  notifyWarrning,
} from '../../../components/util-components/Notify';
import SingleInputForm from '../../../components/util-components/SingleInputForm';
import InputField from '../../../components/util-components/InputField';
import { useAuth } from '../../../store/auth-context';
import { useFetchData } from '../../../hooks/useFetchData';
import { useFilterByName } from '../../../hooks/useFilterByName';
import { useColor } from '../../../store/colors-context';
import { useUser } from '../../../store/user-context';
import AnimatedList from '../../../components/lists/AnimatedList';
import ColorItem from './ColorItem';

function ColorsManager() {
  const [color, setColor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { fetchWithBodyData } = useFetchData();
  const { colors } = useColor();
  const filteredColors = useFilterByName(colors, searchTerm);
  const { user } = useUser();

  const addColor = async () => {
    try {
      if (!user?.permissions.color.add) {
        notifyWarrning('You do not have permission to add color');
        return;
      }
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
  };

  const renderColorItem = useCallback(
    (color) => <ColorItem data={color} />,
    [],
  );

  return (
    <div className="app-setup-page-wrapper">
      <div className="colors-inputs-container default-card">
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
            backgroundColor="var(--white)"
            label="Search colors"
            inputText={searchTerm}
            setInputText={setSearchTerm}
            showClearBtn={true}
          />
        </div>
      </div>
      <AnimatedList
        items={filteredColors}
        renderItem={renderColorItem}
        noDataImage="/img/no_data_found.png"
        noDataAlt="Infinity Boutique Logo"
        className="color-list-section"
        maxWidth="800px"
      />
    </div>
  );
}

export default ColorsManager;
