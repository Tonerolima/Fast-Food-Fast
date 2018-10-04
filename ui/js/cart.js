const list = document.querySelector('.vertical.list');
const total = document.getElementById('total');
const checkoutButton = document.getElementById('checkout');
const sectionFooter = document.querySelector('.section-footer');

document.onreadystatechange = () => {
  const cart = retrieveCart();
  if (document.readyState === "complete") {
    let sum = 0;
    cart.forEach((item, key) => {
      sum += parseInt(item.cost);
      node = `
      <li class="horizontal card">
        <div class="img-thumbnail">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="horizontal card-details">
          <h4 class="food-name">${item.name}</h4>
          <h6 class="amount">Amount: &#8358 <span class="amount">${item.cost}</span></h6>
          <h6>Qty: 1</h6>
          <div class="order-buttons">
            <button class="big button decline" data-id="${key}" data-cost="${item.cost}">Remove</button>
          </div>
        </div>
      </li>
      `;
      list.insertBefore(htmlToElement(node), sectionFooter);
    });
    total.textContent = sum;
  }
}

const fadeOut = (element) => {
  element.classList.add('fade');
  window.setTimeout(() => {
    element.classList.add('shrink');
  }, 600)
  window.setTimeout(() => {
    element.classList.add('hidden');
  }, 1100)
}

list.addEventListener('click', (event) => {
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
  let obj = {};
  obj.foodIds = [...cart.keys()];

  const myInit = { method: 'POST', body: JSON.stringify(obj), headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.authToken}` } };
  const request = new Request('https://fast-food-fast-adc.herokuapp.com/api/v1/orders', myInit);
  fetch(request)
  .then(response => response.json())
  .catch(error => console.log('Request failed', error))
  .then(response => {
    if (!response.status) { return alert(response.message); }
    emptyCart();
    alert(response.message);
    window.location = 'order-history.html';
  });
}
