import { ConfirmationModalProvider } from './confirmation-modal-context';
import { EditProductModalProvider } from './edit-product-modal-context';
import { ImagePreviewModalProvider } from './image-preview-modal-context';

export const ModalsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ImagePreviewModalProvider>
      <ConfirmationModalProvider>
        <EditProductModalProvider>{children}</EditProductModalProvider>
      </ConfirmationModalProvider>
    </ImagePreviewModalProvider>
  );
};
