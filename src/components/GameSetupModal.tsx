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

export function GameSetupModal({ isOpen, onStartGame }: Props) {
  const [selectedMode, setSelectedMode] = useState<GameMode>("2p");
  const [playerNames, setPlayerNames] = useState<string[]>(["", ""]);
  const [teamNames, setTeamNames] = useState<string[]>([
    "Equipo 1",
    "Equipo 2",
  ]);

  const handleModeChange = (mode: GameMode) => {
    setSelectedMode(mode);
    // Reset names based on mode
    if (mode === "2p") {
      setPlayerNames(["", ""]);
    } else if (mode === "3p") {
      setPlayerNames(["", "", ""]);
    } else if (mode === "4p") {
      setPlayerNames(["", "", "", ""]);
    } else if (mode === "teams") {
      setPlayerNames(["", "", "", ""]); // 4 players for 2 teams
      setTeamNames(["Equipo 1", "Equipo 2"]);
    }
  };

  const handleStartGame = () => {
    const validNames = playerNames.map(
      (name, index) =>
        name.trim() ||
        (selectedMode === "teams"
          ? `Jugador ${index + 1}`
          : `Jugador ${index + 1}`),
    );

    if (selectedMode === "teams") {
      const validTeamNames = teamNames.map(
        (name, index) => name.trim() || `Equipo ${index + 1}`,
      );
      onStartGame(selectedMode, validNames, validTeamNames);
    } else {
      onStartGame(selectedMode, validNames);
    }
  };

  const getPlayerCount = () => {
    switch (selectedMode) {
      case "2p":
        return 2;
      case "3p":
        return 3;
      case "4p":
        return 4;
      case "teams":
        return 4;
      default:
        return 2;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-white/90 backdrop-blur-md border border-purple-200 text-gray-800 max-w-md shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-gray-800 text-center">
            Configurar Partida
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Modo de Juego
            </h3>
            <ModeSelector
              selectedMode={selectedMode}
              onSelect={handleModeChange}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              {selectedMode === "teams"
                ? "Nombres de Equipos"
                : "Nombres de Jugadores"}
            </h3>
            {selectedMode === "teams" ? (
              <>
                <NameEditor
                  names={teamNames}
                  onChange={setTeamNames}
                  mode="teams"
                />
                <h3 className="text-sm font-semibold text-gray-600 mb-3 mt-4">
                  Jugadores por Equipo
                </h3>
                <NameEditor
                  names={playerNames}
                  onChange={setPlayerNames}
                  mode="players"
                />
              </>
            ) : (
              <NameEditor
                names={playerNames.slice(0, getPlayerCount())}
                onChange={(names) => setPlayerNames(names)}
                mode="players"
              />
            )}
          </div>

          <Button
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold backdrop-blur-sm"
            onClick={handleStartGame}
          >
            Iniciar Partida
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
