# PWA Caídas Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-step. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar el marcador PWA Caídas para alinearlo con la lógica de negocio y mejorar UX con interfaz 100% visual

**Architecture:** Implementación incremental por fases comenzando con la estructura de datos, luego componentes modales, integración de SweetAlert2, y finalmente modificación del componente principal.

**Tech Stack:** React, TypeScript, Tailwind CSS, SweetAlert2, LocalStorage

---

## Fase 1: Preparación de Tipos y Estructura de Datos

### Task 1: Extender tipos para soportar modo teams

**Files:**
- Modify: `src/types/game.ts`

- [ ] **Step 1: Agregar tipos para equipos**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/types/game.ts
git commit -m "feat: extend types to support teams mode and setup flag"
```

### Task 2: Actualizar reducer para soportar nuevos tipos y acciones

**Files:**
- Modify: `src/reducers/gameReducer.ts`

- [ ] **Step 1: Actualizar tipo de acción INIT_GAME para soportar teams**

```typescript
export type GameAction =
  | { type: "INIT_GAME"; payload: { mode: GameMode; names: string[]; teamNames?: string[] } }
  | { type: "ADD_POINTS"; payload: { playerId: number; points: number } }
  | { type: "UNDO" }
  | { type: "NEXT_MATCH" }
  | { type: "RESET_ALL" }
  | { type: "SHOW_SETUP" }; // Nueva acción para mostrar configuración
```

- [ ] **Step 2: Actualizar estado inicial con needsSetup**

```typescript
export const initialGameState: GameState = {
  mode: "2p",
  players: [
    { id: 0, name: "Jugador 1", score: 0, wins: 0 },
    { id: 1, name: "Jugador 2", score: 0, wins: 0 }
  ],
  teams: [],
  history: [],
  isFinished: false,
  winnerName: null,
  needsSetup: true // Mostrar configuración al inicio
};
```

- [ ] **Step 3: Implementar lógica para INIT_GAME con modo teams**

```typescript
case "INIT_GAME": {
  if (action.payload.mode === "teams") {
    const teamNames = action.payload.teamNames || ["Equipo 1", "Equipo 2"];
    const playerNames = action.payload.names;
    
    const teams: Team[] = teamNames.map((teamName, index) => ({
      id: index,
      name: teamName,
      players: [
        { id: index * 2, name: playerNames[index * 2] || `Jugador ${index * 2 + 1}`, score: 0, wins: 0 },
        { id: index * 2 + 1, name: playerNames[index * 2 + 1] || `Jugador ${index * 2 + 2}`, score: 0, wins: 0 }
      ],
      score: 0,
      wins: 0
    }));

    return {
      mode: action.payload.mode,
      players: [],
      teams,
      history: [],
      isFinished: false,
      winnerName: null,
      needsSetup: false
    };
  }

  const players = action.payload.names.map((name, index) => ({
    id: index,
    name: name.trim() || `Jugador ${index + 1}`,
    score: 0,
    wins: 0
  }));
  
  return {
    mode: action.payload.mode,
    players,
    teams: [],
    history: [],
    isFinished: false,
    winnerName: null,
    needsSetup: false
  };
}
```

- [ ] **Step 4: Implementar acción SHOW_SETUP**

```typescript
case "SHOW_SETUP": {
  return {
    ...state,
    needsSetup: true
  };
}
```

- [ ] **Step 5: Actualizar NEXT_MATCH para modo teams**

```typescript
case "NEXT_MATCH": {
  if (state.mode === "teams") {
    return {
      ...state,
      teams: state.teams.map(team => ({
        ...team,
        score: 0,
        players: team.players.map(player => ({ ...player, score: 0 }))
      })),
      history: [],
      isFinished: false,
      winnerName: null
    };
  }

  return {
    ...state,
    players: state.players.map(p => ({ ...p, score: 0 })),
    history: [],
    isFinished: false,
    winnerName: null
  };
}
```

- [ ] **Step 6: Commit**

```bash
git add src/reducers/gameReducer.ts
git commit -m "feat: update reducer to support teams mode and setup flow"
```

---

## Fase 2: Componentes Modales

### Task 3: Crear componente ModeSelector

**Files:**
- Create: `src/components/ModeSelector.tsx`

- [ ] **Step 1: Crear componente ModeSelector**

```typescript
import type { GameMode } from "../types/game";

