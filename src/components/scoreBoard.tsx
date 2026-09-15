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
              className="bg-zinc-900 border-zinc-800 flex flex-col justify-between"
            >
              <CardHeader className="p-3 pb-0 text-center">
                <CardTitle className="text-lg text-zinc-200 truncate">
                  {team.name}
                </CardTitle>
                <span className="text-xs text-zinc-500">
                  Ganadas: {team.wins}
                </span>
              </CardHeader>
              <CardContent className="p-3 text-center flex-1 flex flex-col justify-center items-center">
                <span className="text-6xl font-black text-amber-500">
                  {team.score}
                </span>
                <span className="text-xs text-zinc-500 mt-1">/ 24 pts</span>
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
            className="bg-zinc-900 border-zinc-800 flex flex-col justify-between"
          >
            <CardHeader className="p-3 pb-0 text-center">
              <CardTitle className="text-lg text-zinc-200 truncate">
                {player.name}
              </CardTitle>
              <span className="text-xs text-zinc-500">
                Ganadas: {player.wins}
              </span>
            </CardHeader>
            <CardContent className="p-3 text-center flex-1 flex flex-col justify-center items-center">
              <span className="text-6xl font-black text-amber-500">
                {player.score}
              </span>
              <span className="text-xs text-zinc-500 mt-1">/ 24 pts</span>
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
            <span className="text-xs font-semibold text-zinc-400">
              Sumar a {participant.name}:
            </span>
            <div className="grid grid-cols-4 gap-1">
              {cantos.slice(0, 4).map((canto) => (
                <Button
                  key={canto.pts}
                  variant="secondary"
                  className="h-12 text-lg font-bold bg-zinc-800 hover:bg-zinc-700 active:scale-95"
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
                  className="h-9 text-xs border-zinc-800 bg-zinc-900 hover:bg-zinc-800 active:scale-95"
                  onClick={() => onAddPoints(participant.id, canto.pts)}
                >
                  {canto.label}
                </Button>
              ))}
              <Button
                variant="outline"
                className="h-9 text-xs border-amber-700 bg-amber-900/20 hover:bg-amber-900/30 text-amber-400 active:scale-95"
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
    <div className="flex flex-col h-screen max-w-md mx-auto p-4 justify-between bg-zinc-950 text-white select-none">
      <div className="flex justify-between items-center mb-2">
        <Badge variant="outline" className="text-zinc-400 border-zinc-700">
          Modo: {state.mode.toUpperCase()}
        </Badge>
        <div className="space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={state.history.length === 0}
          >
            Deshacer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="border-amber-700 text-amber-400 hover:bg-amber-900/20"
          >
            Nueva Serie
          </Button>
          <Button variant="destructive" size="sm" onClick={onReset}>
            Reiniciar
          </Button>
        </div>
      </div>

      {renderPlayers()}

      {state.isFinished ? (
        <Card className="bg-amber-500/10 border-amber-500/50 p-4 text-center my-2">
          <h2 className="text-xl font-bold text-amber-400">
            ¡Ganador: {state.winnerName}!
          </h2>
          <Button
            className="w-full mt-3 bg-amber-600 hover:bg-amber-500 text-black font-bold"
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
