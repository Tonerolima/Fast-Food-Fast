const toggler = document.getElementById('nav-button');
const linksWrapper = document.querySelector('.nav-links-wrapper');
const nav = document.querySelector('#navbar');

const openMenu = () => {
    toggler.classList.add('white');
    linksWrapper.classList.add('animate');
}

const closeMenu = () => {
    toggler.classList.remove('white');
    linksWrapper.classList.remove('animate');
}

toggler.addEventListener('click', function () {
    if (!linksWrapper.classList.contains('animate')) {
        openMenu();
    } else {
        closeMenu();
    }
})