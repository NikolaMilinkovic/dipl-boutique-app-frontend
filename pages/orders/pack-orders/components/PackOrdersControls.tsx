import React, { useEffect, useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';

import './packOrdersControls.scss';
import { OrderTypes } from '../../../../global/types';
import { useCouriers } from '../../../../store/couriers-context';
import Dropdown, {
  DropdownOptionType,
} from '../../../../components/dropdowns/Dropdown';
import Button from '../../../../components/util-components/Button';
import { useFetchData } from '../../../../hooks/useFetchData';
import {
  notifyError,
  notifySuccess,
} from '../../../../components/util-components/Notify';

interface Props {
  selectedCourier: DropdownOptionType | null;
  setSelectedCourier: (courier: DropdownOptionType | null) => void;
  orders: OrderTypes[];
}

function PackOrdersControls({
  selectedCourier,
  setSelectedCourier,
  orders,
}: Props) {
  const [packedCounter, setPackedCounter] = useState(0);
  const [toBePackedCounter, setToBePackedCounter] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const { getCouriersDropdownItems } = useCouriers();
  const [resetKey, setResetKey] = useState(0);
  const { fetchWithBodyData } = useFetchData();

  useEffect(() => {
    const { isPacked, toBePacked } = orders.reduce(
      (acc, order) => {
        if (order.packedIndicator && !order.packed) acc.isPacked += 1;
        else if (!order.packed) acc.toBePacked += 1;
        return acc;
      },
      { isPacked: 0, toBePacked: 0 },
    );
    setPackedCounter(isPacked);
    setToBePackedCounter(toBePacked);
  }, [orders]);

  // useEffect(() => {
  //   if (selectedCourier?.name === 'Resetuj izbor') {
  //     resetDropdown();
  //   }
  // }, [selectedCourier]);

  // function resetDropdown() {
  //   setResetKey((prev) => prev + 1);
  //   setSelectedCourier(null);
  // }

  async function finishPackingHandler() {
    const packedIds = orders.filter((o) => o.packedIndicator).map((o) => o._id);
    const response = (await fetchWithBodyData(
      'orders/pack-orders',
      { packedIds },
      'POST',
    )) as any;
    const data = await response.json();
    if (response.status === 200) {
      return notifySuccess(data.message);
    }
    return notifyError(data.message);
  }

  return (
    <div className={`pack-orders-container ${isExpanded ? 'expanded' : ''}`}>
      <div
        className="pack-orders-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Spakovano: {packedCounter}</span>
        <span className="icon">
          {isExpanded ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
        </span>
        <span>Za pakovanje: {toBePackedCounter}</span>
      </div>

      {isExpanded && (
        <div className="pack-orders-body">
          <Dropdown
            options={getCouriersDropdownItems(true) as any}
            key={resetKey}
            onSelect={(option: DropdownOptionType) =>
              setSelectedCourier(option)
            }
            value={selectedCourier as DropdownOptionType}
          />

          <Button
            className="finish-packing-btn"
            onClick={finishPackingHandler}
            label="Finish packing"
          />
        </div>
      )}
    </div>
  );
}

export default PackOrdersControls;
