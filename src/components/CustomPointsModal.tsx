import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { NumericKeypad } from "./NumericKeypad";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (points: number) => void;
  playerName: string;
}

export function CustomPointsModal({
  isOpen,
  onClose,
  onConfirm,
  playerName,
}: Props) {
  const [currentValue, setCurrentValue] = useState("");

  const parsedValue = useMemo(
    () => parseInt(currentValue) || 0,
    [currentValue],
  );

  const handleNumber = (num: number) => {
    if (currentValue.length < 2) {
      setCurrentValue(currentValue + num.toString());
    }
  };

  const handleClear = () => {
    setCurrentValue("");
  };

  const handleBackspace = () => {
    setCurrentValue(currentValue.slice(0, -1));
  };

  const handleConfirm = () => {
    if (parsedValue > 0 && parsedValue <= 24) {
      onConfirm(parsedValue);
      setCurrentValue("");
      onClose();
    }
  };

  const displayValue = currentValue || "0";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-64 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            Agregar puntos a {playerName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-4xl font-black tabular-nums text-primary text-center py-4">
            {displayValue}
          </div>
          <NumericKeypad
            onNumber={handleNumber}
            onClear={handleClear}
            onBackspace={handleBackspace}
          />
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirm}
              disabled={parsedValue <= 0 || parsedValue > 24}
            >
              Agregar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
