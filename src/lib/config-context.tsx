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

interface ConfigContextValue {
  config: BioConfig;
  setConfig: (config: BioConfig) => void;
  updateConfig: (updater: (prev: BioConfig) => BioConfig) => void;
  resetConfig: () => void;
  exportConfig: () => string;
  importConfig: (json: string) => boolean;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

function loadConfig(): BioConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults to handle any missing new fields
      return deepMerge(DEFAULT_CONFIG, parsed);
    }
  } catch {
    // corrupted storage
  }
  return DEFAULT_CONFIG;
}

function saveConfig(config: BioConfig) {
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
      sv && typeof sv === "object" && !Array.isArray(sv) &&
      tv && typeof tv === "object" && !Array.isArray(tv)
    ) {
      output[key] = deepMerge(tv, sv);
    } else {
      output[key] = sv;
    }
  }
  return output as T;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<BioConfig>(DEFAULT_CONFIG);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConfigState(loadConfig());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveConfig(config);
    }
  }, [config, hydrated]);

  const setConfig = useCallback((newConfig: BioConfig) => {
    setConfigState(newConfig);
  }, []);

  const updateConfig = useCallback(
    (updater: (prev: BioConfig) => BioConfig) => {
      setConfigState((prev) => updater(prev));
    },
    []
  );

  const resetConfig = useCallback(() => {
    setConfigState(DEFAULT_CONFIG);
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

  return (
    <ConfigContext.Provider
      value={{ config, setConfig, updateConfig, resetConfig, exportConfig, importConfig }}
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
