// index.js - simple front-end auth using users.json + localStorage

const STORAGE_KEYS = {
  USERS: "users",
  SESSION: "sessionEmail"
};

// Load users from JSON (only first time)
async function loadUsersFromJSON() {
  try {
    const res = await fetch("users.json", { cache: "no-store" });
    const data = await res.json();
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn("Fetch error:", err);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
  }
}

async function ensureUsersLoaded() {
  let users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
  if (!users.length) {
    users = await loadUsersFromJSON();
  }
  return users;
}

function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
}
function setUsers(u) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(u));
}
function getSessionEmail() {
  return localStorage.getItem(STORAGE_KEYS.SESSION);
}
function setSessionEmail(email) {
  localStorage.setItem(STORAGE_KEYS.SESSION, email);
}
function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}
function requireAuth() {
  const email = getSessionEmail();
  if (!email) {
    window.location.href = "login.html";
    throw new Error("Redirecting to login");
  }
  return email;
}

// ---------------- PAGE LOGIC ----------------
document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;

  // LOGIN PAGE
  if (path.endsWith("login.html")) {
    await ensureUsersLoaded();
    if (getSessionEmail()) {
      window.location.href = "home.html";
      return;
    }

    const form = document.getElementById("loginForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const identity = document.getElementById("identity").value.trim();
      const password = document.getElementById("password").value;

      const users = getUsers();
      const user = users.find(
        (u) =>
          (u.email.toLowerCase() === identity.toLowerCase() ||
           u.username.toLowerCase() === identity.toLowerCase()) &&
          u.password === password
      );

      if (user) {
        setSessionEmail(user.email);
        window.location.href = "home.html";
      } else {
        document.getElementById("loginError").textContent = "Invalid credentials!";
        document.getElementById("loginError").style.display = "block";
      }
    });
  }

  // HOME PAGE
  if (path.endsWith("home.html")) {
    const sessionEmail = requireAuth();
    const user = getUsers().find((u) => u.email === sessionEmail);
    document.getElementById("welcome").innerText = "Welcome, " + user.username;
    document.getElementById("logoutBtn").addEventListener("click", () => {
      clearSession();
      window.location.href = "login.html";
    });
  }

  // PROFILE PAGE
  if (path.endsWith("profile.html")) {
    const sessionEmail = requireAuth();
    const users = getUsers();
    const index = users.findIndex((u) => u.email === sessionEmail);
    const user = users[index];

    document.getElementById("username").value = user.username;
    document.getElementById("email").value = user.email;
    document.getElementById("password").value = user.password;

    document.getElementById("saveBtn").addEventListener("click", () => {
      users[index] = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      };
      setUsers(users);
      setSessionEmail(users[index].email);
      alert("Profile updated!");
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
      clearSession();
      window.location.href = "login.html";
    });
  }
});