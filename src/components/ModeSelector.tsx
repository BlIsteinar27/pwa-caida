import type { GameMode } from "../types/game";
import { memo } from "react";
import { Users, UsersRound, Trophy } from "lucide-react";

interface Props {
  selectedMode: GameMode;
  onSelect: (mode: GameMode) => void;
}

export const ModeSelector = memo(function ModeSelector({
  selectedMode,
  onSelect,
}: Props) {
  const modes = [
    { value: "2p" as GameMode, label: "2 Jugadores", icon: Users },
    { value: "3p" as GameMode, label: "3 Jugadores", icon: UsersRound },
    { value: "4p" as GameMode, label: "4 Jugadores", icon: UsersRound },
    { value: "teams" as GameMode, label: "Equipos (2v2)", icon: Trophy },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const selected = selectedMode === mode.value;
        return (
          <button
            key={mode.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(mode.value)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-[color,background-color,border-color,box-shadow,scale] duration-150 outline-none cursor-pointer [-webkit-tap-highlight-color:transparent] motion-safe:active:scale-[0.96] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ${
              selected
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border bg-card hover:bg-muted hover:border-primary/40"
            }`}
          >
            <Icon
              className={`size-8 ${selected ? "text-primary" : "text-muted-foreground"}`}
              strokeWidth={1.75}
            />
            <div
              className={`text-sm font-medium ${selected ? "text-primary" : "text-foreground"}`}
            >
              {mode.label}
            </div>
          </button>
        );
      })}
    </div>
  );
});
