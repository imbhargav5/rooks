import { useContext } from "react";
import { ModalContext, ToggleFunctionType } from "./ModalProvider";

const useToggle = (id: string): ToggleFunctionType => {
  const modalContext = useContext(ModalContext);

  return modalContext[id];
};

export default useToggle;
