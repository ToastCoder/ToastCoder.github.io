const revealElements = document.querySelectorAll('.reveal');
const navLinks = document.querySelectorAll('.rail-nav a');
const sections = document.querySelectorAll('main section[id]');
const progress = document.querySelector('.progress');
const clock = document.querySelector('[data-clock]');
const year = document.querySelector('[data-year]');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

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

const updateScroll = () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${height > 0 ? (window.scrollY / height) * 100 : 0}%`;
};
window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();

if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
            }
        });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((section) => activeObserver.observe(section));
}

if (clock) {
    const updateClock = () => {
        clock.textContent = `${new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date())} IST`;
    };
    updateClock();
    window.setInterval(updateClock, 1000);
}

if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
        const open = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!open));
        mobileNav.classList.toggle('open', !open);
        menuToggle.querySelector('span').textContent = open ? '＋' : '－';
    });
    mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
        menuToggle.querySelector('span').textContent = '＋';
    }));
}

const projectCards = document.querySelectorAll('.project-row');
document.querySelectorAll('.filter').forEach((filter) => filter.addEventListener('click', () => {
    const category = filter.dataset.filter;
    document.querySelectorAll('.filter').forEach((button) => button.classList.toggle('active', button === filter));
    projectCards.forEach((card) => {
        const visible = category === 'all' || card.dataset.category === category;
        card.classList.toggle('is-hidden', !visible);
        if (visible) {
            card.classList.remove('is-visible');
            window.requestAnimationFrame(() => card.classList.add('is-visible'));
        }
    });
}));
