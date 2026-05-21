document.addEventListener('DOMContentLoaded', () => {

  // ===== 导航汉堡菜单 =====
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ===== 导航栏滚动效果 =====
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ===== 评价轮播 =====
  const testimonials = document.querySelectorAll('.testimonial-card');
  const sliderBtns = document.querySelectorAll('.slider-btn');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    testimonials.forEach(card => card.classList.remove('active'));
    sliderBtns.forEach(btn => btn.classList.remove('active'));
    testimonials[index].classList.add('active');
    sliderBtns[index].classList.add('active');
    currentSlide = index;
  }

  sliderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showSlide(parseInt(btn.dataset.index));
      resetSlideInterval();
    });
  });

  function resetSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      showSlide((currentSlide + 1) % testimonials.length);
    }, 5000);
  }

  if (testimonials.length > 0) {
    resetSlideInterval();
  }

  // ===== 滚动渐入动画 =====
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  sections.forEach(section => {
    observer.observe(section);
  });

  // ===== 动态星星背景 =====
  const starsContainer = document.getElementById('stars');

  function createStars() {
    const starCount = window.innerWidth < 768 ? 50 : 100;
    let starsCSS = '';

    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = (Math.random() * 2 + 1).toFixed(1);
      const opacity = (Math.random() * 0.5 + 0.1).toFixed(2);
      const delay = (Math.random() * 5).toFixed(1);
      starsCSS += `radial-gradient(${size}px ${size}px at ${x}% ${y}%, rgba(255,255,255,${opacity}), transparent),\n`;
    }

    starsContainer.style.background = starsCSS.slice(0, -2);
    starsContainer.style.backgroundSize = '100% 100%';
  }

  createStars();

  window.addEventListener('resize', createStars);
});
