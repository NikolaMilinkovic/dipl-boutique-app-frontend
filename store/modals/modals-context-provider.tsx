import { ConfirmationModalProvider } from './confirmation-modal-context';
import { DrawerModalProvider } from './drawer-modal-contex';
import { EditProductModalProvider } from './edit-product-modal-context';
import { ImagePreviewModalProvider } from './image-preview-modal-context';

export const ModalsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <DrawerModalProvider>
      <ImagePreviewModalProvider>
        <ConfirmationModalProvider>
          <EditProductModalProvider>{children}</EditProductModalProvider>
        </ConfirmationModalProvider>
      </ImagePreviewModalProvider>
    </DrawerModalProvider>
  );
};
