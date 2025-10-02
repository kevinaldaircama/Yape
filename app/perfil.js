// Importar Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBHbUTYykUxlJWl6QF6L9YwhC5kNFKpwV0",
  authDomain: "apps-d075e.firebaseapp.com",
  databaseURL: "https://apps-d075e-default-rtdb.firebaseio.com",
  projectId: "apps-d075e",
  storageBucket: "apps-d075e.firebasestorage.app",
  messagingSenderId: "813273124209",
  appId: "1:813273124209:web:81030c787f0992b19e7ad0",
  measurementId: "G-6DK205T44V"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Verificar si hay usuario logueado
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login";
  }
});

// Cerrar sesión
window.cerrarSesion = function () {
  signOut(auth).then(() => {
    alert("Sesión cerrada.");
    window.location.href = "/";
  });
};