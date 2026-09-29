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
} from "lucide-react";
import { BioLink } from "@/types/config";
import { generateId } from "@/lib/utils";
import { AVAILABLE_ICONS, getLinkIcon } from "@/lib/icons";
import { useState } from "react";

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
      badgeColor: "#a78bfa",
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
    <StudioSection title="Link Manager" icon={<Link2 className="w-4 h-4" />} defaultOpen>
      <Toggle
        label="Show Click Counts"
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
              className={`rounded-lg border transition-colors ${
                isExpanded
                  ? "border-violet-500/30 bg-violet-500/[0.04]"
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
                  className="flex-1 text-left min-w-0"
                >
                  <span className="text-sm text-white/80 truncate block">
                    {link.title}
                  </span>
                </button>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => updateLink(link.id, { enabled: !link.enabled })}
                    className={`p-1 rounded transition-colors ${
                      link.enabled
                        ? "text-green-400/60 hover:text-green-400"
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
                <div className="px-3 pb-3 space-y-3 border-t border-white/[0.04] pt-3">
                  <TextInput
                    label="Title"
                    value={link.title}
                    onChange={(v) => updateLink(link.id, { title: v })}
                  />
                  <TextInput
                    label="URL"
                    value={link.url}
                    placeholder="https://example.com"
                    onChange={(v) => updateLink(link.id, { url: v })}
                  />
                  <TextInput
                    label="Subtitle"
                    value={link.subtitle || ""}
                    placeholder="Optional description"
                    onChange={(v) => updateLink(link.id, { subtitle: v })}
                  />

                  {/* Icon Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 block">Icon</label>
                    <div className="flex flex-wrap gap-1.5">
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

                  {/* Badge */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <TextInput
                        label="Badge"
                        value={link.badge || ""}
                        placeholder="e.g. Featured, New"
                        onChange={(v) => updateLink(link.id, { badge: v })}
                      />
                    </div>
                    {link.badge && (
                      <div className="pt-5">
                        <ColorPicker
                          label=""
                          value={link.badgeColor || "#a78bfa"}
                          onChange={(v) => updateLink(link.id, { badgeColor: v })}
                        />
                      </div>
                    )}
                  </div>

                  {/* Click Count */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 block">Mock Clicks</label>
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
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-white/10 text-white/50 hover:text-white/80 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-sm"
      >
        <Plus className="w-4 h-4" />
        Add Link
      </button>
    </StudioSection>
  );
}
