import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

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
    const auth = getAuth(app);

    const loginButton = document.getElementById('login');

    // Add event listener to the login button
    loginButton.addEventListener('click', async function (event) {
        event.preventDefault(); // Prevent form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert("Email and password are required.");
            return;
        }

        try {
            // Firebase authentication for login
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // On successful login
            console.log("User logged in successfully:", user);
            alert("Login successful!");
            window.location.href = 'dashboard.html'; // Redirect to dashboard after login

        } catch (error) {
            console.error("Error during login:", error.message);
            alert("Login failed. Please check your email and password.");
        }
    });
});
