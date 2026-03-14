// common.js

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

function go(page) {
  window.location.href = page;
}

// Optional: protect pages that require login
function requireAuth() {
  const user = localStorage.getItem("user");
  if (!user) {
    window.location.href = "login.html";
  }
}
