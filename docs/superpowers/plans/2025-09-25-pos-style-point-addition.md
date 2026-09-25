# POS-Style Point Addition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-step. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement POS-style point addition where users tap a player/team card to select it, then tap point values in a shared bottom bar, with automatic deselection after adding points.

**Architecture:** Single shared point addition bar at bottom, card-based selection system with visual feedback, automatic deselection after point addition, maintaining all existing functionality and controls.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, existing component structure

---

## File Structure

**Files to modify:**
- `src/components/scoreBoard.tsx` - Main component with selection state, card interactions, and shared point bar

**No new files needed** - All changes are modifications to existing component structure.

---

## Phase 1: Selection State Management

### Task 1: Add Selection State

**Files:**
- Modify: `src/components/scoreBoard.tsx:91-93`

- [ ] **Step 1: Add selected participant state**

Find the existing state declarations around line 91-93 and add:
```tsx
const [selectedParticipantId, setSelectedParticipantId] = useState<number | null>(null);
```

- [ ] **Step 2: Verify the change**

Run: `git diff src/components/scoreBoard.tsx`
Expected: Shows new selectedParticipantId state variable added

- [ ] **Step 3: Commit**

```bash
git add src/components/scoreBoard.tsx
git commit -m "feat: add selected participant state for POS-style interaction"
```

---

## Phase 2: Card Click Interaction

### Task 2: Make Cards Clickable

**Files:**
- Modify: `src/components/scoreBoard.tsx:117-144` (teams mode cards)
- Modify: `src/components/scoreBoard.tsx:159-179` (individual player cards)

- [ ] **Step 1: Add onClick handler to team cards**

Find the team Card component (around line 117) and add:
```tsx
<Card
  key={team.id}
  className={`${colorClass.card} shadow-lg flex flex-col justify-between transition-colors cursor-pointer ${selectedParticipantId === team.id ? 'ring-4 ring-purple-400 ring-opacity-50 scale-105' : ''}`}
  onClick={() => setSelectedParticipantId(team.id)}
>
```

- [ ] **Step 2: Add onClick handler to individual player cards**

Find the individual player Card component (around line 159) and add:
```tsx
<Card
  key={player.id}
  className={`${colorClass.card} shadow-lg flex flex-col justify-between transition-colors cursor-pointer ${selectedParticipantId === player.id ? 'ring-4 ring-purple-400 ring-opacity-50 scale-105' : ''}`}
  onClick={() => setSelectedParticipantId(player.id)}
>
```

- [ ] **Step 3: Verify the changes**

Run: `git diff src/components/scoreBoard.tsx`
Expected: Shows onClick handlers and visual feedback classes added to both card types

- [ ] **Step 4: Commit**

```bash
git add src/components/scoreBoard.tsx
git commit -m "feat: make player/team cards clickable with visual selection feedback"
```

---

## Phase 3: Shared Point Bar Implementation

### Task 3: Refactor Point Buttons to Shared Bar

**Files:**
- Modify: `src/components/scoreBoard.tsx:186-248`

- [ ] **Step 1: Replace participant loop with single shared bar**

Find the renderPointButtons function (around line 186) and replace the entire function with:
```tsx
  const renderPointButtons = useCallback(() => {
    if (selectedParticipantId === null) {
      return (
        <div className="text-center text-gray-500 text-sm py-4">
          Toca una tarjeta para agregar puntos
        </div>
      );
    }

    const cantos = [
      { label: "+1", pts: 1 },
      { label: "+2", pts: 2 },
      { label: "+3", pts: 3 },
      { label: "+4", pts: 4 },
      { label: "Patrulla", pts: 6 },
      { label: "Vigía", pts: 7 },
      { label: "Registro", pts: 12 },
    ];

    const color = getPlayerColor(selectedParticipantId, state.mode);
    const colorClass = colorClasses[color];
    const participantName = state.mode === "teams"
      ? state.teams.find((t) => t.id === selectedParticipantId)?.name || ""
      : state.players.find((p) => p.id === selectedParticipantId)?.name || "";

    return (
      <div className="space-y-3">
        <span className="text-xs font-semibold text-gray-600">
          Sumar a {participantName}:
        </span>
        <div
          className={`grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-1 md:gap-2 p-2 md:p-3 rounded border ${colorClass.buttonRow}`}
        >
          {cantos.slice(0, 4).map((canto) => (
            <Button
              key={canto.pts}
              variant="secondary"
              className={`h-12 md:h-14 lg:h-16 text-lg md:text-xl lg:text-2xl font-bold shadow-md hover:shadow-lg transition-colors ${colorClass.secondaryButton}`}
              onClick={() => {
                onAddPoints(selectedParticipantId, canto.pts);
                setSelectedParticipantId(null);
              }}
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
              onClick={() => {
                onAddPoints(selectedParticipantId, canto.pts);
                setSelectedParticipantId(null);
              }}
            >
              {canto.label}
            </Button>
          ))}
          <Button
            variant="outline"
            className="h-9 md:h-11 lg:h-12 text-xs md:text-sm lg:text-base border-pink-300 bg-pink-50/80 hover:bg-pink-100/80 transition-colors text-pink-600"
            onClick={() => {
              setSelectedPlayerId(selectedParticipantId);
              setCustomPointsOpen(true);
              setSelectedParticipantId(null);
            }}
          >
            Custom
          </Button>
        </div>
      </div>
    );
  }, [selectedParticipantId, state.mode, state.teams, state.players, onAddPoints, setSelectedPlayerId, setCustomPointsOpen]);
```

