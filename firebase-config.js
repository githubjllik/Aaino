// Créez un fichier firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyDnpaBwnUxvvTqYF3ty25inpQ6jsnnpJTo",
  authDomain: "aaino-1f3ef.firebaseapp.com",
  projectId: "aaino-1f3ef",
  storageBucket: "aaino-1f3ef.firebasestorage.app",
  messagingSenderId: "596001004835",
  appId: "1:596001004835:web:cafc3fca3820158d48c096"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
