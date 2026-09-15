import { Button } from "./ui/button";

interface Props {
  onNumber: (num: number) => void;
  onClear: () => void;
  onBackspace: () => void;
}

export function NumericKeypad({ onNumber, onClear, onBackspace }: Props) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="grid grid-cols-3 gap-2">
      {numbers.map((num) => (
        <Button
          key={num}
          onClick={() => onNumber(num)}
          className="bg-zinc-800 hover:bg-zinc-700 text-white text-2xl font-bold h-12 rounded-lg"
          variant="secondary"
        >
          {num}
        </Button>
      ))}
      <Button
        onClick={onClear}
        className="bg-red-600 hover:bg-red-500 text-white font-bold h-12 rounded-lg"
        variant="destructive"
      >
        C
      </Button>
      <Button
        onClick={onBackspace}
        className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold h-12 rounded-lg"
        variant="secondary"
      >
        ⌫
      </Button>
    </div>
  );
}
