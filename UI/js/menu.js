const list = document.querySelector('.horizontal.list');

const xmlhttp = new XMLHttpRequest();
const url = "https://fast-food-fast-adc.herokuapp.com/api/v1/menu";

xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myArr = JSON.parse(this.responseText);
		populateMenu(myArr.result);
	}
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

const populateMenu = (arr) => {
  let item = '';
  let buttonClass;
  let buttonText;
	arr.forEach((elem) => {
    if (!checkCartForItem(elem.id)) {
      buttonClass = 'confirm';
      buttonText = 'Add to cart';
    } else {
      buttonClass = 'decline';
      buttonText = 'Remove from cart';
    }
		item += `<li class="vertical card">
							<div class="img-thumbnail"><img src=${elem.image} alt=${elem.name}></div>
  						<div class="vertical card-details">
          			<h4 class="food-name">${elem.name}</h4>
          			<h6 class="amount">Amount: &#8358 <span class="amount">${elem.cost}</span></h6>
	 							<div class="order-buttons">
                  <button class="big fluid button ${buttonClass}" data-id="${elem.id}" data-name="${elem.name}" data-image="${elem.image}" data-cost="${elem.cost}">
                  ${buttonText}
                  </button>
			          </div>
			        </div>
			      </li>`;
	});
	list.innerHTML = item;
}

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