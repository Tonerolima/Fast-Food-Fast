const form = document.querySelector('.default-form');
const signupButton = document.querySelector('input[type=submit]');

form.addEventListener("submit", (event) => {
  event.preventDefault();
  signupButton.value = 'Signing up...';
  signupButton.disabled = true;
  const myInit = { method: 'POST', body:  new FormData(event.target)}
  const request = new Request(event.target.action, myInit);
  
  fetch(request)
  .then(response => response.json())
  .then(response => {
    if (!response.status) {
      signupButton.disabled = false;
      signupButton.value = 'Register';
      return showMessage(response.result || response.message);
    }
    login(response);
  })
  .catch((error) => {
    signupButton.disabled = false;
    signupButton.value = 'Register';
    showMessage('Network error, try reloading the page')
  })
});
