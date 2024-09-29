import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { auth, database } from "./firebase/firebaseConfig.js";

document.addEventListener("DOMContentLoaded", function () {
  let appointmentCount = 0;
  let user = "";
  const appointmentsList = document.getElementById("appointments-list");
  const noAppointmentsMsg = document.getElementById("no-appointments-msg");

  const studentName = document.getElementById("studentName");

  onAuthStateChanged(auth, async (user) => {
    console.log(user.uid)
    const userRef = ref(database, "students/" + user.uid);

    try {
      // Retrieve data from the database
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();

        // Display user data in the frontend
        studentName.innerText = userData.name;
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  // Show the alert box for 3 seconds
  const alertBox = document.getElementById("alert-box");
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 3000);

  // Logout button functionality
  const logoutButton = document.querySelector("#logoutBtn");
  logoutButton.addEventListener("click", function () {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
    window.location.href = "/index.html"; // Redirect to index.html
  });

  // Book appointment function
  function addAppointment(teacher, subject, time) {
    appointmentCount++;
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
            <td>${appointmentCount}</td>
            <td>${teacher}</td>
            <td>${subject}</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td>${time}</td>
        `;
    appointmentsList.appendChild(newRow);
    noAppointmentsMsg.style.display = "none"; // Hide "No appointments" message
  }

  // Handle teacher booking
  const bookButtons = document.querySelectorAll(".book-appointment");
  bookButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const teacherCard = this.closest(".teacher-card");
      const teacher = teacherCard.querySelector("h3").textContent;
      const subject = teacherCard
        .querySelector("p:nth-of-type(1)")
        .textContent.split(": ")[1];
      const time = teacherCard
        .querySelector("p:nth-of-type(4)")
        .textContent.split(": ")[1];

      addAppointment(teacher, subject, time);
    });
  });

  // Disable book button for unavailable teachers
  document.querySelectorAll(".teacher-card").forEach((teacherCard) => {
    const availability = teacherCard.dataset.availabilityId;
    const bookButton = teacherCard.querySelector(".book-appointment");

    if (availability === "not-available") {
      bookButton.style.display = "none";
    }
  });
});
