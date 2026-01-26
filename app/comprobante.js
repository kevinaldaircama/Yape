const params = new URLSearchParams(window.location.search);
const nombre = decodeURIComponent(params.get("nombre") || "Sin nombre");
const telefono = decodeURIComponent(params.get("telefono") || "000000000");
const monto = decodeURIComponent(params.get("monto") || "0");

document.getElementById("nombre").textContent = nombre;
document.getElementById("monto").textContent = `S/ ${parseFloat(monto).toFixed(2)}`;
const ultimosDigitos = telefono.slice(-3);
document.getElementById("telefono").textContent = `*** ***${ultimosDigitos}`;

// Fecha y hora
const fechaObj = new Date();
const opcionesFecha = { day: '2-digit', month: 'short', year: 'numeric' };
const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true };
document.querySelector("#fecha span").textContent = fechaObj.toLocaleDateString('es-PE', opcionesFecha);
document.querySelector("#hora span").textContent = fechaObj.toLocaleTimeString('es-PE', opcionesHora);

// Código de seguridad
const codigo = Math.floor(Math.random() * 900 + 100).toString();
const cajas = document.getElementById("codigo-seguridad").children;
for (let i = 0; i < 3; i++) {
  cajas[i].textContent = codigo[i];
}

// Número de operación
document.getElementById("operacion").textContent = Math.floor(10000000 + Math.random() * 90000000);

// Promoción aleatoria
const promociones = [
  "imagen/1.jpg","imagen/2.jpg","imagen/3.jpg","imagen/4.jpg","imagen/IMG-20260125-WA0045.jpg","imagen/IMG-20260118-WA0031.jpg"
];
document.getElementById("promo-img").src = promociones[Math.floor(Math.random() * promociones.length)];

// Compartir comprobante
async function compartir() {
  const imageUrl = "https://i.imgur.com/2SG2kXr.png";
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], "comprobante.png", { type: blob.type });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: "Comprobante Yape",
        text: "Te comparto el comprobante de Yape.",
        files: [file],
      });
    } else {
      alert("Tu navegador no soporta compartir archivos.");
    }
  } catch (err) {
    console.error("Error al compartir:", err);
    alert("Ocurrió un error al intentar compartir.");
  }
}
