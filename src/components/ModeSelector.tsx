import type { GameMode } from "../types/game";
import { memo } from "react";

interface Props {
  selectedMode: GameMode;
  onSelect: (mode: GameMode) => void;
}

export const ModeSelector = memo(function ModeSelector({
  selectedMode,
  onSelect,
}: Props) {
  const modes = [
    { value: "2p" as GameMode, label: "2 Jugadores", icon: "👤👤" },
    { value: "3p" as GameMode, label: "3 Jugadores", icon: "👤👤👤" },
    { value: "4p" as GameMode, label: "4 Jugadores", icon: "👤👤👤👤" },
    { value: "teams" as GameMode, label: "Equipos (2v2)", icon: "🏆🏆" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onSelect(mode.value)}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedMode === mode.value
              ? "border-purple-400 bg-purple-100/80 shadow-md"
              : "border-purple-200 bg-white/60 hover:bg-white/80 hover:border-purple-300"
          }`}
        >
          <div className="text-3xl mb-2">{mode.icon}</div>
          <div className="text-sm font-medium text-gray-700">{mode.label}</div>
        </button>
      ))}
    </div>
  );
});
