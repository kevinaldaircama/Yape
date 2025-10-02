const resultElement = document.getElementById("result");
const html5QrCode = new Html5Qrcode("reader");
let currentCameraId = null;
let torchOn = false;

// Inicializar cámara
Html5Qrcode.getCameras().then(cameras => {
  if (!cameras || cameras.length === 0) {
    alert("No se encontró ninguna cámara disponible.");
    return;
  }
  const backCam = cameras.find(c => c.label.toLowerCase().includes("back") || c.label.toLowerCase().includes("environment"));
  currentCameraId = backCam ? backCam.id : cameras[0].id;

  html5QrCode.start(
    currentCameraId,
    { fps: 10, qrbox: { width: 250, height: 250 } },
    qrCodeMessage => handleQRCode(qrCodeMessage),
    err => console.warn("Error de escaneo", err)
  );
}).catch(err => alert("Error al acceder a las cámaras: " + err));

// Subir imagen con QR
document.getElementById("file-input").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  html5QrCode.scanFile(file, true)
    .then(qrCodeMessage => handleQRCode(qrCodeMessage))
    .catch(err => console.warn("Error al leer imagen QR", err));
});

// Función para manejar QR detectado
function handleQRCode(qrCodeMessage) {
  resultElement.innerText = "Código detectado: " + qrCodeMessage;
  html5QrCode.stop();

  const qrLista = JSON.parse(localStorage.getItem("qrLista") || "[]");
  const encontrado = qrLista.find(item => item.codigo === qrCodeMessage);

  if (encontrado) {
    const nombreEncoded = encodeURIComponent(encontrado.nombre);
    const destinoEncoded = encodeURIComponent(encontrado.destino || "");
    window.location.href = `yapear.html?nombre=${nombreEncoded}&destino=${destinoEncoded}`;
  } else {
    alert("Este código no está en tu lista.");
  }
}

// Encender/apagar linterna
function flashToggle() {
  if (!currentCameraId) return alert("Cámara no lista");
  html5QrCode.applyVideoConstraints({
    advanced: [{ torch: !torchOn }]
  }).then(() => torchOn = !torchOn)
    .catch(err => alert("Tu dispositivo o navegador no soporta el modo linterna."));
}