// Configuración Firebase
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

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();
const realtimeDB = firebase.database();

// Elementos
const montoInput = document.getElementById('monto');
const mensaje = document.getElementById('mensaje');
const btnBancos = document.getElementById('btn-bancos');
const btnYapear = document.getElementById('btn-yapear');
const errorMonto = document.getElementById('errorMonto');
const nombreLabel = document.getElementById('nombre-label');
const numeroLabel = document.getElementById('numero-label');

// Parámetros URL
const urlParams = new URLSearchParams(window.location.search);
const apodo = urlParams.get("apodo");

// Modal
function cerrarModalSaldo() {
  document.getElementById("modalSaldo").style.display = "none";
}
function mostrarModalSaldo() {
  document.getElementById("modalSaldo").style.display = "block";
}

// Autocompletar datos desde Firebase
if (apodo) {
  realtimeDB.ref("contactos/" + apodo).once("value").then(snapshot => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      nombreLabel.textContent = data.nombre || apodo;
      numeroLabel.textContent = data.numero || "";
    }
  });
}

// Validaciones
montoInput.addEventListener('focus', () => {
  if (montoInput.value === "0") montoInput.value = "";
});

montoInput.addEventListener('input', () => {
  const valor = parseFloat(montoInput.value);
  const valido = !isNaN(valor) && valor > 0;
  errorMonto.style.display = valido ? "none" : "block";
  btnBancos.disabled = !valido;
  btnYapear.disabled = !valido;
});

// Acción "Otros Bancos"
btnBancos.addEventListener('click', () => {
  window.location.href = "https://www.google.com"; // 👈 cambia por tu link
});

// Acción Yapear
btnYapear.addEventListener('click', () => {
  const nombreVal = nombreLabel.textContent.trim();
  const montoVal = parseFloat(montoInput.value.trim());
  const mensajeVal = mensaje.value.trim();
  const telefonoVal = numeroLabel.textContent.trim();

  if (!nombreVal || isNaN(montoVal)) return;

  const user = auth.currentUser;
  if (!user) {
    alert("No hay usuario autenticado");
    return;
  }

  const uid = user.uid;
  const userDoc = firestore.collection("usuarios").doc(uid);

  userDoc.get().then(doc => {
    if (!doc.exists) {
      mostrarModalSaldo();
      return;
    }

    const data = doc.data();
    const saldoActual = parseFloat(data.monto);

    if (isNaN(saldoActual) || saldoActual < montoVal) {
      mostrarModalSaldo();
      return;
    }

    userDoc.update({
      monto: (saldoActual - montoVal).toFixed(2)
    }).then(() => {
      firestore.collection("movimientos").add({
        uid: uid,
        nombreDestino: nombreVal,
        monto: montoVal,
        mensaje: mensajeVal,
        fecha: firebase.firestore.Timestamp.now()
      }).then(() => {
        const url = `comprobante.html?nombre=${encodeURIComponent(nombreVal)}&telefono=${encodeURIComponent(telefonoVal)}&monto=${montoVal}`;
        window.location.href = url;
      });
    });
  });
});