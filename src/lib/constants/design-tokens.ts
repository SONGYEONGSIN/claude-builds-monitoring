export const COLORS = {
  background: "#080e1d",
  surface: "#080e1d",
  surfaceBright: "#222c43",
  surfaceContainer: "#12192b",
  surfaceContainerLow: "#0c1324",
  surfaceContainerHigh: "#171f33",
  surfaceContainerHighest: "#1d253b",
  primary: "#3adffa",
  primaryDim: "#1ad0eb",
  secondary: "#699cff",
  tertiary: "#9bffce",
  tertiaryDim: "#58e7ab",
  error: "#ff716c",
  errorDim: "#d7383b",
  warning: "#f59e0b",
  onSurface: "#e0e5fb",
  onSurfaceVariant: "#a5aabf",
  outline: "#6f7588",
  outlineVariant: "#424859",
} as const;

export const STATUS_COLORS = {
  processing: COLORS.primary,
  idle: COLORS.onSurfaceVariant,
  success: COLORS.tertiary,
  alert: COLORS.error,
} as const;
