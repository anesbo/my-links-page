"use client";

import { useConfig } from "@/lib/config-context";
import StudioSection from "./StudioSection";
import {
  ColorPicker,
  Slider,
  ButtonGroup,
  Select,
  Toggle,
  TextInput,
} from "@/components/ui/FormControls";
import { Palette, Plus, Trash2, Image as ImageIcon, Sparkles } from "lucide-react";
import {
  BackgroundType,
  FontFamily,
  GradientStop,
  ShapesStyle,
  ShapesSpeed,
} from "@/types/config";
import { getFontFamilyLabel } from "@/lib/utils";
import { BACKGROUND_PRESETS } from "@/lib/defaults";

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
    { value: "display", label: getFontFamilyLabel("display") },
    { value: "rounded", label: getFontFamilyLabel("rounded") },
    { value: "poppins", label: getFontFamilyLabel("poppins") },
    { value: "syne", label: getFontFamilyLabel("syne") },
    { value: "serif", label: getFontFamilyLabel("serif") },
    { value: "cinzel", label: getFontFamilyLabel("cinzel") },
    { value: "mono", label: getFontFamilyLabel("mono") },
    { value: "bricolage", label: getFontFamilyLabel("bricolage") },
    { value: "bebas", label: getFontFamilyLabel("bebas") },
    { value: "handwritten", label: getFontFamilyLabel("handwritten") },
  ];

  return (
    <StudioSection title="Theme & Background" icon={<Palette className="w-4 h-4" />}>
      {/* Background Type */}
      <ButtonGroup<BackgroundType>
        label="Background Type"
        value={theme.background.type}
        options={[
          { value: "solid", label: "Solid" },
          { value: "linear-gradient", label: "Linear" },
          { value: "radial-gradient", label: "Radial" },
          { value: "mesh", label: "Mesh" },
          { value: "image", label: "Image" },
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

      {/* Background Image Controls */}
      {theme.background.type === "image" && (
        <div className="space-y-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-400">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Curated Image Presets</span>
          </div>

          {/* Preset Wallpapers */}
          <div className="grid grid-cols-3 gap-1.5">
            {BACKGROUND_PRESETS.map((preset) => {
              const isSelected = theme.background.imageUrl === preset.url;
              return (
                <button
                  key={preset.id}
                  onClick={() => updateBackground("imageUrl", preset.url)}
                  className={`group relative h-14 rounded-lg overflow-hidden border transition-all text-left ${
                    isSelected
                      ? "border-violet-500 ring-2 ring-violet-500/40"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                    <span className="text-[10px] font-medium text-white truncate drop-shadow">
                      {preset.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <TextInput
            label="Custom Image URL"
            value={theme.background.imageUrl}
            placeholder="https://images.unsplash.com/..."
            onChange={(v) => updateBackground("imageUrl", v)}
          />

          <Slider
            label="Image Opacity"
            value={theme.background.imageOpacity ?? 85}
            min={10}
            max={100}
            unit="%"
            onChange={(v) => updateBackground("imageOpacity", v)}
          />

          <Slider
            label="Image Blur Effect"
            value={theme.background.imageBlur ?? 0}
            min={0}
            max={20}
            unit="px"
            onChange={(v) => updateBackground("imageBlur", v)}
          />

          <ColorPicker
            label="Color Overlay Tint"
            value={theme.background.imageOverlayColor || "#000000"}
            onChange={(v) => updateBackground("imageOverlayColor", v)}
          />

          <Slider
            label="Overlay Tint Intensity"
            value={theme.background.imageOverlayOpacity ?? 35}
            min={0}
            max={90}
            unit="%"
            onChange={(v) => updateBackground("imageOverlayOpacity", v)}
          />
        </div>
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

      {/* Decorative Floating Shapes ("shapes and things") */}
      <div className="pt-3 border-t border-white/[0.06] space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Floating Shapes & Ambient Effects</span>
        </div>

        <Toggle
          label="Enable Decorative Shapes"
          checked={theme.background.shapesEnabled ?? true}
          onChange={(v) => updateBackground("shapesEnabled", v)}
        />

        {theme.background.shapesEnabled && (
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <Select
              label="Shape Style"
              value={theme.background.shapesStyle || "blobs"}
              options={[
                { value: "blobs", label: "Organic Glowing Blobs" },
                { value: "geometric", label: "Floating Geometric Shapes" },
                { value: "bokeh", label: "Drifting Bokeh Lights" },
                { value: "grid", label: "Cyber Dot Matrix Grid" },
                { value: "rings", label: "Concentric Cosmic Rings" },
                { value: "stars", label: "Twinkling Night Stars" },
              ]}
              onChange={(v) => updateBackground("shapesStyle", v as ShapesStyle)}
            />

            <ColorPicker
              label="Shape Tint Color"
              value={theme.background.shapesColor || "#8b5cf6"}
              onChange={(v) => updateBackground("shapesColor", v)}
            />

            <Slider
              label="Shape Visibility"
              value={theme.background.shapesOpacity ?? 30}
              min={5}
              max={80}
              unit="%"
              onChange={(v) => updateBackground("shapesOpacity", v)}
            />

            <ButtonGroup<ShapesSpeed>
              label="Animation Speed"
              value={theme.background.shapesSpeed || "normal"}
              options={[
                { value: "slow", label: "Calm" },
                { value: "normal", label: "Normal" },
                { value: "fast", label: "Dynamic" },
              ]}
              onChange={(v) => updateBackground("shapesSpeed", v)}
            />
          </div>
        )}
      </div>

      {/* Typography */}
      <div className="pt-3 border-t border-white/[0.06] space-y-3">
        <Select
          label="Font Family (11 Styles)"
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
          label="Bio Subtext Color"
          value={theme.bioTextColor}
          onChange={(v) => updateTheme("bioTextColor", v)}
        />
      </div>
    </StudioSection>
  );
}
