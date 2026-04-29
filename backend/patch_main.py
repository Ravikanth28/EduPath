"""Patch main.py to add new endpoints and update leaderboard."""

with open("main.py", "r", encoding="utf-8", errors="replace") as f:
    content = f.read()

# 1. Fix import line
old_import = """from database import (

    ActivityLog, Certificate, Course, Enrollment,

    User, get_db, init_db,

)"""
new_import = """from database import (

    ActivityLog, Certificate, Course, Enrollment,

    User, get_db, init_db,

    CourseModule, ModuleVideo, ModuleQuestion,

)"""
content = content.replace(old_import, new_import, 1)

# 2. Find the leaderboard section and replace it with new endpoints + updated leaderboard
leaderboard_marker = '@app.get("/leaderboard")'
leaderboard_pos = content.find(leaderboard_marker)
if leaderboard_pos == -1:
    print("ERROR: could not find leaderboard endpoint")
    exit(1)

# Find end of leaderboard function (next double newline after it)
# We want to insert NEW_ENDPOINTS right before the leaderboard section
insert_pos = leaderboard_pos

new_endpoints = '''
# -----------------------------------------------------
# Routes – Modules, Questions & Tests
# -----------------------------------------------------

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
        unlocked  = enroll is not None and m.num <= current_module
        result.append({
            "num":       m.num,
            "title":     m.title,
            "videos":    [{"idx": v.idx, "youtube_id": v.youtube_id, "title": v.title, "watched": completed} for v in videos],
            "completed": completed,
            "unlocked":  unlocked,
            "score":     (80 + (m.num * 7) % 15) if completed else None,
        })
    return result


@app.get("/courses/{course_id}/modules/{module_num}/questions")
def get_module_questions(
    course_id: str,
    module_num: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    questions = (
        db.query(ModuleQuestion)
        .filter(ModuleQuestion.course_id == course_id, ModuleQuestion.module_num == module_num)
        .order_by(ModuleQuestion.idx)
        .all()
    )
    if not questions:
        raise HTTPException(404, "No questions found for this module")
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
    questions = (
        db.query(ModuleQuestion)
        .filter(ModuleQuestion.course_id == course_id, ModuleQuestion.module_num == module_num)
        .order_by(ModuleQuestion.idx)
        .all()
    )
    if not questions:
        raise HTTPException(404, "No questions found for this module")
    if len(data.answers) != len(questions):
        raise HTTPException(400, "Answer count mismatch")
    correct = sum(1 for i, q in enumerate(questions) if data.answers[i] == q.correct_idx)
    score   = round((correct / len(questions)) * 100)
    passed  = score >= 70
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
            detail=f"Passed Module {module_num} test in {course.title} \u2014 Score: {score}%",
        ))
        db.commit()
    return {"score": score, "passed": passed, "correct": correct, "total": len(questions), "progress": progress}

'''

content = content[:insert_pos] + new_endpoints + content[insert_pos:]

# 3. Now update the leaderboard endpoint to add is_current_user
# Find it again (position shifted)
lb_pos = content.find('@app.get("/leaderboard")')
# Find the return list in leaderboard
old_lb_return = '''            "certificates": db.query(Certificate).filter(Certificate.student_id == u.id).count(),
        }
        for i, u in enumerate(students)
    ]'''
new_lb_return = '''            "certificates": db.query(Certificate).filter(Certificate.student_id == u.id).count(),
            "is_current_user": u.id == current_user.id,
        }
        for i, u in enumerate(students)
    ]'''
content = content.replace(old_lb_return, new_lb_return, 1)

with open("main.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Done! Checking for errors...")
# Verify
if 'get_course_modules' in content:
    print("  OK: get_course_modules added")
if 'get_module_questions' in content:
    print("  OK: get_module_questions added")
if 'submit_module_test' in content:
    print("  OK: submit_module_test added")
if 'is_current_user' in content:
    print("  OK: is_current_user added to leaderboard")
if 'CourseModule, ModuleVideo, ModuleQuestion' in content:
    print("  OK: new models imported")
