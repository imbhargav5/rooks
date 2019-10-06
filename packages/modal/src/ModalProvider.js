import { createElement, createContext, useState, useCallback } from "react";

export const ModalContext = createContext(null);

const ModalProvider = ({ children }) => {
  const [store, setStore] = useState({});

  const registerModal = useCallback((id, setOpened) => {
    setStore(currentStore => ({
      ...currentStore,
      [id]: setOpened
    }));
  }, []);

  const unregisterModal = useCallback(id => {
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
      ...store,
      registerModal,
      unregisterModal
    }
  }, children);
};

export default ModalProvider;
