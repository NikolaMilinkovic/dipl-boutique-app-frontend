import { useEffect, useState } from 'react';
import './courierSelection.scss';
import { useCouriers } from '../../../../store/couriers-context';
import Dropdown, {
  DropdownOptionType,
} from '../../../../components/dropdowns/Dropdown';
import { useNewOrder } from '../../../../store/new-order-context';
import { notifyError } from '../../../../components/util-components/Notify';
import Button from '../../../../components/util-components/Button';

interface DropdownTypes {
  _id: string;
  name: string;
  deliveryPrice: string;
}
interface CourierSelectionPropTypes {
  onNext: () => void;
}

function CourierSelection({ onNext }: CourierSelectionPropTypes) {
  const { couriers } = useCouriers();
  const { newOrderData, setNewOrderData } = useNewOrder();
  const [dropdownData, setDropdownData] = useState<DropdownOptionType[] | []>(
    [],
  );
  useEffect(() => {
    const dropdownData = couriers.map((courier) => ({
      label: courier.name,
      value: courier.deliveryPrice as string,
    }));
    setDropdownData(dropdownData);
  }, [couriers]);
  function handleOnNext() {
    if (
      newOrderData.courier.deliveryPrice == 0 ||
      newOrderData.courier.deliveryPrice == null
    ) {
      return notifyError('You must select a courier');
    } else {
      onNext();
    }
  }

  return (
    <div className="courier-selection-container">
      {/* Kategorija */}
      <p>Selected courier</p>
      <Dropdown
        options={dropdownData}
        onSelect={({ value, label }) =>
          setNewOrderData((prev) => ({
            ...prev,
            courier: {
              deliveryPrice: Number(value),
              name: label,
            },
          }))
        }
        value={{
          label: newOrderData.courier.name,
          value: newOrderData.courier.deliveryPrice.toString(),
        }}
      />

      <p className="courier-delivery-price-display">
        Courier delivery price <b>{newOrderData.courier.deliveryPrice}</b>
      </p>

      {/* ON NEXT BUTTON */}
      <Button label="Next" onClick={handleOnNext} className="on-next-btn" />
    </div>
  );
}

export default CourierSelection;