- [ ] **Step 2: Verify the change**

Run: `git diff src/components/scoreBoard.tsx`
Expected: Shows renderPointButtons function replaced with shared bar implementation

- [ ] **Step 3: Commit**

```bash
git add src/components/scoreBoard.tsx
git commit -m "feat: replace per-participant point bars with shared POS-style bar"
```

---

## Phase 4: Layout Positioning

### Task 4: Position Shared Point Bar at Bottom

**Files:**
- Modify: `src/components/scoreBoard.tsx:318-342`

- [ ] **Step 1: Move point bar to bottom of layout**

Find the main return statement and ensure the point bar (renderPointButtons) is positioned at the bottom, just before the modals. The layout should be:
```tsx
  return (
    <div className="flex flex-col h-screen max-w-md md:max-w-2xl lg:max-w-4xl mx-auto p-4 md:p-6 lg:p-8 justify-between bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-gray-800 select-none overflow-y-auto">
      {/* Control buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-2 md:mb-4">
        {/* ... existing control buttons ... */}
      </div>

      {/* Player cards */}
      {renderPlayers()}

      {/* Winner card or point bar */}
      {state.isFinished ? (
        {/* ... existing winner card ... */}
      ) : (
        renderPointButtons()
      )}

      {/* Modals */}
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
```

- [ ] **Step 2: Verify the change**

Run: `git diff src/components/scoreBoard.tsx`
Expected: Shows point bar positioned at bottom of layout

- [ ] **Step 3: Commit**

```bash
git add src/components/scoreBoard.tsx
git commit -m "feat: position shared point bar at bottom of layout"
```

---

## Phase 5: Testing and Verification

### Task 5: Test POS-Style Interaction

**Files:**
- Test: Manual testing with dev server

- [ ] **Step 1: Start development server**

Run: `npm run dev`
Expected: Development server starts successfully

- [ ] **Step 2: Test card selection**

Test: Tap on a player/team card
Expected: Card shows visual feedback (ring and scale), point bar appears with participant name

- [ ] **Step 3: Test point addition**

Test: Tap on a point value button (+1, +2, etc.)
Expected: Points are added to selected participant, card is deselected, point bar shows "Toca una tarjeta para agregar puntos"

- [ ] **Step 4: Test selection change**

Test: Tap on one card, then tap on another card
Expected: Selection changes to new card without needing to deselect first

- [ ] **Step 5: Test custom points**

Test: Select card, tap "Custom" button
Expected: Custom points modal opens with correct participant name

- [ ] **Step 6: Test all game modes**

Test: 2 players, 3 players, 4 players, teams mode
Expected: Card selection and point addition works correctly in all modes

- [ ] **Step 7: Test winner state**

Test: Complete a game to reach winner state
Expected: Winner card appears instead of point bar (existing behavior maintained)

- [ ] **Step 8: Test control buttons**

Test: All control buttons (Reiniciar Puntos, Nueva Serie, Nueva Partida, Deshacer)
Expected: All control buttons work as before (existing behavior maintained)

- [ ] **Step 9: Commit testing verification**

```bash
git add .
git commit -m "test: verify POS-style interaction works across all game modes"
```

---

## Phase 6: Documentation Update

### Task 6: Update README with New Interaction Pattern

**Files:**
- Modify: `README.md:51-59`

- [ ] **Step 1: Update usage section**

Find the usage section and update:
```markdown
## Uso

1. **Configurar partida**: Al iniciar la aplicación, selecciona el modo de juego y asigna nombres a los jugadores/equipos
2. **Registrar puntos**: 
   - Toca la tarjeta del jugador/equipo al que quieres sumar puntos
   - Selecciona el valor de puntos en la barra inferior compartida
   - La tarjeta se deselecciona automáticamente después de agregar puntos
3. **Gestionar partidas**:
   - Reiniciar puntos de la partida actual
   - Iniciar nueva serie (mantiene victorias)
   - Nueva partida (reinicia todo)
4. **Deshacer**: Revierte la última acción de puntuación
```

- [ ] **Step 2: Verify the change**

Run: `git diff README.md`
Expected: Shows updated usage section with POS-style interaction description

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: update usage section with POS-style interaction pattern"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- ✅ Selection state management (Task 1)
- ✅ Card click interaction with visual feedback (Task 2)
- ✅ Shared point bar replacing per-participant bars (Task 3)
- ✅ Point bar positioned at bottom (Task 4)
- ✅ Automatic deselection after point addition (Task 3)
- ✅ Selection change without cancellation (Task 2)
- ✅ Testing across all modes (Task 5)
- ✅ Documentation update (Task 6)

**2. Placeholder scan:**
- ✅ No TBD/TODO placeholders found
- ✅ All code steps contain actual implementation
- ✅ All commands are exact with expected outputs
- ✅ No "similar to previous task" references

**3. Type consistency:**
- ✅ State variable names consistent throughout
- ✅ Function signatures match existing patterns
- ✅ Color class usage matches existing patterns
- ✅ File paths are consistent throughout

---

## Summary

This plan implements POS-style point addition with:
- Single shared point bar at bottom replacing per-participant bars
- Card-based selection with visual feedback (ring and scale)
- Automatic deselection after point addition
- Seamless selection change without cancellation
- Maintains all existing control buttons and functionality
- Cleaner interface with better use of touch targets

The implementation provides a more intuitive POS-like interaction while maintaining all existing game functionality.
