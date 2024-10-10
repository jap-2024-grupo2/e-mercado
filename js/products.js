const catID = localStorage.getItem('catID')
let currentProductsArray = []
let minPrice = undefined
let maxPrice = undefined

fetch(`https://japceibal.github.io/emercado-api/cats_products/${catID}.json`)
  .then((res) => res.json())
  .then(({ products, catName }) => {
    const categoryTitle = document.getElementById('categoryTitle')
    categoryTitle.textContent = catName

    currentProductsArray = products

    if (products.length === 0) {
      showAlert('No hay productos disponibles para esta categoría')
      document.getElementById('sortAndFilterContainer').style.display = 'none'
      return
    }
    document.getElementById('sortAndFilterContainer').style.display = 'block'
    showProductsList()
  })

function setProductID(id) {
  localStorage.setItem('productID', id)
  window.location = 'product-info.html'
}

function showProductsList(products = currentProductsArray) {
  const productsContainer = document.getElementById('productsContainer')
  productsContainer.innerHTML = '' // Limpiar el contenedor antes de mostrar

  const fragment = document.createDocumentFragment()

  products.forEach(
    ({ id, image, name, description, currency, cost, soldCount }) => {
      if (
        (minPrice == undefined ||
          (minPrice != undefined && parseFloat(cost) >= minPrice)) &&
        (maxPrice == undefined ||
          (maxPrice != undefined && parseFloat(cost) <= maxPrice))
      ) {
        const column = document.createElement('div')
        column.classList.add('col-12', 'col-md-6', 'col-lg-4', 'my-3')

        const card = document.createElement('div')
        card.classList.add(
          'card',
          'custom-card',
          'cursor-active',
          'h-100',
          'w-100'
        )
        card.style = 'width: 24rem;'
        card.onclick = () => setProductID(id)

        const img = document.createElement('img')
        img.classList.add('card-img-top')
        img.src = image
        img.alt = `Imagen de ${name}`
        img.loading = 'lazy'

        const cardBody = document.createElement('div')
        cardBody.classList.add(
          'card-body',
          'd-flex',
          'flex-column',
          'justify-content-between'
        )

        const cardTitle = document.createElement('h5')
        cardTitle.classList.add('card-title', 'card-title-h5')
        cardTitle.textContent = name

        const cardDescription = document.createElement('p')
        cardDescription.classList.add(
          'card-text',
          'card-description',
          'flex-grow-1'
        )
        cardDescription.textContent = description

        const cardPrice = document.createElement('p')
        cardPrice.classList.add('card-text', 'card-price', 'mt-auto')
        cardPrice.textContent = `${currency} ${cost}`

        const cardSoldCount = document.createElement('p')
        cardSoldCount.classList.add('card-text', 'card-sold-count')
        cardSoldCount.textContent = `${soldCount} vendidos`

        cardBody.append(cardTitle, cardDescription, cardPrice, cardSoldCount)
        card.append(img, cardBody)
        column.appendChild(card)
        fragment.appendChild(column)
      }
    }
  )

  productsContainer.appendChild(fragment)
}

function sortProducts(criteria) {
  if (criteria === 'PriceAsc') {
    currentProductsArray.sort((a, b) => parseFloat(a.cost) - parseFloat(b.cost))
  } else if (criteria === 'PriceDesc') {
    currentProductsArray.sort((a, b) => parseFloat(b.cost) - parseFloat(a.cost))
  } else if (criteria === 'Relevance') {
    currentProductsArray.sort(
      (a, b) => parseInt(b.soldCount) - parseInt(a.soldCount)
    )
  }

  showProductsList()
}

document.getElementById('sortAscPrice').addEventListener('click', function () {
  sortProducts('PriceAsc')
})

document.getElementById('sortDescPrice').addEventListener('click', function () {
  sortProducts('PriceDesc')
})

document
  .getElementById('sortByRelevance')
  .addEventListener('click', function () {
    sortProducts('Relevance')
  })

document
  .getElementById('clearRangeFilter')
  .addEventListener('click', function () {
    document.getElementById('rangeFilterPriceMin').value = ''
    document.getElementById('rangeFilterPriceMax').value = ''

    minPrice = undefined
    maxPrice = undefined

    showProductsList()
  })

document
  .getElementById('rangeFilterPrice')
  .addEventListener('click', function () {
    minPrice = document.getElementById('rangeFilterPriceMin').value
    maxPrice = document.getElementById('rangeFilterPriceMax').value

    if (minPrice != undefined && minPrice != '' && parseFloat(minPrice) >= 0) {
      minPrice = parseFloat(minPrice)
    } else {
      minPrice = undefined
    }

    if (maxPrice != undefined && maxPrice != '' && parseFloat(maxPrice) >= 0) {
      maxPrice = parseFloat(maxPrice)
    } else {
      maxPrice = undefined
    }

    showProductsList()
  })

// Función para normalizar el texto: lo convierte a minúsculas, elimina acentos y carecteres especiales
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

document.getElementById('inputSearch').addEventListener('input', function () {
  const searchTerm = normalizeText(this.value) // Normalizamos el término de búsqueda.

  const filteredProducts = currentProductsArray.filter(
    ({ name, description }) => {
      const normalizedTitle = normalizeText(name) // Normalizamos el nombre del producto.
      const normalizedDescription = normalizeText(description) // Normalizamos la descripción del producto.

      return (
        normalizedTitle.includes(searchTerm) || // Buscamos coincidencias en el nombre.
        normalizedDescription.includes(searchTerm) // Buscamos coincidencias en la descripción.
      )
    }
  )

  showProductsList(filteredProducts) // Mostrar los productos filtrados
})

function showAlert(message) {
  const alertContainer = document.createElement('div')
  alertContainer.className = 'alert alert-warning alert-dismissible fade show'
  alertContainer.role = 'alert'
  alertContainer.innerHTML = `
    <strong>Advertencia:</strong> ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `

  const categoryTitle = document.getElementById('categoryTitle')
  categoryTitle.insertAdjacentElement('afterend', alertContainer)
}