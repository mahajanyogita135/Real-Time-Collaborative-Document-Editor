// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { getAuth, signInAnonymously, signOut } from 'firebase/auth';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// DOM Elements
const editor = document.getElementById('editor');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const authStatus = document.getElementById('auth-status');

// Login / Logout logic
loginBtn.addEventListener('click', () => {
    signInAnonymously(auth)
        .then(() => {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            authStatus.textContent = 'Logged in as anonymous user';
        })
        .catch((error) => {
            console.error(error);
        });
});

logoutBtn.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            authStatus.textContent = '';
        })
        .catch((error) => {
            console.error(error);
        });
});

// Real-Time Database Updates
const documentId = 'document_1'; // Unique document identifier
const documentRef = ref(db, 'documents/' + documentId);

// Synchronize document content
onValue(documentRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        editor.innerHTML = data.content;  // Update the editor with real-time content
    }
});

// Update document content in real-time
editor.addEventListener('input', () => {
    const content = editor.innerHTML;
    set(documentRef, {
        content: content,
        lastUpdated: Date.now(),
    });
});
