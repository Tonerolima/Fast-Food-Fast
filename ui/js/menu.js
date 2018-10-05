const hlist = document.querySelector('.horizontal.list');

fetchMenu(10, 0, hlist);

hlist.addEventListener('click', (event) => {
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