const filter = document.getElementById("filter");
const orders = document.getElementsByClassName('card');
const pending = document.getElementsByClassName('new');
const processing = document.getElementsByClassName('processing');
const cancelled = document.getElementsByClassName('cancelled');
const complete = document.getElementsByClassName('complete');


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

// filter.addEventListener("input", (e) => {
//   filterOrders(e.target.value);
// })