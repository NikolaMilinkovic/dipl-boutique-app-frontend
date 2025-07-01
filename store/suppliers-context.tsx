import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';

import { useSocket } from './socket-context';
import { notifyError } from '../components/util-components/Notify';
import { betterErrorLog } from '../util-methods/log-methods';
import { useAuth } from './auth-context';
import { useFetchData } from '../hooks/useFetchData';
import { DropdownOptionType } from '../components/dropdowns/dropdown';

export interface SupplierTypes {
  _id: string;
  name: string;
}

interface SuppliersContextTypes {
  suppliers: SupplierTypes[];
  setSuppliers: React.Dispatch<React.SetStateAction<SupplierTypes[]>>;
  getSupplierDropdownItems: () => DropdownOptionType[];
}

interface SuppliersProviderProps {
  children: ReactNode;
}

export const SuppliersContext = createContext<SuppliersContextTypes>({
  suppliers: [],
  setSuppliers: () => {},
  getSupplierDropdownItems: () => [],
});

export function SuppliersContextProvider({ children }: SuppliersProviderProps) {
  const { token, logout } = useAuth();
  const { socket } = useSocket();
  const [suppliers, setSuppliers] = useState<SupplierTypes[]>([]);
  const { fetchData } = useFetchData();

  async function getSuppliers() {
    try {
      const response = await fetchData('supplier/get', 'GET');
      if (Array.isArray(response)) {
        setSuppliers(response);
      } else {
        notifyError('Podaci o dobavljačima nisu preuzei');
        setSuppliers([]);
      }
    } catch (err) {
      notifyError('Error while fetching suppliers');
      betterErrorLog('> Error while fetching suppliers', err);
    }
  }

  async function handleConnect() {
    if (!token) return logout();
    getSuppliers();
  }

  function getSupplierDropdownItems() {
    const items: DropdownOptionType[] = [];
    items.push({
      value: '',
      label: 'Supplier',
    });
    suppliers.forEach((supplier) => {
      items.push({
        value: supplier.name,
        label: supplier.name,
      });
    });

    return items;
  }

  useEffect(() => {
    function handleSupplierAdded(supplier: SupplierTypes) {
      setSuppliers((prev) => [supplier, ...prev]);
    }
    function handleSupplierUpdated(supplier: SupplierTypes) {
      setSuppliers((prev) =>
        prev.map((supplierInstance) =>
          supplierInstance._id.toString() === supplier._id.toString()
            ? { ...supplierInstance, name: supplier.name }
            : supplierInstance,
        ),
      );
    }
    function handleSupplierRemoved(supplier: string) {
      setSuppliers((prev) => prev.filter((s) => s._id.toString() !== supplier));
    }
    if (socket) {
      socket.on('connect', handleConnect);
      socket.on('supplierAdded', handleSupplierAdded);
      socket.on('supplierUpdated', handleSupplierUpdated);
      socket.on('supplierRemoved', handleSupplierRemoved);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('supplierAdded', handleSupplierAdded);
        socket.off('supplierUpdated', handleSupplierUpdated);
        socket.off('supplierRemoved', handleSupplierRemoved);
      };
    }
  }, [socket]);

  const value: SuppliersContextTypes = {
    suppliers,
    setSuppliers,
    getSupplierDropdownItems,
  };

  return (
    <SuppliersContext.Provider value={value}>
      {children}
    </SuppliersContext.Provider>
  );
}

export function useSuppliers() {
  return useContext(SuppliersContext);
}
