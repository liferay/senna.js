var menuButton = document.querySelector('.nav-menu-button');
var nav = document.querySelector('#nav');

menuButton.addEventListener('click', function(e) {
  e.preventDefault();
  nav.classList.toggle('active');
});
