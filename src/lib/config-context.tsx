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
      const parsed = JSON.parse(raw) as BioConfig;
      // Merge with defaults to handle any missing new fields
      return deepMerge(DEFAULT_CONFIG, parsed) as BioConfig;
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

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(
        target[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>
      );
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

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
