// Tasa de conversión de USD a UYU
const USD_TO_UYU = 42.7
let shippingCost = 0 // Variable global para almacenar el costo de envío

// Función para crear un tr para cada producto en el carrito
function createCartRow(product) {
  const { id, name, category, image } = product

  const { currency, cost } = separateCurrencyAndCost(product.cost)

  return `
    <tr data-product-id="${id}">
      <th scope="row">
        <div class="d-flex align-items-center">
          <img src="${image}" class="img-fluid rounded-3 cursor-active" style="width: 120px;" alt="${name}" onclick="setProductID('${id}')">
          <div class="flex-column ms-4" style="min-width: 0;">
            <p class="mb-0 text-truncate cursor-active" style="max-width: fit-content; cursor: pointer;"
              onclick="setProductID('${id}')"
              onmouseover="this.style.textDecoration='underline';" 
              onmouseout="this.style.textDecoration='none';">
              ${name}
            </p>
          </div>
        </div>
      </th>
      <td class="align-middle">
        <p class="mb-0" style="font-weight: 500; white-space: nowrap;">${category}</p>
      </td>
      <td class="align-middle">
        <div class="d-flex flex-row">
          <button class="btn btn-link px-2" data-action="decrease" data-id="${id}">
            <i class="fas fa-minus text-secondary"></i>
          </button>

          <input min="0" name="quantity" value="${product.quantity || 1}" type="number" class="form-control form-control-sm quantity-input no-edit" style="width: 50px;" readonly>

          <button class="btn btn-link px-2" data-action="increase" data-id="${id}">
            <i class="fas fa-plus text-secondary"></i>
          </button>
        </div>
      </td>
      <td class="align-middle">
        <p class="mb-0 product-price" style="font-weight: 500;">${currency} ${cost}</p>
      </td>
      <td class="align-middle">
        <button class="btn btn-link text-danger" data-action="remove" data-id="${id}">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `
}

// Añadimos listeners de eventos de forma dinámica
document.addEventListener('click', function (event) {
  if (event.target.closest('[data-action="increase"]')) {
    const id = event.target.closest('[data-id]').dataset.id
    updateQuantity(id, 1)
  }

  if (event.target.closest('[data-action="decrease"]')) {
    const id = event.target.closest('[data-id]').dataset.id
    updateQuantity(id, -1)
  }

  if (event.target.closest('[data-action="remove"]')) {
    const id = event.target.closest('[data-id]').dataset.id
    removeProduct(id)
  }
})

// Función para actualizar la cantidad de un mismo producto
function updateQuantity(productId, change) {
  let cart = cartService.getCart()
  let product = cart.find((p) => p.id === productId)

  if (product) {
    let newQuantity = (product.quantity || 1) + change
    if (newQuantity < 1) newQuantity = 1 // Evitamos que sea menor a 1

    // Actualizamos la cantidad en el carrito (localStorage)
    cartService.updateQuantity(productId, newQuantity)

    // Actualizamos solo el precio del producto y el valor del input en el DOM
    const productRow = document.querySelector(`tr[data-product-id="${productId}"]`)
    const productPriceElement = productRow.querySelector('.product-price')
    const quantityInput = productRow.querySelector('input[name="quantity"]')

    // Actualizamos el valor del input
    quantityInput.value = newQuantity

    // Calculamos y actualizamos el precio total para este producto
    const { currency, cost } = separateCurrencyAndCost(product.cost)
    const totalPrice = cost * newQuantity
    productPriceElement.textContent = `${currency} ${totalPrice.toFixed(0)}` // toFixed() redondea el total sin comas

    // Recalculamos los totales generales
    calculateTotals()

    // Llamada para actualizar el badge en tiempo real
    dispatchCartUpdatedEvent()
  }
}

// Función para eliminar un producto
function removeProduct(productId) {
  cartService.removeProduct(productId)
  renderCart()
  calculateTotals()
  dispatchCartUpdatedEvent() // Llamada para actualizar el badge en tiempo real
}

