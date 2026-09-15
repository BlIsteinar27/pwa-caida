import { useState, useCallback } from "react";

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  variant: "danger" | "warning" | "info";
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
}

export function useConfirmations() {
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    title: "",
    message: "",
    variant: "warning",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    onConfirm: () => {},
  });

  const confirmResetPoints = useCallback(
    (): Promise<boolean> =>
      new Promise((resolve) => {
        setConfirmation({
          isOpen: true,
          title: "¿Reiniciar puntos?",
          message: "Se reiniciarán los puntos de la partida actual",
          variant: "warning",
          confirmText: "Sí, reiniciar",
          cancelText: "Cancelar",
          onConfirm: () => resolve(true),
        });
      }),
    [],
  );

  const confirmResetSeries = useCallback(
    (): Promise<boolean> =>
      new Promise((resolve) => {
        setConfirmation({
          isOpen: true,
          title: "¿Reiniciar serie?",
          message: "Se perderán todas las victorias acumuladas",
          variant: "danger",
          confirmText: "Sí, reiniciar",
          cancelText: "Cancelar",
          onConfirm: () => resolve(true),
        });
      }),
    [],
  );

  const confirmResetAll = useCallback(
    (): Promise<boolean> =>
      new Promise((resolve) => {
        setConfirmation({
          isOpen: true,
          title: "¿Reiniciar todo?",
          message: "Se perderá toda la configuración y progreso",
          variant: "danger",
          confirmText: "Sí, reiniciar",
          cancelText: "Cancelar",
          onConfirm: () => resolve(true),
        });
      }),
    [],
  );

  const closeConfirmation = useCallback((confirmed: boolean) => {
    setConfirmation((prev) => ({ ...prev, isOpen: false }));
    if (!confirmed) {
      // Resolve as false when cancelled
      return;
    }
  }, []);

  return {
    confirmation,
    confirmResetPoints,
    confirmResetSeries,
    confirmResetAll,
    closeConfirmation,
  };
}
