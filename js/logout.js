document.addEventListener("DOMContentLoaded", function() {
    if (!sessionStorage.getItem("loggedIn")) {
        window.location.href ="login.html"
    }
})

function logout() {
    sessionStorage.removeItem("loggedIn")
    localStorage.removeItem("userName")
    localStorage.removeItem("password")

    window.location.href ="login.html"
}