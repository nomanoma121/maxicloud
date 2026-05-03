import { useContext } from "react";
import { ToastContext } from "~/hooks/use-toast/toast-context";

export const useToast = () => {
  return useContext(ToastContext);
};
