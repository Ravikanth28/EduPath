const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Token helpers ────────────────────────────────────────────────────────────
export function saveToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem("edupath_token", token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("edupath_token");
}

export function clearToken() {
  if (typeof window !== "undefined") localStorage.removeItem("edupath_token");
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function request<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail ?? "Request failed");
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: "student" | "admin";
  name: string;
}

export interface Course {
  id: string;
  title: string;
  desc: string;
  category: string;
  modules: number;
  videos: number;
  quizzes: number;
  students: number;
  grad: string;
  accent: string;
  enrolled?: boolean;
  progress?: number;
  completed?: boolean;
  is_published?: boolean;
}

export interface Certificate {
  id: string;
  course: string;
  category: string;
  issued: string;
  status: "verified" | "pending" | "revoked";
  grad: string;
  accent: string;
  accentDim: string;
  accentBorder: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  courses_completed: number;
  certificates: number;
  is_current_user?: boolean;
}

export interface ModuleVideo {
  idx: number;
  youtube_id: string;
  title: string;
  watched: boolean;
}

export interface CourseModule {
  num: number;
  title: string;
  videos: ModuleVideo[];
  completed: boolean;
  unlocked: boolean;
  score: number | null;
}

export interface AdminVideo {
  idx: number;
  title: string;
  youtube_id: string;
}

export interface AdminQuestion {
  idx: number;
  q: string;
  opts: string[];
  correct: number;
  exp: string;
}

export interface AdminModule {
  num: number;
  title: string;
  videos: AdminVideo[];
  questions: AdminQuestion[];
}

export interface QuizQuestion {
  idx: number;
  q: string;
  opts: string[];
  correct: number;
  exp: string;
}

export interface TestResult {
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  progress: number | null;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  verified: boolean;
  joined: string;
  points: number;
  courses_completed: number;
  certificates: string[];
  enrolled_courses: string[];
}

export interface DashboardStats {
  enrolled_courses: number;
  completed_modules: number;
  finished_courses: number;
  certificates_earned: number;
  points: number;
}

export interface AdminStats {
  total_courses: number;
  total_students: number;
  total_certificates: number;
  active_students: number;
}

export interface ActivityEntry {
  student: string;
  detail: string;
  time: string;
}

// ─── API client ───────────────────────────────────────────────────────────────
export const api = {
  /** Auth */
  auth: {
    register: (data: { name: string; email: string; password: string; phone: string }) =>
      request<{ message: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    sendOtp: (email: string) =>
      request<{ message: string }>("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),

    verifyOtp: (email: string, otp: string) =>
      request<AuthResponse>("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      }),

    login: (email: string, password: string) =>
      request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
  },

  /** Profile */
  profile: {
    get: () => request<Student>("/profile"),
    update: (data: { name?: string; phone?: string }) =>
      request<{ message: string }>("/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    changePassword: (data: { current_password: string; new_password: string }) =>
      request<{ message: string }>("/profile/password", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  /** Courses */
  courses: {
    list: () => request<Course[]>("/courses"),
    get: (id: string) => request<Course>(`/courses/${id}`),
    create: (data: Omit<Course, "id" | "students" | "grad" | "accent"> & { module_names?: string[] }) =>
      request<Course>("/courses", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Course>) =>
      request<Course>(`/courses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/courses/${id}`, { method: "DELETE" }),
    enroll: (id: string) =>
      request<{ message: string }>(`/courses/${id}/enroll`, { method: "POST" }),
    completeModule: (courseId: string, moduleNum: number) =>
      request<{ message: string; progress: number; completed_modules: number; completed: boolean }>(
        `/courses/${courseId}/modules/${moduleNum}/complete`,
        { method: "POST" }
      ),
    adminList: () => request<Course[]>("/admin/courses"),
    togglePublish: (id: string) =>
      request<{ is_published: boolean }>(`/courses/${id}/publish`, { method: "POST" }),
  },

  /** Modules */
  modules: {
    list: (courseId: string) => request<CourseModule[]>(`/courses/${courseId}/modules`),
    adminList: (courseId: string) => request<AdminModule[]>(`/admin/courses/${courseId}/modules`),
    getQuestions: (courseId: string, moduleNum: number) =>
      request<QuizQuestion[]>(`/courses/${courseId}/modules/${moduleNum}/questions`),
    submitTest: (courseId: string, moduleNum: number, answers: number[]) =>
      request<TestResult>(`/courses/${courseId}/modules/${moduleNum}/test`, {
        method: "POST",
        body: JSON.stringify({ answers }),
      }),
    saveVideos: (courseId: string, moduleNum: number, videos: { title: string; youtube_id: string }[]) =>
      request<{ message: string; count: number }>(
        `/admin/courses/${courseId}/modules/${moduleNum}/videos`,
        { method: "PUT", body: JSON.stringify({ videos }) }
      ),
    saveQuestions: (courseId: string, moduleNum: number, questions: { q: string; opts: string[]; correct: number; exp: string }[]) =>
      request<{ message: string; count: number }>(
        `/admin/courses/${courseId}/modules/${moduleNum}/questions`,
        { method: "PUT", body: JSON.stringify({ questions }) }
      ),
  },

  /** Students (admin) */
  students: {
    list: () => request<Student[]>("/students"),
    get: (id: string) => request<Student>(`/students/${id}`),
  },

  /** Leaderboard */
  leaderboard: {
    get: () => request<LeaderboardEntry[]>("/leaderboard"),
  },

  /** Certificates */
  certificates: {
    list: () => request<Certificate[]>("/certificates"),
  },

  /** Activity (admin) */
  activity: {
    list: () => request<ActivityEntry[]>("/activity"),
  },

  /** Stats */
  dashboard: {
    stats: () => request<DashboardStats>("/dashboard/stats"),
  },
  admin: {
    stats: () => request<AdminStats>("/admin/stats"),
  },
};
