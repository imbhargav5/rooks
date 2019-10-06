import { useContext } from "react";
import { ModalContext } from "./ModalProvider";

const useToggle = id => {
  const modalContext = useContext(ModalContext);

  return modalContext[id];
};

export default useToggle;
