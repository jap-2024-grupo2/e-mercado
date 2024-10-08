// Función para cerrar la sesión
function cerrarSesion() {
    // Eliminamos la sesión del usuario autenticado
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('password');
    // Redirigimos al usuario a login.html
    window.location.href = 'login.html';
  }