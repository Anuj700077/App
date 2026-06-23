export const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const RADIUS = { sm: 6, md: 12, lg: 20, pill: 999 };

export const lightColors = {
  surface: "#EAF4FB",
  onSurface: "#0A2540",
  surfaceSecondary: "#FFFFFF",
  onSurfaceSecondary: "#0A2540",
  surfaceTertiary: "#D6EAF5",
  onSurfaceTertiary: "#3A5066",
  surfaceInverse: "#0A2540",
  onSurfaceInverse: "#EAF4FB",
  brand: "#0288D1",
  onBrand: "#FFFFFF",
  brandTertiary: "#CDE6F4",
  onBrandTertiary: "#0288D1",
  brandSecondary: "#4FC3F7",
  border: "#C9DCE8",
  divider: "#D6E5EE",
  muted: "#6B7C8C",
  error: "#E76F51",
  success: "#2A9D8F",
  warning: "#F4A261",
  shadow: "rgba(2,40,80,0.10)",
  scrim: "rgba(10,37,64,0.45)",
};

export const darkColors = {
  surface: "#061827",
  onSurface: "#E6F1F8",
  surfaceSecondary: "#0E2A40",
  onSurfaceSecondary: "#E6F1F8",
  surfaceTertiary: "#163A55",
  onSurfaceTertiary: "#9BB4C6",
  surfaceInverse: "#E6F1F8",
  onSurfaceInverse: "#061827",
  brand: "#4FC3F7",
  onBrand: "#061827",
  brandTertiary: "#0F3A55",
  onBrandTertiary: "#4FC3F7",
  brandSecondary: "#03A9F4",
  border: "#163A55",
  divider: "#163A55",
  muted: "#8AA3B6",
  error: "#E76F51",
  success: "#2A9D8F",
  warning: "#F4A261",
  shadow: "rgba(0,0,0,0.5)",
  scrim: "rgba(0,0,0,0.6)",
};

export type Theme = typeof lightColors;
