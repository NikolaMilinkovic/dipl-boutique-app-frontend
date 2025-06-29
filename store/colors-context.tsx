import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { fetchData } from '../util-methods/fetch-methods';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from './socket-context';
import { notifyError } from '../components/util-components/Notify';
import { betterErrorLog } from '../util-methods/log-methods';

interface ColorTypes {
  _id?: string;
  name: string;
  colorCode: string;
}

interface ColorsContextTypes {
  colors: ColorTypes[];
  setColors: React.Dispatch<React.SetStateAction<ColorTypes[]>>;
  getColors: () => void;
}

interface ColorsProviderProps {
  children: ReactNode;
}

export const ColorContext = createContext<ColorsContextTypes>({
  colors: [],
  setColors: () => {},
  getColors: () => {},
});

export function ColorsContextProvider({ children }: ColorsProviderProps) {
  const { token } = useAuth();
  const { socket } = useSocket();
  const [colors, setColors] = useState<ColorTypes[]>([]);

  // Fetch method
  async function getColors() {
    try {
      const response = await fetchData(token, 'colors/get', 'GET');
      if (response && response.ok && response.status !== 304) {
        setColors(response);
      }
    } catch (err) {}
  }

  // Initial Fetch
  useEffect(() => {
    async function getColors() {
      try {
        const response = await fetchData(token, 'colors/get', 'GET');
        setColors(response);
      } catch (err) {
        notifyError('Error while fetching colors');
        betterErrorLog('> Error while fetching colors', err);
      }
    }
    if (!token) return;
    getColors();
  }, [token]);

  /**
   * Adds a new color to the state.
   * @param newColor - The color to add.
   */
  function handleColorAdded(newColor: ColorTypes) {
    const newColorObj = {
      _id: newColor._id,
      name: newColor.name,
      colorCode: newColor.colorCode,
    };
    setColors((prevColors) => [...prevColors, newColorObj]);
  }

  /**
   * Removes a color from the state by ID.
   * @param colorId - ID of the color to remove.
   */
  function handleColorRemoved(colorId: string) {
    setColors((prevColors) =>
      prevColors.filter((color) => color._id !== colorId),
    );
  }

  /**
   * Updates an existing color in the state.
   * @param updatedColor - The updated color data.
   */
  function handleColorUpdated(updatedColor: ColorTypes) {
    const newColorObj = {
      _id: updatedColor._id,
      name: updatedColor.name,
      colorCode: updatedColor.colorCode,
    };

    setColors((prevColors) =>
      prevColors.map((color) =>
        color._id === updatedColor._id ? newColorObj : color,
      ),
    );
  }

  useEffect(() => {
    if (socket) {
      socket.on('colorAdded', handleColorAdded);
      socket.on('colorRemoved', handleColorRemoved);
      socket.on('colorUpdated', handleColorUpdated);

      // Cleans up the listener on unmount
      // Without this we would get 2x the data as we are rendering multiple times
      return () => {
        socket.off('colorAdded', handleColorAdded);
        socket.off('colorRemoved', handleColorRemoved);
        socket.off('colorUpdated', handleColorUpdated);
      };
    }
  }, [socket]);

  const value: ColorsContextTypes = {
    colors,
    setColors,
    getColors,
  };

  return (
    <ColorContext.Provider value={value}>{children}</ColorContext.Provider>
  );
}

// Optional helper hook
export function useColor() {
  return useContext(ColorContext);
}
