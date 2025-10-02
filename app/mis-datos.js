import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

let userUID;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userUID = user.uid;
    document.getElementById("uid-value").dataset.original = userUID;
    document.getElementById("correo").textContent = user.email;

    try {
      const docRef = doc(db, "usuarios", userUID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById("nombre").value = data.nombre ?? "";
        document.getElementById("monto").value = data.monto ?? "";
        document.getElementById("pin").value = data.pin ?? "";
      }
    } catch (e) {
      mostrarModal("Error obteniendo datos");
    }
  }
});

window.toggleVisibility = (id, iconId) => {
  const span = document.getElementById(id);
  const icon = document.getElementById(iconId);
  const isHidden = span.dataset.hidden === "true";
  if (isHidden) {
    span.textContent = span.dataset.original;
    span.dataset.hidden = "false";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  } else {
    span.textContent = "••••••••";
    span.dataset.hidden = "true";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  }
};

window.toggleVisibilityInput = (inputId, iconId) => {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (input.type === "text") {
    input.type = "password";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    input.type = "text";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
};

// Editar solo nombre y monto (no el PIN)
window.activarEdicion = () => {
  ["nombre", "monto"].forEach(id => {
    document.getElementById(id).disabled = false;
  });
  document.getElementById("guardarBtn").style.display = "inline-block";
};

// Guardar cambios sin modificar el PIN
window.guardarCambios = async () => {
  const nombre = document.getElementById("nombre").value.trim();
  const monto = parseFloat(document.getElementById("monto").value);

  try {
    await updateDoc(doc(db, "usuarios", userUID), {
      nombre,
      monto
    });
    mostrarModal("Datos actualizados correctamente.");

    ["nombre", "monto"].forEach(id => {
      document.getElementById(id).disabled = true;
    });
    document.getElementById("guardarBtn").style.display = "none";
  } catch (e) {
    mostrarModal("Error al guardar: " + e.message);
  }
};

window.mostrarModal = (mensaje) => {
  document.getElementById("modal-message").textContent = mensaje;
  document.getElementById("modal").style.display = "flex";
  setTimeout(() => cerrarModal(), 3000);
};

window.cerrarModal = () => {
  document.getElementById("modal").style.display = "none";
};