"""
Seed script — run once to populate the TiDB database with tables and sample data.
    cd backend
    python seed.py
"""

import uuid
from datetime import datetime

from passlib.context import CryptContext

from database import (
    ActivityLog, Certificate, Course, Enrollment,
    SessionLocal, User, init_db,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed() -> None:
    print("Initialising tables…")
    init_db()

    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            print("Database already has data — skipping seed.")
            return

        # ── Users ─────────────────────────────────────────────────────────────
        admin_id  = str(uuid.uuid4())
        arjun_id  = str(uuid.uuid4())
        priya_id  = str(uuid.uuid4())
        rahul_id  = str(uuid.uuid4())
        sneha_id  = str(uuid.uuid4())
        deepa_id  = str(uuid.uuid4())
        karan_id  = str(uuid.uuid4())
        anita_id  = str(uuid.uuid4())

        users = [
            User(id=admin_id, name="Admin",          email="admin@edupath.com",  phone="0000000000",
                 password_hash=pwd_context.hash("admin123"),   role="admin",    verified=True,
                 joined_at="January 1, 2026",   points=0,   courses_completed=0),

            User(id=arjun_id, name="Arjun Sharma",   email="arjun@example.com",  phone="9876543210",
                 password_hash=pwd_context.hash("student123"), role="student",  verified=True,
                 joined_at="January 10, 2026",  points=340, courses_completed=1),

            User(id=priya_id, name="Priya Nair",     email="priya@example.com",  phone="9876500001",
                 password_hash=pwd_context.hash("student123"), role="student",  verified=True,
                 joined_at="February 5, 2026",  points=280, courses_completed=1),

            User(id=rahul_id, name="Rahul Mehta",    email="rahul@example.com",  phone="9876500002",
                 password_hash=pwd_context.hash("student123"), role="student",  verified=True,
                 joined_at="February 20, 2026", points=210, courses_completed=1),

            User(id=sneha_id, name="Sneha Patel",    email="sneha@example.com",  phone="9876500003",
                 password_hash=pwd_context.hash("student123"), role="student",  verified=True,
                 joined_at="March 3, 2026",     points=185, courses_completed=0),

            User(id=deepa_id, name="Deepa Krishnan", email="deepa@example.com",  phone="9876500004",
                 password_hash=pwd_context.hash("student123"), role="student",  verified=True,
                 joined_at="April 25, 2026",    points=50,  courses_completed=0),

            User(id=karan_id, name="Karan Verma",    email="karan@example.com",  phone="9876500005",
                 password_hash=pwd_context.hash("student123"), role="student",  verified=True,
                 joined_at="April 24, 2026",    points=30,  courses_completed=0),

            User(id=anita_id, name="Anita Roy",      email="anita@example.com",  phone="9876500006",
                 password_hash=pwd_context.hash("student123"), role="student",  verified=True,
                 joined_at="April 23, 2026",    points=15,  courses_completed=0),
        ]
        db.add_all(users)
        db.flush()
        print("  ✓ Users inserted")

        # ── Courses ───────────────────────────────────────────────────────────
        courses = [
            Course(id="1", title="Engineering Mathematics",
                   description="Calculus, differential equations, linear algebra, and probability.",
                   category="Mathematics", modules_count=6, videos_count=18, quizzes_count=30,
                   students_count=1240, grad="linear-gradient(90deg,#7C3AED,#2563EB)", accent="#7C3AED"),

            Course(id="2", title="Physics Mechanics",
                   description="Newton's laws, kinematics, work-energy theorem, and fluid mechanics.",
                   category="Physics", modules_count=5, videos_count=15, quizzes_count=25,
                   students_count=2100, grad="linear-gradient(90deg,#0891B2,#0D9488)", accent="#0891B2"),

            Course(id="3", title="Chemistry Fundamentals",
                   description="Organic, inorganic and physical chemistry for first-year engineering.",
                   category="Chemistry", modules_count=8, videos_count=24, quizzes_count=40,
                   students_count=850,  grad="linear-gradient(90deg,#EA580C,#DC2626)", accent="#EA580C"),

            Course(id="4", title="Computer Science Basics",
                   description="Programming fundamentals, data structures, and algorithms in C.",
                   category="Computer Science", modules_count=7, videos_count=21, quizzes_count=35,
                   students_count=620,  grad="linear-gradient(90deg,#16A34A,#059669)", accent="#16A34A"),

            Course(id="5", title="Electronics & Circuits",
                   description="Ohm's law, Kirchhoff's laws, diodes, transistors and circuit analysis.",
                   category="Electronics", modules_count=4, videos_count=12, quizzes_count=20,
                   students_count=950,  grad="linear-gradient(90deg,#DB2777,#E11D48)", accent="#DB2777"),
        ]
        db.add_all(courses)
        db.flush()
        print("  ✓ Courses inserted")

        # ── Enrollments ───────────────────────────────────────────────────────
        enrollments = [
            Enrollment(id=str(uuid.uuid4()), user_id=arjun_id, course_id="1", progress=65,
                       enrolled_at=datetime(2026, 1, 12)),
            Enrollment(id=str(uuid.uuid4()), user_id=arjun_id, course_id="2", progress=100,
                       enrolled_at=datetime(2026, 1, 15)),
            Enrollment(id=str(uuid.uuid4()), user_id=priya_id, course_id="2", progress=100,
                       enrolled_at=datetime(2026, 2, 10)),
            Enrollment(id=str(uuid.uuid4()), user_id=priya_id, course_id="3", progress=30,
                       enrolled_at=datetime(2026, 3, 1)),
            Enrollment(id=str(uuid.uuid4()), user_id=rahul_id, course_id="1", progress=100,
                       enrolled_at=datetime(2026, 2, 22)),
            Enrollment(id=str(uuid.uuid4()), user_id=rahul_id, course_id="3", progress=40,
                       enrolled_at=datetime(2026, 3, 5)),
            Enrollment(id=str(uuid.uuid4()), user_id=sneha_id, course_id="4", progress=20,
                       enrolled_at=datetime(2026, 3, 10)),
            Enrollment(id=str(uuid.uuid4()), user_id=deepa_id, course_id="5", progress=0,
                       enrolled_at=datetime(2026, 4, 25)),
            Enrollment(id=str(uuid.uuid4()), user_id=karan_id, course_id="4", progress=0,
                       enrolled_at=datetime(2026, 4, 24)),
        ]
        db.add_all(enrollments)
        db.flush()
        print("  ✓ Enrollments inserted")

        # ── Certificates ──────────────────────────────────────────────────────
        certificates = [
            Certificate(id="CERT-DEMO-001", course_name="Physics Mechanics",       category="Physics",
                        student_id=arjun_id, issued_date="March 15, 2026",  status="verified",
                        grad="linear-gradient(90deg,#0891B2,#0D9488)", accent="#0891B2",
                        accent_dim="rgba(8,145,178,0.12)", accent_border="rgba(8,145,178,0.3)"),

            Certificate(id="CERT-DEMO-002", course_name="Physics Mechanics",       category="Physics",
                        student_id=priya_id, issued_date="March 20, 2026",  status="verified",
                        grad="linear-gradient(90deg,#0891B2,#0D9488)", accent="#0891B2",
                        accent_dim="rgba(8,145,178,0.12)", accent_border="rgba(8,145,178,0.3)"),

            Certificate(id="CERT-DEMO-003", course_name="Engineering Mathematics", category="Mathematics",
                        student_id=arjun_id, issued_date="April 20, 2026",  status="pending",
                        grad="linear-gradient(90deg,#7C3AED,#2563EB)", accent="#7C3AED",
                        accent_dim="rgba(124,58,237,0.12)", accent_border="rgba(124,58,237,0.3)"),

            Certificate(id="CERT-DEMO-004", course_name="Engineering Mathematics", category="Mathematics",
                        student_id=rahul_id, issued_date="April 22, 2026",  status="verified",
                        grad="linear-gradient(90deg,#7C3AED,#2563EB)", accent="#7C3AED",
                        accent_dim="rgba(124,58,237,0.12)", accent_border="rgba(124,58,237,0.3)"),
        ]
        db.add_all(certificates)
        db.flush()
        print("  ✓ Certificates inserted")

        # ── Activity log ──────────────────────────────────────────────────────
        activity = [
            ActivityLog(student_name="Arjun Sharma",   detail="Passed Module 3 Test — Engineering Mathematics",
                        created_at=datetime(2026, 4, 28, 10, 0)),
            ActivityLog(student_name="Priya Nair",     detail="Earned Certificate: Physics Mechanics",
                        created_at=datetime(2026, 4, 28,  9, 45)),
            ActivityLog(student_name="Rahul Mehta",    detail="Enrolled in Chemistry Fundamentals",
                        created_at=datetime(2026, 4, 28,  9, 0)),
            ActivityLog(student_name="Sneha Patel",    detail="Logged in",
                        created_at=datetime(2026, 4, 28,  8, 0)),
            ActivityLog(student_name="Deepa Krishnan", detail="Registered on EduPath",
                        created_at=datetime(2026, 4, 25, 12, 0)),
            ActivityLog(student_name="Karan Verma",    detail="Registered on EduPath",
                        created_at=datetime(2026, 4, 24, 15, 0)),
            ActivityLog(student_name="Anita Roy",      detail="Registered on EduPath",
                        created_at=datetime(2026, 4, 23, 11, 0)),
        ]
        db.add_all(activity)
        db.commit()
        print("  ✓ Activity log inserted")
        print("\nDatabase seeded successfully!")

    except Exception as exc:
        db.rollback()
        print(f"\n✗ Seeding failed: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
