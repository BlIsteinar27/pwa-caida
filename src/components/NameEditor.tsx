import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Check, Pencil, X } from "lucide-react";

interface Props {
  names: string[];
  onChange: (names: string[]) => void;
  mode: "players" | "teams";
  visibleCount?: number;
}

export function NameEditor({
  names,
  onChange,
  mode,
  visibleCount = names.length,
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
    <div className="-mb-2">
      {names.map((name, index) => {
        const visible = index < visibleCount;
        return (
          <div
            key={`${mode}-${index}`}
            inert={!visible}
            aria-hidden={!visible}
            className={`grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-200 ${
              visible ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div
                className={`flex items-center gap-2 pb-2 motion-safe:transition-transform motion-safe:duration-200 ${
                  visible ? "translate-y-0" : "-translate-y-2"
                }`}
              >
                {editingIndex === index ? (
                  <>
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave();
                        if (e.key === "Escape") handleCancel();
                      }}
                      className="flex-1"
                      placeholder={getPlaceholder(index)}
                      autoFocus
                    />
                    <Button
                      onClick={handleSave}
                      size="icon-sm"
                      aria-label="Guardar nombre"
                    >
                      <Check />
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="icon-sm"
                      aria-label="Cancelar edición"
                    >
                      <X />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 bg-muted/50 border border-border rounded-lg px-2.5 py-1.5 text-sm text-foreground">
                      {name || getPlaceholder(index)}
                    </div>
                    <Button
                      onClick={() => handleEdit(index, name)}
                      variant="secondary"
                      size="icon-sm"
                      aria-label={`Editar ${name || getPlaceholder(index)}`}
                    >
                      <Pencil />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
