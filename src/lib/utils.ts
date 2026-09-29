import { BackgroundConfig, FontFamily } from "@/types/config";

export function getBackgroundStyle(bg: BackgroundConfig): React.CSSProperties {
  switch (bg.type) {
    case "solid":
      return { background: bg.solidColor };
    case "linear-gradient": {
      const stops = bg.gradientStops
        .map((s) => `${s.color} ${s.position}%`)
        .join(", ");
      return {
        background: `linear-gradient(${bg.gradientAngle}deg, ${stops})`,
      };
    }
    case "radial-gradient": {
      const stops = bg.gradientStops
        .map((s) => `${s.color} ${s.position}%`)
        .join(", ");
      return {
        background: `radial-gradient(ellipse at center, ${stops})`,
      };
    }
    case "mesh":
      return {
        background: bg.meshColors[0] || "#0f0f23",
      };
    default:
      return { background: bg.solidColor };
  }
}

export function getFontClass(font: FontFamily): string {
  switch (font) {
    case "sans":
      return "font-sans";
    case "serif":
      return "font-serif";
    case "mono":
      return "font-mono";
    case "display":
      return "font-sans tracking-tight";
    default:
      return "font-sans";
  }
}

export function getFontFamilyLabel(font: FontFamily): string {
  switch (font) {
    case "sans":
      return "Modern Sans";
    case "serif":
      return "Elegant Serif";
    case "mono":
      return "Monospace";
    case "display":
      return "Tech Display";
    default:
      return "Modern Sans";
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
