import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";  
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";  
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";  

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
const db = getFirestore(app);
const auth = getAuth(app);

const input = document.getElementById("clave");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const keypad = document.getElementById("keypad");

function updateDots() {
  const length = input.value.length;
  for (let i = 1; i <= 6; i++) {
    const dot = document.getElementById("dot" + i);
    dot.classList.remove("active");
    if (i <= length) dot.classList.add("active");
  }
}

function addNumber(num) {
  if (input.value.length < 6) {
    input.value += num;
    updateDots();
    if (input.value.length === 6) {
      autenticarPIN(input.value);
    }
  }
}

function deleteNumber() {
  input.value = input.value.slice(0, -1);
  updateDots();
}

async function autenticarPIN(pinIngresado) {
  modal.style.display = "flex";
  modalContent.innerHTML = `<div class="loader"></div>Verificando...`;

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      modalContent.innerHTML = "⚠️ No has iniciado sesión";
      setTimeout(() => window.location.href = "/", 2000);
      return;
    }

    try {
      const usuarioRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(usuarioRef);

      if (!docSnap.exists()) {
        modalContent.innerHTML = "❌ Usuario no encontrado";
        setTimeout(() => modal.style.display = "none", 1500);
        return;
      }

      const datos = docSnap.data();

      if (pinIngresado === datos.pin) {
        localStorage.setItem("nombreUsuario", datos.nombre);
        localStorage.setItem("saldoUsuario", datos.monto);
        window.location.href = "home";
      } else {
        modalContent.innerHTML = "❌ Clave incorrecta. Después de 3 intentos se bloqueará el acceso.";
        setTimeout(() => {
          modal.style.display = "none";
          input.value = "";
          updateDots();
        }, 1500);
      }
    } catch (e) {
      modalContent.innerHTML = "⚠️ Error de conexión";
      setTimeout(() => modal.style.display = "none", 1500);
    }
  });
}

function generateKeypad() {
  keypad.innerHTML = "";
  const layout = [1,2,3,4,5,6,7,8,9,"huella",0,"del"];

  layout.forEach(item => {
    const btn = document.createElement("button");
    if (typeof item === "number") {
      btn.textContent = item;
      btn.onclick = () => addNumber(item);
    } else if (item === "huella") {
      btn.innerHTML = '<i class="fas fa-fingerprint fingerprint"></i>';
      btn.onclick = () => {
        if (window.PublicKeyCredential) {
          alert("Autenticación biométrica disponible");
        } else {
          alert("Tu dispositivo no soporta biometría");
        }
      };
    } else if (item === "del") {
      btn.innerHTML = '<i class="fas fa-delete-left"></i>';
      btn.onclick = deleteNumber;
    }
    keypad.appendChild(btn);
  });
}
generateKeypad();