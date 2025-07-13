import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import './drawer-modal-context-styles.scss';

type DrawerContent = ReactNode;

interface DrawerModalContextType {
  openDrawer: (content: DrawerContent, key?: string) => void;
  closeDrawer: () => void;
  updateDrawerContent: (content: DrawerContent, key?: string) => void;
  isDrawerOpen: boolean;
}

const DrawerModalContext = createContext<DrawerModalContextType | undefined>(
  undefined,
);

export const useDrawerModal = () => {
  const context = useContext(DrawerModalContext);
  if (!context)
    throw new Error('useDrawerModal must be used within DrawerModalProvider');
  return context;
};

export const DrawerModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [content, setContent] = useState<DrawerContent>(null);
  const [contentKey, setContentKey] = useState<string>('');

  const openDrawer = (component: ReactNode, key?: string) => {
    setContent(component);
    setContentKey(key || Date.now().toString());
    setIsRendered(true);
    setTimeout(() => setIsVisible(true), 10);
  };

  const updateDrawerContent = (component: ReactNode, key?: string) => {
    setContent(component);
    setContentKey(key || Date.now().toString());
  };

  const closeDrawer = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsRendered(false);
      setContent(null);
      setContentKey('');
    }, 300);
  };

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  return (
    <DrawerModalContext.Provider
      value={{
        openDrawer,
        closeDrawer,
        updateDrawerContent,
        isDrawerOpen: isRendered,
      }}
    >
      {children}
      {isRendered && (
        <div
          className={`drawer-overlay ${isVisible ? 'visible' : 'hide-overlay'}`}
          onClick={closeDrawer}
        >
          <div
            className={`drawer ${isVisible ? 'show-drawer' : 'hide-drawer'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div key={contentKey}>{content}</div>
          </div>
        </div>
      )}
    </DrawerModalContext.Provider>
  );
};
