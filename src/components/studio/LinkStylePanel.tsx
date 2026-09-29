"use client";

import { useConfig } from "@/lib/config-context";
import StudioSection from "./StudioSection";
import {
  ColorPicker,
  Slider,
  ButtonGroup,
} from "@/components/ui/FormControls";
import { Square } from "lucide-react";
import { SurfaceTreatment, HoverEffect } from "@/types/config";

export default function LinkStylePanel() {
  const { config, updateConfig } = useConfig();
  const { linkStyle } = config;

  function updateLinkStyle<K extends keyof typeof linkStyle>(
    key: K,
    value: (typeof linkStyle)[K]
  ) {
    updateConfig((prev) => ({
      ...prev,
      linkStyle: { ...prev.linkStyle, [key]: value },
    }));
  }

  return (
    <StudioSection title="Link Block Styling" icon={<Square className="w-4 h-4" />}>
      {/* Geometry */}
      <Slider
        label="Corner Radius"
        value={linkStyle.cornerRadius}
        min={0}
        max={32}
        unit="px"
        onChange={(v) => updateLinkStyle("cornerRadius", v)}
      />
      <div className="flex gap-1">
        {[0, 8, 16, 9999].map((r) => (
          <button
            key={r}
            onClick={() => updateLinkStyle("cornerRadius", r)}
            className={`flex-1 py-1 text-[10px] rounded-md border transition-all ${
              linkStyle.cornerRadius === r
                ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                : "border-white/[0.06] text-white/40 hover:text-white/60"
            }`}
          >
            {r === 0 ? "Sharp" : r === 8 ? "Soft" : r === 16 ? "Round" : "Pill"}
          </button>
        ))}
      </div>

      <Slider
        label="Border Width"
        value={linkStyle.borderWidth}
        min={0}
        max={4}
        unit="px"
        onChange={(v) => updateLinkStyle("borderWidth", v)}
      />
      <ColorPicker
        label="Border Color"
        value={linkStyle.borderColor}
        onChange={(v) => updateLinkStyle("borderColor", v)}
      />

      {/* Surface */}
      <ButtonGroup<SurfaceTreatment>
        label="Surface Treatment"
        value={linkStyle.surfaceTreatment}
        options={[
          { value: "solid", label: "Solid" },
          { value: "glass", label: "Glass" },
          { value: "neumorphic", label: "Neumorphic" },
          { value: "outline", label: "Outline" },
        ]}
        onChange={(v) => updateLinkStyle("surfaceTreatment", v)}
      />
      <ColorPicker
        label="Surface Color"
        value={linkStyle.surfaceColor}
        onChange={(v) => updateLinkStyle("surfaceColor", v)}
      />
      {linkStyle.surfaceTreatment === "glass" && (
        <Slider
          label="Glass Opacity"
          value={linkStyle.surfaceOpacity}
          min={0}
          max={40}
          unit="%"
          onChange={(v) => updateLinkStyle("surfaceOpacity", v)}
        />
      )}

      {/* Hover */}
      <ButtonGroup<HoverEffect>
        label="Hover Effect"
        value={linkStyle.hoverEffect}
        options={[
          { value: "lift", label: "Lift" },
          { value: "scale", label: "Scale" },
          { value: "glow", label: "Glow" },
          { value: "shake", label: "Shake" },
        ]}
        onChange={(v) => updateLinkStyle("hoverEffect", v)}
      />

      {/* Colors */}
      <ColorPicker
        label="Button Text"
        value={linkStyle.textColor}
        onChange={(v) => updateLinkStyle("textColor", v)}
      />
      <ColorPicker
        label="Subtext"
        value={linkStyle.subtextColor}
        onChange={(v) => updateLinkStyle("subtextColor", v)}
      />
      <ColorPicker
        label="Icon Tint"
        value={linkStyle.iconColor}
        onChange={(v) => updateLinkStyle("iconColor", v)}
      />
    </StudioSection>
  );
}
