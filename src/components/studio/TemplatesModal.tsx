"use client";

import { useConfig } from "@/lib/config-context";
import { TEMPLATES } from "@/lib/templates";
import { COLOR_PALETTES, ColorPalette } from "@/lib/color-palettes";
import { TemplateCategory, TemplateConfig } from "@/types/config";
import { LayoutTemplate, X, Check, Sparkles, Palette, Search } from "lucide-react";
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

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplatesModal({ isOpen, onClose }: TemplatesModalProps) {
  const { config, setConfig } = useConfig();
  const [activeTab, setActiveTab] = useState<"templates" | "palettes">("templates");
  const [selectedTemplateCat, setSelectedTemplateCat] = useState<TemplateCategory>("All");
  const [selectedPaletteCat, setSelectedPaletteCat] = useState<string>("All");
  const [paletteSearch, setPaletteSearch] = useState("");
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>("apple-liquid-glass");
  const [activePaletteId, setActivePaletteId] = useState<string | null>(null);

  if (!isOpen) return null;

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
    onClose();
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
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#121224] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#121224]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              {activeTab === "templates" ? (
                <LayoutTemplate className="w-4 h-4 text-white" />
              ) : (
                <Palette className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {activeTab === "templates"
                  ? "Explore Design Templates"
                  : "Explore Curated Color Themes"}
                <span className="text-xs font-normal text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                  {activeTab === "templates"
                    ? `${TEMPLATES.length} Styles`
                    : `${COLOR_PALETTES.length} Color Themes`}
                </span>
              </h2>
              <p className="text-xs text-white/50">
                {activeTab === "templates"
                  ? "Pick any complete aesthetic to instantly style your page"
                  : `Choose from ${COLOR_PALETTES.length} developer, luxury, neon, pastel, and minimal color schemes`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Top Switch */}
            <div className="flex p-0.5 rounded-xl bg-white/[0.06] border border-white/10">
              <button
                onClick={() => setActiveTab("templates")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === "templates"
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>Templates</span>
              </button>
              <button
                onClick={() => setActiveTab("palettes")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === "palettes"
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-fuchsia-300" />
                <span>Color Themes ({COLOR_PALETTES.length})</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-bar with Categories & Search */}
        <div className="shrink-0 px-6 py-3 border-b border-white/[0.06] bg-white/[0.01] flex items-center justify-between gap-3">
          {/* Category Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1">
            {activeTab === "templates"
              ? TEMPLATE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedTemplateCat(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                      selectedTemplateCat === cat
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                        : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))
              : PALETTE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedPaletteCat(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                      selectedPaletteCat === cat
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30"
                        : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
          </div>

          {/* Search box for Color Themes tab */}
          {activeTab === "palettes" && (
            <div className="relative w-64 shrink-0">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search themes (e.g. monokai, tiffany)..."
                value={paletteSearch}
                onChange={(e) => setPaletteSearch(e.target.value)}
                className="w-full pl-8 pr-7 py-1 text-xs rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
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
          )}
        </div>

        {/* ────────────── TEMPLATES GRID ────────────── */}
        {activeTab === "templates" && (
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 scrollbar-thin">
            {filteredTemplates.map((template) => {
              const isActive = activeTemplateId === template.id;

              return (
                <div
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  className={`group cursor-pointer rounded-xl border p-3.5 transition-all flex flex-col justify-between relative overflow-hidden ${
                    isActive
                      ? "border-violet-500 ring-2 ring-violet-500/40 bg-violet-500/[0.08]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-0.5"
                  }`}
                >
                  <div
                    className="w-full h-24 rounded-lg mb-3 relative overflow-hidden p-2.5 flex flex-col justify-between shadow-inner"
                    style={{ background: template.previewGradient }}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      {template.badge ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15">
                          {template.badge}
                        </span>
                      ) : (
                        <span />
                      )}

                      {isActive && (
                        <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center shadow-lg">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 relative z-10 pointer-events-none">
                      <div className="h-2.5 w-3/4 rounded-full bg-white/30 backdrop-blur-sm" />
                      <div className="h-2.5 w-full rounded-full bg-white/20 backdrop-blur-sm" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                        {template.name}
                      </h3>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-3">
                      {template.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shadow-sm"
                        style={{ backgroundColor: template.accentColor }}
                      />
                      <span className="text-[11px] text-white/40 font-mono">
                        {template.config.theme?.fontFamily || "Inter"}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-violet-400 group-hover:text-violet-300 flex items-center gap-1">
                      Apply <Sparkles className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ────────────── COLOR PALETTES GRID ────────────── */}
        {activeTab === "palettes" && (
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 scrollbar-thin">
            {filteredPalettes.map((palette) => {
              const isActive = activePaletteId === palette.id;

              return (
                <div
                  key={palette.id}
                  onClick={() => applyPalette(palette)}
                  className={`group cursor-pointer rounded-xl border p-4 transition-all flex flex-col justify-between relative overflow-hidden ${
                    isActive
                      ? "border-violet-500 ring-2 ring-violet-500/40 bg-violet-500/[0.08]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-0.5"
                  }`}
                >
                  {/* Swatch Color Bar */}
                  <div className="w-full h-11 rounded-lg overflow-hidden flex border border-white/10 shadow-sm relative mb-3">
                    {palette.previewColors.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex-1 h-full transition-transform group-hover:scale-y-110"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}

                    {isActive && (
                      <div className="absolute right-2 top-2 w-5 h-5 rounded-full bg-violet-500 text-white flex items-center justify-center shadow-lg">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                        {palette.name}
                      </h3>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                        {palette.category}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-3">
                      {palette.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] text-white/40">Harmonious Palette</span>
                    <span className="text-xs font-semibold text-fuchsia-400 group-hover:text-fuchsia-300 flex items-center gap-1">
                      Apply Palette <Sparkles className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredPalettes.length === 0 && (
              <div className="col-span-full py-16 text-center text-sm text-white/40">
                No color themes found matching &quot;{paletteSearch}&quot; in {selectedPaletteCat}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
