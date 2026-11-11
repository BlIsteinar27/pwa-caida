import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { ModeSelector } from "./ModeSelector";
import { NameEditor } from "./NameEditor";
import type { GameMode } from "../types/game";

interface Props {
  isOpen: boolean;
  onStartGame: (mode: GameMode, names: string[], teamNames?: string[]) => void;
}

const PLAYER_COUNT: Record<GameMode, number> = {
  "2p": 2,
  "3p": 3,
  "4p": 4,
  teams: 4,
};

export function GameSetupModal({ isOpen, onStartGame }: Props) {
  const [selectedMode, setSelectedMode] = useState<GameMode>("2p");
  const [playerNames, setPlayerNames] = useState<string[]>(["", "", "", ""]);
  const [teamNames, setTeamNames] = useState<string[]>([
    "Equipo 1",
    "Equipo 2",
  ]);

  const isTeams = selectedMode === "teams";

  const handleStartGame = () => {
    const validNames = playerNames
      .slice(0, PLAYER_COUNT[selectedMode])
      .map((name, index) => name.trim() || `Jugador ${index + 1}`);

    if (isTeams) {
      const validTeamNames = teamNames.map(
        (name, index) => name.trim() || `Equipo ${index + 1}`,
      );
      onStartGame(selectedMode, validNames, validTeamNames);
    } else {
      onStartGame(selectedMode, validNames);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={undefined}>
      <DialogContent className="max-w-64 sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            Configurar Partida
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Modo de Juego
            </h3>
            <ModeSelector
              selectedMode={selectedMode}
              onSelect={setSelectedMode}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              {isTeams ? "Nombres de Equipos" : "Nombres de Jugadores"}
            </h3>
            <div
              inert={!isTeams}
              aria-hidden={!isTeams}
              className={`grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-200 ${
                isTeams
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div>
                  <NameEditor
                    names={teamNames}
                    onChange={setTeamNames}
                    mode="teams"
                  />
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 mt-4">
                    Jugadores por Equipo
                  </h3>
                  <NameEditor
                    names={playerNames}
                    onChange={setPlayerNames}
                    mode="players"
                  />
                </div>
              </div>
            </div>
            <div
              inert={isTeams}
              aria-hidden={isTeams}
              className={`grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-200 ${
                isTeams
                  ? "grid-rows-[0fr] opacity-0"
                  : "grid-rows-[1fr] opacity-100"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div>
                  <NameEditor
                    names={playerNames}
                    onChange={setPlayerNames}
                    mode="players"
                    visibleCount={PLAYER_COUNT[selectedMode]}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full font-bold"
            onClick={handleStartGame}
          >
            Iniciar Partida
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
