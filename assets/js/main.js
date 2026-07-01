/* ============================================================
   MAIN.JS — Shared Logic: Theme, Nav, Scroll, Animations
   Mobile App Development Agency
   ============================================================ */

(function () {
  'use strict';

  /* ── Theme Toggle ──────────────────────────────────────── */
  const THEME_KEY = 'mada-theme';

  function getStoredTheme() {
    return localStorage.getItem(THEME_KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      const iconSpan = btn.querySelector('.theme-icon');
      const textSpan = btn.querySelector('.theme-text');
      if (iconSpan && textSpan) {
        iconSpan.innerHTML = theme === 'dark' ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
        textSpan.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
      } else {
        btn.innerHTML = theme === 'dark' ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
      }
    });
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Initialize
  applyTheme(getStoredTheme());

  document.addEventListener('click', function (e) {
    if (e.target.closest('.theme-toggle')) toggleTheme();
  });

  /* ── RTL Toggle ────────────────────────────────────────── */
  const RTL_KEY = 'mada-dir';

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(RTL_KEY, dir);
    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
      const textSpan = btn.querySelector('.rtl-text');
      if (textSpan) {
        textSpan.textContent = dir === 'rtl' ? 'LTR Layout' : 'RTL Layout';
      } else {
        btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
    });
  }

  function toggleDir() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    applyDir(current === 'rtl' ? 'ltr' : 'rtl');
  }

  applyDir(localStorage.getItem(RTL_KEY) || 'ltr');

  document.addEventListener('click', function (e) {
    if (e.target.closest('.rtl-toggle')) toggleDir();
  });

  /* ── Sticky Navbar ─────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    function updateNav() {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ── Mobile Hamburger ──────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close on nav link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Scroll Reveal (IntersectionObserver) ──────────────── */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealElements.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(el => observer.observe(el));
  }

  /* ── Smooth Count-Up Animation ─────────────────────────── */
  function countUp(el) {
    const target = parseFloat(el.dataset.target || el.textContent.replace(/[^0-9.]/g, ''));
    const suffix = el.dataset.suffix || el.textContent.replace(/[0-9.]/g, '');
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = target * ease;
      el.textContent = (value % 1 === 0 ? Math.floor(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statNumbers = document.querySelectorAll('.stat-number[data-target], .hero-stat-number[data-target]');
  if (statNumbers.length) {
    const statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => statObserver.observe(el));
  }

  /* ── Tabs ──────────────────────────────────────────────── */
  document.querySelectorAll('[data-tabs]').forEach(tabGroup => {
    const buttons = tabGroup.querySelectorAll('.tab-btn');
    const panes   = document.querySelectorAll(`[data-tab-content="${tabGroup.dataset.tabs}"] .tab-pane`);
    buttons.forEach((btn, i) => {
      btn.addEventListener('click', function () {
        buttons.forEach(b => b.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (panes[i]) panes[i].classList.add('active');
      });
    });
  });

  /* ── Tech Carousel Infinite Scroll Duplication ───────────── */
  const techTracks = document.querySelectorAll('.tech-carousel-track');
  techTracks.forEach(track => {
    // Duplicate inner content for seamless infinite scrolling
    track.innerHTML += track.innerHTML;
  });

  /* ── Accordion ─────────────────────────────────────────── */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function () {
      const item = header.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      // Close all in same group
      const group = item.closest('[data-accordion]');
      if (group) {
        group.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
      }
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Filter Buttons (case studies, blog) ───────────────── */
  document.querySelectorAll('.filter-bar').forEach(bar => {
    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        const grid   = document.querySelector(bar.dataset.target);
        if (!grid) return;
        grid.querySelectorAll('[data-category]').forEach(card => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.style.display = show ? '' : 'none';
          if (show) card.classList.add('reveal', 'visible');
        });
      });
    });
  });

  /* ── File Drop Zone ────────────────────────────────────── */
  document.querySelectorAll('.file-drop-zone').forEach(zone => {
    const input = zone.querySelector('input[type="file"]') || document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.style.display = 'none';
    if (!zone.querySelector('input[type="file"]')) zone.appendChild(input);

    zone.addEventListener('click', () => input.click());
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', function (e) {
      e.preventDefault();
      zone.classList.remove('drag-over');
      handleFiles(e.dataTransfer.files, zone);
    });
    input.addEventListener('change', function () { handleFiles(input.files, zone); });
  });

  function handleFiles(files, zone) {
    const list = zone.querySelector('.file-list') || (() => {
      const ul = document.createElement('ul');
      ul.className = 'file-list';
      ul.style.cssText = 'margin-top:12px;list-style:none;text-align:left;font-size:.875rem;';
      zone.appendChild(ul);
      return ul;
    })();
    list.innerHTML = '';
    Array.from(files).forEach(file => {
      const li = document.createElement('li');
      li.style.cssText = 'padding:4px 0;color:var(--text-secondary);display:flex;align-items:center;gap:8px;';
      li.innerHTML = `<span>📄</span><span>${file.name}</span><span style="color:var(--text-muted);margin-left:auto;">${(file.size/1024).toFixed(1)} KB</span>`;
      list.appendChild(li);
    });
    showToast('success', 'Files Selected', `${files.length} file(s) ready to upload`);
  }

  /* ── Form Validation ───────────────────────────────────── */
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        const error = field.closest('.form-group')?.querySelector('.form-error');
        if (!field.value.trim()) {
          field.classList.add('error');
          if (error) { error.textContent = 'This field is required.'; error.classList.add('show'); }
          valid = false;
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          field.classList.add('error');
          if (error) { error.textContent = 'Please enter a valid email address.'; error.classList.add('show'); }
          valid = false;
        } else {
          field.classList.remove('error');
          field.classList.add('success');
          if (error) error.classList.remove('show');
        }
      });
      if (valid) {
        showToast('success', 'Message Sent!', 'We\'ll get back to you within 24 hours.');
        form.reset();
        form.querySelectorAll('.form-control').forEach(f => f.classList.remove('success', 'error'));
      } else {
        showToast('error', 'Validation Error', 'Please fill in all required fields.');
      }
    });
    // Real-time validation
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('blur', function () {
        const error = field.closest('.form-group')?.querySelector('.form-error');
        if (!field.value.trim()) {
          field.classList.add('error'); field.classList.remove('success');
          if (error) { error.textContent = 'This field is required.'; error.classList.add('show'); }
        } else {
          field.classList.remove('error'); field.classList.add('success');
          if (error) error.classList.remove('show');
        }
      });
      field.addEventListener('input', function () {
        if (field.value.trim()) {
          field.classList.remove('error');
          const error = field.closest('.form-group')?.querySelector('.form-error');
          if (error) error.classList.remove('show');
        }
      });
    });
  });

  /* ── Toast Notifications ───────────────────────────────── */
  window.showToast = function (type, title, msg, duration = 4000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('role', 'alert');
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Dismiss">✕</button>`;
    container.appendChild(toast);
    toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));
    if (duration > 0) setTimeout(() => removeToast(toast), duration);
  };

  function removeToast(toast) {
    toast.style.animation = 'none';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all .25s ease';
    setTimeout(() => toast.remove(), 250);
  }

  /* ── Modal ─────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('[data-modal]');
    if (trigger) {
      const modal = document.getElementById(trigger.dataset.modal);
      if (modal) openModal(modal);
    }
    if (e.target.closest('.modal-close') || e.target.classList.contains('modal-overlay')) {
      const overlay = e.target.closest('.modal-overlay') || document.querySelector('.modal-overlay.open');
      if (overlay) closeModal(overlay);
    }
  });

  function openModal(modal) {
    const overlay = modal.closest('.modal-overlay') || modal;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('[autofocus]')?.focus();
  }
  function closeModal(overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
    }
  });

  /* ── Dropdown Toggle (Desktop Click/Touch fallback) ── */
  document.querySelectorAll('.nav-item').forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.nav-dropdown');
    
    if (link && dropdown) {
      link.addEventListener('click', function (e) {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = dropdown.classList.toggle('open');
          link.setAttribute('aria-expanded', isOpen);
          
          // Close other open dropdowns
          document.querySelectorAll('.nav-dropdown.open').forEach(d => {
            if (d !== dropdown) {
              d.classList.remove('open');
              d.previousElementSibling?.setAttribute('aria-expanded', 'false');
            }
          });
        }
      });
    }
  });

  // Close dropdowns on click outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.nav-dropdown.open').forEach(d => {
        d.classList.remove('open');
        d.previousElementSibling?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  /* ── Mobile Menu Dropdown Toggle ───────────────────────── */
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const menu = btn.nextElementSibling;
      if (menu && menu.classList.contains('mobile-dropdown-menu')) {
        const isOpen = menu.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen);
        const arrow = btn.querySelector('.arrow');
        if (arrow) arrow.textContent = isOpen ? '▲' : '▼';
      }
    });
  });

  /* ── Active Nav Highlight ──────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Smooth Scroll for anchor links ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Lazy-load Images ──────────────────────────────────── */
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
  } else {
    // Fallback
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          img.src = img.dataset.src || img.src;
          imgObserver.unobserve(img);
        }
      });
    });
    images.forEach(img => imgObserver.observe(img));
  }

  /* ── Interactive Capabilities Showcase ─────────────────── */
  const showcaseCards = document.querySelectorAll('.showcase-card');
  if (showcaseCards.length) {
    showcaseCards.forEach(card => {
      card.addEventListener('click', function () {
        showcaseCards.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        
        const target = this.getAttribute('data-target');
        const panes = document.querySelectorAll('.screen-pane');
        panes.forEach(pane => pane.classList.remove('active'));
        
        const activePane = document.getElementById('screen-' + target);
        if (activePane) {
          activePane.classList.add('active');
        }
      });
    });
  }

  /* ── Expose utilities ──────────────────────────────────── */
  window.MADA = { showToast, openModal, closeModal, toggleTheme, toggleDir };

  // Load Lucide Icons CDN dynamically
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/lucide@latest';
  script.onload = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };
  document.head.appendChild(script);

})();
