from __future__ import annotations

from fastapi import FastAPI

from models.db import get_engine, get_session_factory, init_db

app = FastAPI(title="Covenant")

engine = get_engine("sqlite:///./covenant.db")
init_db(engine)
SessionFactory = get_session_factory(engine)


def get_session():
    session = SessionFactory()
    try:
        yield session
    finally:
        session.close()


@app.get("/health")
def health():
    return {"status": "ok"}

from api.catalog import router as catalog_router
app.include_router(catalog_router)

from api.mandates import router as mandates_router
app.include_router(mandates_router)

from api.transactions import router as transactions_router
app.include_router(transactions_router)

from api.audit import router as audit_router
app.include_router(audit_router)

from api.revenue import router as revenue_router
app.include_router(revenue_router)

from api.demo_attack import router as demo_attack_router
app.include_router(demo_attack_router)
