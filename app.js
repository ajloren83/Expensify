import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { setupAuth } from "./modules/auth.js";
import { setupFirestore } from "./modules/firestore.js";
import { setupUI } from "./modules/ui.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA_t6ezbo_3Gv0qAfIGLCkrf4OWEt50AUQ",
    authDomain: "expense-tracker-fe62d.firebaseapp.com",
    projectId: "expense-tracker-fe62d",
    storageBucket: "expense-tracker-fe62d.appspot.com",
    messagingSenderId: "930569159771",
    appId: "1:930569159771:web:d6955c2dd56c8bfc46ab7e",
    measurementId: "G-MMV46JQ41X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Setup modules
setupAuth(auth);
setupFirestore(db, auth);
setupUI(auth, db);