import { useReducer, useEffect, useEffectEvent } from "react";
import {
  gameReducer,
  initialGameState,
  STORAGE_KEY,
} from "./reducers/gameReducer";
import { ScoreBoard } from "./components/scoreBoard";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useVirtualKeyboard } from "./hooks/useVirtualKeyboard";
import type { GameMode, GameState } from "./types/game";

export default function App() {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialGameState,
    (defaultState) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved) as GameState;
        } catch {
          return defaultState;
        }
      }
      return defaultState;
    },
  );

  const [, setLocalStorageState] = useLocalStorage(
    STORAGE_KEY,
    initialGameState,
    500,
  );

  useVirtualKeyboard();

  const persistState = useEffectEvent((s: GameState) => {
    setLocalStorageState(s);
  });

  useEffect(() => {
    persistState(state);
  }, [state]);

  const handleInitGame = (
    mode: GameMode,
    names: string[],
    teamNames?: string[],
  ) => {
    dispatch({ type: "INIT_GAME", payload: { mode, names, teamNames } });
  };

  return (
    <ScoreBoard
      state={state}
      onAddPoints={(playerId, points) =>
        dispatch({ type: "ADD_POINTS", payload: { playerId, points } })
      }
      onUndo={() => dispatch({ type: "UNDO" })}
      onNextMatch={() => dispatch({ type: "NEXT_MATCH" })}
      onResetPoints={() => dispatch({ type: "RESET_POINTS" })}
      onResetSeries={() => dispatch({ type: "RESET_SERIES" })}
      onResetAll={() => dispatch({ type: "RESET_ALL" })}
      onInitGame={handleInitGame}
    />
  );
}
