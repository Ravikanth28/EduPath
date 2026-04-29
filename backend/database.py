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

# Extract DB name directly from the connection string (e.g. .../edupath)
_db_match = re.search(r"/([^/?]+)(?:\?|$)", _raw)
DB_NAME = _db_match.group(1) if _db_match else "edupath"

# Convert  mysql://  →  mysql+pymysql://
_url = re.sub(r"^mysql://", "mysql+pymysql://", _raw)

# Build base URL (sys) and target URL
_base_url    = re.sub(r"/([^/?]+)(\?|$)", r"/sys\2",         _url)
DATABASE_URL = re.sub(r"/([^/?]+)(\?|$)", f"/{DB_NAME}\\2",  _url)

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

DEFAULT_PASS_PERCENTAGE = 70
DEFAULT_QUESTIONS_PER_TEST = 0
DEFAULT_SHUFFLE_QUESTIONS = False
DEFAULT_SHOW_EXPLANATIONS = True


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
    is_published  = Column(Boolean, default=False)


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


class CourseModule(Base):
    __tablename__ = "course_modules"
    __table_args__ = (UniqueConstraint("course_id", "num", name="uq_module"),)

    id                 = Column(Integer, primary_key=True, autoincrement=True)
    course_id          = Column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    num                = Column(Integer, nullable=False)
    title              = Column(String(200), nullable=False)
    pass_percentage    = Column(Integer, nullable=False, default=DEFAULT_PASS_PERCENTAGE)
    questions_per_test = Column(Integer, nullable=False, default=DEFAULT_QUESTIONS_PER_TEST)
    shuffle_questions  = Column(Boolean, nullable=False, default=DEFAULT_SHUFFLE_QUESTIONS)
    show_explanations  = Column(Boolean, nullable=False, default=DEFAULT_SHOW_EXPLANATIONS)


class ModuleVideo(Base):
    __tablename__ = "module_videos"
    __table_args__ = (UniqueConstraint("course_id", "module_num", "idx", name="uq_video"),)

    id         = Column(Integer, primary_key=True, autoincrement=True)
    course_id  = Column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    module_num = Column(Integer, nullable=False)
    idx        = Column(Integer, nullable=False)
    youtube_id = Column(String(20), nullable=False)
    title      = Column(String(200), nullable=False)


class ModuleVideoProgress(Base):
    __tablename__ = "module_video_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "course_id", "module_num", "video_idx", name="uq_video_progress"),
    )

    id         = Column(Integer, primary_key=True, autoincrement=True)
    user_id    = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id  = Column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    module_num = Column(Integer, nullable=False)
    video_idx  = Column(Integer, nullable=False)
    watched_at = Column(DateTime, default=datetime.utcnow)


class ModuleQuestion(Base):
    __tablename__ = "module_questions"
    __table_args__ = (UniqueConstraint("course_id", "module_num", "idx", name="uq_question"),)

    id          = Column(Integer, primary_key=True, autoincrement=True)
    course_id   = Column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    module_num  = Column(Integer, nullable=False)
    idx         = Column(Integer, nullable=False)
    question    = Column(Text, nullable=False)
    option_a    = Column(String(300), nullable=False)
    option_b    = Column(String(300), nullable=False)
    option_c    = Column(String(300), nullable=False)
    option_d    = Column(String(300), nullable=False)
    correct_idx = Column(Integer, nullable=False)
    explanation = Column(Text)


# ── Helpers ───────────────────────────────────────────────────────────────────
def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    _ensure_course_module_settings_columns()


def _ensure_course_module_settings_columns() -> None:
    columns = {
        "pass_percentage": f"INT NOT NULL DEFAULT {DEFAULT_PASS_PERCENTAGE}",
        "questions_per_test": f"INT NOT NULL DEFAULT {DEFAULT_QUESTIONS_PER_TEST}",
        "shuffle_questions": f"BOOLEAN NOT NULL DEFAULT {str(DEFAULT_SHUFFLE_QUESTIONS).upper()}",
        "show_explanations": f"BOOLEAN NOT NULL DEFAULT {str(DEFAULT_SHOW_EXPLANATIONS).upper()}",
    }
    with engine.begin() as conn:
        existing = {
            row[0]
            for row in conn.execute(text(
                """
                SELECT COLUMN_NAME
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'course_modules'
                """
            ))
        }
        for name, definition in columns.items():
            if name not in existing:
                conn.execute(text(f"ALTER TABLE course_modules ADD COLUMN {name} {definition}"))


def get_db():
    """FastAPI dependency that provides a DB session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
