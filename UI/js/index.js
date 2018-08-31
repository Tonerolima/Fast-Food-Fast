const toggler = document.getElementById('nav-toggle');
const linksWrapper = document.querySelector('.nav-links-wrapper');
const nav = document.querySelector('#navbar');

const openMenu = () => {
    toggler.classList.remove('fa-bars');
    toggler.classList.add('fa-times');
    linksWrapper.classList.add('animate');
}

const closeMenu = () => {
    toggler.classList.remove('fa-times');
    toggler.classList.add('fa-bars');
    linksWrapper.classList.remove('animate');
}

toggler.addEventListener('click', function () {
    if (!linksWrapper.classList.contains('animate')) {
        openMenu();
    } else {
        closeMenu();
    }
})