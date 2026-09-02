import { useState } from "react";
import { getCatalog } from "../../api";
import { transformCatalog } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";
import { colors, type } from "../../theme";

export default function CatalogStation({ merchantId, onLoaded, revealCompromised }) {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleLoad() {
    setLoading(true);
    const raw = await getCatalog(merchantId);
    const transformed = transformCatalog(raw);
    setProducts(transformed);
    onLoaded?.(transformed);
    setLoading(false);
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...type.label, color: colors.textMuted, marginBottom: 12 }}>
          MERCHANT CATALOG · BRAMBLE & CO.
        </div>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: colors.textPrimary,
            letterSpacing: "-0.5px",
            marginBottom: 12,
          }}
        >
          Meet the Merchant
        </h2>
        <p style={{ ...type.body, color: colors.textSecondary, maxWidth: 480, lineHeight: 1.7 }}>
          Bramble &amp; Co. sells dog food, treats, and supplements.
          One product listing contains hidden adversarial merchandising text.
        </p>
      </div>

      {!products && (
        <button
          id="catalog-load-btn"
          className="btn-primary"
          onClick={handleLoad}
          disabled={loading}
        >
          {loading ? "LOADING CATALOG…" : "LOAD CATALOG"}
        </button>
      )}

      {products && (
        <div>
          {revealCompromised && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 14px",
                background: "rgba(255,59,59,0.06)",
                border: "1px solid rgba(255,59,59,0.15)",
                borderRadius: 6,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "#FF3B3B",
                letterSpacing: "0.08em",
              }}
            >
              ⚠ ONE LISTING CONTAINS ADVERSARIAL MERCHANDISING TEXT
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 10,
            }}
          >
            {products.map((p, i) => (
              <ProductTile
                key={p.sku}
                product={p}
                revealCompromised={revealCompromised}
                delay={i * 50}
              />
            ))}
          </div>

          <button className="btn-link" onClick={() => setDrawerOpen(true)} style={{ marginTop: 16 }}>
            ↳ view raw catalog data
          </button>
        </div>
      )}

      <TechnicalDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Raw catalog data"
        explanation="This is the exact structured data an AI agent reads — not marketing copy, real fields like price, category, and verified allergen tags."
        data={products?.map((p) => p.raw)}
      />
    </div>
  );
}

function ProductTile({ product, revealCompromised, delay }) {
  const isCompromised = product.isCompromised;
  const showWarn = isCompromised && revealCompromised;
  const showDot = isCompromised && !revealCompromised;

  return (
    <div
      className="step-card"
      style={{
        padding: "14px",
        borderRadius: 8,
        background: showWarn ? "rgba(255,59,59,0.04)" : "rgba(255,255,255,0.02)",
        border: showWarn
          ? "1px solid rgba(255,59,59,0.2)"
          : "1px solid rgba(255,255,255,0.05)",
        animationDelay: `${delay}ms`,
        transition: "border-color 0.4s ease, background 0.4s ease",
        position: "relative",
      }}
    >
      {/* Compromised warning */}
      {showWarn && (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            color: "#FF3B3B",
            background: "rgba(255,59,59,0.1)",
            border: "1px solid rgba(255,59,59,0.2)",
            borderRadius: 3,
            padding: "2px 5px",
            letterSpacing: "0.06em",
          }}
        >
          ⚠
        </div>
      )}

      {/* Hidden warning dot (before attack is revealed) */}
      {showDot && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#F59E0B",
            boxShadow: "0 0 6px rgba(245,158,11,0.5)",
          }}
        />
      )}

      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: colors.textMuted,
          letterSpacing: "0.08em",
          marginBottom: 8,
        }}
      >
        {product.sku}
      </div>

      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: colors.textPrimary,
          lineHeight: 1.3,
          marginBottom: 8,
        }}
      >
        {product.name}
      </div>

      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 18,
          fontWeight: 800,
          color: "#10D07A",
        }}
      >
        ₹{product.priceRupees}
      </div>

      {/* Allergen tags */}
      {product.allergens?.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
          {product.allergens.map((a) => (
            <span
              key={a}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                color: a === "chicken" ? "#FF3B3B" : colors.textMuted,
                background: a === "chicken" ? "rgba(255,59,59,0.08)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${a === "chicken" ? "rgba(255,59,59,0.2)" : "rgba(255,255,255,0.05)"}`,
                borderRadius: 3,
                padding: "2px 5px",
                letterSpacing: "0.04em",
              }}
            >
              {a}
            </span>
          ))}
        </div>
      )}

      {showWarn && (
        <div
          style={{
            marginTop: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            color: "#FF3B3B",
            lineHeight: 1.4,
          }}
        >
          ADVERSARIAL TEXT DETECTED
        </div>
      )}
    </div>
  );
}
