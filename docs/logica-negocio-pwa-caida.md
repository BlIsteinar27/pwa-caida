# Especificación de Lógica de Negocio: Marcador de Caídas (PWA Local)

## 1. Alcance y Principios de Diseño
* **Almacenamiento Local:** Persistencia 100% cliente utilizando `localStorage`. Cero dependencias de servidores externos o bases de datos remotas.
* **Marcador Puro:** El sistema funciona exclusivamente como un contador dinámico de alta velocidad. No valida la legalidad de las cartas, ni rastrea turnos, ni indica quién es "mano" o reparte.
* **Operación de Un Solo Toque:** Diseñado para registrar eventos táctiles de forma directa e inmediata.

---

## 2. Modalidades de Juego
El sistema soporta 4 modalidades de sesión:
1. **2 Jugadores (1v1):** Registro individual para 2 participantes.
2. **3 Jugadores (1v1v1):** Registro individual para 3 participantes.
3. **4 Jugadores (1v1v1v1):** Registro individual para 4 participantes.
4. **Equipos (2v2):** Registro consolidado para 2 equipos compuestos por 2 personas cada uno.

---

## 3. Reglas de Puntuación
* **Objetivo de Victoria:** El primer jugador o equipo en alcanzar o superar los **24 puntos** gana la partida.
* **Sistema de Transición:** Inexistente. El conteo es lineal y directo de 0 a 24 puntos (se prescinde del sistema tradicional de Buenas/Malas).
* **Acciones Rápidas (Cantos y Caídas):**
  * `+1 Punto`: Puntuación base / Caída estándar.
  * `+2 Puntos`: Ronda de 10 / Caída acumulada.
  * `+3 Puntos`: Ronda de 11.
  * `+4 Puntos`: Ronda de 12.
  * `Patrulla (+6 Puntos)`: Canto especial.
  * `Vigía (+7 Puntos)`: Canto especial.
  * `Registro (+12 Puntos)`: Canto máximo.

---

## 4. Ciclo de Vida de una Partida y la Serie

### Partida Individual
1. **Inicio:** Todos los participantes o equipos comienzan la partida con 0 puntos.
2. **Acumulación:** Cada toque en los botones de acción suma inmediatamente los puntos al contador del jugador objetivo.
3. **Fin de Partida:** 
   * Se activa automáticamente en cuanto `score >= 24`.
   * Se bloquea la suma de puntos en el tablero.
   * Se suma `+1` al contador global de victorias (`wins`) del ganador.
   * Se habilita el botón de "Siguiente Partida".

### Gestión de la Serie
* La **Serie** acumula el número de victorias ganadas por cada participante a lo largo del tiempo.
* No tiene límite de victorias predeterminado (registro indefinido).
* **Siguiente Partida:** Reinicia los puntos (`score = 0`) de todos los jugadores, pero mantiene los nombres y el contador de victorias (`wins`).
* **Reinicio Total / Configuración:** Permite descartar la Serie actual, cambiar de modalidad (ejemplo: pasar de 2 a 3 jugadores) y redefinir los nombres desde cero.

---

## 5. Control de Errores (Mecanismo de Undo)
* **Profundidad:** Registro de la última acción ejecutada (`lastAction`).
* **Comportamiento:**
  * Si el usuario comete un error táctil, presiona "Deshacer".
  * Se resta la cantidad exacta de puntos sumados en el último toque al jugador correspondiente.
  * En caso de revertir un punto que causó la victoria (`score >= 24`), se desbloquea el tablero y se resta la victoria sumada en la Serie.

---

## 6. Modelo de Estado de Referencia (TypeScript)

```typescript
type GameMode = '2p' | '3p' | '4p' | 'teams';

interface Player {
  id: number;
  name: string;
  score: number; // Rango: 0 a 24+
  wins: number;  // Contador de la Serie
}

interface HistoryLog {
  playerId: number;
  pointsAdded: number;
  wasMatchEnding: boolean;
}

interface GameState {
  mode: GameMode;
  players: Player[];
  history: HistoryLog[]; // Pila para soportes de Undo
  isFinished: boolean;
  winnerId: number | null;
}