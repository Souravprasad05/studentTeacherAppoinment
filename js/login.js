document.addEventListener("DOMContentLoaded", function () {
  const loginType = document.getElementById("loginType");
  const registerButton = document.querySelector(".register-button");
  const loginButton = document.querySelector(".login-button");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Check if the registerButton exists before adding event listener
  if (registerButton) {
    // Redirect based on the login type for registration
    registerButton.addEventListener("click", function () {
      if (loginType.textContent.includes("Student")) {
        window.location.href = "/HTML/studentRegister.html";
      }
    });
  }

  // Login validation
  loginButton.addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent form submission
    const email = emailInput.value;
    const password = passwordInput.value;

    if (loginType.textContent.includes("Teacher") && email === "teacher@gmail.com" && password === "pass123") {
        window.location.href = "/HTML/teacherDashboard.html"; // Redirect to teacher dashboard
    } else if (loginType.textContent.includes("Admin") && email === "admin@gmail.com" && password === "pass123") {
        window.location.href = "/HTML/adminDashboard.html"; // Redirect to admin dashboard
    } else {
        alert("Invalid email or password!"); // Show an error message
    }
  });
});
