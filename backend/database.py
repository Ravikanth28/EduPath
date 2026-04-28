"""
TiDB (MySQL-compatible) database setup via SQLAlchemy.
Tables are created automatically on startup via init_db().
"""

import os
import re
import uuid
from datetime import datetime

import certifi
from dotenv import load_dotenv
from sqlalchemy import (
    Boolean, Column, DateTime, Enum, ForeignKey,
    Integer, String, Text, UniqueConstraint,
    create_engine, text,
)
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

# ── Parse connection string ───────────────────────────────────────────────────
_raw = os.getenv("TIDB_CONNECTION_STRING", "")
if not _raw:
    raise RuntimeError("TIDB_CONNECTION_STRING is not set in .env")

DB_NAME = os.getenv("TIDB_DB_NAME", "edupath")

# Convert  mysql://  →  mysql+pymysql://
_url = re.sub(r"^mysql://", "mysql+pymysql://", _raw)

# Build base URL (sys) and target URL (edupath)
_base_url    = re.sub(r"/([^/?]+)$", "/sys",     _url)
DATABASE_URL = re.sub(r"/([^/?]+)$", f"/{DB_NAME}", _url)

# TiDB Cloud requires SSL; certifi provides a cross-platform CA bundle
_SSL = {
    "ssl_ca": certifi.where(),
    "ssl_verify_cert": True,
    "ssl_verify_identity": True,
}

# ── Create the database if it does not exist ─────────────────────────────────
def _ensure_database() -> None:
    base_engine = create_engine(
        _base_url, connect_args=_SSL, pool_pre_ping=True
    )
    with base_engine.connect() as conn:
        conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}`"))
    base_engine.dispose()

try:
    _ensure_database()
except Exception as exc:
    print(f"[WARN] Could not auto-create database '{DB_NAME}': {exc}")

# ── Engine & session factory ──────────────────────────────────────────────────
engine = create_engine(DATABASE_URL, connect_args=_SSL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ── ORM Models ────────────────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id             = Column(String(36),  primary_key=True, default=lambda: str(uuid.uuid4()))
    name           = Column(String(100), nullable=False)
    email          = Column(String(255), nullable=False, unique=True, index=True)
    phone          = Column(String(15),  nullable=False)
    password_hash  = Column(String(255), nullable=False)
    role           = Column(Enum("student", "admin"), nullable=False, default="student")
    verified       = Column(Boolean, default=False)
    joined_at      = Column(String(50))
    points         = Column(Integer, default=0)
    courses_completed = Column(Integer, default=0)


class Course(Base):
    __tablename__ = "courses"

    id            = Column(String(36),  primary_key=True)
    title         = Column(String(200), nullable=False)
    description   = Column(Text)
    category      = Column(String(100))
    modules_count = Column(Integer, default=0)
    videos_count  = Column(Integer, default=0)
    quizzes_count = Column(Integer, default=0)
    students_count= Column(Integer, default=0)
    grad          = Column(String(200))
    accent        = Column(String(20))


class Enrollment(Base):
    __tablename__ = "enrollments"
    __table_args__ = (
        UniqueConstraint("user_id", "course_id", name="uq_enrollment"),
    )

    id          = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id     = Column(String(36), ForeignKey("users.id",   ondelete="CASCADE"), nullable=False)
    course_id   = Column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    progress    = Column(Integer, default=0)
    enrolled_at = Column(DateTime, default=datetime.utcnow)


class Certificate(Base):
    __tablename__ = "certificates"

    id           = Column(String(36),  primary_key=True, default=lambda: str(uuid.uuid4()))
    course_name  = Column(String(200))
    category     = Column(String(100))
    student_id   = Column(String(36),  ForeignKey("users.id", ondelete="CASCADE"))
    issued_date  = Column(String(50))
    status       = Column(Enum("verified", "pending", "revoked"), default="pending")
    grad         = Column(String(200))
    accent       = Column(String(20))
    accent_dim   = Column(String(50))
    accent_border= Column(String(50))


class ActivityLog(Base):
    __tablename__ = "activity_log"

    id           = Column(Integer, primary_key=True, autoincrement=True)
    student_name = Column(String(100))
    detail       = Column(Text)
    created_at   = Column(DateTime, default=datetime.utcnow)


# ── Helpers ───────────────────────────────────────────────────────────────────
def init_db() -> None:
    """Create all tables (idempotent — safe to call on every startup)."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """FastAPI dependency that provides a DB session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
