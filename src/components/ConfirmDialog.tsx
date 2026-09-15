import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "warning",
}: Props) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getConfirmButtonClass = () => {
    switch (variant) {
      case "danger":
        return "bg-red-500 hover:bg-red-400 text-white";
      case "warning":
        return "bg-purple-500 hover:bg-purple-400 text-white";
      case "info":
        return "bg-blue-500 hover:bg-blue-400 text-white";
      default:
        return "bg-purple-500 hover:bg-purple-400 text-white";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white/90 border-purple-200 text-gray-800 max-w-sm shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-gray-800 text-center text-lg font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600 text-center">{message}</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button
              className={`flex-1 ${getConfirmButtonClass()}`}
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
