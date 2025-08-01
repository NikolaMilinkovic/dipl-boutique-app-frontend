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
import { ModalsContextProvider } from './modals/modals-context-provider';
import { NewOrderContextProvider } from './new-order-context';
import OrdersContextProvider from './orders-context';
import { EditOrderDrawerModalProvider } from './modals/edit-order-modal-context';
import { AgentContextProvider } from './agent-context';
import { AdminContextProvider } from './admin-context';

interface ContextChildrenType {
  children: ReactNode;
}

const ContextProvider: React.FC<ContextChildrenType> = ({ children }) => {
  return (
    <>
      <AuthContextProvider>
        <SocketContextProvider>
          <UserContextProvider>
            <AdminContextProvider>
              <ColorsContextProvider>
                <CategoriesContextProvider>
                  <SuppliersContextProvider>
                    <CouriersContextProvider>
                      <ModalsContextProvider>
                        <ProductsContextProvider>
                          <NewProductContextProvider>
                            <NewOrderContextProvider>
                              <EditOrderDrawerModalProvider>
                                <OrdersContextProvider>
                                  <AgentContextProvider>
                                    {children}
                                  </AgentContextProvider>
                                </OrdersContextProvider>
                              </EditOrderDrawerModalProvider>
                            </NewOrderContextProvider>
                          </NewProductContextProvider>
                        </ProductsContextProvider>
                      </ModalsContextProvider>
                    </CouriersContextProvider>
                  </SuppliersContextProvider>
                </CategoriesContextProvider>
              </ColorsContextProvider>
            </AdminContextProvider>
          </UserContextProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </>
  );
};

export default ContextProvider;
