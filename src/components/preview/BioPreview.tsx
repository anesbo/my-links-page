"use client";

import { BioConfig } from "@/types/config";
import { getBackgroundStyle, getFontClass, getAvatarShapeStyle } from "@/lib/utils";
import { getLinkIcon, SOCIAL_ICONS } from "@/lib/icons";
import { BadgeCheck, MousePointerClick, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function hexToRgba(hex: string, alphaPercent: number = 100): string {
  if (!hex) return `rgba(139, 92, 246, ${(alphaPercent / 100).toFixed(2)})`;
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${(alphaPercent / 100).toFixed(2)})`;
}

interface BioPreviewProps {
  config: BioConfig;
  interactive?: boolean;
}

export default function BioPreview({ config, interactive = false }: BioPreviewProps) {
  const { identity, theme, linkStyle, links, analytics, footer } = config;
  const bgStyle = getBackgroundStyle(theme.background);
  const fontClass = getFontClass(theme.fontFamily);
  const fontSizeBase = theme.fontScale || 1;

  // Build link button styles
  function getLinkButtonStyle() {
    const base: React.CSSProperties = {
      borderRadius: linkStyle.cornerRadius >= 9999 ? "9999px" : `${linkStyle.cornerRadius}px`,
      borderWidth: `${linkStyle.borderWidth}px`,
      borderColor: linkStyle.borderColor,
      borderStyle: "solid",
      color: linkStyle.textColor,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      overflow: "hidden",
    };

    // Shadow style
    switch (linkStyle.shadow) {
      case "subtle":
        base.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        break;
      case "elevated":
        base.boxShadow = "0 10px 25px -5px rgba(0,0,0,0.3)";
        break;
      case "heavy":
        base.boxShadow = "0 20px 35px -8px rgba(0,0,0,0.5)";
        break;
      case "glow":
        base.boxShadow = `0 0 ${linkStyle.glowRadius ?? 20}px ${linkStyle.glowColor || "rgba(139,92,246,0.35)"}`;
        break;
      case "none":
      default:
        break;
    }

    switch (linkStyle.surfaceTreatment) {
      case "solid":
        base.backgroundColor = linkStyle.surfaceColor;
        break;
      case "glass": {
        const opacity = linkStyle.surfaceOpacity ?? 12;
        const hexAlpha = Math.round((opacity / 100) * 255)
          .toString(16)
          .padStart(2, "0");
        const blur = linkStyle.glassBlur ?? 16;
        base.backgroundColor = `${linkStyle.surfaceColor}${hexAlpha}`;
        base.backdropFilter = blur > 0 ? `blur(${blur}px)` : "none";
        base.WebkitBackdropFilter = blur > 0 ? `blur(${blur}px)` : "none";
        break;
      }
      case "liquid-glass": {
        // iPhone Apple-style liquid glass
        const opacity = Math.min(Math.max(linkStyle.surfaceOpacity ?? 10, 0), 60);
        const hexAlpha = Math.round((opacity / 100) * 255)
          .toString(16)
          .padStart(2, "0");
        const blur = linkStyle.glassBlur ?? 28;
        const gloss = (linkStyle.glassGloss ?? 80) / 100;
        const saturate = 150 + Math.round(gloss * 70);

        base.backgroundColor = `${linkStyle.surfaceColor}${hexAlpha}`;
        base.backdropFilter = blur > 0 ? `blur(${blur}px) saturate(${saturate}%) contrast(106%)` : `saturate(${saturate}%) contrast(106%)`;
        base.WebkitBackdropFilter = blur > 0 ? `blur(${blur}px) saturate(${saturate}%) contrast(106%)` : `saturate(${saturate}%) contrast(106%)`;

        // Apple glass double specular rim highlight & deep ambient refraction
        const specularInsetTop = `inset 0 1.5px 1.5px 0 rgba(255, 255, 255, ${(0.3 + gloss * 0.55).toFixed(2)})`;
        const specularInsetBottom = `inset 0 -1.5px 2px 0 rgba(0, 0, 0, ${(0.15 + gloss * 0.2).toFixed(2)})`;
        const ambientInnerGlow = `inset 0 0 ${Math.round(blur * 0.5)}px 0 rgba(255, 255, 255, ${(gloss * 0.1).toFixed(2)})`;

        base.boxShadow =
          base.boxShadow && base.boxShadow !== "none"
            ? `${base.boxShadow}, ${specularInsetTop}, ${specularInsetBottom}, ${ambientInnerGlow}`
            : `0 12px 32px -4px rgba(0, 0, 0, 0.35), ${specularInsetTop}, ${specularInsetBottom}, ${ambientInnerGlow}`;

        if (!linkStyle.borderWidth || linkStyle.borderWidth <= 1) {
          base.borderColor = `rgba(255, 255, 255, ${(0.15 + gloss * 0.3).toFixed(2)})`;
        }
        break;
      }
      case "neumorphic":
        base.backgroundColor = `${linkStyle.surfaceColor}15`;
        base.boxShadow =
          "6px 6px 14px rgba(0,0,0,0.4), -6px -6px 14px rgba(255,255,255,0.06)";
        break;
      case "outline":
        base.backgroundColor = "transparent";
        base.borderWidth = `${Math.max(linkStyle.borderWidth, 2)}px`;
        break;
    }

    return base;
  }

  function getHoverMotion() {
    if (!interactive) return undefined;
    switch (linkStyle.hoverEffect) {
      case "lift":
        return { y: -6, scale: 1.015, transition: { duration: 0.2, ease: "easeOut" as const } };
      case "scale":
        return { scale: 1.04, transition: { duration: 0.2, ease: "easeOut" as const } };
      case "glow":
        return { y: -3, scale: 1.01, transition: { duration: 0.2, ease: "easeOut" as const } };
      case "shake":
        return { x: [0, -4, 4, -3, 3, 0], transition: { duration: 0.35 } };
      case "shine":
        return { y: -2, filter: "brightness(1.15)", transition: { duration: 0.2 } };
      default:
        return { y: -4, transition: { duration: 0.2, ease: "easeOut" as const } };
    }
  }

  function getSocialLinkClasses() {
    switch (identity.socialLayoutStyle) {
      case "minimal":
        return "p-2.5 rounded-lg hover:bg-white/10 transition-colors";
      case "pill":
        return "px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm flex items-center gap-1.5 backdrop-blur-md";
      case "floating":
        return "p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 hover:border-white/25 transition-all shadow-lg backdrop-blur-md";
      default:
        return "p-2.5 rounded-lg hover:bg-white/10 transition-colors";
    }
  }

  // Background Image Layer
  const bgImage = (theme.background.type === "image" || theme.background.imageUrl) && (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${theme.background.imageUrl || "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80"})`,
          backgroundSize: theme.background.imageFit || "cover",
          backgroundPosition: theme.background.imagePosition || "center",
          opacity: (theme.background.imageOpacity ?? 85) / 100,
          filter: theme.background.imageBlur ? `blur(${theme.background.imageBlur}px)` : undefined,
          transform: theme.background.imageBlur ? "scale(1.05)" : "none",
        }}
      />
      {/* Tint Overlay */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundColor: theme.background.imageOverlayColor || "#000000",
          opacity: (theme.background.imageOverlayOpacity ?? 35) / 100,
        }}
      />
    </div>
  );

  // Mesh animation overlay
  const meshOverlay = theme.background.type === "mesh" && (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {theme.background.meshColors.map((color, i) => (
        <div
          key={i}
          className="absolute rounded-full mix-blend-screen blur-3xl animate-pulse"
          style={{
            backgroundColor: color,
            opacity: 0.35,
            width: "55%",
            height: "55%",
            top: `${(i * 25) % 80}%`,
            left: `${(i * 30 + 10) % 70}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${4 + i}s`,
          }}
        />
      ))}
    </div>
  );

  // Decorative Shapes Overlay with customizable style and count
  const shapesCount = Math.min(Math.max(theme.background.shapesCount ?? 6, 1), 20);
  const shapesColor = theme.background.shapesColor || "#8b5cf6";
  const shapesOpacity = (theme.background.shapesOpacity ?? 30) / 100;
  const shapesSpeed = theme.background.shapesSpeed || "normal";
  const speedFactor =
    shapesSpeed === "slow"
      ? 1.7
      : shapesSpeed === "fast"
      ? 0.55
      : shapesSpeed === "static"
      ? 0
      : 1;

  const dynamicShapes = Array.from({ length: shapesCount }, (_, i) => {
    const top = 5 + ((i * 37 + 11) % 80);
    const left = 5 + ((i * 43 + 17) % 82);
    const delay = `${((i * 0.7) % 4).toFixed(1)}s`;
    const baseDuration = 7 + (i % 5) * 2;
    const duration = speedFactor > 0 ? `${(baseDuration * speedFactor).toFixed(1)}s` : "0s";
    const isReverse = i % 2 === 1;
    const size = 28 + ((i * 17) % 48);
    return { id: i, top, left, delay, duration, isReverse, size };
  });

  const shapesOverlay = theme.background.shapesEnabled && (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {theme.background.shapesStyle === "blobs" && (
        <div className="absolute inset-0" style={{ opacity: shapesOpacity }}>
          {dynamicShapes.map((s) => {
            const blobSize = 160 + ((s.id * 53) % 180);
            return (
              <div
                key={s.id}
                className={`absolute rounded-full blur-3xl ${
                  speedFactor === 0
                    ? ""
                    : s.isReverse
                    ? "animate-[float-reverse_12s_ease-in-out_infinite]"
                    : "animate-[float-ambient_10s_ease-in-out_infinite]"
                }`}
                style={{
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  width: `${blobSize}px`,
                  height: `${blobSize}px`,
                  backgroundColor:
                    s.id % 3 === 0
                      ? shapesColor
                      : s.id % 3 === 1
                      ? "#ec4899"
                      : "#38bdf8",
                  animationDelay: s.delay,
                  animationDuration: s.duration,
                }}
              />
            );
          })}
        </div>
      )}

      {theme.background.shapesStyle === "circles" && (
        <div className="absolute inset-0" style={{ opacity: shapesOpacity }}>
          {dynamicShapes.map((s) => (
            <div
              key={s.id}
              className={`absolute rounded-full border-2 ${
                speedFactor === 0
                  ? ""
                  : s.isReverse
                  ? "animate-[float-reverse_9s_infinite_ease-in-out]"
                  : "animate-[float-ambient_7s_infinite_ease-in-out]"
              }`}
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                borderColor: shapesColor,
                backgroundColor: `${shapesColor}15`,
                animationDelay: s.delay,
                animationDuration: s.duration,
              }}
            />
          ))}
        </div>
      )}

      {theme.background.shapesStyle === "squares" && (
        <div className="absolute inset-0" style={{ opacity: shapesOpacity }}>
          {dynamicShapes.map((s) => (
            <div
              key={s.id}
              className={`absolute rounded-2xl border-2 ${
                speedFactor === 0
                  ? ""
                  : s.isReverse
                  ? "animate-[float-reverse_10s_infinite_ease-in-out]"
                  : "animate-[float-ambient_8s_infinite_ease-in-out]"
              }`}
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                borderColor: shapesColor,
                backgroundColor: `${shapesColor}18`,
                transform: `rotate(${s.id * 22}deg)`,
                animationDelay: s.delay,
                animationDuration: s.duration,
              }}
            />
          ))}
        </div>
      )}

      {theme.background.shapesStyle === "diamonds" && (
        <div className="absolute inset-0" style={{ opacity: shapesOpacity }}>
          {dynamicShapes.map((s) => (
            <div
              key={s.id}
              className={`absolute border-2 rounded-lg rotate-45 ${
                speedFactor === 0
                  ? ""
                  : s.isReverse
                  ? "animate-[float-reverse_8s_infinite_ease-in-out]"
                  : "animate-[float-ambient_7s_infinite_ease-in-out]"
              }`}
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: `${s.size * 0.85}px`,
                height: `${s.size * 0.85}px`,
                borderColor: shapesColor,
                backgroundColor: `${shapesColor}20`,
                animationDelay: s.delay,
                animationDuration: s.duration,
              }}
            />
          ))}
        </div>
      )}

      {theme.background.shapesStyle === "triangles" && (
        <div className="absolute inset-0" style={{ opacity: shapesOpacity }}>
          {dynamicShapes.map((s) => (
            <div
              key={s.id}
              className={`absolute ${
                speedFactor === 0
                  ? ""
                  : s.isReverse
                  ? "animate-[float-reverse_9s_infinite_ease-in-out]"
                  : "animate-[float-ambient_8s_infinite_ease-in-out]"
              }`}
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDelay: s.delay,
                animationDuration: s.duration,
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon
                  points="50,15 90,85 10,85"
                  fill={`${shapesColor}22`}
                  stroke={shapesColor}
                  strokeWidth="6"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ))}
        </div>
      )}

      {theme.background.shapesStyle === "geometric" && (
        <div className="absolute inset-0" style={{ opacity: shapesOpacity }}>
          {dynamicShapes.map((s) => {
            const kind = s.id % 4;
            return (
              <div
                key={s.id}
                className={`absolute ${
                  speedFactor === 0
                    ? ""
                    : s.isReverse
                    ? "animate-[float-reverse_9s_infinite_ease-in-out]"
                    : "animate-[float-ambient_8s_infinite_ease-in-out]"
                }`}
                style={{
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  animationDelay: s.delay,
                  animationDuration: s.duration,
                }}
              >
                {kind === 0 && (
                  <div
                    className="w-full h-full border-2 rounded-2xl"
                    style={{ borderColor: shapesColor }}
                  />
                )}
                {kind === 1 && (
                  <div
                    className="w-full h-full border-2 rotate-45 rounded-lg"
                    style={{ borderColor: shapesColor }}
                  />
                )}
                {kind === 2 && (
                  <div
                    className="w-full h-full border-2 rounded-full"
                    style={{ borderColor: shapesColor }}
                  />
                )}
                {kind === 3 && (
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polygon
                      points="50,15 90,85 10,85"
                      fill={`${shapesColor}20`}
                      stroke={shapesColor}
                      strokeWidth="6"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}

      {theme.background.shapesStyle === "bokeh" && (
        <div className="absolute inset-0" style={{ opacity: shapesOpacity }}>
          {dynamicShapes.map((s) => {
            const bokehSize = 60 + ((s.id * 31) % 80);
            return (
              <div
                key={s.id}
                className="absolute rounded-full blur-xl animate-pulse"
                style={{
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  width: `${bokehSize}px`,
                  height: `${bokehSize}px`,
                  backgroundColor: shapesColor,
                  animationDelay: s.delay,
                  animationDuration: s.duration,
                }}
              />
            );
          })}
        </div>
      )}

      {theme.background.shapesStyle === "rings" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: shapesOpacity }}>
          {dynamicShapes.map((s) => {
            const ringSize = 100 + ((s.id * 67) % 240);
            return (
              <div
                key={s.id}
                className={`absolute rounded-full border ${
                  s.id % 2 === 0 ? "border-dashed" : "border-solid"
                } ${speedFactor > 0 ? "animate-[spin-slow_35s_linear_infinite]" : ""}`}
                style={{
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  width: `${ringSize}px`,
                  height: `${ringSize}px`,
                  borderColor: shapesColor,
                  animationDelay: s.delay,
                }}
              />
            );
          })}
        </div>
      )}

      {theme.background.shapesStyle === "stars" && (
        <div className="absolute inset-0" style={{ opacity: shapesOpacity }}>
          {dynamicShapes.map((s) => {
            const starSize = 12 + (s.id % 3) * 6;
            return (
              <div
                key={s.id}
                className="absolute animate-pulse"
                style={{
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  width: `${starSize}px`,
                  height: `${starSize}px`,
                  animationDelay: s.delay,
                  animationDuration: s.duration,
                }}
              >
                <svg viewBox="0 0 24 24" className="w-full h-full" fill={shapesColor}>
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>
            );
          })}
        </div>
      )}

      {theme.background.shapesStyle === "grid" && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${shapesColor} 1.2px, transparent 0)`,
            backgroundSize: "28px 28px",
            opacity: shapesOpacity * 0.75,
            maskImage: "radial-gradient(circle at center, black 45%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 45%, transparent 85%)",
          }}
        />
      )}
    </div>
  );

  const enabledLinks = links.filter((l) => l.enabled);

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  } as const;

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  } as const;

  // Avatar sizing and styling
  const avatarSize = identity.avatarSize || 96;
  const avatarShape = identity.avatarShape || "circle";
  const avatarShapeStyle = getAvatarShapeStyle(avatarShape);

  const avatarBorderStyle: React.CSSProperties = {
    borderWidth: `${identity.avatarBorderWidth ?? 2}px`,
    borderColor: identity.avatarBorderColor || "rgba(255,255,255,0.25)",
    borderStyle: identity.avatarBorderStyle || "solid",
  };

  const avatarGlowColor = hexToRgba(
    identity.avatarGlowColor || "#8b5cf6",
    identity.avatarGlowOpacity ?? 70
  );
  const avatarGlowRadius = identity.avatarGlowRadius ?? 22;
  const avatarGlowSpread = identity.avatarGlowSpread ?? 0;

  const avatarGlowStyle: React.CSSProperties = identity.avatarGlow
    ? {
        boxShadow: `0 0 ${avatarGlowRadius}px ${avatarGlowSpread}px ${avatarGlowColor}`,
      }
    : {};

  return (
    <div
      className={`relative min-h-screen min-h-[100dvh] w-full flex flex-col ${fontClass}`}
      style={{
        ...bgStyle,
        fontSize: `${fontSizeBase}rem`,
      }}
    >
      {/* Background Image Layer */}
      {bgImage}

      {/* Mesh Layer */}
      {meshOverlay}

      {/* Decorative Shapes Layer */}
      {shapesOverlay}

      <main
        className="relative z-10 mx-auto w-full flex-1 flex flex-col justify-between"
        role="main"
        aria-label="Bio profile"
        style={{
          maxWidth: `${theme.pageMaxWidth ?? 448}px`,
          paddingTop: `${theme.pagePaddingTop ?? 48}px`,
          paddingBottom: `${theme.pagePaddingBottom ?? 48}px`,
          paddingLeft: `${theme.pagePaddingX ?? 20}px`,
          paddingRight: `${theme.pagePaddingX ?? 20}px`,
        }}
      >
        <div>
          {/* Avatar Section */}
          <motion.div
            initial={interactive ? { scale: 0.8, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" as const }}
            className="flex flex-col items-center mb-6"
          >
            <div className="relative">
              <div
                className={`overflow-hidden transition-all duration-300 relative ${
                  identity.avatarGlow && identity.avatarGlowPulse
                    ? "animate-[pulse-glow_3s_ease-in-out_infinite]"
                    : ""
                }`}
                style={{
                  width: `${avatarSize}px`,
                  height: `${avatarSize}px`,
                  ...avatarShapeStyle,
                  ...avatarBorderStyle,
                  ...avatarGlowStyle,
                }}
              >
                {identity.avatarUrl ? (
                  <img
                    src={identity.avatarUrl}
                    alt={identity.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-3xl font-bold"
                    style={{
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      color: "#fff",
                      fontSize: `${Math.round(avatarSize * 0.35)}px`,
                    }}
                  >
                    {identity.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                )}
              </div>
              {identity.verified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 shadow-lg shadow-blue-500/50 flex items-center justify-center"
                  title="Verified Account"
                >
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Name & Subtitle */}
          <motion.div
            initial={interactive ? { y: 10, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center mb-6"
          >
            <h1
              className="text-2xl font-bold mb-1.5"
              style={{ color: theme.headingColor, fontSize: `${1.5 * fontSizeBase}rem` }}
            >
              {identity.displayName}
            </h1>
            <p
              className="text-sm leading-relaxed max-w-xs mx-auto"
              style={{ color: theme.bioTextColor, fontSize: `${0.875 * fontSizeBase}rem` }}
            >
              {identity.subtitle}
            </p>
          </motion.div>

          {/* Social Icons */}
          {identity.socialLinks.length > 0 && (
            <motion.nav
              initial={interactive ? { y: 10, opacity: 0 } : false}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex items-center justify-center gap-2 mb-8 flex-wrap"
              aria-label="Social links"
            >
              {identity.socialLinks.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform];
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={getSocialLinkClasses()}
                    style={{ color: social.iconColor || theme.bioTextColor }}
                    aria-label={social.platform}
                  >
                    <Icon className="w-5 h-5" />
                    {identity.socialLayoutStyle === "pill" && (
                      <span className="capitalize">{social.platform}</span>
                    )}
                  </a>
                );
              })}
            </motion.nav>
          )}

          {/* Links (Capsules) */}
          <motion.div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: `${theme.capsuleSpacing ?? 12}px`,
            }}
            variants={interactive ? container : undefined}
            initial="hidden"
            animate="show"
          >
            {enabledLinks.map((link) => {
              const LinkIcon = getLinkIcon(link.icon);
              const isLiquidGlass = linkStyle.surfaceTreatment === "liquid-glass";

              const gRadius = linkStyle.glowRadius ?? 20;
              const gSpread = linkStyle.glowSpread ?? 0;
              const gOpacity = linkStyle.glowOpacity ?? 55;
              const glowColorHex = linkStyle.glowColor || "#8b5cf6";
              const alwaysGlowColor = hexToRgba(glowColorHex, gOpacity);
              const hoverGlowColor = hexToRgba(glowColorHex, Math.min(gOpacity * 1.35, 100));

              const isAlwaysGlow =
                linkStyle.glowEnabled !== false &&
                (linkStyle.glowMode === "always" ||
                  linkStyle.glowMode === "both" ||
                  !linkStyle.glowMode);

              const isHoverGlow =
                linkStyle.glowEnabled !== false &&
                (linkStyle.glowMode === "hover" ||
                  linkStyle.glowMode === "both" ||
                  linkStyle.hoverEffect === "glow");

              const alwaysGlowShadow = `0 0 ${gRadius}px ${gSpread}px ${alwaysGlowColor}`;
              const hoverGlowShadow = `0 0 ${Math.round(gRadius * 1.4) + 6}px ${gSpread + 2}px ${hoverGlowColor}`;
              const cornerRadiusStyle =
                linkStyle.cornerRadius >= 9999 ? "9999px" : `${linkStyle.cornerRadius}px`;

              return (
                <div key={link.id} className="relative group w-full">
                  {/* Always Glow Aura Layer */}
                  {isAlwaysGlow && (
                    <div
                      className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
                        linkStyle.glowPulse ? "animate-[pulse-glow_3s_ease-in-out_infinite]" : ""
                      }`}
                      style={{
                        borderRadius: cornerRadiusStyle,
                        boxShadow: alwaysGlowShadow,
                        zIndex: 0,
                      }}
                    />
                  )}

                  {/* Hover Glow Aura Layer (smooth opacity transition, never gets stuck!) */}
                  {isHoverGlow && (
                    <div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        borderRadius: cornerRadiusStyle,
                        boxShadow: hoverGlowShadow,
                        zIndex: 0,
                      }}
                    />
                  )}

                  <motion.a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={interactive ? item : undefined}
                    className="relative block w-full px-5 py-4 overflow-hidden"
                    style={{
                      ...getLinkButtonStyle(),
                      zIndex: 1,
                    }}
                    whileHover={getHoverMotion()}
                    whileTap={interactive ? { scale: 0.98 } : undefined}
                  >
                    {/* Apple Liquid glass top curved reflection sheen */}
                    {isLiquidGlass && (
                      <div
                        className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none rounded-t-[inherit] transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(180deg, rgba(255, 255, 255, ${(((linkStyle.glassGloss ?? 80) / 100) * 0.38).toFixed(2)}) 0%, rgba(255, 255, 255, ${(((linkStyle.glassGloss ?? 80) / 100) * 0.05).toFixed(2)}) 55%, transparent 100%)`,
                        }}
                      />
                    )}

                    {/* Shine Hover Light Sweep */}
                    {linkStyle.hoverEffect === "shine" && (
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                    )}

                    <div className="flex items-center gap-3 relative z-10">
                      <LinkIcon
                        className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110"
                        style={{ color: linkStyle.iconColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="font-semibold truncate"
                            style={{
                              color: linkStyle.textColor,
                              fontSize: `${0.9375 * fontSizeBase}rem`,
                            }}
                          >
                            {link.title}
                          </span>
                          {link.badge && (
                            <span
                              className="shrink-0 text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase transition-transform duration-200 group-hover:scale-105"
                              style={{
                                backgroundColor:
                                  link.badgeBgColor || `${link.badgeColor || "#a78bfa"}25`,
                                color: link.badgeColor || "#ffffff",
                                boxShadow:
                                  linkStyle.badgeStyle === "glow"
                                    ? `0 0 10px ${link.badgeBgColor || link.badgeColor || "#a78bfa"}`
                                    : undefined,
                                border:
                                  linkStyle.badgeStyle === "outline"
                                    ? `1px solid ${link.badgeColor || "#a78bfa"}`
                                    : undefined,
                              }}
                            >
                              {link.badge}
                            </span>
                          )}
                        </div>
                        {link.subtitle && (
                          <p
                            className="text-xs mt-0.5 truncate"
                            style={{
                              color: linkStyle.subtextColor,
                              fontSize: `${0.75 * fontSizeBase}rem`,
                            }}
                          >
                            {link.subtitle}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {analytics.showClickCounts && link.clicks > 0 && (
                          <span
                            className="flex items-center gap-1 text-[10px] opacity-60 backdrop-blur-sm px-1.5 py-0.5 rounded bg-black/20"
                            style={{ color: linkStyle.subtextColor }}
                          >
                            <MousePointerClick className="w-3 h-3" />
                            {link.clicks.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.a>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Customizable Footer / Bottom Space */}
        <div
          className="mt-12"
          style={{
            paddingBottom: `${footer?.spaceBottom ?? 32}px`,
            textAlign: footer?.alignment || "center",
          }}
        >
          {footer?.enabled && (
            <motion.div
              initial={interactive ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-1.5"
            >
              {footer.text && (
                <p
                  className="font-medium leading-relaxed whitespace-pre-wrap"
                  style={{
                    color: footer.textColor || theme.bioTextColor,
                    fontSize: `${(footer.fontSize || 0.85) * fontSizeBase}rem`,
                  }}
                >
                  {footer.text}
                </p>
              )}
              {footer.subtext && (
                <p
                  className="text-xs opacity-60"
                  style={{
                    color: footer.textColor || theme.bioTextColor,
                    fontSize: `${(footer.fontSize || 0.85) * 0.85 * fontSizeBase}rem`,
                  }}
                >
                  {footer.subtext}
                </p>
              )}
            </motion.div>
          )}

          {footer?.showPoweredBy !== false && (
            <div
              className="mt-6 flex items-center justify-center gap-1.5 text-[11px] opacity-40 hover:opacity-80 transition-opacity"
              style={{ color: theme.bioTextColor }}
            >
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span>Powered by LinkTree Studio</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
