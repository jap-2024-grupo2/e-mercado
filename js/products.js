fetch('https://japceibal.github.io/emercado-api/cats_products/101.json')
  .then((res) => res.json())
  .then(({ products, catName }) => {
    console.log(products)

    const categoryTitle = document.getElementById('categoryTitle')
    categoryTitle.textContent = catName

    const productsContainer = document.getElementById('productsContainer')

    const fragment = document.createDocumentFragment()

    products.forEach(
      ({ image, name, description, currency, cost, soldCount }) => {
        const card = document.createElement('div')
        card.classList.add('card', 'm-4', 'custom-card', 'cursor-active')
        card.style = 'width: 24rem;'

        const img = document.createElement('img')
        img.classList.add('card-img-top')
        img.src = image
        img.alt = `Imagen de ${name}`

        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')

        const cardTitle = document.createElement('h5')
        cardTitle.classList.add('card-title', 'card-title-h5')
        cardTitle.textContent = name

        const cardDescription = document.createElement('p')
        cardDescription.classList.add('card-text', 'card-description')
        cardDescription.textContent = description

        const cardPrice = document.createElement('p')
        cardPrice.classList.add('card-text', 'card-price')
        cardPrice.textContent = `${currency} ${cost}`

        const cardSoldCount = document.createElement('p')
        cardSoldCount.classList.add('card-text', 'card-sold-count')
        cardSoldCount.textContent = `${soldCount} vendidos`

        cardBody.append(cardTitle, cardDescription, cardPrice, cardSoldCount)
        card.append(img, cardBody)
        fragment.appendChild(card)
      }
    )

    productsContainer.appendChild(fragment)
  })
