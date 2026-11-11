import type { GameState } from "../types/game";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameSetupModal } from "./GameSetupModal";
import { CustomPointsModal } from "./CustomPointsModal";
import { ConfirmDialog } from "./ConfirmDialog";
import { ThemeToggle } from "./ThemeToggle";
import { useConfirmations } from "../utils/confirmations";
import { useState, useCallback, memo, useMemo } from "react";
import {
  RotateCcw,
  RefreshCcw,
  Sparkles,
  Undo2,
  Trophy,
} from "lucide-react";

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

interface ColorClasses {
  card: string;
  buttonRow: string;
  accent: string;
  secondaryButton: string;
  tertiaryButton: string;
  selectedRing: string;
}

const colorClasses: Record<PlayerColor, ColorClasses> = {
  blue: {
    card: "bg-blue-50/80 border-blue-200 hover:bg-blue-100/80 dark:bg-blue-950/40 dark:border-blue-900/70 dark:hover:bg-blue-900/40",
    buttonRow:
      "bg-blue-100/40 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/60",
    accent: "text-blue-600 dark:text-blue-400",
    secondaryButton:
      "bg-blue-50/80 border-blue-200 hover:bg-blue-100/80 text-blue-700 dark:bg-blue-950/50 dark:border-blue-800 dark:hover:bg-blue-900/50 dark:text-blue-300",
    tertiaryButton:
      "border-blue-200 bg-blue-50/80 hover:bg-blue-100/80 text-blue-600 dark:bg-blue-950/50 dark:border-blue-800 dark:hover:bg-blue-900/50 dark:text-blue-300",
    selectedRing: "ring-blue-500 dark:ring-blue-400",
  },
  red: {
    card: "bg-red-50/80 border-red-200 hover:bg-red-100/80 dark:bg-red-950/40 dark:border-red-900/70 dark:hover:bg-red-900/40",
    buttonRow:
      "bg-red-100/40 border-red-200 dark:bg-red-950/30 dark:border-red-900/60",
    accent: "text-red-600 dark:text-red-400",
    secondaryButton:
      "bg-red-50/80 border-red-200 hover:bg-red-100/80 text-red-700 dark:bg-red-950/50 dark:border-red-800 dark:hover:bg-red-900/50 dark:text-red-300",
    tertiaryButton:
      "border-red-200 bg-red-50/80 hover:bg-red-100/80 text-red-600 dark:bg-red-950/50 dark:border-red-800 dark:hover:bg-red-900/50 dark:text-red-300",
    selectedRing: "ring-red-500 dark:ring-red-400",
  },
  green: {
    card: "bg-green-50/80 border-green-200 hover:bg-green-100/80 dark:bg-green-950/40 dark:border-green-900/70 dark:hover:bg-green-900/40",
    buttonRow:
      "bg-green-100/40 border-green-200 dark:bg-green-950/30 dark:border-green-900/60",
    accent: "text-green-700 dark:text-green-400",
    secondaryButton:
      "bg-green-50/80 border-green-200 hover:bg-green-100/80 text-green-700 dark:bg-green-950/50 dark:border-green-800 dark:hover:bg-green-900/50 dark:text-green-300",
    tertiaryButton:
      "border-green-200 bg-green-50/80 hover:bg-green-100/80 text-green-700 dark:bg-green-950/50 dark:border-green-800 dark:hover:bg-green-900/50 dark:text-green-300",
    selectedRing: "ring-green-600 dark:ring-green-400",
  },
  yellow: {
    card: "bg-yellow-50/80 border-yellow-200 hover:bg-yellow-100/80 dark:bg-yellow-950/40 dark:border-yellow-900/70 dark:hover:bg-yellow-900/40",
    buttonRow:
      "bg-yellow-100/40 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-900/60",
    accent: "text-yellow-700 dark:text-yellow-300",
    secondaryButton:
      "bg-yellow-50/80 border-yellow-200 hover:bg-yellow-100/80 text-yellow-800 dark:bg-yellow-950/50 dark:border-yellow-800 dark:hover:bg-yellow-900/50 dark:text-yellow-200",
    tertiaryButton:
      "border-yellow-200 bg-yellow-50/80 hover:bg-yellow-100/80 text-yellow-700 dark:bg-yellow-950/50 dark:border-yellow-800 dark:hover:bg-yellow-900/50 dark:text-yellow-300",
    selectedRing: "ring-yellow-500 dark:ring-yellow-400",
  },
};

