import { useState } from "react";
import { getCatalog } from "../../api";
import { transformCatalog } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";

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
      <h2 style={{ color: "#f2f2f5" }}>Meet the Merchant</h2>
      <p style={{ color: "#9a9aa5", fontSize: 14 }}>Bramble & Co. sells dog food, treats, and supplements.</p>
      <button onClick={handleLoad} disabled={loading} style={btnStyle}>
        {loading ? "Loading shelf…" : "Load Catalog"}
      </button>

      {products && (
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {products.map((p, i) => (
            <div key={p.sku} style={{
              padding: 14, borderRadius: 10, background: "#15151a",
              border: p.isCompromised && revealCompromised ? "1px solid #e05252" : "1px solid #26262e",
              animation: `fadeIn 0.3s ease ${i * 0.08}s both`,
            }}>
              <div style={{ color: "#f2f2f5", fontWeight: 600, fontSize: 14 }}>{p.name}</div>
              <div style={{ color: "#4caf50", fontSize: 16, fontWeight: 700, marginTop: 4 }}>₹{p.priceRupees}</div>
              {p.isCompromised && revealCompromised && (
                <div style={{ color: "#e05252", fontSize: 11, marginTop: 6 }}>⚠ compromised listing</div>
              )}
              {p.isCompromised && !revealCompromised && (
                <div style={{ width: 6, height: 6, borderRadius: 3, background: "#f0a500", marginTop: 6 }} />
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

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

const btnStyle = { padding: "10px 18px", borderRadius: 8, border: "none", background: "#2c2c34", color: "#f2f2f5", cursor: "pointer", fontSize: 14 };
const linkStyle = { display: "block", marginTop: 14, background: "none", border: "none", color: "#7a9eff", cursor: "pointer", fontSize: 13, padding: 0 };
