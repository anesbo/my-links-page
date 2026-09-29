"use client";

import { BioConfig } from "@/types/config";
import { getBackgroundStyle, getFontClass, getAvatarShapeStyle } from "@/lib/utils";
import { getLinkIcon, SOCIAL_ICONS } from "@/lib/icons";
import { BadgeCheck, MousePointerClick, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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
        base.boxShadow = `0 0 20px ${linkStyle.borderColor || "rgba(139,92,246,0.3)"}`;
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
        base.backdropFilter = `blur(${blur}px)`;
        base.WebkitBackdropFilter = `blur(${blur}px)`;
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
        base.backdropFilter = `blur(${blur}px) saturate(${saturate}%) contrast(106%)`;
        base.WebkitBackdropFilter = `blur(${blur}px) saturate(${saturate}%) contrast(106%)`;

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

  function getHoverClass() {
    switch (linkStyle.hoverEffect) {
      case "lift":
        return "hover:-translate-y-1 hover:shadow-xl hover:shadow-white/5";
      case "scale":
        return "hover:scale-[1.03]";
      case "glow":
        return "hover:shadow-lg hover:shadow-purple-500/30";
      case "shake":
        return "hover:animate-[wiggle_0.3s_ease-in-out]";
      case "shine":
        return "hover:brightness-110";
      default:
        return "hover:-translate-y-1";
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

  // Decorative Shapes Overlay ("shapes and things")
  const shapesOverlay = theme.background.shapesEnabled && (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {theme.background.shapesStyle === "blobs" && (
        <>
          <div
            className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl animate-[float-ambient_10s_ease-in-out_infinite]"
            style={{
              backgroundColor: theme.background.shapesColor || "#8b5cf6",
              opacity: (theme.background.shapesOpacity ?? 30) / 100,
            }}
          />
          <div
            className="absolute top-1/2 -right-24 w-72 h-72 rounded-full blur-3xl animate-[float-reverse_12s_ease-in-out_infinite]"
            style={{
              backgroundColor: theme.background.shapesColor || "#8b5cf6",
              opacity: (theme.background.shapesOpacity ?? 30) * 0.8 / 100,
            }}
          />
          <div
            className="absolute bottom-10 left-10 w-64 h-64 rounded-full blur-2xl animate-[float-ambient_8s_ease-in-out_infinite]"
            style={{
              backgroundColor: "#ec4899",
              opacity: (theme.background.shapesOpacity ?? 30) * 0.6 / 100,
            }}
          />
        </>
      )}

      {theme.background.shapesStyle === "geometric" && (
        <div
          className="absolute inset-0"
          style={{ opacity: (theme.background.shapesOpacity ?? 30) / 100 }}
        >
          <div
            className="absolute top-16 left-8 w-24 h-24 border-2 rounded-2xl animate-[float-ambient_7s_infinite_ease-in-out]"
            style={{ borderColor: theme.background.shapesColor || "#8b5cf6" }}
          />
          <div
            className="absolute top-1/3 right-10 w-16 h-16 border-2 rotate-45 animate-[float-reverse_9s_infinite_ease-in-out]"
            style={{ borderColor: theme.background.shapesColor || "#8b5cf6" }}
          />
          <div
            className="absolute bottom-32 left-12 w-28 h-28 border rounded-full animate-[spin-slow_20s_linear_infinite]"
            style={{ borderColor: theme.background.shapesColor || "#8b5cf6" }}
          />
        </div>
      )}

      {theme.background.shapesStyle === "bokeh" && (
        <div
          className="absolute inset-0"
          style={{ opacity: (theme.background.shapesOpacity ?? 30) / 100 }}
        >
          {[
            { top: "15%", left: "20%", size: "80px", delay: "0s" },
            { top: "35%", right: "15%", size: "120px", delay: "1.5s" },
            { top: "65%", left: "10%", size: "90px", delay: "3s" },
            { top: "80%", right: "25%", size: "110px", delay: "2s" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="absolute rounded-full blur-xl animate-pulse"
              style={{
                top: item.top,
                left: item.left,
                right: item.right,
                width: item.size,
                height: item.size,
                backgroundColor: theme.background.shapesColor || "#8b5cf6",
                animationDelay: item.delay,
              }}
            />
          ))}
        </div>
      )}

      {theme.background.shapesStyle === "grid" && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.background.shapesColor || "#8b5cf6"} 1px, transparent 0)`,
            backgroundSize: "28px 28px",
            opacity: ((theme.background.shapesOpacity ?? 30) / 100) * 0.7,
            maskImage: "radial-gradient(circle at center, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 80%)",
          }}
        />
      )}

      {theme.background.shapesStyle === "rings" && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: (theme.background.shapesOpacity ?? 30) / 100 }}
        >
          <div
            className="w-[450px] h-[450px] rounded-full border border-dashed animate-[spin-slow_40s_linear_infinite]"
            style={{ borderColor: theme.background.shapesColor || "#8b5cf6" }}
          />
          <div
            className="absolute w-[300px] h-[300px] rounded-full border"
            style={{ borderColor: theme.background.shapesColor || "#8b5cf6", opacity: 0.5 }}
          />
        </div>
      )}

      {theme.background.shapesStyle === "stars" && (
        <div
          className="absolute inset-0"
          style={{ opacity: (theme.background.shapesOpacity ?? 30) / 100 }}
        >
          {[
            { top: "10%", left: "25%", size: 3 },
            { top: "20%", right: "20%", size: 4 },
            { top: "45%", left: "15%", size: 3 },
            { top: "60%", right: "12%", size: 4 },
            { top: "75%", left: "30%", size: 2 },
            { top: "85%", right: "35%", size: 3 },
          ].map((s, idx) => (
            <div
              key={idx}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                top: s.top,
                left: s.left,
                right: s.right,
                width: `${s.size}px`,
                height: `${s.size}px`,
                boxShadow: `0 0 6px ${theme.background.shapesColor || "#ffffff"}`,
              }}
            />
          ))}
        </div>
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

  const avatarGlowStyle: React.CSSProperties = identity.avatarGlow
    ? {
        boxShadow: `0 0 ${identity.avatarGlowRadius ?? 18}px ${identity.avatarGlowColor || "#8b5cf6"}`,
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
        className="relative z-10 mx-auto w-full max-w-md px-5 py-12 flex-1 flex flex-col justify-between"
        role="main"
        aria-label="Bio profile"
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
            className="space-y-3"
            variants={interactive ? container : undefined}
            initial="hidden"
            animate="show"
          >
            {enabledLinks.map((link) => {
              const LinkIcon = getLinkIcon(link.icon);
              const isLiquidGlass = linkStyle.surfaceTreatment === "liquid-glass";

              return (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={interactive ? item : undefined}
                  className={`group block w-full px-5 py-4 transform transition-all duration-300 relative overflow-hidden ${getHoverClass()}`}
                  style={getLinkButtonStyle()}
                  whileTap={interactive ? { scale: 0.98 } : undefined}
                >
                  {/* Apple Liquid glass top curved reflection sheen (stationary, no moving line) */}
                  {isLiquidGlass && (
                    <div
                      className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none rounded-t-[inherit] transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(180deg, rgba(255, 255, 255, ${(((linkStyle.glassGloss ?? 80) / 100) * 0.38).toFixed(2)}) 0%, rgba(255, 255, 255, ${(((linkStyle.glassGloss ?? 80) / 100) * 0.05).toFixed(2)}) 55%, transparent 100%)`,
                      }}
                    />
                  )}

                  <div className="flex items-center gap-3 relative z-10">
                    <LinkIcon
                      className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110"
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
                            className="shrink-0 text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase transition-transform group-hover:scale-105"
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
