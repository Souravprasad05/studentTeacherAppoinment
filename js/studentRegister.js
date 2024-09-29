import { auth, database } from "./firebase/firebaseConfig.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { set, ref } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("authForm");
  const showPasswordCheckbox = document.getElementById("showPassword");
  const passwordField = document.getElementById("password");
  const confirmPasswordField = document.getElementById("confirmPassword");

  // Toggle password visibility
  showPasswordCheckbox.addEventListener("change", function () {
    passwordField.type = this.checked ? "text" : "password";
    confirmPasswordField.type = this.checked ? "text" : "password";
  });

  // Submit form to create user and authenticate
  registrationForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById('username').value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const dept = document.getElementById("department").value
    const age = document.getElementById("age").value

    // Validate that passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
        // User successfully created and authenticated
        alert("User created and authenticated successfully!");
        // console.log("User created:", user);

      await set(ref(database, 'students/' + user.uid), {
        id : user.uid,
        name : name,
        department : dept,
        age : age,
        email : email,
        approved : "null"
      })

      window.location.href = "/HTML/studentDashboard.html";

    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(`Error: ${errorMessage}`);
      console.error("Error Code:", errorCode, "Message:", errorMessage);
    }
  });
});
