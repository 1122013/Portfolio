const header = document.getElementById('mainHeader');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const bottomActive = document.getElementById('bottomActive');
const bottomBar = document.getElementById('bottomBar');
const navItems = document.querySelectorAll('.headerBar, .menuItem');

function setActivePage(pageName) {
    navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageName);
    });
    if (bottomActive) bottomActive.textContent = pageName;
}

function normalizePath(pathname) {
    return pathname.replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase();
}

function markActiveFromUrl() {
    const currentPath = normalizePath(location.pathname);
    let activeItem = null;

    navItems.forEach(item => {
        const href = item.dataset.href;
        if (!href) return;
        const url = new URL(href, location.href);
        const samePath = normalizePath(url.pathname) === currentPath;
        const sameHash = url.hash === location.hash;
        if (samePath && (!url.hash || sameHash)) activeItem = item;
    });

    if (activeItem) setActivePage(activeItem.dataset.page);
}

function isHomePage() {
    const currentPath = normalizePath(location.pathname);
    return currentPath.endsWith('/index.html') || currentPath.endsWith('/');
}

function updateHomeSectionActive() {
    if (!isHomePage()) return;
    const projectSection = document.getElementById('sec-projects');
    if (!projectSection) {
        setActivePage('\u9996\u9801');
        return;
    }

    const rect = projectSection.getBoundingClientRect();
    const projectIsCurrent = rect.top <= window.innerHeight * 0.45 && rect.bottom > window.innerHeight * 0.28;
    setActivePage(projectIsCurrent ? '\u4f5c\u54c1' : '\u9996\u9801');
}

window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    updateHomeSectionActive();
}, { passive: true });

window.addEventListener('hashchange', () => {
    window.setTimeout(updateHomeSectionActive, 0);
});

window.addEventListener('load', () => {
    updateHomeSectionActive();
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        setActivePage(item.dataset.page);
        if (mobileMenu) mobileMenu.classList.remove('open');
        if (menuToggle) {
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
        if (item.dataset.href) location.href = item.dataset.href;
    });
});

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        menuToggle.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

document.addEventListener('click', e => {
    if (bottomBar && mobileMenu && !bottomBar.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        if (menuToggle) {
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }
});

markActiveFromUrl();
updateHomeSectionActive();
