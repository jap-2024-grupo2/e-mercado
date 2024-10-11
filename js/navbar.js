document.addEventListener('DOMContentLoaded', function () {
  // Definimos el HTML del navbar como un string
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark p-1">
      <div class="container">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav w-100 justify-content-between">
            <li class="nav-item">
              <a class="nav-link" href="index.html">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="categories.html">Categorías</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="sell.html">Vender</a>
            </li>
            <li class="nav-item dropdown position-relative" dropdown>
              <a class="nav-link dropdown-toggle" href="#" id="userNameDropdown" role="button" data-bs-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                <span class="userName-navBar navbar-text m-0 text-white"></span>
              </a>
              <div class="dropdown-menu" aria-labelledby="userNameDropdown">
                <a class="dropdown-item" href="cart.html">Mi carrito</a>
                <a class="dropdown-item" href="my-profile.html">Mi perfil</a>
                <button class="dropdown-item" onclick="logout()">Cerrar sesión</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `

  // Encontramos todos los divs con la clase "navbar-container"
  const navbarContainers = document.querySelectorAll('.navbar-container')

  // Insertamos el HTML del navbar en cada div encontrado
  navbarContainers.forEach((container) => {
    container.innerHTML = navbarHTML
  })

  // Llamamos a la función (en init.js) para establecer el nombre de usuario en el navbar
  setUserNameInNavBar()
})
