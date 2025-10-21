// =====================================================
// 🔥 CONFIGURACIÓN DE FIREBASE
// =====================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =====================================================
// 🔑 FUNCIÓN DE VERIFICACIÓN DE TOKEN
// =====================================================
window.checkToken = function() {
  const token = document.getElementById("token").value.trim();
  if (!token) {
    alert("Introduce un token");
    return;
  }

  const tokenRef = ref(db, "tokens/" + token);
  get(tokenRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.used) {
          alert("Este token ya fue usado");
        } else {
          update(tokenRef, { used: true }).then(() => {
            localStorage.setItem("tokenUsed", token);
            alert(`¡Bienvenido ${data.userName}! Redirigiendo...`);
            window.location.href = "login";
          });
        }
      } else {
        alert("Token inválido");
      }
    })
    .catch((err) => alert("Error al verificar token: " + err));
};

// 🚪 Redirigir si ya está logueado
window.onload = function() {
  if (localStorage.getItem("tokenUsed")) {
    window.location.href = "login";
  }
};

// =====================================================
// 🔔 NOTIFICACIONES PUSH CON ONESIGNAL
// =====================================================
window.OneSignalDeferred = window.OneSignalDeferred || [];
OneSignalDeferred.push(async function(OneSignal) {
  await OneSignal.init({
    appId: "1226490d-9cc3-4de0-b189-b627eab1a1ac",
    safari_web_id: "web.onesignal.auto.1a908d8f-b1c2-454b-a8c2-6bb9d82d2555",
    notifyButton: {
      enable: true, // Muestra la campanita
    },
  });
  console.log("✅ OneSignal listo y funcionando");
});
