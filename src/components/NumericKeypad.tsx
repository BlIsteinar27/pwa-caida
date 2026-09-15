import { Button } from "./ui/button";
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
          className="bg-white/80 border border-purple-200 hover:bg-white/90 text-purple-700 text-2xl font-bold h-12 rounded-lg shadow-md transition-colors"
          variant="secondary"
        >
          {num}
        </Button>
      ))}
      <Button
        onClick={onClear}
        className="bg-red-100/80 border border-red-300 hover:bg-red-200/80 text-red-600 font-bold h-12 rounded-lg shadow-md transition-colors"
        variant="outline"
      >
        C
      </Button>
      <Button
        onClick={onBackspace}
        className="bg-purple-100/80 border border-purple-200 hover:bg-purple-200/80 text-purple-600 font-bold h-12 rounded-lg shadow-md transition-colors"
        variant="outline"
      >
        ⌫
      </Button>
    </div>
  );
});
