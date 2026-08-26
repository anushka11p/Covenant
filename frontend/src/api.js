const BASE_URL = "http://localhost:8000";

export async function getCatalog(merchantId) {
  const res = await fetch(`${BASE_URL}/catalog/${merchantId}`);
  return res.json();
}

export async function createMandate(payload) {
  const res = await fetch(`${BASE_URL}/mandates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function proposeAutonomous(payload) {
  const res = await fetch(`${BASE_URL}/transactions/propose-autonomous`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function runAttackScenario(mandateId) {
  const res = await fetch(`${BASE_URL}/demo/run-attack-scenario?mandate_id=${mandateId}`, {
    method: "POST",
  });
  return res.json();
}

export async function getAuditTrail(mandateId) {
  const res = await fetch(`${BASE_URL}/audit/${mandateId}`);
  return res.json();
}

export async function getRevenue(merchantId) {
  const res = await fetch(`${BASE_URL}/merchant/${merchantId}/revenue`);
  return res.json();
}

export async function attemptAgentHack() {
  const res = await fetch(`${BASE_URL}/demo/attempt-agent-hack`, { method: "POST" });
  return { status: res.status, body: await res.json() };
}