interface Props {
  selectedMode: GameMode;
  onSelect: (mode: GameMode) => void;
}

export function ModeSelector({ selectedMode, onSelect }: Props) {
  const modes = [
    { value: "2p" as GameMode, label: "2 Jugadores", icon: "👤👤" },
    { value: "3p" as GameMode, label: "3 Jugadores", icon: "👤👤👤" },
    { value: "4p" as GameMode, label: "4 Jugadores", icon: "👤👤👤👤" },
    { value: "teams" as GameMode, label: "Equipos (2v2)", icon: "🏆🏆" }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onSelect(mode.value)}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedMode === mode.value
              ? "border-amber-500 bg-amber-500/10"
              : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
          }`}
        >
          <div className="text-3xl mb-2">{mode.icon}</div>
          <div className="text-sm font-medium text-zinc-200">{mode.label}</div>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ModeSelector.tsx
git commit -m "feat: add ModeSelector component for visual game mode selection"
```

### Task 4: Crear componente NameEditor

**Files:**
- Create: `src/components/NameEditor.tsx`

- [ ] **Step 1: Crear componente NameEditor**

```typescript
import { useState } from "react";

interface Props {
  names: string[];
  onChange: (names: string[]) => void;
  mode: "players" | "teams";
}

export function NameEditor({ names, onChange, mode }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempName, setTempName] = useState("");

  const handleEdit = (index: number, currentName: string) => {
    setEditingIndex(index);
    setTempName(currentName);
  };

  const handleSave = () => {
    if (editingIndex !== null && tempName.trim()) {
      const newNames = [...names];
      newNames[editingIndex] = tempName.trim();
      onChange(newNames);
    }
    setEditingIndex(null);
    setTempName("");
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setTempName("");
  };

  const getPlaceholder = (index: number) => {
    if (mode === "teams") {
      return index === 0 ? "Equipo 1" : "Equipo 2";
    }
    return `Jugador ${index + 1}`;
  };

  return (
    <div className="space-y-2">
      {names.map((name, index) => (
        <div key={index} className="flex items-center gap-2">
          {editingIndex === index ? (
            <>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                placeholder={getPlaceholder(index)}
                autoFocus
              />
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded"
              >
                ✓
              </button>
              <button
                onClick={handleCancel}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded"
              >
                ✗
              </button>
            </>
          ) : (
            <>
              <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-zinc-200">
                {name || getPlaceholder(index)}
              </div>
              <button
                onClick={() => handleEdit(index, name)}
                className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-2 rounded"
              >
                ✎
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/NameEditor.tsx
git commit -m "feat: add NameEditor component for visual name editing"
```

### Task 5: Crear componente NumericKeypad

**Files:**
- Create: `src/components/NumericKeypad.tsx`

- [ ] **Step 1: Crear componente NumericKeypad**

```typescript
interface Props {
  onNumber: (num: number) => void;
  onClear: () => void;
  onBackspace: () => void;
}

export function NumericKeypad({ onNumber, onClear, onBackspace }: Props) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="grid grid-cols-3 gap-2">
      {numbers.map((num) => (
        <button
          key={num}
          onClick={() => onNumber(num)}
          className="bg-zinc-800 hover:bg-zinc-700 text-white text-2xl font-bold py-4 rounded-lg"
        >
          {num}
        </button>
      ))}
      <button
        onClick={onClear}
        className="bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-lg"
      >
        C
      </button>
      <button
        onClick={onBackspace}
        className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-4 rounded-lg"
      >
        ⌫
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/NumericKeypad.tsx
git commit -m "feat: add NumericKeypad component for visual number input"
```

### Task 6: Crear componente CustomPointsModal

**Files:**
- Create: `src/components/CustomPointsModal.tsx`

- [ ] **Step 1: Crear componente CustomPointsModal**

