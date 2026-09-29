import { Redis } from "@upstash/redis";
import { BioConfig } from "@/types/config";
import { DEFAULT_CONFIG } from "@/lib/defaults";

export const CONFIG_REDIS_KEY = "linktree:published_config";

export function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  try {
    return new Redis({
      url,
      token,
    });
  } catch (err) {
    console.error("Failed to initialize Upstash Redis client:", err);
    return null;
  }
}

export async function getPublishedConfig(): Promise<{
  config: BioConfig;
  isConfigured: boolean;
  publishedAt?: string;
}> {
  const redis = getRedisClient();

  if (!redis) {
    return {
      config: DEFAULT_CONFIG,
      isConfigured: false,
    };
  }

  try {
    const data = await redis.get<{
      config: BioConfig;
      updatedAt?: string;
    } | BioConfig>(CONFIG_REDIS_KEY);

    if (!data) {
      return {
        config: DEFAULT_CONFIG,
        isConfigured: true,
      };
    }

    // Check if wrapped with metadata or raw config
    if ("config" in data && data.config) {
      return {
        config: data.config,
        isConfigured: true,
        publishedAt: data.updatedAt,
      };
    }

    return {
      config: data as BioConfig,
      isConfigured: true,
    };
  } catch (err) {
    console.error("Error reading config from Redis:", err);
    return {
      config: DEFAULT_CONFIG,
      isConfigured: true,
    };
  }
}

export async function savePublishedConfig(config: BioConfig): Promise<{
  success: boolean;
  publishedAt?: string;
  error?: string;
}> {
  const redis = getRedisClient();

  if (!redis) {
    return {
      success: false,
      error:
        "Upstash Redis is not configured. Please add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to your environment variables.",
    };
  }

  try {
    const updatedAt = new Date().toISOString();
    await redis.set(CONFIG_REDIS_KEY, {
      config,
      updatedAt,
    });

    return {
      success: true,
      publishedAt: updatedAt,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save to Redis";
    console.error("Error saving config to Redis:", err);
    return {
      success: false,
      error: message,
    };
  }
}
