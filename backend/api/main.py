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
