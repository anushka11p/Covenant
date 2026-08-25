"""
Covenant — Database models.
Schema is frozen per the locked spec.
"""
from __future__ import annotations

import enum
from datetime import datetime

from sqlalchemy import (
    JSON, Boolean, DateTime, Enum, ForeignKey, Integer, String, Text,
    UniqueConstraint, create_engine,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker


class Base(DeclarativeBase):
    pass


class UserRole(str, enum.Enum):
    principal = "principal"
    merchant_admin = "merchant_admin"
    admin = "admin"


class MandateStatus(str, enum.Enum):
    active = "active"
    suspended = "suspended"
    revoked = "revoked"
    expired = "expired"


class TransactionStatus(str, enum.Enum):
    proposed = "proposed"
    approved = "approved"
    denied = "denied"
    security_blocked = "security_blocked"
    paid = "paid"
    failed = "failed"


class InitiatedBy(str, enum.Enum):
    agent = "agent"
    human = "human"


class EventType(str, enum.Enum):
    catalog_queried = "catalog_queried"
    agent_proposal = "agent_proposal"
    policy_check = "policy_check"
    policy_denial = "policy_denial"
    security_event = "security_event"
    order_created = "order_created"
    payment_confirmed = "payment_confirmed"
    webhook_received = "webhook_received"


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole))


class Merchant(Base):
    __tablename__ = "merchants"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    razorpay_account_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    catalog_version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    products: Mapped[list["Product"]] = relationship(back_populates="merchant")


class Product(Base):
    __tablename__ = "products"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    merchant_id: Mapped[int] = mapped_column(ForeignKey("merchants.id"))
    sku: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200))
    price_paise: Mapped[int] = mapped_column(Integer)
    category: Mapped[str] = mapped_column(String(100))
    allergen_tags: Mapped[dict] = mapped_column(JSON, default=dict)
    stock_qty: Mapped[int] = mapped_column(Integer)
    days_per_unit_for_sku: Mapped[int | None] = mapped_column(Integer, nullable=True)
    bundle_partner_sku: Mapped[str | None] = mapped_column(String(50), nullable=True)
    bundle_discount_pct: Mapped[int | None] = mapped_column(Integer, nullable=True)
    merchandising_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    quarantined: Mapped[bool] = mapped_column(Boolean, default=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    merchant: Mapped["Merchant"] = relationship(back_populates="products")


class Mandate(Base):
    __tablename__ = "mandates"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    mandate_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    version: Mapped[int] = mapped_column(Integer, default=1)
    principal_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    agent_id: Mapped[str] = mapped_column(String(50))
    status: Mapped[MandateStatus] = mapped_column(Enum(MandateStatus), default=MandateStatus.active)
    merchant_allowlist: Mapped[list] = mapped_column(JSON)
    allowed_categories: Mapped[list] = mapped_column(JSON)
    max_transaction_amount: Mapped[int] = mapped_column(Integer)
    daily_limit: Mapped[int] = mapped_column(Integer)
    monthly_limit: Mapped[int] = mapped_column(Integer)
    currency: Mapped[str] = mapped_column(String(3), default="INR")
    hard_constraints: Mapped[dict] = mapped_column(JSON)
    allowed_payment_method: Mapped[str] = mapped_column(String(100))
    purpose: Mapped[str] = mapped_column(String(300))
    expiry: Mapped[datetime] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    created_by: Mapped[str] = mapped_column(String(100), default="principal_dashboard")
    signature: Mapped[str] = mapped_column(String(200))


class Transaction(Base):
    __tablename__ = "transactions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    mandate_id: Mapped[str] = mapped_column(ForeignKey("mandates.mandate_id"), index=True)
    sku: Mapped[str] = mapped_column(String(50))
    proposed_amount_paise: Mapped[int] = mapped_column(Integer)
    proposed_qty: Mapped[int] = mapped_column(Integer, default=1)
    nonce: Mapped[str] = mapped_column(String(64))
    idempotency_key: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    status: Mapped[TransactionStatus] = mapped_column(Enum(TransactionStatus), default=TransactionStatus.proposed)
    razorpay_order_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    razorpay_payment_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    initiated_by: Mapped[InitiatedBy] = mapped_column(Enum(InitiatedBy), default=InitiatedBy.agent)
    baseline_sku: Mapped[str | None] = mapped_column(String(50), nullable=True)
    baseline_price_paise: Mapped[int | None] = mapped_column(Integer, nullable=True)
    reasoning_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    days_vs_baseline: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    __table_args__ = (UniqueConstraint("idempotency_key", name="uq_transactions_idempotency_key"),)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    transaction_id: Mapped[int | None] = mapped_column(ForeignKey("transactions.id"), nullable=True)
    mandate_id: Mapped[str | None] = mapped_column(String(50), nullable=True)
    event_type: Mapped[EventType] = mapped_column(Enum(EventType))
    actor: Mapped[str] = mapped_column(String(100))
    reason_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    rule_fired: Mapped[str | None] = mapped_column(String(100), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)


def get_engine(db_url: str = "sqlite:///./covenant.db"):
    return create_engine(db_url, connect_args={"check_same_thread": False} if "sqlite" in db_url else {})


def get_session_factory(engine):
    return sessionmaker(bind=engine, autoflush=False, autocommit=False)


def init_db(engine):
    Base.metadata.create_all(engine)
