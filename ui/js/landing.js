const list = document.querySelector('.horizontal.list');
const arrow = document.querySelector('.fa-angle-down');

fetchMenu(8, 0, list);

window.onscroll = () => {
  if (this.scrollY <= 100) { 
    nav.className = 'landing';
  } else {
    nav.className = '';
  }
};