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

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const contactList = document.querySelector(".contact-list");

// Renderizar contactos
function renderizarContactos(datos) {
  contactList.innerHTML = "";

  if (!datos || Object.keys(datos).length === 0) {
    contactList.innerHTML = `
      <div class="contact">
        <div class="contact-name">No tienes contactos hasta el momento.</div>
      </div>
    `;
    return;
  }

  Object.entries(datos).forEach(([apodo, contacto]) => {
    const nombre = contacto.nombre?.trim();
    const numero = contacto.numero?.trim();

    if (!numero) return;

    let mostrarNombre = (!apodo.startsWith("sin_apodo_") && apodo !== nombre)
      ? apodo
      : nombre || "Sin nombre";

    contactList.innerHTML += `
      <div class="contact" onclick="window.location.href='envio.html?apodo=${encodeURIComponent(apodo)}'">
        <div class="contact-name">${mostrarNombre}</div>
        <div class="contact-number">${numero}</div>
      </div>
    `;
  });
}

// Escuchar cambios en la BD
db.ref("contactos").on("value", snapshot => {
  const datos = snapshot.val();
  renderizarContactos(datos);
});