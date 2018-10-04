const filter = document.getElementById("filter");
let orders = document.getElementsByClassName('card');
let pending = document.getElementsByClassName('new');
let processing = document.getElementsByClassName('processing');
let cancelled = document.getElementsByClassName('cancelled');
let complete = document.getElementsByClassName('complete');

const filterOrders = (status) => {
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