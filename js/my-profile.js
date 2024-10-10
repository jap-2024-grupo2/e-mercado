document.addEventListener("DOMContentLoaded", function() {
    const profileForm = document.getElementById("profile-form");

    loadProfileData();

    profileForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();

        if(!firstName || !lastName || !email) {
            alert("Por favor, complete todos los campos obligatorios.");
            return;
        }
        const profileData = {
            firstName: firstName,
            secondName: document.getElementById("secondName").value.trim(),
            lastName: lastName,
            secondLastName: document.getElementById("secondLastName").value.trim(),
            email: email,
            phone: document.getElementById("phone").value.trim(),
            theme: document.getElementById("themeSwitch").checked ? 'dark' : 'light'
        };

        localStorage.setItem("profileData", JSON.stringify(profileData));

        alert("Perfil guardado con éxito.");
    });

    function loadProfileData() {
        const storedData = localStorage.getItem("profileData");
        if(storedData) {
            const profileData = JSON.parse(storedData);

            document.getElementById("firstName").value = profileData.firstName || '';
            document.getElementById("secondName").value = profileData.secondName || '';
            document.getElementById("lastName").value = profileData.lastName || '';
            document.getElementById("secondLastName").value = profileData.secondLastName || '';
            document.getElementById("email").value = profileData.email || '';
            document.getElementById("phone").value = profileData.phone || '';
            document.getElementById("themeSwitch").checked = profileData.theme === 'dark';
        }
    }
});