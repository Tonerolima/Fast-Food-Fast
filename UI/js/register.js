const form = document.getElementById('myForm');

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendData(event.target);
});

const sendData = (data) => {
  const XHR = new XMLHttpRequest();

  const formData = new FormData(data);

  // Define what happens on successful data submission
  XHR.addEventListener("load", (event) => {
    console.log(event.target.responseText);
  });

  // Define what happens in case of error
  XHR.addEventListener("error", (event) => {
    alert('Oops! Something went wrong.');
  });

  // Set up our request
  XHR.open("POST", "http://localhost:8080/api/v1/signup");

  // The data sent is what the user provided in the form
  XHR.send(formData);
}