import type { GameState, GameMode } from "../types/game";

export type GameAction =
  | { type: "INIT_GAME"; payload: { mode: GameMode; names: string[] } }
  | { type: "ADD_POINTS"; payload: { playerId: number; points: number } }
  | { type: "UNDO" }
  | { type: "NEXT_MATCH" }
  | { type: "RESET_ALL" };

export const STORAGE_KEY = "caidas_game_state_v1";

export const initialGameState: GameState = {
  mode: "2p",
  players: [
    { id: 0, name: "Jugador 1", score: 0, wins: 0 },
    { id: 1, name: "Jugador 2", score: 0, wins: 0 }
  ],
  history: [],
  isFinished: false,
  winnerName: null
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "INIT_GAME": {
      const players = action.payload.names.map((name, index) => ({
        id: index,
        name: name.trim() || `Jugador ${index + 1}`,
        score: 0,
        wins: 0
      }));
      return {
        mode: action.payload.mode,
        players,
        history: [],
        isFinished: false,
        winnerName: null
      };
    }

    case "ADD_POINTS": {
      if (state.isFinished) return state;

      const { playerId, points } = action.payload;
      const updatedPlayers = state.players.map((p) => {
        if (p.id === playerId) {
          const newScore = p.score + points;
          return { ...p, score: newScore };
        }
        return p;
      });

      const winner = updatedPlayers.find((p) => p.score >= 24);
      const isFinished = !!winner;

      if (isFinished && winner) {
        updatedPlayers.forEach((p) => {
          if (p.id === winner.id) p.wins += 1;
        });
      }

      return {
        ...state,
        players: updatedPlayers,
        history: [...state.history, { playerId, points }],
        isFinished,
        winnerName: winner ? winner.name : null
      };
    }

    case "UNDO": {
      if (state.history.length === 0) return state;

      const lastAction = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);

      const updatedPlayers = state.players.map((p) => {
        if (p.id === lastAction.playerId) {
          return { ...p, score: Math.max(0, p.score - lastAction.points) };
        }
        return p;
      });

      return {
        ...state,
        players: updatedPlayers,
        history: newHistory,
        isFinished: false,
        winnerName: null
      };
    }

    case "NEXT_MATCH": {
      return {
        ...state,
        players: state.players.map((p) => ({ ...p, score: 0 })),
        history: [],
        isFinished: false,
        winnerName: null
      };
    }

    case "RESET_ALL": {
      return initialGameState;
    }

    default:
      return state;
  }
}