// ============================================
// PNP — PERSONAL NA PRÁTICA
// Landing Page Interactions
// ============================================

function initLandingPage() {

  // --- Navbar scroll behavior ---
  const navbar = document.getElementById('navbar');
  const floatingCta = document.getElementById('floating-cta');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar background
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Floating CTA visibility on mobile
    if (floatingCta) {
      if (scrollY > 600) {
        floatingCta.style.transform = 'translateY(0)';
        floatingCta.style.opacity = '1';
      } else {
        floatingCta.style.transform = 'translateY(100%)';
        floatingCta.style.opacity = '0';
      }
    }
  }

  // Initialize floating CTA as hidden
  if (floatingCta) {
    floatingCta.style.transform = 'translateY(100%)';
    floatingCta.style.opacity = '0';
    floatingCta.style.transition = 'all 0.3s ease';
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // --- Intersection Observer for scroll animations ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  // --- Count-up animation ---
  const countUpElements = document.querySelectorAll('.count-up');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        if (!target) return;

        let current = 0;
        const duration = 2000; // ms
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current).toLocaleString('pt-BR');
        }, 16);

        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  countUpElements.forEach(el => countObserver.observe(el));

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(i => i.classList.remove('active'));

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navFloatGap = 24; /* margem da navbar fixed top: 24px + margem segura 12px */
        const navHeight = navbar ? (navbar.offsetHeight + navFloatGap) : 96;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  const testimonialPosters = document.querySelectorAll('.video-poster[data-video-src]');
  testimonialPosters.forEach((poster) => {
    poster.addEventListener('click', () => {
      const wrapper = poster.closest('.testimonial-video');
      const videoSrc = poster.getAttribute('data-video-src');
      const videoTitle = poster.getAttribute('data-video-title') || 'Vídeo';
      if (!wrapper || !videoSrc) return;

      const iframe = document.createElement('iframe');
      iframe.src = `${videoSrc}${videoSrc.includes('?') ? '&' : '?'}autoplay=1&rel=0&playsinline=1`;
      iframe.title = videoTitle;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;

      wrapper.innerHTML = '';
      wrapper.appendChild(iframe);
    });
  });

  // --- Video play button interaction ---
  const playBtn = document.querySelector('.video-play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      // Animate the button
      playBtn.style.transform = 'translate(-50%, -50%) scale(0.9)';
      setTimeout(() => {
        playBtn.style.transform = 'translate(-50%, -50%) scale(1)';
      }, 150);

      // Could open a modal with video in the future
      // For now, we'll just add a nice visual feedback
      const wrapper = document.querySelector('.video-wrapper');
      wrapper.style.boxShadow = '0 0 60px rgba(204, 0, 0, 0.4)';
      setTimeout(() => {
        wrapper.style.boxShadow = '';
      }, 500);
    });
  }

  // --- Card hover parallax effect ---
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // --- Particle-like floating dots in hero ---
  function createHeroParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: rgba(204, 0, 0, ${Math.random() * 0.3 + 0.1});
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        z-index: 1;
        pointer-events: none;
        animation: floatParticle ${Math.random() * 6 + 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 4}s;
      `;
      hero.appendChild(particle);
    }

    // Add the keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatParticle {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
        25% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
        50% { transform: translateY(-40px) translateX(-10px); opacity: 0.5; }
        75% { transform: translateY(-20px) translateX(15px); opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);
  }

  createHeroParticles();

  // --- Typewriter effect for hero badge (subtle) ---
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) {
    heroBadge.style.opacity = '0';
    heroBadge.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      heroBadge.style.transition = 'all 0.6s ease';
      heroBadge.style.opacity = '1';
      heroBadge.style.transform = 'translateY(0)';
    }, 500);
  }

  // --- Hero content entrance animation ---
  const heroContent = document.querySelector('.hero-content');
  const heroImage = document.querySelector('.hero-image');

  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateX(-30px)';
    setTimeout(() => {
      heroContent.style.transition = 'all 0.8s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateX(0)';
    }, 300);
  }

  if (heroImage) {
    heroImage.style.opacity = '0';
    heroImage.style.transform = 'translateX(30px)';
    setTimeout(() => {
      heroImage.style.transition = 'all 0.8s ease';
      heroImage.style.opacity = '1';
      heroImage.style.transform = 'translateX(0)';
    }, 500);
  }

  const quizRoot = document.getElementById('quiz-interactive');
  if (quizRoot) {
    const metaEl = document.getElementById('quiz-meta');
    const progressEl = document.getElementById('quiz-progress');
    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');
    const bodyEl = document.getElementById('quiz-body');
    const resultEl = document.getElementById('quiz-result');
    const resultTextEl = document.getElementById('quiz-result-text');
    const ctaEl = document.getElementById('quiz-cta');
    const restartBtn = document.getElementById('quiz-restart');
    const progressBars = progressEl ? Array.from(progressEl.querySelectorAll('.quiz-bar')) : [];

    if (ctaEl) ctaEl.textContent = 'QUERO CONHECER A FORMAÇÃO';

    const questions = [
      {
        id: 'montar_treino',
        text: 'Na hora de montar um treino, qual cenário mais se aproxima da sua realidade?',
        options: [
          { label: 'Tenho raciocínio claro e justifico cada escolha.', value: 'claro' },
          { label: 'Sei muitos exercícios, mas tenho dúvidas para organizar o programa.', value: 'duvidas_organizacao' },
          { label: 'Acabo adaptando treinos prontos ou referências da internet.', value: 'adaptando_prontos' }
        ]
      },
      {
        id: 'periodizar',
        text: 'Como você se sente ao periodizar para objetivos diferentes?',
        options: [
          { label: 'Seguro para estruturar e controlar variáveis.', value: 'seguro' },
          { label: 'Consigo fazer, mas tenho dúvidas sobre progressão e divisão.', value: 'duvidas_progressao' },
          { label: 'Periodização ainda é uma das partes que mais me trava.', value: 'travado' }
        ]
      },
      {
        id: 'diferenca_atuacao',
        text: 'O que mais faria diferença na sua atuação hoje?',
        options: [
          { label: 'Construir meu próprio sistema de treino.', value: 'sistema_proprio' },
          { label: 'Prescrever melhor para emagrecimento e definição.', value: 'prescrever_emagrecimento' },
          { label: 'Adaptar programas para diferentes perfis e níveis.', value: 'adaptar_perfis' }
        ]
      }
    ];

    let currentIndex = 0;
    const answers = {};

    const setProgress = (index) => {
      progressBars.forEach((bar, i) => {
        bar.classList.toggle('is-active', i <= index);
      });
    };

    const getDiagnosisText = () => {
      return 'Seu próximo passo é transformar conhecimento solto em método de aplicação.';
    };

    const renderQuestion = () => {
      const q = questions[currentIndex];
      if (!q) return;

      if (metaEl) metaEl.textContent = `Pergunta ${currentIndex + 1} de ${questions.length}`;
      if (questionEl) questionEl.textContent = q.text;
      if (optionsEl) optionsEl.innerHTML = '';

      setProgress(currentIndex);

      q.options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option';
        btn.textContent = opt.label;
        btn.addEventListener('click', () => {
          answers[q.id] = opt.value;
          Array.from(optionsEl.querySelectorAll('.quiz-option')).forEach((b) => {
            b.disabled = true;
            b.classList.remove('is-selected');
          });
          btn.classList.add('is-selected');
          setTimeout(() => {
            currentIndex += 1;
            if (currentIndex >= questions.length) {
              setProgress(questions.length - 1);
              if (bodyEl) bodyEl.hidden = true;
              if (resultEl) resultEl.hidden = false;
              if (resultTextEl) resultTextEl.textContent = getDiagnosisText();
              return;
            }
            renderQuestion();
          }, 160);
        });
        optionsEl.appendChild(btn);
      });
    };

    const restart = () => {
      currentIndex = 0;
      Object.keys(answers).forEach((k) => delete answers[k]);
      if (resultEl) resultEl.hidden = true;
      if (bodyEl) bodyEl.hidden = false;
      renderQuestion();
    };

    if (restartBtn) restartBtn.addEventListener('click', restart);
    restart();
  }
}

// ============================================================
// SEÇÃO DE VÍDEO — init próprio (FORA da initLandingPage)
// Executa logo após o DOM estar pronto
// ============================================================
(function initVideoSection() {
  if (typeof document === 'undefined') return;

  function run() {
    const wrap = document.getElementById('video-wrap');
    const cover = document.getElementById('video-cover');
    const playCircle = document.getElementById('video-play-circle');
    const iframe = document.getElementById('video-iframe');
    const btn = document.getElementById('btn-assistir');
    if (!wrap || !iframe) return;

    const VIDEO_EMBED = 'https://www.youtube.com/embed/Jaw7QljWhuU';
    const ORIGIN = (window.location.origin || '').replace(/\/$/, '');
    const navbar = document.getElementById('navbar');

    let state = {
      loaded: false,
      playing: false,
      activated: false,
    };

    function activate() {
      if (!state.activated) {
        state.activated = true;
        wrap.classList.add('is-video-active');
      }
    }

    function onYtStateChange(e) {
      try {
        if (!e || !e.data || typeof e.data !== 'string') return;
        const d = JSON.parse(e.data);
        if (!d || d.event !== 'onStateChange') return;
        if (d.info === 1) state.playing = true;
        else if (d.info === 2) state.playing = false;
        else if (d.info === 0) state.playing = false;
      } catch (_) {}
    }
    if (window.addEventListener) window.addEventListener('message', onYtStateChange, false);

    function cmd(funcName) {
      try {
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: funcName, args: [], id: 'pnp-video' }),
            '*'
          );
        }
      } catch (_) {}
    }

    function play() {
      if (!state.loaded) {
        state.loaded = true;
        const qs = [
          'autoplay=1',
          'rel=0',
          'modestbranding=1',
          'playsinline=1',
          'enablejsapi=1',
          ORIGIN ? ('origin=' + encodeURIComponent(ORIGIN)) : '',
          'widgetid=1'
        ].filter(Boolean).join('&');
        iframe.src = VIDEO_EMBED + '?' + qs;
        activate();
        iframe.onload = function () {
          try {
            iframe.contentWindow.postMessage(
              JSON.stringify({ event: 'listening', id: 'pnp-video' }),
              '*'
            );
          } catch (_) {}
        };
        state.playing = true;
        return;
      }
      activate();
      cmd('playVideo');
      state.playing = true;
    }

    function pause() {
      if (!state.loaded) return;
      cmd('pauseVideo');
      state.playing = false;
    }

    function handleToggleClick(e) {
      if (e) { try { e.preventDefault(); } catch (_) {} try { e.stopPropagation(); } catch (_) {} }
      if (state.playing) pause();
      else play();
    }
    if (cover) cover.addEventListener('click', handleToggleClick, false);
    if (playCircle) playCircle.addEventListener('click', handleToggleClick, false);

    if (btn) {
      btn.addEventListener('click', function () {
        play();
        const navFloatGap = 24;
        const navH = (navbar && navbar.offsetHeight) ? (navbar.offsetHeight + navFloatGap + 12) : 96;
        const section = document.getElementById('video');
        if (section) {
          const top = section.getBoundingClientRect().top + window.pageYOffset - navH;
          try { window.scrollTo({ top: top, behavior: 'smooth' }); } catch (_) { window.scrollTo(0, top); }
        }
      }, false);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, false);
  } else {
    run();
  }
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLandingPage);
} else {
  initLandingPage();
}
