import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { Toast } from "~/components/ui/toast";
import type { ToastItemProps } from "~/components/ui/toast/toast-item";
import { ToastContext } from "~/hooks/use-toast/toast-context";

export type PushToastOptions = ToastItemProps & {
  timeout?: number;
};

type ToastViewItem = ToastItemProps & {
  id: string;
};

interface Props {
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: Props) => {
  const [items, setItems] = useState<ToastViewItem[]>([]);

  const pushToast = useCallback(({ timeout = 5000, ...options }: PushToastOptions) => {
    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `toast-${Date.now()}`;
    setItems((prev) => [...prev, { ...options, id }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, timeout);
  }, []);

  const toastPortal =
    typeof document === "undefined"
      ? null
      : createPortal(
          <Toast.Stack>
            {items.map((item) => (
              <Toast.Item key={item.id} {...item} />
            ))}
          </Toast.Stack>,
          document.body,
        );

  return (
    <>
      <ToastContext.Provider value={{ pushToast }}>{children}</ToastContext.Provider>
      {toastPortal}
    </>
  );
};
