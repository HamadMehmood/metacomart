document.addEventListener("DOMContentLoaded", function () {
  // ✅ REGISTER
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("registerUsername").value;
      const password = document.getElementById("registerPassword").value;
      const messageEl = document.getElementById("registerMessage");

      try {
        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        messageEl.innerText = data.message;
        messageEl.style.color = "green";
      } catch (err) {
        messageEl.innerText = "Registration failed.";
        messageEl.style.color = "red";
      }
    });
  }

  // ✅ LOGIN
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;
      const messageEl = document.getElementById("loginMessage");

      try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          messageEl.innerText = "Login successful!";
          messageEl.style.color = "green";
          setTimeout(() => (window.location.href = "index.html"), 1000);
        } else {
          messageEl.innerText = data.message || "Login failed.";
          messageEl.style.color = "red";
        }
      } catch (err) {
        messageEl.innerText = "Login failed.";
        messageEl.style.color = "red";
      }
    });
  }
});
