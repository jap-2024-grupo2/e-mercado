// Obtenemos la ID del producto guardado previamente en el localStorage
const productID = localStorage.getItem('productID')

const commentsSection = document.getElementById('comments-section')
const addToCartButton = document.getElementById("add-to-cart-button")

// Creamos un elemento para el carrusel con la imagen correspondiente
const createCarouselItem = (imgSrc, isActive, altText) => `
  <div class="carousel-item ${isActive ? 'active' : ''}">
    <img src="${imgSrc}" class="d-block w-100" alt="${altText}">
  </div>
`

// Creamos un elemento de imagen con o sin margen inferior, según si es la última imagen
const createImageElement = (imgSrc, altText, isLast) => `<img src="${imgSrc}" class="${isLast ? '' : 'mb-3 mb-lg-4'}" alt="${altText}" style="width: 100%;">`

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
        .slice(1, 4) // Seleccionamos solo las imágenes necesarias
        .map((imgSrc, index) =>
          createCarouselItem(
            imgSrc,
            index === 0, // Marcamos la primera imagen como activa
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
        </button>
      `

      // Creamos el contenedor de imágenes vertical dinámico
      const verticalImages = document.createElement('div')
      verticalImages.className = 'col-sm-2 d-flex flex-column align-items-center vertical-images'

      // Generamos el contenido de las imágenes verticales
      const verticalImagesInner = images
        .slice(1, 4) // Seleccionamos las imágenes necesarias
        .map((imgSrc, index, array) =>
          createImageElement(
            imgSrc,
            `Imagen ${index + 1} de ${name}`,
            index === array.length - 1 // Eliminamos margen para la última imagen
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
      window.addEventListener('resize', () => adjustCarousels(horizontalCarousel, verticalImages) // Reajustamos carruseles al redimensionar la ventana
      )
    }
  )
  .catch((error) => {
    console.error('Error fetching datos del producto:', error) // Capturamos errores en la obtención de datos
  })

// Funcionalidad agregar producto al carrito
addToCartButton.addEventListener("click", () => {
  // Capturamos la información del producto desde el DOM
  const productInfo = {
    id: productID,
    name: document.getElementById("product-info-name").textContent,
    description: document.getElementById("product-info-description").textContent,
    cost: document.getElementById("product-info-cost").textContent,
    category: document.getElementById("product-info-category").textContent,
    soldCount: document.getElementById("product-info-soldCount").textContent,
    image: document.getElementById("product-info-img").src,
  }

  // Obtenemos la lista actual del carrito del localStorage o creamos una nueva si está vacío
  let cart = JSON.parse(localStorage.getItem("cart")) || []

  // Agregamos el producto solo si no está ya en el carrito
  const productExists = cart.some(item => item.id === productInfo.id)
  if (!productExists) {
    cart.push(productInfo)
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Producto ya en el carrito',
      text: 'Este producto ya está agregado al carrito.',
    })
    return
  }

  // Guardamos nuevamente la lista actualizada en el localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Disparamos el evento para actualizar el badge en tiempo real
  dispatchCartUpdatedEvent();

  // SweetAlert2 para confirmar que el producto fue agregado al carrito
  Swal.fire({
    title: '¡Producto agregado!',
    text: '¿Qué te gustaría hacer ahora?',
    icon: 'success',
    showCancelButton: true,
    confirmButtonText: 'Ir al carrito',
    cancelButtonText: 'Seguir comprando',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      // Redirigimos al carrito
      window.location.href = "cart.html";
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Continuar comprando (no hacemos nada, solo cerrar el modal)
    }
  })
})


// Fetch para listar los comentarios provinientes de la API
fetch(`https://japceibal.github.io/emercado-api/products_comments/${productID}.json`)
  .then((res) => res.json())
  .then((comments) => {
    comments.forEach(({ score, description, user, dateTime }) => {
      commentsSection.innerHTML += createComment(user, dateTime, score, description)
    })
  })
  .catch((error) => console.error('Error fetching comentarios:', error))

// Función para crear un comentario
function createComment(user, dateTime, score, description) {
  return `
    <div class="my-1">
      <div class="row">
        <div class="col-md-8 w-100">
          <div class="card review-card shadow-sm">
            <div class="card-body">
              <div class="row">
                <div class="col-md-4 border-end">
                  <h5 class="mb-0 customer-name">${user}</h5>
                  <small class="text-muted">${formatDate(dateTime)}</small>
                </div>
                <div class="col-md-8">
                  <div class="stars mb-2" aria-label="Rating: ${score} out of 5 stars">
                    ${createStars(score)}
                  </div>
                  <p class="review-text mb-2">${description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// Función para crear las estrellas
function createStars(userScore) {
  let estrellasHTML = ''
  for (let i = 1; i <= 5; i++) {
    estrellasHTML += `<i class="fa fa-star ${i <= userScore ? 'checked' : ''}"></i>`
  }

  return estrellasHTML
}

// Función para formatear la fecha que viene por la API
function formatDate(dateTimeString) {
  const date = new Date(dateTimeString) // Creamos una instancia de Date a partir del string de la fecha que viene de la API

  // Opciones para formatear la fecha
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }

  // Formateamos la fecha con toLocaleDateString 'es-ES' para español
  return date.toLocaleDateString('es-ES', options)
}

// Simulación de envío de comentario
function submitComment() {
  const user = localStorage.getItem('userName')
  const commentText = document.getElementById('rating-text').value.trim()
  const ratingStars = document.getElementById('rating-stars').value

  const newComment = createComment(user, new Date(), ratingStars, commentText)

  commentsSection.innerHTML += newComment
  document.getElementById('rating-text').value = ''
}

// Cargar los productos relacionados desde la API
fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
  .then((response) => response.json())
  .then(({ relatedProducts }) => {
    const relatedSection = document.getElementById('related-products')

    relatedProducts.forEach(({ id, name, image }) => {
      relatedSection.innerHTML += `
        <div class="col-12 col-md-6 col-lg-4 my-2" style="width: 18rem;">
          <div class="related-product card cursor-active" onclick="selectProduct(${id})">
            <img src="${image}" class="card-img-top" alt="${name}" loading="lazy">
            <div class="card-body">
              <h5 class="card-title">${name}</h5>
            </div>
          </div>
        </div>
      `
    })
  })
  .catch((error) => console.error('Error fetching related products:', error))

// Actualizamos el ID del producto en el localStorage y redirigimos
function selectProduct(id) {
  localStorage.setItem('productID', id)
  window.location = 'product-info.html'
}


// Función para aplicar el Modo Noche o Modo Día basado en la preferencia almacenada
function applyThemePreference() {
  const darkModeEnabled = localStorage.getItem('darkMode') === 'true'
  if (darkModeEnabled) {
    document.body.classList.add('dark-mode')
  } else {
    document.body.classList.remove('dark-mode')
  }
}

// Inicializar la funcionalidad de Modo Noche/Día al cargar la página
window.addEventListener('DOMContentLoaded', function() {
  applyThemePreference() // Aplicar el tema al cargar la página
})