import { auth, database } from "./firebase/firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
  ref,
  get,
  set,
  update,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import {
  getAuth,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
  // Modal Elements
  const addTeacherModal = document.getElementById("add-teacher-modal");
  const addTeacherBtn = document.getElementById("add-teacher-btn");
  const closeModalBtn = document.getElementById("close-modal");
  const submitTeacherBtn = document.getElementById("submit-teacher");

  // Table Elements
  const teachersTableBody = document.getElementById("teachers-table-body");
  const teacherCountElement = document.getElementById("teacher-count");
  const noTeachersMsg = document.getElementById("no-teachers-msg");

  // Students Table Elements
  const studentsTableBody = document.getElementById("students-table-body");
  const noStudentsMsg = document.getElementById("no-students-msg");

  // Initial State (Simulating a data array for teachers)
  let teachers = [];

  //
  let approvedStudents = [];

  // Sample students for testing
  // const sampleStudents = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     department: "Computer Science",
  //     age: 20,
  //     email: "johndoe@example.com",
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Smith",
  //     department: "Mathematics",
  //     age: 22,
  //     email: "janesmith@example.com",
  //   },
  //   {
  //     id: 3,
  //     name: "Alice Johnson",
  //     department: "Physics",
  //     age: 21,
  //     email: "alicejohnson@example.com",
  //   },
  // ];

  // ------------- fetching student data
  const fetchStudent = async () => {
    const userRef = ref(database, "students/");

    try {
      // Retrieve data from the database
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();

        const studentsArray = Object.keys(userData)
          .map((key) => ({
            id: key, // Use the Firebase key as the student id
            ...userData[key],
          }))
          .filter((student) => student.approved === "null");

        // console.log(studentsArray);
        populateApproveRejectSection(studentsArray); // Pass the array to the function
      } else {
        console.log("No data available");
        noStudentsMsg.style.display = "block"; // Show "No Students" message if no data
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  fetchStudent();
  // ------------------------------------------

  // ------------- fetching teacher data
  const fetchTeacher = async () => {
    const userRef = ref(database, "teacher/");
    try {
      // Retrieve data from the database
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();

        // Clear the existing teachers array if needed
        teachers = []; // Optional: Clear existing data if you want to refresh the array

        // Push each teacher's data into the existing teachers array
        Object.keys(userData).forEach((key) => {
          teachers.push({
            id: key, // Use the Firebase key as the teacher id
            ...userData[key],
          });
        });

        console.log(teachers);
        updateTeachersTable(); // Update the table to reflect the new data
        updateTeacherCount();
      } else {
        console.log("No data available");
        noTeachersMsg.style.display = "block"; // Show "No Teachers" message if no data
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  fetchTeacher();
  // ---------------------------

  // fetching approved students
  const fetchApprovedStudents = async () => {
    const studentsRef = ref(database, "students/");

    try {
      // Retrieve data from the database
      const snapshot = await get(studentsRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();

        // Filter students where approved is true
        const approvedStudentsArray = Object.keys(userData)
          .map((key) => ({
            id: key, // Use the Firebase key as the student id
            ...userData[key],
          }))
          .filter((student) => student.approved === true);
        // If there are approved students, populate the table
        if (approvedStudentsArray.length > 0) {
          populateApprovedStudentTable(approvedStudentsArray);
          noStudentsMsg.style.display = "none"; // Hide "No Students" message
        } else {
          noStudentsMsg.style.display = "block"; // Show "No Students" message if no approved students
        }
      } else {
        console.log("No data available");
        noStudentsMsg.style.display = "block"; // Show "No Students" message if no data
      }
    } catch (error) {
      console.error("Error fetching approved students:", error);
    }
  };

  // Call the function to load only approved students
  fetchApprovedStudents();

  function populateApprovedStudentTable(students) {
    studentsTableBody.innerHTML = ""; // Clear the table first

    students.forEach((student) => {
      addStudentToTable(student); // Add each approved student to the table
    });
  }

  const logoutButton = document.querySelector(".logout-button");
  logoutButton.addEventListener("click", function () {
    window.location.href = "/index.html"; // Redirect to index.html
  });

  // Function to open the modal
  function openModal() {
    addTeacherModal.classList.add("visible");
  }

  // Function to close the modal
  function closeModal() {
    addTeacherModal.classList.remove("visible");
  }

  // Open Modal
  addTeacherBtn.addEventListener("click", openModal);

  // Close Modal
  closeModalBtn.addEventListener("click", closeModal);

  // Close Modal when clicking outside of it
  window.addEventListener("click", (e) => {
    if (e.target === addTeacherModal) {
      closeModal();
    }
  });

  // Submit Add Teacher Form
  submitTeacherBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Get form inputs
    const form = document.getElementById("add-teacher-form");
    const name = form.querySelector("input[placeholder='Name']").value;
    const subject = form.querySelector("input[placeholder='Subject']").value;
    const age = form.querySelector("input[placeholder='Age']").value;
    const contact = form.querySelector(
      "input[placeholder='Contact Number']"
    ).value;
    const email = form.querySelector("input[placeholder='Email']").value;
    const password = form.querySelector("input[placeholder='Password']").value;
    const verifyPassword = form.querySelector(
      "input[placeholder='Verify Password']"
    ).value;

    // Basic validation
    if (
      !name ||
      !subject ||
      !age ||
      !contact ||
      !email ||
      !password ||
      !verifyPassword
    ) {
      alert("Please fill in all fields!");
      return;
    }

    // Check if password and verify password match
    if (password !== verifyPassword) {
      alert("Invalid Password: Passwords do not match!");
      return;
    }

    // Creating the teacher in the database
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await signOut(auth);
      // alert("You have been signed out. You can log in later.");

      // User successfully created and authenticated
      alert("Teacher added successfully!");
      console.log("Teacher created:", user);

      await set(ref(database, "teacher/" + user.uid), {
        id: user.uid,
        name: name,
        subject: subject,
        age: age,
        email: email,
        contact: contact,
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(`Error: ${errorMessage}`);
      console.error("Error Code:", errorCode, "Message:", errorMessage);
    }

    // Add the new teacher to the list
    // const newTeacher = {
    //   id: teachers.length + 1,
    //   name: name,
    //   subject: subject,
    //   age: age,
    //   contact: contact,
    //   email: email,
    // };

    // Fetching teacher
    fetchTeacher();
    // ------------------------------------------

    // Update the teacher count and table
    updateTeachersTable();
    updateTeacherCount();

    // Clear the form and close the modal
    form.reset();
    closeModal();
  });

  // Update Teacher Table
  function updateTeachersTable() {
    // Clear the table
    teachersTableBody.innerHTML = "";

    if (teachers.length === 0) {
      teachersTableBody.appendChild(noTeachersMsg);
    } else {
      noTeachersMsg.remove();

      teachers.forEach((teacher, index) => {
        const row = document.createElement("tr");

        // Table columns
        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${teacher.name}</td>
                    <td>${teacher.subject}</td>
                    <td>${teacher.contact}</td>
                    <td>${teacher.email}</td>
                    <td><button class="delete-btn" data-id="${
                      teacher.id
                    }">Delete</button></td>
                `;

        // Add delete functionality
        row.querySelector(".delete-btn").addEventListener("click", (e) => {
          deleteTeacher(teacher.id);
        });

        // Add the row to the table
        teachersTableBody.appendChild(row);
      });
    }
  }

  // Delete a teacher
  function deleteTeacher(id) {
    teachers = teachers.filter((teacher) => teacher.id !== id);
    updateTeachersTable();
    updateTeacherCount();
  }

  // Update Teacher Count in Status Section
  function updateTeacherCount() {
    teacherCountElement.innerText = `Total Teachers: ${teachers.length}`;
  }

  // Function to populate the approve/reject section
  // Update the populate function to accept student data
  function populateApproveRejectSection(students) {
    const requestContainer = document.getElementById("request-container");
    requestContainer.innerHTML = ""; // Clear existing content

    students.forEach((student) => {
      const requestCard = document.createElement("div");
      requestCard.className = "request-card";
      requestCard.innerHTML = `
        <img src="/images/studentImage.jpg" alt="${student.name}" style="width: 80%; margin-bottom: 10px;">
        <h3>${student.name}</h3>
        <p>Department: ${student.department}</p>
        <p>Age: ${student.age}</p>
        <p>Email: ${student.email}</p>
        <div class="button-container">
            <button class="approve-btn" data-id="${student.id}" style="background-color: green; color: white; width: 40%; border: none; border-radius: 4px; cursor: pointer;">Approve</button>
            <button class="reject-btn" data-id="${student.id}" style="background-color: red; color: white; width: 40%; border: none; border-radius: 4px; cursor: pointer;">Reject</button>
        </div>
      `;

      // Add event listeners for approve/reject buttons
      requestCard
        .querySelector(".approve-btn")
        .addEventListener("click", async () => {
          alert(`Approved: ${student.name}`);
          addStudentToTable(student);

          await update(ref(database, "students/" + student.id), {
            approved: true,
          }),
            requestCard.remove(); // Remove the request card after approving
        });

      requestCard
        .querySelector(".reject-btn")
        .addEventListener("click", async () => {
          alert(`Rejected: ${student.name}`);
          await update(ref(database, "students/" + student.id), {
            approved: false,
          }),

          requestCard.remove(); // Remove the request card after rejecting
        });

      requestContainer.appendChild(requestCard);
    });
  }

  // Add approved student to students table
  function addStudentToTable(student) {
    const studentRow = document.createElement("tr");
    studentRow.innerHTML = `
            <td>${student.name}</td>
            <td>${student.department}</td>
            <td>${student.age}</td>
            <td>${student.email}</td>
            <td><button class="delete-btn" data-id="${student.id}">Delete</button></td>
        `;

    // Add delete functionality for students
    studentRow.querySelector(".delete-btn").addEventListener("click", (e) => {
      deleteStudent(studentRow);
    });

    studentsTableBody.appendChild(studentRow);
    if (studentsTableBody.querySelector("#no-students-msg")) {
      noStudentsMsg.remove();
    }
  }

  // Delete a student
  function deleteStudent(row) {
    row.remove();
    if (studentsTableBody.children.length === 0) {
      studentsTableBody.appendChild(noStudentsMsg);
    }
  }

  // Call the function to populate the section on load
  populateApproveRejectSection();

  // Set timeout to hide the alert box after 3 seconds
  setTimeout(() => {
    const alertBox = document.getElementById("alert-box");
    alertBox.style.display = "none"; // Hides the alert box
  }, 3000);
});
