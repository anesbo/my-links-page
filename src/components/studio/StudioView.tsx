"use client";

import { useConfig } from "@/lib/config-context";
import BioPreview from "@/components/preview/BioPreview";
import IdentityPanel from "@/components/studio/IdentityPanel";
import ThemePanel from "@/components/studio/ThemePanel";
import LinkStylePanel from "@/components/studio/LinkStylePanel";
import LinkManagerPanel from "@/components/studio/LinkManagerPanel";
import {
  RotateCcw,
  Download,
  Upload,
  Monitor,
  Smartphone,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useState, useRef } from "react";
import Link from "next/link";

export default function StudioPage() {
  const { config, resetConfig, exportConfig, importConfig } = useConfig();
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

  return (
    <div className="h-screen flex flex-col bg-[#0d0d1a] text-white overflow-hidden">
      {/* Top Bar */}
      <header className="shrink-0 h-14 flex items-center justify-between px-5 border-b border-white/[0.06] bg-[#0d0d1a]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-sm font-bold tracking-tight">
              LinkTree{" "}
              <span className="text-violet-400 font-medium">Studio</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview Toggle */}
          <div className="flex items-center gap-0.5 p-0.5 bg-white/5 rounded-lg">
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`p-1.5 rounded-md transition-all ${
                previewMode === "mobile"
                  ? "bg-violet-500/80 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
              title="Mobile preview"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`p-1.5 rounded-md transition-all ${
                previewMode === "desktop"
                  ? "bg-violet-500/80 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
              title="Desktop preview"
            >
              <Monitor className="w-4 h-4" />
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-violet-500/80 hover:bg-violet-500 text-white rounded-lg transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Live
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <aside className="w-[380px] shrink-0 border-r border-white/[0.06] overflow-y-auto bg-[#0d0d1a] scrollbar-thin">
          <div className="p-4 space-y-3">
            <IdentityPanel />
            <ThemePanel />
            <LinkStylePanel />
            <LinkManagerPanel />
          </div>
        </aside>

        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center bg-[#080812] overflow-hidden relative">
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
            className={`relative transition-all duration-500 ease-out ${
              previewMode === "mobile"
                ? "w-[375px] h-[812px] max-h-[90vh]"
                : "w-full h-full max-w-4xl max-h-[90vh]"
            }`}
          >
            {/* Device frame for mobile */}
            {previewMode === "mobile" && (
              <div className="absolute -inset-3 rounded-[44px] border border-white/[0.08] bg-black/20 pointer-events-none shadow-2xl shadow-black/50" />
            )}
            <div
              className={`w-full h-full overflow-y-auto ${
                previewMode === "mobile"
                  ? "rounded-[32px] ring-1 ring-white/[0.06]"
                  : "rounded-xl ring-1 ring-white/[0.06]"
              }`}
            >
              <BioPreview config={config} interactive />
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
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
                className="px-4 py-2 text-sm bg-violet-500 hover:bg-violet-400 text-white rounded-lg transition-colors"
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
