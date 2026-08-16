/* ==========================================================================
   PRATEEK DHAR DWIVEDI — PORTFOLIO CORE INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initTypingEffect();
  initTechMarquee();
  initStatsObserver();
  initSkillSearch();
  initCommandPalette();
  initCursorGlow();
  initNavScroll();
});

/* --------------------------------------------------------------------------
   1. NEURAL PARTICLE CANVAS PHYSICS
   -------------------------------------------------------------------------- */
function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 70;
  const maxDistance = 140;

  const mouse = { x: null, y: null, radius: 180 };

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? '#eab308' : '#fef3c7';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse attraction / push physics
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(234, 179, 8, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. DYNAMIC TYPING EFFECT
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const typingElem = document.getElementById('typingText');
  if (!typingElem) return;

  const phrases = [
    'Machine Learning Pipelines',
    'NLP Transformers & DistilBERT Models',
    'Full-Stack MERN Applications',
    'FastAPI & Flask Backends',
    'Responsive Web Systems'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElem.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typingElem.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   3. TECH MARQUEE SLIDER
   -------------------------------------------------------------------------- */
function initTechMarquee() {
  const track = document.getElementById('techTrack');
  if (!track) return;

  const techs = [
    { name: 'Python', icon: 'devicon-python-plain colored' },
    { name: 'React.js', icon: 'devicon-react-original colored' },
    { name: 'FastAPI', icon: 'devicon-fastapi-plain colored' },
    { name: 'Node.js', icon: 'devicon-nodejs-plain colored' },
    { name: 'MongoDB', icon: 'devicon-mongodb-plain colored' },
    { name: 'C++', icon: 'devicon-cplusplus-plain colored' },
    { name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
    { name: 'MySQL', icon: 'devicon-mysql-plain colored' },
    { name: 'Vercel', icon: 'devicon-vercel-original' }
  ];

  const doubleTechs = [...techs, ...techs, ...techs];

  track.innerHTML = doubleTechs.map(t => `
    <div class="tech-pill">
      <i class="${t.icon}"></i>
      <span>${t.name}</span>
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   4. STATS COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initStatsObserver() {
  const statCards = document.querySelectorAll('.stat-num');
  if (!statCards.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statCards.forEach(card => {
          const target = parseFloat(card.getAttribute('data-target'));
          const isDecimal = card.getAttribute('data-decimal') === 'true';
          let count = 0;
          const duration = 1500;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              card.textContent = isDecimal ? target.toFixed(1) : Math.floor(target);
              clearInterval(timer);
            } else {
              card.textContent = isDecimal ? count.toFixed(1) : Math.floor(count);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);
}

/* --------------------------------------------------------------------------
   5. SKILL FILTER & SEARCH
   -------------------------------------------------------------------------- */
function initSkillSearch() {
  const input = document.getElementById('skillSearch');
  if (!input) return;

  input.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const items = document.querySelectorAll('.skill-pill-tag');

    items.forEach(item => {
      const name = item.getAttribute('data-name').toLowerCase();
      if (name.includes(term)) {
        item.style.display = 'inline-flex';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. PROJECT FILTERING
   -------------------------------------------------------------------------- */
function filterProjects(btn, category) {
  playSound('click');
  document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    const cats = card.getAttribute('data-cat').split(' ');
    if (category === 'all' || cats.includes(category)) {
      card.style.display = 'flex';
      card.style.animation = 'fadeIn 0.4s ease forwards';
    } else {
      card.style.display = 'none';
    }
  });
}

/* --------------------------------------------------------------------------
   7. PROJECT DEEP DIVE MODALS
   -------------------------------------------------------------------------- */
const projectDetails = {
  truthlens: {
    title: 'TruthLens — AI Misinformation Fact-Checking Platform',
    category: 'Full Stack AI & NLP',
    image: 'assets/truthlens_real.png',
    description: 'TruthLens is an automated claim verification engine. It extracts live news via web scraping, computes TF-IDF document vectors to retrieve relevant evidence, and passes claims into an ONNX-quantized DistilBERT Natural Language Inference (NLI) model to assign truth confidence scores.',
    tech: ['FastAPI', 'DistilBERT NLI', 'ONNX Runtime', 'React.js', 'Node.js', 'Vercel & Render'],
    github: 'https://github.com/Prateek-Dhar-Dwivedi/TruthLens',
    demo: 'https://truth-lens-lemon.vercel.app/'
  },
  cineora: {
    title: 'Cineora — Machine Learning Movie Recommendation System',
    category: 'Full Stack Machine Learning',
    image: 'assets/cineora_real.png',
    description: 'Cineora delivers personalized movie suggestions by implementing content-based vector filtering over TMDB datasets. The backend Flask server calculates cosine similarity matrices across movie genres, overview embeddings, and cast metadata.',
    tech: ['Python', 'Flask', 'React.js', 'TMDB API', 'Pandas & Scikit-learn', 'Render'],
    github: 'https://github.com/Prateek-Dhar-Dwivedi/Movie_Recommender_System_Cineora',
    demo: 'https://movie-recommender-system-cineora-fr.vercel.app/'
  },
  velora: {
    title: 'Velora — AI Job Verification & Recommendation Engine',
    category: 'Full Stack MERN & AI',
    image: 'assets/velora_real.png',
    description: 'Velora combats fraudulent job postings and irrelevant candidate applications. Features resume parsing, match percentage scoring, Google OAuth 2.0 authentication, Cloudinary media upload, and JWT security.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Cloudinary', 'OAuth 2.0'],
    github: 'https://github.com/Prateek-Dhar-Dwivedi/VELORA',
    demo: 'https://velora-ten-puce.vercel.app/'
  },
  mern: {
    title: 'NIELIT MERN Stack Educational Portal',
    category: 'Full Stack Web Platform',
    image: 'assets/mern_real.png',
    description: 'Comprehensive academic management system built for NIELIT. Supports student assignment submissions, teacher grading dashboards, RESTful API endpoints, and user role authorization.',
    tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'REST APIs'],
    github: 'https://github.com/Prateek-Dhar-Dwivedi/NIELIT_MERN',
    demo: 'https://nielit-mern-rho.vercel.app/'
  },
  pythonapp: {
    title: 'NIELIT Python Web System',
    category: 'Python Web Development',
    image: 'assets/pythonapp_real.png',
    description: 'Dynamic web application utilizing Python backend logic, Anvil framework integrations, database management, and structured input form validation.',
    tech: ['Python', 'Anvil Framework', 'Database', 'User Auth'],
    github: 'https://github.com/Prateek-Dhar-Dwivedi/NIELIT_PY',
    demo: 'https://defensive-major-group.anvil.app/'
  },
  portfolio: {
    title: 'Interactive Portfolio System',
    category: 'Frontend Engineering',
    image: 'assets/portfolio_real.png',
    description: 'Personal interactive portfolio built with vanilla HTML5, CSS design tokens, neural particle physics canvas, browser AI model simulators, and Command Palette shortcuts.',
    tech: ['HTML5', 'CSS Tokens', 'JavaScript ES6', 'Canvas API', 'Web Audio API'],
    github: 'https://github.com/Prateek-Dhar-Dwivedi/-Portfolio',
    demo: 'https://prateek-dhar-dwivedi.github.io/-Portfolio/'
  }
};

function openProjectModal(key) {
  playSound('modal');
  const modal = document.getElementById('projectModal');
  const body = document.getElementById('modalBody');

  const p = projectDetails[key];
  if (!p || !modal || !body) return;

  body.innerHTML = `
    <span class="project-category">${p.category}</span>
    <h2 style="font-size: 1.6rem; margin: 0.4rem 0 1rem; color: var(--text-main);">${p.title}</h2>
    <div style="width:100%; max-height:380px; background:rgba(10, 13, 20, 0.95); border-radius:12px; margin-bottom:1.25rem; border:1px solid var(--border-glass); overflow:hidden; display:flex; align-items:center; justify-content:center;">
      <img src="${p.image}?v=10.0" alt="${p.title}" style="width:100%; max-height:380px; object-fit:contain;" />
    </div>
    <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 1.5rem;">${p.description}</p>
    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 0.9rem; color: var(--text-main); margin-bottom: 0.5rem;">Key Architecture &amp; Tech Stack:</h4>
      <div class="project-tags">
        ${p.tech.map(t => `<span>${t}</span>`).join('')}
      </div>
    </div>
    <div style="display:flex; gap:1rem; flex-wrap:wrap;">
      <a href="${p.github}" target="_blank" class="btn btn-primary" style="padding: 0.6rem 1.25rem; font-size: 0.88rem;">View GitHub →</a>
      <a href="${p.demo}" target="_blank" class="btn btn-secondary" style="padding: 0.6rem 1.25rem; font-size: 0.88rem;">Live Launch →</a>
    </div>
  `;

  modal.showModal();
}

function closeProjectModal() {
  playSound('click');
  const modal = document.getElementById('projectModal');
  if (modal) modal.close();
}

/* --------------------------------------------------------------------------
   8. COMMAND PALETTE (CTRL+K / CMD+K)
   -------------------------------------------------------------------------- */
function initCommandPalette() {
  const modal = document.getElementById('cmdModal');
  const triggerBtn = document.getElementById('cmdTriggerBtn');
  const input = document.getElementById('cmdInput');
  const results = document.getElementById('cmdResults');

  if (!modal || !input || !results) return;

  const commands = [
    { label: 'Jump to Featured Projects', action: () => scrollToSection('projects') },
    { label: 'Explore Skills & Tooling', action: () => scrollToSection('skills') },
    { label: 'View Experience & Timeline', action: () => scrollToSection('experience') },
    { label: 'Send Message / Contact', action: () => scrollToSection('contact') },
    { label: 'Toggle Audio Sound FX', action: () => toggleSound() },
    { label: 'Open GitHub Profile', action: () => window.open('https://github.com/Prateek-Dhar-Dwivedi', '_blank') }
  ];

  function renderCommands(filter = '') {
    const term = filter.toLowerCase();
    const filtered = commands.filter(c => c.label.toLowerCase().includes(term));

    results.innerHTML = filtered.map((c, i) => `
      <div class="cmd-item" onclick="executeCmd(${i})">
        <span>${c.label}</span>
        <span class="cmd-kbd">↵ Select</span>
      </div>
    `).join('');

    window._activeCommands = filtered;
  }

  window.executeCmd = function(index) {
    if (window._activeCommands && window._activeCommands[index]) {
      modal.close();
      window._activeCommands[index].action();
    }
  };

  triggerBtn.addEventListener('click', () => {
    playSound('modal');
    modal.showModal();
    renderCommands();
    input.focus();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      playSound('modal');
      if (modal.open) {
        modal.close();
      } else {
        modal.showModal();
        renderCommands();
        input.focus();
      }
    }
  });

  input.addEventListener('input', (e) => {
    renderCommands(e.target.value);
  });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* --------------------------------------------------------------------------
   9. SOUND FX ENGINE (WEB AUDIO API)
   -------------------------------------------------------------------------- */
let soundEnabled = true;

function toggleSound() {
  soundEnabled = !soundEnabled;
  const icon = document.getElementById('soundIcon');
  if (icon) {
    if (soundEnabled) {
      icon.innerHTML = `<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>`;
    } else {
      icon.innerHTML = `<path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`;
    }
  }
  showToast(soundEnabled ? 'Audio FX Enabled' : 'Audio FX Muted');
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'modal') {
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'synth') {
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (err) {
    // AudioContext fallback
  }
}

/* --------------------------------------------------------------------------
   10. TOAST NOTIFICATIONS & CLIPBOARD COPY
   -------------------------------------------------------------------------- */
function copyToClipboard(text, message) {
  playSound('click');
  navigator.clipboard.writeText(text).then(() => {
    showToast(message || 'Copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy.');
  });
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* --------------------------------------------------------------------------
   11. CURSOR GLOW & NAV SCROLL
   -------------------------------------------------------------------------- */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

function initNavScroll() {
  const nav = document.getElementById('mainNav');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}
