const catID = localStorage.getItem("catID")

fetch(`https://japceibal.github.io/emercado-api/cats_products/${catID}.json`)
  .then((res) => res.json())
  .then(({ products, catName }) => {

    const categoryTitle = document.getElementById('categoryTitle')
    categoryTitle.textContent = catName

    const productsContainer = document.getElementById('productsContainer')

    const fragment = document.createDocumentFragment()

    if (products.length === 0) {
      showAlert("No hay productos disponibles para esta categoría")
      return
    }

    products.forEach(
      ({ image, name, description, currency, cost, soldCount }) => {

        const column = document.createElement('div')
        column.classList.add('col-12', 'col-md-6', 'col-lg-4', 'my-3')

        const card = document.createElement('div')
        card.classList.add('card', 'custom-card', 'cursor-active', 'h-100', 'w-100')
        card.style = 'width: 24rem;'

        const img = document.createElement('img')
        img.classList.add('card-img-top')
        img.src = image
        img.alt = `Imagen de ${name}`

        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body', 'd-flex', 'flex-column', 'justify-content-between')

        const cardTitle = document.createElement('h5')
        cardTitle.classList.add('card-title', 'card-title-h5')
        cardTitle.textContent = name

        const cardDescription = document.createElement('p')
        cardDescription.classList.add('card-text', 'card-description', 'flex-grow-1')
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
    )

    productsContainer.appendChild(fragment)
  })

function showAlert(message) {
  const alertContainer = document.createElement('div')
  alertContainer.className = 'alert alert-warning alert-dismissible fade show'
  alertContainer.role = 'alert'
  alertContainer.innerHTML = `
          <strong>Advertencia:</strong> ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `

  // Insertar la alerta justo después del título de la categoría
  const categoryTitle = document.getElementById('categoryTitle')
  categoryTitle.insertAdjacentElement('afterend', alertContainer)
}