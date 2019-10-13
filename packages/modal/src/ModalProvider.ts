import { createContext, useState, useCallback, createElement } from "react";

export type ToggleFunctionType = (shouldOpen: boolean) => void

export const ModalContext = createContext(null);

const ModalProvider = ({ children }) => {
  const [store, setStore] = useState({});

  const registerModal = useCallback((id: string, initial: boolean): void => {
    setStore(currentStore => ({
      ...currentStore,
      [id]: {
        opened: initial,
        setOpened: setterMethod => {
          const newValue = setterMethod();

          setStore(modalContext => ({
            ...modalContext,
            [id]: {
              ...modalContext[id],
              opened: newValue
            }
          }));
        }
      }
    }));
  }, []);

  const unregisterModal = useCallback((id: string): void => {
    setStore(currentStore => {
      const newStore = {
        ...currentStore
      };

      delete newStore[id];

      return newStore;
    });
  }, []);

  return createElement(ModalContext.Provider, {
    value: {
      registerModal,
      unregisterModal,
      ...store
    }
  }, children);
};

export default ModalProvider;
