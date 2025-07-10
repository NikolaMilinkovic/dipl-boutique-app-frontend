import { ConfirmationModalProvider } from './confirmation-modal-context';
import { EditProductModalProvider } from './edit-product-modal-context';

export const ModalsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ConfirmationModalProvider>
      <EditProductModalProvider>{children}</EditProductModalProvider>
    </ConfirmationModalProvider>
  );
};
