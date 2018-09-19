const list = document.querySelector('.vertical.list');
const total = document.getElementById('total');
const cart = retrieveCart();

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    let sum = 0;
    let node = '';
    cart.forEach((item, key) => {
      sum += parseInt(item.cost);
      node += `
      <li class="horizontal card">
        <div class="img-thumbnail">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="horizontal card-details">
          <h4 class="food-name">${item.name}</h4>
          <h6 class="amount">Amount: NGN <span class="amount">${item.cost}</span></h6>
          <h6>Qty: 1</h6>
          <div class="order-buttons">
            <button class="big button decline" data-id="${key}" data-cost="${item.cost}">Remove</button>
          </div>
        </div>
      </li>
      `
    });
    list.innerHTML = node;
    total.textContent = sum;
  }
}

list.addEventListener('click', (event) => {
  const clicked = event.target;
  if (clicked.tagName === 'BUTTON') {
    removeFromCart(clicked.dataset.id);
    total.textContent = parseInt(total.textContent) - parseInt(clicked.dataset.cost);
    const parentList = clicked.parentNode.parentNode.parentNode.parentNode;
    parentList.removeChild(clicked.parentNode.parentNode.parentNode);
  }
});