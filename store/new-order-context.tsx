import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ColorSizeTypes,
  DressColorTypes,
  NewOrderData,
  Product,
  ProductTypes,
  PurseColorTypes,
} from '../global/types';
import {
  notifyError,
  notifySuccess,
  notifyWarrning,
} from '../components/util-components/Notify';
import { useFetchData } from '../hooks/useFetchData';

interface NewOrderContextType {
  newOrderData: NewOrderData;
  addOrder: () => Promise<boolean>;
  setNewOrderData: React.Dispatch<React.SetStateAction<NewOrderData>>;
  createOrderHandler: () => FormData | void;
  setProductsDataHandler: (productsArr: Product[]) => void;
  addProductHandler: (product: ProductTypes) => void;
  removeProductByIndexHandler: (index: number) => void;
  updateProductColorByIndexHandler: (
    index: number,
    selectedColorObj: DressColorTypes | PurseColorTypes,
  ) => void;
  updateProductSizeByIndexHandler: (
    index: number,
    selectedSizeObj: { _id: string; size: string },
  ) => void;
  resetOrderDataHandler: () => void;
}

interface ContextChildrenTypes {
  children: ReactNode;
}

export const NewOrderContext = createContext<NewOrderContextType | null>(null);

export function NewOrderContextProvider({ children }: ContextChildrenTypes) {
  const { handleFetchingWithFormData } = useFetchData();
  const [newOrderData, setNewOrderData] = useState<NewOrderData>({
    buyer: {
      name: '',
      address: '',
      place: '',
      phone: '',
      phone2: '',
      bankNumber: '',
      profileImage: null,
    },
    products: [],
    productsPrice: 0,
    totalPrice: 0,
    value: 0,
    reservation: false,
    packedIndicator: false,
    packed: false,
    processed: false,
    courier: {
      name: '',
      deliveryPrice: 0,
    },
    weight: '',
    internalRemark: '',
    deliveryRemark: '',
    orderNotes: '',
    reservationDate: null,
  });

  useEffect(() => {
    const total = newOrderData.products.reduce(
      (sum, product) => sum + Number(product.price || 0),
      0,
    );

    setNewOrderData((prev) => ({ ...prev, productsPrice: total }));
  }, [newOrderData.products]);
  useEffect(() => {
    setNewOrderData((prev) => ({
      ...prev,
      totalPrice:
        (newOrderData.courier.deliveryPrice || 0) +
        (newOrderData.productsPrice || 0),
    }));
  }, [newOrderData.productsPrice, newOrderData.courier.deliveryPrice]);

  // Check to see if all products have selectedColor & selectedSize where applicable
  function validateProductData() {
    const isValid = newOrderData.products.every((product) => {
      const hasColor = !!product.selectedColor;

      if (product.stockType === 'Boja-Veličina-Količina') {
        const hasSize = !!product.selectedSize;
        return hasColor && hasSize;
      }

      if (product.stockType === 'Boja-Količina') {
        return hasColor;
      }

      return false;
    });

    return isValid;
  }

  // Validates all inputs | Creates a new form, prepares all data and returns the form
  // Used for sending the data back to server
  function createOrderHandler() {
    if (newOrderData.products.length === 0)
      return notifyWarrning('Missing product data');
    if (!newOrderData.buyer) return notifyWarrning('Missing buyer data');
    if (!newOrderData.buyer.address) return notifyWarrning('Missing address');
    if (!newOrderData.buyer.name) return notifyWarrning('Missing buyer name');
    if (!newOrderData.buyer.phone && !newOrderData.buyer.phone2)
      return notifyWarrning('Missing phone number');
    if (!newOrderData.buyer.place) return notifyWarrning('Missing city/place');
    if (!newOrderData.courier.name)
      return notifyWarrning('Missing courier data');
    if (!newOrderData.courier.deliveryPrice)
      return notifyWarrning('Missing courier data');
    if (!newOrderData.buyer.profileImage)
      return notifyWarrning("Buyer's profile image is missing");
    if (!validateProductData())
      return notifyWarrning('All products must have selected colors and sizes');

    const price = calculatePriceHandler();
    if (!price) return notifyWarrning('Price could not be calculated');

    const appendIfDefined = (fd: FormData, key: string, value: any) => {
      if (value !== undefined && value !== null) {
        fd.append(
          key,
          typeof value === 'object' ? JSON.stringify(value) : String(value),
        );
      }
    };

    const order = new FormData();
    appendIfDefined(order, 'buyerData', newOrderData.buyer);
    appendIfDefined(order, 'productData', newOrderData.products);
    appendIfDefined(order, 'productsPrice', price.productsPrice);
    appendIfDefined(order, 'totalPrice', price.totalPrice);
    appendIfDefined(order, 'reservation', newOrderData.reservation);
    appendIfDefined(
      order,
      'reservationDate',
      newOrderData.reservation
        ? newOrderData.reservationDate?.toISOString()
        : null,
    );
    appendIfDefined(order, 'packedIndicator', newOrderData.packedIndicator);
    appendIfDefined(order, 'packed', newOrderData.packed);
    appendIfDefined(order, 'processed', newOrderData.processed);
    appendIfDefined(order, 'value', newOrderData.value);
    appendIfDefined(order, 'weight', newOrderData.weight);
    appendIfDefined(order, 'internalRemark', newOrderData.internalRemark);
    appendIfDefined(order, 'deliveryRemark', newOrderData.deliveryRemark);
    appendIfDefined(order, 'courier', newOrderData.courier);
    appendIfDefined(order, 'orderNotes', newOrderData.orderNotes);
    order.append('image', newOrderData.buyer.profileImage as File);

    return order;
  }

  async function addOrder() {
    try {
      const order = createOrderHandler();
      if (!order) return;

      const response = await handleFetchingWithFormData(
        order,
        'orders/add',
        'POST',
      );
      const res = await response.json();
      if (response.status === 200) {
        notifySuccess(res.message);
        resetOrderDataHandler();
        return true;
      } else {
        notifyError(res.message);
        return false;
      }
    } catch (err) {
      console.error(err);
      notifyError('Error while creating a new product.');
      return false;
    }
  }

  function calculatePriceHandler() {
    if (
      newOrderData.products.length > 0 &&
      newOrderData.courier?.deliveryPrice
    ) {
      const productsPrice = newOrderData.products
        .map((item) => item.price)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

      const deliveryPrice = newOrderData.courier.deliveryPrice;

      let totalPrice;
      totalPrice = productsPrice + deliveryPrice;

      return {
        productsPrice: productsPrice,
        deliveryPrice: deliveryPrice,
        totalPrice: totalPrice,
      };
    }
  }

  // PRODUCTS
  const setProductsDataHandler = (productsArr: Product[]) => {
    setNewOrderData((prev) => ({
      ...prev,
      products: productsArr,
    }));
  };

  const addProductHandler = (product: ProductTypes) => {
    function getMondoDBType(stockType: string) {
      if (stockType === 'Boja-Veličina-Količina') return 'Dress';
      return 'Purse';
    }
    const fullProduct: Product = {
      category: product.category ?? '',
      image: product.image ?? { imageName: '', uri: '' },
      itemReference: product ?? null,
      mongoDB_type: getMondoDBType(product.stockType),
      name: product.name ?? '',
      price: product.price ?? 0,
      selectedColor: '',
      selectedColorId: '',
      selectedSize: '',
      selectedSizeId: '',
      stockType: product.stockType ?? '',
    };

    setNewOrderData((prev) => ({
      ...prev,
      products: [...prev.products, fullProduct],
    }));
    notifySuccess(
      `${product.name} added to the order. Current number of orders: ${newOrderData.products.length + 1}`,
    );
  };

  const removeProductByIndexHandler = (index: number) => {
    setNewOrderData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };
  const updateProductColorByIndexHandler = (
    index: number,
    selectedColorObj: DressColorTypes | PurseColorTypes,
  ) => {
    setNewOrderData((prev) => {
      const updatedProducts = [...prev.products];
      if (updatedProducts[index]) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          selectedColor: selectedColorObj.color,
          selectedColorId: selectedColorObj._id,
        };
      }
      return {
        ...prev,
        products: updatedProducts,
      };
    });
  };

  const updateProductSizeByIndexHandler = (
    index: number,
    selectedSizeObj: { _id: string; size: string },
  ) => {
    setNewOrderData((prev) => {
      const updatedProducts = [...prev.products];
      if (updatedProducts[index]) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          selectedSize: selectedSizeObj.size,
          selectedSizeId: selectedSizeObj._id,
        };
      }
      return {
        ...prev,
        products: updatedProducts,
      };
    });
  };

  const resetOrderDataHandler = () => {
    setNewOrderData({
      buyer: {
        name: '',
        address: '',
        place: '',
        phone: '',
        phone2: '',
        bankNumber: '',
        profileImage: null,
      },
      products: [],
      productsPrice: 0,
      totalPrice: 0,
      value: 0,
      reservation: false,
      packedIndicator: false,
      packed: false,
      processed: false,
      courier: {
        name: '',
        deliveryPrice: 0,
      },
      weight: '',
      internalRemark: '',
      deliveryRemark: '',
      orderNotes: '',
      reservationDate: null,
    });
  };

  const value = useMemo(
    () => ({
      newOrderData,
      setNewOrderData,
      createOrderHandler,
      setProductsDataHandler,
      addProductHandler,
      removeProductByIndexHandler,
      updateProductColorByIndexHandler,
      updateProductSizeByIndexHandler,
      resetOrderDataHandler,
      addOrder,
    }),
    [newOrderData],
  );

  return (
    <NewOrderContext.Provider value={value}>
      {children}
    </NewOrderContext.Provider>
  );
}

export function useNewOrder() {
  const context = useContext(NewOrderContext);
  if (!context)
    throw new Error('useNewOrder must be used within NewOrderContextProvider');
  return context;
}

//  {
//           category: '',
//           image: {
//             imageName: '',
//             uri: '',
//           },
//           itemReference: null,
//           mongoDB_type: 'Dress',
//           name: '',
//           price: 0,
//           selectedColor: '',
//           selectedColorId: '',
//           selectedSize: '',
//           selectedSizeId: '',
//           stockType: '',
//         },
