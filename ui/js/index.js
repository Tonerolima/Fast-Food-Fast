const openToggler = document.getElementById('nav-toggle-open');
const closeToggler = document.getElementById('nav-toggle-close');
const linksWrapper = document.querySelector('.nav-links-wrapper');
const nav = document.querySelector('#navbar');

const openMenu = () => {
  linksWrapper.classList.add('animate');
  document.documentElement.addEventListener('click', closeMenuOnBodyClick);
}

const closeMenu = () => {
  linksWrapper.classList.remove('animate');
  document.documentElement.removeEventListener('click', closeMenuOnBodyClick);
}

const closeMenuOnBodyClick = (event) => {
  let path = event.composedPath();
  if (path.some(elem => elem.classList? elem.classList[0] === 'nav-links-wrapper' : false )) {
    return;
  }
  closeMenu();
}

const checkToken = () => {
  if (localStorage.authToken) {
    return true;
  }
  return false;
}

const checkAdmin = () => {
  if (localStorage.isAdmin === 'true') {
    return true;
  }
  return false;
}



const toggleLinks = () => {
  const navLinks1 = document.querySelector('.nav-links:nth-of-type(1)');
  const navLinks2 = document.querySelector('.nav-links:nth-of-type(2)');
  if (checkToken()) {
    navLinks2.innerHTML = '<li id="logout"><a href="#">Logout</a></li>';
    document.getElementById('logout').addEventListener('click', (event) => {
      logout();
    });
    navLinks1.appendChild(htmlToElement(`<li><a href="order-history.html">My Orders</a></li>`));
    navLinks1.appendChild(htmlToElement(`<li><a href="cart.html">Cart</a></li>`));
    if (checkAdmin()) {
      navLinks1.appendChild(htmlToElement('<li><a href="admin.html">Admin Portal</a></li>'));
    }
  }
}

const createCart = () => {
  if (!localStorage.cart) {
    localStorage.cart = '[]';
  }
}

const retrieveCart = () => {
  return new Map(JSON.parse(localStorage.cart));
}

const resaveCart = (array) => {
  return localStorage.cart = JSON.stringify(Array.from(array.entries()));
}

const addToCart = async (food) => {
  if (!food) { return false }
  const { id } = food;
  const properties = (({ name, image, cost }) => ({ name, image, cost }))(food);
  properties.qty = 1;
  const cart = retrieveCart();
  await cart.set(id, properties);
  return resaveCart(cart);
}

const removeFromCart = async (foodId) => {
  if (!foodId) { return false }
  const cart = retrieveCart();
  await cart.delete(foodId);
  return resaveCart(cart);
}

const checkCartForItem = (foodId) => {
  if (!foodId) { return false }
  return retrieveCart().has(foodId.toString());
}

const emptyCart = () => {
  localStorage.cart = '[]';
}

const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('isAdmin');
  window.location = 'login.html';
}

// source: https://stackoverflow.com/a/494348
const htmlToElement = (html) => {
  var template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

const fetchMenu = (foodCount=10, offset=0, parentNode) => {
  fetch(`https://fast-food-fast-adc.herokuapp.com/api/v1/menu?offset=${offset}&&limit=${foodCount}`)
  .then(response => response.json())
  .catch(error => console.log('Request failed', error))
  .then(response => {
    if (!response.status) { return alert(response.message); }
    populateMenu(response.result, parentNode)
  });
}

const populateMenu = (foodList, parentNode) => {
  let item = '';
  let buttonClass;
  let buttonText;
	foodList.forEach((elem) => {
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
	parentNode.innerHTML = item;
}

openToggler.addEventListener('click', (event) => {
  event.stopImmediatePropagation();
  openMenu();
})

closeToggler.addEventListener('click', (event) => {
  closeMenu();
})

toggleLinks();
createCart();
