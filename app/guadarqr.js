let lista = [];

function guardarQR() {
  const codigo = document.getElementById("codigoQR").value.trim();
  const nombre = document.getElementById("nombreQR").value.trim();
  const destino = document.getElementById("destinoQR").value.trim();
  const archivo = document.getElementById("fotoQR").files[0];

  if (!codigo || !nombre || !archivo) {
    alert("⚠️ Completa todos los campos y sube una imagen.");
    return;
  }

  const lector = new FileReader();
  lector.onload = function(e) {
    const imagenBase64 = e.target.result;
    const qr = {
      id: Date.now(),
      codigo,
      nombre,
      destino,
      imagen: imagenBase64
    };
    lista.unshift(qr);
    localStorage.setItem("qrLista", JSON.stringify(lista));
    alert("✅ QR guardado correctamente.");
  };
  lector.readAsDataURL(archivo);

  // limpiar campos
  document.getElementById("codigoQR").value = "";
  document.getElementById("nombreQR").value = "";
  document.getElementById("destinoQR").value = "";
  document.getElementById("fotoQR").value = "";
}

window.onload = () => {
  const data = localStorage.getItem("qrLista");
  if (data) lista = JSON.parse(data);
};