// Función para renderizar todos los productos del carrito
function renderCart() {
  const cart = cartService.getCart()
  const tbody = document.querySelector('table tbody')
  const alertContainer = document.getElementById('cart-alert')

  // Si el carrito está vacío, mostramos un mensaje de alerta
  if (cart.length === 0) {
    tbody.innerHTML = ''
    alertContainer.innerHTML = `
      <div class="container py-3 border rounded alert-info" role="alert">
        No hay productos en el carrito.
      </div>
    `
    return
  }

  // Si hay productos en el carrito, renderizamos las filas y ocultamos la alerta
  tbody.innerHTML = cart.map(createCartRow).join('')
  alertContainer.innerHTML = '' // Ocultamos el alert si hay productos
}

// Función para calcular y mostrar el resumen de precios
function calculateTotals() {
  const cart = cartService.getCart()
  let totalUSD = 0
  let totalUYU = 0

  // Sumamos los precios de los productos según su moneda y cantidad
  cart.forEach((product) => {
    const { currency, cost } = separateCurrencyAndCost(product.cost)
    const quantity = product.quantity || 1

    if (currency === 'USD') {
      totalUSD += cost * quantity
    } else if (currency === 'UYU') {
      totalUYU += cost * quantity
    }
  })

  // Convertimos el total en USD a UYU
  const totalConvertedUSD = totalUSD * USD_TO_UYU

  // Actualizamos los totales en el DOM
  document.querySelector('.usd-total').textContent = `USD ${totalUSD}`
  document.querySelector('.uyu-total').textContent = `UYU ${totalUYU}`

  // Calculamos el costo de envío y actualizamos la visualización
  calculateShippingCost(totalConvertedUSD, totalUYU)
}

// Función para calcular el costo de envío
function calculateShippingCost(totalConvertedUSD, totalUYU) {
  // Obtenemos la opción seleccionada de los radio buttons
  const shippingType = document.querySelector('input[name="shipping-type"]:checked')

  if (!shippingType) return

  let shippingPercentage = 0

  // Definimos los porcentajes de acuerdo a la opción seleccionada
  switch (shippingType.value) {
    case 'premium':
      shippingPercentage = 0.15 // 15%
      break
    case 'express':
      shippingPercentage = 0.07 // 7%
      break
    case 'standard':
      shippingPercentage = 0.05 // 5%
      break
  }

  // Calculamos el costo de envío en base al porcentaje seleccionado
  shippingCost = (totalConvertedUSD + totalUYU) * shippingPercentage

  // Actualizamos el DOM con el costo de envío calculado
  document.querySelector('.shipping-cost').textContent = `UYU ${shippingCost.toFixed(0)}`

  // Ahora calculamos el grandTotal, incluyendo el costo de envío
  const grandTotal = totalConvertedUSD + totalUYU + shippingCost

  // Actualizamos el DOM con el grandTotal final
  document.querySelector('.grand-total').textContent = `UYU ${grandTotal.toFixed(0)}`
}

// Función para separar la moneda del valor numérico
function separateCurrencyAndCost(cost) {
  const [currency, costString] = cost.split(' ')
  return {
    currency,
    cost: parseFloat(costString)
  }
}

// Función que maneja el clic del botón "Pagar"
document.getElementById('pay-button').addEventListener('click', function () {
  // Verificamos si el carrito tiene productos
  let cart = cartService.getCart()

  if (cart.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'El carrito está vacío',
      text: 'Agrega productos al carrito antes de continuar.'
    })
  } else {
    // Si hay productos, mostramos una alerta con dos opciones
    Swal.fire({
      title: 'Confirmar Pago',
      text: '¿Estás seguro que deseas proceder con el pago?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, pagar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Si confirma el pago, se vacía el carrito y se muestra alerta de éxito
        cartService.clearCart()

        Swal.fire({
          icon: 'success',
          title: 'Pago realizado',
          text: 'Tu pago ha sido procesado con éxito.'
        }).then(() => {
          const paymentModal = bootstrap.Modal.getInstance(document.getElementById('modalPaymentOptions'))
          if (paymentModal) {
            paymentModal.hide()
          } //Cierra el modal
          renderCart() // Llamamos a la función para actualizar la vista
          calculateTotals() // Actualizamos los totales
          dispatchCartUpdatedEvent() // Llamada para actualizar el badge en tiempo real
        })
      }
    })
  }
})

