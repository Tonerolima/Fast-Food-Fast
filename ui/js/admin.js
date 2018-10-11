const form = document.querySelector('.default-form');
const addFoodTab = document.getElementById('add-food-tab');
const viewMenuTab = document.getElementById('view-menu-tab');

const addFoodForm = document.getElementById('add-food');
const orderList = document.getElementById('orders');

const orderDetails = document.getElementsByClassName('order-details');
const orderButtons = document.getElementsByTagName('button');

addFoodTab.addEventListener('click', (e) => {
  addFoodTab.classList.add('underlined');
  viewMenuTab.classList.remove('underlined');
  orderList.classList.add('hidden');
  addFoodForm.classList.remove('hidden');
});

viewMenuTab.addEventListener('click', (e) => {
  viewMenuTab.classList.add('underlined');
  addFoodTab.classList.remove('underlined');
  orderList.classList.remove('hidden');
  addFoodForm.classList.add('hidden');
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const myInit = { 
    method: 'POST', 
    body:  new FormData(event.target), 
    headers: { Authorization: `Bearer ${localStorage.authToken}` }
  }
  const request = new Request(event.target.action, myInit);
  
  fetch(request)
  .then(response => response.json())
  .catch(error => showMessage(error, 'failure'))
  .then(response => {
    showMessage(response.message, 'success');
    form.reset();
  });
});

orderList.addEventListener('click', (e) => {
  const c = e.target;
  if (c.tagName === 'I') {
    const details = c.closest('.order-details').nextElementSibling;
    const foodList = details.querySelector('.food-list');
    if (details.classList.contains('hide')) {
      if (!foodList.querySelector('p')) {
        getFoodDetails(c.dataset.food_ids.split(','), foodList);
      }
      return details.classList.remove('hide')
    }
    details.classList.add('hide');
  } else if (c.textContent === 'Confirm') {
    updateOrderStatus(c.parentNode.dataset.id, 'processing');
  } else if (c.textContent === 'Decline') {
    updateOrderStatus(c.parentNode.dataset.id, 'cancelled');
  } else if (c.textContent === 'Complete') {
    updateOrderStatus(c.parentNode.dataset.id, 'complete');
  }
})

const getFoodDetails = ([...food_ids], foodList) => {
  food_ids.forEach((id) => {
    fetch(`https://fast-food-fast-adc.herokuapp.com/api/v1/menu/${id}`)
      .then(response => response.json())
      .then((response) => {
        appendFoodDetails(foodList, response.result);
      });
  })
}

const appendFoodDetails = (orderNode, foodObject) => {
  const { name, cost } = foodObject;
  const template = htmlToElement(`<li>
    <p>Meal: <span>${name}</span></p>
    <p>Price: &#8358<span>${cost}</span></p>
  </li>`);
  orderNode.appendChild(template);
}

const updateOrderStatus = (orderId, status) => {
  const init = {
    method: 'PUT',
    body: JSON.stringify({ orderStatus: status }),
    headers: { 
      "Content-Type": "application/json", 
      Authorization: `Bearer ${localStorage.authToken}` 
    }
  }
  const url = `https://fast-food-fast-adc.herokuapp.com/api/v1/orders/${orderId}`;
  const request = new Request(url, init);

  fetch(request)
    .then(response => response.json())
    .then((response) => {
      showMessage(response.message, 'success');
      setTimeout(() => {
        window.location = window.location;
      }, 2000)
    })
}

document.onreadystatechange = () => {
  const myInit = {
    method: 'GET',
    headers: { Authorization: `Bearer ${localStorage.authToken}` }
  }

  const request = new Request('https://fast-food-fast-adc.herokuapp.com/api/v1/orders', myInit);

  fetch(request)
    .then(response => response.json())
    .then((response) => {
      const result = response.result;

      result.forEach((order) => {
        const created = new Date(order.created_on).toLocaleDateString('en-GB');
        const {id, firstname, lastname, amount, order_status, address, food_ids} = order;
        let buttons = '';
        if (order_status === 'new') {
          buttons = `<button class="big inverted confirm button">Confirm</button>
            <button class="big inverted decline button">Decline</button>`
        } else if (order_status === 'processing') {
          buttons = `<button class="big inverted complete button">Complete</button>`
        }
        const template = `<li class="order">
          <div class="raised order-details">
            <p>Customer Name: <span>${firstname} ${lastname}</span></p>
            <p>Date: 
              <span>${created}</span> Amount: 
              <span>${amount}</span> Status: 
              <span>${order_status}</span>
            </p>
            <div class="buttons">
              <div data-id=${id}>
                ${buttons}
              </div>
              <i class="fas fa-angle-down fa-2x" data-food_ids="${food_ids}"></i>
            </div>
            
          </div>
          <div class="food-details hide">
            <p>Order Id: <span>${id}</span></p>
            <p>Delivery address: <span>${address}</span></p>
            <ul class="food-list">
            </ul>
          </div>
        </li>`;
        orderList.appendChild(htmlToElement(template));

      });
    })
}
