"use client";

import { useConfig } from "@/lib/config-context";
import StudioSection from "./StudioSection";
import {
  TextInput,
  Toggle,
  ButtonGroup,
  ColorPicker,
  Slider,
  Select,
} from "@/components/ui/FormControls";
import { User, Plus, Trash2, Sparkles } from "lucide-react";
import { SOCIAL_LABELS } from "@/lib/icons";
import {
  SocialPlatform,
  SocialLink,
  SocialLayoutStyle,
  AvatarShape,
  AvatarBorderStyle,
} from "@/types/config";
import { generateId } from "@/lib/utils";

const PLATFORMS: SocialPlatform[] = [
  "github",
  "twitter",
  "linkedin",
  "youtube",
  "instagram",
  "discord",
  "email",
  "tiktok",
  "website",
];

export default function IdentityPanel() {
  const { config, updateConfig } = useConfig();
  const { identity } = config;

  function updateIdentity<K extends keyof typeof identity>(
    key: K,
    value: (typeof identity)[K]
  ) {
    updateConfig((prev) => ({
      ...prev,
      identity: { ...prev.identity, [key]: value },
    }));
  }

  function updateSocial(id: string, updates: Partial<SocialLink>) {
    updateConfig((prev) => ({
      ...prev,
      identity: {
        ...prev.identity,
        socialLinks: prev.identity.socialLinks.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
      },
    }));
  }

  function addSocial() {
    const used = new Set(identity.socialLinks.map((s) => s.platform));
    const available = PLATFORMS.find((p) => !used.has(p));
    if (!available) return;
    updateConfig((prev) => ({
      ...prev,
      identity: {
        ...prev.identity,
        socialLinks: [
          ...prev.identity.socialLinks,
          { id: generateId(), platform: available, url: "" },
        ],
      },
    }));
  }

  function removeSocial(id: string) {
    updateConfig((prev) => ({
      ...prev,
      identity: {
        ...prev.identity,
        socialLinks: prev.identity.socialLinks.filter((s) => s.id !== id),
      },
    }));
  }

  return (
    <StudioSection title="Identity & Profile Picture" icon={<User className="w-4 h-4" />} defaultOpen>
      {/* Basic Info */}
      <TextInput
        label="Avatar Image URL"
        value={identity.avatarUrl}
        placeholder="https://images.unsplash.com/... or leave blank"
        onChange={(v) => updateIdentity("avatarUrl", v)}
      />
      <TextInput
        label="Display Name"
        value={identity.displayName}
        placeholder="Your Name"
        onChange={(v) => updateIdentity("displayName", v)}
      />
      <TextInput
        label="Subtitle / Bio"
        value={identity.subtitle}
        placeholder="Developer · Creator"
        onChange={(v) => updateIdentity("subtitle", v)}
      />
      <Toggle
        label="Verified Checkmark"
        checked={identity.verified}
        onChange={(v) => updateIdentity("verified", v)}
      />

      {/* Avatar Styling & Glow */}
      <div className="pt-2 border-t border-white/[0.06] space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Profile Picture Styling & Glow</span>
        </div>

        <ButtonGroup<AvatarShape>
          label="Picture Shape"
          value={identity.avatarShape || "circle"}
          options={[
            { value: "circle", label: "Circle" },
            { value: "rounded-square", label: "Squircle" },
            { value: "square", label: "Square" },
            { value: "hexagon", label: "Hexagon" },
            { value: "octagon", label: "Octagon" },
          ]}
          onChange={(v) => updateIdentity("avatarShape", v)}
        />

        <Slider
          label="Picture Size"
          value={identity.avatarSize || 96}
          min={64}
          max={130}
          unit="px"
          onChange={(v) => updateIdentity("avatarSize", v)}
        />

        <Slider
          label="Border Width"
          value={identity.avatarBorderWidth ?? 2}
          min={0}
          max={8}
          unit="px"
          onChange={(v) => updateIdentity("avatarBorderWidth", v)}
        />

        {(identity.avatarBorderWidth ?? 2) > 0 && (
          <>
            <ColorPicker
              label="Border Color"
              value={identity.avatarBorderColor || "#ffffff"}
              onChange={(v) => updateIdentity("avatarBorderColor", v)}
            />
            <Select
              label="Border Style"
              value={identity.avatarBorderStyle || "solid"}
              options={[
                { value: "solid", label: "Solid" },
                { value: "dashed", label: "Dashed" },
                { value: "double", label: "Double" },
              ]}
              onChange={(v) => updateIdentity("avatarBorderStyle", v as AvatarBorderStyle)}
            />
          </>
        )}

        {/* Glow Options */}
        <Toggle
          label="Border Glow Effect"
          checked={identity.avatarGlow ?? true}
          onChange={(v) => updateIdentity("avatarGlow", v)}
        />

        {identity.avatarGlow && (
          <div className="p-2.5 rounded-lg bg-violet-500/[0.05] border border-violet-500/20 space-y-3">
            <ColorPicker
              label="Glow Color"
              value={identity.avatarGlowColor || "#8b5cf6"}
              onChange={(v) => updateIdentity("avatarGlowColor", v)}
            />
            <Slider
              label="Glow Radius (Size)"
              value={identity.avatarGlowRadius ?? 22}
              min={0}
              max={100}
              unit="px"
              onChange={(v) => updateIdentity("avatarGlowRadius", v)}
            />
            <Slider
              label="Glow Spread Thickness"
              value={identity.avatarGlowSpread ?? 0}
              min={0}
              max={30}
              unit="px"
              onChange={(v) => updateIdentity("avatarGlowSpread", v)}
            />
            <Slider
              label="Glow Opacity / Intensity"
              value={identity.avatarGlowOpacity ?? 70}
              min={10}
              max={100}
              unit="%"
              onChange={(v) => updateIdentity("avatarGlowOpacity", v)}
            />
            <Toggle
              label="Pulsing Glow Animation"
              checked={identity.avatarGlowPulse ?? false}
              onChange={(v) => updateIdentity("avatarGlowPulse", v)}
            />
          </div>
        )}
      </div>

      {/* Social Links */}
      <div className="pt-2 border-t border-white/[0.06] space-y-3">
        <ButtonGroup<SocialLayoutStyle>
          label="Social Icons Style"
          value={identity.socialLayoutStyle}
          options={[
            { value: "minimal", label: "Minimal" },
            { value: "pill", label: "Pill" },
            { value: "floating", label: "Float" },
          ]}
          onChange={(v) => updateIdentity("socialLayoutStyle", v)}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-white/60">Social Links</label>
            <button
              onClick={addSocial}
              className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          {identity.socialLinks.map((social) => (
            <div
              key={social.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]"
            >
              <select
                value={social.platform}
                onChange={(e) =>
                  updateSocial(social.id, { platform: e.target.value as SocialPlatform })
                }
                className="w-24 shrink-0 text-xs px-2 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/80 focus:outline-none appearance-none cursor-pointer"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p} className="bg-[#1a1a2e]">
                    {SOCIAL_LABELS[p]}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={social.url}
                placeholder="URL"
                onChange={(e) => updateSocial(social.id, { url: e.target.value })}
                className="flex-1 min-w-0 text-xs px-2 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/80 placeholder:text-white/20 focus:outline-none focus:border-violet-500/50"
              />
              <div className="relative shrink-0">
                <input
                  type="color"
                  value={social.iconColor || "#9ca3af"}
                  onChange={(e) => updateSocial(social.id, { iconColor: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div
                  className="w-6 h-6 rounded-md border border-white/10 cursor-pointer"
                  style={{ backgroundColor: social.iconColor || "#9ca3af" }}
                />
              </div>
              <button
                onClick={() => removeSocial(social.id)}
                className="text-white/30 hover:text-red-400 transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </StudioSection>
  );
}
