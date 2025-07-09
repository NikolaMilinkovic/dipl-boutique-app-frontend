import React, { ReactNode } from 'react';
import AuthContextProvider from './auth-context';
import { UserContextProvider } from './user-context';
import { ColorsContextProvider } from './colors-context';
import { SocketContextProvider } from './socket-context';
import { CategoriesContextProvider } from './categories-context';
import { SuppliersContextProvider } from './suppliers-context';
import { CouriersContextProvider } from './couriers-context';
import { NewProductContextProvider } from './new-product-context';
import { ProductsContextProvider } from './products-context';
import { ConfirmationModalProvider } from './confirmation-modal-context';

interface ContextChildrenType {
  children: ReactNode;
}

const ContextProvider: React.FC<ContextChildrenType> = ({ children }) => {
  return (
    <>
      <AuthContextProvider>
        <SocketContextProvider>
          <ConfirmationModalProvider>
            <UserContextProvider>
              <ColorsContextProvider>
                <CategoriesContextProvider>
                  <SuppliersContextProvider>
                    <CouriersContextProvider>
                      <ProductsContextProvider>
                        <NewProductContextProvider>
                          {children}
                        </NewProductContextProvider>
                      </ProductsContextProvider>
                    </CouriersContextProvider>
                  </SuppliersContextProvider>
                </CategoriesContextProvider>
              </ColorsContextProvider>
            </UserContextProvider>
          </ConfirmationModalProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </>
  );
};

export default ContextProvider;
