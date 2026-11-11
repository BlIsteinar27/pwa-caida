import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "cn";

const THEME_KEY = "caida-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  const toggle = () => {
    const root = document.documentElement;
    // Suprime transiciones para que el cambio de tema no "mancha" la UI
    root.classList.add("no-transitions");
    const next = !dark;
    root.classList.toggle("dark", next);
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    setDark(next);
    // Fuerza un flush de estilos y restaura transiciones en el siguiente frame
    void getComputedStyle(root).opacity;
    requestAnimationFrame(() => root.classList.remove("no-transitions"));
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={dark}
      className="shrink-0"
    >
      <span className="relative block size-4">
        <Sun
          className={cn(
            "absolute inset-0 transition-[scale,opacity,filter] duration-300 motion-reduce:transition-none",
            dark
              ? "scale-100 opacity-100 blur-0"
              : "scale-25 opacity-0 blur-xs",
          )}
        />
        <Moon
          className={cn(
            "absolute inset-0 transition-[scale,opacity,filter] duration-300 motion-reduce:transition-none",
            dark
              ? "scale-25 opacity-0 blur-xs"
              : "scale-100 opacity-100 blur-0",
          )}
        />
      </span>
    </Button>
  );
}
