let attempts = [];
const TIME_LIMIT = 3000;

// Validation functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showError(fieldId, errorMsg) {
  const errorEl = document.getElementById(fieldId + 'Error');
  if (errorEl) {
    errorEl.textContent = errorMsg;
    errorEl.style.display = 'block';
    errorEl.style.color = '#fca5a5';
    errorEl.style.fontSize = '12px';
    errorEl.style.marginTop = '4px';
  }
}

function clearErrors() {
  document.getElementById('emailError').textContent = '';
  document.getElementById('passwordError').textContent = '';
}

function login() {
  clearErrors();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Validation
  if (!email) {
    showError('email', 'Email is required');
    return;
  }

  if (!validateEmail(email)) {
    showError('email', 'Please enter a valid email address');
    return;
  }

  if (!password) {
    showError('password', 'Password is required');
    return;
  }

  if (password.length < 6) {
    showError('password', 'Password must be at least 6 characters');
    return;
  }

  const now = Date.now();
  attempts.push(now);
  attempts = attempts.filter(t => now - t <= TIME_LIMIT);

  // Honeypot redirection
  if (attempts.length >= 3) {
    window.location.href = "http://localhost:4000";
    return;
  }

  fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(res => res.json())
  .then(data => {
    const msg = document.getElementById("msg");

    if (data.message === "Login successful") {
      msg.className = "message success";
      msg.innerText = "Login successful. Redirecting...";

      // Store user data with ID for proper user isolation
      const userData = {
        email: email,
        ...data.user,
        _id: data.user._id || data.user.id || email // Ensure userId is stored
      };

      localStorage.setItem("user", JSON.stringify(userData));

      setTimeout(() => {
        window.location.href = "user-dashboard.html";
      }, 1200);
    } else {
      msg.className = "message error";
      msg.innerText = data.message || "Login failed. Please try again.";
    }
  })
  .catch(err => {
    const msg = document.getElementById("msg");
    msg.className = "message error";
    msg.innerText = "Connection error. Please check your network.";
    console.error("Login error:", err);
  });
}

function togglePassword(id, icon) {
  const field = document.getElementById(id);

  if (field.type === "password") {
    field.type = "text";
    icon.innerHTML = "🙈";
  } else {
    field.type = "password";
    icon.innerHTML = "👁️";
  }
}

// Clear errors on input
document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      document.getElementById('emailError').textContent = '';
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      document.getElementById('passwordError').textContent = '';
    });
  }

  // Allow Enter key to submit form
  if (passwordInput) {
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        login();
      }
    });
  }
});

