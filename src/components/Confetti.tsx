import { useMemo } from "react";
import type { CSSProperties } from "react";

const PARTICLE_COUNT = 80;

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
  "var(--accent)",
];

interface Particle {
  left: string;
  width: number;
  height: number;
  color: string;
  borderRadius: string;
  delay: string;
  duration: string;
  drift: string;
  swayDelay: string;
  swayDuration: string;
  rotate: string;
}

const createParticles = (): Particle[] =>
  Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const size = 6 + Math.random() * 6;
    const shape = Math.random();
    const swayDuration = 0.7 + Math.random() * 0.9;
    return {
      left: `${(Math.random() * 100).toFixed(2)}%`,
      width: size,
      // cuadrados, rectángulos finos y círculos
      height: shape < 0.5 ? size : shape < 0.8 ? size * 0.4 : size,
      color: COLORS[i % COLORS.length],
      borderRadius: shape >= 0.8 ? "50%" : "1px",
      delay: `${(Math.random() * 0.9).toFixed(2)}s`,
      duration: `${(2.4 + Math.random() * 1.6).toFixed(2)}s`,
      drift: `${(12 + Math.random() * 36).toFixed(0)}px`,
      // delay negativo: cada partícula arranca en un punto distinto del vaivén
      swayDelay: `${(-Math.random() * swayDuration).toFixed(2)}s`,
      swayDuration: `${swayDuration.toFixed(2)}s`,
      rotate: `${(360 + Math.random() * 720).toFixed(0)}deg`,
    };
  });

type SwayStyle = CSSProperties & {
  "--confetti-drift": string;
  "--confetti-sway-delay": string;
  "--confetti-sway-duration": string;
};

type FallStyle = CSSProperties & {
  "--confetti-delay": string;
  "--confetti-duration": string;
  "--confetti-rotate": string;
};

export function Confetti() {
  const particles = useMemo(() => createParticles(), []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 hidden overflow-hidden motion-safe:block"
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="animate-confetti-sway absolute top-0 block"
          style={
            {
              left: p.left,
              "--confetti-drift": p.drift,
              "--confetti-sway-delay": p.swayDelay,
              "--confetti-sway-duration": p.swayDuration,
            } as SwayStyle
          }
        >
          <span
            className="animate-confetti-fall block"
            style={
              {
                width: p.width,
                height: p.height,
                backgroundColor: p.color,
                borderRadius: p.borderRadius,
                "--confetti-delay": p.delay,
                "--confetti-duration": p.duration,
                "--confetti-rotate": p.rotate,
              } as FallStyle
            }
          />
        </span>
      ))}
    </div>
  );
}
