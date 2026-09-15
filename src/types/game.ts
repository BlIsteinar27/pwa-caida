export type GameMode = "2p" | "3p" | "4p" | "teams";

export interface Player {
  id: number;
  name: string;
  score: number;
  wins: number;
}

export interface Team {
  id: number;
  name: string;
  players: Player[]; // 2 jugadores por equipo
  score: number; // Puntuación consolidada
  wins: number; // Victorias consolidadas
}

export interface GameState {
  mode: GameMode;
  players: Player[]; // Para modos individuales
  teams: Team[]; // Para modo teams
  history: { playerId: number; points: number }[];
  isFinished: boolean;
  winnerName: string | null;
  needsSetup: boolean; // Flag para mostrar modal de configuración
}
