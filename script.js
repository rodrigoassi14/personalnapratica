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
        const navHeight = navbar.offsetHeight;
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
    const restartBtn = document.getElementById('quiz-restart');
    const progressBars = progressEl ? Array.from(progressEl.querySelectorAll('.quiz-bar')) : [];

    const questions = [
      {
        id: 'obstacle',
        text: 'Qual é o seu maior problema hoje?',
        options: [
          { label: 'Ouvir “está caro” dos alunos', value: 'price' },
          { label: 'Não saber atrair clientes novos', value: 'acquisition' },
          { label: 'Perder alunos na sazonalidade', value: 'seasonality' },
          { label: 'Não saber entrar no digital', value: 'digital' }
        ]
      },
      {
        id: 'goal',
        text: 'Quanto você quer faturar por mês?',
        options: [
          { label: 'R$ 3.000 – R$ 5.000', value: '3-5' },
          { label: 'R$ 5.000 – R$ 8.000', value: '5-8' },
          { label: 'R$ 8.000 – R$ 12.000', value: '8-12' },
          { label: 'Mais de R$ 12.000', value: '12+' }
        ]
      },
      {
        id: 'stage',
        text: 'Qual descreve melhor sua situação hoje?',
        options: [
          { label: 'Tenho alunos, mas falta previsibilidade', value: 'unstable' },
          { label: 'Minha agenda está lotada, mas ganho pouco', value: 'busy_low' },
          { label: 'Estou começando / tenho poucos alunos', value: 'starting' },
          { label: 'Quero estruturar o digital sem bagunçar o presencial', value: 'hybrid' }
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
      const obstacle = answers.obstacle;
      const goal = answers.goal;
      const stage = answers.stage;

      const goalText = goal === '12+'
        ? 'mais de R$ 12.000'
        : goal
          ? `R$ ${goal.replace('-', '.000 – R$ ')}.000`
          : '';

      const stageHint = stage === 'starting'
        ? 'O foco inicial é montar base e rotina de execução para ganhar tração rápido.'
        : stage === 'busy_low'
          ? 'O próximo passo é aumentar margem: posicionamento, oferta e percepção de valor.'
          : stage === 'hybrid'
            ? 'O próximo passo é criar estrutura e produto digital sem perder o controle do presencial.'
            : 'O próximo passo é criar previsibilidade com processo de captação, vendas e retenção.';

      if (obstacle === 'price') {
        return `Você precisa aprender a comunicar valor antes de tentar cobrar mais. A trilha de Marketing e Vendas te mostra como posicionar seu serviço, lidar com a objeção “está caro” e fechar alunos sem desconto. Meta de ${goalText || 'crescimento'} fica muito mais possível quando você tem processo. ${stageHint}`;
      }

      if (obstacle === 'acquisition') {
        return `Seu gargalo principal é captação de clientes. Você precisa de um sistema simples e repetível para atrair leads, conversar com segurança e transformar interesse em aluno. Meta de ${goalText || 'crescimento'} fica mais leve quando existe fluxo constante. ${stageHint}`;
      }

      if (obstacle === 'seasonality') {
        return `Seu gargalo principal é previsibilidade. Você precisa de uma estratégia de retenção + rotina comercial para não depender de “boa fase”. Meta de ${goalText || 'crescimento'} vira consequência quando você controla agenda e recorrência. ${stageHint}`;
      }

      return `Seu gargalo principal é entrar no digital com clareza. Você precisa de uma estrutura que valide oferta, organize conteúdo e gere vendas sem travar o presencial. Meta de ${goalText || 'crescimento'} fica mais próxima quando você tem um caminho simples de implementação. ${stageHint}`;
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLandingPage);
} else {
  initLandingPage();
}
