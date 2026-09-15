import type { GameMode } from "../types/game";

interface Props {
  selectedMode: GameMode;
  onSelect: (mode: GameMode) => void;
}

export function ModeSelector({ selectedMode, onSelect }: Props) {
  const modes = [
    { value: "2p" as GameMode, label: "2 Jugadores", icon: "👤👤" },
    { value: "3p" as GameMode, label: "3 Jugadores", icon: "👤👤👤" },
    { value: "4p" as GameMode, label: "4 Jugadores", icon: "👤👤👤👤" },
    { value: "teams" as GameMode, label: "Equipos (2v2)", icon: "🏆🏆" }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onSelect(mode.value)}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedMode === mode.value
              ? "border-amber-500 bg-amber-500/10"
              : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
          }`}
        >
          <div className="text-3xl mb-2">{mode.icon}</div>
          <div className="text-sm font-medium text-zinc-200">{mode.label}</div>
        </button>
      ))}
    </div>
  );
}
