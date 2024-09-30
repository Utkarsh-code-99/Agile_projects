import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, set, ref, get, child } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDS5YBEUos2Um63Owyl7Mkt50xsFZozXms",
    authDomain: "webapp-735c7.firebaseapp.com",
    projectId: "webapp-735c7",
    storageBucket: "webapp-735c7.appspot.com",
    messagingSenderId: "852126838052",
    appId: "1:852126838052:web:588f80a61f2b762b6517b1"
};

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const auth = getAuth(app);

    const addData = document.getElementById('register');

    // Add event listener for the Register button
    addData.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission

        const role = document.getElementById('role').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const id = document.getElementById('id').value;
        const password = document.getElementById('password').value;

        // Input validation to ensure no fields are empty
        if (!role || !name || !email || !id || !password) {
            alert("All fields are required. Please fill in all fields.");
            return;  // Stop execution if any field is empty
        }

        // Determine the path in the database based on the selected role
        let userRolePath = '';
        if (role === 'student') {
            userRolePath = 'students/';
        } else if (role === 'teacher') {
            userRolePath = 'teachers/';
        } else if (role === 'admin') {
            userRolePath = 'admins/';
        }

        // Check if the ID or email already exists in the database
        const dbRef = ref(db);

        get(child(dbRef, userRolePath)).then((snapshot) => {
            let dataExists = false;

            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    if (childData.id === id) {
                        alert("This ID is already registered.");
                        dataExists = true;
                    }
                    if (childData.email === email) {
                        alert("This email is already registered.");
                        dataExists = true;
                    }
                });
            }

            // If ID or email already exists, stop the registration process
            if (dataExists) {
                return;
            }

            // Proceed with Firebase Authentication
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up
                    const user = userCredential.user;

                    // Save user data to the database
                    return set(ref(db, userRolePath + id), {
                        role: role,
                        name: name,
                        email: email,
                        id: id,
                        password: password
                    });
                })
                .then(() => {
                    // Data saved successfully
                    console.log("Data saved successfully!");
                    // Redirect to login.html after successful registration
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    // Handle errors here
                    console.error("Error:", error.message);
                });
        }).catch((error) => {
            console.error("Error checking for existing data:", error);
        });
    });
});



