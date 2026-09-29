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
  Cloud,
  CloudUpload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";
import { useState, useRef } from "react";
import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";

export default function StudioPage() {
  const {
    config,
    setConfig,
    resetConfig,
    exportConfig,
    importConfig,
    isConfigured,
    publishedAt,
    isPublishing,
    hasUnpublishedChanges,
    publishConfig,
    pullFromLive,
    adminSecret,
    setAdminSecret,
  } = useConfig();

  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const [showImport, setShowImport] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showCloudSetupModal, setShowCloudSetupModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [secretInput, setSecretInput] = useState(adminSecret);
  const [isPullingLive, setIsPullingLive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function triggerToast(text: string, type: "success" | "error" | "info" = "success") {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }

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
      triggerToast("Configuration loaded into Studio draft!", "info");
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
        triggerToast("Configuration loaded into Studio draft!", "info");
      }
    };
    reader.readAsText(file);
  }

  async function handlePublish() {
    if (!isConfigured) {
      setShowCloudSetupModal(true);
      return;
    }

    const res = await publishConfig(secretInput);
    if (res.success) {
      triggerToast("🎉 Published live! Anyone opening your link will now see these changes.");
    } else {
      if (res.error?.toLowerCase().includes("unauthorized")) {
        triggerToast("Unauthorized: Please verify your Admin Secret.", "error");
        setShowCloudSetupModal(true);
      } else if (res.error?.toLowerCase().includes("not configured")) {
        setShowCloudSetupModal(true);
      } else {
        triggerToast(res.error || "Failed to publish.", "error");
      }
    }
  }

  async function handlePullLive() {
    setIsPullingLive(true);
    const success = await pullFromLive();
    setIsPullingLive(false);
    if (success) {
      triggerToast("Draft synced with current live online configuration!", "info");
    } else {
      triggerToast("Could not fetch live configuration.", "error");
    }
  }

  function copyToClipboard(text: string, keyName: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
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
    <div className="h-screen flex flex-col bg-[#0d0d1a] text-white overflow-hidden relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-[150] px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl border text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
            toastMessage.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-900/30"
              : toastMessage.type === "error"
              ? "bg-red-950/90 border-red-500/40 text-red-200 shadow-red-900/30"
              : "bg-violet-950/90 border-violet-500/40 text-violet-200 shadow-violet-900/30"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : toastMessage.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Bar */}
      <header className="shrink-0 h-14 flex items-center justify-between px-5 border-b border-white/[0.06] bg-[#0d0d1a]/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-sm font-bold tracking-tight">
              LinkTree <span className="text-violet-400 font-medium">Studio</span>
            </h1>
          </div>

          {/* Online Sync / Cloud Status Pill */}
          <button
            onClick={() => setShowCloudSetupModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08]"
            title="Cloud storage status (Click to configure)"
          >
            {isConfigured ? (
              hasUnpublishedChanges ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-amber-200">Unpublished Edits</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-300">Live & Synced</span>
                </>
              )
            ) : (
              <>
                <Cloud className="w-3 h-3 text-white/40" />
                <span className="text-white/50">Local Only (Setup Cloud)</span>
              </>
            )}
          </button>

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
          <div className="hidden 2xl:flex items-center gap-1.5 pl-3 border-l border-white/10">
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
              title="Mobile device preview"
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
              title="Desktop preview"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
          </div>

          <div className="w-px h-6 bg-white/[0.08] mx-1" />

          {/* Action buttons */}
          {isConfigured && hasUnpublishedChanges && (
            <button
              onClick={handlePullLive}
              disabled={isPullingLive}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-white/60 hover:text-white/90 rounded-lg hover:bg-white/5 transition-all"
              title="Discard draft and revert to live online version"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isPullingLive ? "animate-spin text-violet-400" : ""}`}
              />
              <span className="hidden sm:inline">Revert to Live</span>
            </button>
          )}

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

          {/* PUBLISH LIVE BUTTON */}
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all shadow-md active:scale-95 ${
              isPublishing
                ? "bg-violet-700/50 text-white/60 cursor-not-allowed"
                : hasUnpublishedChanges
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/30 animate-pulse"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-600/30"
            }`}
            title="Publish changes to cloud so everyone visiting sees them"
          >
            {isPublishing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-3.5 h-3.5" />
                <span>{hasUnpublishedChanges ? "Publish Live" : "Published"}</span>
              </>
            )}
          </button>

          {/* View Live Link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/90 rounded-lg transition-all border border-white/10"
          >
            <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
            <span>Open Link</span>
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
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
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

      {/* Cloud Setup Modal */}
      {showCloudSetupModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[120] flex items-center justify-center p-4">
          <div className="bg-[#141428] border border-white/15 rounded-2xl p-6 w-full max-w-xl shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold">Cloud Database Sync (Upstash Redis)</h2>
                  <p className="text-xs text-white/50">
                    Store your page online so anyone clicking your link sees your latest edits.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCloudSetupModal(false)}
                className="text-white/40 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-4 text-xs text-white/80">
              {isConfigured ? (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-emerald-300 text-sm">Upstash Redis Connected</h3>
                    <p className="text-emerald-200/80 mt-1">
                      Your cloud database is connected! Whenever you click{" "}
                      <strong className="text-white">Publish Live</strong>, your configuration is saved
                      instantly to Upstash Redis and served to all visitors.
                    </p>
                    {publishedAt && (
                      <p className="text-[11px] text-white/50 mt-1.5">
                        Last published online: {new Date(publishedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-300 text-sm">Credentials Not Detected Yet</h3>
                    <p className="text-amber-200/80 mt-1">
                      To make your page live for everyone, connect a free Upstash Redis database (takes 1
                      minute, 100% free).
                    </p>
                  </div>
                </div>
              )}

              {/* Instructions steps */}
              <div className="space-y-3 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                <div className="font-semibold text-white flex items-center justify-between">
                  <span>How to connect in 3 steps:</span>
                  <a
                    href="https://console.upstash.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-violet-400 hover:text-violet-300 flex items-center gap-1 text-[11px]"
                  >
                    Open Upstash Console <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-2 text-white/70">
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-violet-600/30 text-violet-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </span>
                    <p>
                      Log in to{" "}
                      <a
                        href="https://console.upstash.com"
                        target="_blank"
                        className="text-violet-400 underline"
                      >
                        console.upstash.com
                      </a>{" "}
                      and click <strong>&quot;Create Database&quot;</strong> (free tier).
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-violet-600/30 text-violet-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </span>
                    <p>
                      Scroll down to the <strong>&quot;REST API&quot;</strong> section and copy the URL and Token.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-violet-600/30 text-violet-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </span>
                    <p>
                      Paste them into your local <code className="text-violet-300 font-mono">.env.local</code>{" "}
                      (or in Vercel project Settings &gt; Environment Variables if deployed):
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/10 font-mono text-[11px]">
                    <span className="text-white/60">UPSTASH_REDIS_REST_URL</span>
                    <button
                      onClick={() => copyToClipboard("UPSTASH_REDIS_REST_URL", "url")}
                      className="text-violet-400 hover:text-violet-300 flex items-center gap-1 text-[10px]"
                    >
                      {copiedKey === "url" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === "url" ? "Copied" : "Copy name"}</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/10 font-mono text-[11px]">
                    <span className="text-white/60">UPSTASH_REDIS_REST_TOKEN</span>
                    <button
                      onClick={() => copyToClipboard("UPSTASH_REDIS_REST_TOKEN", "token")}
                      className="text-violet-400 hover:text-violet-300 flex items-center gap-1 text-[10px]"
                    >
                      {copiedKey === "token" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === "token" ? "Copied" : "Copy name"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Admin Passkey */}
              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-violet-400" />
                  <span className="font-semibold text-white">Admin Passkey (Optional)</span>
                </div>
                <p className="text-[11px] text-white/60">
                  If you set an <code className="text-violet-300 font-mono">ADMIN_SECRET</code> in your environment to prevent unauthorized edits, enter it here:
                </p>
                <input
                  type="password"
                  value={secretInput}
                  onChange={(e) => {
                    setSecretInput(e.target.value);
                    setAdminSecret(e.target.value);
                  }}
                  placeholder="Enter passkey..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-violet-500/60"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                onClick={() => setShowCloudSetupModal(false)}
                className="px-4 py-2 text-xs text-white/50 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowCloudSetupModal(false);
                  handlePublish();
                }}
                className="px-4 py-2 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-all"
              >
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}

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
