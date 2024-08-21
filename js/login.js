// Obtenemos los elementos de login.html por sus ID
const form = document.getElementById('loginForm')
const userNameInput = document.getElementById('inputUsername')
const passwordInput = document.getElementById('inputPassword')
const loginButton = document.getElementById('btnLogin')
const togglePassword = document.getElementById('togglePassword')

document.addEventListener('DOMContentLoaded', function () {
  // Verificamos si ya hay una sesión activa y redirigimos al usuario si es necesario
  checkActiveSession()

  // Agregamos eventos a los campos de entrada
  addInputEventListeners()

  // Agregamos un evento al enviar el formulario
  form.addEventListener('submit', handleFormSubmit)

  // Agregamos evento para mostrar/ocultar la contraseña
  togglePassword.addEventListener('click', togglePasswordVisibility)
})

// Función para verificar si ya hay una sesión activa
function checkActiveSession() {
  if (localStorage.getItem('loggedIn')) {
    window.location.href = 'index.html'
  }
}

// Función para manejar el envío del formulario
function handleFormSubmit(event) {
  event.preventDefault() // Prevenimos que el formulario se envíe

  const userName = userNameInput.value
  const password = passwordInput.value

  // Obtenemos las credenciales guardadas (si existen)
  const storedUsername = localStorage.getItem('userName')
  const storedPassword = localStorage.getItem('password')

  if (storedUsername && storedPassword) {
    // Verificamos si las credenciales ingresadas coinciden con las guardadas
    if (userName === storedUsername && password === storedPassword) {
      login()
    } else {
      alert('Credenciales incorrectas')
    }
  } else {
    saveCredentialsAndLogin(userName, password)
  }
}

// Función para iniciar sesión
function login() {
  localStorage.setItem('loggedIn', true)
  window.location.href = 'index.html'
}

// Función para guardar las credenciales y luego iniciar sesión
function saveCredentialsAndLogin(username, password) {
  localStorage.setItem('loggedIn', true)
  localStorage.setItem('userName', username)
  localStorage.setItem('password', password)
  window.location.href = 'index.html'
}

// Función para alternar la visibilidad de la contraseña
function togglePasswordVisibility() {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password'

  passwordInput.setAttribute('type', type)

  // Alternamos el icono del ojo
  this.classList.toggle('bi-eye')
  this.classList.toggle('bi-eye-slash')
}

// Función para habilitar o deshabilitar el botón de inicio de sesión
function toggleButtonState() {
  if (userNameInput.value.trim() !== '' && passwordInput.value.trim() !== '') {
    loginButton.disabled = false
  } else {
    loginButton.disabled = true
  }
}

// Función para agregar eventos de entrada a los campos de usuario y contraseña
function addInputEventListeners() {
  userNameInput.addEventListener('input', toggleButtonState)
  passwordInput.addEventListener('input', toggleButtonState)
}
