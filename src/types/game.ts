export type GameMode = "2p" | "3p" | "4p" | "teams";

export interface Player {
  id: number;
  name: string;
  score: number;
  wins: number;
}

export interface GameState {
  mode: GameMode;
  players: Player[];
  history: { playerId: number; points: number }[];
  isFinished: boolean;
  winnerName: string | null;
}