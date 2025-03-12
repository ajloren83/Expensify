import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

export function setupAuth(auth) {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const loginBtn = document.getElementById("login");
    const registerBtn = document.getElementById("register");
    const logoutBtn = document.getElementById("logout");
    const logoutProfileBtn = document.getElementById("logout-profile");
    const authSection = document.getElementById("auth-section");
    const tracker = document.getElementById("tracker");
    const profileEmail = document.getElementById("profile-email");

    // Check authentication state on page load
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is logged in
            authSection.style.display = "none";
            tracker.style.display = "block";
            logoutBtn.style.display = "block";
            profileEmail.textContent = user.email; // Set profile email
            loadSalary(); // Load salary
            loadExpenses(); // Load expenses
        } else {
            // User is logged out
            authSection.style.display = "block";
            tracker.style.display = "none";
            logoutBtn.style.display = "none";
            profileEmail.textContent = ""; // Clear profile email
        }
    });

    // Login
    loginBtn.addEventListener("click", () => {
        signInWithEmailAndPassword(auth, email.value, password.value)
            .then(() => {
                alert("Logged in successfully!");
            })
            .catch(error => alert(error.message));
    });

    // Register
    registerBtn.addEventListener("click", () => {
        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then(() => alert("User registered!"))
            .catch(error => alert(error.message));
    });

    // Logout (from navbar)
    logoutBtn.addEventListener("click", () => {
        signOut(auth).then(() => {
            alert("Logged out successfully!");
        });
    });

    // Logout (from profile)
    logoutProfileBtn.addEventListener("click", () => {
        signOut(auth).then(() => {
            alert("Logged out successfully!");
        });
    });
}