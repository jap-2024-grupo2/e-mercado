document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("loginForm")
    const userNameInput = document.getElementById("inputUsername")
    const passwordInput = document.getElementById("inputPassword")
    const loginButton = document.getElementById("btnLogin")
    const togglePassword = document.getElementById("togglePassword")
    
    checkActiveSession()

    addInputEventListeners()
    
    form.addEventListener("submit", handleFormSubmit)

    togglePassword.addEventListener("click", togglePasswordVisibility)

    function checkActiveSession() {
        if (sessionStorage.getItem("loggedIn")){
            window.location.href = "index.html"
        }
    }

    // Función para manejar el envío del formulario 
    function handleFormSubmit(event) {
        event.preventDefault()

        const userName = userNameInput.value
        const password = passwordInput.value

        const storedUsername = localStorage.getItem("userName")
        const storedPassword = localStorage.getItem("password")

        if (storedUsername && storedPassword) {
            if (userName === storedUsername && password === storedPassword) {
                sessionStorage.setItem("loggedIn", true)
                window.location.href = "index.html"
            } else {
                alert("Credenciales incorrectas")
            }
        } else {
            sessionStorage.setItem("loggedIn", true)
            localStorage.setItem("userName", userName)
            localStorage.setItem("password", password)
            window.location.href = "index.html"
        }
    
    

        
    }

    // Función para alternar la visibilidad de la contraseña
    function togglePasswordVisibility() {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"

        passwordInput.setAttribute("type", type)

        this.classList.toggle("bi-eye")
        this.classList.toggle("bi-eye-slash")
    }

    // Función para habilitar o deshabilitar el botón de inicio de sesión
    function toggleButtonState() {
        if (userNameInput.value.trim() !== "" && passwordInput.value.trim() !== ""){
            loginButton.disabled = false
        } else  {
            loginButton.disabled = true
        }
    }

    // Función para agregar eventos de entrada a los campos de usuario y contraseña
    function addInputEventListeners() {
        userNameInput.addEventListener("input", toggleButtonState)
        passwordInput.addEventListener("input", toggleButtonState)
    }

}) 