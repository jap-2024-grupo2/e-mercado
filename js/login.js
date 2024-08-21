document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("loginForm")
    const userNameInput = document.getElementById("inputUsername")
    const passwordInput = document.getElementById("inputPassword")
    const loginButton = document.getElementById("btnLogin")
    
    form.addEventListener("submit", function(event) {
        event.preventDefault()

        const userName = userNameInput.value
        const password = passwordInput.value

        sessionStorage.setItem("loggedIn", true)
        localStorage.setItem("userName", userName)
        localStorage.setItem("password", password)

        window.location.href = "index.html"
    })

}) 