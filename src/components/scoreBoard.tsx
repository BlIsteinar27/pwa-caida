import type { GameState } from "../types/game";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GameSetupModal } from "./GameSetupModal";
import { CustomPointsModal } from "./CustomPointsModal";
import { confirmResetSeries } from "../utils/confirmations";
import { useState } from "react";

interface Props {
  state: GameState;
  onAddPoints: (playerId: number, points: number) => void;
  onUndo: () => void;
  onNextMatch: () => void;
  onReset: () => void;
  onShowSetup: () => void;
  onInitGame: (mode: any, names: string[], teamNames?: string[]) => void;
}

export function ScoreBoard({
  state,
  onAddPoints,
  onUndo,
  onNextMatch,
  onReset,
  onShowSetup,
  onInitGame,
}: Props) {
  const [customPointsOpen, setCustomPointsOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  const renderPlayers = () => {
    if (state.mode === "teams") {
      return (
        <div className="grid grid-cols-2 gap-4 flex-1 my-2">
          {state.teams.map((team) => (
            <Card
              key={team.id}
              className="bg-white/70 backdrop-blur-md border border-white/40 shadow-lg flex flex-col justify-between hover:bg-white/80 transition-all"
            >
              <CardHeader className="p-3 pb-0 text-center">
                <CardTitle className="text-lg text-gray-800 truncate font-semibold">
                  {team.name}
                </CardTitle>
                <span className="text-xs text-gray-500">
                  Ganadas: {team.wins}
                </span>
              </CardHeader>
              <CardContent className="p-3 text-center flex-1 flex flex-col justify-center items-center">
                <span className="text-6xl font-black text-purple-600">
                  {team.score}
                </span>
                <span className="text-xs text-gray-500 mt-1">/ 24 pts</span>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div
        className={`grid gap-4 flex-1 my-2 ${state.players.length === 2 ? "grid-cols-2" : "grid-cols-2 grid-rows-2"}`}
      >
        {state.players.map((player) => (
          <Card
            key={player.id}
            className="bg-white/70 backdrop-blur-md border border-white/40 shadow-lg flex flex-col justify-between hover:bg-white/80 transition-all"
          >
            <CardHeader className="p-3 pb-0 text-center">
              <CardTitle className="text-lg text-gray-800 truncate font-semibold">
                {player.name}
              </CardTitle>
              <span className="text-xs text-gray-500">
                Ganadas: {player.wins}
              </span>
            </CardHeader>
            <CardContent className="p-3 text-center flex-1 flex flex-col justify-center items-center">
              <span className="text-6xl font-black text-purple-600">
                {player.score}
              </span>
              <span className="text-xs text-gray-500 mt-1">/ 24 pts</span>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderPointButtons = () => {
    const cantos = [
      { label: "+1", pts: 1 },
      { label: "+2", pts: 2 },
      { label: "+3", pts: 3 },
      { label: "+4", pts: 4 },
      { label: "Patrulla (+6)", pts: 6 },
      { label: "Vigía (+7)", pts: 7 },
      { label: "Registro (+12)", pts: 12 },
    ];

    const participants = state.mode === "teams" ? state.teams : state.players;

    return (
      <div className="space-y-3">
        {participants.map((participant) => (
          <div key={participant.id} className="space-y-1">
            <span className="text-xs font-semibold text-gray-600">
              Sumar a {participant.name}:
            </span>
            <div className="grid grid-cols-4 gap-1">
              {cantos.slice(0, 4).map((canto) => (
                <Button
                  key={canto.pts}
                  variant="secondary"
                  className="h-12 text-lg font-bold bg-white/80 backdrop-blur-md border border-white/60 shadow-md hover:bg-white/90 hover:shadow-lg active:scale-95 transition-all text-purple-700"
                  onClick={() => onAddPoints(participant.id, canto.pts)}
                >
                  {canto.label}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-1 pt-1">
              {cantos.slice(4).map((canto) => (
                <Button
                  key={canto.pts}
                  variant="outline"
                  className="h-9 text-xs border-purple-200 bg-purple-50/80 backdrop-blur-md hover:bg-purple-100/80 active:scale-95 transition-all text-purple-600"
                  onClick={() => onAddPoints(participant.id, canto.pts)}
                >
                  {canto.label}
                </Button>
              ))}
              <Button
                variant="outline"
                className="h-9 text-xs border-pink-300 bg-pink-50/80 backdrop-blur-md hover:bg-pink-100/80 active:scale-95 transition-all text-pink-600"
                onClick={() => {
                  setSelectedPlayerId(participant.id);
                  setCustomPointsOpen(true);
                }}
              >
                Custom
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleReset = async () => {
    const confirmed = await confirmResetSeries();
    if (confirmed) {
      onShowSetup();
    }
  };

  const handleCustomPoints = (points: number) => {
    if (selectedPlayerId !== null) {
      onAddPoints(selectedPlayerId, points);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto p-4 justify-between bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-gray-800 select-none overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <Badge
          variant="outline"
          className="text-purple-700 border-purple-300 bg-purple-100/50 backdrop-blur-sm"
        >
          Modo: {state.mode.toUpperCase()}
        </Badge>
        <div className="space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={state.history.length === 0}
            className="text-gray-700 hover:bg-white/60 backdrop-blur-sm"
          >
            Deshacer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="border-pink-300 text-pink-600 hover:bg-pink-100/50 backdrop-blur-sm"
          >
            Nueva Serie
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="border-red-300 text-red-600 hover:bg-red-100/50 backdrop-blur-sm"
          >
            Reiniciar
          </Button>
        </div>
      </div>

      {renderPlayers()}

      {state.isFinished ? (
        <Card className="bg-purple-100/80 backdrop-blur-md border-purple-300 p-4 text-center my-2 shadow-lg">
          <h2 className="text-xl font-bold text-purple-700">
            ¡Ganador: {state.winnerName}!
          </h2>
          <Button
            className="w-full mt-3 bg-purple-600 hover:bg-purple-500 text-white font-bold backdrop-blur-sm"
            onClick={onNextMatch}
          >
            Iniciar Siguiente Partida
          </Button>
        </Card>
      ) : (
        renderPointButtons()
      )}

      <GameSetupModal isOpen={state.needsSetup} onStartGame={onInitGame} />

      <CustomPointsModal
        isOpen={customPointsOpen}
        onClose={() => setCustomPointsOpen(false)}
        onConfirm={handleCustomPoints}
        playerName={
          selectedPlayerId !== null
            ? state.mode === "teams"
              ? state.teams.find((t) => t.id === selectedPlayerId)?.name || ""
              : state.players.find((p) => p.id === selectedPlayerId)?.name || ""
            : ""
        }
      />
    </div>
  );
}
