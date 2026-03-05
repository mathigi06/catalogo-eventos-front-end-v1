import { useState, useCallback } from "react";
import { ConfirmContext } from "./ConfirmContext";
import type {ConfirmOptions} from "./ConfirmContext";
import { ConfirmDialog } from "./ConfirmDialog";

type State = ConfirmOptions & {
  open: boolean;
  resolve?: (value: boolean) => void;
};

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>({
    open: false,
  });

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({
        open: true,
        resolve,
        ...options,
      });
    });
  }, []);

  const handleClose = (result: boolean) => {
    state.resolve?.(result);

    setState({
      open: false,
    });
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <ConfirmDialog
        open={state.open}
        title={state.title}
        description={state.description}
        confirmText={state.confirmText}
        cancelText={state.cancelText}
        onConfirm={() => handleClose(true)}
        onCancel={() => handleClose(false)}
      />
    </ConfirmContext.Provider>
  );
}