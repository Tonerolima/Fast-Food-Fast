const ordersList = document.getElementById('orders');
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

ordersList.addEventListener('click', (e) => {
  const path = e.composedPath();
  if (path.some(elem => elem.tagName === 'LI')) {
    const c = e.target;
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
  }
})

const getFoodDetails = ([...food_ids], foodList) => {
  showLoader('Loading food list');
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
        .catch((error) => {
          hideLoader();
          showMessage('Network error, try reloading the page');
        })
    })
  )
  .then((foodArray) => {
    hideLoader();
    foodArray.forEach((value) => {
      foodList.appendChild(htmlToElement(value));
    })
  })
};

const getOrders = () => {
  showLoader('Fetching your orders');
  const myInit = { method: 'GET', headers: { Authorization: `Bearer ${localStorage.authToken}` } };
  const request = new Request(`https://fast-food-fast-adc.herokuapp.com/api/v1/users/${localStorage.userId}/orders`, myInit);

  fetch(request)
    .then(response => response.json())
    .then(response => {
      hideLoader();
      if (!response.status) { return showMessage(response.message, 'failure') }
      let orders = response.result;
      orders.forEach((order) => {
        const created = new Date(order.created_on).toLocaleDateString('en-GB');
        const updated = new Date(order.updated_on).toLocaleDateString('en-GB');
        const {id, amount, order_status, address, food_ids} = order;
        const item = `<li class="order${order_status} order">
          <div class="raised order-details">
            <p>
              <span class="title">Order id: <span class="value">${id}</span></span>
              <span class="title">Amount: <span class="value">${amount}</span></span>
            </p>
            <p>
              <span class="title">Date: <span class="value">${created}</span></span>
              <span class="title">Last update: <span class="value">${updated}</span></span>
            </p>
            <p>
              <span class="title">Status: <span class="value">${order_status}</span></span>
              <i class="fas fa-angle-down fa-2x"></i>
            </p>
          </div>
          <div class="food-details hide">
            <p><span class="title">Delivery address: <span class="value">${address}</span></span></p>
            <ul class="food-list" data-food_ids="${food_ids}">
            </ul>
          </div>
        </li>`

        ordersList.appendChild(htmlToElement(item));
      });
    })
    .catch((error) => {
      hideLoader();
      showMessage('Network error, try reloading the page');
    })
}

document.onreadystatechange = (e) => {
	if (document.readyState === 'complete') {
    getOrders();
  }
}
