import { initLocation } from "./location.js";

const SESSION_KEY = "cinema_customer_session";

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

function setLoggedIn() {
  sessionStorage.setItem(SESSION_KEY, "1");
}

function initLoginPage() {
  initLocation();

  if (isLoggedIn()) {
    window.location.replace("home.html");
    return;
  }

  const form = document.getElementById("login-form");
  const email = document.getElementById("login-email");
  const password = document.getElementById("login-password");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!email?.value.trim()) {
      email?.focus();
      return;
    }
    if (!password?.value) {
      password?.focus();
      return;
    }
    setLoggedIn();
    window.location.href = "home.html";
  });
}

initLoginPage();
