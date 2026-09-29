"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { BioConfig } from "@/types/config";
import { DEFAULT_CONFIG } from "@/lib/defaults";

const STORAGE_KEY = "linktree-bio-config";
const PUBLISHED_TIME_KEY = "linktree-published-at";
const ADMIN_SECRET_KEY = "linktree-admin-secret";

interface ConfigContextValue {
  config: BioConfig;
  publishedConfig: BioConfig;
  isConfigured: boolean;
  publishedAt: string | null;
  isPublishing: boolean;
  hasUnpublishedChanges: boolean;
  adminSecret: string;
  setAdminSecret: (secret: string) => void;
  setConfig: (config: BioConfig) => void;
  updateConfig: (updater: (prev: BioConfig) => BioConfig) => void;
  resetConfig: () => void;
  exportConfig: () => string;
  importConfig: (json: string) => boolean;
  publishConfig: (secret?: string) => Promise<{ success: boolean; error?: string }>;
  pullFromLive: () => Promise<boolean>;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

function loadLocalDraft(fallback: BioConfig): BioConfig {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return deepMerge(fallback, parsed);
    }
  } catch {
    // corrupted storage
  }
  return fallback;
}

function saveLocalDraft(config: BioConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // quota exceeded
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function deepMerge<T>(target: T, source: any): T {
  if (!source || typeof source !== "object" || Array.isArray(source)) return source as T;
  const output: any = { ...(target as any) };
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = (target as any)[key];
    if (
      sv &&
      typeof sv === "object" &&
      !Array.isArray(sv) &&
      tv &&
      typeof tv === "object" &&
      !Array.isArray(tv)
    ) {
      output[key] = deepMerge(tv, sv);
    } else {
      output[key] = sv;
    }
  }
  return output as T;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

interface ConfigProviderProps {
  children: ReactNode;
  initialConfig?: BioConfig;
  isConfigured?: boolean;
  initialPublishedAt?: string;
}

export function ConfigProvider({
  children,
  initialConfig = DEFAULT_CONFIG,
  isConfigured = false,
  initialPublishedAt = undefined,
}: ConfigProviderProps) {
  const [config, setConfigState] = useState<BioConfig>(initialConfig);
  const [publishedConfig, setPublishedConfig] = useState<BioConfig>(initialConfig);
  const [isConfiguredState, setIsConfiguredState] = useState<boolean>(isConfigured);
  const [publishedAt, setPublishedAt] = useState<string | null>(initialPublishedAt || null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [adminSecret, setAdminSecretState] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);

  // Initialize and hydrate
  useEffect(() => {
    // Load stored admin secret if present
    const savedSecret = localStorage.getItem(ADMIN_SECRET_KEY) || "";
    setAdminSecretState(savedSecret);

    const savedPublishedAt = localStorage.getItem(PUBLISHED_TIME_KEY) || initialPublishedAt || null;
    if (savedPublishedAt) setPublishedAt(savedPublishedAt);

    const isStudio =
      typeof window !== "undefined" && window.location.pathname.startsWith("/studio");

    // If on Studio, load local draft if one exists
    if (isStudio) {
      const draft = loadLocalDraft(initialConfig);
      setConfigState(draft);
    } else {
      // On public page, prefer live initial config
      setConfigState(initialConfig);
    }

    // Refresh status from /api/config
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.isConfigured !== undefined) {
          setIsConfiguredState(data.isConfigured);
        }
        if (data.config) {
          setPublishedConfig(data.config);
          if (data.publishedAt) {
            setPublishedAt(data.publishedAt);
            localStorage.setItem(PUBLISHED_TIME_KEY, data.publishedAt);
          }
          // On public view, keep in sync with online config
          if (!isStudio) {
            setConfigState(data.config);
          }
        }
      })
      .catch((err) => {
        console.warn("Could not check /api/config:", err);
      })
      .finally(() => {
        setHydrated(true);
      });
  }, [initialConfig, initialPublishedAt]);

  // Auto-save local draft while editing in Studio
  useEffect(() => {
    if (hydrated) {
      const isStudio =
        typeof window !== "undefined" && window.location.pathname.startsWith("/studio");
      if (isStudio) {
        saveLocalDraft(config);
      }
    }
  }, [config, hydrated]);

  const setConfig = useCallback((newConfig: BioConfig) => {
    setConfigState(newConfig);
  }, []);

  const updateConfig = useCallback((updater: (prev: BioConfig) => BioConfig) => {
    setConfigState((prev) => updater(prev));
  }, []);

  const resetConfig = useCallback(() => {
    setConfigState(DEFAULT_CONFIG);
  }, []);

  const setAdminSecret = useCallback((secret: string) => {
    setAdminSecretState(secret);
    if (typeof window !== "undefined") {
      localStorage.setItem(ADMIN_SECRET_KEY, secret);
    }
  }, []);

  const exportConfig = useCallback(() => {
    return JSON.stringify(config, null, 2);
  }, [config]);

  const importConfig = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as BioConfig;
      if (parsed.identity && parsed.theme && parsed.links) {
        setConfigState(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Publish to Redis
  const publishConfig = useCallback(
    async (secretOverride?: string): Promise<{ success: boolean; error?: string }> => {
      setIsPublishing(true);
      const secretToUse = secretOverride !== undefined ? secretOverride : adminSecret;

      try {
        const res = await fetch("/api/config", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(secretToUse ? { "x-admin-secret": secretToUse } : {}),
          },
          body: JSON.stringify({
            config,
            secret: secretToUse,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          const err = data.error || "Failed to publish configuration.";
          return { success: false, error: err };
        }

        // Successfully published
        setPublishedConfig(config);
        setIsConfiguredState(true);
        if (data.publishedAt) {
          setPublishedAt(data.publishedAt);
          localStorage.setItem(PUBLISHED_TIME_KEY, data.publishedAt);
        }
        saveLocalDraft(config);

        return { success: true };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Network error publishing config";
        return { success: false, error: errorMsg };
      } finally {
        setIsPublishing(false);
      }
    },
    [config, adminSecret]
  );

  // Pull latest from live online
  const pullFromLive = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      if (data && data.config) {
        setConfigState(data.config);
        setPublishedConfig(data.config);
        if (data.publishedAt) {
          setPublishedAt(data.publishedAt);
          localStorage.setItem(PUBLISHED_TIME_KEY, data.publishedAt);
        }
        saveLocalDraft(data.config);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Compare config with publishedConfig
  const hasUnpublishedChanges =
    JSON.stringify(config) !== JSON.stringify(publishedConfig);

  return (
    <ConfigContext.Provider
      value={{
        config,
        publishedConfig,
        isConfigured: isConfiguredState,
        publishedAt,
        isPublishing,
        hasUnpublishedChanges,
        adminSecret,
        setAdminSecret,
        setConfig,
        updateConfig,
        resetConfig,
        exportConfig,
        importConfig,
        publishConfig,
        pullFromLive,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
}
