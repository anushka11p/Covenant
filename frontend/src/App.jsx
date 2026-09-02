import { useState, useEffect } from "react";
import OverviewPage from "./pages/OverviewPage";
import ShopStation from "./components/stations/CatalogStation";
import MandateStation from "./components/stations/MandateStation";
import AIDecisionStation from "./components/stations/AIDecisionStation";
import AttackStation from "./components/stations/AttackStation";
import AuditStation from "./components/stations/AuditStation";
import RevenueStation from "./components/stations/RevenueStation";
import IsolationProofStation from "./components/stations/IsolationProofStation";
import Nav from "./components/Nav";
import RevenueBar from "./components/RevenueBar";
import { colors } from "./theme";
import { useReveal } from "./hooks/useReveal";

const MERCHANT_ID = 1;
const PRINCIPAL_ID = 1;

function DemoPage({ mandateId, setMandateId }) {
  useReveal();
  return (
    <>
      <RevenueBar human={4200} autonomous={5750} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "128px 24px 100px" }}>
        <div className="reveal" style={{ marginBottom: 28 }}>
          <ShopStation merchantId={MERCHANT_ID} revealCompromised={false} />
        </div>
        <div className="reveal" style={{ marginBottom: 28 }}>
          <MandateStation
            principalId={PRINCIPAL_ID}
            merchantId={MERCHANT_ID}
            onCreated={(m) => setMandateId(m.mandate_id)}
          />
        </div>
        <div className="reveal" style={{ marginBottom: 28 }}>
          <AIDecisionStation mandateId={mandateId} />
        </div>
        <div className="reveal" style={{ marginBottom: 28 }}>
          <AttackStation mandateId={mandateId} onCompleted={() => {}} />
        </div>
        <div className="reveal" style={{ marginBottom: 28 }}>
          <IsolationProofStation />
        </div>
        <div className="reveal">
          <AuditStation mandateId={mandateId} />
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [page, setPage] = useState("overview");
  const [mandateId, setMandateId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (page === "overview") {
    return <OverviewPage activeNav={page} onNavigate={setPage} />;
  }

  return (
    <div style={{ background: colors.bg, minHeight: "100vh" }}>
      <Nav active={page} onNavigate={setPage} />
      {page === "demo" && (
        <DemoPage mandateId={mandateId} setMandateId={setMandateId} />
      )}
      {page === "revenue" && (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "128px 24px 100px" }}>
          <RevenueBar human={4200} autonomous={5750} />
          <div style={{ marginTop: 32 }}>
            <RevenueStation merchantId={MERCHANT_ID} />
          </div>
        </div>
      )}
    </div>
  );
}
