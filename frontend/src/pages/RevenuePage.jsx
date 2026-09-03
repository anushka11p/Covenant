import { useState, useEffect, Suspense, lazy } from "react";
import Nav from "../components/Nav";
import RevenueStation from "../components/stations/RevenueStation";
import Icon from "../components/shared/Icon";
import { useReveal } from "../hooks/useReveal";
import { colors, type } from "../theme";

const CoinStackScene = lazy(() => import("../components/3d/CoinStackScene"));

const MERCHANT_ID = 1;

const NARRATIVE = [
  {
    icon: "brain",
    title: "AI DETECTS LOW STOCK",
    body: "The buyer agent monitors inventory signals and detects when a customer's preferred product is running low.",
  },
  {
    icon: "document",
    title: "MANDATE GATES THE PURCHASE",
    body: "The HMAC-signed mandate defines exactly what the AI may buy, at what price, from which merchants.",
  },
  {
    icon: "scale",
    title: "POLICY ENGINE VALIDATES",
    body: "Seven deterministic rules check the proposal against structured data — not marketing copy, not AI inference.",
  },
  {
    icon: "card",
    title: "RAZORPAY EXECUTES",
    body: "Only after policy clearance does the payment flow reach Razorpay. Zero AI involvement in authorization.",
  },
  {
    icon: "trending",
    title: "MERCHANT CAPTURES REVENUE",
    body: "Sales that would have been forgotten become captured revenue. Autonomy without blind trust.",
  },
];

export default function RevenuePage({ activeNav, onNavigate }) {
  useReveal();

  return (
    <div style={{ background: colors.bg, minHeight: "100vh" }}>
      <Nav active={activeNav} onNavigate={onNavigate} />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "120px 32px 100px" }}>

        {/* ── Hero ── */}
        <div className="reveal" style={{ marginBottom: 80, textAlign: "center" }}>
          <div style={{ ...type.label, color: colors.textMuted, marginBottom: 20 }}>
            BUSINESS CASE · WHY COVENANT EXISTS
          </div>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(40px, 7vw, 80px)",
              fontWeight: 800,
              color: colors.textPrimary,
              letterSpacing: "-3px",
              lineHeight: 0.95,
              marginBottom: 24,
            }}
          >
            SECURITY
            <br />
            <span style={{ color: "rgba(255,255,255,0.2)" }}>ENABLES</span>
            <br />
            <span style={{ color: "#10D07A" }}>GROWTH.</span>
          </h1>
          <p
            style={{
              ...type.body,
              color: colors.textSecondary,
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.75,
              fontSize: 17,
            }}
          >
            Covenant isn&apos;t just a security layer. It&apos;s the trust mechanism
            that makes autonomous reordering commercially viable for merchants.
          </p>
        </div>

        {/* ── Revenue narrative ── */}
        <div className="reveal" style={{ marginBottom: 80 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              alignItems: "center",
              padding: "40px",
              background: colors.surface,
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 16,
            }}
          >
            <div>
              <div style={{ ...type.label, color: colors.textMuted, marginBottom: 16 }}>
                WITHOUT COVENANT
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  "Customer forgets to reorder",
                  "Stock runs out unnoticed",
                  "Merchant never sees the sale",
                  "Revenue permanently lost",
                ].map((s) => (
                  <div
                    key={s}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      background: "rgba(255,59,59,0.04)",
                      border: "1px solid rgba(255,59,59,0.1)",
                      borderRadius: 6,
                    }}
                  >
                    <span style={{ color: "#FF3B3B", fontSize: 12 }}>✕</span>
                    <span style={{ ...type.small, color: colors.textSecondary, fontSize: 13 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ ...type.label, color: "#10D07A", marginBottom: 16 }}>
                WITH COVENANT
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  "AI detects low stock proactively",
                  "Mandate validates the purchase",
                  "Policy Engine clears the order",
                  "Revenue captured autonomously",
                ].map((s) => (
                  <div
                    key={s}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      background: "rgba(16,208,122,0.04)",
                      border: "1px solid rgba(16,208,122,0.12)",
                      borderRadius: 6,
                    }}
                  >
                    <span style={{ color: "#10D07A", fontSize: 12 }}>✓</span>
                    <span style={{ ...type.small, color: colors.textSecondary, fontSize: 13 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Process narrative ── */}
        <div className="reveal" style={{ marginBottom: 80 }}>
          <div style={{ ...type.label, color: colors.textMuted, marginBottom: 32, textAlign: "center" }}>
            THE VALUE CHAIN
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {NARRATIVE.map((n, i) => (
              <div
                key={n.title}
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                  padding: "20px 24px",
                  background: colors.surface,
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: i === 0 ? "8px 8px 0 0" : i === NARRATIVE.length - 1 ? "0 0 8px 8px" : 0,
                  borderBottom: i < NARRATIVE.length - 1 ? "none" : "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                  <Icon name={n.icon} size={20} color="#10D07A" strokeWidth={1.5} />
                </div>
                <div>
                  <div style={{ ...type.label, color: "#10D07A", fontSize: 10, marginBottom: 6 }}>
                    {n.title}
                  </div>
                  <p style={{ ...type.body, color: colors.textSecondary, fontSize: 14, lineHeight: 1.6 }}>
                    {n.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Live Revenue Data ── */}
        <div className="reveal" style={{ marginBottom: 80 }}>
          <div style={{ ...type.label, color: colors.textMuted, marginBottom: 24 }}>
            LIVE BACKEND DATA
          </div>
          <div className="station-card">
            <RevenueStation merchantId={MERCHANT_ID} />
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="reveal" style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 800,
              color: colors.textPrimary,
              letterSpacing: "-1.5px",
              marginBottom: 20,
            }}
          >
            AUTONOMY
            <br />
            WITHOUT
            <br />
            <span style={{ color: "#10D07A" }}>BLIND TRUST.</span>
          </div>
          <p style={{ ...type.body, color: colors.textSecondary, marginBottom: 40, maxWidth: 400, margin: "0 auto 40px" }}>
            Watch it work live. Every API call is real. Every payment is test mode.
          </p>
          <button
            className="btn-primary"
            onClick={() => onNavigate("demo")}
            style={{ fontSize: 15, padding: "18px 48px" }}
          >
            ENTER DEMO
          </button>
        </div>
      </div>
    </div>
  );
}
