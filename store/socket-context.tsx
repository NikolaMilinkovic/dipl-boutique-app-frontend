import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from 'react';
import { useAuth } from '../hooks/useAuth';
import { io, Socket } from 'socket.io-client';
import { betterConsoleLog, betterErrorLog } from '../util-methods/log-methods';

interface ISocketContext {
  socket: Socket | null;
}

export const SocketContext = createContext<ISocketContext | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketContextProvider: React.FC<SocketProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    newSocket.on('reconnect', (attempt) => {
      betterConsoleLog('> SOCKET:', `> Reconnected after ${attempt} attempts`);
    });

    newSocket.on('disconnect', (reason) => {
      betterErrorLog('> SOCKET disconnected:', reason);
    });

    newSocket.on('connect_error', (err) => {
      betterErrorLog('> SOCKET connection error:', err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export function useSocket(): ISocketContext {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketContextProvider');
  }
  return context;
}
