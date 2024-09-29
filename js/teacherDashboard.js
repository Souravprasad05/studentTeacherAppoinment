import {
    signOut,
    onAuthStateChanged,
  } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
  import {
    ref,
    get,
  } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
  import { auth, database } from "./firebase/firebaseConfig.js";

let appointmentCount = 0; // Initialize appointment counter

document.addEventListener("DOMContentLoaded", function () {
  const appointmentTableBody = document.getElementById(
    "appointment-table-body"
  );
  const noAppointmentsMsg = document.getElementById("no-appointments-msg");
  const appointmentCountText = document.getElementById("appointment-count");
  const scheduleModal = document.getElementById("schedule-modal");
  const closeModalButton = document.getElementById("close-modal");
  const submitAppointmentButton = document.getElementById("submit-appointment");
  const timeSlotInputs = document.getElementsByName("time-slot");
  const requestContainer = document.getElementById("request-container");

  const teacherName = document.getElementById("teacherName");

  onAuthStateChanged(auth, async (user) => {
    console.log(user.uid);
    const userRef = ref(database, "teacher/" + user.uid);

    try {
      // Retrieve data from the database
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();

        // Display user data in the frontend
        teacherName.innerText = userData.name;
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

  const logoutButton = document.querySelector(".logout-button");
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

  // Function to update appointment count display
  function updateAppointmentCount() {
    appointmentCountText.textContent = `Scheduled Appointments: ${appointmentCount}`;
  }

  // Function to add appointment to the table
  function addAppointment(subject, date, time) {
    appointmentCount++; // Increment the counter
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
            <td>${appointmentCount}</td>
            <td>${subject}</td>
            <td>${date}</td>
            <td>${time}</td>
            <td><button class="delete-appointment">Delete</button></td>
        `;
    appointmentTableBody.appendChild(newRow);

    // Hide the "No appointments!" message
    noAppointmentsMsg.style.display = "none";
    updateAppointmentCount();
  }

  // Schedule appointment button click handler
  document
    .getElementById("schedule-appointment-btn")
    .addEventListener("click", () => {
      scheduleModal.style.display = "block"; // Show modal
    });

  // Close modal button click handler
  closeModalButton.addEventListener("click", () => {
    scheduleModal.style.display = "none"; // Hide modal
  });

  // Submit appointment button click handler
  submitAppointmentButton.addEventListener("click", () => {
    let selectedTimeSlot;
    timeSlotInputs.forEach((input) => {
      if (input.checked) {
        selectedTimeSlot = input.value;
      }
    });

    if (selectedTimeSlot) {
      const subject = "Sample Subject"; // Replace with actual subject logic
      const date = new Date().toLocaleDateString(); // Use today's date for example
      addAppointment(subject, date, selectedTimeSlot);
      scheduleModal.style.display = "none"; // Hide modal
      // Reset radio inputs
      timeSlotInputs.forEach((input) => (input.checked = false));
    } else {
      alert("Please select a time slot.");
    }
  });

  // Sample requests for approval/rejection
  const sampleRequests = [
    {
      image: "/images/studentImage.jpg",
      name: "Student A",
      subject: "Math",
      time: "2pm-3pm",
    },
    {
      image: "/images/studentImage.jpg",
      name: "Student B",
      subject: "Science",
      time: "4pm-5pm",
    },
    {
      image: "/images/studentImage.jpg",
      name: "Student C",
      subject: "English",
      time: "6pm-7pm",
    },
  ];

  // Generate request cards
  sampleRequests.forEach((request, index) => {
    const requestCard = document.createElement("div");
    requestCard.className = "request-card";
    requestCard.innerHTML = `
            <img src="${request.image}" alt="${request.name}">
            <h3>${request.name}</h3>
            <p>Subject: ${request.subject}</p>
            <p>Time: ${request.time}</p>
            <div class="button-container">
                <button class="approve-request" data-index="${index}" style="background-color: green;">Approve</button>
                <button class="reject-request" data-index="${index}" style="background-color: red;">Reject</button>
            </div>
            <button class="message-request" data-index="${index}">Message</button>
        `;
    requestContainer.appendChild(requestCard);
  });

  // Function to handle approval of requests
  function handleApproveRequest(index) {
    const request = sampleRequests[index];
    const subject = request.subject; // Extract subject
    const date = new Date().toLocaleDateString(); // Use today's date for example
    const time = request.time; // Extract time

    // Add the approved appointment to the appointments table
    addAppointment(subject, date, time);
  }

  // Event listeners for approve and reject buttons
  requestContainer.addEventListener("click", (event) => {
    const index = event.target.dataset.index;

    if (event.target.classList.contains("approve-request")) {
      handleApproveRequest(index); // Approve request
      event.target.closest(".request-card").remove(); // Remove the request card
      sampleRequests.splice(index, 1); // Remove the request from sampleRequests
    } else if (event.target.classList.contains("reject-request")) {
      event.target.closest(".request-card").remove(); // Remove the request card
      sampleRequests.splice(index, 1); // Remove the request from sampleRequests
    } else if (event.target.classList.contains("message-request")) {
      alert(
        `Message feature for ${sampleRequests[index].name} is not yet implemented.`
      );
    }
  });
});
