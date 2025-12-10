// Detect which page is open
const page = window.location.pathname;

// Login function
function login() {
  const user = document.getElementById("username").value;
  localStorage.setItem("user", user);
  window.location.href = "home.html"; // redirect
}

// Home page setup
if (page.includes("home.html")) {
  const user = localStorage.getItem("user");
  document.getElementById("welcome").innerText = "Hello, " + user;
}

// Profile page setup
if (page.includes("profile.html")) {
  const user = localStorage.getItem("user");
  document.getElementById("profile").innerText = "Profile of " + user;
}