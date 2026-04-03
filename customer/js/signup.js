import { initLocation } from "./location.js";

const SESSION_KEY = "cinema_customer_session";

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

function setLoggedIn() {
  sessionStorage.setItem(SESSION_KEY, "1");
}

function initSignupPage() {
  initLocation();

  if (isLoggedIn()) {
    window.location.replace("home.html");
    return;
  }

  const form = document.getElementById("signup-form");
  const email = document.getElementById("signup-email");
  const password = document.getElementById("signup-password");
  const confirm = document.getElementById("signup-password-confirm");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!email?.value.trim()) {
      email?.focus();
      return;
    }
    const p = password?.value ?? "";
    const c = confirm?.value ?? "";
    if (p.length < 6) {
      password?.focus();
      return;
    }
    if (p !== c) {
      confirm?.setCustomValidity("Passwords do not match");
      confirm?.reportValidity();
      return;
    }
    confirm?.setCustomValidity("");
    setLoggedIn();
    window.location.href = "home.html";
  });

  confirm?.addEventListener("input", () => {
    confirm.setCustomValidity("");
  });
}

initSignupPage();
