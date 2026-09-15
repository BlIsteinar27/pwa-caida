import { useReducer, useEffect } from "react";
import { gameReducer, initialGameState, STORAGE_KEY } from "./reducers/gameReducer";
import { ScoreBoard } from "./components/scoreBoard";


export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState, (defaultState) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <ScoreBoard
      state={state}
      onAddPoints={(playerId, points) => dispatch({ type: "ADD_POINTS", payload: { playerId, points } })}
      onUndo={() => dispatch({ type: "UNDO" })}
      onNextMatch={() => dispatch({ type: "NEXT_MATCH" })}
      onReset={() => dispatch({ type: "RESET_ALL" })}
    />
  );
}