interface ScoreCardProps {
  name: string;
  wins: number;
  score: number;
  colorClass: ColorClasses;
  selected: boolean;
  onToggle: () => void;
  members?: string[];
}

const ScoreCard = memo(function ScoreCard({
  name,
  wins,
  score,
  colorClass,
  selected,
  onToggle,
  members,
}: ScoreCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`${colorClass.card} border shadow-md flex flex-col justify-between cursor-pointer select-none transition-[background-color,border-color,box-shadow,scale] duration-150 motion-safe:active:scale-[0.96] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
        selected
          ? `ring-2 ring-offset-2 ring-offset-background shadow-lg ${colorClass.selectedRing}`
          : ""
      }`}
    >
      <CardHeader className="p-3 md:p-4 lg:p-5 pb-0 text-center">
        <CardTitle className="text-lg md:text-xl lg:text-2xl text-foreground truncate font-semibold">
          {name}
        </CardTitle>
        <span className="text-xs text-muted-foreground tabular-nums">
          Ganadas: {wins}
        </span>
      </CardHeader>
      <CardContent className="p-3 md:p-4 lg:p-5 text-center flex-1 flex flex-col justify-center items-center">
        {members && (
          <div className="text-xs text-muted-foreground mb-2 space-y-1">
            {members.map((member) => (
              <div key={member}>{member}</div>
            ))}
          </div>
        )}
        <span
          key={score}
          className={`text-6xl md:text-7xl lg:text-8xl font-black tabular-nums leading-none motion-safe:animate-in motion-safe:zoom-in-75 motion-safe:duration-150 ${colorClass.accent}`}
        >
          {score}
        </span>
        <span className="text-xs text-muted-foreground mt-1">/ 24 pts</span>
      </CardContent>
    </Card>
  );
});

interface Props {
  state: GameState;
  onAddPoints: (playerId: number, points: number) => void;
  onUndo: () => void;
  onNextMatch: () => void;
  onResetPoints: () => void;
  onResetSeries: () => void;
  onResetAll: () => void;
  onInitGame: (mode: GameState["mode"], names: string[], teamNames?: string[]) => void;
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
  const [selectedParticipantId, setSelectedParticipantId] = useState<
    number | null
  >(null);
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
    const toggle = (id: number) =>
      setSelectedParticipantId((prev) => (prev === id ? null : id));

    if (state.mode === "teams") {
      return (
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8 flex-1 my-2">
          {state.teams.map((team) => {
            const color = getPlayerColor(team.id, state.mode);
            return (
              <ScoreCard
                key={team.id}
                name={team.name}
                wins={team.wins}
                score={team.score}
                colorClass={colorClasses[color]}
                selected={selectedParticipantId === team.id}
                onToggle={() => toggle(team.id)}
                members={team.players.map((p) => p.name)}
              />
            );
          })}
        </div>
      );
    }

