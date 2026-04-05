export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8083";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok || data.token === undefined) {
    throw new Error(data || "Invalid username or password");
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("username", username);
  localStorage.setItem("userRole", data.role);
  localStorage.setItem("userId", data.userId);
  return data;
}

export async function register(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role: "USER" }),
  });

  const data = await res.json();

  if (!res.ok || data.token === undefined) {
    throw new Error(data || "Registration failed");
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("username", username);
  localStorage.setItem("userRole", data.role);
  localStorage.setItem("userId", data.userId);
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("userPhoto");
  localStorage.removeItem("overallStats");
}

export async function getQuestions(testId) {
  const url = testId ? `${API_BASE_URL}/questions/test/${testId}` : `${API_BASE_URL}/questions`;
  const res = await fetch(url, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
}

export async function getQuestionsByTopic(topic) {
  const res = await fetch(`${API_BASE_URL}/questions/topic/${topic}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
}

export async function submitQuiz({ userId, testId, answers, questionReviews }) {
  const res = await fetch(`${API_BASE_URL}/questions/submit`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ userId, testId, answers, questionReviews }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to submit quiz");
  }
  return res.text();
}

export async function getAnalytics() {
  const res = await fetch(`${API_BASE_URL}/questions/user/analytics`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.text();
}

export function getAuthToken() {
  return localStorage.getItem("token");
}

export const getProfile = async (id) => {
  const r = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    headers: authHeaders(),
  });
  if (!r.ok) throw new Error("profile fetch failed");
  return r.json();
};

export const uploadProfilePhoto = async (id, file) => {
  const form = new FormData();
  form.append("file", file);
  const r = await fetch(`${API_BASE_URL}/api/users/${id}/photo`, {
    method: "POST",
    body: form,
  });
  if (!r.ok) throw new Error("upload failed");
};

export const getPhotoUrl = (id) => `${API_BASE_URL}/api/users/${id}/photo`;

export default { login, register, logout, getAuthToken, authHeaders, getQuestions, getQuestionsByTopic, submitQuiz, getAnalytics };
