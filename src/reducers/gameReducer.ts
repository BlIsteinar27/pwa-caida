import type { GameState, GameMode, Team } from "../types/game";

export type GameAction =
  | {
      type: "INIT_GAME";
      payload: { mode: GameMode; names: string[]; teamNames?: string[] };
    }
  | { type: "ADD_POINTS"; payload: { playerId: number; points: number } }
  | { type: "UNDO" }
  | { type: "NEXT_MATCH" }
  | { type: "RESET_ALL" }
  | { type: "SHOW_SETUP" };

export const STORAGE_KEY = "caidas_game_state_v1";

export const initialGameState: GameState = {
  mode: "2p",
  players: [
    { id: 0, name: "Jugador 1", score: 0, wins: 0 },
    { id: 1, name: "Jugador 2", score: 0, wins: 0 },
  ],
  teams: [],
  history: [],
  isFinished: false,
  winnerName: null,
  needsSetup: true,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "INIT_GAME": {
      if (action.payload.mode === "teams") {
        const teamNames = action.payload.teamNames || ["Equipo 1", "Equipo 2"];
        const playerNames = action.payload.names;

        const teams: Team[] = teamNames.map((teamName, index) => ({
          id: index,
          name: teamName,
          players: [
            {
              id: index * 2,
              name: playerNames[index * 2] || `Jugador ${index * 2 + 1}`,
              score: 0,
              wins: 0,
            },
            {
              id: index * 2 + 1,
              name: playerNames[index * 2 + 1] || `Jugador ${index * 2 + 2}`,
              score: 0,
              wins: 0,
            },
          ],
          score: 0,
          wins: 0,
        }));

        return {
          mode: action.payload.mode,
          players: [],
          teams,
          history: [],
          isFinished: false,
          winnerName: null,
          needsSetup: false,
        };
      }

      const players = action.payload.names.map((name, index) => ({
        id: index,
        name: name.trim() || `Jugador ${index + 1}`,
        score: 0,
        wins: 0,
      }));

      return {
        mode: action.payload.mode,
        players,
        teams: [],
        history: [],
        isFinished: false,
        winnerName: null,
        needsSetup: false,
      };
    }

    case "ADD_POINTS": {
      if (state.isFinished) return state;

      const { playerId, points } = action.payload;

      if (state.mode === "teams") {
        const updatedTeams = state.teams.map((team) => {
          if (team.id === playerId) {
            const newScore = team.score + points;
            return {
              ...team,
              score: newScore,
              players: team.players.map((player) => ({
                ...player,
                score: player.score + points,
              })),
            };
          }
          return team;
        });

        const winner = updatedTeams.find((t) => t.score >= 24);
        const isFinished = !!winner;

        if (isFinished && winner) {
          updatedTeams.forEach((t) => {
            if (t.id === winner.id) t.wins += 1;
          });
        }

        return {
          ...state,
          teams: updatedTeams,
          history: [...state.history, { playerId, points }],
          isFinished,
          winnerName: winner ? winner.name : null,
        };
      }

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
        winnerName: winner ? winner.name : null,
      };
    }

    case "UNDO": {
      if (state.history.length === 0) return state;

      const lastAction = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);

      if (state.mode === "teams") {
        const updatedTeams = state.teams.map((team) => {
          if (team.id === lastAction.playerId) {
            return {
              ...team,
              score: Math.max(0, team.score - lastAction.points),
              players: team.players.map((player) => ({
                ...player,
                score: Math.max(0, player.score - lastAction.points),
              })),
            };
          }
          return team;
        });

        return {
          ...state,
          teams: updatedTeams,
          history: newHistory,
          isFinished: false,
          winnerName: null,
        };
      }

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
        winnerName: null,
      };
    }

    case "NEXT_MATCH": {
      if (state.mode === "teams") {
        return {
          ...state,
          teams: state.teams.map((team) => ({
            ...team,
            score: 0,
            players: team.players.map((player) => ({ ...player, score: 0 })),
          })),
          history: [],
          isFinished: false,
          winnerName: null,
        };
      }

      return {
        ...state,
        players: state.players.map((p) => ({ ...p, score: 0 })),
        history: [],
        isFinished: false,
        winnerName: null,
      };
    }

    case "RESET_ALL": {
      return initialGameState;
    }

    case "SHOW_SETUP": {
      return {
        ...state,
        needsSetup: true,
      };
    }

    default:
      return state;
  }
}
