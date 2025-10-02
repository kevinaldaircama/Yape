// Puedes agregar pequeñas animaciones o efectos interactivos
// Por ejemplo, efecto de parpadeo de texto 404
const numero404 = document.querySelector('h1');
let colors = ['#ffcc00', '#ffdd33', '#ffee66'];
let i = 0;

setInterval(() => {
  numero404.style.color = colors[i % colors.length];
  i++;
}, 800);