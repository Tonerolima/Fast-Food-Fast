const form = document.getElementById('myForm');

form.addEventListener("submit", (event) => {
  event.preventDefault();
  login(event.target);
});