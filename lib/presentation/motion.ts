export const motion = { maxStagger: 6 } as const;
export function stagger(index: number) {
  return {
    "--reveal-delay": `calc(var(--motion-stagger) * ${Math.min(Math.max(index, 0), motion.maxStagger)})`,
  } as React.CSSProperties & { "--reveal-delay": string };
}
