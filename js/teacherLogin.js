import { auth, database } from "./firebase/firebaseConfig.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const registerButton = document.querySelector(".register-button");

const loginBtn = document.querySelector("#loginBtn");

document.addEventListener("DOMContentLoaded", function () {
  // Check if the registerButton exists before adding event listener
  if (registerButton) {
    // Redirect based on the login type for registration
    registerButton.addEventListener("click", function () {
      if (loginType.textContent.includes("Student")) {
        window.location.href = "/HTML/studentRegister.html";
      }
    });
  }
});

loginBtn.addEventListener("click", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Signin with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // User successfully authenticated
    alert("Teacher Logged in successfully!");
    // console.log("User Logged in:", user);

    window.location.href = "/HTML/teacherDashboard.html";
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(`Error: ${errorMessage}`);
    console.error("Error Code:", errorCode, "Message:", errorMessage);
  }
});
