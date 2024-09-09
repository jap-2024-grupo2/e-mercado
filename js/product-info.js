// Obtenemos la ID del producto guardado previamente en el localStorage
const productID = localStorage.getItem('productID')

// Creamos un elemento para el carrusel con la imagen correspondiente
const createCarouselItem = (imgSrc, isActive, altText) => `
  <div class="carousel-item ${isActive ? 'active' : ''}">
    <img src="${imgSrc}" class="d-block w-100" alt="${altText}">
  </div>`

// Creamos un elemento de imagen con o sin margen inferior, según si es la última imagen
const createImageElement = (imgSrc, altText, isLast) => `
  <img src="${imgSrc}" class="${isLast ? '' : 'mb-3 mb-lg-4'}" alt="${altText}" style="width: 100%;">`

// Ajustamos la visibilidad del carrusel y de las imágenes verticales según el tamaño de la pantalla
const adjustCarousels = (horizontalCarousel, verticalImages) => {
  if (window.innerWidth < 576) {
    horizontalCarousel.style.display = 'block'
    verticalImages.style.display = 'none'
  } else {
    horizontalCarousel.style.display = 'none'
    verticalImages.style.display = 'flex'
  }
}

fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
  .then((res) => res.json())
  .then(
    ({ id, name, description, cost, currency, soldCount, category, images, relatedProducts }) => {
      // Actualizamos la información del producto
      document.getElementById('product-info-img').src = images[0]
      document.getElementById('product-info-category').textContent = category
      document.getElementById('product-info-name').textContent = name
      document.getElementById('product-info-cost').textContent = `${currency} ${cost}`
      document.getElementById('product-info-description').textContent = description
      document.getElementById('product-info-soldCount').textContent = `${soldCount} vendidos`

      // Creamos el carrusel horizontal dinámico con las imágenes a partir del índice 1
      const horizontalCarousel = document.createElement('div')
      horizontalCarousel.className = 'carousel slide'
      horizontalCarousel.id = 'horizontalCarousel'
      horizontalCarousel.setAttribute('data-bs-ride', 'carousel')

      // Generamos el contenido del carrusel horizontal
      const carouselInner = images
        .slice(1, 4)        // Seleccionamos solo las imágenes necesarias
        .map((imgSrc, index) =>
          createCarouselItem(
            imgSrc,
            index === 0,    // Marcamos la primera imagen como activa
            `Imagen ${index + 1} de ${name}`
          )
        )
        .join('')

      horizontalCarousel.innerHTML = `
        <div class="carousel-inner mt-5">
          ${carouselInner}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#horizontalCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#horizontalCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>`

      // Creamos el contenedor de imágenes vertical dinámico
      const verticalImages = document.createElement('div')
      verticalImages.className = 'col-sm-2 d-flex flex-column align-items-center vertical-images'

      // Generamos el contenido de las imágenes verticales
      const verticalImagesInner = images
        .slice(1, 4)        // Seleccionamos las imágenes necesarias
        .map((imgSrc, index, array) =>
          createImageElement(
            imgSrc,
            `Imagen ${index + 1} de ${name}`,
            index === array.length - 1        // Eliminamos margen para la última imagen
          )
        )
        .join('')

      verticalImages.innerHTML = verticalImagesInner

      // Insertamos el carrusel horizontal y las imágenes verticales en sus contenedores
      const solCountAddToCartContainer = document.querySelector('#product-info-soldCount-addToCart')
      solCountAddToCartContainer.insertAdjacentElement('afterend', horizontalCarousel)

      const contentContainer = document.querySelector('#content-container')
      contentContainer.insertAdjacentElement('afterbegin', verticalImages)

      // Ajustamos los carruseles según el tamaño de la pantalla al cargar la página
      adjustCarousels(horizontalCarousel, verticalImages)
      window.addEventListener('resize', () =>
        adjustCarousels(horizontalCarousel, verticalImages)   // Reajustamos carruseles al redimensionar la ventana
      )
    }
  )
  .catch((error) => {
    console.error('Error fetching datos del producto:', error)    // Capturamos errores en la obtención de datos
  })
