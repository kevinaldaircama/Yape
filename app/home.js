import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";    
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";    
import { getFirestore, doc, getDoc, collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";    

// 🔧 Configuración Firebase
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
const auth = getAuth(app);    
const db = getFirestore(app);    

const userLink = document.getElementById("userLink");    
const saldoValor = document.getElementById("saldo-valor");    

// 🔑 Detectar usuario logueado
onAuthStateChanged(auth, async (user) => {    
  if (user) {    
    const ref = doc(db, "usuarios", user.uid);    
    const docSnap = await getDoc(ref);    
    if (docSnap.exists()) {    
      const datos = docSnap.data();    
      userLink.innerHTML = `<i class="fas fa-user"></i> Hola, ${datos.nombre}`;    
      saldoValor.textContent = `S/ ${datos.monto}`;    
      cargarMovimientos(user.uid);    
    }    
  } else {    
    window.location.href = "/";    
  }    
});    

// 👁️ Mostrar/ocultar saldo
window.mostrarSaldo = function() {    
  const saldo = document.getElementById("saldo-valor");    
  saldo.style.opacity = (saldo.style.opacity === "0") ? "1" : "0";    
}    

// 📂 Mostrar/Ocultar dropdown
window.toggleDropdown = function() {    
  const dropdown = document.getElementById("dropdown");    
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";    
}    

// 📊 Movimientos
async function cargarMovimientos(uid) {    
  const movimientosRef = collection(db, "movimientos");    
  const q = query(movimientosRef, where("uid", "==", uid), orderBy("fecha", "desc"));    
  const snapshot = await getDocs(q);    
  const contenedor = document.getElementById("movimientos-container");    
  let html = "";    

  if (snapshot.empty) {    
    html = `<div style='text-align:center; color:#888;'>No tienes movimientos aún.</div>`;    
  } else {    
    snapshot.forEach(doc => {    
      const mov = doc.data();    
      const nombre = mov.nombreDestino || "*** *** ***";    
      const monto = parseFloat(mov.monto).toFixed(2);    
      let fechaTexto = 'Fecha desconocida';    
      let horaTexto = '';    

      if (mov.fecha && typeof mov.fecha.toDate === 'function') {    
        const fecha = mov.fecha.toDate();    
        fechaTexto = fecha.toLocaleDateString("es-PE", { year: "numeric", month: "short", day: "numeric" });    
        horaTexto = fecha.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });    
      }    

      html += `    
        <div class="movimiento">    
          <strong>${nombre}</strong>    
          <span class="monto">- S/ ${monto}</span>    
          <br><small>${fechaTexto} ${horaTexto}</small>    
        </div>`;    
    });    
    html += `<div style='text-align:center; color:var(--verde); font-weight:bold; margin-top:10px;'>VER TODOS</div>`;    
  }    

  contenedor.innerHTML = html;    
}    

// 🎠 Carousel
let currentSlide = 0;    
const slideContainer = document.getElementById("slide-container");    
const totalSlides = slideContainer.children.length;    
const dots = document.querySelectorAll(".dot");    

setInterval(() => {    
  currentSlide = (currentSlide + 1) % totalSlides;    
  slideContainer.style.transform = `translateX(-${currentSlide * 100}%)`;    
  dots.forEach((dot, index) => dot.classList.toggle("active", index === currentSlide));    
}, 5000);