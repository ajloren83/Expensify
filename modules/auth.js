import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

export function setupAuth(auth) {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const loginBtn = document.getElementById("login");
    const registerBtn = document.getElementById("register");
    const logoutBtn = document.getElementById("logout");
    const profileEmail = document.getElementById("profile-email");

    loginBtn.addEventListener("click", () => {
        signInWithEmailAndPassword(auth, email.value, password.value)
            .then(() => {
                document.getElementById("tracker").style.display = "block";
                logoutBtn.style.display = "block";
                document.getElementById("auth-section").style.display = "none";
                profileEmail.textContent = email.value;
            })
            .catch(error => alert(error.message));
    });

    registerBtn.addEventListener("click", () => {
        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then(() => alert("User registered!"))
            .catch(error => alert(error.message));
    });

    logoutBtn.addEventListener("click", () => {
        signOut(auth).then(() => {
            document.getElementById("tracker").style.display = "none";
            logoutBtn.style.display = "none";
            document.getElementById("auth-section").style.display = "block";
            profileEmail.textContent = "";
        });
    });
}