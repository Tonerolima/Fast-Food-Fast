const list = document.querySelector('.horizontal.list');
const arrow = document.querySelector('.fa-angle-down');

fetchMenu(8, 0, list);

let movedDownIntervalId = setInterval(() => {
  arrow.classList.add('moved-down');
  return setTimeout(() => {
    arrow.classList.remove('moved-down');
  }, 500)
}, 2000);

window.onscroll = () => {
  if (this.scrollY <= 100) { 
    nav.className = 'landing';
  } else {
    nav.className = '';
  }
  window.clearInterval(movedDownIntervalId);
};