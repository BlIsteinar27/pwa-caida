import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Info, TriangleAlert } from "lucide-react";

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

  const Icon = variant === "info" ? Info : TriangleAlert;
  const iconClass =
    variant === "danger"
      ? "text-destructive"
      : variant === "info"
        ? "text-blue-500 dark:text-blue-400"
        : "text-primary";

  const confirmClass =
    variant === "danger"
      ? "flex-1 bg-destructive text-white hover:bg-destructive/90"
      : variant === "info"
        ? "flex-1 bg-blue-600 text-white hover:bg-blue-500"
        : "flex-1";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-68 sm:max-w-sm" showCloseButton={false}>
        <DialogHeader className="items-center gap-3">
          <Icon className={`size-8 ${iconClass}`} strokeWidth={1.75} />
          <DialogTitle className="text-center text-lg font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground text-center">{message}</p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {cancelText}
            </Button>
            <Button className={confirmClass} onClick={handleConfirm}>
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
