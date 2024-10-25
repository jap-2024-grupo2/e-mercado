document.addEventListener('DOMContentLoaded', function() {
    const addToCartButton = document.getElementById('add-to-cart-button');

    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            const productName = document.getElementById('product-info-name').innerText;
            const productCost = parseFloat(document.getElementById('product-info-cost').innerText.replace('$', ''));
            const productImage = document.getElementById('product-info-img').src;

            const product = {
                name: productName,
                cost: productCost,
                image: productImage
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));

            alert(`${productName} ha sido agregado al carrito.`);
        });
    }
});

function mostrarCart() {
    const cartSection = document.getElementById('my-cart');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cartSection.innerHTML = ''; 

    if (cart.length === 0) {
        cartSection.innerHTML = '<p>No hay productos en el carrito.</p>';
        return;
    }

    cart.forEach(item => {
        cartSection.innerHTML += `
            <div>
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">
                <span>${item.name} - $${item.cost}</span>
            </div>
        `;
    });

    const totalCost = cart.reduce((total, item) => total + item.cost, 0);
    document.getElementById('total-cost').innerText = `Total a pagar: $${totalCost}`;
}

// Llamar a mostrarCart cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', mostrarCart);