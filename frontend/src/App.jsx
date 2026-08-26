import { useState } from "react";
import OverviewPage from "./pages/OverviewPage";
import ShopStation from "./components/stations/CatalogStation";
import MandateStation from "./components/stations/MandateStation";
import AIDecisionStation from "./components/stations/AIDecisionStation";
import AttackStation from "./components/stations/AttackStation";
import AuditStation from "./components/stations/AuditStation";
import RevenueStation from "./components/stations/RevenueStation";
import IsolationProofStation from "./components/stations/IsolationProofStation";
import Nav from "./components/Nav";
import { colors } from "./theme";

const MERCHANT_ID = 1;
const PRINCIPAL_ID = 1;

export default function App() {
  const [page, setPage] = useState("overview");
  const [mandateId, setMandateId] = useState(null);

  if (page === "overview") {
    return <OverviewPage merchantId={MERCHANT_ID} activeNav={page} onNavigate={setPage} />;
  }

  return (
    <div style={{ background: colors.bg, minHeight: "100vh" }}>
      <Nav active={page} onNavigate={setPage} />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        {page === "shop" && <ShopStation merchantId={MERCHANT_ID} revealCompromised={false} />}
        {page === "buyer" && (
          <>
            <MandateStation principalId={PRINCIPAL_ID} merchantId={MERCHANT_ID} onCreated={(m) => setMandateId(m.mandate_id)} />
            <div style={{ marginTop: 40 }}>
              <AIDecisionStation mandateId={mandateId} />
            </div>
          </>
        )}
        {page === "protection" && (
          <>
            <AttackStation mandateId={mandateId} onCompleted={() => {}} />
            <div style={{ marginTop: 40 }}>
              <AuditStation mandateId={mandateId} />
            </div>
            <div style={{ marginTop: 40 }}>
              <IsolationProofStation />
            </div>
          </>
        )}
        {page === "revenue" && <RevenueStation merchantId={MERCHANT_ID} />}
      </div>
    </div>
  );
}
