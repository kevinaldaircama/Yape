// Tomar parámetros de la URL
const params = new URLSearchParams(window.location.search);
document.getElementById("empresa").textContent = params.get("empresa");
document.getElementById("servicio").textContent = params.get("servicio");
document.getElementById("codigo").textContent = params.get("codigo");
document.getElementById("titular").textContent = params.get("titular");
document.getElementById("monto").textContent = params.get("monto");

// Fecha y hora
function actualizarFechaHora(){
  const ahora = new Date();
  const opciones = { day:"2-digit", month:"short", year:"numeric" };
  const fecha = ahora.toLocaleDateString("es-PE", opciones).replace(".", "");
  let horas = ahora.getHours();
  let minutos = ahora.getMinutes().toString().padStart(2,"0");
  let sufijo = horas >= 12 ? "pm" : "am";
  if(horas > 12) horas -= 12;
  if(horas === 0) horas = 12;
  document.getElementById("fechaHora").textContent = `${fecha} - ${horas}:${minutos} ${sufijo}`;
}

// Número aleatorio de operación
function generarOperacion(){
  const numero = Math.floor(10000000 + Math.random() * 90000000);
  document.getElementById("operacion").textContent = numero;
}

actualizarFechaHora();
generarOperacion();