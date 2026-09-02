import { useState } from "react";
import { getCatalog } from "../../api";
import { transformCatalog } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";
import { colors, type, shadow } from "../../theme";

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
      <h2 style={{ ...type.h2, color: colors.textPrimary }}>Meet the Merchant</h2>
      <p style={{ ...type.body, color: colors.textSecondary }}>Bramble & Co. sells dog food, treats, and supplements.</p>
      <button onClick={handleLoad} disabled={loading} className="btn-primary">
        {loading ? "Loading shelf…" : "Load Catalog"}
      </button>

      {products && (
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {products.map((p, i) => (
            <div key={p.sku} className="step-card" style={{
              padding: 14, borderRadius: 10, background: colors.surface,
              border: p.isCompromised && revealCompromised ? `1px solid ${colors.danger}` : `1px solid ${colors.border}`,
              boxShadow: shadow.soft,
              animationDelay: `${i * 60}ms`,
            }}>
              <div style={{ ...type.h3, color: colors.textPrimary }}>{p.name}</div>
              <div style={{ ...type.financial, fontSize: 16, color: colors.success, marginTop: 4 }}>₹{p.priceRupees}</div>
              {p.isCompromised && revealCompromised && (
                <div style={{ ...type.small, fontSize: 11, color: colors.danger, marginTop: 6, fontWeight: 700 }}>⚠ compromised listing</div>
              )}
              {p.isCompromised && !revealCompromised && (
                <div style={{ width: 6, height: 6, borderRadius: 3, background: colors.warning, marginTop: 6 }} />
              )}
            </div>
          ))}
        </div>
      )}

      {products && (
        <button onClick={() => setDrawerOpen(true)} style={linkStyle}>View technical details</button>
      )}

      <TechnicalDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        title="Raw catalog data"
        explanation="This is the exact structured data an AI agent reads — not marketing copy, real fields like price, category, and verified allergen tags."
        data={products?.map((p) => p.raw)}
      />
    </div>
  );
}

const btnStyle = { padding: "10px 18px", borderRadius: 8, border: "none", background: colors.primary, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 };
const linkStyle = { display: "block", marginTop: 14, background: "none", border: "none", color: colors.primary, cursor: "pointer", fontSize: 13, padding: 0 };
