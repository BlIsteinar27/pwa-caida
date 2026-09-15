# PWA Caida

Aplicación web progresiva (PWA) para llevar el puntaje del juego de cartas "Caida". Diseñada para funcionar en dispositivos móviles y de escritorio con persistencia de datos local.

## Características

- **Múltiples modos de juego**: 2 jugadores, 3 jugadores, 4 jugadores y modo equipos (2v2)
- **Sistema de puntuación**: Botones rápidos para los valores más comunes (+1, +2, +3, +4, Patrulla 6, Vigía 7, Registro 12)
- **Puntuación personalizada**: Teclado numérico para valores personalizados (1-24 puntos)
- **Persistencia de datos**: El estado del juego se guarda automáticamente en localStorage
- **Historial de acciones**: Función deshacer para revertir movimientos
- **Gestión de series**: Control de victorias y partidas
- **Interfaz responsive**: Diseño optimizado para móviles y tablets
- **Modo equipos**: Muestra nombres de jugadores por equipo
- **Diálogos de confirmación**: Prevención de acciones destructivas
- **Optimización de rendimiento**: Componentes memoizados y cálculos optimizados para una experiencia fluida

## Tecnologías

- **React 19** con React Compiler
- **TypeScript** para tipado estático
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **Base UI** para componentes de interfaz
- **vite-plugin-pwa** para funcionalidad PWA

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/BlIsteinar27/pwa-caida.git
cd pwa-caida

# Instalar dependencias
npm install
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## Uso

1. **Configurar partida**: Al iniciar la aplicación, selecciona el modo de juego y asigna nombres a los jugadores/equipos
2. **Registrar puntos**: Usa los botones de puntuación rápida o el teclado numérico para valores personalizados
3. **Gestionar partidas**:
   - Reiniciar puntos de la partida actual
   - Iniciar nueva serie (mantiene victorias)
   - Nueva partida (reinicia todo)
4. **Deshacer**: Revierte la última acción de puntuación

## Estructura del proyecto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes UI base
│   ├── scoreBoard.tsx  # Tablero principal de puntuación
│   ├── GameSetupModal.tsx
│   ├── CustomPointsModal.tsx
│   └── ConfirmDialog.tsx
├── reducers/           # Reducers de estado
│   └── gameReducer.ts  # Lógica del juego
├── hooks/              # Hooks personalizados
│   └── useLocalStorage.ts
├── types/              # Definiciones TypeScript
│   └── game.ts
├── utils/              # Utilidades
│   └── confirmations.ts
└── App.tsx             # Componente principal
```

## Estado del juego

El estado del juego incluye:

- Modo de juego seleccionado
- Nombres y puntuaciones de jugadores/equipos
- Historial de acciones
- Estado de finalización
- Contador de victorias

Los datos se persisten automáticamente en localStorage con la clave `caida-game-state`.

## Optimizaciones de rendimiento

La aplicación implementa varias optimizaciones para garantizar una experiencia fluida:

- **Componentes memoizados**: `ModeSelector`, `ScoreBoard`, `NameEditor`, y `NumericKeypad` usan `React.memo` para evitar re-renders innecesarios
- **useMemo para cálculos costosos**: Cálculos como nombres de jugadores y valores parseados se memoizan para evitar repetición
- **useCallback para handlers**: Funciones de evento se memoizan para estabilidad de referencias
- **Optimización de localStorage**: El estado se guarda solo cuando cambian datos relevantes, reduciendo escrituras en storage
- **Keys estables**: Las listas usan keys compuestos para evitar problemas de renderizado
- **Lazy de handlers**: Handlers vacíos se eliminan para evitar re-renders innecesarios

## Despliegue

Para desplegar la aplicación, compila el proyecto y sube los archivos de la carpeta `dist` a tu servidor de hosting estático.

```bash
npm run build
```

## Licencia

Proyecto de código abierto.
