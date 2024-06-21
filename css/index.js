document
  .getElementById("registerLink")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link action
    window.location.href = "/register.html";
  });
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      const messageElement = document.getElementById("message");
      if (result.success) {
        sessionStorage.setItem("username", result.username);
        window.location.href = "/dashboard.html";
      } else {
        messageElement.textContent =
          "Authentication failed. Invalid username or password.";
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("message").textContent = "An error occurred.";
    }
  });
