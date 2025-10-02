// Ejemplo: Podrías agregar eventos de click dinámicos si quieres
document.querySelectorAll('.btn-comprar').forEach(btn=>{
    btn.addEventListener('click', e=>{
        // Aquí podrías enviar eventos a Google Analytics o mostrar confirmación
        console.log("Se hizo click en comprar:", e.target.closest('.plan').querySelector('h2').innerText);
    });
});