import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// 🔹 Configuración de Firebase
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
const db = getFirestore(app);

const form = document.getElementById("pinForm");
const message = document.getElementById("message");

let userUID = null;
let currentPin = null;

// 🔹 Obtener usuario y su PIN actual
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userUID = user.uid;
    const docRef = doc(db, "usuarios", userUID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      currentPin = docSnap.data().pin;
    }
  } else {
    message.textContent = "Debes iniciar sesión.";
    message.className = "error";
  }
});

// 🔹 Evento de formulario
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const oldPin = document.getElementById("oldPin").value.trim();
  const newPin = document.getElementById("newPin").value.trim();
  const confirmPin = document.getElementById("confirmPin").value.trim();

  // Validaciones
  if (oldPin !== currentPin) {
    showError("El PIN actual no es correcto.");
    return;
  }

  if (newPin.length < 4 || newPin.length > 6) {
    showError("El nuevo PIN debe tener entre 4 y 6 dígitos.");
    return;
  }

  if (newPin === oldPin) {
    showError("El nuevo PIN no puede ser igual al actual.");
    return;
  }

  if (newPin !== confirmPin) {
    showError("El nuevo PIN y la confirmación no coinciden.");
    return;
  }

  if (/^\d{7,}$/.test(newPin)) {
    showError("El PIN no puede parecerse a un número telefónico.");
    return;
  }

  if (/^(\d)\1+$/.test(newPin)) {
    showError("El PIN no puede tener todos los dígitos iguales.");
    return;
  }

  // ✅ Guardar en Firebase
  try {
    await updateDoc(doc(db, "usuarios", userUID), { pin: newPin });
    window.location.href = "exito.html"; // Redirige si todo salió bien
  } catch (error) {
    showError("Error al guardar el PIN: " + error.message);
  }
});

// Función helper para mostrar errores
function showError(text) {
  message.textContent = text;
  message.className = "error";
}