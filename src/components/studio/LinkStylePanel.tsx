"use client";

import { useConfig } from "@/lib/config-context";
import StudioSection from "./StudioSection";
import {
  ColorPicker,
  Slider,
  ButtonGroup,
  Toggle,
} from "@/components/ui/FormControls";
import { Square, Sparkles } from "lucide-react";
import { SurfaceTreatment, HoverEffect, LinkShadow } from "@/types/config";

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
    <StudioSection title="Capsules & Link Styling" icon={<Square className="w-4 h-4" />}>
      {/* Surface Treatment */}
      <ButtonGroup<SurfaceTreatment>
        label="Surface Treatment"
        value={linkStyle.surfaceTreatment}
        options={[
          { value: "liquid-glass", label: "Liquid Glass" },
          { value: "glass", label: "Glass" },
          { value: "solid", label: "Solid" },
          { value: "neumorphic", label: "Neumorphic" },
          { value: "outline", label: "Outline" },
        ]}
        onChange={(v) => updateLinkStyle("surfaceTreatment", v)}
      />

      {linkStyle.surfaceTreatment === "liquid-glass" && (
        <div className="p-2.5 rounded-lg bg-violet-500/[0.06] border border-violet-500/20 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-violet-300">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span>Apple iPhone Liquid Glass Active</span>
          </div>
          <p className="text-[10px] text-white/50 leading-relaxed">
            Multi-layered backdrop refraction, specular top highlight, and ultra-smooth blur.
          </p>
          <Toggle
            label="Gleam Sweep Animation"
            checked={linkStyle.liquidGlassGleam !== false}
            onChange={(v) => updateLinkStyle("liquidGlassGleam", v)}
          />
        </div>
      )}

      {/* Surface Color & Opacity */}
      <ColorPicker
        label="Surface Tint Color"
        value={linkStyle.surfaceColor}
        onChange={(v) => updateLinkStyle("surfaceColor", v)}
      />
      {(linkStyle.surfaceTreatment === "glass" ||
        linkStyle.surfaceTreatment === "liquid-glass") && (
        <Slider
          label="Glass Translucency"
          value={linkStyle.surfaceOpacity ?? 12}
          min={4}
          max={45}
          unit="%"
          onChange={(v) => updateLinkStyle("surfaceOpacity", v)}
        />
      )}

      {/* Geometry */}
      <div className="pt-2 border-t border-white/[0.06] space-y-3">
        <Slider
          label="Corner Radius"
          value={linkStyle.cornerRadius}
          min={0}
          max={36}
          unit="px"
          onChange={(v) => updateLinkStyle("cornerRadius", v)}
        />
        <div className="flex gap-1">
          {[0, 8, 18, 9999].map((r) => (
            <button
              key={r}
              onClick={() => updateLinkStyle("cornerRadius", r)}
              className={`flex-1 py-1 text-[10px] rounded-md border transition-all ${
                linkStyle.cornerRadius === r
                  ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                  : "border-white/[0.06] text-white/40 hover:text-white/60"
              }`}
            >
              {r === 0 ? "Sharp" : r === 8 ? "Soft" : r === 18 ? "Round" : "Pill"}
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
      </div>

      {/* Shadow & Elevation */}
      <div className="pt-2 border-t border-white/[0.06] space-y-3">
        <ButtonGroup<LinkShadow>
          label="Capsule Shadow & Depth"
          value={linkStyle.shadow || "subtle"}
          options={[
            { value: "none", label: "Flat" },
            { value: "subtle", label: "Soft" },
            { value: "elevated", label: "Float" },
            { value: "glow", label: "Glow" },
            { value: "heavy", label: "Deep" },
          ]}
          onChange={(v) => updateLinkStyle("shadow", v)}
        />

        {/* Hover */}
        <ButtonGroup<HoverEffect>
          label="Hover Motion Effect"
          value={linkStyle.hoverEffect}
          options={[
            { value: "lift", label: "Lift" },
            { value: "scale", label: "Scale" },
            { value: "glow", label: "Glow" },
            { value: "shake", label: "Shake" },
            { value: "shine", label: "Shine" },
          ]}
          onChange={(v) => updateLinkStyle("hoverEffect", v)}
        />
      </div>

      {/* Capsule Badges Default Style */}
      <div className="pt-2 border-t border-white/[0.06] space-y-2">
        <ButtonGroup<"pill" | "solid" | "glow" | "outline">
          label="Capsule Badges Style"
          value={linkStyle.badgeStyle || "pill"}
          options={[
            { value: "pill", label: "Pill" },
            { value: "solid", label: "Solid" },
            { value: "glow", label: "Glow" },
            { value: "outline", label: "Outline" },
          ]}
          onChange={(v) => updateLinkStyle("badgeStyle", v)}
        />
      </div>

      {/* Typography & Colors */}
      <div className="pt-2 border-t border-white/[0.06] space-y-3">
        <ColorPicker
          label="Capsule Title Color"
          value={linkStyle.textColor}
          onChange={(v) => updateLinkStyle("textColor", v)}
        />
        <ColorPicker
          label="Capsule Subtitle Color"
          value={linkStyle.subtextColor}
          onChange={(v) => updateLinkStyle("subtextColor", v)}
        />
        <ColorPicker
          label="Icon Tint Color"
          value={linkStyle.iconColor}
          onChange={(v) => updateLinkStyle("iconColor", v)}
        />
      </div>
    </StudioSection>
  );
}
