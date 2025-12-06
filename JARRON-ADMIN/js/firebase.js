const firebaseConfig = {
  apiKey: "AIzaSyALFJibeJOrUEkNlOXF9YoIeqthKAs5u0I",
  authDomain: "jarron-bf774.firebaseapp.com",
  projectId: "jarron-bf774",
  storageBucket: "jarron-bf774.firebasestorage.app",
  messagingSenderId: "985289165126",
  appId: "1:985289165126:web:6537d650160717b1bb7d47"
};

// Initialize Firebase
 const firebaseapp= firebase.initializeApp(firebaseConfig);     
const auth = firebase.auth();
const db = firebase.firestore();    
console.log("Firebase initialized");
console.log("auth:", auth);
console.log("db:", db);