"use client";

import { useConfig } from "@/lib/config-context";
import StudioSection from "./StudioSection";
import { TEMPLATES } from "@/lib/templates";
import { TemplateCategory, TemplateConfig } from "@/types/config";
import { LayoutTemplate, Check, Sparkles } from "lucide-react";
import { useState } from "react";

const CATEGORIES: TemplateCategory[] = [
  "All",
  "Modern",
  "Aesthetic",
  "Dark/Cyber",
  "Minimal",
  "Luxury",
  "Vibrant",
  "Nature",
];

export default function TemplatesPanel({ onSelect }: { onSelect?: () => void }) {
  const { config, setConfig } = useConfig();
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("All");
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>("apple-liquid-glass");

  const filteredTemplates =
    selectedCategory === "All"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedCategory);

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

  return (
    <StudioSection
      title={`Design Templates (${TEMPLATES.length})`}
      icon={<LayoutTemplate className="w-4 h-4 text-violet-400" />}
      defaultOpen
    >
      {/* Category Pills Filter */}
      <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 px-2.5 py-1 text-[11px] rounded-full font-medium transition-all ${
              selectedCategory === cat
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
                {/* Subtle sheen overlay */}
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

              {/* Title & Description */}
              <div>
                <h4 className="text-xs font-semibold text-white/90 group-hover:text-white truncate">
                  {template.name}
                </h4>
                <p className="text-[10px] text-white/40 line-clamp-2 leading-tight mt-0.5">
                  {template.description}
                </p>
              </div>

              {/* Accent footer */}
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
    </StudioSection>
  );
}
