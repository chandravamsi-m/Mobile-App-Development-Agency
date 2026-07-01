/* ============================================================
   NAV.JS — Global Navbar & Footer Injection
   Single source of truth — edit here, updates everywhere.
   ============================================================ */
(function () {
  'use strict';

  /* ── Detect current page ─────────────────────────────────── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const heroPages = ['index.html', 'index-2.html', ''];
  const navClass = heroPages.includes(page) ? 'navbar navbar-hero' : 'navbar navbar-solid';

  /* ── Active link helper ──────────────────────────────────── */
  function isActive(href) {
    return page === href ? 'active' : '';
  }
  function isActiveHome() {
    return (page === 'index.html' || page === 'index-2.html' || page === '') ? 'active' : '';
  }

  /* ── Navbar HTML ─────────────────────────────────────────── */
  const NAV_HTML = `
<a href="#main" class="skip-link">Skip to main content</a>

<nav class="${navClass}" id="main-navbar" role="navigation" aria-label="Main navigation">
  <div class="container">
    <div class="navbar-inner">
      <a href="index.html" class="nav-logo" aria-label="AppForge home">
        <div class="nav-logo-icon" aria-hidden="true" style="background:transparent;padding:0;width:38px;height:38px;">
          <img src="assets/images/logo.svg" alt="" style="width:100%;height:100%;display:block;">
        </div>
        <span>App<span class="text-gradient">Forge</span></span>
      </a>
      <div class="nav-menu" role="menubar">
        <div class="nav-item">
          <a href="#" class="nav-link ${isActiveHome()}" role="menuitem" aria-haspopup="true" aria-expanded="false">
            Home <span style="font-size:0.6rem;margin-left:2px;">▼</span>
          </a>
          <div class="nav-dropdown" role="menu">
            <a href="index.html" class="nav-dropdown-item" role="menuitem"><i data-lucide="layout"></i> Home 1 (Split Hero)</a>
            <a href="index-2.html" class="nav-dropdown-item" role="menuitem"><i data-lucide="sparkles"></i> Home 2 (SaaS Premium)</a>
          </div>
        </div>
      <a href="services.html"     class="nav-link ${isActive('services.html')}"     role="menuitem">Services</a>
      <a href="case-studies.html" class="nav-link ${isActive('case-studies.html')}" role="menuitem">Case Studies</a>
      <a href="blog.html"         class="nav-link ${isActive('blog.html')}"         role="menuitem">Blog</a>
      <a href="about.html"        class="nav-link ${isActive('about.html')}"        role="menuitem">About</a>
      <a href="contact.html"      class="nav-link ${isActive('contact.html')}"      role="menuitem">Contact</a>
      <div class="nav-item">
        <a href="#" class="nav-link ${isActive('dashboard.html') || isActive('admin.html')}" role="menuitem" aria-haspopup="true" aria-expanded="false">
          Dashboard <span style="font-size:0.6rem;margin-left:2px;">▼</span>
        </a>
        <div class="nav-dropdown" role="menu">
          <a href="dashboard.html" class="nav-dropdown-item" role="menuitem"><i data-lucide="layout-dashboard"></i> Client Dashboard</a>
          <a href="admin.html" class="nav-dropdown-item" role="menuitem"><i data-lucide="settings"></i> Admin Dashboard</a>
        </div>
      </div>
    </div>
    <div class="nav-actions">
      <button class="rtl-toggle" aria-label="Toggle RTL layout">RTL</button>
      <button class="theme-toggle" aria-label="Toggle theme"><i data-lucide="moon"></i></button>
      <a href="login.html"   class="btn btn-primary btn-sm">Login</a>
    </div>
    <button class="hamburger" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</div>
</nav>

<div class="mobile-menu" id="mobile-menu" role="navigation" aria-label="Mobile navigation">
<div class="mobile-nav-item">
  <button class="mobile-dropdown-toggle" aria-expanded="false"><i data-lucide="home"></i> Home <span class="arrow" style="font-size:0.7rem;">▼</span></button>
  <div class="mobile-dropdown-menu">
    <a href="index.html"   class="mobile-nav-link"><i data-lucide="layout"></i> Home 1 (Split Hero)</a>
    <a href="index-2.html" class="mobile-nav-link"><i data-lucide="sparkles"></i> Home 2 (SaaS Premium)</a>
  </div>
</div>
<a href="services.html"     class="mobile-nav-link ${isActive('services.html')}"><i data-lucide="settings"></i> Services</a>
<a href="case-studies.html" class="mobile-nav-link ${isActive('case-studies.html')}"><i data-lucide="briefcase"></i> Case Studies</a>
<a href="blog.html"         class="mobile-nav-link ${isActive('blog.html')}"><i data-lucide="file-text"></i> Blog</a>
<a href="about.html"        class="mobile-nav-link ${isActive('about.html')}"><i data-lucide="users"></i> About</a>
<a href="contact.html"      class="mobile-nav-link ${isActive('contact.html')}"><i data-lucide="mail"></i> Contact</a>
<div class="mobile-nav-item">
  <button class="mobile-dropdown-toggle" aria-expanded="false"><i data-lucide="layout-dashboard"></i> Dashboard <span class="arrow" style="font-size:0.7rem;">▼</span></button>
  <div class="mobile-dropdown-menu">
    <a href="dashboard.html" class="mobile-nav-link ${isActive('dashboard.html')}"><i data-lucide="layout-dashboard"></i> Client Dashboard</a>
    <a href="admin.html"     class="mobile-nav-link ${isActive('admin.html')}"><i data-lucide="settings"></i> Admin Dashboard</a>
  </div>
</div>
<div class="mobile-nav-divider"></div>
<div class="mobile-menu-controls">
  <button class="mobile-control-btn theme-toggle" aria-label="Toggle theme">
    <span class="theme-icon"><i data-lucide="moon"></i></span>
    <span class="theme-text">Dark Mode</span>
  </button>
  <button class="mobile-control-btn rtl-toggle" aria-label="Toggle RTL layout">
    <span class="rtl-icon"><i data-lucide="globe"></i></span>
    <span class="theme-text rtl-text">RTL Layout</span>
  </button>
</div>
<div class="mobile-nav-divider"></div>
<a href="login.html"   class="btn btn-primary full-width">Login</a>
</div>`;

  /* ── Footer HTML ─────────────────────────────────────────── */
  const FOOTER_HTML = `
<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo">
          <div class="footer-logo-icon" aria-hidden="true" style="background:transparent;padding:0;width:38px;height:38px;">
            <img src="assets/images/logo.svg" alt="" style="width:100%;height:100%;display:block;">
          </div>
          <span>App<span class="text-gradient">Forge</span></span>
        </div>
        <p>Premium mobile app development agency helping startups and enterprises build market-leading iOS, Android, and cross-platform applications.</p>
        <div class="social-links" aria-label="Social media links">
          <a href="#" class="social-link" aria-label="Twitter">𝕏</a>
          <a href="#" class="social-link" aria-label="LinkedIn">in</a>
          <a href="#" class="social-link" aria-label="GitHub">⌥</a>
          <a href="#" class="social-link" aria-label="Dribbble">🎨</a>
          <a href="#" class="social-link" aria-label="YouTube">▶</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Services</h4>
        <nav class="footer-links" aria-label="Services links">
          <a href="services.html#ios">iOS Development</a>
          <a href="services.html#android">Android Development</a>
          <a href="services.html#flutter">Flutter Development</a>
          <a href="services.html#react-native">React Native</a>
          <a href="services.html#design">UI/UX Design</a>
          <a href="services.html#maintenance">Maintenance</a>
        </nav>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <nav class="footer-links" aria-label="Company links">
          <a href="about.html">About Us</a>
          <a href="case-studies.html">Case Studies</a>
          <a href="blog.html">Blog</a>
          <a href="pricing.html">Pricing</a>
          <a href="contact.html">Contact</a>
          <a href="coming-soon.html">Careers</a>
        </nav>
      </div>
      <div class="footer-col">
        <h4>Resources</h4>
        <nav class="footer-links" aria-label="Resources links">
          <a href="login.html">Client Portal</a>
          <a href="contact.html#booking">Book a Call</a>
          <a href="pricing.html">Free Estimate</a>
          <a href="blog.html">App Dev Guide</a>
          <a href="404.html">Privacy Policy</a>
          <a href="404.html">Terms of Service</a>
        </nav>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2025 AppForge. All rights reserved. Crafted with ❤️ for innovative founders.</span>
      <div class="footer-bottom-links">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Cookies</a>
        <a href="#">Sitemap</a>
      </div>
    </div>
  </div>
</footer>
<div class="toast-container" role="alert" aria-live="polite"></div>`;

  /* ── Inject into placeholders ────────────────────────────── */
  const navEl = document.getElementById('site-nav');
  if (navEl) navEl.outerHTML = NAV_HTML;

  const footerEl = document.getElementById('site-footer');
  if (footerEl) footerEl.outerHTML = FOOTER_HTML;

})();
