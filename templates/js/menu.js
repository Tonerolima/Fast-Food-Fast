const list = document.querySelector('.horizontal.list');

// const xmlhttp = new XMLHttpRequest();
// const url = "https://fast-food-fast-adc.herokuapp.com/api/v1/menu";

// xmlhttp.onreadystatechange = function() {
// 	if (this.readyState == 4 && this.status == 200) {
// 		var myArr = JSON.parse(this.responseText);
// 		populateMenu(myArr.result, list);
// 	}
// };
// xmlhttp.open("GET", url, true);
// xmlhttp.send();

fetchMenu(10, 0, list);

list.addEventListener('click', (event) => {
  const clicked = event.target;
  if (clicked.tagName === 'BUTTON') {
    if (clicked.classList.contains('decline')) {
      clicked.classList.replace('decline', 'confirm');
      clicked.textContent = 'Add to cart';
      removeFromCart(clicked.dataset.id);
      return;
    }
    addToCart(clicked.dataset);
    clicked.classList.replace('confirm', 'decline');
    clicked.textContent = 'Remove from cart';
  }
});