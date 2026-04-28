"""
EduPath Â FastAPI Backend (TiDB edition)
Run: uvicorn main:app --reload --port 8000
"""

import os
import random
import uuid
from datetime import datetime, timedelta
from typing import Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from database import (
    ActivityLog, Certificate, Course, Enrollment,
    User, get_db, init_db,
)

load_dotenv()

# -----------------------------------------------------
# App & CORS
# -----------------------------------------------------
app = FastAPI(title="EduPath API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_db()


# -----------------------------------------------------
# Auth config
# -----------------------------------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 h

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# OTPs are ephemeral Â no need to persist them
otp_store: dict[str, str] = {}


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    payload = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise exc
    except JWTError:
        raise exc
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise exc
    return user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# -----------------------------------------------------
# Pydantic schemas
# -----------------------------------------------------
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str


class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str


class SendOTPRequest(BaseModel):
    email: EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str


class CourseCreateRequest(BaseModel):
    title: str
    desc: str
    category: str
    modules: int
    videos: int
    quizzes: int


# -----------------------------------------------------
# Helpers
# -----------------------------------------------------
def _format_time(dt: Optional[datetime]) -> str:
    if not dt:
        return ""
    diff = datetime.utcnow() - dt
    secs = int(diff.total_seconds())
    if secs < 60:
        return "just now"
    if secs < 3600:
        return f"{secs // 60}m ago"
    if secs < 86400:
        return f"{secs // 3600}h ago"
    return f"{diff.days}d ago"


def _user_to_dict(user: User, db: Session) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "verified": user.verified,
        "joined": user.joined_at,
        "points": user.points,
        "courses_completed": user.courses_completed,
        "enrolled_courses": [
            e.course_id
            for e in db.query(Enrollment).filter(Enrollment.user_id == user.id).all()
        ],
        "certificates": [
            c.id
            for c in db.query(Certificate).filter(Certificate.student_id == user.id).all()
        ],
    }


# -----------------------------------------------------
# Routes Â Auth
# -----------------------------------------------------
@app.post("/auth/register", status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    if len(data.password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters")
    if len(data.phone) != 10 or not data.phone.isdigit():
        raise HTTPException(400, "Phone must be 10 digits")
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(400, "Email already registered")

    user = User(
        id=str(uuid.uuid4()),
        name=data.name,
        email=data.email,
        phone=data.phone,
        password_hash=hash_password(data.password),
        role="student",
        verified=False,
        joined_at=datetime.utcnow().strftime("%B %d, %Y"),
        points=5,
        courses_completed=0,
    )
    db.add(user)
    db.commit()

    otp = str(random.randint(100000, 999999))
    otp_store[data.email] = otp
    print(f"[DEV] OTP for {data.email}: {otp}")
    return {"message": "Registration successful. OTP sent."}


@app.post("/auth/send-otp")
def send_otp(data: SendOTPRequest, db: Session = Depends(get_db)):
    if not db.query(User).filter(User.email == data.email).first():
        raise HTTPException(404, "User not found")
    otp = str(random.randint(100000, 999999))
    otp_store[data.email] = otp
    print(f"[DEV] OTP for {data.email}: {otp}")
    return {"message": "OTP sent"}


@app.post("/auth/verify-otp")
def verify_otp(data: OTPVerifyRequest, db: Session = Depends(get_db)):
    stored = otp_store.get(data.email)
    if not stored or stored != data.otp:
        raise HTTPException(400, "Invalid or expired OTP")
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(404, "User not found")
    user.verified = True
    db.add(ActivityLog(student_name=user.name, detail="Verified account and logged in"))
    db.commit()
    del otp_store[data.email]
    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role, "name": user.name}


@app.post("/auth/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Invalid email or password")
    if not user.verified:
        raise HTTPException(403, "Account not verified. Please verify OTP first.")
    db.add(ActivityLog(student_name=user.name, detail="Logged in"))
    db.commit()
    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role, "name": user.name}


# -----------------------------------------------------
# Routes Â Profile
# -----------------------------------------------------
@app.get("/profile")
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return _user_to_dict(current_user, db)


