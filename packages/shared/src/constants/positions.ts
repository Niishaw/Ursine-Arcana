import type { Position } from "../types/taxonomy";

/**
 * Position display configuration
 */
export interface PositionOption {
  value: Position;
  label: string;
}

/**
 * All available position options (Grindr-style)
 * Requires POPIA special consent
 */
export const POSITION_OPTIONS: PositionOption[] = [
  { value: "top", label: "Top" },
  { value: "vers_top", label: "Vers Top" },
  { value: "versatile", label: "Versatile" },
  { value: "vers_bottom", label: "Vers Bottom" },
  { value: "bottom", label: "Bottom" },
  { value: "side", label: "Side" },
  { value: "no_response", label: "Prefer not to say" },
];

/**
 * Get display label for a position value
 */
export function getPositionLabel(value: Position): string {
  const option = POSITION_OPTIONS.find((p) => p.value === value);
  return option?.label ?? value;
}
