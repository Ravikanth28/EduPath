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

    CourseModule, ModuleVideo, ModuleVideoProgress, ModuleQuestion,
    DEFAULT_PASS_PERCENTAGE, DEFAULT_QUESTIONS_PER_TEST,
    DEFAULT_SHUFFLE_QUESTIONS, DEFAULT_SHOW_EXPLANATIONS,

)



load_dotenv()



# -----------------------------------------------------

# App & CORS

# -----------------------------------------------------

app = FastAPI(title="EduPath API", version="1.0.0")

_raw_origins = os.getenv("FRONTEND_URL", "http://localhost:3000")
_allowed_origins = [o.strip() for o in _raw_origins.split(",")]
if "http://localhost:3000" not in _allowed_origins:
    _allowed_origins.append("http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





@app.on_event("startup")

def startup() -> None:

    init_db()


def module_settings_payload(module: CourseModule) -> dict:
    return {
        "pass_percentage": module.pass_percentage or DEFAULT_PASS_PERCENTAGE,
        "questions_per_test": module.questions_per_test or DEFAULT_QUESTIONS_PER_TEST,
        "shuffle_questions": bool(module.shuffle_questions),
        "show_explanations": DEFAULT_SHOW_EXPLANATIONS if module.show_explanations is None else bool(module.show_explanations),
    }


def watched_video_indexes(db: Session, user_id: str, course_id: str, module_num: int) -> set[int]:
    rows = db.query(ModuleVideoProgress.video_idx).filter(
        ModuleVideoProgress.user_id == user_id,
        ModuleVideoProgress.course_id == course_id,
        ModuleVideoProgress.module_num == module_num,
    ).all()
    return {idx for (idx,) in rows}


def has_watched_all_module_videos(db: Session, user_id: str, course_id: str, module_num: int) -> bool:
    videos = db.query(ModuleVideo.idx).filter(
        ModuleVideo.course_id == course_id,
        ModuleVideo.module_num == module_num,
    ).all()
    if not videos:
        return False
    watched = watched_video_indexes(db, user_id, course_id, module_num)
    return all(idx in watched for (idx,) in videos)


def is_module_completed(db: Session, user_id: str, course: Course, module_num: int) -> bool:
    enroll = db.query(Enrollment).filter(
        Enrollment.user_id == user_id,
        Enrollment.course_id == course.id,
    ).first()
    if not enroll:
        return False
    completed_count = round(((enroll.progress or 0) / 100) * course.modules_count)
    return module_num <= completed_count





# -----------------------------------------------------

# Auth config

# -----------------------------------------------------

SECRET_KEY = os.getenv("SECRET_KEY", "edupath-jwt-secret-k9x2mL8pQr4nVwZ7yT1uA3bC6dE0fG5h")

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

    module_names: list[str] = []

    videos: int

    quizzes: int

    is_published: bool = False





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

        verified=True,

        joined_at=datetime.utcnow().strftime("%B %d, %Y"),

        points=5,

        courses_completed=0,

    )

    db.add(user)

    db.commit()



    db.add(ActivityLog(student_name=user.name, detail="Registered account"))
    db.commit()

    token = create_access_token({"sub": user.email, "role": user.role})

    return {"access_token": token, "token_type": "bearer", "role": user.role, "name": user.name}





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

