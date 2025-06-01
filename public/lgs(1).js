// DOM Elements
const signUpBtn = document.getElementById('signUp');
const signInBtn = document.getElementById('signIn');
const container = document.getElementById('container');

signUpBtn.addEventListener('click', () => container.classList.add("right-panel-active"));
signInBtn.addEventListener('click', () => container.classList.remove("right-panel-active"));

// Utility validation functions
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isStrongPassword = (password) =>
  /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(password); // min 6, 1 number, 1 capital

const showError = (input, message) => {
  const error = document.createElement("small");
  error.className = "error-message";
  error.style.color = "red";
  error.innerText = message;
  input.parentNode.querySelectorAll(".error-message").forEach(e => e.remove());
  input.insertAdjacentElement("afterend", error);
};

const clearError = (input) => {
  input.parentNode.querySelectorAll(".error-message").forEach(e => e.remove());
};

// Toast notification helper
function showToast(message, success = true) {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '10000';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.background = success ? '#4BB543' : '#ff5252';
  toast.style.color = 'white';
  toast.style.padding = '12px 20px';
  toast.style.marginTop = '10px';
  toast.style.borderRadius = '5px';
  toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  toast.style.fontWeight = '600';
  toast.style.minWidth = '200px';
  toast.style.opacity = '1';
  toast.style.transition = 'opacity 0.5s ease';

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// SIGN UP VALIDATION
document.getElementById("signUpForm").addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById("signUPname");
  const email = document.getElementById("signUPemail");
  const password = document.getElementById("signUPpassword");

  let isValid = true;

  if (name.value.trim() === "") {
    showError(name, "Name is required");
    isValid = false;
  } else {
    clearError(name);
  }

  if (!isValidEmail(email.value.trim())) {
    showError(email, "Enter a valid email address");
    isValid = false;
  } else {
    clearError(email);
  }

  if (!isStrongPassword(password.value.trim())) {
    showError(password, "Password must be at least 6 chars, include 1 capital and 1 number");
    isValid = false;
  } else {
    clearError(password);
  }

  if (!isValid) return;

  fetch("/signUP", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      signUPname: name.value.trim(),
      signUPemail: email.value.trim(),
      signUPpassword: password.value.trim()
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        showToast("Sign up successful! Redirecting...", true);
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2500);
      } else {
        showToast(data.message || "Sign up failed.", false);
      }
    })
    .catch(err => showToast("Sign Up Error: " + err.message, false));
});

// SIGN IN VALIDATION
document.getElementById("signInForm").addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById("signInemail");
  const password = document.getElementById("signInpassword");

  let isValid = true;

  if (!isValidEmail(email.value.trim())) {
    showError(email, "Please enter a valid email");
    isValid = false;
  } else {
    clearError(email);
  }

  if (password.value.trim().length < 6) {
    showError(password, "Password must be at least 6 characters");
    isValid = false;
  } else {
    clearError(password);
  }

  if (!isValid) return;

  fetch("/signIn", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      signInemail: email.value.trim(),
      signInpassword: password.value.trim()
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        showToast("Login successful! Redirecting...", true);
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        showToast("Login failed: " + data.message, false);
      }
    })
    .catch(err => showToast("Sign In Error: " + err.message, false));
});
