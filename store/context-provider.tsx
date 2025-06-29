import React, { ReactNode } from 'react';
import AuthContextProvider from './auth-context';
import { UserContextProvider } from './user-context';
import { ColorsContextProvider } from './colors-context';
import { SocketContextProvider } from './socket-context';
import { CategoriesContextProvider } from './categories-context';

interface ContextChildrenType {
  children: ReactNode;
}

const ContextProvider: React.FC<ContextChildrenType> = ({ children }) => {
  return (
    <>
      <AuthContextProvider>
        <SocketContextProvider>
          <UserContextProvider>
            <ColorsContextProvider>
              <CategoriesContextProvider>{children}</CategoriesContextProvider>
            </ColorsContextProvider>
          </UserContextProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </>
  );
};

export default ContextProvider;
