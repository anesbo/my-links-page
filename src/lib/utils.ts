import { BackgroundConfig, FontFamily, AvatarShape } from "@/types/config";

export function getBackgroundStyle(bg: BackgroundConfig): React.CSSProperties {
  switch (bg.type) {
    case "solid":
      return { backgroundColor: bg.solidColor };
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
        backgroundColor: bg.meshColors[0] || "#0f0f23",
      };
    case "image":
      return {
        backgroundColor: bg.solidColor || "#0d0d1a",
      };
    default:
      return { backgroundColor: bg.solidColor };
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
      return "font-display";
    case "rounded":
      return "font-rounded";
    case "poppins":
      return "font-poppins";
    case "syne":
      return "font-syne";
    case "handwritten":
      return "font-handwritten";
    case "bricolage":
      return "font-bricolage";
    case "bebas":
      return "font-bebas";
    case "cinzel":
      return "font-cinzel";
    default:
      return "font-sans";
  }
}

export function getFontFamilyLabel(font: FontFamily): string {
  switch (font) {
    case "sans":
      return "Inter (Modern Sans)";
    case "display":
      return "Outfit (Tech Display)";
    case "rounded":
      return "Plus Jakarta (Clean Rounded)";
    case "poppins":
      return "Poppins (Geometric)";
    case "syne":
      return "Syne (Avant-Garde)";
    case "serif":
      return "Playfair (Luxury Serif)";
    case "cinzel":
      return "Cinzel (Classical Roman)";
    case "mono":
      return "JetBrains (Cyber Mono)";
    case "bricolage":
      return "Bricolage (Bold Expressive)";
    case "bebas":
      return "Bebas Neue (Punchy Caps)";
    case "handwritten":
      return "Caveat (Signature Script)";
    default:
      return "Inter";
  }
}

export function getAvatarShapeStyle(shape: AvatarShape): React.CSSProperties {
  switch (shape) {
    case "circle":
      return { borderRadius: "9999px" };
    case "rounded-square":
      return { borderRadius: "24%" };
    case "square":
      return { borderRadius: "6px" };
    case "hexagon":
      return {
        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        borderRadius: "0px",
      };
    case "octagon":
      return {
        clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
        borderRadius: "0px",
      };
    default:
      return { borderRadius: "9999px" };
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
