// Inicializamos los valores del formulario al cargar la página
function initializeForm() {
  // Cargamos el nombre de usuario almacenado en localStorage
  const userName = localStorage.getItem('userName')
  if (userName) {
    setInputValue('userName', userName)
  }

  // Cargamos otros datos almacenados, si existen
  setInputValue('firstName', localStorage.getItem('firstName'))
  setInputValue('secondName', localStorage.getItem('secondName'))
  setInputValue('lastName', localStorage.getItem('lastName'))
  setInputValue('secondLastName', localStorage.getItem('secondLastName'))
  setInputValue('email', localStorage.getItem('email'))
  setInputValue('phone', localStorage.getItem('phone'))

  // Cargamos la foto de perfil almacenada en localStorage
  loadProfilePicture()
}

// Establecemos el valor de un campo de entrada
function setInputValue(fieldId, value) {
  document.getElementById(fieldId).value = value || '' // Si no hay valor, establecemos vacío
}

// Función para cargar la foto de perfil desde localStorage
function loadProfilePicture() {
    const storedProfilePic = localStorage.getItem('profilePic')
    const profileImgElement = document.querySelector('.rounded-circle')
  
    if (storedProfilePic) {
      profileImgElement.src = storedProfilePic // Usamos la imagen guardada
    }
  }
  
  // Función para manejar la carga de la imagen de perfil
  function handleProfilePictureChange(event) {
    const file = event.target.files[0]
    
    if (file) {
      const reader = new FileReader()
  
      reader.onloadend = function () {
        const base64String = reader.result
        localStorage.setItem('profilePic', base64String) // Almacenamos la imagen en Base64
        loadProfilePicture() // Actualizamos la vista de la imagen
      }
  
      reader.readAsDataURL(file) // Convertimos la imagen en Base64
    }
  }

// Validamos que los campos obligatorios no estén vacíos
function validateRequiredFields() {
  const requiredFields = ['firstName', 'lastName', 'email']
  let allFieldsValid = true

  requiredFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId)
    if (!field.value.trim()) {
      markFieldInvalid(field)
      allFieldsValid = false
    } else {
      markFieldValid(field)
    }
  })

  return allFieldsValid
}

// Marcamos un campo como inválido (agrega clase de error)
function markFieldInvalid(field) {
  field.classList.add('is-invalid')
}

// Marcamos un campo como válido (elimina clase de error)
function markFieldValid(field) {
  field.classList.remove('is-invalid')
}

// Guardamos los datos del formulario en el localStorage
function saveFormData() {
  localStorage.setItem('firstName', document.getElementById('firstName').value)
  localStorage.setItem('secondName', document.getElementById('secondName').value)
  localStorage.setItem('lastName', document.getElementById('lastName').value)
  localStorage.setItem('secondLastName', document.getElementById('secondLastName').value)
  localStorage.setItem('email', document.getElementById('email').value)
  localStorage.setItem('phone', document.getElementById('phone').value)
}

// Manejador del evento de envío del formulario
function handleFormSubmit(event) {
  event.preventDefault() // Evitamos el comportamiento por defecto de envío

  if (validateRequiredFields()) {
    saveFormData()
    alert('✅ Los datos han sido guardados correctamente.')
  } else {
    alert('❌ Por favor, complete todos los campos obligatorios (*).')
  }
}

// Configuramos el evento para cuando se envía el formulario
function setupFormSubmitHandler() {
  document.getElementById('profile-form').addEventListener('submit', handleFormSubmit)
}

// Inicializamos todo cuando la página se carga
function initialize() {
  initializeForm()
  setupFormSubmitHandler()

  // Configuramos el evento para la subida de la foto de perfil
  document.getElementById('profilePic').addEventListener('change', handleProfilePictureChange)
}

// Ejecutamos la inicialización cuando la página está lista
window.addEventListener('DOMContentLoaded', initialize)

// Función para aplicar el Modo Noche o Modo Día basado en la preferencia almacenada
function applyThemePreference() {
  const darkModeEnabled = localStorage.getItem('darkMode') === 'true'
  const themeSwitch = document.getElementById('themeSwitch')
  if (darkModeEnabled) {
    document.body.classList.add('dark-mode')
    themeSwitch.checked = true // El switch se coloca en el estado "Noche"
  } else {
    document.body.classList.remove('dark-mode')
    themeSwitch.checked = false // El switch se coloca en el estado "Día"
  }
}

// Función para alternar entre Modo Noche y Modo Día
function toggleTheme() {
  const isDarkMode = document.body.classList.toggle('dark-mode')
  localStorage.setItem('darkMode', isDarkMode) // Guardamos la preferencia en localStorage
}

// Configuramos el evento del switch para alternar entre Modo Noche/Día
function setupThemeSwitch() {
  const themeSwitch = document.getElementById('themeSwitch')
  themeSwitch.addEventListener('change', toggleTheme)
}

// Inicializamos la funcionalidad de Modo Noche/Día al cargar la página
window.addEventListener('DOMContentLoaded', function () {
  applyThemePreference() // Aplicamos el tema al cargar la página
  setupThemeSwitch() // Configuramos el switch
})
