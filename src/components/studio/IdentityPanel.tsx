"use client";

import { useConfig } from "@/lib/config-context";
import StudioSection from "./StudioSection";
import { TextInput, Toggle, ButtonGroup, ColorPicker } from "@/components/ui/FormControls";
import { User, Plus, Trash2 } from "lucide-react";
import { SOCIAL_LABELS } from "@/lib/icons";
import { SocialPlatform, SocialLink, SocialLayoutStyle } from "@/types/config";
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
    <StudioSection title="Identity & Profile" icon={<User className="w-4 h-4" />} defaultOpen>
      <TextInput
        label="Avatar URL"
        value={identity.avatarUrl}
        placeholder="https://example.com/avatar.jpg"
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
        label="Verified Badge"
        checked={identity.verified}
        onChange={(v) => updateIdentity("verified", v)}
      />
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

      {/* Social Links List */}
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
    </StudioSection>
  );
}
