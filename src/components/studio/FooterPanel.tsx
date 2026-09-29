"use client";

import { useConfig } from "@/lib/config-context";
import StudioSection from "./StudioSection";
import {
  TextInput,
  Toggle,
  Slider,
  ColorPicker,
  ButtonGroup,
} from "@/components/ui/FormControls";
import { MessageSquareText } from "lucide-react";
import { FooterConfig } from "@/types/config";

export default function FooterPanel() {
  const { config, updateConfig } = useConfig();
  const footer = config.footer || {
    enabled: true,
    text: "",
    subtext: "",
    textColor: "#9ca3af",
    fontSize: 0.85,
    alignment: "center",
    spaceBottom: 32,
    showPoweredBy: true,
  };

  function updateFooter<K extends keyof FooterConfig>(
    key: K,
    value: FooterConfig[K]
  ) {
    updateConfig((prev) => ({
      ...prev,
      footer: { ...(prev.footer || footer), [key]: value },
    }));
  }

  return (
    <StudioSection
      title="Bottom Section & Notes"
      icon={<MessageSquareText className="w-4 h-4" />}
    >
      <Toggle
        label="Enable Bottom Message Area"
        checked={footer.enabled}
        onChange={(v) => updateFooter("enabled", v)}
      />

      {footer.enabled && (
        <>
          <div className="space-y-1.5">
            <label className="text-xs text-white/60 block">
              Bottom Note / Custom Text
            </label>
            <textarea
              value={footer.text}
              placeholder="Write anything here... (e.g., bio note, quotes, disclaimer, or announcements)"
              rows={3}
              onChange={(e) => updateFooter("text", e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white/90 placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 resize-y"
            />
          </div>

          <TextInput
            label="Secondary Subtext / Copyright"
            value={footer.subtext || ""}
            placeholder="e.g. © 2026 All Rights Reserved"
            onChange={(v) => updateFooter("subtext", v)}
          />

          <ColorPicker
            label="Text Color"
            value={footer.textColor || "#9ca3af"}
            onChange={(v) => updateFooter("textColor", v)}
          />

          <Slider
            label="Text Size"
            value={footer.fontSize || 0.85}
            min={0.7}
            max={1.3}
            step={0.05}
            unit="rem"
            onChange={(v) => updateFooter("fontSize", v)}
          />

          <ButtonGroup<"center" | "left" | "right">
            label="Text Alignment"
            value={footer.alignment || "center"}
            options={[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ]}
            onChange={(v) => updateFooter("alignment", v)}
          />
        </>
      )}

      {/* Bottom Spacing Slider */}
      <div className="pt-2 border-t border-white/[0.06] space-y-3">
        <Slider
          label="Space At Very Bottom"
          value={footer.spaceBottom ?? 32}
          min={16}
          max={140}
          unit="px"
          onChange={(v) => updateFooter("spaceBottom", v)}
        />
        <Toggle
          label="Show 'Powered by' Attribution"
          checked={footer.showPoweredBy !== false}
          onChange={(v) => updateFooter("showPoweredBy", v)}
        />
      </div>
    </StudioSection>
  );
}
