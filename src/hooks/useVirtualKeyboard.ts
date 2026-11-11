import { useEffect, useState } from "react";

// Alturas menores suelen ser chrome del navegador (barra de URL), no teclado
const KEYBOARD_THRESHOLD_PX = 100;
// Espera a que termine la animación de apertura del teclado antes de scrollear
const SCROLL_DELAY_MS = 350;

const EDITABLE_SELECTOR = "input, textarea, [contenteditable='true']";

export interface VirtualKeyboardState {
  isOpen: boolean;
  height: number;
}

/**
 * Detecta el teclado virtual en móviles/tablets vía la API VisualViewport.
 *
 * Contexto: desde Chrome 108, tanto Android Chrome como iOS Safari solo
 * redimensionan el *visual* viewport al abrir el teclado — `window.innerHeight`,
 * `dvh` y `position: fixed` no cambian, así que UI fija (diálogos, barras
 * inferiores) queda oculta detrás del teclado.
 *
 * El hook publica `--keyboard-height` en `:root` para que cualquier componente
 * compense vía CSS sin re-renders, y devuelve `{ isOpen, height }` por si se
 * necesita en JS. También hace scrollIntoView del elemento editable enfocado.
 */
export function useVirtualKeyboard(): VirtualKeyboardState {
  const [state, setState] = useState<VirtualKeyboardState>({
    isOpen: false,
    height: 0,
  });

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const root = document.documentElement;

    const scrollFocusedIntoView = () => {
      const el = document.activeElement;
      if (el instanceof HTMLElement && el.matches(EDITABLE_SELECTOR)) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    };

    const measure = () => {
      const height = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      );
      const isOpen = height > KEYBOARD_THRESHOLD_PX;

      setState((prev) =>
        prev.isOpen === isOpen && prev.height === height
          ? prev
          : { isOpen, height },
      );
      root.style.setProperty("--keyboard-height", `${isOpen ? height : 0}px`);
    };

    const onResize = () => {
      measure();
      scrollFocusedIntoView();
    };

    const onFocusIn = (event: FocusEvent) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.matches(EDITABLE_SELECTOR)
      ) {
        window.setTimeout(scrollFocusedIntoView, SCROLL_DELAY_MS);
      }
    };

    viewport.addEventListener("resize", onResize);
    viewport.addEventListener("scroll", measure);
    document.addEventListener("focusin", onFocusIn);
    measure();

    return () => {
      viewport.removeEventListener("resize", onResize);
      viewport.removeEventListener("scroll", measure);
      document.removeEventListener("focusin", onFocusIn);
      root.style.removeProperty("--keyboard-height");
    };
  }, []);

  return state;
}
