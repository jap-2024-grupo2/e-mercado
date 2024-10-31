document.addEventListener("DOMContentLoaded", function(){
    const footerHTML = `
      <footer class="text-muted">
    <div class="container">
      <p class="float-end">
        <a href="#">Volver arriba</a>
      </p>
      <p>Este sitio forma parte de <a href="https://jovenesaprogramar.edu.uy/" target="_blank">Jovenes a Programar</a></p>
    </div>
  </footer>
    `

    document.querySelectorAll(".footer-container").forEach((container) => (container.innerHTML = footerHTML))
})