    return (
      <div
        className={`grid gap-4 md:gap-6 lg:gap-8 flex-1 my-2 ${state.players.length === 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"}`}
      >
        {state.players.map((player) => {
          const color = getPlayerColor(player.id, state.mode);
          return (
            <ScoreCard
              key={player.id}
              name={player.name}
              wins={player.wins}
              score={player.score}
              colorClass={colorClasses[color]}
              selected={selectedParticipantId === player.id}
              onToggle={() => toggle(player.id)}
            />
          );
        })}
      </div>
    );
  }, [state.mode, state.teams, state.players, selectedParticipantId]);

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

    let colorClass: ColorClasses = colorClasses.blue;
    let participantName = "";

    if (selectedParticipantId !== null) {
      const color = getPlayerColor(selectedParticipantId, state.mode);
      colorClass = colorClasses[color];
      participantName =
        state.mode === "teams"
          ? state.teams.find((t) => t.id === selectedParticipantId)?.name || ""
          : state.players.find((p) => p.id === selectedParticipantId)?.name ||
            "";
    }

    const hasSelection = selectedParticipantId !== null;
    const rowClass = hasSelection
      ? colorClass.buttonRow
      : "bg-muted/50 border-border";
    const primaryBtnClass = hasSelection
      ? colorClass.secondaryButton
      : "bg-muted/60 border-border";
    const secondaryBtnClass = hasSelection
      ? colorClass.tertiaryButton
      : "bg-muted/60 border-border";

    const addPoints = (pts: number) => {
      if (selectedParticipantId !== null) {
        onAddPoints(selectedParticipantId, pts);
        setSelectedParticipantId(null);
      }
    };

    return (
      <div className="space-y-3">
        {hasSelection ? (
          <span className="text-xs font-semibold text-foreground">
            Sumar a <span className={colorClass.accent}>{participantName}</span>:
          </span>
        ) : (
          <span className="text-xs font-semibold text-muted-foreground">
            Toca una tarjeta para agregar puntos
          </span>
        )}
        <div
          className={`grid grid-cols-4 lg:grid-cols-8 gap-1.5 md:gap-2 p-2 md:p-3 rounded-2xl border transition-[background-color,border-color] ${rowClass}`}
        >
          {cantos.slice(0, 4).map((canto) => (
            <Button
              key={canto.pts}
              variant="secondary"
              className={`h-12 md:h-14 lg:h-16 text-lg md:text-xl lg:text-2xl font-bold tabular-nums shadow-sm ${primaryBtnClass}`}
              onClick={() => addPoints(canto.pts)}
              disabled={!hasSelection}
            >
              {canto.label}
            </Button>
          ))}
        </div>
        <div
          className={`grid grid-cols-4 lg:grid-cols-8 gap-1.5 md:gap-2 p-2 md:p-3 rounded-2xl border transition-[background-color,border-color] ${rowClass}`}
        >
          {cantos.slice(4).map((canto) => (
            <Button
              key={canto.pts}
              variant="outline"
              className={`h-9 md:h-11 lg:h-12 text-xs md:text-sm lg:text-base ${secondaryBtnClass}`}
              onClick={() => addPoints(canto.pts)}
              disabled={!hasSelection}
            >
              {canto.label}
            </Button>
          ))}
          <Button
            variant="outline"
            className="h-9 md:h-11 lg:h-12 text-xs md:text-sm lg:text-base border-pink-300 bg-pink-50/80 hover:bg-pink-100/80 text-pink-600 dark:border-pink-800 dark:bg-pink-950/40 dark:hover:bg-pink-900/40 dark:text-pink-400"
            onClick={() => {
              if (selectedParticipantId !== null) {
                setSelectedPlayerId(selectedParticipantId);
                setCustomPointsOpen(true);
                setSelectedParticipantId(null);
              }
            }}
            disabled={!hasSelection}
          >
            Otro
          </Button>
        </div>
      </div>
    );
  }, [
    selectedParticipantId,
    state.mode,
    state.teams,
    state.players,
    onAddPoints,
  ]);

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
    <div className="flex flex-col h-dvh max-w-md md:max-w-2xl lg:max-w-4xl mx-auto p-4 md:p-6 lg:p-8 justify-between bg-linear-to-br from-pink-100/60 via-purple-50/80 to-blue-100/50 dark:from-purple-950/50 dark:via-background dark:to-blue-950/40 text-foreground select-none overflow-y-auto">
      <div className="flex items-start gap-2 mb-2 md:mb-4">
        <div className="grid flex-1 grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetPoints}
            className="border-primary/40 text-primary hover:bg-primary/10"
          >
            <RotateCcw />
            Reiniciar Puntos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetSeries}
            className="border-pink-300 text-pink-600 hover:bg-pink-500/10 dark:border-pink-800 dark:text-pink-400"
          >
            <RefreshCcw />
            Nueva Serie
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetAll}
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
          >
            <Sparkles />
            Nueva Partida
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={state.history.length === 0}
          >
            <Undo2 />
            Deshacer
          </Button>
        </div>
        <ThemeToggle />
      </div>

      {renderPlayers()}

      {state.isFinished ? (
        <Card className="bg-primary/10 border-primary/30 p-4 md:p-6 lg:p-8 text-center my-2 md:my-4 shadow-lg motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
          <h2 className="flex items-center justify-center gap-2 text-xl md:text-2xl lg:text-3xl font-bold text-primary">
            <Trophy className="size-6 md:size-7" />
            ¡Ganador: {state.winnerName}!
          </h2>
          <div className="flex gap-2 mt-3">
            <Button className="flex-1 font-bold" onClick={onNextMatch}>
              Siguiente Partida
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-primary/40 text-primary hover:bg-primary/10"
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
