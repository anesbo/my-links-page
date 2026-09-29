import {
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  MessageCircle,
  Mail,
  Music2,
  Globe,
  FileText,
  Play,
  Code2,
  Calendar,
  Link2,
  ExternalLink,
  Star,
  Heart,
  Zap,
  Rocket,
  Camera,
  Mic,
  Headphones,
  BookOpen,
  PenTool,
  Coffee,
  ShoppingBag,
  Download,
  MessageSquare,
  Video,
  Image,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { SocialPlatform } from "@/types/config";

export const SOCIAL_ICONS: Record<SocialPlatform, LucideIcon> = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  instagram: Instagram,
  discord: MessageCircle,
  email: Mail,
  tiktok: Music2,
  website: Globe,
};

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  github: "GitHub",
  twitter: "X / Twitter",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  instagram: "Instagram",
  discord: "Discord",
  email: "Email",
  tiktok: "TikTok",
  website: "Website",
};

export const LINK_ICONS: Record<string, LucideIcon> = {
  Globe: Globe,
  FileText: FileText,
  Play: Play,
  Code2: Code2,
  Calendar: Calendar,
  Link2: Link2,
  ExternalLink: ExternalLink,
  Star: Star,
  Heart: Heart,
  Zap: Zap,
  Rocket: Rocket,
  Camera: Camera,
  Mic: Mic,
  Headphones: Headphones,
  BookOpen: BookOpen,
  PenTool: PenTool,
  Coffee: Coffee,
  ShoppingBag: ShoppingBag,
  Download: Download,
  MessageSquare: MessageSquare,
  Video: Video,
  Image: Image,
  Github: Github,
  Youtube: Youtube,
  Instagram: Instagram,
  Twitter: Twitter,
  Sparkles: Sparkles,
};

export const AVAILABLE_ICONS = Object.keys(LINK_ICONS);

export function getLinkIcon(name?: string): LucideIcon {
  if (name && LINK_ICONS[name]) return LINK_ICONS[name];
  return Link2;
}
