import { useState } from "react";
import { createMandate } from "../../api";
import { transformMandate } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";
import { colors, type } from "../../theme";

const MANDATE_FIELDS_DISPLAY = [
  { key: "AGENT", val: "agent_buyer_1", color: "#8A8F9E" },
  { key: "MERCHANT", val: "Bramble & Co. (ID: 1)", color: "#8A8F9E" },
  { key: "CATEGORIES", val: "pet_food · pet_treats", color: "#8A8F9E" },
  { key: "MAX / TRANSACTION", val: "₹2,500", color: "#10D07A" },
  { key: "DAILY LIMIT", val: "₹2,500", color: "#10D07A" },
  { key: "MONTHLY LIMIT", val: "₹6,000", color: "#10D07A" },
  { key: "HARD EXCLUSION", val: "chicken (allergen)", color: "#FF3B3B" },
  { key: "PAYMENT METHOD", val: "test_upi", color: "#8A8F9E" },
];

export default function MandateStation({ principalId, merchantId, onCreated }) {
  const [mandate, setMandate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleCreate() {
    setLoading(true);
    const raw = await createMandate({
      principal_id: principalId,
      agent_id: "agent_buyer_1",
      merchant_allowlist: [merchantId],
      allowed_categories: ["pet_food", "pet_treats"],
      max_transaction_amount: 250000,
      daily_limit: 250000,
      monthly_limit: 600000,
      hard_constraints: { excluded_allergens: ["chicken"] },
      allowed_payment_method: "test_upi",
      purpose: "Recurring pet nutrition replenishment",
    });
    const transformed = transformMandate(raw);
    setMandate(transformed);
    onCreated?.(raw);
    setLoading(false);
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...type.label, color: colors.textMuted, marginBottom: 12 }}>
          AUTHORIZATION DOCUMENT
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
          Create the Mandate
        </h2>
        <p style={{ ...type.body, color: colors.textSecondary, maxWidth: 480, lineHeight: 1.7 }}>
          The human establishes what the AI may purchase. This is cryptographically signed — any tampering breaks the signature.
        </p>
      </div>

      {!mandate && (
        <button
          id="mandate-create-btn"
          className="btn-primary"
          onClick={handleCreate}
          disabled={loading}
          style={{ marginBottom: 28 }}
        >
          {loading ? "SIGNING MANDATE…" : "CREATE & SIGN MANDATE"}
        </button>
      )}

      {mandate && (
        <div
          className="step-card"
          style={{
            background: "#0A0E13",
            border: "1px solid rgba(16,208,122,0.15)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {/* Top bar */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "#10D07A",
                letterSpacing: "0.12em",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#10D07A",
                  boxShadow: "0 0 6px rgba(16,208,122,0.6)",
                }}
              />
              MANDATE ACTIVE
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: "#F59E0B",
                letterSpacing: "0.1em",
              }}
            >
              HMAC-SHA256 · SIGNED
            </div>
          </div>

          {/* Fields */}
          <div>
            {MANDATE_FIELDS_DISPLAY.map((field, i) => (
              <div
                key={field.key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "11px 20px",
                  borderBottom: i < MANDATE_FIELDS_DISPLAY.length - 1
                    ? "1px solid rgba(255,255,255,0.03)"
                    : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: colors.textMuted,
                    letterSpacing: "0.08em",
                  }}
                >
                  {field.key}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: field.color,
                    fontWeight: 600,
                  }}
                >
                  {field.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {mandate && (
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 16 }}>
          <button className="btn-link" onClick={() => setDrawerOpen(true)}>
            ↳ view cryptographic signature
          </button>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "#10D07A",
              background: "rgba(16,208,122,0.08)",
              border: "1px solid rgba(16,208,122,0.15)",
              borderRadius: 4,
              padding: "4px 10px",
            }}
          >
            ✓ MANDATE CREATED
          </span>
        </div>
      )}

      <TechnicalDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Mandate security details"
        explanation="The permission is cryptographically signed — any edit to the stored values would break this signature, proving it hasn't been tampered with."
        data={mandate?.raw}
      />
    </div>
  );
}
