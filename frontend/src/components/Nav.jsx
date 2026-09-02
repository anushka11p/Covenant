import { useState, useEffect } from "react";
import { colors, type } from "../theme";

const ITEMS = [
  { key: "overview", label: "Overview" },
  { key: "demo", label: "Demo" },
  { key: "revenue", label: "Revenue" },
];

export default function Nav({ active, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > lastScrollY && y > 80);
      setLastScrollY(y);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, border-color 0.3s ease",
        background: scrolled
          ? "rgba(9,11,15,0.9)"
          : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.05)"
          : "1px solid transparent",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => onNavigate("overview")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 0,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1.5px solid #10D07A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#10D07A",
                boxShadow: "0 0 8px rgba(16,208,122,0.6)",
              }}
            />
          </div>
          <span
            style={{
              ...type.label,
              color: colors.textPrimary,
              fontSize: 13,
              letterSpacing: "0.12em",
            }}
          >
            COVENANT
          </span>
        </button>

        {/* Nav Items */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {ITEMS.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                id={`nav-${item.key}`}
                onClick={() => onNavigate(item.key)}
                style={{
                  background: isActive ? "rgba(16,208,122,0.1)" : "transparent",
                  color: isActive ? "#10D07A" : "#8A8F9E",
                  border: isActive
                    ? "1px solid rgba(16,208,122,0.25)"
                    : "1px solid transparent",
                  borderRadius: 6,
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'Syne', sans-serif",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = colors.textPrimary;
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#8A8F9E";
                    e.currentTarget.style.borderColor = "transparent";
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}

          {/* Badge */}
          <div
            style={{
              marginLeft: 16,
              padding: "5px 10px",
              borderRadius: 4,
              background: "rgba(37,99,235,0.12)",
              border: "1px solid rgba(37,99,235,0.2)",
              fontSize: 10,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#4A80E8",
              textTransform: "uppercase",
            }}
          >
            RAZORPAY BUILDATHON
          </div>
        </div>
      </div>
    </nav>
  );
}
