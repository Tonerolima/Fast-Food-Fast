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

const toggleAuthLinks = () => {
  const navLinks = document.querySelector('.nav-links:nth-of-type(2)');
  if (checkToken()) {
    navLinks.innerHTML = '<li id="logout"><a href="#">Logout</a></li>';
    document.getElementById('logout').addEventListener('click', (event) => {
      logout();
    })
  }
}

const createCart = () => {
  if (!localStorage.cart) {
    localStorage.cart = '[]';
    console.log(localStorage.cart);
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
  return retrieveCart().has(foodId);
}

const logout = () => {
  localStorage.removeItem('authToken');
  window.location = 'login.html';
}

const htmlToElement = (html) => {
  var template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

openToggler.addEventListener('click', (event) => {
  event.stopImmediatePropagation();
  openMenu();
})

closeToggler.addEventListener('click', (event) => {
  closeMenu();
})

toggleAuthLinks();
createCart();
