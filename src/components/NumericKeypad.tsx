import { Button } from "./ui/button";
import { Delete } from "lucide-react";
import { memo } from "react";

interface Props {
  onNumber: (num: number) => void;
  onClear: () => void;
  onBackspace: () => void;
}

export const NumericKeypad = memo(function NumericKeypad({
  onNumber,
  onClear,
  onBackspace,
}: Props) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="grid grid-cols-3 gap-2">
      {numbers.map((num) => (
        <Button
          key={num}
          onClick={() => onNumber(num)}
          className="bg-card border-border hover:bg-muted text-foreground text-2xl font-bold tabular-nums h-12 rounded-lg shadow-sm"
          variant="outline"
        >
          {num}
        </Button>
      ))}
      <Button
        onClick={onClear}
        className="bg-destructive/10 border-destructive/30 hover:bg-destructive/20 text-destructive font-bold h-12 rounded-lg shadow-sm"
        variant="outline"
        aria-label="Borrar todo"
      >
        C
      </Button>
      <Button
        onClick={onBackspace}
        className="bg-muted border-border hover:bg-muted/70 text-foreground font-bold h-12 rounded-lg shadow-sm"
        variant="outline"
        aria-label="Borrar último dígito"
      >
        <Delete className="size-5" />
      </Button>
    </div>
  );
});
