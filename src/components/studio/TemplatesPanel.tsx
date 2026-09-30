"use client";

import { useConfig } from "@/lib/config-context";
import StudioSection from "./StudioSection";
import { TEMPLATES } from "@/lib/templates";
import { COLOR_PALETTES, ColorPalette } from "@/lib/color-palettes";
import { TemplateCategory, TemplateConfig } from "@/types/config";
import { LayoutTemplate, Check, Sparkles, Palette, Search, X } from "lucide-react";
import { useState } from "react";

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "All",
  "Modern",
  "Aesthetic",
  "Dark/Cyber",
  "Minimal",
  "Luxury",
  "Vibrant",
  "Nature",
];

const PALETTE_CATEGORIES = [
  "All",
  "Developer",
  "Dark",
  "Neon",
  "Pastel",
  "Luxury",
  "Nature",
  "Vibrant",
  "Light",
  "Minimal",
  "Retro",
] as const;

export default function TemplatesPanel({ onSelect }: { onSelect?: () => void }) {
  const { config, setConfig } = useConfig();
  const [activeTab, setActiveTab] = useState<"templates" | "palettes">("templates");
  const [selectedTemplateCat, setSelectedTemplateCat] = useState<TemplateCategory>("All");
  const [selectedPaletteCat, setSelectedPaletteCat] = useState<string>("All");
  const [paletteSearch, setPaletteSearch] = useState("");
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>("apple-liquid-glass");
  const [activePaletteId, setActivePaletteId] = useState<string | null>(null);

  const filteredTemplates =
    selectedTemplateCat === "All"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedTemplateCat);

  const filteredPalettes = COLOR_PALETTES.filter((p) => {
    const matchesCat = selectedPaletteCat === "All" || p.category === selectedPaletteCat;
    const q = paletteSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  function applyTemplate(template: TemplateConfig) {
    setActiveTemplateId(template.id);
    setConfig({
      ...config,
      theme: {
        ...config.theme,
        ...template.config.theme,
        background: {
          ...config.theme.background,
          ...(template.config.theme.background || {}),
        },
      },
      identity: {
        ...config.identity,
        ...(template.config.identity || {}),
      },
      linkStyle: {
        ...config.linkStyle,
        ...template.config.linkStyle,
      },
      footer: {
        ...config.footer,
        ...(template.config.footer || {}),
      },
    });
    if (onSelect) onSelect();
  }

  function applyPalette(palette: ColorPalette) {
    setActivePaletteId(palette.id);
    setConfig({
      ...config,
      theme: {
        ...config.theme,
        background: {
          ...config.theme.background,
          ...palette.config.theme.background,
        },
        headingColor: palette.config.theme.headingColor,
        bioTextColor: palette.config.theme.bioTextColor,
      },
      linkStyle: {
        ...config.linkStyle,
        ...palette.config.linkStyle,
      },
    });
    if (onSelect) onSelect();
  }

  return (
    <StudioSection
      title={
        activeTab === "templates"
          ? `Design Templates (${TEMPLATES.length})`
          : `Color Themes (${COLOR_PALETTES.length})`
      }
      icon={
        activeTab === "templates" ? (
          <LayoutTemplate className="w-4 h-4 text-violet-400" />
        ) : (
          <Palette className="w-4 h-4 text-fuchsia-400" />
        )
      }
      defaultOpen
    >
      {/* Top Segmented Tab Switch */}
      <div className="flex p-0.5 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-1">
        <button
          onClick={() => setActiveTab("templates")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "templates"
              ? "bg-violet-600 text-white shadow-sm"
              : "text-white/50 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>Full Templates</span>
          <span className="text-[10px] opacity-75">({TEMPLATES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("palettes")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "palettes"
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm"
              : "text-white/50 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-fuchsia-300" />
          <span>Color Themes</span>
          <span className="text-[10px] bg-fuchsia-500/30 text-fuchsia-200 px-1.5 py-0.2 rounded-full font-bold">
            {COLOR_PALETTES.length}
          </span>
        </button>
      </div>

      {/* ────────────────── TEMPLATES TAB ────────────────── */}
      {activeTab === "templates" && (
        <>
          {/* Category Pills Filter */}
          <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTemplateCat(cat)}
                className={`shrink-0 px-2.5 py-1 text-[11px] rounded-full font-medium transition-all ${
                  selectedTemplateCat === cat
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredTemplates.map((template) => {
              const isActive = activeTemplateId === template.id;

              return (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  className={`group relative text-left rounded-xl p-2.5 border transition-all flex flex-col justify-between overflow-hidden ${
                    isActive
                      ? "border-violet-500 ring-2 ring-violet-500/40 bg-violet-500/[0.08]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  {/* Thumbnail Gradient Preview */}
                  <div
                    className="w-full h-16 rounded-lg mb-2 relative overflow-hidden flex items-end p-1.5 shadow-inner"
                    style={{ background: template.previewGradient }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/10 pointer-events-none" />

                    {template.badge && (
                      <span className="relative z-10 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15 truncate max-w-[90%]">
                        {template.badge}
                      </span>
                    )}

                    {isActive && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white/90 group-hover:text-white truncate">
                      {template.name}
                    </h4>
                    <p className="text-[10px] text-white/40 line-clamp-2 leading-tight mt-0.5">
                      {template.description}
                    </p>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-white/[0.05] flex items-center justify-between">
                    <span className="text-[9px] text-white/30 capitalize">
                      {template.category}
                    </span>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: template.accentColor }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ────────────────── COLOR THEMES TAB ────────────────── */}
      {activeTab === "palettes" && (
        <div className="space-y-2">
          {/* Palette Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={`Search ${COLOR_PALETTES.length} color themes (e.g. monokai, tiffany, retro)...`}
              value={paletteSearch}
              onChange={(e) => setPaletteSearch(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
            />
            {paletteSearch && (
              <button
                onClick={() => setPaletteSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Palette Category Pills */}
          <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
            {PALETTE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedPaletteCat(cat)}
                className={`shrink-0 px-2.5 py-1 text-[11px] rounded-full font-medium transition-all ${
                  selectedPaletteCat === cat
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm"
                    : "bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Result Count */}
          <div className="text-[10px] text-white/40 flex items-center justify-between px-1">
            <span>Showing {filteredPalettes.length} palettes</span>
            {selectedPaletteCat !== "All" && (
              <span className="text-violet-400 font-medium">{selectedPaletteCat}</span>
            )}
          </div>

          {/* Color Palettes Grid (75 Themes) */}
          <div className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredPalettes.map((palette) => {
              const isActive = activePaletteId === palette.id;

              return (
                <button
                  key={palette.id}
                  onClick={() => applyPalette(palette)}
                  className={`group relative text-left rounded-xl p-2.5 border transition-all flex flex-col gap-2 overflow-hidden ${
                    isActive
                      ? "border-violet-500 ring-2 ring-violet-500/40 bg-violet-500/[0.08]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  {/* Swatch Color Bar */}
                  <div className="w-full h-7 rounded-lg overflow-hidden flex border border-white/10 shadow-sm relative">
                    {palette.previewColors.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex-1 h-full transition-transform group-hover:scale-y-110"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}

                    {isActive && (
                      <div className="absolute right-1.5 top-1.5 w-4 h-4 rounded-full bg-violet-500 text-white flex items-center justify-center shadow-md">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                        {palette.name}
                      </h4>
                      <p className="text-[10px] text-white/40 leading-snug line-clamp-1 mt-0.5">
                        {palette.description}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60 capitalize font-medium">
                        {palette.category}
                      </span>
                      <Sparkles className="w-3 h-3 text-violet-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredPalettes.length === 0 && (
              <div className="py-8 text-center text-xs text-white/40">
                No color themes match &quot;{paletteSearch}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </StudioSection>
  );
}
