const form = document.querySelector('.default-form');
const loginButton = document.querySelector('input[type=submit]');

form.addEventListener("submit", (event) => {
  event.preventDefault();
  loginButton.value = 'Loggin in...';
  loginButton.disabled = true;
  const myInit = { method: 'POST', body:  new FormData(event.target)}
  const request = new Request(event.target.action, myInit);
  
  fetch(request)
  .then(response => response.json())
  .then(response => {
    if (!response.status) {
      loginButton.disabled = false;
      loginButton.value = 'Login';
      return showMessage(response.result || response.message);
    }
    login(response);
  })
  .catch((error) => {
    loginButton.disabled = false;
    loginButton.value = 'Login';
    showMessage('Network error, try reloading the page')
  })
});