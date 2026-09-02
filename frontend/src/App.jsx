import { useState, useEffect } from "react";
import OverviewPage from "./pages/OverviewPage";
import DemoPage from "./pages/DemoPage";
import RevenuePage from "./pages/RevenuePage";
import { colors } from "./theme";

export default function App() {
  const [page, setPage] = useState("overview");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  function navigate(to) {
    setPage(to);
  }

  return (
    <div style={{ background: colors.bg, minHeight: "100vh" }}>
      {page === "overview" && (
        <OverviewPage activeNav={page} onNavigate={navigate} />
      )}
      {page === "demo" && (
        <DemoPage activeNav={page} onNavigate={navigate} />
      )}
      {page === "revenue" && (
        <RevenuePage activeNav={page} onNavigate={navigate} />
      )}
    </div>
  );
}
