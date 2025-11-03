// 🔥 Configuración de Firebase
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
const db = firebase.database();

function mostrarModal(titulo, mensaje) {
  document.getElementById("modal-titulo").innerText = titulo;
  document.getElementById("modal-mensaje").innerText = mensaje;
  document.getElementById("modal").style.display = "block";
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none";
}

function guardarContacto() {
  const apodo = document.getElementById("apodo").value.trim() || 'sin_apodo_' + Date.now();
  const nombre = document.getElementById("nombre").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const destino = document.getElementById("destino").value.trim() || "Sin destino";

  if (!nombre || !numero) {
    mostrarModal("Campos obligatorios", "Por favor, llena el nombre y número telefónico.");
    return;
  }

  db.ref("contactos/" + apodo).set({
    nombre: nombre,
    numero: numero,
    destino: destino
  })
  .then(() => {
    mostrarModal("Contacto guardado", "Contacto guardado con éxito. 😎");
  })
  .catch(error => {
    mostrarModal("Error", "No se pudo guardar: " + error.message);
  });
}

function eliminarContacto() {
  const apodo = document.getElementById("apodo").value.trim();
  if (!apodo) {
    mostrarModal("Falta apodo", "Para eliminar un contacto, escribe su apodo.");
    return;
  }

  const ref = db.ref("contactos/" + apodo);
  ref.get().then(snapshot => {
    if (snapshot.exists()) {
      ref.remove()
      .then(() => {
        mostrarModal("Eliminado", "Contacto eliminado correctamente.");
      });
    } else {
      mostrarModal("No existe", "No existe un contacto con ese apodo.");
    }
  }).catch(err => {
    mostrarModal("Error", err.message);
  });
}
