"use client";

import { BioConfig } from "@/types/config";
import { getBackgroundStyle, getFontClass } from "@/lib/utils";
import { getLinkIcon, SOCIAL_ICONS } from "@/lib/icons";
import { BadgeCheck, MousePointerClick } from "lucide-react";
import { motion } from "framer-motion";

interface BioPreviewProps {
  config: BioConfig;
  interactive?: boolean;
}

export default function BioPreview({ config, interactive = false }: BioPreviewProps) {
  const { identity, theme, linkStyle, links, analytics } = config;
  const bgStyle = getBackgroundStyle(theme.background);
  const fontClass = getFontClass(theme.fontFamily);

  const fontSizeBase = theme.fontScale;

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

    switch (linkStyle.surfaceTreatment) {
      case "solid":
        base.backgroundColor = linkStyle.surfaceColor;
        break;
      case "glass":
        base.backgroundColor = `${linkStyle.surfaceColor}${Math.round(
          (linkStyle.surfaceOpacity / 100) * 255
        )
          .toString(16)
          .padStart(2, "0")}`;
        base.backdropFilter = "blur(16px)";
        base.WebkitBackdropFilter = "blur(16px)";
        break;
      case "neumorphic":
        base.backgroundColor = `${linkStyle.surfaceColor}15`;
        base.boxShadow =
          "6px 6px 12px rgba(0,0,0,0.3), -6px -6px 12px rgba(255,255,255,0.05)";
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
        return "hover:-translate-y-1 hover:shadow-lg hover:shadow-white/5";
      case "scale":
        return "hover:scale-[1.03]";
      case "glow":
        return "hover:shadow-lg hover:shadow-purple-500/25";
      case "shake":
        return "hover:animate-[wiggle_0.3s_ease-in-out]";
      default:
        return "hover:-translate-y-1";
    }
  }

  function getSocialLinkClasses() {
    switch (identity.socialLayoutStyle) {
      case "minimal":
        return "p-2 rounded-lg hover:bg-white/10 transition-colors";
      case "pill":
        return "px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm flex items-center gap-1.5";
      case "floating":
        return "p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 hover:border-white/25 transition-all shadow-lg";
      default:
        return "p-2 rounded-lg hover:bg-white/10 transition-colors";
    }
  }

  // Mesh background animation overlay
  const meshOverlay = theme.background.type === "mesh" && (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {theme.background.meshColors.map((color, i) => (
        <div
          key={i}
          className="absolute rounded-full mix-blend-screen blur-3xl animate-pulse"
          style={{
            backgroundColor: color,
            opacity: 0.3,
            width: "50%",
            height: "50%",
            top: `${(i * 25) % 80}%`,
            left: `${(i * 30 + 10) % 70}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${4 + i}s`,
          }}
        />
      ))}
    </div>
  );

  const enabledLinks = links.filter((l) => l.enabled);

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  };

  return (
    <div
      className={`relative min-h-full w-full ${fontClass}`}
      style={{
        ...bgStyle,
        fontSize: `${fontSizeBase}rem`,
      }}
    >
      {meshOverlay}

      <main
        className="relative z-10 mx-auto w-full max-w-md px-5 py-12"
        role="main"
        aria-label="Bio profile"
      >
        {/* Avatar */}
        <motion.div
          initial={interactive ? { scale: 0.8, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-center mb-6"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/20 ring-offset-2 ring-offset-transparent">
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
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 shadow-lg shadow-blue-500/50">
                <BadgeCheck className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Name & Bio */}
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

        {/* Links */}
        <motion.div
          className="space-y-3"
          variants={interactive ? container : undefined}
          initial="hidden"
          animate="show"
        >
          {enabledLinks.map((link) => {
            const LinkIcon = getLinkIcon(link.icon);
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={interactive ? item : undefined}
                className={`group block w-full px-5 py-4 transform transition-all duration-300 ${getHoverClass()}`}
                style={getLinkButtonStyle()}
                whileTap={interactive ? { scale: 0.97 } : undefined}
              >
                <div className="flex items-center gap-3">
                  <LinkIcon
                    className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110"
                    style={{ color: linkStyle.iconColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
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
                          className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${link.badgeColor || "#a78bfa"}25`,
                            color: link.badgeColor || "#a78bfa",
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
                        className="flex items-center gap-1 text-[10px] opacity-50"
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

        {/* Footer */}
        <motion.div
          initial={interactive ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-[11px] opacity-30" style={{ color: theme.bioTextColor }}>
            Powered by LinkTree Studio
          </p>
        </motion.div>
      </main>
    </div>
  );
}
