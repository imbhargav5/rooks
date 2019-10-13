import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import ModalProvider, { ModalContext, ToggleFunctionType } from "./ModalProvider";

const noop = () => {}

const useModal = (id: string = '', initial: boolean = false): [ToggleFunctionType, boolean] => {
  const { registerModal, unregisterModal, ...modalContext } = useContext(ModalContext);
  const modalId = useMemo(() => id || Date.now(), [id]);
  const modal = modalContext[modalId];
  const isRegistered = !!modal;
  const { opened = initial, setOpened = noop } = modal || {};
  const toggle: ToggleFunctionType = useCallback(shouldOpen => {
    setOpened(() => {
      if (typeof shouldOpen === "boolean") {
        return shouldOpen;
      }

      return !opened;
    });
  }, [opened, setOpened]);

  useEffect(() => {
    let didRegister = false;

    if (!isRegistered) {
      registerModal(modalId, initial);
      didRegister = true;
    }

    return () => {
      if (didRegister) {
        unregisterModal(modalId);
      }
    }
  }, [modalId]);

  return isRegistered ? [toggle, opened] : [undefined, false];
};

useModal.Provider = ModalProvider

export default useModal;
