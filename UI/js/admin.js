const filter = document.getElementById("filter");
let orders = document.getElementsByClassName('order');
let pending = document.getElementsByClassName('pending');
let confirmed = document.getElementsByClassName('confirmed');
let delivered = document.getElementsByClassName('delivered');

const filterOrders = (status) => {
  console.log(status);
  for(let order of orders){
    if(status === "all") {
      if(order.classList.contains("hidden")){
        order.classList.remove("hidden");
      }
    } else if(!order.classList.contains(status)) {
        order.classList.add("hidden");
    } else {
      order.classList.remove("hidden");
    }
  }
}

filter.addEventListener("input", (e) => {
  filterOrders(e.target.value);
})