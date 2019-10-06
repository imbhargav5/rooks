import { useContext, useState, useEffect, useCallback } from "react";
import { ModalContext } from "./ModalProvider";

const useModal = (id, initial = false) => {
  const { registerModal, unregisterModal } = useContext(ModalContext);
  const [opened, setOpened] = useState(initial);
  const toggle = useCallback(shouldOpen => {
    setOpened(current => {
      if (typeof shouldOpen === "boolean") {
        return shouldOpen
      }

      return !current
    }
    );
  }, []);

  useEffect(() => {
    const modalId = id || Date.now()

    registerModal(modalId, toggle);

    return () => unregisterModal(modalId);
  }, [id]);

  return [opened, toggle];
};

export default useModal;
