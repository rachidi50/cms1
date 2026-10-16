const form = document.getElementById("form");
const nameField = document.getElementById("nameField");
const nameInput = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const toggle = document.getElementById("toggle");
const submit = document.getElementById("submit");
const status = document.getElementById("status");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const switchText = document.getElementById("switchText");
const switchBtn = document.getElementById("switchBtn");

let mode = "signin"; // "signin" or "signup"

function setMode(next) {
  mode = next;
  const signup = mode === "signup";
  nameField.hidden = !signup;
  title.textContent = signup ? "Create your account" : "Welcome back";
  subtitle.textContent = signup ? "It only takes a minute." : "Sign in to continue.";
  submit.textContent = signup ? "Create account" : "Sign in";
  switchText.textContent = signup ? "Already have an account?" : "No account yet?";
  switchBtn.textContent = signup ? "Sign in" : "Create one";
  password.autocomplete = signup ? "new-password" : "current-password";
  clearErrors();
  status.textContent = "";
  status.className = "status";
}

function setError(input, message) {
  const field = input.closest(".field");
  field.classList.add("invalid");
  field.querySelector(".error").textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".field").forEach((f) => f.classList.remove("invalid"));
}

function validate() {
  clearErrors();
  let valid = true;

  if (mode === "signup" && nameInput.value.trim().length < 2) {
    setError(nameInput, "Enter your name.");
    valid = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    setError(email, "Enter a valid email address.");
    valid = false;
  }
  if (password.value.length < 8) {
    setError(password, "Use at least 8 characters.");
    valid = false;
  }
  return valid;
}

toggle.addEventListener("click", () => {
  const hidden = password.type === "password";
  password.type = hidden ? "text" : "password";
  toggle.textContent = hidden ? "Hide" : "Show";
  toggle.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
});

switchBtn.addEventListener("click", () => setMode(mode === "signin" ? "signup" : "signin"));

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "";
  status.className = "status";
  if (!validate()) return;

  submit.disabled = true;
  submit.textContent = "Please wait...";

  // Replace this block with a real request to your server, for example:
  // const res = await fetch("/api/login", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ email: email.value, password: password.value }),
  // });
  await new Promise((r) => setTimeout(r, 800));

  status.textContent = mode === "signup" ? "Account created." : "Signed in.";
  status.className = "status ok";
  submit.disabled = false;
  submit.textContent = mode === "signup" ? "Create account" : "Sign in";
});

[nameInput, email, password].forEach((input) =>
  input.addEventListener("input", () => input.closest(".field").classList.remove("invalid"))
);