@app.put("/profile")
def update_profile(
    data: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if data.name:
        user.name = data.name
    if data.phone:
        if len(data.phone) != 10 or not data.phone.isdigit():
            raise HTTPException(400, "Phone must be 10 digits")
        user.phone = data.phone
    db.commit()
    return {"message": "Profile updated"}


@app.put("/profile/password")
def change_password(
    data: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not verify_password(data.current_password, user.password_hash):
        raise HTTPException(400, "Current password is incorrect")
    if len(data.new_password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters")
    user.password_hash = hash_password(data.new_password)
    db.commit()
    return {"message": "Password changed"}


# -----------------------------------------------------
# Routes Â Courses
# -----------------------------------------------------
@app.get("/courses")
def list_courses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    result = []
    for c in courses:
        enroll = db.query(Enrollment).filter(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == c.id,
        ).first()
        result.append({
            "id": c.id, "title": c.title, "desc": c.description,
            "category": c.category, "modules": c.modules_count,
            "videos": c.videos_count, "quizzes": c.quizzes_count,
            "students": c.students_count, "grad": c.grad, "accent": c.accent,
            "enrolled": enroll is not None,
            "progress": enroll.progress if enroll else 0,
            "completed": enroll.progress == 100 if enroll else False,
        })
    return result


@app.get("/courses/{course_id}")
def get_course(
    course_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    enroll = db.query(Enrollment).filter(

        Enrollment.user_id == current_user.id,

        Enrollment.course_id == course.id,

    ).first()

    return {

        "id": course.id, "title": course.title, "desc": course.description,

        "category": course.category, "modules": course.modules_count,

        "videos": course.videos_count, "quizzes": course.quizzes_count,

        "students": course.students_count, "grad": course.grad, "accent": course.accent,

        "enrolled": enroll is not None,

        "progress": enroll.progress if enroll else 0,

        "completed": enroll.progress == 100 if enroll else False,

    }


@app.post("/courses/{course_id}/modules/{module_num}/complete")

def complete_module(

    course_id: str,

    module_num: int,

    current_user: User = Depends(get_current_user),

    db: Session = Depends(get_db),

):

    course = db.query(Course).filter(Course.id == course_id).first()

    if not course:

        raise HTTPException(404, "Course not found")

    if module_num < 1 or module_num > course.modules_count:

        raise HTTPException(400, "Invalid module number")

    enroll = db.query(Enrollment).filter(

        Enrollment.user_id == current_user.id,

        Enrollment.course_id == course_id,

    ).first()

    if not enroll:

        enroll = Enrollment(

            id=str(uuid.uuid4()),

            user_id=current_user.id,

            course_id=course_id,

            progress=0,

        )

        course.students_count += 1

        db.add(enroll)

    previous_progress = enroll.progress or 0

    next_progress = round((module_num / course.modules_count) * 100)

    enroll.progress = max(previous_progress, next_progress)

    if previous_progress < 100 and enroll.progress == 100:

        current_user.courses_completed = (current_user.courses_completed or 0) + 1

        current_user.points = (current_user.points or 0) + 100

        exists = db.query(Certificate).filter(

            Certificate.student_id == current_user.id,

            Certificate.course_name == course.title,

        ).first()

        if not exists:

            db.add(Certificate(

                id=f"CERT-{uuid.uuid4().hex[:8].upper()}",

                course_name=course.title,

                category=course.category,

                student_id=current_user.id,

                issued_date=datetime.utcnow().strftime("%B %d, %Y"),

                status="verified",

                grad=course.grad,

                accent=course.accent,

                accent_dim="rgba(47,69,216,0.12)",

                accent_border="rgba(47,69,216,0.3)",

            ))

    db.add(ActivityLog(

        student_name=current_user.name,

        detail=f"Completed module {module_num} in {course.title}",

    ))

    db.commit()

    return {

        "message": "Module progress saved",

        "progress": enroll.progress,

        "completed_modules": round((enroll.progress / 100) * course.modules_count),

        "completed": enroll.progress == 100,

    }



@app.post("/courses", status_code=201)
def create_course(
    data: CourseCreateRequest,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    course = Course(
        id=str(uuid.uuid4()),
        title=data.title,
        description=data.desc,
        category=data.category,
        modules_count=data.modules,
        videos_count=data.videos,
        quizzes_count=data.quizzes,
        students_count=0,
        grad="linear-gradient(90deg,#7C3AED,#06B6D4)",
        accent="#7C3AED",
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return {"id": course.id, "title": course.title}


@app.put("/courses/{course_id}")
def update_course(
    course_id: str,
    data: CourseCreateRequest,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    course.title         = data.title
    course.description   = data.desc
    course.category      = data.category
    course.modules_count = data.modules
    course.videos_count  = data.videos
    course.quizzes_count = data.quizzes
    db.commit()
    return {"message": "Course updated"}


@app.delete("/courses/{course_id}", status_code=204)
def delete_course(
    course_id: str,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    db.delete(course)
    db.commit()


@app.post("/courses/{course_id}/enroll")
def enroll_course(
    course_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    existing = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id,
    ).first()
    if not existing:
        db.add(Enrollment(id=str(uuid.uuid4()), user_id=current_user.id, course_id=course_id, progress=0))
        course.students_count += 1
        user = db.query(User).filter(User.id == current_user.id).first()
        user.points = (user.points or 0) + 10
        db.add(ActivityLog(student_name=current_user.name, detail=f"Enrolled in {course.title}"))
        db.commit()
    return {"message": "Enrolled successfully"}


# -----------------------------------------------------
# Routes Â Students (admin only)
# -----------------------------------------------------
@app.get("/students")
def list_students(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    return [_user_to_dict(u, db) for u in db.query(User).filter(User.role == "student").all()]


@app.get("/students/{student_id}")
def get_student(
    student_id: str,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == student_id, User.role == "student").first()
    if not user:
        raise HTTPException(404, "Student not found")
    return _user_to_dict(user, db)


# -----------------------------------------------------
# Routes Â Leaderboard
# -----------------------------------------------------
@app.get("/leaderboard")
def get_leaderboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    students = db.query(User).filter(User.role == "student").order_by(User.points.desc()).all()
    return [
        {
            "rank": i + 1,
            "name": u.name,
            "points": u.points,
            "courses_completed": u.courses_completed,
            "certificates": db.query(Certificate).filter(Certificate.student_id == u.id).count(),
        }
        for i, u in enumerate(students)
    ]


# -----------------------------------------------------
# Routes Â Certificates
# -----------------------------------------------------
@app.get("/certificates")
def list_certificates(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "admin":
        certs = db.query(Certificate).all()
    else:
        certs = db.query(Certificate).filter(Certificate.student_id == current_user.id).all()
    return [
        {
            "id": c.id, "course": c.course_name, "category": c.category,
            "issued": c.issued_date, "status": c.status,
            "grad": c.grad, "accent": c.accent,
            "accentDim": c.accent_dim, "accentBorder": c.accent_border,
        }
        for c in certs
    ]


# -----------------------------------------------------
# Routes Â Activity (admin only)
# -----------------------------------------------------
@app.get("/activity")
def get_activity(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    logs = db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(50).all()
    return [
        {"student": a.student_name, "detail": a.detail, "time": _format_time(a.created_at)}
        for a in logs
    ]


# -----------------------------------------------------
# Routes Â Dashboard stats
# -----------------------------------------------------
@app.get("/dashboard/stats")
def dashboard_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    enrollments = db.query(Enrollment).filter(Enrollment.user_id == current_user.id).all()
    completed   = [e for e in enrollments if e.progress == 100]
    certs       = db.query(Certificate).filter(Certificate.student_id == current_user.id).count()
    completed_modules = sum(
        (db.query(Course).filter(Course.id == e.course_id).first().modules_count or 0)
        for e in completed
    )
    return {
        "enrolled_courses":    len(enrollments),
        "completed_modules":   completed_modules,
        "finished_courses":    len(completed),
        "certificates_earned": certs,
        "points":              current_user.points,
    }


@app.get("/admin/stats")
def admin_stats(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    return {
        "total_courses":      db.query(Course).count(),
        "total_students":     db.query(User).filter(User.role == "student").count(),
        "total_certificates": db.query(Certificate).count(),
        "active_students":    db.query(User).filter(User.role == "student", User.verified == True).count(),
    }


# -----------------------------------------------------
# Health check
# -----------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok"}
