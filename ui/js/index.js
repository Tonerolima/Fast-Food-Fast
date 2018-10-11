const openToggler = document.getElementById('nav-toggle-open');
const closeToggler = document.getElementById('nav-toggle-close');
const linksWrapper = document.querySelector('.nav-links-wrapper');
const nav = document.querySelector('#navbar');
const list = document.querySelector('.horizontal.list');

const openMenu = () => {
  linksWrapper.classList.add('animate');
  document.documentElement.addEventListener('click', closeMenuOnBodyClick);
}

const closeMenu = () => {
  linksWrapper.classList.remove('animate');
  document.documentElement.removeEventListener('click', closeMenuOnBodyClick);
}

const closeMenuOnBodyClick = (event) => {
  const path = event.composedPath();
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
    
    if (checkAdmin()) {
      return navLinks1.appendChild(htmlToElement('<li><a href="admin.html">Admin Portal</a></li>'));
    }
    navLinks1.appendChild(htmlToElement(`<li><a href="menu.html">Browse Menu</a></li>`));
    navLinks1.appendChild(htmlToElement(`<li><a href="order-history.html">My Orders</a></li>`));
    navLinks1.appendChild(htmlToElement(`<li><a href="cart.html">Cart</a></li>`));
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
  showMessage("Item added to cart", 'success')
  return resaveCart(cart);
}

const removeFromCart = async (foodId) => {
  if (!foodId) { return false }
  const cart = retrieveCart();
  await cart.delete(foodId);
  showMessage("Item removed from cart", 'success')
  return resaveCart(cart);
}

const checkCartForItem = (foodId) => {
  if (!foodId) { return false }
  return retrieveCart().has(foodId.toString());
}

const emptyCart = () => {
  localStorage.cart = '[]';
}

const login = (response) => {
  if (!response.status) { 
    return showMessage(response.result || response.message, 'failure');
  }
  localStorage.setItem('authToken', response.token);
  localStorage.setItem('isAdmin', response.result.isadmin);
  localStorage.setItem('userId', response.result.id);
  showMessage(response.message, 'success');
  setTimeout(() => {
    if (localStorage.isAdmin === "true") {
      return window.location = 'admin.html';
    }
    window.location = 'index.html';
  }, 2000)
}

const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('userId');
  window.location = 'login.html';
}

// source: https://stackoverflow.com/a/494348
const htmlToElement = (html) => {
  var template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

const fetchMenu = ({search="", foodCount=10, offset=0}) => {
  return new Promise((resolve, reject) => {
    const hostUrl = 'https://fast-food-fast-adc.herokuapp.com/api/v1';
    fetch(`${hostUrl}/menu?offset=${offset}&&limit=${foodCount}&&search=${search}`)
    .then(response => response.json())
    .catch(error => reject('Request failed'))
    .then(response => {
      if (!response.status) { return reject('Request failed') }
      resolve(response.result);
    });
  })
}

const populateMenu = (foodList, parentNode) => {
  return new Promise((resolve, reject) => {
    if (foodList.length == 0) { 
      return reject("No items match your search");
    }
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
    resolve(parentNode.innerHTML = item);
  })
}

const fadeOut = (element) => {
  element.classList.add('fade');
  window.setTimeout(() => {
    element.classList.add('shrink');
  }, 600)
  window.setTimeout(() => {
    element.classList.add('hidden');
  }, 1100)
}

const showMessage = (message, status = "failure") => {
  if (document.querySelector('.pop-up')) {
    hideMessage();
  }
  const elem = htmlToElement(`<div class="pop-up ${status}">
    <p>${message}</p></div>`);

  nav.after(elem);
  localStorage.setItem("msgTimeout", setTimeout(hideMessage, 2000));
}

const hideMessage = () => {
  window.clearTimeout(localStorage.msgTimeout);
  document.querySelector('.pop-up').remove();
}

const search = (value) => {
  if (!value) {
    return showMessage("Enter a search value");
  }
  fetchMenu({search: value})
    .then((result) => {
      populateMenu(result, list)
      .then((v) => {
        searchInput.value = "";
        window.location = '#menu-section';
      })
      .catch((error) => {
        showMessage(error);
      });
    })
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
