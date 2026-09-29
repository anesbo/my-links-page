"use client";

import { useConfig } from "@/lib/config-context";
import BioPreview from "@/components/preview/BioPreview";
import IdentityPanel from "@/components/studio/IdentityPanel";
import ThemePanel from "@/components/studio/ThemePanel";
import LinkStylePanel from "@/components/studio/LinkStylePanel";
import LinkManagerPanel from "@/components/studio/LinkManagerPanel";
import FooterPanel from "@/components/studio/FooterPanel";
import TemplatesPanel from "@/components/studio/TemplatesPanel";
import TemplatesModal from "@/components/studio/TemplatesModal";
import {
  RotateCcw,
  Download,
  Upload,
  Monitor,
  Smartphone,
  ExternalLink,
  Sparkles,
  LayoutTemplate,
} from "lucide-react";
import { useState, useRef } from "react";
import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";

export default function StudioPage() {
  const { config, setConfig, resetConfig, exportConfig, importConfig } = useConfig();
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const [showImport, setShowImport] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = exportConfig();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bio-config.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    const success = importConfig(importText);
    if (success) {
      setShowImport(false);
      setImportText("");
      setImportError("");
    } else {
      setImportError("Invalid config JSON. Must contain identity, theme, and links.");
    }
  }

  function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const success = importConfig(text);
      if (!success) {
        setImportError("Invalid config file.");
      } else {
        setShowImport(false);
      }
    };
    reader.readAsText(file);
  }

  function quickApplyTemplate(id: string) {
    const t = TEMPLATES.find((item) => item.id === id);
    if (!t) return;
    setConfig({
      ...config,
      theme: {
        ...config.theme,
        ...t.config.theme,
        background: {
          ...config.theme.background,
          ...(t.config.theme.background || {}),
        },
      },
      identity: {
        ...config.identity,
        ...(t.config.identity || {}),
      },
      linkStyle: {
        ...config.linkStyle,
        ...t.config.linkStyle,
      },
      footer: {
        ...config.footer,
        ...(t.config.footer || {}),
      },
    });
  }

  return (
    <div className="h-screen flex flex-col bg-[#0d0d1a] text-white overflow-hidden">
      {/* Top Bar */}
      <header className="shrink-0 h-14 flex items-center justify-between px-5 border-b border-white/[0.06] bg-[#0d0d1a]/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-sm font-bold tracking-tight">
              LinkTree{" "}
              <span className="text-violet-400 font-medium">Studio</span>
            </h1>
          </div>

          {/* Templates Gallery Button */}
          <button
            onClick={() => setShowTemplatesModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 hover:from-violet-600/40 hover:to-fuchsia-600/40 border border-violet-500/40 text-violet-200 transition-all shadow-sm"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-violet-400" />
            <span>Templates</span>
            <span className="text-[10px] bg-violet-500/30 text-white px-1.5 py-0.2 rounded-full font-bold">
              {TEMPLATES.length}
            </span>
          </button>

          {/* Quick Preset Buttons */}
          <div className="hidden xl:flex items-center gap-1.5 pl-3 border-l border-white/10">
            <button
              onClick={() => quickApplyTemplate("apple-liquid-glass")}
              className="px-2 py-1 text-[11px] rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              Liquid Glass 
            </button>
            <button
              onClick={() => quickApplyTemplate("cyberpunk-neon")}
              className="px-2 py-1 text-[11px] rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              Cyberpunk ⚡
            </button>
            <button
              onClick={() => quickApplyTemplate("midnight-nebula")}
              className="px-2 py-1 text-[11px] rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              Midnight ✨
            </button>
            <button
              onClick={() => quickApplyTemplate("matcha-zen")}
              className="px-2 py-1 text-[11px] rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              Matcha 🍃
            </button>
            <button
              onClick={() => quickApplyTemplate("royal-velvet")}
              className="px-2 py-1 text-[11px] rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              Royal Gold 👑
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview Mode Toggle */}
          <div className="flex items-center gap-0.5 p-0.5 bg-white/5 rounded-lg border border-white/[0.06]">
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                previewMode === "mobile"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              }`}
              title="Mobile device preview (no scrollbar)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                previewMode === "desktop"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              }`}
              title="Full PC Desktop preview"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
          </div>

          <div className="w-px h-6 bg-white/[0.08] mx-1" />

          {/* Action buttons */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 hover:text-white/90 rounded-lg hover:bg-white/5 transition-all"
            title="Export config JSON"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 hover:text-white/90 rounded-lg hover:bg-white/5 transition-all"
            title="Import config JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            Import
          </button>
          <button
            onClick={resetConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-all"
            title="Reset to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <div className="w-px h-6 bg-white/[0.08] mx-1" />

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-all shadow-md shadow-violet-600/30"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Live
          </Link>
        </div>
      </header>

      {/* Main Studio Area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar Controls */}
        <aside className="w-[395px] shrink-0 border-r border-white/[0.06] overflow-y-auto bg-[#0d0d1a] scrollbar-thin">
          <div className="p-4 space-y-3">
            <TemplatesPanel />
            <IdentityPanel />
            <ThemePanel />
            <LinkStylePanel />
            <LinkManagerPanel />
            <FooterPanel />
          </div>
        </aside>

        {/* Live Interactive Preview */}
        <div className="flex-1 flex items-center justify-center bg-[#080812] overflow-hidden relative p-4">
          {/* Grid pattern background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div
            className={`relative transition-all duration-500 ease-out flex flex-col items-center justify-center ${
              previewMode === "mobile"
                ? "w-[375px] h-[812px] max-h-[92vh]"
                : "w-full h-full max-w-4xl max-h-[92vh]"
            }`}
          >
            {/* Phone outer bezel mockup for mobile */}
            {previewMode === "mobile" && (
              <>
                <div className="absolute -inset-3 rounded-[48px] border-2 border-white/[0.12] bg-black/40 pointer-events-none shadow-2xl shadow-black/80" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-black/80 border border-white/10 z-30 pointer-events-none" />
              </>
            )}

            {/* Inner frame */}
            <div
              className={`w-full h-full overflow-y-auto flex flex-col ${
                previewMode === "mobile"
                  ? "rounded-[36px] ring-1 ring-white/[0.08] no-scrollbar"
                  : "rounded-xl ring-1 ring-white/[0.08] shadow-2xl"
              }`}
            >
              <BioPreview config={config} interactive />
            </div>
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      <TemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
      />

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-[#16162a] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-lg font-bold mb-4">Import Configuration</h2>
            <textarea
              value={importText}
              onChange={(e) => {
                setImportText(e.target.value);
                setImportError("");
              }}
              placeholder="Paste your config JSON here..."
              className="w-full h-48 px-4 py-3 text-sm font-mono rounded-xl bg-white/5 border border-white/10 text-white/80 placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 resize-none"
            />
            {importError && (
              <p className="text-red-400 text-xs mt-2">{importError}</p>
            )}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleImport}
                className="px-4 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
              >
                Import JSON
              </button>
              <span className="text-xs text-white/30">or</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 text-white/70 rounded-lg border border-white/10 transition-colors"
              >
                Upload File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
              <button
                onClick={() => {
                  setShowImport(false);
                  setImportError("");
                }}
                className="ml-auto px-4 py-2 text-sm text-white/50 hover:text-white/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