// Llamada para recalcular los totales cuando se cambie la opción de envío
document
  .querySelectorAll('input[name="shipping-type"]')
  .forEach((radioButton) => {
    radioButton.addEventListener('change', function () {
      // Recalculamos los totales cada vez que se cambie la opción de envío
      calculateTotals()
    })
  })

// Llamamos a renderCart y calculateTotals al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  renderCart()
  calculateTotals()
})

// Función que abre el modal de opciones de pago
function openPaymentOptions() {
  if (validateAddressAndShipping()) {
    // Si la validación de dirección y envío es correcta, cerramos el modal de envío
    const shippingModal = bootstrap.Modal.getInstance(document.getElementById('modalShippingOptions'))
    if (shippingModal) {
      shippingModal.hide() // Cerrar modal de dirección
    }

    // Abrir el modal de pago
    const paymentModal = new bootstrap.Modal(document.getElementById('modalPaymentOptions'))
    paymentModal.show() // Abrir modal de pago
  }
}

function openShippingOptions() {
  setTimeout(function () {
    const shippingModal = new bootstrap.Modal(document.getElementById('modalShippingOptions'))
    shippingModal.show()
  }, 500) // Espera antes de abrir el modal anterior
}

// Evento que abre el modal de opciones de envío cuando el usuario hace clic
document.getElementById('open-modal').addEventListener('click', function () {
  // Verificamos si el carrito tiene productos antes de abrir el modal
  const cart = cartService.getCart()

  if (cart.length === 0) {
    // Si el carrito está vacío, mostramos un mensaje o no hacemos nada
    Swal.fire({
      icon: 'warning',
      title: 'El carrito está vacío',
      text: 'Agrega productos al carrito antes de proceder con la opción de envío.'
    })
    return // Salimos de la función y no abrimos el modal
  }

  // Si el carrito tiene productos, procedemos a abrir el modal de opciones de envío
  const shippingModal = new bootstrap.Modal(document.getElementById('modalShippingOptions'))
  shippingModal.show()
})

// Validación de campos de dirección
function validateAddressFields() {
  const requiredFields = [
    'shippingDepartment',
    'shippingCity',
    'shippingStreet',
    'shippingNumber',
    'shippingCorner'
  ]
  const allFieldsFilled = requiredFields.every((id) => document.getElementById(id).value.trim() !== '')

  document.querySelector('#modalShippingOptions .btn-primary').disabled = !allFieldsFilled
}

// Agrega un evento de input a cada campo de dirección
document.addEventListener('DOMContentLoaded', () => {
  const addressFields = [
    'shippingDepartment',
    'shippingCity',
    'shippingStreet',
    'shippingNumber',
    'shippingCorner'
  ]
  addressFields.forEach((id) => { document.getElementById(id).addEventListener('input', validateAddressFields })
})

// Función que valida los campos de dirección y de envío
function validateAddressAndShipping() {
  // Validar los campos de dirección
  const requiredFields = [
    'shippingDepartment',
    'shippingCity',
    'shippingStreet',
    'shippingNumber',
    'shippingCorner'
  ]
  const allFieldsFilled = requiredFields.every((id) => document.getElementById(id).value.trim() !== '')
  if (!allFieldsFilled) {
    Swal.fire('Por favor completa todos los campos de la dirección.')
    return false
  }

  // Validar que se haya seleccionado una forma de envío
  const shippingSelected = document.querySelector('input[name="shipping-type"]:checked')
  if (!shippingSelected) {
    Swal.fire('Por favor selecciona una forma de envío.')
    return false
  }

  return true
}