```typescript
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { NumericKeypad } from "./NumericKeypad";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (points: number) => void;
  playerName: string;
}

export function CustomPointsModal({ isOpen, onClose, onConfirm, playerName }: Props) {
  const [currentValue, setCurrentValue] = useState("");

  if (!isOpen) return null;

  const handleNumber = (num: number) => {
    if (currentValue.length < 2) {
      setCurrentValue(currentValue + num.toString());
    }
  };

  const handleClear = () => {
    setCurrentValue("");
  };

  const handleBackspace = () => {
    setCurrentValue(currentValue.slice(0, -1));
  };

  const handleConfirm = () => {
    const points = parseInt(currentValue) || 0;
    if (points > 0 && points <= 24) {
      onConfirm(points);
      setCurrentValue("");
      onClose();
    }
  };

  const displayValue = currentValue || "0";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-zinc-900 border-zinc-700 w-full max-w-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-white mb-2">
            Agregar puntos a {playerName}
          </h2>
          <div className="text-4xl font-black text-amber-500 text-center py-4 mb-4">
            {displayValue}
          </div>
          <NumericKeypad
            onNumber={handleNumber}
            onClear={handleClear}
            onBackspace={handleBackspace}
          />
          <div className="flex gap-2 mt-4">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-500"
              onClick={handleConfirm}
              disabled={!currentValue || parseInt(currentValue) <= 0 || parseInt(currentValue) > 24}
            >
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CustomPointsModal.tsx
git commit -m "feat: add CustomPointsModal for visual custom points input"
```

### Task 7: Crear componente GameSetupModal

**Files:**
- Create: `src/components/GameSetupModal.tsx`

- [ ] **Step 1: Crear componente GameSetupModal**

```typescript
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ModeSelector } from "./ModeSelector";
import { NameEditor } from "./NameEditor";
import type { GameMode } from "../types/game";

interface Props {
  isOpen: boolean;
  onStartGame: (mode: GameMode, names: string[], teamNames?: string[]) => void;
}

export function GameSetupModal({ isOpen, onStartGame }: Props) {
  const [selectedMode, setSelectedMode] = useState<GameMode>("2p");
  const [playerNames, setPlayerNames] = useState<string[]>(["", ""]);
  const [teamNames, setTeamNames] = useState<string[]>(["Equipo 1", "Equipo 2"]);

  if (!isOpen) return null;

  const handleModeChange = (mode: GameMode) => {
    setSelectedMode(mode);
    // Reset names based on mode
    if (mode === "2p") {
      setPlayerNames(["", ""]);
    } else if (mode === "3p") {
      setPlayerNames(["", "", ""]);
    } else if (mode === "4p") {
      setPlayerNames(["", "", "", ""]);
    } else if (mode === "teams") {
      setPlayerNames(["", "", "", ""]); // 4 players for 2 teams
      setTeamNames(["Equipo 1", "Equipo 2"]);
    }
  };

  const handleStartGame = () => {
    const validNames = playerNames.map((name, index) => 
      name.trim() || (selectedMode === "teams" ? `Jugador ${index + 1}` : `Jugador ${index + 1}`)
    );
    
    if (selectedMode === "teams") {
      const validTeamNames = teamNames.map((name, index) => 
        name.trim() || `Equipo ${index + 1}`
      );
      onStartGame(selectedMode, validNames, validTeamNames);
    } else {
      onStartGame(selectedMode, validNames);
    }
  };

  const getPlayerCount = () => {
    switch (selectedMode) {
      case "2p": return 2;
      case "3p": return 3;
      case "4p": return 4;
      case "teams": return 4;
      default: return 2;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-zinc-900 border-zinc-700 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-white text-center">Configurar Partida</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Modo de Juego</h3>
            <ModeSelector
              selectedMode={selectedMode}
              onSelect={handleModeChange}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">
              {selectedMode === "teams" ? "Nombres de Equipos" : "Nombres de Jugadores"}
            </h3>
            {selectedMode === "teams" ? (
              <>
                <NameEditor
                  names={teamNames}
                  onChange={setTeamNames}
                  mode="teams"
                />
                <h3 className="text-sm font-semibold text-zinc-400 mb-3 mt-4">Jugadores por Equipo</h3>
                <NameEditor
                  names={playerNames}
                  onChange={setPlayerNames}
                  mode="players"
                />
              </>
            ) : (
              <NameEditor
                names={playerNames.slice(0, getPlayerCount())}
                onChange={(names) => setPlayerNames(names)}
                mode="players"
              />
            )}
          </div>

          <Button
            className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold"
            onClick={handleStartGame}
          >
            Iniciar Partida
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GameSetupModal.tsx
git commit -m "feat: add GameSetupModal for initial game configuration"
```

