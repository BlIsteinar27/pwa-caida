import type { GameState } from "../types/game";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameSetupModal } from "./GameSetupModal";
import { CustomPointsModal } from "./CustomPointsModal";
import { ConfirmDialog } from "./ConfirmDialog";
import { useConfirmations } from "../utils/confirmations";
import { useState, useCallback, memo, useMemo } from "react";

// Colores para jugadores y equipos
type PlayerColor = "blue" | "red" | "green" | "yellow";

const getPlayerColor = (id: number, mode: GameState["mode"]): PlayerColor => {
  if (mode === "teams") {
    return id === 0 ? "blue" : "red";
  }
  // Modo individual
  const colors: PlayerColor[] = ["blue", "red", "green", "yellow"];
  return colors[id] || "blue";
};

const colorClasses: Record<
  PlayerColor,
  {
    card: string;
    buttonRow: string;
    accent: string;
    secondaryButton: string;
    tertiaryButton: string;
  }
> = {
  blue: {
    card: "bg-blue-50/70 border-blue-200 hover:bg-blue-100/80",
    buttonRow: "bg-blue-100/30 border-blue-200",
    accent: "text-blue-600",
    secondaryButton:
      "bg-blue-50/80 border-blue-200 hover:bg-blue-100/80 text-blue-700",
    tertiaryButton:
      "border-blue-200 bg-blue-50/80 hover:bg-blue-100/80 text-blue-600",
  },
  red: {
    card: "bg-red-50/70 border-red-200 hover:bg-red-100/80",
    buttonRow: "bg-red-100/30 border-red-200",
    accent: "text-red-600",
    secondaryButton:
      "bg-red-50/80 border-red-200 hover:bg-red-100/80 text-red-700",
    tertiaryButton:
      "border-red-200 bg-red-50/80 hover:bg-red-100/80 text-red-600",
  },
  green: {
    card: "bg-green-50/70 border-green-200 hover:bg-green-100/80",
    buttonRow: "bg-green-100/30 border-green-200",
    accent: "text-green-600",
    secondaryButton:
      "bg-green-50/80 border-green-200 hover:bg-green-100/80 text-green-700",
    tertiaryButton:
      "border-green-200 bg-green-50/80 hover:bg-green-100/80 text-green-600",
  },
  yellow: {
    card: "bg-yellow-50/70 border-yellow-200 hover:bg-yellow-100/80",
    buttonRow: "bg-yellow-100/30 border-yellow-200",
    accent: "text-yellow-600",
    secondaryButton:
      "bg-yellow-50/80 border-yellow-200 hover:bg-yellow-100/80 text-yellow-700",
    tertiaryButton:
      "border-yellow-200 bg-yellow-50/80 hover:bg-yellow-100/80 text-yellow-600",
  },
};

interface Props {
  state: GameState;
  onAddPoints: (playerId: number, points: number) => void;
  onUndo: () => void;
  onNextMatch: () => void;
  onResetPoints: () => void;
  onResetSeries: () => void;
  onResetAll: () => void;
  onInitGame: (mode: any, names: string[], teamNames?: string[]) => void;
}

