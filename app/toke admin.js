import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
const db = getDatabase(app);

let lastMessage = "";

// Generar token
function generateToken() {
  const adminEmail = document.getElementById("adminEmail").value.trim();
  const userEmail = document.getElementById("userEmail").value.trim();
  const userPassword = document.getElementById("userPassword").value.trim();
  const userName = document.getElementById("userName").value.trim();

  if (!adminEmail || !userEmail || !userPassword || !userName) {
    alert("Rellena todos los campos");
    return;
  }

  // Crear un token aleatorio
  const token = Math.random().toString(36).substring(2, 12);

  // Guardar en Firebase
  set(ref(db, "tokens/" + token), {
    userEmail,
    userPassword,
    userName,
    used: false,
    createdBy: adminEmail,
    createdAt: Date.now()
  })
    .then(() => {
      lastMessage = `✅ Token generado con éxito\n\n📧 Correo: ${userEmail}\n🔑 Contraseña: ${userPassword}\n👤 Usuario: ${userName}\n🆔 Token: ${token}`;
      document.getElementById("tokenOutput").textContent = lastMessage;
    })
    .catch(err => alert("Error al generar token: " + err));
}

// Copiar mensaje al portapapeles
function copyMessage() {
  if (!lastMessage) return;
  navigator.clipboard
    .writeText(lastMessage)
    .then(() => alert("Mensaje copiado al portapapeles ✅"))
    .catch(err => alert("Error al copiar: " + err));
}

// Eventos
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", generateToken);
  document.getElementById("copyBtn").addEventListener("click", copyMessage);
});