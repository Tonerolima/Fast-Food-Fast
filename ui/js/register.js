const form = document.getElementById('myForm');

form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const myInit = { method: 'POST', body:  new FormData(event.target)}
  const request = new Request(event.target.action, myInit);
  
  fetch(request)
  .then(response => response.json())
  .catch(error => showMessage(error, 'failure'))
  .then(response => {
    if (!response.status) { return showMessage(response.result || response.message, 'failure') }
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('isAdmin', response.result.isadmin);
    showMessage(response.message, 'success');
    setTimeout(() => {
      window.location = 'index.html';
    }, 3000)
  });
});
