# Diseño: Rediseño de Marcador PWA Caídas

**Fecha:** 2025-09-15  
**Objetivo:** Alinear el proyecto con la lógica de negocio y mejorar UX con interfaz 100% visual

## Problemas Identificados

1. **Falta de configuración de modo de juego** - No hay UI para seleccionar entre 2p, 3p, 4p, teams
2. **UX ineficiente para puntos personalizados** - No hay manera de agregar cantidades como 9 puntos sin múltiples clics
3. **Falta de implementación modo teams** - El código solo maneja jugadores individuales
4. **Falta de pantalla de configuración inicial** - No hay forma de definir nombres antes de comenzar

## Solución Propuesta

### 1. Modal de Configuración Inicial

**Componente:** `GameSetupModal`

**Funcionalidad:**
- Selector visual de modo de juego con tarjetas interactivas (2p, 3p, 4p, teams)
- Campos de nombres editables con botones para editar (no input directo)
- Validación de nombres (no vacíos)
- Botón "Iniciar Partida" para confirmar

**UX:**
- 100% visual, sin teclado
- Tarjetas grandes y táctiles para selección de modo
- Iconos visuales para cada modo de juego

### 2. Mecanismo de Puntos Personalizados

**Componente:** `CustomPointsModal`

**Funcionalidad:**
- Botón "Custom" adicional a los botones existentes (+1, +2, +3, +4, +6, +7, +12)
- Teclado numérico visual (0-9) para construir cualquier cantidad
- Botón grande "Agregar" para confirmar
- Validación de rango (1-24 puntos)

**UX:**
- 100% visual, sin teclado del teléfono
- Botones grandes y táctiles
- Display grande de la cantidad seleccionada

### 3. Implementación Modo Teams (2v2)

**Cambios en tipos:**
- Agregar tipo `Team` con 2 jugadores internos
- Modificar `GameState` para soportar equipos
- En modo teams, UI muestra 2 tarjetas de equipos en lugar de 4 jugadores

**Funcionalidad:**
- Puntuación consolidada por equipo
- Contador de victorias por equipo
- Botones de puntos funcionan por equipo

### 4. Confirmaciones con SweetAlert2

**Integración:**
- Usar SweetAlert2 para confirmaciones críticas
- Estilos personalizados con Tailwind CSS
- `buttonsStyling: false` para usar clases de Tailwind

**Casos de uso:**
- "Nueva Serie": Confirmación antes de perder victorias
- "Reiniciar": Confirmación antes de resetear todo

**Ejemplo de configuración:**
```javascript
Swal.fire({
  title: '¿Reiniciar serie?',
  text: 'Se perderán todas las victorias acumuladas',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Sí, reiniciar',
  cancelButtonText: 'Cancelar',
  customClass: {
    popup: 'bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl',
    title: 'text-white font-bold text-lg',
    content: 'text-zinc-300',
    confirmButton: 'bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded',
    cancelButton: 'bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded'
  },
  buttonsStyling: false
})
```

### 5. Flujo de Partidas

**Botones existentes modificados:**
- "Siguiente Partida": Mantiene nombres y modo, solo resetea puntos
- "Nueva Serie": Abre modal de configuración inicial
- "Reiniciar": Confirmación con SweetAlert2 antes de resetear todo

## Componentes a Crear/Modificar

### Nuevos Componentes
1. `GameSetupModal` - Modal de configuración inicial
2. `CustomPointsModal` - Modal para puntos personalizados
3. `ModeSelector` - Selector visual de modo de juego
4. `NameEditor` - Editor visual de nombres
5. `NumericKeypad` - Teclado numérico visual

### Componentes Modificados
1. `ScoreBoard` - Agregar botón "Custom", integrar modales
2. `gameReducer` - Soportar modo teams, nueva acción para configuración
3. `game.ts` (types) - Agregar tipos para equipos

## Flujo de Usuario

1. **Inicio de App:** Mostrar `GameSetupModal`
2. **Selección de Modo:** Usuario selecciona 2p, 3p, 4p, o teams
3. **Configuración de Nombres:** Usuario ingresa nombres visualmente
4. **Inicio de Partida:** Usuario confirma y comienza a jugar
5. **Durante Partida:** Usuario usa botones de cantos + botón "Custom" si necesario
6. **Fin de Partida:** Se muestra ganador, botón "Siguiente Partida"
7. **Nueva Serie:** Usuario puede iniciar nueva serie con "Nueva Serie"

## Requisitos Técnicos

- SweetAlert2 instalado y configurado
- Tailwind CSS para estilos
- React con TypeScript
- LocalStorage para persistencia
- Responsive design para móviles

## Restricciones

- Interfaz 100% visual (sin teclado del teléfono)
- Mantener botones existentes de cantos (+1, +2, +3, +4, +6, +7, +12)
- Compatibilidad con lógica de negocio existente
- Confirmaciones para acciones destructivas