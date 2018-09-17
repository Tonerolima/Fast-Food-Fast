const list = document.querySelector('.horizontal.list');
console.log(list);


var xmlhttp = new XMLHttpRequest();
var url = "http://localhost:8080/api/v1/menu";

xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myArr = JSON.parse(this.responseText);
		myFunction(myArr.result);
	}
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

function myFunction(arr) {
	console.log(arr);
	let item = '';
	arr.forEach((elem) => {
		item += `<li class="vertical card">
							<div class="img-thumbnail"><img src=${elem.image} alt=${elem.name}></div>
  						<div class="vertical card-details">
          			<h4 class="food-name">${elem.name}</h4>
          			<h6 class="amount">Amount: <span class="amount">${elem.cost}</span></h6>
	 							<div class="order-buttons">
			            <button class="big button confirm">Add to cart</button>
			          </div>
			        </div>
			      </li>`;
	});
	console.log(item);
	list.innerHTML = item;
}
