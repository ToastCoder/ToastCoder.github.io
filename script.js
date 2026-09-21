const revealElements = document.querySelectorAll('.reveal');
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const year = document.querySelector('#year');

if (year) year.textContent = new Date().getFullYear();

const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 })
    : null;

revealElements.forEach((element) => {
    if (revealObserver) revealObserver.observe(element);
    else element.classList.add('is-visible');
});

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isOpen));
        menuToggle.classList.toggle('is-open', !isOpen);
        mobileMenu.classList.toggle('is-open', !isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
    }));
}

const updateScrollProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
};

const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const activeSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
            }
        });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((section) => activeSectionObserver.observe(section));
}

const glow = document.createElement('div');
glow.className = 'cursor-glow';
document.body.appendChild(glow);
window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
});

const consoleCard = document.querySelector('.hero-console');
if (consoleCard && window.matchMedia('(pointer: fine)').matches) {
    consoleCard.addEventListener('pointermove', (event) => {
        const rect = consoleCard.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        consoleCard.style.transform = `perspective(700px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-4px)`;
    });
    consoleCard.addEventListener('pointerleave', () => { consoleCard.style.transform = ''; });
}
