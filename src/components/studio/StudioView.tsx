"use client";

import { useConfig } from "@/lib/config-context";
import BioPreview from "@/components/preview/BioPreview";
import IdentityPanel from "@/components/studio/IdentityPanel";
import ThemePanel from "@/components/studio/ThemePanel";
import LinkStylePanel from "@/components/studio/LinkStylePanel";
import LinkManagerPanel from "@/components/studio/LinkManagerPanel";
import FooterPanel from "@/components/studio/FooterPanel";
import {
  RotateCcw,
  Download,
  Upload,
  Monitor,
  Smartphone,
  ExternalLink,
  Sparkles,
  Layers,
} from "lucide-react";
import { useState, useRef } from "react";
import Link from "next/link";
import { BioConfig } from "@/types/config";

export default function StudioPage() {
  const { config, setConfig, resetConfig, exportConfig, importConfig } = useConfig();
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const [showImport, setShowImport] = useState(false);
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

  // Quick Preset Themes to showcase maximum customizability
  function applyPresetTheme(type: "iphone" | "cyber" | "space" | "sunset") {
    if (type === "iphone") {
      setConfig({
        ...config,
        theme: {
          ...config.theme,
          background: {
            ...config.theme.background,
            type: "image",
            imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
            imageOpacity: 90,
            imageBlur: 0,
            imageOverlayColor: "#050510",
            imageOverlayOpacity: 25,
            shapesEnabled: true,
            shapesStyle: "blobs",
            shapesOpacity: 35,
            shapesColor: "#a855f7",
          },
          fontFamily: "display",
          headingColor: "#ffffff",
          bioTextColor: "#cbd5e1",
        },
        identity: {
          ...config.identity,
          avatarShape: "rounded-square",
          avatarSize: 96,
          avatarBorderWidth: 2,
          avatarBorderColor: "rgba(255,255,255,0.4)",
          avatarGlow: true,
          avatarGlowColor: "#c084fc",
          avatarGlowRadius: 22,
          avatarGlowPulse: true,
        },
        linkStyle: {
          ...config.linkStyle,
          cornerRadius: 20,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.28)",
          surfaceTreatment: "liquid-glass",
          surfaceColor: "#ffffff",
          surfaceOpacity: 12,
          shadow: "elevated",
          liquidGlassGleam: true,
          hoverEffect: "lift",
          textColor: "#ffffff",
          iconColor: "#c084fc",
        },
      });
    } else if (type === "cyber") {
      setConfig({
        ...config,
        theme: {
          ...config.theme,
          background: {
            ...config.theme.background,
            type: "image",
            imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
            imageOpacity: 85,
            imageBlur: 0,
            imageOverlayColor: "#090919",
            imageOverlayOpacity: 45,
            shapesEnabled: true,
            shapesStyle: "grid",
            shapesOpacity: 45,
            shapesColor: "#06b6d4",
          },
          fontFamily: "mono",
          headingColor: "#22d3ee",
          bioTextColor: "#94a3b8",
        },
        identity: {
          ...config.identity,
          avatarShape: "hexagon",
          avatarSize: 100,
          avatarBorderWidth: 2,
          avatarBorderColor: "#06b6d4",
          avatarGlow: true,
          avatarGlowColor: "#06b6d4",
          avatarGlowRadius: 24,
          avatarGlowPulse: true,
        },
        linkStyle: {
          ...config.linkStyle,
          cornerRadius: 8,
          borderWidth: 1,
          borderColor: "rgba(6,182,212,0.4)",
          surfaceTreatment: "glass",
          surfaceColor: "#0f172a",
          surfaceOpacity: 30,
          shadow: "glow",
          hoverEffect: "glow",
          textColor: "#f8fafc",
          iconColor: "#22d3ee",
        },
      });
    } else if (type === "space") {
      setConfig({
        ...config,
        theme: {
          ...config.theme,
          background: {
            ...config.theme.background,
            type: "image",
            imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
            imageOpacity: 90,
            imageBlur: 0,
            imageOverlayColor: "#030014",
            imageOverlayOpacity: 30,
            shapesEnabled: true,
            shapesStyle: "stars",
            shapesOpacity: 50,
            shapesColor: "#ffffff",
          },
          fontFamily: "cinzel",
          headingColor: "#f1f5f9",
          bioTextColor: "#cbd5e1",
        },
        identity: {
          ...config.identity,
          avatarShape: "circle",
          avatarSize: 96,
          avatarBorderWidth: 2,
          avatarBorderColor: "rgba(255,255,255,0.3)",
          avatarGlow: true,
          avatarGlowColor: "#818cf8",
          avatarGlowRadius: 20,
          avatarGlowPulse: false,
        },
        linkStyle: {
          ...config.linkStyle,
          cornerRadius: 18,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.18)",
          surfaceTreatment: "liquid-glass",
          surfaceColor: "#1e1b4b",
          surfaceOpacity: 16,
          shadow: "elevated",
          liquidGlassGleam: true,
          hoverEffect: "scale",
          textColor: "#ffffff",
          iconColor: "#a5b4fc",
        },
      });
    } else if (type === "sunset") {
      setConfig({
        ...config,
        theme: {
          ...config.theme,
          background: {
            ...config.theme.background,
            type: "image",
            imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
            imageOpacity: 85,
            imageBlur: 0,
            imageOverlayColor: "#1f1005",
            imageOverlayOpacity: 40,
            shapesEnabled: true,
            shapesStyle: "bokeh",
            shapesOpacity: 35,
            shapesColor: "#f59e0b",
          },
          fontFamily: "syne",
          headingColor: "#fef3c7",
          bioTextColor: "#fed7aa",
        },
        identity: {
          ...config.identity,
          avatarShape: "circle",
          avatarSize: 96,
          avatarBorderWidth: 2,
          avatarBorderColor: "#f59e0b",
          avatarGlow: true,
          avatarGlowColor: "#f59e0b",
          avatarGlowRadius: 25,
          avatarGlowPulse: false,
        },
        linkStyle: {
          ...config.linkStyle,
          cornerRadius: 16,
          borderWidth: 1,
          borderColor: "rgba(245,158,11,0.3)",
          surfaceTreatment: "liquid-glass",
          surfaceColor: "#291500",
          surfaceOpacity: 15,
          shadow: "subtle",
          liquidGlassGleam: true,
          hoverEffect: "lift",
          textColor: "#fffbeb",
          iconColor: "#fbbf24",
        },
      });
    }
  }

  return (
    <div className="h-screen flex flex-col bg-[#0d0d1a] text-white overflow-hidden">
      {/* Top Bar */}
      <header className="shrink-0 h-14 flex items-center justify-between px-5 border-b border-white/[0.06] bg-[#0d0d1a]/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-sm font-bold tracking-tight">
              LinkTree{" "}
              <span className="text-violet-400 font-medium">Studio</span>
            </h1>
          </div>

          {/* Quick Preset Buttons */}
          <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-white/10">
            <span className="text-[11px] text-white/40 flex items-center gap-1">
              <Layers className="w-3 h-3 text-violet-400" /> Presets:
            </span>
            <button
              onClick={() => applyPresetTheme("iphone")}
              className="px-2 py-1 text-[11px] rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              Liquid Glass 
            </button>
            <button
              onClick={() => applyPresetTheme("cyber")}
              className="px-2 py-1 text-[11px] rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              Cyber Neon
            </button>
            <button
              onClick={() => applyPresetTheme("space")}
              className="px-2 py-1 text-[11px] rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              Deep Space
            </button>
            <button
              onClick={() => applyPresetTheme("sunset")}
              className="px-2 py-1 text-[11px] rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              Sunset Glow
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview Toggle */}
          <div className="flex items-center gap-0.5 p-0.5 bg-white/5 rounded-lg border border-white/[0.06]">
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                previewMode === "mobile"
                  ? "bg-violet-500 text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              }`}
              title="Mobile device preview (no scrollbars)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                previewMode === "desktop"
                  ? "bg-violet-500 text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              }`}
              title="Full PC Desktop preview"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
          </div>

          <div className="w-px h-6 bg-white/[0.08] mx-1" />

          {/* Actions */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 hover:text-white/90 rounded-lg hover:bg-white/5 transition-all"
            title="Export config"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 hover:text-white/90 rounded-lg hover:bg-white/5 transition-all"
            title="Import config"
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-all shadow-md shadow-violet-600/30"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Live
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar Controls */}
        <aside className="w-[390px] shrink-0 border-r border-white/[0.06] overflow-y-auto bg-[#0d0d1a] scrollbar-thin">
          <div className="p-4 space-y-3">
            <IdentityPanel />
            <ThemePanel />
            <LinkStylePanel />
            <LinkManagerPanel />
            <FooterPanel />
          </div>
        </aside>

        {/* Live Preview Area */}
        <div className="flex-1 flex items-center justify-center bg-[#080812] overflow-hidden relative p-4">
          {/* Subtle grid pattern background */}
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
                {/* Dynamic Island / Speaker notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-black/80 border border-white/10 z-30 pointer-events-none" />
              </>
            )}

            {/* Inner frame: scrollbar removed on mobile with no-scrollbar */}
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

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
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
