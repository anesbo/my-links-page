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

export type FontFamily = "sans" | "serif" | "mono" | "display";

export type BackgroundType = "solid" | "linear-gradient" | "radial-gradient" | "mesh";

export interface GradientStop {
  color: string;
  position: number; // 0-100
}

export interface BackgroundConfig {
  type: BackgroundType;
  solidColor: string;
  gradientAngle: number;
  gradientStops: GradientStop[];
  meshColors: string[];
}

export type SurfaceTreatment = "solid" | "glass" | "neumorphic" | "outline";
export type HoverEffect = "lift" | "scale" | "glow" | "shake";

export interface LinkStyle {
  cornerRadius: number; // 0 to 9999
  borderWidth: number;
  borderColor: string;
  surfaceTreatment: SurfaceTreatment;
  surfaceColor: string;
  surfaceOpacity: number; // 0-100 for glass
  hoverEffect: HoverEffect;
  textColor: string;
  subtextColor: string;
  iconColor: string;
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
  clicks: number;
  enabled: boolean;
}

export interface IdentityConfig {
  avatarUrl: string;
  displayName: string;
  subtitle: string;
  verified: boolean;
  socialLinks: SocialLink[];
  socialLayoutStyle: SocialLayoutStyle;
}

export interface ThemeConfig {
  background: BackgroundConfig;
  fontFamily: FontFamily;
  fontScale: number; // 0.8 to 1.4
  headingColor: string;
  bioTextColor: string;
}

export interface AnalyticsConfig {
  showClickCounts: boolean;
}

export interface BioConfig {
  identity: IdentityConfig;
  theme: ThemeConfig;
  linkStyle: LinkStyle;
  links: BioLink[];
  analytics: AnalyticsConfig;
}
