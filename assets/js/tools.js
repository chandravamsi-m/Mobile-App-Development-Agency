/* ============================================================
   TOOLS.JS — Interactive Industry Tools
   Mobile App Development Agency
   ============================================================ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     1. PROJECT COST ESTIMATOR
  ══════════════════════════════════════════════════════════ */
  const estimatorForm = document.getElementById('estimator-form');
  if (estimatorForm) {

    // ── Tile selection logic ──────────────────────────────────
    estimatorForm.querySelectorAll('.est-opt').forEach(btn => {
      btn.addEventListener('click', function () {
        const group = btn.closest('[data-group]');
        if (!group) return;
        if (group.dataset.multi !== undefined) {
          btn.classList.toggle('selected');
        } else {
          group.querySelectorAll('.est-opt').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
        }
        calculateEstimate();
      });
    });

    // ── Pricing data ──────────────────────────────────────────
    const platformNames   = { ios: 'iOS', android: 'Android', both: 'iOS + Android', web: 'Web', all: 'All Platforms' };
    const platformPrices  = { ios: 20000, android: 18000, both: 32000, web: 15000, all: 45000 };
    const featureNames    = { auth: 'Authentication', push: 'Push Notifications', payments: 'Payments', maps: 'Maps & Location', chat: 'In-App Chat', analytics: 'Analytics', ai: 'AI / ML', social: 'Social', offline: 'Offline Mode' };
    const featureCosts    = { auth: 2000, push: 1500, payments: 4000, maps: 2500, chat: 3500, analytics: 2000, ai: 6000, social: 2000, offline: 3000 };
    const timelineLabels  = { '1-3': '1–3 months', '3-6': '3–6 months', '6-12': '6–12 months', '12+': '12+ months' };
    const timelineMulti   = { '1-3': 1.4, '3-6': 1.15, '6-12': 1.0, '12+': 0.9 };
    const complexLabels   = { mvp: 'MVP / Simple', standard: 'Standard', complex: 'Complex', enterprise: 'Enterprise' };
    const complexMulti    = { mvp: 0.7, standard: 1.0, complex: 1.35, enterprise: 1.8 };

    // ── Calculate & render ────────────────────────────────────
    function calculateEstimate() {
      const rangeEl     = document.getElementById('est-range');
      const breakdownEl = document.getElementById('result-breakdown');
      if (!rangeEl || !breakdownEl) return;

      const platform   = estimatorForm.querySelector('[data-group="platform"] .est-opt.selected')?.dataset.value;
      const timeline   = estimatorForm.querySelector('[data-group="timeline"] .est-opt.selected')?.dataset.value;
      const complexity = estimatorForm.querySelector('[data-group="complexity"] .est-opt.selected')?.dataset.value;

      let featureTotal = 0;
      const selectedFeatures = [];
      estimatorForm.querySelectorAll('[data-group="features"] .est-opt.selected').forEach(btn => {
        const val = btn.dataset.value;
        featureTotal += featureCosts[val] || 1000;
        selectedFeatures.push(featureNames[val] || val);
      });

      if (!platform) {
        rangeEl.textContent = '—';
        breakdownEl.innerHTML = `
          <div class="est-breakdown-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:.35;margin:0 auto 8px"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            <p>Select your requirements<br>to generate an estimate.</p>
          </div>`;
        return;
      }

      const base    = platformPrices[platform] || 20000;
      const tMulti  = timelineMulti[timeline]  || 1.0;
      const cMulti  = complexMulti[complexity] || 1.0;
      const total   = (base + featureTotal) * tMulti * cMulti;
      const low     = Math.round(total * 0.85 / 1000) * 1000;
      const high    = Math.round(total * 1.15 / 1000) * 1000;

      // Animate the number
      rangeEl.style.opacity = '0';
      rangeEl.style.transform = 'translateY(4px)';
      requestAnimationFrame(() => {
        rangeEl.textContent = `$${low.toLocaleString()} – $${high.toLocaleString()}`;
        rangeEl.style.transition = 'all 0.25s ease';
        rangeEl.style.opacity = '1';
        rangeEl.style.transform = 'translateY(0)';
      });

      // Build breakdown rows
      let rows = `
        <div class="est-breakdown-row">
          <span class="label">Platform (${platformNames[platform]})</span>
          <span class="value">$${base.toLocaleString()}</span>
        </div>`;

      if (featureTotal > 0) {
        rows += `
        <div class="est-breakdown-row">
          <span class="label">Features (${selectedFeatures.length})</span>
          <span class="value">$${featureTotal.toLocaleString()}</span>
        </div>`;
      }
      if (timeline) {
        rows += `
        <div class="est-breakdown-row">
          <span class="label">Timeline (${timelineLabels[timeline]})</span>
          <span class="value">×${tMulti}</span>
        </div>`;
      }
      if (complexity) {
        rows += `
        <div class="est-breakdown-row">
          <span class="label">Complexity (${complexLabels[complexity]})</span>
          <span class="value">×${cMulti}</span>
        </div>`;
      }

      const subtotal = base + featureTotal;
      rows += `
        <div class="est-breakdown-row total">
          <span class="label">Estimated Total</span>
          <span class="value">$${Math.round(subtotal * tMulti * cMulti).toLocaleString()}</span>
        </div>`;

      breakdownEl.innerHTML = rows;
    }

    // ── Reset ─────────────────────────────────────────────────
    document.getElementById('estimator-reset')?.addEventListener('click', function () {
      estimatorForm.querySelectorAll('.est-opt').forEach(b => b.classList.remove('selected'));
      calculateEstimate();
    });

    // Run once on load to set initial state
    calculateEstimate();
  }

  /* ══════════════════════════════════════════════════════════
     2. ROI CALCULATOR
  ══════════════════════════════════════════════════════════ */
  const roiForm = document.getElementById('roi-form');
  if (roiForm) {
    function calculateROI() {
      const investment = parseFloat(document.getElementById('roi-investment')?.value) || 0;
      const users = parseFloat(document.getElementById('roi-users')?.value) || 0;
      const arpu = parseFloat(document.getElementById('roi-arpu')?.value) || 0;
      const months = parseFloat(document.getElementById('roi-months')?.value) || 12;

      if (!investment || !users || !arpu) return;

      const monthlyRevenue = users * arpu;
      const annualRevenue = monthlyRevenue * Math.min(months, 12);
      const projectedRevenue = monthlyRevenue * months;
      const roi = ((projectedRevenue - investment) / investment * 100).toFixed(1);
      const breakEven = (investment / monthlyRevenue).toFixed(1);

      const monthlyRevEl = document.getElementById('roi-monthly-rev');
      if (monthlyRevEl) monthlyRevEl.textContent = `$${monthlyRevenue.toLocaleString()}`;
      
      const annualRevEl = document.getElementById('roi-annual-rev');
      if (annualRevEl) annualRevEl.textContent = `$${annualRevenue.toLocaleString()}`;
      
      const projectedRevEl = document.getElementById('roi-projected-rev');
      if (projectedRevEl) projectedRevEl.textContent = `$${projectedRevenue.toLocaleString()}`;
      
      const pctEl = document.getElementById('roi-percentage');
      if (pctEl) pctEl.textContent = `${roi}%`;
      
      const breakEvenEl = document.getElementById('roi-break-even');
      if (breakEvenEl) breakEvenEl.textContent = `${breakEven} months`;
      
      document.getElementById('roi-result')?.classList.add('show');
    }

    roiForm.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', calculateROI);
    });
    roiForm.addEventListener('submit', e => { e.preventDefault(); calculateROI(); });
  }

  /* ══════════════════════════════════════════════════════════
     3. TECHNOLOGY RECOMMENDATION TOOL
  ══════════════════════════════════════════════════════════ */
  const techToolForm = document.getElementById('tech-tool-form');
  if (techToolForm) {
    const recommendations = {
      'ios-mvp-small': { stack: 'Swift + SwiftUI', backend: 'Firebase', desc: 'Perfect for fast iOS MVP launches.', icon: '🍎' },
      'android-mvp-small': { stack: 'Kotlin + Jetpack Compose', backend: 'Firebase', desc: 'Native Android with modern tooling.', icon: '🤖' },
      'both-mvp-small': { stack: 'Flutter', backend: 'Firebase', desc: 'Cross-platform with a single codebase.', icon: '🦋' },
      'both-mvp-medium': { stack: 'React Native', backend: 'Node.js + PostgreSQL', desc: 'JS ecosystem, shared codebase, great community.', icon: '⚛️' },
      'both-standard-medium': { stack: 'React Native + TypeScript', backend: 'Node.js + PostgreSQL + Redis', desc: 'Scalable cross-platform solution.', icon: '⚛️' },
      'both-complex-large': { stack: 'Flutter + Native Modules', backend: 'Microservices (Go/Node)', desc: 'Enterprise-grade with maximum performance.', icon: '🚀' },
      'ios-standard-medium': { stack: 'Swift + UIKit/SwiftUI', backend: 'Node.js + PostgreSQL', desc: 'Full native iOS experience.', icon: '🍎' },
      'android-standard-medium': { stack: 'Kotlin + MVVM', backend: 'Spring Boot + MySQL', desc: 'Robust native Android architecture.', icon: '🤖' },
      'web-mvp-small': { stack: 'React + TypeScript', backend: 'Node.js + MongoDB', desc: 'Fast, flexible web application.', icon: '🌐' },
      'all-enterprise-large': { stack: 'Flutter + React Web', backend: 'Microservices + Kubernetes', desc: 'Maximum reach enterprise architecture.', icon: '🏢' },
    };

    techToolForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const platform = document.getElementById('tech-platform')?.value;
      const complexity = document.getElementById('tech-complexity')?.value;
      const scale = document.getElementById('tech-scale')?.value;
      const key = `${platform}-${complexity}-${scale}`;
      const rec = recommendations[key] || recommendations[`${platform}-mvp-small`] || { stack: 'React Native', backend: 'Firebase', desc: 'A versatile cross-platform solution.', icon: '⚛️' };
      const resultEl = document.getElementById('tech-result');
      if (resultEl) {
        resultEl.classList.remove('hidden');
        resultEl.classList.add('show');
        document.getElementById('tech-stack-name')?.textContent && (document.getElementById('tech-stack-name').textContent = rec.stack);
        document.getElementById('tech-backend-name')?.textContent && (document.getElementById('tech-backend-name').textContent = rec.backend);
        document.getElementById('tech-rec-desc')?.textContent && (document.getElementById('tech-rec-desc').textContent = rec.desc);
        document.getElementById('tech-icon')?.textContent && (document.getElementById('tech-icon').textContent = rec.icon);
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     4. APP FEATURE PLANNER (Interactive Checklist)
  ══════════════════════════════════════════════════════════ */
  const featurePlanner = document.getElementById('feature-planner');
  if (featurePlanner) {
    const checkboxes = featurePlanner.querySelectorAll('input[type="checkbox"]');
    const totalCountEl = document.getElementById('planner-total');
    const complexityEl = document.getElementById('planner-complexity');
    const estimatedWeeks = document.getElementById('planner-weeks');

    const featureWeeks = {
      'auth': 1.5, 'onboarding': 1, 'profile': 1, 'push': 0.5,
      'payments': 3, 'chat': 3, 'maps': 2, 'camera': 1.5,
      'analytics': 1, 'social': 2, 'offline': 2.5, 'ai': 4,
      'notifications': 0.5, 'search': 1.5, 'review': 1,
      'subscription': 2.5, 'referral': 1.5, 'dashboard': 2,
    };

    function updatePlanner() {
      let total = 0;
      let weeks = 4; // Base weeks
      checkboxes.forEach(cb => {
        if (cb.checked) {
          total++;
          weeks += featureWeeks[cb.dataset.feature] || 1;
        }
      });
      if (totalCountEl) totalCountEl.textContent = total;
      if (estimatedWeeks) estimatedWeeks.textContent = `${Math.round(weeks)} weeks`;
      if (complexityEl) {
        const lvl = total <= 4 ? 'Simple' : total <= 8 ? 'Moderate' : total <= 12 ? 'Complex' : 'Enterprise';
        complexityEl.textContent = lvl;
        complexityEl.className = `badge badge-${total <= 4 ? 'success' : total <= 8 ? 'warning' : 'danger'}`;
      }
    }

    checkboxes.forEach(cb => cb.addEventListener('change', updatePlanner));
    updatePlanner();

    document.getElementById('planner-clear')?.addEventListener('click', () => {
      checkboxes.forEach(cb => { cb.checked = false; });
      updatePlanner();
    });

    document.getElementById('planner-export')?.addEventListener('click', () => {
      const selected = [];
      checkboxes.forEach(cb => { if (cb.checked) selected.push(cb.dataset.label || cb.dataset.feature); });
      if (!selected.length) { window.MADA?.showToast('warning', 'No Features', 'Please select at least one feature.'); return; }
      const text = `App Feature Plan\n================\n\n${selected.map(f => `✓ ${f}`).join('\n')}\n\nTotal: ${selected.length} features\nEstimated Development: ${document.getElementById('planner-weeks')?.textContent}`;
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), { href: url, download: 'app-feature-plan.txt' });
      a.click();
      URL.revokeObjectURL(url);
      window.MADA?.showToast('success', 'Plan Exported', 'Your feature plan has been downloaded.');
    });
  }

  /* ══════════════════════════════════════════════════════════
     5. DISCOVERY CALL BOOKING (Calendar Placeholder)
  ══════════════════════════════════════════════════════════ */
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    // Generate next 14 days
    const calGrid = document.getElementById('cal-grid');
    if (calGrid) {
      const today = new Date();
      for (let i = 1; i <= 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        if (d.getDay() === 0 || d.getDay() === 6) continue; // Skip weekends
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-day-btn';
        btn.textContent = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        btn.dataset.date = d.toISOString().split('T')[0];
        btn.addEventListener('click', function () {
          calGrid.querySelectorAll('.cal-day-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          const hidden = document.getElementById('booking-date');
          if (hidden) hidden.value = btn.dataset.date;
        });
        calGrid.appendChild(btn);
      }
    }
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const date = document.getElementById('booking-date')?.value;
      const time = document.getElementById('booking-time')?.value;
      const name = document.getElementById('booking-name')?.value;
      if (!date || !time || !name) { window.MADA?.showToast('error', 'Incomplete', 'Please fill all booking fields.'); return; }
      window.MADA?.showToast('success', 'Call Booked! 🎉', `Your discovery call is scheduled for ${date} at ${time}.`);
      bookingForm.reset();
      calGrid?.querySelectorAll('.cal-day-btn').forEach(b => b.classList.remove('selected'));
    });
  }

  /* ══════════════════════════════════════════════════════════
     6. COUNTDOWN TIMER (Coming Soon Page)
  ══════════════════════════════════════════════════════════ */
  const countdown = document.getElementById('countdown');
  if (countdown) {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30); // 30 days from now

    function updateCountdown() {
      const diff = launchDate - Date.now();
      if (diff <= 0) { countdown.innerHTML = '<p>🚀 We\'re Live!</p>'; return; }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      document.getElementById('cd-days')?.textContent && (document.getElementById('cd-days').textContent = String(days).padStart(2, '0'));
      document.getElementById('cd-hours')?.textContent && (document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0'));
      document.getElementById('cd-mins')?.textContent && (document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0'));
      document.getElementById('cd-secs')?.textContent && (document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0'));
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ══════════════════════════════════════════════════════════
     7. SUBSCRIBE FORM (Coming Soon)
  ══════════════════════════════════════════════════════════ */
  document.getElementById('subscribe-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('subscribe-email')?.value;
    if (!email) return;
    window.MADA?.showToast('success', 'Subscribed! 🎉', 'We\'ll notify you when we launch.');
    this.reset();
  });

  /* ══════════════════════════════════════════════════════════
     8. LOGIN PAGE
  ══════════════════════════════════════════════════════════ */
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    // Password toggle
    document.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', function () {
        const input = btn.previousElementSibling;
        if (!input) return;
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        btn.textContent = isText ? '👁' : '🙈';
      });
    });

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value;
      const pass = document.getElementById('login-password')?.value;
      const btn = loginForm.querySelector('[type="submit"]');
      if (!email || !pass) { window.MADA?.showToast('error', 'Error', 'Please enter your credentials.'); return; }
      if (btn) { btn.disabled = true; btn.textContent = 'Signing In…'; }
      // Simulate auth
      setTimeout(() => {
        if (email && pass) {
          window.MADA?.showToast('success', 'Welcome back! 👋', 'Redirecting to your dashboard…');
          setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
        } else {
          if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; }
          window.MADA?.showToast('error', 'Invalid Credentials', 'Please check your email and password.');
        }
      }, 1200);
    });
  }

})();
