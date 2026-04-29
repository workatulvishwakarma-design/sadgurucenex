/* ============================================================
   SADGURU CONSULTANCY & SERVICES — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- Preloader ---
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('loaded'), 600);
    });
    setTimeout(() => preloader.classList.add('loaded'), 3000);
  }

  // --- Sticky Navbar ---
  const navbar = document.querySelector('.navbar-main');
  const topStrip = document.querySelector('.top-strip');
  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      if (topStrip) topStrip.style.display = 'none';
    } else {
      navbar.classList.remove('scrolled');
      if (topStrip) topStrip.style.display = '';
    }
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // --- Active Nav Link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-main .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === '/' + currentPage || href === currentPage || (currentPage === '' && href === '/index.html'))) {
      link.classList.add('active');
    }
  });

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('revealed'), parseInt(delay));
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- AOS Init (if loaded) ---
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      disable: 'mobile'
    });
  }

  // --- CountUp Animation ---
  const counterElements = document.querySelectorAll('[data-countup]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.dataset.countup);
        const suffix = entry.target.dataset.suffix || '';
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();
        function animate(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(start + (target - start) * eased);
          entry.target.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
      }
    });
  }, { threshold: 0.5 });
  counterElements.forEach(el => counterObserver.observe(el));

  // --- Scroll to Top ---
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- FAQ Accordion (Bootstrap handles main toggle, we add smooth height) ---
  document.querySelectorAll('.faq-accordion .accordion-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      document.querySelectorAll('.faq-accordion .accordion-item').forEach(i => {
        if (i !== item) i.style.borderColor = '';
      });
      if (!btn.classList.contains('collapsed')) {
        item.style.borderColor = 'var(--clr-accent)';
      }
    });
  });

  // --- Contact Form ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('is-invalid');
          valid = false;
        } else {
          field.classList.remove('is-invalid');
        }
      });
      const emailField = contactForm.querySelector('[type="email"]');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.classList.add('is-invalid');
        valid = false;
      }
      const phoneField = contactForm.querySelector('[type="tel"]');
      if (phoneField && phoneField.value && !/^[\d\s\-\+\(\)]{7,15}$/.test(phoneField.value)) {
        phoneField.classList.add('is-invalid');
        valid = false;
      }
      if (valid) {
        contactForm.style.display = 'none';
        const success = document.querySelector('.form-success');
        if (success) success.style.display = 'block';
      }
    });
    contactForm.querySelectorAll('.form-control, .form-select').forEach(field => {
      field.addEventListener('input', () => field.classList.remove('is-invalid'));
    });
  }

  // --- GSAP Animations (if loaded) ---
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero title split animation
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const words = heroTitle.innerHTML.split(' ');
      heroTitle.innerHTML = words.map(w =>
        w.includes('highlight') ? w : `<span class="gsap-word" style="display:inline-block;opacity:0;transform:translateY(30px)">${w}</span>`
      ).join(' ');
      gsap.to('.gsap-word', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power3.out',
        delay: 0.5
      });
    }

    // Parallax on hero visual
    const heroVisual = document.querySelector('.hero-visual-inner');
    if (heroVisual) {
      gsap.to(heroVisual, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }
  }

  // --- Swiper Init (if loaded) ---
  if (typeof Swiper !== 'undefined') {
    const testimonialSwiper = document.querySelector('.testimonial-swiper');
    if (testimonialSwiper) {
      new Swiper('.testimonial-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }
      });
    }
  }

  // --- Lenis Smooth Scroll (if loaded) ---
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // --- Vanilla Tilt (if loaded) ---
  if (typeof VanillaTilt !== 'undefined') {
    document.querySelectorAll('.tilt-card').forEach(card => {
      VanillaTilt.init(card, {
        max: 5,
        speed: 400,
        glare: true,
        'max-glare': 0.08
      });
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Mobile menu close on link click ---
  const navCollapse = document.querySelector('.navbar-collapse');
  if (navCollapse) {
    document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)').forEach(link => {
      link.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      });
    });
  }

  // --- Dynamic Year in Footer ---
  const yearEl = document.querySelector('.current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Intersection Observer for staggered card animations ---
  const staggerContainers = document.querySelectorAll('[data-stagger]');
  staggerContainers.forEach(container => {
    const items = container.children;
    Array.from(items).forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      item.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
    });
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(items).forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        }
      });
    }, { threshold: 0.1 });
    staggerObserver.observe(container);
  });

  // --- Client Logos Rendering ---
  const clientLogosContainer = document.getElementById('clientLogosContainer');
  if (clientLogosContainer) {
    const logos = [
      "imgi_1_logo1.png", "imgi_2_Aashis products logo.jpg", "imgi_3_Ahimasa Indl.jpg", 
      "imgi_4_And designs India Ltd.logo.jpg", "imgi_5_Anuja Media.jpg", "imgi_6_Camlin.png",
      "imgi_7_chromatopak.jpg", "imgi_8_Cleanmax.jpg", "imgi_9_Cold weld Engineers Pvt. ltd. logo.gif",
      "imgi_10_Damin Corporate Pvt Ltd logo.png", "imgi_11_Decolab India Pvt Ltd.logo.jpg", "imgi_12_Designer watches logo.jpg",
      "imgi_13_Dodia.jpg", "imgi_14_Encube Ethicals Pvt. Ltd. logo.jpg", "imgi_15_Fabricons.jpg",
      "imgi_16_Farha Khan Fine Jewellery Pvt Ltsd.logo.gif", "imgi_17_Frost International Ltd.logo.jpg", "imgi_18_G R Infrastructure Pvt Ltd.logo.png",
      "imgi_19_gandhi-automations-logo.gif", "imgi_20_Hiraprint solution.jpg", "imgi_21_House of Anita dongre ltd. logo.png",
      "imgi_22_Juhu beach.png", "imgi_23_Jw airport.png", "imgi_24_KCR Industries logo.jpg",
      "imgi_25_logo_rebs Lubrication India Pvt ltd.png", "imgi_26_M U Jewellers Pvt Ltd.logo.jpg", "imgi_27_Narendra Plastic Pvt Ltd.logo.gif",
      "imgi_28_nexus-pneumatics-logo.jpg", "imgi_29_Niranjan paints Pvt Ltd. logo.png", "imgi_30_Nirvana lighting.png",
      "imgi_31_P.H.Healthcare Pvt Ltd.logo.png", "imgi_32_Pallazzio hotels.jpg", "imgi_33_Panama Petrochem Logo.jpg",
      "imgi_34_Patvin Engineering Pvt Ltd.logo.jpg", "imgi_35_Pednekar Jewellers.logo.jpg", "imgi_36_pulz Electronics logoblack.png",
      "imgi_37_Reliable Industreis. logo.jpg", "imgi_39_Retail Light techniques India Limited.logo.png", "imgi_40_Ronald Armstrong-logo.png",
      "imgi_41_Sopher & co.logo.png", "imgi_42_Steel-O-fab engineers.logo.jpg", "imgi_43_sterling logo.jpg",
      "imgi_44_The Associated auto parts Pvt Ltd.logo.png", "imgi_45_V M Muslankar & Sons Pvt Ltd.logo.png", "imgi_46_Victorinox.jpg",
      "imgi_47_Whirlybird Electronics Pvt Ltd.logo.gif", "imgi_48_The Leela Hotel.jpg", "imgi_49_Kalpataru's.jpg"
    ];

    clientLogosContainer.innerHTML = logos.map((logo, index) => `
      <div class="client-logo-item">
        <img src="assets/images/client/${logo}" alt="Trusted Client Partner" loading="lazy">
      </div>
    `).join('');
  }

});
