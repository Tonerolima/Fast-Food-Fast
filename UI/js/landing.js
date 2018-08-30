const landingNav = document.querySelector('#navbar');

window.onscroll = () => {
  this.scrollY <= 100 ? landingNav.className = 'landing' : landingNav.className = '';
};