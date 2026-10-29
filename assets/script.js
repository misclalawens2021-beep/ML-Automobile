// ==========================================================================
// ML AUTOMOBILE — script principal (carrousel + galerie + navigation)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initGallery();
  initMobileNav();
  initActiveNavOnScroll();
});

/* -------------------------------------------------------------------- */
/* Carrousel                                                             */
/* -------------------------------------------------------------------- */

function initCarousel() {
  const track = document.getElementById('carousel-track');
  const dotsWrap = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  if (!track) return;

  const slides = Array.from(track.children);
  let index = 0;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 6000;

  // Génère les points de navigation
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Aller au véhicule ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
    resetAutoplay();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(next, AUTOPLAY_DELAY);
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Navigation clavier flèches gauche/droite
  document.querySelector('.carousel').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Support tactile (swipe)
  let touchStartX = 0;
  const trackWrap = document.querySelector('.carousel-track-wrap');
  trackWrap.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  trackWrap.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 40) diff > 0 ? prev() : next();
  }, { passive: true });

  // Pause au survol
  const heroEl = document.querySelector('.hero');
  heroEl.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  heroEl.addEventListener('mouseleave', resetAutoplay);

  render();
  resetAutoplay();
}

/* -------------------------------------------------------------------- */
/* Galerie de véhicules                                                  */
/* -------------------------------------------------------------------- */

// Place tes fichiers images dans un dossier "images/" à la racine du projet.
// Les 4 premiers véhicules utilisent EXACTEMENT les mêmes fichiers que les
// slides du carrousel (voir index.html), afin que galerie et carrousel
// restent parfaitement cohérents visuellement.
const VEHICLES = [
  { name: 'Aurora GT Sedan',   price: '32 900 €', image: './assets/img/Voiture_1.png',    tags: ['Hybride', '310 ch'] },
  { name: 'Terra Voyager',     price: '41 500 €', image: './assets/img/Voiture_2.png',       tags: ['4x4', '7 places'] },
  { name: 'Nyx Coupé RS',      price: '58 200 €', image: './assets/img/Voiture_3.png',        tags: ['Sport', '420 ch'] },
  { name: 'Volt Compact E',    price: '27 400 €', image: './assets/img/Voiture_4.png',      tags: ['Électrique', '420 km'] },
  { name: 'Aurora GT Break',   price: '34 600 €', image: './assets/img/Voiture_5.png',     tags: ['Hybride', 'Break'] },
  { name: 'Terra Voyager Pro', price: '44 900 €', image: './assets/img/Voiture_6.png',   tags: ['4x4', 'Attelage'] },
  { name: 'Nyx Coupé Base',    price: '49 800 €', image: 'images/nyx-coupe-base.jpg',      tags: ['Sport', '350 ch'] },
  { name: 'Volt City',         price: '23 100 €', image: 'images/volt-city.jpg',           tags: ['Électrique', 'Citadine'] }
];

function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = VEHICLES.map(v => `
    <article class="card">
      <img class="card-icon" src="${v.image}" alt="${v.name}" loading="lazy">
      <h4>${v.name}</h4>
      <span class="price">${v.price}</span>
      <div class="tags">${v.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <span class="card-cta">
        Voir la fiche
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </span>
    </article>
  `).join('');
}

/* -------------------------------------------------------------------- */
/* Menu mobile                                                           */
/* -------------------------------------------------------------------- */

function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.style.display === 'flex';
    nav.style.display = isOpen ? 'none' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.top = '72px';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.background = '#05070c';
    nav.style.padding = '16px 32px';
    nav.style.borderBottom = '1px solid #212a3b';
  });
}

/* -------------------------------------------------------------------- */
/* Surbrillance du lien actif au scroll                                  */
/* -------------------------------------------------------------------- */

function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.main-nav a');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}