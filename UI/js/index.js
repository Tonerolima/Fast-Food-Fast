const toggler = document.getElementById('nav-toggle');
const linksWrapper = document.querySelector('.nav-links-wrapper');
const nav = document.querySelector('#navbar');

const openMenu = () => {
    toggler.classList.remove('fa-bars');
    toggler.classList.add('fa-times', 'white');
    linksWrapper.classList.add('animate');
}

const closeMenu = () => {
    toggler.classList.remove('fa-times', 'white');
    toggler.classList.add('fa-bars');
    linksWrapper.classList.remove('animate');
}

const toggleAuthLinks = () => {
  if (checkToken) {
    document.querySelector('.nav-links:nth-of-type(2)').innerHTML = '<li id="logout"><a href="#">Logout</a></li>';
    document.getElementById('logout').addEventListener('click', (event) => {
      logout();
    })
  }
}

const checkToken = () => {
  if (localStorage.getItem('authToken')) {
    return true;
  }
  return false;
}

const createCart = () => {
  if (!localStorage.cart) {
    localStorage.cart = '[]';
    console.log(localStorage.cart);
  }
}

const addToCart = (food) => {
  const cart = new Map(JSON.parse(localStorage.cart));
  const { id } = food;
  const properties = (({ name, image, cost}) => ({name, image, cost}))(food);
  cart.set(id, properties);
  localStorage.cart = JSON.stringify(Array.from(cart.entries()));
  console.log(localStorage.cart);
}

const removeFromCart = async (foodId) => {
  const cart = new Map(JSON.parse(localStorage.cart));
  await cart.delete(foodId);
  localStorage.cart = JSON.stringify(Array.from(cart.entries()));
  console.log(localStorage.cart);
}

const checkCartForItem = (foodId) => {
  const cart = new Map(JSON.parse(localStorage.cart));
  return cart.has(foodId);
}

const checkout = ([...foodId]) => {
  for (food in arguments) {
    const XHR = new XMLHttpRequest();

    XHR.addEventListener("load", (event) => {
      let response = JSON.parse(event.target.responseText);
      if (event.target.status === 201) { 
        console.log(response.result);
      }
    });

    XHR.open('POST', 'http://localhost:8080/api/v1/orders');
    XHR.send(food);
  }
}

const logout = () => {
  localStorage.removeItem('authToken');
  window.location = 'file:///C:/Users/toner/webdev/UI/Fast-Food-Fast/UI/login.html';
}

const login = (data) => {
  const XHR = new XMLHttpRequest();

  const formData = new FormData(data);

  // Define what happens on successful data submission
  XHR.addEventListener("load", (event) => {
    let response = JSON.parse(event.target.responseText);
    if (!response.status) { return alert(response.message); }
    localStorage.setItem('authToken', response.token);
    window.location = 'file:///C:/Users/toner/webdev/UI/Fast-Food-Fast/UI/index.html';
  });

  // Define what happens in case of error
  XHR.addEventListener("error", (event) => {
    alert('Oops! Something went wrong.');
  });

  // Set up our request
  XHR.open(data.method, data.action);

  // The data sent is what the user provided in the form
  XHR.send(formData);
}

toggler.addEventListener('click', function () {
    if (!linksWrapper.classList.contains('animate')) {
        openMenu();
    } else {
        closeMenu();
    }
})

toggleAuthLinks();
createCart();
