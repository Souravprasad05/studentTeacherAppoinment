  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
  import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js"
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyASYCkMav_3wjUfumxv0r-39k0_bQWpEVM",
    authDomain: "student-teacher-appointm-865cb.firebaseapp.com",
    databaseURL: "https://student-teacher-appointm-865cb-default-rtdb.firebaseio.com",
    projectId: "student-teacher-appointm-865cb",
    storageBucket: "student-teacher-appointm-865cb.appspot.com",
    messagingSenderId: "105823588818",
    appId: "1:105823588818:web:ea91fe79940d83d712780b",
    measurementId: "G-P2VGFCGF1E"
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);


  
  // Initializing the services
  export const database = getDatabase(app)
  export const auth = getAuth(app);
  export const analytics = getAnalytics(app);
