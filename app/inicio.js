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
const db = firebase.firestore();  

// 🔑 Redirigir si ya hay sesión activa
auth.onAuthStateChanged(user => {
  if (user) {
    window.location.href = "login";
  }
});

async function iniciarSesion() {  
  const correo = document.getElementById('correo').value;  
  const clave = document.getElementById('clave').value;  
  const mensaje = document.getElementById('mensaje');  

  mensaje.innerText = "🔄 Verificando...";  

  try {  
    const credenciales = await auth.signInWithEmailAndPassword(correo, clave);  
    const uid = credenciales.user.uid;  
    const doc = await db.collection("usuarios").doc(uid).get();  

    if (doc.exists) {  
      const usuario = doc.data();  
      localStorage.setItem("nombreUsuario", usuario.nombre);  
      localStorage.setItem("saldoUsuario", usuario.monto);  
      window.location.href = "login";  
    } else {  
      mensaje.innerText = "⚠️ Usuario no encontrado. Solicite una cuenta.";  
    }  
  } catch (error) {  
    mensaje.innerText = `❌ Error: ${error.message}`;  
  }  
}