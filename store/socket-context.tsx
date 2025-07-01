import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { betterConsoleLog, betterErrorLog } from '../util-methods/log-methods';
import {
  notifySuccess,
  notifyWarrning,
} from '../components/util-components/Notify';
import { useAuth } from './auth-context';

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
  const { isAuthenticated, token } = useAuth();

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
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token,
      },
    });

    console.log('socket.connected:', newSocket.connected);

    newSocket.on('connect', () => {
      notifySuccess('Connected to the server');
      console.log('> Connected to the server');
    });

    newSocket.on('reconnect', (attempt) => {
      betterConsoleLog('> SOCKET:', `> Reconnected after ${attempt} attempts`);
      notifySuccess('> Reconnected!');
    });

    newSocket.on('disconnect', (reason) => {
      notifyWarrning('Disconnected from the server..');
      betterErrorLog('> SOCKET disconnected:', reason);
    });

    newSocket.on('connect_error', (err) => {
      notifyWarrning('Error connecting to the server..');
      betterErrorLog('> SOCKET connection error:', err);
    });

    newSocket.on('reconnect_failed', (err) => {
      betterErrorLog('> SOCKET: failed to reconnect', err);
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
