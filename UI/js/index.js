var toggler = document.getElementById('nav-toggle');
var linksWrapper = document.getElementById('nav-links-wrapper');

toggler.addEventListener('click', function () {
    if (!linksWrapper.classList.contains('toggleShow')) {
        toggler.classList.remove('fa-bars');
        toggler.classList.add('fa-times');
        linksWrapper.classList.add('toggleShow');
        setTimeout(function () {
            linksWrapper.classList.add('animate');
        }, 10)
    } else {
        toggler.classList.remove('fa-times');
        toggler.classList.add('fa-bars');
        linksWrapper.classList.remove('animate');
        setTimeout(function () {
            linksWrapper.classList.remove('toggleShow');
        }, 300)
    }
})