/**
 * Ursine Arcana Typography Configuration
 *
 * PLACEHOLDER VALUES - See ADR 0005 for amendment process
 * Using system fonts until final branding is provided.
 */

/**
 * Font family configuration
 * System fonts provide native look and fast loading
 */
export const fontFamily = {
  // Primary font for body text
  sans: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],

  // Monospace for code/technical content
  mono: [
    "SF Mono",
    "Monaco",
    "Inconsolata",
    "Fira Code",
    "Fira Mono",
    "Roboto Mono",
    "monospace",
  ],
} as const;

/**
 * Font size scale (in pixels, converted to rem in Tailwind)
 */
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
} as const;

/**
 * Font weight scale
 */
export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

/**
 * Line height scale
 */
export const lineHeight = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const;

/**
 * Letter spacing scale
 */
export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
} as const;

/**
 * Pre-defined text styles for common use cases
 */
export const textStyles = {
  // Headings
  h1: {
    fontSize: fontSize["4xl"],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
  },
  h2: {
    fontSize: fontSize["3xl"],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
  },
  h3: {
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
  },
  h4: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
  },

  // Body text
  body: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  bodySmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },

  // UI elements
  button: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
  },
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.tight,
  },
} as const;

/**
 * Tailwind CSS typography configuration
 */
export const tailwindTypography = {
  fontFamily: {
    sans: fontFamily.sans.join(", "),
    mono: fontFamily.mono.join(", "),
  },
  fontSize: {
    xs: [`${fontSize.xs}px`, { lineHeight: `${lineHeight.normal}` }],
    sm: [`${fontSize.sm}px`, { lineHeight: `${lineHeight.normal}` }],
    base: [`${fontSize.base}px`, { lineHeight: `${lineHeight.normal}` }],
    lg: [`${fontSize.lg}px`, { lineHeight: `${lineHeight.normal}` }],
    xl: [`${fontSize.xl}px`, { lineHeight: `${lineHeight.tight}` }],
    "2xl": [`${fontSize["2xl"]}px`, { lineHeight: `${lineHeight.tight}` }],
    "3xl": [`${fontSize["3xl"]}px`, { lineHeight: `${lineHeight.tight}` }],
    "4xl": [`${fontSize["4xl"]}px`, { lineHeight: `${lineHeight.tight}` }],
    "5xl": [`${fontSize["5xl"]}px`, { lineHeight: `${lineHeight.tight}` }],
  },
};