---

## Fase 3: Integración de SweetAlert2

### Task 8: Crear utilidad de confirmación SweetAlert2

**Files:**
- Create: `src/utils/confirmations.ts`

- [ ] **Step 1: Crear utilidad de confirmaciones**

```typescript
import Swal from "sweetalert2";

export const confirmResetSeries = async (): Promise<boolean> => {
  const result = await Swal.fire({
    title: "¿Reiniciar serie?",
    text: "Se perderán todas las victorias acumuladas",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, reiniciar",
    cancelButtonText: "Cancelar",
    customClass: {
      popup: "bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl",
      title: "text-white font-bold text-lg",
      content: "text-zinc-300",
      confirmButton: "bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded",
      cancelButton: "bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded"
    },
    buttonsStyling: false
  });
  return result.isConfirmed;
};

export const confirmResetAll = async (): Promise<boolean> => {
  const result = await Swal.fire({
    title: "¿Reiniciar todo?",
    text: "Se perderá toda la configuración y progreso",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, reiniciar",
    cancelButtonText: "Cancelar",
    customClass: {
      popup: "bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl",
      title: "text-white font-bold text-lg",
      content: "text-zinc-300",
      confirmButton: "bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded",
      cancelButton: "bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded"
    },
    buttonsStyling: false
  });
  return result.isConfirmed;
};
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/confirmations.ts
git commit -m "feat: add SweetAlert2 confirmation utilities with Tailwind styling"
```

---

## Fase 4: Modificación del Componente Principal

### Task 9: Actualizar ScoreBoard para integrar modales y modo teams

**Files:**
- Modify: `src/components/scoreBoard.tsx`

- [ ] **Step 1: Agregar imports y estado para modales**

```typescript
import type { GameState } from "../types/game";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GameSetupModal } from "./GameSetupModal";
import { CustomPointsModal } from "./CustomPointsModal";
import { confirmResetSeries } from "../utils/confirmations";
import { useState } from "react";
```

- [ ] **Step 2: Agregar estado para modales**

```typescript
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
  onInitGame
}: Props) {
  const [customPointsOpen, setCustomPointsOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
```

- [ ] **Step 3: Reemplazar lógica de renderizado de jugadores para soportar teams**

```typescript
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
```

- [ ] **Step 4: Actualizar botones de puntos para incluir botón Custom**

```typescript
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
```

- [ ] **Step 5: Actualizar handlers con confirmaciones**

```typescript
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
```

- [ ] **Step 6: Actualizar JSX principal para incluir modales**

```typescript
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

      <GameSetupModal
        isOpen={state.needsSetup}
        onStartGame={onInitGame}
      />

      <CustomPointsModal
        isOpen={customPointsOpen}
        onClose={() => setCustomPointsOpen(false)}
        onConfirm={handleCustomPoints}
        playerName={selectedPlayerId !== null 
          ? (state.mode === "teams" 
              ? state.teams.find(t => t.id === selectedPlayerId)?.name || ""
              : state.players.find(p => p.id === selectedPlayerId)?.name || "")
          : ""
        }
      />
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/scoreBoard.tsx
git commit -m "feat: integrate modals and teams mode into ScoreBoard component"
```

### Task 10: Actualizar App.tsx para integrar nuevas acciones

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Actualizar imports y handlers**

