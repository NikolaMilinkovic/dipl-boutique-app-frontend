import {
  notifyError,
  notifyWarrning,
} from '../components/util-components/Notify';

interface BuyerDataObjectTypes {
  name: string;
  address: string;
  place: string;
  phone: number;
  phone2: number;
}

export const handleBuyerDataInputSort = async (
  token: string,
  setNewOrderData: (data: any) => void,
  buyerInfo: string,
) => {
  if (buyerInfo.trim() === '') {
    notifyWarrning('Please insert buyer data');
    return;
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/orders/parse`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderData: buyerInfo }),
      },
    );
    if (!response.ok) {
      const parsedResponse = await response.json();
      notifyError(parsedResponse.message);
      return false;
    }
    const parsedResponse = await response.json();
    setNewOrderData((prev) => {
      const updated = {
        ...prev,
        buyer: {
          ...prev.buyer,
          name: parsedResponse.data.name || '',
          address: parsedResponse.data.address || '',
          place: parsedResponse.data.place || '',
          phone: parsedResponse.data.phone || '',
          phone2: parsedResponse.data.phone2 || '',
        },
        deliveryRemark: parsedResponse.data.orderNotes || '',
      };
      return updated;
    });
  } catch (error) {
    console.error(error);
    notifyError('Error while sorting buyer information');
    throw new Error('Došlo je do problema prilikom sortiranja podataka');
  }
};
