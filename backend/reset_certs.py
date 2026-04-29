"""
Utility script to clear existing certificates and re-seed them with the new template-ready data.
Run with: python reset_certs.py
"""
import uuid
from database import SessionLocal, Certificate, User
from seed import pwd_context

def reset_certificates():
    db = SessionLocal()
    try:
        # Clear existing
        print("Clearing old certificates...")
        db.query(Certificate).delete()
        db.commit()

        # Find Arjun (primary demo student)
        arjun = db.query(User).filter(User.email == "arjun@example.com").first()
        if not arjun:
            print("Arjun not found! Please run seed.py first.")
            return
        
        arjun_id = arjun.id

        # New set of certificates for all courses
        certificates = [
            Certificate(id="CERT-DEMO-001", course_name="Engineering Mathematics", category="Mathematics",
                        student_id=arjun_id, issued_date="March 15, 2026",  status="verified",
                        grad="linear-gradient(90deg,#7C3AED,#2563EB)", accent="#7C3AED",
                        accent_dim="rgba(124,58,237,0.12)", accent_border="rgba(124,58,237,0.3)"),

            Certificate(id="CERT-DEMO-002", course_name="Physics Mechanics",       category="Physics",
                        student_id=arjun_id, issued_date="March 20, 2026",  status="verified",
                        grad="linear-gradient(90deg,#0891B2,#0D9488)", accent="#0891B2",
                        accent_dim="rgba(8,145,178,0.12)", accent_border="rgba(8,145,178,0.3)"),

            Certificate(id="CERT-DEMO-003", course_name="Chemistry Fundamentals",  category="Chemistry",
                        student_id=arjun_id, issued_date="April 05, 2026",  status="verified",
                        grad="linear-gradient(90deg,#EA580C,#DC2626)", accent="#EA580C",
                        accent_dim="rgba(234,88,12,0.12)", accent_border="rgba(234,88,12,0.3)"),

            Certificate(id="CERT-DEMO-004", course_name="Computer Science Basics", category="Computer Science",
                        student_id=arjun_id, issued_date="April 15, 2026",  status="verified",
                        grad="linear-gradient(90deg,#16A34A,#059669)", accent="#16A34A",
                        accent_dim="rgba(22,163,74,0.12)", accent_border="rgba(22,163,74,0.3)"),

            Certificate(id="CERT-DEMO-005", course_name="Electronics & Circuits",  category="Electronics",
                        student_id=arjun_id, issued_date="April 25, 2026",  status="verified",
                        grad="linear-gradient(90deg,#DB2777,#E11D48)", accent="#DB2777",
                        accent_dim="rgba(219,39,119,0.12)", accent_border="rgba(219,39,119,0.3)"),
        ]

        print("Generating new certificates for all courses...")
        db.add_all(certificates)
        db.commit()
        print("Successfully refreshed certificates!")

    except Exception as e:
        db.rollback()
        print(f"Failed to reset certificates: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_certificates()
