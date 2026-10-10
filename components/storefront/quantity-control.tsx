"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityControl({
  value,
  label,
  onAdjust,
}: {
  value: number;
  label: string;
  onAdjust: (delta: number) => void;
}) {
  return (
    <div
      role="group"
      aria-label={`Quantity of ${label}`}
      className="inline-flex h-11 shrink-0 items-center border bg-background"
    >
      <button
        type="button"
        className="icon-action grid size-11 place-items-center disabled:opacity-30"
        disabled={value <= 1}
        aria-label={`Decrease quantity of ${label}`}
        onClick={() => onAdjust(-1)}
      >
        <Minus size={14} />
      </button>
      <output
        aria-live="polite"
        aria-atomic="true"
        className="min-w-7 text-center text-sm tabular-nums"
      >
        {value}
      </output>
      <button
        type="button"
        className="icon-action grid size-11 place-items-center disabled:opacity-30"
        disabled={value >= 10}
        aria-label={`Increase quantity of ${label}`}
        onClick={() => onAdjust(1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
