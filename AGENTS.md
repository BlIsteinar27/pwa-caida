# Reglas del proyecto

## Commits

- NUNCA mencionar en los mensajes de commit que el código fue generado o asistido por IA. Nada de "Generated with", "Co-Authored-By" con bots de IA, ni notas similares.
- Usar el formato de mensajes existente del repo: prefijo `feat:` / `fix:` / etc. seguido de una descripción en español enfocada en el "por qué" del cambio.

## Componentes UI

- Los componentes primitivos de `src/components/ui/` NO se modifican. Son la base del sistema de diseño; los cambios visuales o de comportamiento se hacen componiéndolos, no editándolos.
- Para crear componentes nuevos, se construyen a partir de los primitivos de `ui/` (vía props, `className` o composición), nunca duplicando su código.

## Base UI

- El proyecto usa `@base-ui/react`, NO Radix. La prop para renderizar un elemento/prop hijo personalizado es `render`, no `asChild`.
  ```tsx
  <DialogPrimitive.Close render={<Button variant="ghost" />} />
  ```

## Estilos

- Solo Tailwind CSS. No se escribe CSS plano en componentes ni archivos `.css` adicionales.
- EXCEPCIÓN: si es estrictamente necesario (algo que Tailwind no puede expresar), está autorizado el uso de CSS plano, pero como último recurso y justificado.

