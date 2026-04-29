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
    CourseModule, ModuleVideo, ModuleQuestion,
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


# ──────────────────────────────────────────────────────────────────────────────
# Module / Video / Question seed data (idempotent — safe to re-run)
# ──────────────────────────────────────────────────────────────────────────────

MODULES_DATA = {
    # course_id: [(num, title)]
    "1": [
        (1, "Limits & Derivatives"),
        (2, "Integration Techniques"),
        (3, "Differential Equations"),
        (4, "Linear Algebra"),
        (5, "Probability & Statistics"),
        (6, "Final Examination"),
    ],
    "2": [
        (1, "Kinematics"),
        (2, "Newton's Laws"),
        (3, "Work & Energy"),
        (4, "Rotational Motion"),
        (5, "Fluid Mechanics"),
    ],
    "3": [
        (1, "Atomic Structure"),
        (2, "Chemical Bonding"),
        (3, "Thermodynamics"),
        (4, "Chemical Equilibrium"),
        (5, "Organic Basics"),
        (6, "Electrochemistry"),
        (7, "Reaction Kinetics"),
        (8, "Lab Methods"),
    ],
    "4": [
        (1, "Programming Basics"),
        (2, "Control Flow"),
        (3, "Functions & Scope"),
        (4, "Arrays & Strings"),
        (5, "Data Structures"),
        (6, "Algorithms & Complexity"),
        (7, "Final Project"),
    ],
    "5": [
        (1, "Circuit Laws"),
        (2, "Diodes"),
        (3, "Transistors"),
        (4, "Amplifiers"),
    ],
}

VIDEOS_DATA = {
    # (course_id, module_num): [(idx, youtube_id, title)]
    ("1", 1): [
        (0, "WUvTyaaNkzM", "Essence of Calculus — Chapter 1"),
        (1, "9vKqVkMQHKk", "Derivative Formulas Through Geometry"),
        (2, "uXjQ8yc9Pdg", "L'Hôpital's Rule and Indeterminate Forms"),
    ],
    ("1", 2): [
        (0, "rfG8ce4nNh0", "Introduction to Integration"),
        (1, "LIaVkuQPhMk", "Integration by Parts"),
        (2, "sdYdnpYn-1o", "U-Substitution Technique"),
    ],
    ("1", 3): [
        (0, "p_di4Zn4wz4", "Introduction to Differential Equations"),
        (1, "W6S9z_7orZY", "Separable ODEs"),
        (2, "sqbxKH4g4ns", "Second-Order Linear ODEs"),
    ],
    ("1", 4): [
        (0, "fNk_zzaMoSs", "Vectors and Linear Combinations"),
        (1, "rowVCYJpSjk", "Matrix Multiplication Explained"),
        (2, "uQhTuRlWMxw", "Determinants and Eigenvalues"),
    ],
    ("1", 5): [
        (0, "HZGCoVF3YvM", "Fundamentals of Probability"),
        (1, "8idr1WZ1A7Q", "Normal Distribution Explained"),
        (2, "SzZ6GpcfoQY", "Hypothesis Testing Basics"),
    ],
    ("1", 6): [
        (0, "WUvTyaaNkzM", "Calculus Review — Limits & Derivatives"),
        (1, "fNk_zzaMoSs", "Linear Algebra Review"),
        (2, "HZGCoVF3YvM", "Probability Review"),
    ],
    ("2", 1): [
        (0, "qcr8mBfqa5M", "Position, Velocity and Acceleration"),
        (1, "Lhv3QHRJMRE", "Equations of Motion"),
    ],
    ("2", 2): [
        (0, "LfxMjCSWVCg", "Newton's Three Laws of Motion"),
        (1, "vW2RhPfgHQ8", "Free Body Diagrams"),
    ],
    ("2", 3): [
        (0, "w4QFJb9a8vo", "Work-Energy Theorem"),
        (1, "1D3RVLbq63k", "Conservation of Energy"),
    ],
    ("2", 4): [
        (0, "MLHK2OqRiIo", "Angular Velocity and Torque"),
        (1, "RNnr_Xz5ams", "Moment of Inertia"),
    ],
    ("2", 5): [
        (0, "sBEXbJFz_Ew", "Bernoulli's Equation Explained"),
        (1, "u9wBqfTKRQY", "Pascal's Law and Pressure"),
    ],
    ("3", 1): [
        (0, "A3kSmvmJwRQ", "Atomic Structure and Bohr Model"),
        (1, "FN6f6Qdxt2w", "Electron Configuration Rules"),
    ],
    ("3", 2): [
        (0, "J6TkjMvhEHY", "Ionic vs Covalent Bonds"),
        (1, "C01g5jUXXm8", "VSEPR Theory and Molecular Geometry"),
    ],
    ("3", 3): [
        (0, "ynHWbCg8BVA", "Enthalpy and Hess's Law"),
        (1, "N2D1mLGRwQg", "Entropy and Gibbs Free Energy"),
    ],
    ("3", 4): [
        (0, "APrbKMn3hDE", "Le Chatelier's Principle"),
        (1, "8DBhTXM_Br4", "Equilibrium Constant Kc"),
    ],
    ("3", 5): [
        (0, "ioF1wO5WuJU", "Introduction to Organic Chemistry"),
        (1, "OmEsMhcJ5UA", "Functional Groups Overview"),
    ],
    ("3", 6): [
        (0, "XaJmf2LYCyc", "Oxidation and Reduction Reactions"),
        (1, "TAN_9yC0hLo", "Electrochemical Cells"),
    ],
    ("3", 7): [
        (0, "EgpMzHnfPbE", "Reaction Rates and Rate Laws"),
        (1, "i1a8Aly7fT4", "Activation Energy and Arrhenius Equation"),
    ],
    ("3", 8): [
        (0, "xWopkNNOBLo", "Titration Techniques"),
        (1, "6N7e7WrujVU", "Spectroscopy Fundamentals"),
    ],
    ("4", 1): [
        (0, "zOjov-2OZ0E", "Introduction to Programming"),
        (1, "I_LLhu5bqtU", "Variables and Data Types"),
    ],
    ("4", 2): [
        (0, "m06GkGliKA0", "If-Else Statements Explained"),
        (1, "wxDS6MF30O0", "Loops: For, While, Do-While"),
    ],
    ("4", 3): [
        (0, "u-OmVr_fT4s", "Functions and Parameter Passing"),
        (1, "Wt1nNVAVbzM", "Introduction to Recursion"),
    ],
    ("4", 4): [
        (0, "NptnmWvkbTw", "Arrays Explained"),
        (1, "zg9ih6SVACc", "Array Searching and Sorting"),
    ],
    ("4", 5): [
        (0, "B31LgI4Y4DQ", "Stacks and Queues"),
        (1, "BFkYkjFT4Ic", "Linked Lists and Trees"),
    ],
    ("4", 6): [
        (0, "kgBjXUE_Nzs", "Big-O Notation Explained"),
        (1, "pkkFqlG0Dvy", "Sorting Algorithms Compared"),
    ],
    ("4", 7): [
        (0, "fWxe6Xyv_GQ", "Project Planning and Design Patterns"),
        (1, "rfscVS0vtbw", "Code Review and Best Practices"),
    ],
    ("5", 1): [
        (0, "mc979OhitAg", "Ohm's Law Explained"),
        (1, "F_vLWkkNezc", "Kirchhoff's Laws"),
    ],
    ("5", 2): [
        (0, "Fwj_d3uO5g8", "PN Junction Diodes"),
        (1, "sI_CLNSBH4M", "Diode Applications"),
    ],
    ("5", 3): [
        (0, "7ukDKLLl1_c", "BJT Transistors Explained"),
        (1, "J4oO7PT_nzA", "FET Transistors and Applications"),
    ],
    ("5", 4): [
        (0, "eoqJLZmODHE", "Common Emitter Amplifier"),
        (1, "r_VY1H7X1Bs", "Op-Amp Circuits"),
    ],
}

