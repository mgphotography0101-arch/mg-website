// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Create overlay
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

const openMenu = () => {
  navMenu.classList.add('open');
  hamburger.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};
const closeMenu = () => {
  navMenu.classList.remove('open');
  hamburger.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
};

hamburger.addEventListener('click', () => {
  navMenu.classList.contains('open') ? closeMenu() : openMenu();
});
overlay.addEventListener('click', closeMenu);
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// ===== HERO SLIDER =====
const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

const goToSlide = (index) => {
  slides[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
};

setInterval(() => goToSlide(currentSlide + 1), 5000);

// Touch swipe on hero
let heroTouchStartX = 0;
const heroSection = document.querySelector('.hero');
heroSection.addEventListener('touchstart', e => { heroTouchStartX = e.touches[0].clientX; }, { passive: true });
heroSection.addEventListener('touchend', e => {
  const diff = heroTouchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
}, { passive: true });

// ===== STATS COUNTER =====
const statNums = document.querySelectorAll('.stat-num');
let counted = false;
const countUp = (el) => {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
    else { el.textContent = Math.floor(current); }
  }, 16);
};
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !counted) {
    counted = true;
    statNums.forEach(countUp);
  }
}, { threshold: 0.5 });
if (document.querySelector('.stats-bar')) statsObserver.observe(document.querySelector('.stats-bar'));

// ===== GALLERY FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      if (show) {
        item.classList.remove('hidden');
        item.classList.add('fade-in');
        setTimeout(() => item.classList.remove('fade-in'), 400);
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let currentLightboxIndex = 0;
let visibleItems = [];

const openLightbox = (index) => {
  visibleItems = [...document.querySelectorAll('.gallery-item:not(.hidden)')];
  currentLightboxIndex = index;
  lightboxImg.src = visibleItems[index].dataset.src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
};
const closeLightbox = () => {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
};
const showNext = () => {
  currentLightboxIndex = (currentLightboxIndex + 1) % visibleItems.length;
  lightboxImg.src = visibleItems[currentLightboxIndex].dataset.src;
};
const showPrev = () => {
  currentLightboxIndex = (currentLightboxIndex - 1 + visibleItems.length) % visibleItems.length;
  lightboxImg.src = visibleItems[currentLightboxIndex].dataset.src;
};

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
});
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNext);
lightboxPrev.addEventListener('click', showPrev);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});

// Touch swipe on lightbox
let lbTouchStartX = 0;
lightbox.addEventListener('touchstart', e => { lbTouchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const diff = lbTouchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
}, { passive: true });

// ===== TESTIMONIALS SLIDER =====
const track = document.getElementById('testimonialTrack');
const cards = document.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('sliderDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentTestimonial = 0;
let autoSlideTimer;

const getItemsPerView = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

const updateSlider = () => {
  const ipv = getItemsPerView();
  const totalSlides = Math.ceil(cards.length / ipv);
  if (currentTestimonial >= totalSlides) currentTestimonial = totalSlides - 1;
  const cardWidth = track.parentElement.offsetWidth;
  track.style.transform = `translateX(-${currentTestimonial * (cardWidth + 28)}px)`;
  document.querySelectorAll('.dot').forEach((dot, i) => dot.classList.toggle('active', i === currentTestimonial));
};

const goToTestimonial = (index) => {
  const totalSlides = Math.ceil(cards.length / getItemsPerView());
  currentTestimonial = (index + totalSlides) % totalSlides;
  updateSlider();
  resetAutoSlide();
};

// Create dots
const buildDots = () => {
  dotsContainer.innerHTML = '';
  const totalSlides = Math.ceil(cards.length / getItemsPerView());
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToTestimonial(i));
    dotsContainer.appendChild(dot);
  }
};
buildDots();

prevBtn.addEventListener('click', () => goToTestimonial(currentTestimonial - 1));
nextBtn.addEventListener('click', () => goToTestimonial(currentTestimonial + 1));

window.addEventListener('resize', () => { buildDots(); updateSlider(); }, { passive: true });

// Touch swipe on testimonials
let tTouchStartX = 0;
track.addEventListener('touchstart', e => { tTouchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = tTouchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goToTestimonial(diff > 0 ? currentTestimonial + 1 : currentTestimonial - 1);
}, { passive: true });

const resetAutoSlide = () => {
  clearInterval(autoSlideTimer);
  autoSlideTimer = setInterval(() => goToTestimonial(currentTestimonial + 1), 4000);
};
resetAutoSlide();

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Message Sent!';
  btn.style.background = '#25a244';
  setTimeout(() => {
    btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});

// ===== SCROLL ANIMATIONS =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.service-card, .gallery-item, .testimonial-card, .contact-card, .about-content, .about-images, .stat-item').forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('reveal-delay-1');
  if (i % 3 === 2) el.classList.add('reveal-delay-2');
  revealObserver.observe(el);
});
