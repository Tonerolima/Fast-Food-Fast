const form = document.querySelector('.default-form');
const addFoodTab = document.getElementById('add-food-tab');
const viewMenuTab = document.getElementById('view-menu-tab');
const addFoodForm = document.getElementById('add-food');
const orderList = document.getElementById('orders');
const orderDetails = document.getElementsByClassName('order-details');
const orderButtons = document.getElementsByTagName('button');
const filter = document.getElementById('filter');

filter.addEventListener('input', (e) => {
  const orders = document.querySelectorAll('.order');
  const status = filter.value;
  orders.forEach((order) => {
    if (order.classList.contains(status) || status === 'all') {
      return order.classList.remove('hidden');
    }
    order.classList.add('hidden');
  })
})

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
    showMessage(response.message, response.status? 'success' : 'failure');
    form.reset();
  });
});

orderList.addEventListener('click', (e) => {
  const path = e.composedPath();
  if (path.some(elem => elem.tagName === 'LI')) {
    const c = e.target;
    if (c.tagName !== 'BUTTON') {
      const details = c.closest('.order-details').nextElementSibling;
      const icon = c.closest('.order-details').querySelector('i');
      const foodList = details.querySelector('.food-list');
      if (details.classList.contains('hide')) {
        if (!foodList.querySelector('p')) {
          getFoodDetails(foodList.dataset.food_ids.split(','), foodList);
        }
        icon.classList.remove('fa-angle-down');
        icon.classList.add('fa-angle-up');
        return details.classList.remove('hide');
      }
      details.classList.add('hide');
      icon.classList.remove('fa-angle-up');
      icon.classList.add('fa-angle-down');
    } else if (c.textContent === 'Confirm') {
      updateOrderStatus(c.parentNode.dataset.id, 'processing');
    } else if (c.textContent === 'Decline') {
      updateOrderStatus(c.parentNode.dataset.id, 'cancelled');
    } else if (c.textContent === 'Complete') {
      updateOrderStatus(c.parentNode.dataset.id, 'complete');
    }
  }
})

const getFoodDetails = ([...food_ids], foodList) => {
  Promise.all(
    food_ids.map((id) => {
      return new Promise((resolve, reject) => {
        fetch(`https://fast-food-fast-adc.herokuapp.com/api/v1/menu/${id}`)
          .then(response => response.json())
          .then((response) => {
            const { name, cost } = response.result;
            const template = `<li>
              <p><span class="title">Meal: <span class="value">${name}</span></span></p>
              <p><span class="title">Price: &#8358<span class="value">${cost}</span></span></p>
            </li>`;
            resolve(template);
          })
        })
    })
  )
  .then((foodArray) => {
    foodArray.forEach((value) => {
      foodList.appendChild(htmlToElement(value));
    })
  })
};

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
  if (document.readyState === 'complete') {
    const myInit = {
      method: 'GET',
      headers: { Authorization: `Bearer ${localStorage.authToken}` }
    }
    const request = new Request('https://fast-food-fast-adc.herokuapp.com/api/v1/orders', myInit);
    fetch(request)
      .then(response => response.json())
      .then((response) => {
        if (!response.status) { return showMessage(response.message, 'failure') }
        const result = response.result;
        result.forEach((order) => {
          const created = new Date(order.created_on).toLocaleDateString('en-GB');
          const updated = new Date(order.updated_on).toLocaleDateString('en-GB');
          const {id, firstname, lastname, amount, order_status, address, food_ids} = order;
          let buttons = '';
          if (order_status === 'new') {
            buttons = `<button class="big confirm button">Confirm</button>
              <button class="big inverted decline button">Decline</button>`
          } else if (order_status === 'processing') {
            buttons = `<button class="big confirm button">Complete</button>`
          }
          const template = `<li class="${order_status !== 'new'? 'hidden order' : 'order'} ${order_status}">
            <div class="raised order-details">
              <p><span class="title">Customer Name: <span class="value">${firstname} ${lastname}</span></span></p>
              <p>
                <span class="title">Date: <span class="value">${created}</span></span>
                <span class="title">Status: <span class="value">${order_status}</span></span>
              </p>
              <p>
                <span class="title">Amount: <span class="value">${amount}</span></span>
                <span class="title">Last update: <span class="value">${updated}</span></span>
              </p>
              <div class="buttons">
                <div data-id=${id}>
                  ${buttons}
                </div>
                <i class="fas fa-angle-down fa-2x"></i>
              </div>
              
            </div>
            <div class="food-details hide">
              <p><span class="title">Order Id: <span class="value">${id}</span></span></p>
              <p><span class="title">Delivery address: <span class="value">${address}</span></span></p>
              <ul class="food-list" data-food_ids="${food_ids}">
              </ul>
            </div>
          </li>`;
          orderList.appendChild(htmlToElement(template));
        });
      })
  }
}
