// Módulo para manejar el carrito en localStorage
const cartService = {
  // Obtener el carrito del localStorage
  getCart() {
    return JSON.parse(localStorage.getItem('cart')) || []
  },

  // Guardar el carrito en localStorage
  saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
  },

  // Eliminar el carrito del localStorage
  clearCart() {
    localStorage.removeItem('cart')
  },

  // Añadir un producto al carrito solo si no está ya presente
  addToCart(product) {
    let cart = this.getCart() // Obtenemos el carrito actual
    const productExists = cart.some((item) => item.id === product.id) // Comprobamos si el producto ya está en el carrito
    if (!productExists) {
      cart.push(product)
      this.saveCart(cart)
    }
    return !productExists // Retornamos true si el producto fue agregado, false si ya existía
  },

  // Actualiza la cantidad de un producto específico en el carrito
  updateQuantity(productId, quantity) {
    let cart = this.getCart() // Obtenemos el carrito actual
    cart = cart.map((product) => {
      if (product.id === productId) {
        product.quantity = quantity // Actualizamos la cantidad del producto
      }
      return product // Retornamos el producto (actualizado o no)
    })
    this.saveCart(cart)
  },

  // Elimina un producto específico del carrito usando su ID
  removeProduct(productId) {
    let cart = this.getCart() // Obtenemos el carrito actual
    cart = cart.filter((product) => product.id !== productId) // Filtramos para eliminar el producto con el ID especificado
    this.saveCart(cart)
  }
}
