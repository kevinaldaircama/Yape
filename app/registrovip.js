// Configuración Firebase  
const firebaseConfig = {  
  apiKey: "AIzaSyBHbUTYykUxlJWl6QF6L9YwhC5kNFKpwV0",
  authDomain: "apps-d075e.firebaseapp.com",
  databaseURL: "https://apps-d075e-default-rtdb.firebaseio.com",
  projectId: "apps-d075e",
  storageBucket: "apps-d075e.appspot.com",
  messagingSenderId: "813273124209",
  appId: "1:813273124209:web:81030c787f0992b19e7ad0",
  measurementId: "G-6DK205T44V"
};  

firebase.initializeApp(firebaseConfig);  
const auth = firebase.auth();  
const db = firebase.firestore();  

function registrarUsuario() {  
  const usuario = document.getElementById('usuario');  
  const correo = document.getElementById('correo');  
  const clave = document.getElementById('clave');  
  const monto = document.getElementById('monto');  
  const pin = document.getElementById('pin');  

  // Reset errores  
  [usuario, correo, clave, monto, pin].forEach(el => el.classList.remove("error"));  

  // Validación  
  if (!usuario.value || !correo.value || !clave.value || !monto.value || !pin.value || pin.value.length !== 6) {  
    [usuario, correo, clave, monto, pin].forEach(el => {  
      if (!el.value || (el.id === "pin" && el.value.length !== 6)) el.classList.add("error");  
    });  
    return;  
  }  

  const modal = document.getElementById("modal");  
  const modalContent = document.getElementById("modal-content");  
  modal.style.display = "flex";  
  modalContent.innerHTML = "⏳ Registrando, espere un momento...";  

  auth.createUserWithEmailAndPassword(correo.value, clave.value)  
    .then(userCredential => {  
      const user = userCredential.user;  
      return db.collection("usuarios").doc(user.uid).set({  
        nombre: usuario.value,  
        correo: correo.value,  
        monto: parseFloat(monto.value).toFixed(2),  
        pin: pin.value,  
        fechaRegistro: new Date().toISOString()  
      });  
    })  
    .then(() => {  
      modalContent.innerHTML = "🎉 <b>¡Felicidades!</b><br>Tu cuenta fue creada con éxito.";  
      setTimeout(() => {  
        window.location.href = "index.html";  
      }, 2500);  
    })  
    .catch(error => {  
      modalContent.innerHTML = `<p style='color:red'>⚠️ Error: ${error.message}</p>`;  
    });  
}