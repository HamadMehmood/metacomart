document.getElementById("changePasswordForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const messageEl = document.getElementById("changeMessage");
  
    if (newPassword !== confirmPassword) {
      messageEl.textContent = "❌ Passwords do not match.";
      messageEl.style.color = "red";
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      messageEl.textContent = "❌ You must be logged in.";
      messageEl.style.color = "red";
      return;
    }
  
    try {
      const res = await fetch("https://metacomart-2.onrender.com/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        messageEl.textContent = data.message || "✅ Password updated!";
        messageEl.style.color = "green";
        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href = "login.html";
        }, 2000);
      } else {
        messageEl.textContent = data.message || "❌ Failed to update.";
        messageEl.style.color = "red";
      }
    } catch (err) {
      console.error("Error:", err);
      messageEl.textContent = "❌ Server error.";
      messageEl.style.color = "red";
    }
  });
  