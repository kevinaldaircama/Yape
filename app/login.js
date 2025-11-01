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
const dotsContainer = document.getElementById("dots-container");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modal-text");
const btnAceptar = document.getElementById("btnAceptar");
const keypad = document.getElementById("keypad");

function updateDots() {
  const length = input.value.length;
  dotsContainer.style.display = length > 0 ? "flex" : "none";
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
    if (input.value.length === 6) autenticarPIN(input.value);
  }
}

function deleteNumber() {
  input.value = input.value.slice(0, -1);
  updateDots();
}

async function autenticarPIN(pinIngresado) {
  modal.style.display = "flex";
  modalText.textContent = "Verificando...";
  btnAceptar.style.display = "none";

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      modalText.textContent = "⚠️ No has iniciado sesión";
      btnAceptar.style.display = "block";
      return;
    }

    try {
      const usuarioRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(usuarioRef);

      if (!docSnap.exists()) {
        modalText.textContent = "❌ Usuario no encontrado";
        btnAceptar.style.display = "block";
        return;
      }

      const datos = docSnap.data();

      if (pinIngresado === datos.pin) {
        localStorage.setItem("nombreUsuario", datos.nombre);
        localStorage.setItem("saldoUsuario", datos.monto);
        window.location.href = "home";
      } else {
        modalText.textContent = "❌ Clave incorrecta";
        btnAceptar.style.display = "block";
      }
    } catch (e) {
      modalText.textContent = "⚠️ Error de conexión";
      btnAceptar.style.display = "block";
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
      btn.onclick = () => alert("Autenticación biométrica (demo)");
    } else if (item === "del") {
      btn.innerHTML = '<i class="fas fa-delete-left"></i>';
      btn.onclick = deleteNumber;
    }
    keypad.appendChild(btn);
  });
}

generateKeypad();

btnAceptar.addEventListener("click", () => {
  modal.style.display = "none";
  input.value = "";
  updateDots();
});
