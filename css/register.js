document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      const messageElement = document.getElementById("message");

      if (result.success) {
        window.location.href = "/successregister.html";
      } else {
        messageElement.textContent = `Registration failed: ${result.message}`;
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("message").textContent = "An error occurred.";
    }
  });
