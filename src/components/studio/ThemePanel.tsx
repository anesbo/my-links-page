"use client";

import { useConfig } from "@/lib/config-context";
import StudioSection from "./StudioSection";
import {
  ColorPicker,
  Slider,
  ButtonGroup,
  Select,
} from "@/components/ui/FormControls";
import { Palette, Plus, Trash2 } from "lucide-react";
import {
  BackgroundType,
  FontFamily,
  GradientStop,
} from "@/types/config";
import { getFontFamilyLabel } from "@/lib/utils";

export default function ThemePanel() {
  const { config, updateConfig } = useConfig();
  const { theme } = config;

  function updateTheme<K extends keyof typeof theme>(
    key: K,
    value: (typeof theme)[K]
  ) {
    updateConfig((prev) => ({
      ...prev,
      theme: { ...prev.theme, [key]: value },
    }));
  }

  function updateBackground<K extends keyof typeof theme.background>(
    key: K,
    value: (typeof theme.background)[K]
  ) {
    updateConfig((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        background: { ...prev.theme.background, [key]: value },
      },
    }));
  }

  function updateGradientStop(index: number, updates: Partial<GradientStop>) {
    const newStops = [...theme.background.gradientStops];
    newStops[index] = { ...newStops[index], ...updates };
    updateBackground("gradientStops", newStops);
  }

  function addGradientStop() {
    const stops = theme.background.gradientStops;
    const last = stops[stops.length - 1];
    updateBackground("gradientStops", [
      ...stops,
      { color: last?.color || "#ffffff", position: 100 },
    ]);
  }

  function removeGradientStop(index: number) {
    if (theme.background.gradientStops.length <= 2) return;
    const newStops = theme.background.gradientStops.filter((_, i) => i !== index);
    updateBackground("gradientStops", newStops);
  }

  function updateMeshColor(index: number, color: string) {
    const newColors = [...theme.background.meshColors];
    newColors[index] = color;
    updateBackground("meshColors", newColors);
  }

  const fontOptions: { value: FontFamily; label: string }[] = [
    { value: "sans", label: getFontFamilyLabel("sans") },
    { value: "serif", label: getFontFamilyLabel("serif") },
    { value: "mono", label: getFontFamilyLabel("mono") },
    { value: "display", label: getFontFamilyLabel("display") },
  ];

  return (
    <StudioSection title="Theme & Typography" icon={<Palette className="w-4 h-4" />}>
      {/* Background Type */}
      <ButtonGroup<BackgroundType>
        label="Background Type"
        value={theme.background.type}
        options={[
          { value: "solid", label: "Solid" },
          { value: "linear-gradient", label: "Linear" },
          { value: "radial-gradient", label: "Radial" },
          { value: "mesh", label: "Mesh" },
        ]}
        onChange={(v) => updateBackground("type", v)}
      />

      {/* Solid Color */}
      {theme.background.type === "solid" && (
        <ColorPicker
          label="Background Color"
          value={theme.background.solidColor}
          onChange={(v) => updateBackground("solidColor", v)}
        />
      )}

      {/* Gradient Controls */}
      {(theme.background.type === "linear-gradient" ||
        theme.background.type === "radial-gradient") && (
        <div className="space-y-3">
          {theme.background.type === "linear-gradient" && (
            <Slider
              label="Angle"
              value={theme.background.gradientAngle}
              min={0}
              max={360}
              unit="°"
              onChange={(v) => updateBackground("gradientAngle", v)}
            />
          )}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-white/60">Gradient Stops</label>
              <button
                onClick={addGradientStop}
                className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            {theme.background.gradientStops.map((stop, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="relative shrink-0">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateGradientStop(i, { color: e.target.value })}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div
                    className="w-7 h-7 rounded-md border border-white/10 cursor-pointer"
                    style={{ backgroundColor: stop.color }}
                  />
                </div>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={(e) =>
                    updateGradientStop(i, { position: Number(e.target.value) })
                  }
                  className="w-14 text-xs px-2 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/80 font-mono focus:outline-none"
                />
                <span className="text-[10px] text-white/30">%</span>
                {theme.background.gradientStops.length > 2 && (
                  <button
                    onClick={() => removeGradientStop(i)}
                    className="text-white/30 hover:text-red-400 transition-colors ml-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mesh Colors */}
      {theme.background.type === "mesh" && (
        <div className="space-y-2">
          <label className="text-xs text-white/60">Mesh Colors</label>
          <div className="grid grid-cols-2 gap-2">
            {theme.background.meshColors.map((color, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="relative shrink-0">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateMeshColor(i, e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div
                    className="w-7 h-7 rounded-md border border-white/10 cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <span className="text-[10px] text-white/40 font-mono">{color}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Typography */}
      <Select
        label="Font Family"
        value={theme.fontFamily}
        options={fontOptions}
        onChange={(v) => updateTheme("fontFamily", v as FontFamily)}
      />
      <Slider
        label="Font Scale"
        value={theme.fontScale}
        min={0.8}
        max={1.4}
        step={0.05}
        unit="x"
        onChange={(v) => updateTheme("fontScale", v)}
      />
      <ColorPicker
        label="Heading Color"
        value={theme.headingColor}
        onChange={(v) => updateTheme("headingColor", v)}
      />
      <ColorPicker
        label="Bio Text Color"
        value={theme.bioTextColor}
        onChange={(v) => updateTheme("bioTextColor", v)}
      />
    </StudioSection>
  );
}