```typescript
import { useReducer, useEffect } from "react";
import { gameReducer, initialGameState, STORAGE_KEY } from "./reducers/gameReducer";
import { ScoreBoard } from "./components/scoreBoard";
import type { GameMode } from "./types/game";

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

  const handleInitGame = (mode: GameMode, names: string[], teamNames?: string[]) => {
    dispatch({ type: "INIT_GAME", payload: { mode, names, teamNames } });
  };

  return (
    <ScoreBoard
      state={state}
      onAddPoints={(playerId, points) => dispatch({ type: "ADD_POINTS", payload: { playerId, points } })}
      onUndo={() => dispatch({ type: "UNDO" })}
      onNextMatch={() => dispatch({ type: "NEXT_MATCH" })}
      onReset={() => dispatch({ type: "RESET_ALL" })}
      onShowSetup={() => dispatch({ type: "SHOW_SETUP" })}
      onInitGame={handleInitGame}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "feat: update App.tsx to integrate new game setup actions"
```

---

## Fase 5: Testing y Verificación

### Task 11: Verificar funcionamiento del modo teams

**Files:**
- Test: Manual testing in browser

- [ ] **Step 1: Iniciar aplicación y verificar modal de configuración**

Run: `npm run dev`
Expected: Modal de configuración se muestra al inicio

- [ ] **Step 2: Seleccionar modo teams y configurar equipos**

Action: Seleccionar "Equipos (2v2)", ingresar nombres de equipos y jugadores
Expected: Nombres se guardan correctamente y modal se cierra

- [ ] **Step 3: Verificar renderizado de equipos**

Action: Observar tablero de juego
Expected: Se muestran 2 tarjetas de equipos con puntuación consolidada

- [ ] **Step 4: Agregar puntos a equipos**

Action: Presionar botones de puntos en los equipos
Expected: Puntos se suman correctamente a los equipos

- [ ] **Step 5: Verificar victoria y siguiente partida**

Action: Llevar un equipo a 24+ puntos
Expected: Se declara ganador, botón "Siguiente Partida" resetea puntos pero mantiene nombres

### Task 12: Verificar funcionamiento de puntos personalizados

**Files:**
- Test: Manual testing in browser

- [ ] **Step 1: Abrir modal de puntos personalizados**

Action: Presionar botón "Custom" en cualquier jugador/equipo
Expected: Modal se abre con teclado numérico visual

- [ ] **Step 2: Ingresar cantidad personalizada**

Action: Usar teclado numérico para ingresar "9"
Expected: Display muestra "9"

- [ ] **Step 3: Confirmar cantidad**

Action: Presionar "Agregar"
Expected: Puntos se agregan correctamente, modal se cierra

- [ ] **Step 4: Verificar validación de rangos**

Action: Intentar ingresar "25"
Expected: Botón "Agregar" permanece deshabilitado

### Task 13: Verificar confirmaciones SweetAlert2

**Files:**
- Test: Manual testing in browser

- [ ] **Step 1: Probar confirmación de Nueva Serie**

Action: Presionar "Nueva Serie"
Expected: SweetAlert2 se muestra con estilos Tailwind, confirmación funciona

- [ ] **Step 2: Probar confirmación de Reiniciar**

Action: Presionar "Reiniciar"
Expected: SweetAlert2 se muestra, confirmación funciona

### Task 14: Verificar persistencia en LocalStorage

**Files:**
- Test: Manual testing in browser

- [ ] **Step 1: Configurar partida y refrescar página**

Action: Configurar partida, agregar puntos, refrescar navegador
Expected: Estado se mantiene después de refrescar

- [ ] **Step 2: Verificar modo teams persiste**

Action: Configurar modo teams, refrescar navegador
Expected: Configuración de equipos se mantiene

---

## Self-Review del Plan

**1. Spec coverage:**
- ✅ Modal de configuración inicial (Tasks 3, 4, 7, 10)
- ✅ Mecanismo de puntos personalizados (Tasks 5, 6, 9)
- ✅ Implementación modo teams (Tasks 1, 2, 9)
- ✅ Confirmaciones SweetAlert2 (Task 8, 9)
- ✅ Flujo de partidas (Tasks 2, 9, 10)

**2. Placeholder scan:**
- ✅ No hay placeholders TBD o TODO
- ✅ Todo el código está especificado
- ✅ Comandos exactos para testing

**3. Type consistency:**
- ✅ Tipos consistentes entre tasks
- ✅ Nombres de funciones y propiedades coherentes
- ✅ Interfaces TypeScript bien definidas