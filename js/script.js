// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('open'));
});

// ===== HERO SLIDER =====
const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;
setInterval(() => {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}, 5000);

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
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
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

// ===== TESTIMONIALS SLIDER =====
const track = document.getElementById('testimonialTrack');
const cards = document.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('sliderDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentTestimonial = 0;
let itemsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

const updateSlider = () => {
  itemsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const totalSlides = Math.ceil(cards.length / itemsPerView);
  if (currentTestimonial >= totalSlides) currentTestimonial = totalSlides - 1;
  const cardWidth = track.parentElement.offsetWidth;
  track.style.transform = `translateX(-${currentTestimonial * (cardWidth + 28)}px)`;
  document.querySelectorAll('.dot').forEach((dot, i) => dot.classList.toggle('active', i === currentTestimonial));
};

// Create dots
const totalSlides = Math.ceil(cards.length / itemsPerView);
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => { currentTestimonial = i; updateSlider(); });
  dotsContainer.appendChild(dot);
}

prevBtn.addEventListener('click', () => {
  const total = Math.ceil(cards.length / itemsPerView);
  currentTestimonial = (currentTestimonial - 1 + total) % total;
  updateSlider();
});
nextBtn.addEventListener('click', () => {
  const total = Math.ceil(cards.length / itemsPerView);
  currentTestimonial = (currentTestimonial + 1) % total;
  updateSlider();
});
window.addEventListener('resize', updateSlider);

// Auto slide testimonials
setInterval(() => {
  const total = Math.ceil(cards.length / itemsPerView);
  currentTestimonial = (currentTestimonial + 1) % total;
  updateSlider();
}, 4000);

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
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .gallery-item, .testimonial-card, .contact-card, .about-content, .about-images').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(el);
});
