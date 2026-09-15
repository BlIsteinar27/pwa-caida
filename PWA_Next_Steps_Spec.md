# PWA Caida - Especificación de Próximos Pasos

## Problemas Identificados

### 1. Redundancia de Funcionalidad: "Reiniciar" vs "Nueva Serie"

**Estado Actual:**

- **Botón "Nueva Serie"**: Llama a `handleReset()` → `confirmResetSeries()` → `onShowSetup()`
- **Botón "Reiniciar"**: Llama directamente a `onReset()` → dispatch `RESET_ALL`

**Problema:** Ambos botones parecen realizar acciones similares desde la perspectiva del usuario.

**Propuesta de Diferenciación:**

#### Opción A: Diferenciación por Alcance

- **"Nueva Serie"**: Reinicia partidas pero MANTIENE:
  - Configuración de jugadores/equipos
  - Historial de victorias acumuladas
  - Solo reinicia puntajes de la partida actual
  - Muestra modal de configuración para permitir cambios

- **"Reiniciar"**: Reinicia TODO:
  - Configuración de jugadores/equipos
  - Historial de victorias
  - Puntajes actuales
  - Vuelve al estado inicial de la aplicación
  - No muestra modal de configuración

#### Opción B: Diferenciación por Flujo

- **"Nueva Serie"**: Reinicia puntajes actuales para comenzar nueva partida
  - Mantiene configuración de jugadores
  - Mantiene victorias acumuladas
  - No muestra modal (acción rápida)
  - Ideal para continuar sesión de juego

- **"Reiniciar Configuración"**: Reinicia completamente la aplicación
  - Vuelve a modal de configuración inicial
  - Pierde todo el progreso
  - Cambia modo de juego si es necesario
  - Ideal para empezar una sesión completamente nueva

**Recomendación:** Opción A con mejor UX:

- Cambiar texto de "Reiniciar" a "Reiniciar Todo"
- Cambiar texto de "Nueva Serie" a "Nueva Partida"
- Actualizar mensajes de confirmación para reflejar la diferencia

---

### 2. Personalización de SweetAlert2 - Espaciado de Botones

**Problema:** Los botones de confirmación en SweetAlert2 están pegados, falta espaciado entre ellos.

**Solución Requerida:**
Consultar documentación de SweetAlert2: https://sweetalert2.github.io/#examples

**Implementación:**

1. Agregar estilos personalizados para espaciado entre botones
2. Actualizar `src/utils/confirmations.ts` con nuevos estilos
3. Aplicar consistencia con el tema glassmorphism/pastel actual

**Código sugerido (basado en docs SweetAlert2):**

```typescript
export const confirmResetSeries = async (): Promise<boolean> => {
  const result = await Swal.fire({
    title: "¿Reiniciar serie?",
    text: "Se perderán todas las victorias acumuladas",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, reiniciar",
    cancelButtonText: "Cancelar",
    customClass: {
      popup:
        "bg-white/90 backdrop-blur-md border border-purple-200 rounded-lg shadow-xl",
      title: "text-gray-800 font-bold text-lg",
      htmlContainer: "text-gray-600",
      confirmButton:
        "bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded mx-2",
      cancelButton:
        "bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mx-2",
      actions: "gap-2", // Agregar espaciado entre botones
    },
    buttonsStyling: false,
  });
  return result.isConfirmed;
};
```

---

## Próximos Pasos Prioritarios

### 1. ✅ Diferenciar Funcionalidad de Botones (COMPLETADO)

- [x] Implementar diferenciación según especificación del usuario
- [x] **"Reiniciar Puntos"**: Mantiene config y serie, solo reinicia puntos
- [x] **"Nueva Serie"**: Mantiene config, reinicia puntos y serie (victorias/derrotas)
- [x] **"Nueva Partida"**: Reinicia puntos, serie y config
- [x] Agregar nuevos actions al reducer: `RESET_POINTS` y `RESET_SERIES`
- [x] Actualizar textos de botones en `scoreBoard.tsx`
- [x] Actualizar props y handlers en `App.tsx`
- [x] Crear nueva función de confirmación `confirmResetPoints`