# (course_id, module_num): [(idx, question, a, b, c, d, correct, explanation)]
QUESTIONS_DATA = {
    ("1", 1): [
        (0, "What is lim(x→0) sin(x)/x?", "0", "1", "∞", "−1", 1, "This is a fundamental limit proved by the squeeze theorem."),
        (1, "Which notation means 'derivative of f(x)'?", "∫f(x)", "f'(x)", "Σf(x)", "Δf(x)", 1, "Lagrange's f'(x) and Leibniz's df/dx both denote the derivative."),
        (2, "What is d/dx[x^n]?", "nx^n", "nx^(n-1)", "(n-1)x^n", "x^(n+1)", 1, "Power rule: d/dx[x^n] = nx^(n-1)."),
        (3, "Geometrically, the derivative represents?", "Area under curve", "Length of curve", "Slope of the tangent line", "Volume", 2, "f'(a) gives the slope of the tangent line to y=f(x) at x=a."),
        (4, "If f(x) = sin(x), then f'(x) = ?", "−sin(x)", "cos(x)", "−cos(x)", "tan(x)", 1, "The derivative of sin(x) is cos(x) — a fundamental trig derivative."),
    ],
    ("1", 2): [
        (0, "∫x² dx = ?", "2x + C", "x²/2 + C", "2x² + C", "x³/3 + C", 3, "Power rule for integration: ∫x^n dx = x^(n+1)/(n+1) + C."),
        (1, "Integration by parts formula is?", "∫u dv = u/v + C", "∫u dv = uv + C", "∫u dv = uv − ∫v du", "∫u dv = ∫u + ∫v", 2, "Integration by parts: ∫u dv = uv − ∫v du."),
        (2, "∫sin(x) dx = ?", "cos(x) + C", "−cos(x) + C", "sin(x) + C", "−sin(x) + C", 1, "The antiderivative of sin(x) is −cos(x) + C."),
        (3, "The geometric meaning of ∫[a,b] f(x) dx is?", "Slope of f(x)", "Maximum of f(x)", "Net area between f(x) and x-axis", "Rate of change of f(x)", 2, "The definite integral gives the net signed area between the curve and the x-axis."),
        (4, "If F'(x) = f(x), then ∫[a,b] f(x) dx = ?", "f(b) − f(a)", "F(a) + F(b)", "f(a) + f(b)", "F(b) − F(a)", 3, "Fundamental Theorem of Calculus Part 2: ∫[a,b] f(x) dx = F(b) − F(a)."),
    ],
    ("1", 3): [
        (0, "The order of a DE is determined by?", "Number of variables", "Highest derivative present", "Number of terms", "Degree", 1, "The order of a differential equation is the order of its highest derivative."),
        (1, "A separable ODE can be written as?", "dy/dx = f(x)+g(y)", "d²y/dx² = f(x)", "dy/dx = f(x)g(y)", "dy = f(x)", 2, "Separable ODEs have the form dy/dx = f(x)g(y), allowing separation of variables."),
        (2, "The general solution of dy/dx = ky is?", "y = Ce^(kx)", "y = kx + C", "y = Ce^(−kx)", "y = k·ln(x) + C", 0, "This ODE models exponential growth/decay: solution is y = Ce^(kx)."),
        (3, "What is an initial value problem?", "An ODE with no solution", "An ODE with specified conditions at a point", "An ODE of order zero", "A partial differential equation", 1, "An IVP is an ODE with a specified value of the solution at a point (e.g., y(0)=1)."),
        (4, "Characteristic roots of y'' − 3y' + 2y = 0 are?", "−1 and −2", "−1 and 2", "1 and 2", "3 and 2", 2, "Characteristic equation: r²−3r+2=0 → (r−1)(r−2)=0, roots 1 and 2."),
    ],
    ("1", 4): [
        (0, "A matrix is invertible iff its determinant is?", "Positive", "Negative", "Zero", "Non-zero", 3, "A matrix is invertible (non-singular) if and only if det ≠ 0."),
        (1, "Dot product of [1,0] and [0,1]?", "0", "1", "−1", "2", 0, "Dot product: 1×0 + 0×1 = 0. These are orthogonal unit vectors."),
        (2, "An eigenvalue λ satisfies?", "A + v = λ", "Av = λv for non-zero v", "det(A) = λ", "Av = λA", 1, "Eigenvalue equation: Av = λv, where v is a non-zero eigenvector."),
        (3, "The rank of a matrix is?", "Number of rows", "Number of columns", "Number of linearly independent rows/columns", "Number of non-zero entries", 2, "Rank = dimension of the column space = number of linearly independent rows/columns."),
        (4, "AB = BA for all matrices A, B. This is?", "True always", "False — not generally commutative", "True only for square matrices", "True only for symmetric matrices", 1, "Matrix multiplication is generally NOT commutative. AB ≠ BA in general."),
    ],
    ("1", 5): [
        (0, "P(A∪B) = ?", "P(A)×P(B)", "P(A) + P(B)", "P(A) + P(B) − P(A∩B)", "P(A|B)×P(B)", 2, "Inclusion-exclusion: P(A∪B) = P(A) + P(B) − P(A∩B)."),
        (1, "In a normal distribution, mean = median = mode?", "True", "False", "Only when σ = 1", "Only for discrete distributions", 0, "The normal distribution is symmetric, so mean = median = mode."),
        (2, "What does the p-value represent?", "Probability H₀ is true", "Probability of ≥ observed extreme assuming H₀ true", "Confidence level", "Effect size", 1, "The p-value is the probability of observing results at least as extreme as those seen, if H₀ is true."),
        (3, "Std deviation of Bernoulli(p) is?", "p", "p(1−p)", "1 − p", "√(p(1−p))", 3, "For Bernoulli: variance = p(1−p), std dev = √(p(1−p))."),
        (4, "Which distribution counts events in fixed intervals?", "Normal", "Binomial", "Poisson", "Geometric", 2, "The Poisson distribution models the number of events occurring in a fixed time/space interval."),
    ],
    ("1", 6): [
        (0, "d/dx[e^x] = ?", "e^x", "xe^(x−1)", "e^(x−1)", "ln(x)", 0, "The exponential function e^x is its own derivative: d/dx[e^x] = e^x."),
        (1, "∫e^x dx = ?", "e^x + C", "e^(x+1)/(x+1) + C", "xe^x + C", "e^x − 1 + C", 0, "The antiderivative of e^x is e^x + C."),
        (2, "The solution to dy/dx = y is?", "y = Cx", "y = Ce^x", "y = e^(Cx)", "y = C/x", 1, "dy/dx = y separates to dy/y = dx, integrating gives ln|y| = x + C, so y = Ae^x."),
        (3, "det(AB) = ?", "det(A) + det(B)", "det(A) / det(B)", "det(A) × det(B)", "det(A)²", 2, "The determinant of a product: det(AB) = det(A) × det(B)."),
        (4, "For independent events A and B, P(A∩B) = ?", "P(A) × P(B)", "P(A) + P(B)", "P(A|B)", "P(B|A)", 0, "Independence means P(A∩B) = P(A) × P(B)."),
    ],
    ("2", 1): [
        (0, "Velocity is defined as?", "Rate of change of speed", "Rate of change of displacement", "Total distance / time", "Mass × acceleration", 1, "Velocity = Δx/Δt — rate of change of displacement, a vector quantity."),
        (1, "At maximum height, a thrown ball's velocity is?", "Maximum", "Equal to initial velocity", "Zero", "Negative", 2, "At max height, vertical velocity component = 0 (momentarily at rest vertically)."),
        (2, "Starting from rest with acceleration a, after time t?", "s = at", "s = at²", "s = 2at²", "s = ½at²", 3, "Third kinematic equation: s = ½at² (starting from rest, v₀ = 0)."),
        (3, "Slope of a velocity-time graph gives?", "Acceleration", "Displacement", "Speed", "Jerk", 0, "The slope of a v-t graph = Δv/Δt = acceleration."),
        (4, "Horizontal range of projectile at angle θ and speed v₀?", "v₀sin(θ)/g", "v₀²sin(θ)/g", "v₀²sin(2θ)/g", "v₀²cos(θ)/g", 2, "Range R = v₀²sin(2θ)/g for level ground."),
    ],
    ("2", 2): [
        (0, "Newton's first law describes?", "F = ma", "Inertia — objects resist changes in motion", "Action-reaction pairs", "Conservation of momentum", 1, "First law (Law of Inertia): objects remain at rest or in uniform motion unless acted on by a net force."),
        (1, "Net force on a 5 kg object accelerating at 3 m/s²?", "1.67 N", "8 N", "15 N", "5 N", 2, "F = ma = 5 × 3 = 15 N."),
        (2, "Newton's third law states?", "For every action there is equal and opposite reaction", "F = ma", "Force = rate of change of momentum", "All forces are conserved", 0, "Action-Reaction: forces always come in equal and opposite pairs."),
        (3, "No force on moving object on frictionless surface, it will?", "Slow down gradually", "Stop immediately", "Accelerate due to gravity", "Continue at constant velocity", 3, "By Newton's first law, zero net force → constant velocity."),
        (4, "Two masses m and 2m connected, force F applied to m, acceleration?", "F/m", "F/(3m)", "F/(2m)", "3F/m", 1, "Total mass = 3m, so a = F/(3m)."),
    ],
    ("2", 3): [
        (0, "Work done by force F over displacement d at angle θ?", "W = F/d", "W = F + d", "W = Fd·cos(θ)", "W = Fd·sin(θ)", 2, "Work = force × displacement × cos(angle between them)."),
        (1, "Kinetic energy of mass m at speed v?", "½mv²", "mv²", "mv", "2mv²", 0, "KE = ½mv²."),
        (2, "Work-energy theorem: net work equals?", "Change in potential energy", "Change in kinetic energy", "Total mechanical energy", "Force × time", 1, "W_net = ΔKE = ½mv² − ½mv₀²."),
        (3, "Spring (constant k, compression x) stores PE?", "kx", "kx²", "2kx²", "½kx²", 3, "Elastic PE = ½kx²."),
        (4, "Frictionless ball rolling without energy loss demonstrates?", "Newton's second law", "Impulse-momentum", "Conservation of mechanical energy", "Pascal's principle", 2, "No friction → no energy loss → conservation of mechanical energy."),
    ],
    ("2", 4): [
        (0, "Angular velocity ω and linear velocity v relate by?", "v = ω/r", "v = ωr", "v = ω + r", "v = ω²r", 1, "Linear velocity v = ωr where r is the radius."),
        (1, "Torque τ is defined as?", "τ = F/r", "τ = F + r", "τ = r × F", "τ = mar", 2, "Torque τ = r × F (cross product of position and force vectors)."),
        (2, "Solid disk vs hollow cylinder from same ramp, which arrives first?", "Solid disk", "Hollow cylinder", "Same time", "Cannot determine", 0, "Solid disk has smaller moment of inertia per unit mass → less rotational KE needed → faster."),
        (3, "Moment of inertia of point mass m at distance r from axis?", "mr", "m/r²", "½mr²", "mr²", 3, "For a point mass: I = mr²."),
        (4, "Angular momentum is conserved when?", "No external force acts", "KE is conserved", "No external torque acts", "Temperature is constant", 2, "Conservation of L requires zero net external torque on the system."),
    ],
    ("2", 5): [
        (0, "Pascal's law states?", "Fluids flow low to high pressure", "Pressure applied to fluid is transmitted equally in all directions", "Fluid pressure increases with velocity", "Fluids are always incompressible", 1, "Pascal's law: any change in pressure in enclosed fluid is transmitted undiminished throughout."),
        (1, "Bernoulli's principle relates?", "Viscosity and temperature", "Density and temperature", "Pressure, velocity, and height in streamline flow", "Force and fluid mass", 2, "Bernoulli: P + ½ρv² + ρgh = constant along a streamline."),
        (2, "Archimedes' principle: a floating object displaces?", "Its weight in fluid", "Its volume in fluid", "More than its weight", "Less than its volume", 0, "Buoyant force = weight of displaced fluid. Floating body displaces fluid equal to its own weight."),
        (3, "Fluid flows faster in a narrower pipe section. Explained by?", "Pascal's law", "Bernoulli's principle", "Archimedes' principle", "Continuity equation", 3, "Continuity equation: A₁v₁ = A₂v₂ — smaller area → higher velocity."),
        (4, "SI unit of pressure?", "Newton (N)", "Pascal (Pa)", "Joule (J)", "Bar", 1, "1 Pascal = 1 N/m². Named after Blaise Pascal."),
    ],
    ("3", 1): [
        (0, "Atomic number of an element equals?", "Number of protons", "Number of neutrons", "Electrons + neutrons", "Mass number", 0, "Atomic number Z = number of protons in the nucleus."),
        (1, "Bohr model describes electrons in?", "Random paths", "Elliptical orbits only", "Fixed circular orbits at specific energy levels", "Straight lines", 2, "Bohr postulated quantized circular orbits where electrons have fixed energy levels."),
        (2, "Which fills first — 3d or 4s?", "3d fills first", "4s fills first", "They fill simultaneously", "Depends on element", 1, "Aufbau principle: 4s (n+l = 4) fills before 3d (n+l = 5)."),
        (3, "Maximum electrons in the 3rd shell?", "8", "12", "16", "18", 3, "3rd shell (n=3): has 3s, 3p, 3d → 2+6+10 = 18 electrons max."),
        (4, "Isotopes of an element differ in?", "Number of protons", "Number of electrons", "Number of neutrons", "Atomic number", 2, "Isotopes: same Z (protons), different number of neutrons."),
    ],
    ("3", 2): [
        (0, "Ionic bond forms when?", "Electron is transferred from one atom to another", "Electrons are shared equally", "Atoms share electrons unevenly", "Van der Waals attract", 0, "Ionic bonds form by complete electron transfer, creating oppositely charged ions."),
        (1, "VSEPR theory predicts?", "Bond energy", "Reaction rate", "Molecular geometry based on electron pair repulsion", "Bond order", 2, "VSEPR: electron pairs repel each other and arrange to minimize repulsion, determining geometry."),
        (2, "Geometry of H₂O is?", "Linear", "Bent/angular", "Trigonal planar", "Tetrahedral", 1, "Water has 2 bonding pairs + 2 lone pairs → bent geometry (~104.5°)."),
        (3, "Strongest bond type?", "Ionic bond", "Single covalent bond", "Double covalent bond", "Triple covalent bond", 3, "Triple bonds (3 shared pairs) are shorter and stronger than double or single bonds."),
        (4, "Electronegativity difference > 1.7 indicates?", "Metallic bond", "Pure covalent bond", "Ionic bond character", "Coordinate bond", 2, "Large electronegativity differences lead to ionic character (electron transfer)."),
    ],
    ("3", 3): [
        (0, "First law of thermodynamics states?", "Entropy increases spontaneously", "Energy is neither created nor destroyed", "Absolute zero unreachable", "Heat flows cold to hot", 1, "First law: ΔU = Q − W. Energy is conserved."),
        (1, "Exothermic reaction has?", "ΔH > 0", "ΔH = 0", "ΔH < 0", "ΔS = 0", 2, "Exothermic: heat is released, so ΔH < 0 (enthalpy decreases)."),
        (2, "Hess's Law allows us to?", "Calculate ΔH by summing enthalpy steps", "Predict reaction rate", "Find activation energy", "Balance equations", 0, "Hess's Law: ΔH is path-independent; you can add enthalpy steps."),
        (3, "ΔG < 0 means the reaction is?", "Non-spontaneous", "At equilibrium", "Endothermic", "Spontaneous", 3, "Negative ΔG = spontaneous (thermodynamically favorable) at constant T and P."),
        (4, "Entropy is a measure of?", "Energy content", "Disorder or randomness", "Temperature", "Pressure", 1, "Entropy S is a measure of the disorder or randomness of a system."),
    ],
    ("3", 4): [
        (0, "At equilibrium, concentrations of reactants/products?", "Are always equal", "Are zero", "Remain constant (not necessarily equal)", "Keep changing", 2, "At equilibrium, forward rate = reverse rate; concentrations are constant but not equal."),
        (1, "Le Chatelier's principle states?", "All reactions are reversible", "A system shifts to counteract applied stress", "Kc never changes", "Pressure has no effect", 1, "Le Chatelier: if a stress is applied, equilibrium shifts to partially relieve that stress."),
        (2, "For aA + bB ⇌ cC + dD, Kc = ?", "[C]^c[D]^d / [A]^a[B]^b", "[A]^a[B]^b / [C]^c[D]^d", "[C][D] / [A][B]", "[C]^c × [D]^d × [A]^a × [B]^b", 0, "Kc = products / reactants (each raised to stoichiometric coefficient power)."),
        (3, "If Kc >> 1, equilibrium favors?", "Reactants", "Products", "Neither", "Cannot determine", 1, "Large Kc means products are strongly favored at equilibrium."),
        (4, "Increasing temperature for endothermic reaction will?", "Decrease Kc", "Have no effect", "Shift toward products", "Shift toward reactants", 2, "Endothermic: heat is a 'reactant'; adding heat (↑T) shifts equilibrium toward products."),
    ],
    ("3", 5): [
        (0, "Simplest organic compound?", "Methane CH₄", "Ethanol C₂H₅OH", "Glucose C₆H₁₂O₆", "Benzene C₆H₆", 0, "Methane (CH₄) is the simplest alkane — one carbon atom."),
        (1, "Functional groups are?", "Groups of polymers", "Ionic compounds", "Specific atom groups that determine chemical properties", "Metal complexes", 2, "Functional groups are specific structural units that determine reactivity and properties."),
        (2, "General formula for alkanes?", "CₙH₂ₙ", "CₙH₂ₙ₊₂", "CₙH₂ₙ₋₂", "CₙHₙ", 1, "Alkanes (saturated hydrocarbons): CₙH₂ₙ₊₂."),
        (3, "Isomers are compounds that?", "Have identical properties", "Are identical in all ways", "React the same way always", "Have same formula but different structures", 3, "Structural isomers share molecular formula but differ in connectivity."),
        (4, "Benzene's special stability arises from?", "Strong single bonds", "High molecular weight", "Delocalized π electrons", "Ionic character", 2, "Benzene's 6 π electrons are delocalized over the ring → aromatic stability."),
    ],
    ("3", 6): [
        (0, "Oxidation is?", "Gain of electrons", "Loss of electrons", "Gain of protons", "Loss of protons", 1, "OIL RIG: Oxidation Is Loss (of electrons), Reduction Is Gain."),
        (1, "In a galvanic cell, oxidation occurs at?", "Anode", "Cathode", "Both electrodes", "The electrolyte", 0, "Anode = oxidation (AnOx), Cathode = reduction (RedCat)."),
        (2, "Nernst equation is used to?", "Balance half-reactions", "Find oxidation states", "Calculate cell potential at non-standard conditions", "Determine current", 2, "Nernst: E = E° − (RT/nF)ln(Q). Used for non-standard conditions."),
        (3, "Electrolysis uses?", "Chemical energy spontaneously", "Thermal energy", "Solar energy", "Electrical energy to drive non-spontaneous reactions", 3, "Electrolysis uses external electrical energy to force non-spontaneous redox reactions."),
        (4, "Standard hydrogen electrode potential?", "1.00 V", "0.00 V", "−1.00 V", "0.50 V", 1, "SHE is the reference electrode with E° = 0.00 V by definition."),
    ],
    ("3", 7): [
        (0, "Reaction rate depends on?", "Only temperature", "Only concentration", "Concentration, temperature, and catalyst", "Only pressure", 2, "Rate depends on concentration, temperature, surface area, and catalysts."),
        (1, "Rate law for aA → products?", "rate = k/[A]", "rate = k[A]^n", "rate = k×a×[A]", "rate = k + [A]", 1, "Rate law: rate = k[A]^n, where n is determined experimentally."),
        (2, "Activation energy is?", "Minimum energy to start a reaction", "Total energy released", "Energy of products", "Energy of reactants", 0, "Ea = minimum kinetic energy needed by reactants to form the transition state."),
        (3, "A catalyst speeds up a reaction by?", "Increasing temperature", "Increasing concentration", "Lowering activation energy", "Changing equilibrium", 2, "Catalysts provide an alternative pathway with lower Ea; they don't change ΔH."),
        (4, "Arrhenius equation relates k to?", "Pressure", "Concentration", "Time", "Temperature via activation energy", 3, "k = Ae^(−Ea/RT). Rate constant k increases exponentially with temperature."),
    ],
    ("3", 8): [
        (0, "Acid-base titration endpoint indicated by?", "Temperature change", "pH indicator color change", "Gas evolution", "Precipitate", 1, "An indicator (e.g., phenolphthalein) changes color at the equivalence point."),
        (1, "Beer-Lambert Law relates?", "Temperature to pressure", "Volume to pressure", "Absorbance to concentration", "Molarity to molality", 2, "A = εlc: absorbance is proportional to molar absorptivity × path length × concentration."),
        (2, "Chromatography separates compounds based on?", "Different affinities for stationary and mobile phases", "Molecular weight alone", "Color only", "Solubility in water", 0, "Chromatography: compounds with higher affinity for mobile phase move faster."),
        (3, "A pipette is used for?", "Weighing solids", "Measuring temperature", "Mixing chemicals", "Accurately measuring liquid volumes", 3, "Volumetric pipettes are precision instruments for delivering exact liquid volumes."),
        (4, "Molarity is?", "Grams per liter", "Moles of solute per liter of solution", "Moles per kg solvent", "mg per mL", 1, "Molarity M = moles of solute / liters of solution."),
    ],
    ("4", 1): [
        (0, "A variable is?", "A fixed constant", "A named storage location for data", "A function definition", "A loop statement", 1, "Variables store data values in named memory locations."),
        (1, "Which data type stores whole numbers in C?", "int", "float", "char", "bool", 0, "int stores integer (whole number) values."),
        (2, "In C, main() returns?", "void", "char", "int", "float", 2, "The C standard requires main() to return int (0 indicates success)."),
        (3, "Comment in C is written using?", "## or %", "// or /* */", "-- or <!-- -->", "** or {{ }}", 1, "C supports single-line // comments and multi-line /* */ comments."),
        (4, "printf is used to?", "Read user input", "Define a function", "Declare a variable", "Print output to console", 3, "printf (print formatted) outputs formatted text to standard output."),
    ],
    ("4", 2): [
        (0, "An if-else statement is used for?", "Repeating code", "Defining functions", "Making decisions", "Allocating memory", 2, "Conditional statements (if-else) allow the program to choose between different paths."),
        (1, "A for loop is preferred when?", "Number of iterations is known", "Condition is complex", "No condition exists", "One iteration needed", 0, "For loops are best when you know exactly how many times to iterate."),
        (2, "A do-while loop guarantees the body executes?", "Never", "At least once", "Exactly twice", "Infinite times", 1, "Do-while checks the condition after executing the body — so it always runs at least once."),
        (3, "The break statement in a loop?", "Pauses execution", "Skips to next iteration", "Repeats loop", "Exits the loop immediately", 3, "break terminates the innermost loop or switch statement."),
        (4, "The continue statement in a loop?", "Exits the loop", "Continues from loop start", "Skips rest of current iteration", "Pauses execution", 2, "continue skips the remaining statements in the loop body and starts the next iteration."),
    ],
    ("4", 3): [
        (0, "A function is?", "A variable", "A reusable block of code performing a specific task", "A loop", "A data type", 1, "Functions encapsulate reusable logic, promoting modularity and reducing repetition."),
        (1, "Passing by value means?", "A copy is passed", "Original variable is modified", "No memory is used", "Variable is returned", 0, "Pass by value: function gets a copy; changes don't affect the original."),
        (2, "Recursion requires?", "A loop", "No return type", "A base case to terminate", "A global variable", 2, "Without a base case, recursion continues infinitely (stack overflow)."),
        (3, "The return statement?", "Restarts function", "Calls another function", "Declares a variable", "Exits function and optionally returns a value", 3, "return exits the function and sends a value back to the caller."),
        (4, "Variable scope refers to?", "Variable data type", "Where in code a variable is accessible", "Variable size in memory", "Variable name length", 1, "Scope determines the region of code where a variable is accessible."),
    ],
    ("4", 4): [
        (0, "An array is?", "A single variable", "A function", "A collection of same-type elements stored contiguously", "A pointer", 2, "Arrays store multiple elements of the same type in contiguous memory locations."),
        (1, "Last index of zero-indexed array of size 5?", "5", "3", "6", "4", 3, "Zero-indexed: indices 0,1,2,3,4 — last is 4."),
        (2, "Accessing an array element time complexity?", "O(1)", "O(n)", "O(log n)", "O(n²)", 0, "Direct indexing: O(1) constant time access."),
        (3, "A 2D array is?", "A pointer to pointer", "An array of arrays", "A linked list", "A hash table", 1, "A 2D array is an array whose elements are themselves arrays."),
        (4, "Array size must be declared?", "After all elements", "It never needs declaring", "Before use (in most languages)", "Only at runtime", 2, "In C, array sizes must be known at compile time (or use dynamic allocation)."),
    ],
    ("4", 5): [
        (0, "A stack follows?", "LIFO", "FIFO", "Random access", "Priority order", 0, "Stack: Last In First Out — push adds to top, pop removes from top."),
        (1, "A queue follows?", "LIFO", "FIFO", "Random access", "Sorted order", 1, "Queue: First In First Out — enqueue at back, dequeue from front."),
        (2, "A linked list node contains?", "Only data", "Only pointers", "Data and pointer to next node", "A fixed memory block", 2, "Each node has a data field and a next pointer (for singly linked list)."),
        (3, "Binary search tree property?", "All nodes are equal", "Left child > parent", "Right child < parent", "Left child < parent < right child", 3, "BST invariant: left subtree values < root < right subtree values."),
        (4, "Insert at head of linked list time complexity?", "O(1)", "O(n)", "O(log n)", "O(n²)", 0, "Head insertion is constant time — just update the head pointer."),
    ],
    ("4", 6): [
        (0, "Big-O notation describes?", "Memory usage only", "Worst-case time/space complexity", "Best-case complexity", "Average-case always", 1, "Big-O gives an upper bound on the growth rate of an algorithm."),
        (1, "Binary search requires input to be?", "Random", "Reversed", "Sorted", "Linked", 2, "Binary search compares the target to the middle element — requires sorted order."),
        (2, "Merge sort time complexity?", "O(n)", "O(n²)", "O(log n)", "O(n log n)", 3, "Merge sort: T(n) = 2T(n/2) + O(n) → O(n log n) by Master theorem."),
        (3, "Bubble sort worst-case complexity?", "O(n log n)", "O(n²)", "O(n)", "O(1)", 1, "Bubble sort: O(n²) comparisons and swaps in the worst case."),
        (4, "Divide and conquer is?", "A brute-force method", "A hashing technique", "Split problem, solve parts, combine results", "A greedy approach", 2, "Divide and conquer: divide → solve subproblems → combine (e.g., merge sort, binary search)."),
    ],
    ("4", 7): [
        (0, "A flowchart is used to?", "Visualize program logic", "Write code automatically", "Test programs", "Deploy applications", 0, "Flowcharts map out program logic using standard symbols before coding begins."),
        (1, "DRY principle stands for?", "Do Repeat Yourself", "Don't Repeat Yourself", "Dynamic Runtime Yield", "Declare Run Yield", 1, "DRY: avoid duplication — same logic should not exist in multiple places."),
        (2, "A version control system helps?", "Speed up execution", "Compile code", "Track changes and collaborate", "Encrypt code", 2, "Git and similar tools track history, enable collaboration, and allow rollbacks."),
        (3, "Unit testing verifies?", "The entire application", "Network connectivity", "Database connections", "Individual functions in isolation", 3, "Unit tests check individual units (functions/methods) in isolation."),
        (4, "Good code should be?", "Short regardless of clarity", "Readable, maintainable and efficient", "As complex as possible", "Never commented", 1, "Clean code principles: readable, maintainable, efficient, and appropriately documented."),
    ],
    ("5", 1): [
        (0, "Ohm's Law states?", "V = I + R", "V = I/R", "V = IR", "V = I²R", 2, "Ohm's Law: V = IR. Voltage = Current × Resistance."),
        (1, "KCL (Kirchhoff's Current Law) states?", "Voltage around loop = source", "Sum of currents at node = 0", "Resistance in series = sum", "Power = voltage × resistance", 1, "KCL: algebraic sum of all currents entering a node = 0 (charge conservation)."),
        (2, "Total resistance in series circuit?", "Sum of all resistances", "Product of resistances", "Inverse sum", "Same as smallest", 0, "Series: R_total = R₁ + R₂ + ... + Rₙ."),
        (3, "Total resistance in parallel circuit?", "Greater than largest resistance", "Sum of resistances", "Equal to average resistance", "Less than smallest resistance", 3, "Parallel: 1/R_total = 1/R₁ + 1/R₂ + ..., so R_total < any individual R."),
        (4, "Power dissipated by a resistor?", "P = IR", "P = V/R", "P = I²R", "P = V²/R²", 2, "P = I²R = V²/R = VI. For a resistor, P = I²R."),
    ],
    ("5", 2): [
        (0, "A PN junction diode allows current to flow?", "Only in reverse bias", "In forward bias direction", "In both directions equally", "Only AC", 1, "Forward bias reduces the potential barrier, allowing conventional current to flow."),
        (1, "Forward voltage drop of silicon diode ≈ ?", "0.1 V", "0.3 V", "0.7 V", "1.5 V", 2, "Silicon diodes have a forward voltage drop of approximately 0.6–0.7 V."),
        (2, "Zener diode designed to operate in?", "Forward bias always", "Zero bias", "Light-controlled region", "Reverse breakdown region", 3, "Zener diodes are designed for operation in the reverse breakdown (Zener) region for voltage regulation."),
        (3, "Half-wave rectifier uses?", "One diode", "Two diodes", "Four diodes", "Six diodes", 0, "Half-wave rectifier: single diode passes only one half-cycle of AC."),
        (4, "In reverse bias, diode acts as?", "A short circuit", "An open circuit", "A capacitor", "A battery", 1, "Reverse bias: depletion region widens, very little current flows — acts as open circuit."),
    ],
    ("5", 3): [
        (0, "BJT transistor three terminals are?", "Source, Gate, Drain", "Anode, Cathode, Grid", "Emitter, Base, Collector", "Input, Output, Ground", 2, "BJT: Emitter (E), Base (B), Collector (C). Current-controlled device."),
        (1, "In BJT, small base current controls?", "A larger collector current", "A smaller emitter current", "Voltage directly", "Nothing useful", 0, "BJT amplification: IC = β × IB. Small IB controls large IC."),
        (2, "A FET is controlled by?", "Base current", "Gate voltage", "Drain current", "Source resistance", 1, "FETs are voltage-controlled: gate voltage controls the channel current."),
        (3, "Current gain β (hFE) in BJT is?", "IB / IC", "IE / IB", "IE / IC", "IC / IB", 3, "β = IC/IB. Typical β values range from 20 to 1000."),
        (4, "Transistor in saturation acts as?", "An open switch", "A resistor", "A closed switch", "A capacitor", 2, "Saturation: VCE ≈ 0.2V, transistor acts as closed switch (fully ON)."),
    ],
    ("5", 4): [
        (0, "Common-emitter amplifier provides?", "Voltage gain with phase inversion", "Voltage gain without phase change", "Current gain only", "No amplification", 0, "CE config: voltage gain = −RC/RE (negative = 180° phase inversion)."),
        (1, "Ideal op-amp has?", "Zero gain", "Finite input impedance", "Infinite gain and infinite input impedance", "Low output impedance only", 2, "Ideal op-amp: A_v = ∞, Rin = ∞, Rout = 0, bandwidth = ∞."),
        (2, "Gain of inverting op-amp?", "Rf/Rin", "−Rf/Rin", "Rin/Rf", "−Rin/Rf", 1, "Inverting amplifier gain = −Rf/Rin (negative sign = phase inversion)."),
        (3, "Negative feedback in amplifiers?", "Increases gain always", "Creates oscillation", "Has no effect", "Reduces gain but improves stability and bandwidth", 3, "Negative feedback trades gain for stability, linearity, and bandwidth extension."),
        (4, "Virtual ground concept applies to?", "Any transistor", "Positive feedback only", "Inverting input of op-amp in feedback config", "Series resistors", 2, "Virtual ground: inverting input ≈ 0V due to feedback, though not physically grounded."),
    ],
}


