document.addEventListener('DOMContentLoaded', function () {
  const baseURL = window.location.hostname.includes('github.io') ? '/e-mercado' : ''

  // Lista de integrantes del grupo
  const groupMembers = [
    {
      name: 'Valentina Hernández',
      link: 'https://github.com/ValeHernandezz',
      imgSrc: 'https://avatars.githubusercontent.com/u/128721976?v=4',
      altText: 'Valentina Hernández'
    },
    {
      name: 'Kelly Salas',
      link: 'https://github.com/ksalas039',
      imgSrc: `${baseURL}/img/kelly-profile.png`,
      altText: 'Kelly Salas'
    },
    {
      name: 'Fernanda Rigali',
      link: 'https://github.com/FerRigali',
      imgSrc: `${baseURL}/img/fernanda-profile.jpg`,
      altText: 'Fernanda Rigali'
    },
    {
      name: 'Ailen Albornoz',
      link: 'https://github.com/AilenAlbornoz',
      imgSrc: `${baseURL}/img/ailen-profile.jpeg`,
      altText: 'Ailen Albornoz'
    }
  ]

  // Función para crear el HTML de cada persona
  function createLinkToGitHub({ link, imgSrc, altText, name }) {
    return `
      <div class="col-12 col-md-3 mb-4 d-flex justify-content-center"
        style="transition: transform 0.3s ease; transform: scale(1)"
        onmouseover="this.style.transform='scale(1.025)';"
        onmouseout="this.style.transform='scale(1)';"
      >
        <a
          class="text-decoration-none d-flex align-items-center text-white"
          href="${link}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="${imgSrc}"
            alt="${altText}"
            class="rounded-circle img-hover"
            style="width: 30px; height: 30px; object-fit: cover; margin-right: 10px;"
          />
          <h5 class="mb-0 text-hover">${name}</h5>
        </a>
      </div>
    `
  }

  // HTML del footer principal
  const footerHTML = `
    <footer class="bg-dark text-white py-4 mt-5">
      <div class="container text-center">
        
        <!-- Sección de la imagen principal -->
        <div class="mt-3 mb-5 text-center">
          <p class="text-muted">Este sitio web forma parte de</p>
          <a href="https://jovenesaprogramar.edu.uy/" target="_blank" rel="noopener noreferrer">
            <img 
              src="${baseURL}/img/jap-logo.png" 
              alt="Imagen del footer" 
              class="img-fluid" 
              style="max-width: 250px; transition: transform 0.3s ease; transform: scale(1);" 
              onmouseover="this.style.transform='scale(1.025)';" 
              onmouseout="this.style.transform='scale(1)';"
            >
          </a>
        </div>

        <!-- Sección de los nombres de las integrantes del equipo -->
        <div class="row justify-content-center w-100">
          ${groupMembers.map(createLinkToGitHub).join('')}
        </div>

        <!-- Link de Volver arriba -->
        <div class="my-4">
          <a href="#top" class="text-white fs-5">Volver arriba</a>
        </div>
      </div>
    </footer>
  `

  // Inserta el footer en cada contenedor
  document.querySelectorAll('.footer-container').forEach((container) => {
    container.innerHTML = footerHTML
  })
})
