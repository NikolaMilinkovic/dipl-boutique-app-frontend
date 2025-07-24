import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { useFetchData } from '../hooks/useFetchData';
import { useSocket } from './socket-context';
import { notifyError } from '../components/util-components/Notify';
import { betterErrorLog } from '../util-methods/log-methods';
import { CourierTypes } from '../global/types';
import { useAuth } from './auth-context';

interface CourierDropdownItem {
  label: string;
  value: string;
}

interface CouriersContextTypes {
  couriers: CourierTypes[];
  setCouriers: React.Dispatch<React.SetStateAction<CourierTypes[]>>;
  getCouriersDropdownItems: (resetOption: boolean) => CourierDropdownItem[];
}

interface CouriersProviderProps {
  children: ReactNode;
}

export const CouriersContext = createContext<CouriersContextTypes>({
  couriers: [],
  setCouriers: () => {},
  getCouriersDropdownItems: (resetOption: boolean) => [],
});

export function CouriersContextProvider({ children }: CouriersProviderProps) {
  const { token, logout } = useAuth();
  const { socket } = useSocket();
  const [couriers, setCouriers] = useState<CourierTypes[]>([]);
  const { fetchData } = useFetchData();

  async function getCouriers() {
    try {
      const response = await fetchData('courier/get', 'GET');
      if (Array.isArray(response)) {
        setCouriers(response);
      } else {
        notifyError('Podaci o kuririma nisu preuzei');
        setCouriers([]);
      }
    } catch (err) {
      notifyError('Error while fetching couriers');
      betterErrorLog('> Error while fetching couriers', err);
    }
  }

  async function handleConnect() {
    if (!token) return logout();
    getCouriers();
  }

  function getCouriersDropdownItems(resetOption = false) {
    const dropdownData = couriers.map((courier) => ({
      label: courier.name,
      value: courier.deliveryPrice as string,
    }));
    if (resetOption) {
      dropdownData.unshift({
        value: '',
        label: 'Select a courier',
      });
    }
    return dropdownData;
  }

  useEffect(() => {
    function handleCourierAdded(courier: CourierTypes) {
      setCouriers((prev) => [courier, ...prev]);
    }
    function handleCourierUpdated(updated: CourierTypes) {
      setCouriers((prev) =>
        prev.map((current) =>
          current._id === updated._id ? updated : current,
        ),
      );
    }
    function handleCourierRemoved(courier: string) {
      setCouriers((prev) => prev.filter((s) => s._id.toString() !== courier));
    }
    if (socket) {
      socket.on('connect', handleConnect);
      socket.on('courierAdded', handleCourierAdded);
      socket.on('courierUpdated', handleCourierUpdated);
      socket.on('courierRemoved', handleCourierRemoved);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('courierAdded', handleCourierAdded);
        socket.off('courierUpdated', handleCourierUpdated);
        socket.off('courierRemoved', handleCourierRemoved);
      };
    }
  }, [socket]);

  const value: CouriersContextTypes = {
    couriers,
    setCouriers,
    getCouriersDropdownItems,
  };

  return (
    <CouriersContext.Provider value={value}>
      {children}
    </CouriersContext.Provider>
  );
}

export function useCouriers() {
  return useContext(CouriersContext);
}