def seed_modules() -> None:
    """Seed course modules, videos, and questions. Idempotent."""
    db = SessionLocal()
    try:
        if db.query(CourseModule).count() > 0:
            print("Module data already seeded — skipping.")
            return

        print("Seeding modules, videos, and questions…")

        modules_to_add = []
        for course_id, module_list in MODULES_DATA.items():
            for num, title in module_list:
                modules_to_add.append(CourseModule(course_id=course_id, num=num, title=title))
        db.add_all(modules_to_add)
        db.flush()
        print(f"  ✓ {len(modules_to_add)} modules inserted")

        videos_to_add = []
        for (course_id, module_num), video_list in VIDEOS_DATA.items():
            for idx, youtube_id, title in video_list:
                videos_to_add.append(ModuleVideo(
                    course_id=course_id, module_num=module_num,
                    idx=idx, youtube_id=youtube_id, title=title,
                ))
        db.add_all(videos_to_add)
        db.flush()
        print(f"  ✓ {len(videos_to_add)} videos inserted")

        questions_to_add = []
        for (course_id, module_num), q_list in QUESTIONS_DATA.items():
            for idx, question, a, b, c, d, correct, explanation in q_list:
                questions_to_add.append(ModuleQuestion(
                    course_id=course_id, module_num=module_num, idx=idx,
                    question=question,
                    option_a=a, option_b=b, option_c=c, option_d=d,
                    correct_idx=correct, explanation=explanation,
                ))
        db.add_all(questions_to_add)
        db.commit()
        print(f"  ✓ {len(questions_to_add)} questions inserted")
        print("\nModule data seeded successfully!")

    except Exception as exc:
        db.rollback()
        print(f"\n✗ Module seeding failed: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
    seed_modules()
