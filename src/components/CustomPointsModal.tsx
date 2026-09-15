import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { NumericKeypad } from "./NumericKeypad";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (points: number) => void;
  playerName: string;
}

export function CustomPointsModal({ isOpen, onClose, onConfirm, playerName }: Props) {
  const [currentValue, setCurrentValue] = useState("");

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
    const points = parseInt(currentValue) || 0;
    if (points > 0 && points <= 24) {
      onConfirm(points);
      setCurrentValue("");
      onClose();
    }
  };

  const displayValue = currentValue || "0";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white text-center text-xl">
            Agregar puntos a {playerName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-4xl font-black text-amber-500 text-center py-4">
            {displayValue}
          </div>
          <NumericKeypad
            onNumber={handleNumber}
            onClear={handleClear}
            onBackspace={handleBackspace}
          />
          <div className="flex gap-2">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-500 text-white"
              onClick={handleConfirm}
              disabled={!currentValue || parseInt(currentValue) <= 0 || parseInt(currentValue) > 24}
            >
              Agregar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