export const ScoreBoard = memo(function ScoreBoard({
  state,
  onAddPoints,
  onUndo,
  onNextMatch,
  onResetPoints,
  onResetSeries,
  onResetAll,
  onInitGame,
}: Props) {
  const [customPointsOpen, setCustomPointsOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const {
    confirmation,
    confirmResetPoints,
    confirmResetSeries,
    confirmResetAll,
    closeConfirmation,
  } = useConfirmations();

  const selectedPlayerName = useMemo(() => {
    if (selectedPlayerId === null) return "";
    if (state.mode === "teams") {
      return state.teams.find((t) => t.id === selectedPlayerId)?.name || "";
    }
    return state.players.find((p) => p.id === selectedPlayerId)?.name || "";
  }, [selectedPlayerId, state.mode, state.teams, state.players]);

  const renderPlayers = useCallback(() => {
    if (state.mode === "teams") {
      return (
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8 flex-1 my-2">
          {state.teams.map((team) => {
            const color = getPlayerColor(team.id, state.mode);
            const colorClass = colorClasses[color];
            return (
              <Card
                key={team.id}
                className={`${colorClass.card} shadow-lg flex flex-col justify-between transition-colors`}
              >
                <CardHeader className="p-3 md:p-4 lg:p-5 pb-0 text-center">
                  <CardTitle className="text-lg md:text-xl lg:text-2xl text-gray-800 truncate font-semibold">
                    {team.name}
                  </CardTitle>
                  <span className="text-xs text-gray-500">
                    Ganadas: {team.wins}
                  </span>
                </CardHeader>
                <CardContent className="p-3 md:p-4 lg:p-5 text-center flex-1 flex flex-col justify-center items-center">
                  <div className="text-xs text-gray-600 mb-2 space-y-1">
                    {team.players.map((player) => (
                      <div key={player.id} className="text-gray-500">
                        {player.name}
                      </div>
                    ))}
                  </div>
                  <span
                    className={`text-6xl md:text-7xl lg:text-8xl font-black ${colorClass.accent}`}
                  >
                    {team.score}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">/ 24 pts</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      );
    }

    return (
      <div
        className={`grid gap-4 md:gap-6 lg:gap-8 flex-1 my-2 ${state.players.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-2 lg:grid-cols-4"}`}
      >
        {state.players.map((player) => {
          const color = getPlayerColor(player.id, state.mode);
          const colorClass = colorClasses[color];
          return (
            <Card
              key={player.id}
              className={`${colorClass.card} shadow-lg flex flex-col justify-between transition-colors`}
            >
              <CardHeader className="p-3 md:p-4 lg:p-5 pb-0 text-center">
                <CardTitle className="text-lg md:text-xl lg:text-2xl text-gray-800 truncate font-semibold">
                  {player.name}
                </CardTitle>
                <span className="text-xs text-gray-500">
                  Ganadas: {player.wins}
                </span>
              </CardHeader>
              <CardContent className="p-3 md:p-4 lg:p-5 text-center flex-1 flex flex-col justify-center items-center">
                <span
                  className={`text-6xl md:text-7xl lg:text-8xl font-black ${colorClass.accent}`}
                >
                  {player.score}
                </span>
                <span className="text-xs text-gray-500 mt-1">/ 24 pts</span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }, [state.mode, state.teams, state.players]);

  const renderPointButtons = useCallback(() => {
    const cantos = [
      { label: "+1", pts: 1 },
      { label: "+2", pts: 2 },
      { label: "+3", pts: 3 },
      { label: "+4", pts: 4 },
      { label: "Patrulla", pts: 6 },
      { label: "Vigía", pts: 7 },
      { label: "Registro", pts: 12 },
    ];

    const participants = state.mode === "teams" ? state.teams : state.players;

    return (
      <div className="space-y-3">
        {participants.map((participant) => {
          const color = getPlayerColor(participant.id, state.mode);
          const colorClass = colorClasses[color];
          return (
            <div key={participant.id} className="space-y-1">
              <span className="text-xs font-semibold text-gray-600">
                Sumar a {participant.name}:
              </span>
              <div
                className={`grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-1 md:gap-2 p-2 md:p-3 rounded border ${colorClass.buttonRow}`}
              >
                {cantos.slice(0, 4).map((canto) => (
                  <Button
                    key={canto.pts}
                    variant="secondary"
                    className={`h-12 md:h-14 lg:h-16 text-lg md:text-xl lg:text-2xl font-bold shadow-md hover:shadow-lg transition-colors ${colorClass.secondaryButton}`}
                    onClick={() => onAddPoints(participant.id, canto.pts)}
                  >
                    {canto.label}
                  </Button>
                ))}
              </div>
              <div
                className={`grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-1 md:gap-2 pt-1 p-2 md:p-3 rounded border ${colorClass.buttonRow}`}
              >
                {cantos.slice(4).map((canto) => (
                  <Button
                    key={canto.pts}
                    variant="outline"
                    className={`h-9 md:h-11 lg:h-12 text-xs md:text-sm lg:text-base transition-colors ${colorClass.tertiaryButton}`}
                    onClick={() => onAddPoints(participant.id, canto.pts)}
                  >
                    {canto.label}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  className="h-9 md:h-11 lg:h-12 text-xs md:text-sm lg:text-base border-pink-300 bg-pink-50/80 hover:bg-pink-100/80 transition-colors text-pink-600"
                  onClick={() => {
                    setSelectedPlayerId(participant.id);
                    setCustomPointsOpen(true);
                  }}
                >
                  Custom
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [state.mode, state.teams, state.players, onAddPoints]);

  const handleResetPoints = useCallback(async () => {
    const confirmed = await confirmResetPoints();
    if (confirmed) {
      onResetPoints();
    }
  }, [confirmResetPoints, onResetPoints]);

  const handleResetSeries = useCallback(async () => {
    const confirmed = await confirmResetSeries();
    if (confirmed) {
      onResetSeries();
    }
  }, [confirmResetSeries, onResetSeries]);

  const handleResetAll = useCallback(async () => {
    const confirmed = await confirmResetAll();
    if (confirmed) {
      onResetAll();
    }
  }, [confirmResetAll, onResetAll]);

  const handleCustomPoints = useCallback(
    (points: number) => {
      if (selectedPlayerId !== null) {
        onAddPoints(selectedPlayerId, points);
      }
    },
    [selectedPlayerId, onAddPoints],
  );

  return (
    <div className="flex flex-col h-screen max-w-md md:max-w-2xl lg:max-w-4xl mx-auto p-4 md:p-6 lg:p-8 justify-between bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-gray-800 select-none overflow-y-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-2 md:mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetPoints}
          className="border-purple-300 text-purple-600 hover:bg-purple-100/50"
        >
          Reiniciar Puntos
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetSeries}
          className="border-pink-300 text-pink-600 hover:bg-pink-100/50"
        >
          Nueva Serie
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetAll}
          className="border-red-300 text-red-600 hover:bg-red-100/50"
        >
          Nueva Partida
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={state.history.length === 0}
          className="text-gray-700 hover:bg-white/60"
        >
          Deshacer
        </Button>
      </div>

      {renderPlayers()}

      {state.isFinished ? (
        <Card className="bg-purple-100/80 border-purple-300 p-4 md:p-6 lg:p-8 text-center my-2 md:my-4 shadow-lg">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-700">
            ¡Ganador: {state.winnerName}!
          </h2>
          <div className="flex gap-2 mt-3">
            <Button
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold"
              onClick={onNextMatch}
            >
              Siguiente Partida
            </Button>
            <Button
              className="flex-1 border-purple-300 text-white  hover:bg-purple-100/50"
              onClick={handleResetPoints}
            >
              Reiniciar Puntos
            </Button>
          </div>
        </Card>
      ) : (
        renderPointButtons()
      )}

      <GameSetupModal isOpen={state.needsSetup} onStartGame={onInitGame} />

      <CustomPointsModal
        isOpen={customPointsOpen}
        onClose={() => setCustomPointsOpen(false)}
        onConfirm={handleCustomPoints}
        playerName={selectedPlayerName}
      />

      <ConfirmDialog
        isOpen={confirmation.isOpen}
        onClose={() => closeConfirmation(false)}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        variant={confirmation.variant}
      />
    </div>
  );
});
