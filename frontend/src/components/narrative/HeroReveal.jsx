import { useEffect, useState } from "react";
import { colors } from "../../theme";

/**
 * Full-viewport opening statement with staggered word-by-word reveal.
 * One-time entrance animation on mount — not scroll-triggered, since
 * it's the very first thing the user sees.
 */
export default function HeroReveal({ onStartDemo }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const line1 = ["The", "AI", "can", "be", "fooled."];
  const line2 = ["The", "payment", "can't."];

  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", textAlign: "center",
      padding: "0 24px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: colors.textMuted, marginBottom: 24 }}>
        BRAMBLE &amp; CO. · POWERED BY COVENANT
      </div>

      <h1 style={{
        fontSize: "clamp(48px, 9vw, 108px)", fontWeight: 800, lineHeight: 1.02,
        letterSpacing: "-2px", margin: 0, color: colors.textPrimary,
      }}>
        <WordLine words={line1} mounted={mounted} startDelay={0} />
        <WordLine words={line2} mounted={mounted} startDelay={line1.length} accent />
      </h1>

      <p style={{
        marginTop: 32, fontSize: 18, color: colors.textSecondary, maxWidth: 520,
        opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.6s ease 0.9s, transform 0.6s ease 0.9s",
      }}>
        An AI agent shops for your customers. Every purchase is independently
        verified before a single rupee moves.
      </p>

      <div style={{
        marginTop: 44, display: "flex", gap: 20, alignItems: "center",
        opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 1.1s",
      }}>
        <button className="btn-primary" onClick={onStartDemo}>See it happen</button>
      </div>

      <ScrollCue mounted={mounted} />
    </section>
  );
}

function WordLine({ words, mounted, startDelay, accent }) {
  return (
    <div>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block", marginRight: "0.28em",
            color: accent ? "#22C55E" : "inherit",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(28px)",
            transition: `opacity 0.5s ease ${(startDelay + i) * 0.07}s, transform 0.5s ease ${(startDelay + i) * 0.07}s`,
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

function ScrollCue({ mounted }) {
  return (
    <div style={{
      position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
      opacity: mounted ? 0.5 : 0, transition: "opacity 0.6s ease 1.4s",
      fontSize: 12, letterSpacing: 1.5, color: "#6B7280",
    }}>
      SCROLL
    </div>
  );
}
