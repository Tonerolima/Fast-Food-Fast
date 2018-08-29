const toggler = document.getElementById('nav-toggle');
const linksWrapper = document.querySelector('.nav-links-wrapper');
const nav = document.querySelector('#navbar');

const openMenu = () => {
    toggler.classList.remove('fa-bars');
    toggler.classList.add('fa-times');
    linksWrapper.classList.add('toggleShow');
    if(window.scrollY < 100) nav.className = 'navbar';
    setTimeout(function () {
        linksWrapper.classList.add('animate');
    }, 10)
}

const closeMenu = () => {
    toggler.classList.remove('fa-times');
    toggler.classList.add('fa-bars');
    linksWrapper.classList.remove('animate');
    if (window.scrollY < 100) nav.className = '';
    setTimeout(function () {
        linksWrapper.classList.remove('toggleShow');
    }, 300)
}

toggler.addEventListener('click', function () {
    if (!linksWrapper.classList.contains('toggleShow')) {
        openMenu();
    } else {
        closeMenu();
    }
})

window.onscroll = () => {
    this.scrollY <= 100 ? nav.className = '': nav.className = 'navbar';
};