@app.get("/admin/courses")
def admin_list_courses(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    courses = db.query(Course).all()
    result = []
    for c in courses:
        result.append({
            "id": c.id, "title": c.title, "desc": c.description,
            "category": c.category, "modules": c.modules_count,
            "videos": c.videos_count, "quizzes": c.quizzes_count,
            "students": c.students_count, "grad": c.grad, "accent": c.accent,
            "is_published": c.is_published,
        })
    return result


@app.post("/courses/{course_id}/publish", status_code=200)
def toggle_publish(
    course_id: str,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    course.is_published = not course.is_published
    db.commit()
    return {"is_published": course.is_published}


@app.get("/courses")
def list_courses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    courses = db.query(Course).filter(Course.is_published == True).all()

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

        is_published=data.is_published,

    )

    db.add(course)
    db.flush()

    # Create CourseModule rows for each module
    names = data.module_names if data.module_names else [f"Module {i+1}" for i in range(data.modules)]
    for i, name in enumerate(names[:data.modules]):
        mod = CourseModule(
            course_id=course.id,
            num=i + 1,
            title=name,
            pass_percentage=DEFAULT_PASS_PERCENTAGE,
            questions_per_test=DEFAULT_QUESTIONS_PER_TEST,
            shuffle_questions=DEFAULT_SHUFFLE_QUESTIONS,
            show_explanations=DEFAULT_SHOW_EXPLANATIONS,
        )
        db.add(mod)

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

    course.is_published  = data.is_published

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


# -----------------------------------------------------
# Routes – Modules, Questions & Tests
# -----------------------------------------------------

# ── Admin module management ──────────────────────────

@app.get("/admin/courses/{course_id}/modules")
def admin_get_modules(
    course_id: str,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    modules = db.query(CourseModule).filter(CourseModule.course_id == course_id).order_by(CourseModule.num).all()
    result = []
    for m in modules:
        videos = db.query(ModuleVideo).filter(ModuleVideo.course_id == course_id, ModuleVideo.module_num == m.num).order_by(ModuleVideo.idx).all()
        questions = db.query(ModuleQuestion).filter(ModuleQuestion.course_id == course_id, ModuleQuestion.module_num == m.num).order_by(ModuleQuestion.idx).all()
        result.append({
            "num": m.num,
            "title": m.title,
            **module_settings_payload(m),
            "videos": [{"idx": v.idx, "title": v.title, "youtube_id": v.youtube_id} for v in videos],
            "questions": [
                {"idx": q.idx, "q": q.question, "opts": [q.option_a, q.option_b, q.option_c, q.option_d], "correct": q.correct_idx, "exp": q.explanation}
                for q in questions
            ],
        })
    return result


class VideoItem(BaseModel):
    title: str
    youtube_id: str


class VideosUpsertRequest(BaseModel):
    videos: list[VideoItem]


@app.put("/admin/courses/{course_id}/modules/{module_num}/videos")
def admin_save_videos(
    course_id: str,
    module_num: int,
    data: VideosUpsertRequest,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    db.query(ModuleVideo).filter(ModuleVideo.course_id == course_id, ModuleVideo.module_num == module_num).delete()
    for i, v in enumerate(data.videos, 1):
        db.add(ModuleVideo(course_id=course_id, module_num=module_num, idx=i, title=v.title, youtube_id=v.youtube_id))
    course.videos_count = db.query(ModuleVideo).filter(ModuleVideo.course_id == course_id).count()
    db.commit()
    return {"message": "Videos saved", "count": len(data.videos)}


class QuestionItem(BaseModel):
    q: str
    opts: list[str]
    correct: int
    exp: str = ""


class QuestionsUpsertRequest(BaseModel):
    questions: list[QuestionItem]


@app.put("/admin/courses/{course_id}/modules/{module_num}/questions")
def admin_save_questions(
    course_id: str,
    module_num: int,
    data: QuestionsUpsertRequest,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    db.query(ModuleQuestion).filter(ModuleQuestion.course_id == course_id, ModuleQuestion.module_num == module_num).delete()
    for i, q in enumerate(data.questions, 1):
        opts = (q.opts + ["", "", "", ""])[:4]
        db.add(ModuleQuestion(
            course_id=course_id, module_num=module_num, idx=i,
            question=q.q, option_a=opts[0], option_b=opts[1], option_c=opts[2], option_d=opts[3],
            correct_idx=q.correct, explanation=q.exp,
        ))
    course.quizzes_count = db.query(ModuleQuestion).filter(ModuleQuestion.course_id == course_id).count()
    db.commit()
    return {"message": "Questions saved", "count": len(data.questions)}


class ModuleSettingsRequest(BaseModel):
    pass_percentage: int
    questions_per_test: int
    shuffle_questions: bool
    show_explanations: bool


@app.put("/admin/courses/{course_id}/modules/{module_num}/settings")
def admin_save_module_settings(
    course_id: str,
    module_num: int,
    data: ModuleSettingsRequest,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    module = db.query(CourseModule).filter(
        CourseModule.course_id == course_id,
        CourseModule.num == module_num,
    ).first()
    if not module:
        raise HTTPException(404, "Module not found")
    module.pass_percentage = max(1, min(100, int(data.pass_percentage or DEFAULT_PASS_PERCENTAGE)))
    module.questions_per_test = max(0, int(data.questions_per_test or DEFAULT_QUESTIONS_PER_TEST))
    module.shuffle_questions = bool(data.shuffle_questions)
    module.show_explanations = bool(data.show_explanations)
    db.commit()
    return {
        "message": "Settings saved",
        **module_settings_payload(module),
    }


@app.get("/courses/{course_id}/modules")
def get_course_modules(
    course_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    enroll = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id,
    ).first()
    completed_count = 0
    if enroll:
        completed_count = round((enroll.progress / 100) * course.modules_count)
    current_module = min(course.modules_count, completed_count + 1)
    modules = (
        db.query(CourseModule)
        .filter(CourseModule.course_id == course_id)
        .order_by(CourseModule.num)
        .all()
    )
    result = []
    for m in modules:
        videos = (
            db.query(ModuleVideo)
            .filter(ModuleVideo.course_id == course_id, ModuleVideo.module_num == m.num)
            .order_by(ModuleVideo.idx)
            .all()
        )
        completed = m.num <= completed_count
        unlocked  = m.num <= current_module
        watched = watched_video_indexes(db, current_user.id, course_id, m.num)
        result.append({
            "num":       m.num,
            "title":     m.title,
            **module_settings_payload(m),
            "videos":    [{"idx": v.idx, "youtube_id": v.youtube_id, "title": v.title, "watched": completed or v.idx in watched} for v in videos],
            "completed": completed,
            "unlocked":  unlocked,
            "score":     (80 + (m.num * 7) % 15) if completed else None,
        })
    return result


@app.post("/courses/{course_id}/modules/{module_num}/videos/{video_idx}/watch")
def mark_module_video_watched(
    course_id: str,
    module_num: int,
    video_idx: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    video = db.query(ModuleVideo).filter(
        ModuleVideo.course_id == course_id,
        ModuleVideo.module_num == module_num,
        ModuleVideo.idx == video_idx,
    ).first()
    if not video:
        raise HTTPException(404, "Video not found")
    exists = db.query(ModuleVideoProgress).filter(
        ModuleVideoProgress.user_id == current_user.id,
        ModuleVideoProgress.course_id == course_id,
        ModuleVideoProgress.module_num == module_num,
        ModuleVideoProgress.video_idx == video_idx,
    ).first()
    if not exists:
        db.add(ModuleVideoProgress(
            user_id=current_user.id,
            course_id=course_id,
            module_num=module_num,
            video_idx=video_idx,
        ))
        db.commit()
    return {"watched": True, "module_unlocked_for_test": has_watched_all_module_videos(db, current_user.id, course_id, module_num)}


@app.get("/courses/{course_id}/modules/{module_num}/questions")
def get_module_questions(
    course_id: str,
    module_num: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    module = db.query(CourseModule).filter(
        CourseModule.course_id == course_id,
        CourseModule.num == module_num,
    ).first()
    if not module:
        raise HTTPException(404, "Module not found")
    if not is_module_completed(db, current_user.id, course, module_num) and not has_watched_all_module_videos(db, current_user.id, course_id, module_num):
        raise HTTPException(403, "Watch all videos in this module before taking the test")
    questions = (
        db.query(ModuleQuestion)
        .filter(ModuleQuestion.course_id == course_id, ModuleQuestion.module_num == module_num)
        .order_by(ModuleQuestion.idx)
        .all()
    )
    if not questions:
        raise HTTPException(404, "No questions found for this module")
    settings = module_settings_payload(module)
    if settings["shuffle_questions"]:
        questions = random.sample(questions, len(questions))
    if settings["questions_per_test"] > 0:
        questions = questions[:settings["questions_per_test"]]
    return [
        {
            "idx":     q.idx,
            "q":       q.question,
            "opts":    [q.option_a, q.option_b, q.option_c, q.option_d],
            "correct": q.correct_idx,
            "exp":     q.explanation,
        }
        for q in questions
    ]


class TestSubmitRequest(BaseModel):
    answers: list[int]
    question_ids: Optional[list[int]] = None


@app.post("/courses/{course_id}/modules/{module_num}/test")
def submit_module_test(
    course_id: str,
    module_num: int,
    data: TestSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    module = db.query(CourseModule).filter(
        CourseModule.course_id == course_id,
        CourseModule.num == module_num,
    ).first()
    if not module:
        raise HTTPException(404, "Module not found")
    if not is_module_completed(db, current_user.id, course, module_num) and not has_watched_all_module_videos(db, current_user.id, course_id, module_num):
        raise HTTPException(403, "Watch all videos in this module before taking the test")
    questions_query = (
        db.query(ModuleQuestion)
        .filter(ModuleQuestion.course_id == course_id, ModuleQuestion.module_num == module_num)
        .order_by(ModuleQuestion.idx)
    )
    questions = questions_query.all()
    if not questions:
        raise HTTPException(404, "No questions found for this module")
    if data.question_ids:
        by_idx = {q.idx: q for q in questions}
        questions = [by_idx[idx] for idx in data.question_ids if idx in by_idx]
        if len(questions) != len(data.question_ids):
            raise HTTPException(400, "Question set mismatch")
    if len(data.answers) != len(questions):
        raise HTTPException(400, "Answer count mismatch")
    settings = module_settings_payload(module)
    correct = sum(1 for i, q in enumerate(questions) if data.answers[i] == q.correct_idx)
    score   = round((correct / len(questions)) * 100)
    passed  = score >= settings["pass_percentage"]
    progress = None
    if passed:
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
        progress = enroll.progress
        user = db.query(User).filter(User.id == current_user.id).first()
        user.points = (user.points or 0) + 25
        if previous_progress < 100 and enroll.progress == 100:
            user.courses_completed = (user.courses_completed or 0) + 1
            user.points += 100
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
                    accent_dim="rgba(124,58,237,0.12)",
                    accent_border="rgba(124,58,237,0.3)",
                ))
        db.add(ActivityLog(
            student_name=current_user.name,
            detail=f"Passed Module {module_num} test in {course.title} — Score: {score}%",
        ))
        db.commit()
    return {
        "score": score,
        "passed": passed,
        "correct": correct,
        "total": len(questions),
        "progress": progress,
        "passing_score": settings["pass_percentage"],
    }

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

            "is_current_user": u.id == current_user.id,

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


