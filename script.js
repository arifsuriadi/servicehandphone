/* =============================================
   ARIF SERVICE - Interactive JavaScript
   ============================================= */

// ---- Loading Screen ----
window.addEventListener('load', () => {
  const loader = document.querySelector('.loading-screen');
  setTimeout(() => {
    loader.classList.add('hide');
  }, 1500);
});

// ---- Navbar Scroll Effect ----
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- Mobile Menu Toggle ----
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu when link clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---- Active Nav Link on Scroll ----
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

    if (navLink) {
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        navLink.classList.add('active');
      }
    }
  });
}

window.addEventListener('scroll', highlightNavLink);

// ---- Scroll Reveal Animation ----
const revealElements = document.querySelectorAll('.reveal');

function scrollReveal() {
  const triggerBottom = window.innerHeight * 0.88;

  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < triggerBottom) {
      el.classList.add('active');
    }
  });
}

window.addEventListener('scroll', scrollReveal);
window.addEventListener('load', scrollReveal);

// ---- Counter Animation ----
function animateCounters() {
  const counters = document.querySelectorAll('.counter');

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing: ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(eased * target);
      counter.textContent = currentValue.toLocaleString('id-ID') + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  });
}

// Trigger counter animation when hero stats are in view
const statsSection = document.querySelector('.hero-stats');
let counterAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !counterAnimated) {
      counterAnimated = true;
      animateCounters();
    }
  });
}, { threshold: 0.5 });

if (statsSection) {
  statsObserver.observe(statsSection);
}

// ---- Scroll to Top ----
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Particles Background ----
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.4 + 0.1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.06 * (1 - distance / 150)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  drawLines();
  animationId = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ---- Typing Effect for Tagline ----
const taglineKeywords = ['Aman', 'Cepat', 'Terpercaya'];
const typingElement = document.querySelector('.typing-keyword');
let keywordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentWord = taglineKeywords[keywordIndex];

  if (isDeleting) {
    typingElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 60 : 120;

  if (!isDeleting && charIndex === currentWord.length) {
    typeSpeed = 2000; // Pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    keywordIndex = (keywordIndex + 1) % taglineKeywords.length;
    typeSpeed = 400;
  }

  setTimeout(typeEffect, typeSpeed);
}

if (typingElement) {
  setTimeout(typeEffect, 2000);
}

// ---- Form Handling ----
const contactForm = document.getElementById('contact-form');
const WHATSAPP_NUMBER = '628385522421';
const EMAIL_ADDRESS = 'arifsuriadi05@gmail.com';

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const nama = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const jenisHP = document.getElementById('phone-type').value.trim();
    const serviceSelect = document.getElementById('service-type');
    const layanan = serviceSelect.options[serviceSelect.selectedIndex].text;
    const keluhan = document.getElementById('message').value.trim();

    // Build WhatsApp message
    const waMessage = `Halo Arif Service! 👋\n\n` +
      `Saya ingin konsultasi/service HP:\n\n` +
      `📋 *Detail Pelanggan:*\n` +
      `• Nama: ${nama}\n` +
      `• No. WhatsApp: ${phone}\n` +
      `• Jenis HP: ${jenisHP}\n\n` +
      `🔧 *Jenis Layanan:* ${layanan}\n\n` +
      `💬 *Keluhan/Pesan:*\n${keluhan}\n\n` +
      `Mohon dibantu, terima kasih! 🙏`;

    // Build Email
    const emailSubject = `Permintaan Service HP - ${nama}`;
    const emailBody = `Halo Arif Service,\n\n` +
      `Saya ingin konsultasi/service HP:\n\n` +
      `Detail Pelanggan:\n` +
      `- Nama: ${nama}\n` +
      `- No. WhatsApp: ${phone}\n` +
      `- Jenis HP: ${jenisHP}\n\n` +
      `Jenis Layanan: ${layanan}\n\n` +
      `Keluhan/Pesan:\n${keluhan}\n\n` +
      `Mohon dibantu, terima kasih!`;

    // Open WhatsApp
    const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
    window.open(waURL, '_blank');

    // Also open email (mailto)
    const mailURL = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    setTimeout(() => {
      window.location.href = mailURL;
    }, 1000);

    // Show success feedback
    const btn = contactForm.querySelector('.form-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Pesan Terkirim ke WhatsApp & Email!';
    btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
