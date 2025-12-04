/**
 * Ursine Arcana Color Palette
 *
 * PLACEHOLDER VALUES - See ADR 0005 for amendment process
 * These values will be replaced when final branding is provided.
 */

export const colors = {
  // Primary brand color
  primary: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280", // Main primary (placeholder: gray-500)
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },

  // Secondary brand color
  secondary: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6", // Main secondary (placeholder: blue-500)
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
  },

  // Accent color
  accent: {
    50: "#F5F3FF",
    100: "#EDE9FE",
    200: "#DDD6FE",
    300: "#C4B5FD",
    400: "#A78BFA",
    500: "#8B5CF6", // Main accent (placeholder: violet-500)
    600: "#7C3AED",
    700: "#6D28D9",
    800: "#5B21B6",
    900: "#4C1D95",
  },

  // Semantic colors
  success: {
    light: "#D1FAE5",
    main: "#10B981",
    dark: "#047857",
  },

  warning: {
    light: "#FEF3C7",
    main: "#F59E0B",
    dark: "#B45309",
  },

  error: {
    light: "#FEE2E2",
    main: "#EF4444",
    dark: "#B91C1C",
  },

  info: {
    light: "#DBEAFE",
    main: "#3B82F6",
    dark: "#1D4ED8",
  },

  // Background colors
  background: {
    primary: "#111827", // Main app background (dark mode)
    secondary: "#1F2937", // Cards, elevated surfaces
    tertiary: "#374151", // Inputs, subtle backgrounds
  },

  // Surface colors (for cards, modals, etc.)
  surface: {
    primary: "#1F2937",
    secondary: "#374151",
    elevated: "#4B5563",
  },

  // Text colors
  text: {
    primary: "#F9FAFB", // Main text (light on dark)
    secondary: "#D1D5DB", // Secondary text
    tertiary: "#9CA3AF", // Muted text
    inverse: "#111827", // Text on light backgrounds
  },

  // Border colors
  border: {
    light: "#374151",
    default: "#4B5563",
    dark: "#6B7280",
  },

  // Online status
  status: {
    online: "#10B981",
    away: "#F59E0B",
    offline: "#6B7280",
  },
} as const;

/**
 * Type for accessing color values
 */
export type Colors = typeof colors;

/**
 * Tailwind CSS color configuration for extending theme
 */
export const tailwindColors = {
  primary: colors.primary,
  secondary: colors.secondary,
  accent: colors.accent,
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
  info: colors.info,
  background: colors.background,
  surface: colors.surface,
  "text-color": colors.text,
  border: colors.border,
  status: colors.status,
};
