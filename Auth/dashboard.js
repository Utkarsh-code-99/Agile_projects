import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDS5YBEUos2Um63Owyl7Mkt50xsFZozXms",
    authDomain: "webapp-735c7.firebaseapp.com",
    projectId: "webapp-735c7",
    storageBucket: "webapp-735c7.appspot.com",
    messagingSenderId: "852126838052",
    appId: "1:852126838052:web:588f80a61f2b762b6517b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Get references to HTML elements
const roleField = document.getElementById('role');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const idField = document.getElementById('id');

// Function to fetch user data based on their role
function fetchUserData(rolePath, email) {
    const dbRef = ref(db, rolePath);
    return get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            let userData = null;
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                if (childData.email === email) {
                    userData = childData;
                }
            });
            if (userData) {
                console.log("User data found in " + rolePath, userData);
            } else {
                console.log("No matching user data found in " + rolePath + " for email: " + email);
            }
            return userData;
        } else {
            console.log("No data available in " + rolePath);
            return null;
        }
    }).catch((error) => {
        console.error("Error fetching user data from " + rolePath, error);
    });
}

// Check if the user is logged in
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const email = user.email;

        // Try to find the user in 'students', 'teachers', or 'admins'
        const roles = ['students', 'teachers', 'admins'];
        let userData = null;

        // Loop through roles and try to find the user data
        for (const role of roles) {
            console.log("Checking in role:", role);
            userData = await fetchUserData(role, email);
            if (userData) {
                // Once the user data is found, populate the dashboard and stop searching
                roleField.textContent = userData.role;
                nameField.textContent = userData.name;
                emailField.textContent = userData.email;
                idField.textContent = userData.id;
                break;
            }
        }

        if (!userData) {
            console.error("No user data found for email:", email);
        }

    } else {
        // If user is not logged in, redirect to the login page
        window.location.href = 'login.html';
    }
});

// Logout function
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        // Sign-out successful, redirect to login
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error("Error during logout:", error);
    });
});
