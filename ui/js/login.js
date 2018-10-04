const form = document.getElementById('myForm');

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const myInit = { method: 'POST', body:  new FormData(event.target)}
  const request = new Request(event.target.action, myInit);
  
  fetch(request)
  .then(response => response.json())
  .catch(error => console.log('Request failed', error))
  .then(response => {
    if (!response.status) { return alert(response.message); }
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('isAdmin', response.result.isadmin);
    localStorage.setItem('userId', response.result.id);
    window.location = 'index.html';
  });
});