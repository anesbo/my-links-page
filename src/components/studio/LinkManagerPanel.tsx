"use client";

import { useConfig } from "@/lib/config-context";
import StudioSection from "./StudioSection";
import { TextInput, Toggle, ColorPicker } from "@/components/ui/FormControls";
import {
  Link2,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Tag,
  X,
} from "lucide-react";
import { BioLink } from "@/types/config";
import { generateId } from "@/lib/utils";
import { AVAILABLE_ICONS, getLinkIcon } from "@/lib/icons";
import { useState } from "react";

const BADGE_PRESETS = [
  { label: "Featured", bg: "#8b5cf6", text: "#ffffff" },
  { label: "New", bg: "#10b981", text: "#ffffff" },
  { label: "Hot 🔥", bg: "#ef4444", text: "#ffffff" },
  { label: "Popular", bg: "#f59e0b", text: "#ffffff" },
  { label: "Must See", bg: "#ec4899", text: "#ffffff" },
];

export default function LinkManagerPanel() {
  const { config, updateConfig } = useConfig();
  const { links, analytics } = config;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function updateLink(id: string, updates: Partial<BioLink>) {
    updateConfig((prev) => ({
      ...prev,
      links: prev.links.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  }

  function addLink() {
    const newLink: BioLink = {
      id: generateId(),
      title: "New Link",
      url: "https://",
      subtitle: "",
      icon: "Link2",
      badge: "",
      badgeColor: "#ffffff",
      badgeBgColor: "#8b5cf6",
      clicks: 0,
      enabled: true,
    };
    updateConfig((prev) => ({
      ...prev,
      links: [...prev.links, newLink],
    }));
    setExpandedId(newLink.id);
  }

  function removeLink(id: string) {
    updateConfig((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l.id !== id),
    }));
  }

  function moveLink(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= links.length) return;
    updateConfig((prev) => {
      const newLinks = [...prev.links];
      [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
      return { ...prev, links: newLinks };
    });
  }

  return (
    <StudioSection title="Capsule Links Manager" icon={<Link2 className="w-4 h-4" />} defaultOpen>
      <Toggle
        label="Show Click Counts on Capsules"
        checked={analytics.showClickCounts}
        onChange={(v) =>
          updateConfig((prev) => ({
            ...prev,
            analytics: { ...prev.analytics, showClickCounts: v },
          }))
        }
      />

      <div className="space-y-2">
        {links.map((link, index) => {
          const isExpanded = expandedId === link.id;
          const LinkIcon = getLinkIcon(link.icon);

          return (
            <div
              key={link.id}
              className={`rounded-lg border transition-all ${
                isExpanded
                  ? "border-violet-500/40 bg-violet-500/[0.05]"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              {/* Header row */}
              <div className="flex items-center gap-2 px-3 py-2.5">
                <GripVertical className="w-3.5 h-3.5 text-white/20 shrink-0 cursor-grab" />
                <LinkIcon
                  className="w-4 h-4 shrink-0"
                  style={{ color: config.linkStyle.iconColor }}
                />
                <button
                  onClick={() => setExpandedId(isExpanded ? null : link.id)}
                  className="flex-1 text-left min-w-0 flex items-center gap-2"
                >
                  <span className="text-sm font-medium text-white/90 truncate">
                    {link.title}
                  </span>
                  {link.badge && (
                    <span
                      className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase"
                      style={{
                        backgroundColor: link.badgeBgColor || "#8b5cf6",
                        color: link.badgeColor || "#ffffff",
                      }}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => updateLink(link.id, { enabled: !link.enabled })}
                    className={`p-1 rounded transition-colors ${
                      link.enabled
                        ? "text-green-400/80 hover:text-green-400"
                        : "text-white/20 hover:text-white/40"
                    }`}
                    title={link.enabled ? "Visible" : "Hidden"}
                  >
                    {link.enabled ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => moveLink(index, "up")}
                    disabled={index === 0}
                    className="p-1 text-white/20 hover:text-white/50 disabled:opacity-30 transition-colors"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveLink(index, "down")}
                    disabled={index === links.length - 1}
                    className="p-1 text-white/20 hover:text-white/50 disabled:opacity-30 transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeLink(link.id)}
                    className="p-1 text-white/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Expanded editor */}
              {isExpanded && (
                <div className="px-3 pb-3 space-y-3 border-t border-white/[0.06] pt-3">
                  <TextInput
                    label="Link Title"
                    value={link.title}
                    onChange={(v) => updateLink(link.id, { title: v })}
                  />
                  <TextInput
                    label="Destination URL"
                    value={link.url}
                    placeholder="https://example.com"
                    onChange={(v) => updateLink(link.id, { url: v })}
                  />
                  <TextInput
                    label="Subtitle (Optional)"
                    value={link.subtitle || ""}
                    placeholder="Brief description under title"
                    onChange={(v) => updateLink(link.id, { subtitle: v })}
                  />

                  {/* Icon Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 block">Icon</label>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      {AVAILABLE_ICONS.map((iconName) => {
                        const Icon = getLinkIcon(iconName);
                        return (
                          <button
                            key={iconName}
                            onClick={() => updateLink(link.id, { icon: iconName })}
                            className={`p-1.5 rounded-md transition-all ${
                              link.icon === iconName
                                ? "bg-violet-500/20 border border-violet-500/50 text-violet-300"
                                : "border border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/20"
                            }`}
                            title={iconName}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Capsule Badge / Tag (Enhanced) */}
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-300">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Capsule Badge / Tag</span>
                      </div>
                      {link.badge && (
                        <button
                          onClick={() => updateLink(link.id, { badge: "" })}
                          className="flex items-center gap-1 text-[10px] text-red-400/80 hover:text-red-400"
                          title="Remove badge"
                        >
                          <X className="w-3 h-3" /> Remove Badge
                        </button>
                      )}
                    </div>

                    {/* Quick presets */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 block">Quick Presets</label>
                      <div className="flex flex-wrap gap-1">
                        {BADGE_PRESETS.map((preset) => (
                          <button
                            key={preset.label}
                            onClick={() =>
                              updateLink(link.id, {
                                badge: preset.label,
                                badgeBgColor: preset.bg,
                                badgeColor: preset.text,
                              })
                            }
                            className={`px-2 py-1 text-[10px] rounded-md border font-medium transition-all ${
                              link.badge === preset.label
                                ? "border-violet-400 text-white"
                                : "border-white/10 text-white/60 hover:text-white hover:border-white/30"
                            }`}
                            style={{
                              backgroundColor:
                                link.badge === preset.label ? `${preset.bg}40` : "transparent",
                            }}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Badge Text Input */}
                    <TextInput
                      label="Custom Badge Text"
                      value={link.badge || ""}
                      placeholder="e.g. Featured, New, 50% Off, Coming Soon"
                      onChange={(v) => updateLink(link.id, { badge: v })}
                    />

                    {link.badge && (
                      <div className="space-y-2 pt-1 border-t border-white/[0.05]">
                        <ColorPicker
                          label="Badge Background"
                          value={link.badgeBgColor || "#8b5cf6"}
                          onChange={(v) => updateLink(link.id, { badgeBgColor: v })}
                        />
                        <ColorPicker
                          label="Badge Text Color"
                          value={link.badgeColor || "#ffffff"}
                          onChange={(v) => updateLink(link.id, { badgeColor: v })}
                        />
                      </div>
                    )}
                  </div>

                  {/* Click Count */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 block">Mock Clicks Count</label>
                    <input
                      type="number"
                      min={0}
                      value={link.clicks}
                      onChange={(e) =>
                        updateLink(link.id, { clicks: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white/80 font-mono focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={addLink}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-white/15 text-white/60 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Add New Capsule Link
      </button>
    </StudioSection>
  );
}
