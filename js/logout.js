document.addEventListener('DOMContentLoaded', function () {
  // Verificamos si no hay un estado de autenticación activo
  if (!localStorage.getItem('loggedIn')) {
    // Redirigimos al usurio a la página de inicio de sesión
    window.location.href = 'login.html'
  }
})

// Función para cerrar sesión
function logout() {
  // Eliminamos el estado de autenticación
  localStorage.removeItem('loggedIn')

  // Eliminamos las credenciales guardadas
  localStorage.removeItem('userName')
  localStorage.removeItem('password')

  // Redirigimos al usuario a la página de inicio de sesión
  window.location.href = 'login.html'
}
