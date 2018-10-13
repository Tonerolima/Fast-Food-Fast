const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-form > input');
const searchIcon = document.querySelector('.search-form > i');

window.onscroll = () => {
  if (this.scrollY <= 100) { 
    nav.className = 'landing';
  } else {
    nav.className = '';
  }
};

list.addEventListener('click', (event) => {
  const clicked = event.target;
  if (clicked.tagName === 'BUTTON') {
    if (clicked.classList.contains('decline')) {
      clicked.classList.replace('decline', 'confirm');
      clicked.textContent = 'Add to cart';
      removeFromCart(clicked.dataset.id);
      return;
    }
    addToCart(clicked.dataset);
    clicked.classList.replace('confirm', 'decline');
    clicked.textContent = 'Remove from cart';
  }
});

searchIcon.addEventListener("click", (e) => {
  search(searchInput.value.trim());
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  search(searchInput.value.trim());
})

fetchMenu({}).then((result) => {
  populateMenu(result, list)
    .catch((error) => {
      showMessage(error);
    });
});