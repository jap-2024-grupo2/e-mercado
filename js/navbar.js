document.addEventListener('DOMContentLoaded', function () {
  // Navbar HTML con badge en "Mi carrito"
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark p-2">
      <div class="container">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <div class="d-flex w-100 flex-column flex-lg-row justify-content-between">
            <!-- Logo y nombre de la página como enlace -->
            <div class="mb-2 mb-lg-0" style="transition: transform 0.3s ease; transform: scale(1)"
              onmouseover="this.style.transform='scale(1.025)';" onmouseout="this.style.transform='scale(1)';">
              <a href="index.html" class="d-flex align-items-center text-white text-decoration-none">
                <img src="img/favicon.svg" alt="Logo eMercado" class="navbar-logo" style="height: 25px" />
                <span class="navbar-brand ms-2">eMercado</span>
              </a>
            </div>
            <!-- Menú de navegación -->
            <ul class="navbar-nav d-flex justify-content-end w-100 flex-column flex-lg-row">
              <li class="nav-item mx-md-4">
                <a class="nav-link" href="categories.html">Categorías</a>
              </li>
              <li class="nav-item mx-md-4">
                <a class="nav-link" href="sell.html">Vender</a>
              </li>
              <li class="nav-item dropdown position-relative ms-md-4" dropdown>
                <a class="nav-link dropdown-toggle" href="#" id="userNameDropdown" role="button"
                  data-bs-toggle="dropdown">
                  <span class="userName-navBar navbar-text m-0 text-white"></span>
                </a>
                <div class="dropdown-menu">
                  <a class="dropdown-item d-flex align-items-center" href="cart.html">
                    Mi carrito
                    <span class="badge text-bg-light bg-dark ms-2" id="cart-count-badge">0</span>
                  </a>
                  <a class="dropdown-item" href="my-profile.html">Mi perfil</a>
                  <button class="dropdown-item" onclick="logout()">
                    Cerrar sesión
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  `

  document.querySelectorAll('.navbar-container').forEach((container) => (container.innerHTML = navbarHTML))

  setUserNameInNavBar() // Seteamos el nombre de usuario

  updateCartBadge()     // Actualizamos el badge del carrito
  document.addEventListener('cartUpdated', updateCartBadge) // Escuchamos constantemente para cambios en el carrito
})

// Función para actualizar el badge del carrito con la cantidad total
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || []
  const cartCount = cart.reduce((count, product) => count + (product.quantity || 1), 0)
  document.getElementById('cart-count-badge').textContent = cartCount
}

// Evento para notificar que el carrito fue actualizado
function dispatchCartUpdatedEvent() {
  document.dispatchEvent(new Event('cartUpdated'))
}
