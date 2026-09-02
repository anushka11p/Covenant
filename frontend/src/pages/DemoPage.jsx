import { useState } from "react";
import Nav from "../components/Nav";
import RevenueCounterSticky from "../components/RevenueCounterSticky";
import CatalogStation from "../components/stations/CatalogStation";
import MandateStation from "../components/stations/MandateStation";
import AIDecisionStation from "../components/stations/AIDecisionStation";
import AttackStation from "../components/stations/AttackStation";
import AuditStation from "../components/stations/AuditStation";
import IsolationProofStation from "../components/stations/IsolationProofStation";
import { colors, type } from "../theme";

const MERCHANT_ID = 1;
const PRINCIPAL_ID = 1;

export default function DemoPage({ activeNav, onNavigate }) {
  const [mandateId, setMandateId] = useState(null);
  const [attackHappened, setAttackHappened] = useState(false);
  const [revenueRefreshKey, setRevenueRefreshKey] = useState(0);

  function handleAttackCompleted() {
    setAttackHappened(true);
    setRevenueRefreshKey((k) => k + 1); // triggers sticky counter to re-fetch
  }

  return (
    <div style={{ background: colors.bg, minHeight: "100vh" }}>
      <Nav active={activeNav} onNavigate={onNavigate} />
      <RevenueCounterSticky merchantId={MERCHANT_ID} refreshKey={revenueRefreshKey} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 100px" }}>

        <Section id="catalog" title="1 · The merchant's catalog">
          <CatalogStation merchantId={MERCHANT_ID} revealCompromised={attackHappened} />
        </Section>

        <Section id="mandate" title="2 · Buying permission">
          <MandateStation
            principalId={PRINCIPAL_ID}
            merchantId={MERCHANT_ID}
            onCreated={(m) => setMandateId(m.mandate_id)}
          />
        </Section>

        <Section id="decision" title="3 · The AI decides">
          <AIDecisionStation mandateId={mandateId} />
        </Section>

        <Section id="attack" title="4 · Attack, block & recovery">
          <AttackStation mandateId={mandateId} onCompleted={handleAttackCompleted} />
        </Section>

        <Section id="isolation" title="5 · Can the AI pay directly?">
          <IsolationProofStation />
        </Section>

        <Section id="audit" title="6 · What actually happened">
          <AuditStation mandateId={mandateId} />
        </Section>

        {!mandateId && (
          <div style={{ ...type.small, color: colors.caution, textAlign: "center", marginTop: 24 }}>
            Create a permission above before trying the later steps.
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <div id={id} style={{ marginTop: 56, scrollMarginTop: 90 }}>
      <div style={{ ...type.label, color: colors.textMuted, marginBottom: 8 }}>{title}</div>
      <div style={{ background: "#fff", border: `1px solid ${colors.border}`, borderRadius: 14, padding: 28 }}>
        {children}
      </div>
    </div>
  );
}
