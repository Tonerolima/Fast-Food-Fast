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

const retrieveCart = () => {
  return new Map(JSON.parse(localStorage.cart));
}

const resaveCart = (array) => {
  return localStorage.cart = JSON.stringify(Array.from(array.entries()));
}

const addToCart = async (food) => {
  if (!food) { return false }
  const { id } = food;
  const properties = (({ name, image, cost}) => ({name, image, cost}))(food);
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
