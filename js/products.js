fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
.then(res => res.json())
.then(response => {
    console.log(response)

    const categoryTitle = document.getElementById("categoryTitle")
    categoryTitle.textContent = response.catName

    const productsContainer = document.getElementById("productsContainer")

    const fragment = document.createDocumentFragment()

    response.products.forEach(product => {

        const card = document.createElement("div")
        card.classList.add("card")

        const image = document.createElement("img")
        image.classList.add("card-img-top")
        image.src = product.image

        const cardBody = document.createElement("div")
        cardBody.classList.add("card-body")

        const cardTitle = document.createElement("h5")
        cardTitle.classList.add("card-title")
        cardTitle.textContent = product.name

        const cardDescription = document.createElement("p")
        cardDescription.classList.add("card-text")
        cardDescription.textContent = product.description

        const cardPrice = document.createElement("p")
        cardPrice.classList.add("card-text")
        cardPrice.textContent = `${product.currency} ${product.cost}` 

        const cardSoldCount = document.createElement("p")
        cardSoldCount.classList.add("card-text")
        cardSoldCount.textContent = `${product.soldCount} vendidos`

        cardBody.append(cardTitle, cardDescription, cardPrice, cardSoldCount)
        card.append(image, cardBody)
        fragment.appendChild(card)
    });

    productsContainer.appendChild(fragment)
})

