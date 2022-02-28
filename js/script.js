const hamburger = document.querySelector('.hamburger')
const navMenu = document.querySelector('.nav-menu')
const navLink = document.querySelectorAll('.nav-link')

const mobileMenu = () => {
    hamburger.classList.toggle('active')
    navMenu.classList.toggle('active')
}

const closeMenu = () => {
    hamburger.classList.remove('active')
    navMenu.classList.remove('active')
}

hamburger.addEventListener('click', mobileMenu)
navLink.forEach((l) => l.addEventListener('click', closeMenu))
