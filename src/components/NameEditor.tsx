import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface Props {
  names: string[];
  onChange: (names: string[]) => void;
  mode: "players" | "teams";
}

export function NameEditor({ names, onChange, mode }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempName, setTempName] = useState("");

  const handleEdit = (index: number, currentName: string) => {
    setEditingIndex(index);
    setTempName(currentName);
  };

  const handleSave = () => {
    if (editingIndex !== null && tempName.trim()) {
      const newNames = [...names];
      newNames[editingIndex] = tempName.trim();
      onChange(newNames);
    }
    setEditingIndex(null);
    setTempName("");
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setTempName("");
  };

  const getPlaceholder = (index: number) => {
    if (mode === "teams") {
      return index === 0 ? "Equipo 1" : "Equipo 2";
    }
    return `Jugador ${index + 1}`;
  };

  return (
    <div className="space-y-2">
      {names.map((name, index) => (
        <div key={index} className="flex items-center gap-2">
          {editingIndex === index ? (
            <>
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                placeholder={getPlaceholder(index)}
                autoFocus
              />
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-500 text-white"
                size="sm"
              >
                ✓
              </Button>
              <Button
                onClick={handleCancel}
                className="bg-zinc-700 hover:bg-zinc-600 text-white"
                size="sm"
              >
                ✗
              </Button>
            </>
          ) : (
            <>
              <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1 text-zinc-200">
                {name || getPlaceholder(index)}
              </div>
              <Button
                onClick={() => handleEdit(index, name)}
                className="bg-amber-600 hover:bg-amber-500 text-white"
                size="sm"
              >
                ✎
              </Button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
