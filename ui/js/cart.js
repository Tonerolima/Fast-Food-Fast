const cartList = document.querySelector('.vertical.list');
const total = document.getElementById('total');
const checkoutButton = document.getElementById('checkout');
const addressInput = document.querySelector('#address_input');

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    const cart = retrieveCart();
    if (cart.size === 0) {
      const text = `<div>You have not added any food items to your cart</div>`
      cartList.innerHTML = text;
      return;
    }
    let sum = 0;
    cart.forEach((item, key) => {
      sum += parseInt(item.cost);
      node = `
      <li class="raised horizontal card">
        <div class="img-thumbnail">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="horizontal card-details">
          <h4 class="food-name">${item.name}</h4>
          <h6 class="amount">Amount: &#8358 <span class="amount">${item.cost}</span></h6>
          <div class="order-buttons">
            <button class="big button decline" data-id="${key}" data-cost="${item.cost}">Remove</button>
          </div>
        </div>
      </li>
      `;
      cartList.insertBefore(htmlToElement(node), addressInput);
    });
    total.textContent = sum;
  }
}

cartList.addEventListener('click', (event) => {
  const clicked = event.target;
  if (clicked.textContent === 'Remove') {
    removeFromCart(clicked.dataset.id);
    total.textContent = parseInt(total.textContent) - parseInt(clicked.dataset.cost);
    const parentList = clicked.parentNode.parentNode.parentNode;
    fadeOut(parentList);
  }
});

checkoutButton.addEventListener('click', (event) => {
  const cart = retrieveCart();
  checkout(cart);
})

const checkout = (cart) => {
  showLoader('Placing order...');
  let obj = {
    foodIds: [...cart.keys()],
    address: addressInput.value.trim(),
  };

  const myInit = { method: 'POST', body: JSON.stringify(obj), headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.authToken}` } };
  const request = new Request('https://fast-food-fast-adc.herokuapp.com/api/v1/orders', myInit);
  fetch(request)
  .then(response => response.json())
  .then(response => {
    hideLoader();
    if (!response.status) { return showMessage(response.message, 'failure'); }
    emptyCart();
    showMessage(response.message, 'success');
    setTimeout(() => {
      window.location = 'order-history.html';
    }, 2000)
  })
  .catch((error) => {
    hideLoader();
    showMessage('Network error, try reloading the page');
  })
}
