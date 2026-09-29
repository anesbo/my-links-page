"use client";

import { useConfig } from "@/lib/config-context";
import { TEMPLATES } from "@/lib/templates";
import { TemplateCategory, TemplateConfig } from "@/types/config";
import { LayoutTemplate, X, Check, Sparkles } from "lucide-react";
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

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplatesModal({ isOpen, onClose }: TemplatesModalProps) {
  const { config, setConfig } = useConfig();
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("All");
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>("apple-liquid-glass");

  if (!isOpen) return null;

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
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[88vh] bg-[#121224] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#121224]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <LayoutTemplate className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Explore Design Templates
                <span className="text-xs font-normal text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                  {TEMPLATES.length} Styles
                </span>
              </h2>
              <p className="text-xs text-white/50">
                Pick any professionally designed aesthetic to transform your bio page instantly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="shrink-0 px-6 py-3 border-b border-white/[0.06] bg-white/[0.01] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Gallery Grid */}
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
                {/* Visual Card Banner */}
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

                  {/* Mock preview capsules inside thumbnail */}
                  <div className="space-y-1 relative z-10 pointer-events-none">
                    <div className="h-2.5 w-3/4 rounded-full bg-white/30 backdrop-blur-sm" />
                    <div className="h-2.5 w-full rounded-full bg-white/20 backdrop-blur-sm" />
                  </div>
                </div>

                {/* Details */}
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

                {/* Action Button */}
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
      </div>
    </div>
  );
}
