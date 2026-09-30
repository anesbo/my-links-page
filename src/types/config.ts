// ─── Core Configuration Types ───────────────────────────────────────────────

export type SocialPlatform =
  | "github"
  | "twitter"
  | "linkedin"
  | "youtube"
  | "instagram"
  | "discord"
  | "email"
  | "tiktok"
  | "website";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  iconColor?: string;
}

export type SocialLayoutStyle = "minimal" | "pill" | "floating";

export type FontFamily =
  | "sans"
  | "serif"
  | "mono"
  | "display"
  | "rounded"
  | "poppins"
  | "syne"
  | "handwritten"
  | "bricolage"
  | "bebas"
  | "cinzel";

export type BackgroundType =
  | "solid"
  | "linear-gradient"
  | "radial-gradient"
  | "mesh"
  | "image";

export interface GradientStop {
  color: string;
  position: number; // 0-100
}

export type ShapesStyle =
  | "blobs"
  | "circles"
  | "squares"
  | "diamonds"
  | "triangles"
  | "stars"
  | "rings"
  | "geometric"
  | "bokeh"
  | "grid";

export type ShapesSpeed = "slow" | "normal" | "fast" | "static";

export interface BackgroundConfig {
  type: BackgroundType;
  solidColor: string;
  gradientAngle: number;
  gradientStops: GradientStop[];
  meshColors: string[];
  // Background image options
  imageUrl: string;
  imageOpacity: number; // 0-100
  imageBlur: number; // 0-25 px
  imageOverlayColor: string;
  imageOverlayOpacity: number; // 0-100
  imageFit: "cover" | "contain" | "repeat";
  imagePosition: "center" | "top" | "bottom";
  // Floating / decorative shapes
  shapesEnabled: boolean;
  shapesStyle: ShapesStyle;
  shapesOpacity: number; // 0-100
  shapesColor: string;
  shapesSpeed: ShapesSpeed;
  shapesCount?: number; // 1 to 20 shapes
}

export type SurfaceTreatment =
  | "solid"
  | "glass"
  | "liquid-glass"
  | "neumorphic"
  | "outline";

export type HoverEffect = "lift" | "scale" | "glow" | "shake" | "shine";

export type LinkShadow = "none" | "subtle" | "glow" | "elevated" | "heavy";

export type GlowMode = "always" | "hover" | "both";

export interface LinkStyle {
  cornerRadius: number; // 0 to 9999
  borderWidth: number;
  borderColor: string;
  surfaceTreatment: SurfaceTreatment;
  surfaceColor: string;
  surfaceOpacity: number; // 0-100 for glass translucency
  glassBlur?: number; // 0 to 50 px backdrop blur
  glassGloss?: number; // 0 to 100% specular glass reflection & refraction
  hoverEffect: HoverEffect;
  textColor: string;
  subtextColor: string;
  iconColor: string;
  shadow: LinkShadow;
  liquidGlassGleam?: boolean;
  badgeStyle?: "pill" | "solid" | "glow" | "outline";
  // Capsule Glow customization
  glowEnabled?: boolean;
  glowColor?: string;
  glowRadius?: number; // 0 to 100 px ("too much or little")
  glowSpread?: number; // 0 to 30 px
  glowOpacity?: number; // 0 to 100%
  glowMode?: GlowMode; // "always" | "hover" | "both"
  glowPulse?: boolean;
}

export type LucideIconName = string;

export interface BioLink {
  id: string;
  title: string;
  url: string;
  subtitle?: string;
  icon?: LucideIconName;
  badge?: string;
  badgeColor?: string;
  badgeBgColor?: string;
  clicks: number;
  enabled: boolean;
}

export type AvatarShape =
  | "circle"
  | "rounded-square"
  | "square"
  | "hexagon"
  | "octagon";

export type AvatarBorderStyle = "solid" | "dashed" | "double" | "glow";

export interface IdentityConfig {
  avatarUrl: string;
  displayName: string;
  subtitle: string;
  verified: boolean;
  socialLinks: SocialLink[];
  socialLayoutStyle: SocialLayoutStyle;
  // Profile picture customization
  avatarShape: AvatarShape;
  avatarSize: number; // 64 to 130
  avatarBorderWidth: number; // 0 to 8
  avatarBorderColor: string;
  avatarBorderStyle: AvatarBorderStyle;
  avatarGlow: boolean;
  avatarGlowColor: string;
  avatarGlowRadius: number; // 0 to 100 px
  avatarGlowSpread?: number; // 0 to 30 px
  avatarGlowOpacity?: number; // 0 to 100%
  avatarGlowPulse: boolean;
}

export interface ThemeConfig {
  background: BackgroundConfig;
  fontFamily: FontFamily;
  fontScale: number; // 0.8 to 1.4
  headingColor: string;
  bioTextColor: string;
  // Page Layout & Spacing
  pagePaddingTop?: number; // 12 to 120 px
  pagePaddingBottom?: number; // 12 to 120 px
  pagePaddingX?: number; // 8 to 48 px
  pageMaxWidth?: number; // 360 to 720 px
  capsuleSpacing?: number; // 6 to 32 px
}

export interface AnalyticsConfig {
  showClickCounts: boolean;
}

export interface FooterConfig {
  enabled: boolean;
  text: string;
  subtext: string;
  textColor: string;
  fontSize: number; // 0.7 to 1.3
  alignment: "center" | "left" | "right";
  spaceBottom: number; // 16 to 120
  showPoweredBy: boolean;
}

export interface BioConfig {
  identity: IdentityConfig;
  theme: ThemeConfig;
  linkStyle: LinkStyle;
  links: BioLink[];
  analytics: AnalyticsConfig;
  footer: FooterConfig;
}

// ─── Preset Templates Types ─────────────────────────────────────────────────

export type TemplateCategory =
  | "All"
  | "Modern"
  | "Aesthetic"
  | "Dark/Cyber"
  | "Minimal"
  | "Luxury"
  | "Vibrant"
  | "Nature";

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  accentColor: string;
  previewGradient: string;
  badge?: string;
  config: {
    theme: Partial<ThemeConfig>;
    identity?: Partial<IdentityConfig>;
    linkStyle: Partial<LinkStyle>;
    footer?: Partial<FooterConfig>;
  };
}