### 2. ✅ Personalizar SweetAlert2 (COMPLETADO)

- [x] Consultar documentación SweetAlert2 para espaciado
- [x] Actualizar estilos en `confirmations.ts` con tema glassmorphism
- [x] Agregar espaciado entre botones: `gap-2 flex flex-row-reverse`
- [x] Actualizar colores para consistencia con tema pastel
- [x] Actualizar los tres modales de confirmación:
  - `confirmResetPoints` (púrpura)
  - `confirmResetSeries` (rojo)
  - `confirmResetAll` (rojo)

### 3. 🟡 Configuración PWA (Media Prioridad - Usuario lo hará)

- [ ] Crear `manifest.json` con metadatos PWA
- [ ] Configurar Service Worker para cache offline
- [ ] Instalar y configurar `vite-plugin-pwa`
- [ ] Implementar estrategia cache-first para offline
- [ ] Agregar iconos PWA
- [ ] Probar instalación en dispositivo móvil
- [ ] Verificar funcionalidad offline completa

### 4. 🟢 Mejoras UX Opcionales (Baja Prioridad)

- [ ] Agregar animaciones de transición entre partidas
- [ ] Implementar modo oscuro/claro toggle
- [ ] Agregar sonidos para acciones de juego
- [ ] Historial de partidas pasadas
- [ ] Estadísticas de jugadores

---

## Especificación Técnica para SweetAlert2

### Estilos Actuales (Obscuros - Desactualizados)

```typescript
customClass: {
  popup: "bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl",
  title: "text-white font-bold text-lg",
  htmlContainer: "text-zinc-300",
  confirmButton: "bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded",
  cancelButton: "bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded",
}
```

### Estilos Nuevos (Glassmorphism/Pastel - Consistentes)

```typescript
customClass: {
  popup: "bg-white/90 backdrop-blur-md border border-purple-200 rounded-lg shadow-xl",
  title: "text-gray-800 font-bold text-lg",
  htmlContainer: "text-gray-600",
  confirmButton: "bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded mx-2",
  cancelButton: "bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mx-2",
  actions: "gap-2 flex flex-row-reverse", // Espaciado y orden correcto
}
```

### Propiedades SweetAlert2 Revisar

- `customClass.actions` - Para espaciado entre botones
- `reverseButtons` - Para orden de botones (opcional)
- `padding` - Para espaciado general del modal
- `width` - Para ancho consistente

---

## Notas de Implementación

1. **Consistencia de Tema:** Todos los modales deben seguir el mismo tema glassmorphism/pastel que la interfaz principal
2. **Accesibilidad:** Mantener contraste adecuado en textos y botones
3. **Responsive:** Verificar que modales funcionen bien en dispositivos móviles
4. **Performance:** SweetAlert2 ya está instalado, solo requiere configuración de estilos

---

## Checklist de Verificación

### Diferenciación de Botones

- [ ] Usuario entiende claramente la diferencia entre acciones
- [ ] Textos de botones son descriptivos
- [ ] Mensajes de confirmación reflejan el alcance
- [ ] No hay redundancia funcional

### SweetAlert2

- [ ] Botones tienen espaciado adecuado
- [ ] Colores son consistentes con tema actual
- [ ] Modal tiene glassmorphism correcto
- [ ] Funciona en móvil y desktop
- [ ] Accesibilidad mantenida

### PWA (Cuando usuario lo implemente)

- [ ] Manifest.json completo
- [ ] Service Worker funcional
- [ ] Cache strategy implementada
- [ ] Funciona offline completamente
- [ ] Instalable en móvil
- [ ] Iconos y splash screen configurados
