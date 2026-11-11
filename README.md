# PWA Caida

Aplicación web progresiva (PWA) para llevar el puntaje del juego de cartas "Caida". Diseñada para funcionar en dispositivos móviles y de escritorio con persistencia de datos local.

## Características

- **Múltiples modos de juego**: 2 jugadores, 3 jugadores, 4 jugadores y modo equipos (2v2)
- **Sistema de puntuación**: Botones rápidos para los valores más comunes (+1, +2, +3, +4, Patrulla 6, Vigía 7, Registro 12)
- **Puntuación personalizada**: Teclado numérico para valores personalizados (1-24 puntos)
- **Persistencia de datos**: El estado del juego se guarda automáticamente en localStorage
- **Historial de acciones**: Función deshacer para revertir movimientos
- **Gestión de series**: Control de victorias y partidas
- **Interfaz responsive**: Diseño optimizado para móviles, tablets y escritorio con adaptación automática
- **Soporte tablet**: Layout optimizado 2-columnas con touch targets mejorados para tablets
- **Modo equipos**: Muestra nombres de jugadores por equipo
- **Modo oscuro**: Tema claro/oscuro con toggle persistente, detección de `prefers-color-scheme` y sin flash al cargar
- **Sistema de diseño por tokens**: Toda la UI usa tokens semánticos (`bg-card`, `text-foreground`, `bg-primary`, etc.) definidos en `index.css` con variantes claras y oscuras
- **Íconos Lucide**: Iconografía consistente basada en `lucide-react`
- **Accesibilidad**: Tarjetas seleccionables con teclado (Enter/Espacio), `aria-pressed`, focus visible y soporte para `prefers-reduced-motion`
- **Micro-interacciones**: Press-scale en controles, animación del puntaje al cambiar, display animado al teclear en el teclado numérico y entrada animada de la tarjeta de ganador
- **Celebración de victoria**: Lluvia de confeti (80 partículas, 100% CSS/Tailwind sin dependencias, vaivén + rotación + gravedad por partícula, respeta `prefers-reduced-motion`)
- **Manejo de teclado virtual**: Hook `useVirtualKeyboard` (API VisualViewport) + `interactive-widget=resizes-content` — los diálogos con inputs se mantienen visibles y scrolleables sobre el teclado en Android Chrome e iOS Safari
- **Layout adaptativo**: Los botones de la tarjeta de ganador se apilan automáticamente cuando no caben en pantallas angostas (`flex-wrap`)
- **Animaciones tipo acordeón**: En la configuración de partida, las filas de nombres y las secciones se expanden/colapsan suavemente al cambiar de modo (CSS `grid-template-rows` + transiciones, sin librerías de animación)
- **Diálogos de confirmación**: Prevención de acciones destructivas
- **Optimización de rendimiento**: React Compiler memoiza automáticamente componentes y cálculos para una experiencia fluida

## Tecnologías

- **React 19** con React Compiler
- **TypeScript** para tipado estático
- **Vite** como bundler
- **Tailwind CSS v4** para estilos (tokens en `@theme`)
- **Base UI** para componentes de interfaz
- **Lucide React** para íconos
- **tw-animate-css** para animaciones
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
2. **Registrar puntos**:
   - Toca la tarjeta del jugador/equipo al que quieres sumar puntos
   - Selecciona el valor de puntos en la barra inferior compartida
   - La tarjeta se deselecciona automáticamente después de agregar puntos
   - Toca la misma tarjeta nuevamente para deseleccionar sin agregar puntos
3. **Gestionar partidas**:
   - Reiniciar puntos de la partida actual
   - Iniciar nueva serie (mantiene victorias)
   - Nueva partida (reinicia todo)
4. **Deshacer**: Revierte la última acción de puntuación

## Estructura del proyecto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes UI base (button, card, dialog, input, badge)
│   ├── scoreBoard.tsx  # Tablero principal de puntuación
│   ├── GameSetupModal.tsx
│   ├── CustomPointsModal.tsx
│   ├── ConfirmDialog.tsx
│   ├── ModeSelector.tsx
│   ├── NameEditor.tsx
│   ├── NumericKeypad.tsx
│   ├── Confetti.tsx    # Lluvia de confeti al ganar partida
│   └── ThemeToggle.tsx # Toggle de modo claro/oscuro
├── reducers/           # Reducers de estado
│   └── gameReducer.ts  # Lógica del juego
├── hooks/              # Hooks personalizados
│   ├── useLocalStorage.ts
│   └── useVirtualKeyboard.ts # Detección de teclado virtual (VisualViewport)
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

## Tema claro/oscuro

El tema se alterna con el botón ☀️/🌙 en la esquina superior derecha y se persiste en localStorage con la clave `caida-theme`. Si no hay preferencia guardada, se usa `prefers-color-scheme` del sistema. La clase `.dark` se aplica en `<html>` antes del primer render para evitar flash de tema incorrecto.

## Teclado virtual en móvil

Desde Chrome 108, tanto Android como iOS solo redimensionan el **visual viewport** al abrir el teclado — `100dvh` y `position: fixed` no cambian, así que un diálogo centrado queda oculto detrás del teclado sin poder scrollearlo. La app lo resuelve en dos capas:

- **`interactive-widget=resizes-content`** en el meta viewport: Chrome Android redimensiona el layout completo y los diálogos se reposicionan solos
- **`useVirtualKeyboard`** (iOS y fallback): mide la altura cubierta vía `visualViewport` (`innerHeight − height − offsetTop`), publica `--keyboard-height` en `:root` para compensación por CSS, y hace `scrollIntoView` del input enfocado

## Optimizaciones de rendimiento

La aplicación implementa varias optimizaciones para garantizar una experiencia fluida:

- **React Compiler**: La memoización de componentes, valores y handlers es automática — `useMemo` solo se usa donde hace falta estabilidad de valores aleatorios (partículas del confeti)
- **Animaciones solo con CSS**: Todas las animaciones usan utilidades de Tailwind + `tw-animate-css` y transiciones CSS, sin librerías de animación en JS — bundle más ligero y animaciones aceleradas por GPU
- **Optimización de localStorage**: Las escrituras en storage se hacen con debounce vía `useLocalStorage` y el efecto de persistencia usa `useEffectEvent` (React 19.2)
- **Keys estables**: Las listas usan keys compuestos para evitar problemas de renderizado
- **TypeScript strict**: El proyecto compila con `strict: true` habilitado

## Despliegue

Para desplegar la aplicación, compila el proyecto y sube los archivos de la carpeta `dist` a tu servidor de hosting estático.

```bash
npm run build
```

## Licencia

Proyecto de código abierto.
