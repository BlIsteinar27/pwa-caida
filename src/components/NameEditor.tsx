import { useState, memo } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface Props {
  names: string[];
  onChange: (names: string[]) => void;
  mode: "players" | "teams";
}

export const NameEditor = memo(function NameEditor({
  names,
  onChange,
  mode,
}: Props) {
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
                className="flex-1 bg-white/80 border-purple-200 text-gray-800"
                placeholder={getPlaceholder(index)}
                autoFocus
              />
              <Button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-500 text-white"
                size="sm"
              >
                ✓
              </Button>
              <Button
                onClick={handleCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                size="sm"
              >
                ✗
              </Button>
            </>
          ) : (
            <>
              <div className="flex-1 bg-white/60 border border-purple-200 rounded px-2.5 py-1 text-gray-700">
                {name || getPlaceholder(index)}
              </div>
              <Button
                onClick={() => handleEdit(index, name)}
                className="bg-purple-500 hover:bg-purple-400 text-white"
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
});
