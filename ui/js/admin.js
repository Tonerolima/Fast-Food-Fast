// const filter = document.getElementById("filter");
// const orders = document.getElementsByClassName('card');
// const pending = document.getElementsByClassName('new');
// const processing = document.getElementsByClassName('processing');
// const cancelled = document.getElementsByClassName('cancelled');
// const complete = document.getElementsByClassName('complete');


// const filterOrders = (status) => {
//   for(let order of orders){
//     if(status === "all") {
//       if(order.classList.contains("hidden")){
//         order.classList.remove("hidden");
//       }
//     } else if(!order.classList.contains(status)) {
//         order.classList.add("hidden");
//     } else {
//       order.classList.remove("hidden");
//     }
//   }
// }

// filter.addEventListener("input", (e) => {
//   filterOrders(e.target.value);
// })

const form = document.querySelector('.default-form');
const addFoodTab = document.getElementById('add-food-tab');
const viewMenuTab = document.getElementById('view-menu-tab');

const addFoodForm = document.getElementById('add-food');
const menuTable = document.getElementById('orders-table');

addFoodTab.addEventListener('click', (e) => {
  addFoodTab.classList.add('underlined');
  viewMenuTab.classList.remove('underlined');
  menuTable.classList.add('hidden');
  addFoodForm.classList.remove('hidden');
});

viewMenuTab.addEventListener('click', (e) => {
  viewMenuTab.classList.add('underlined');
  addFoodTab.classList.remove('underlined');
  menuTable.classList.remove('hidden');
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