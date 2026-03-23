const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const b1 = document.getElementById('b1');
const b2 = document.getElementById('b2');
const b3 = document.getElementById('b3');

burger.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');
  if (isOpen) {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
    b1.style.transform = '';
    b2.style.opacity = '1';
    b3.style.transform = '';
  } else {
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('flex');
    b1.style.transform = 'rotate(45deg) translate(5px, 6px)';
    b2.style.opacity = '0';
    b3.style.transform = 'rotate(-45deg) translate(5px, -6px)';
  }
});