/* ============================================================
   DASHBOARD.JS — Client Portal Interactivity
   Mobile App Development Agency
   ============================================================ */

(function () {
  'use strict';

  /* ── Sidebar Navigation ────────────────────────────────── */
  const sidebarItems = document.querySelectorAll('.sidebar-nav-item[data-page]');
  const dashPages    = document.querySelectorAll('.dash-page');
  const topbarTitle  = document.querySelector('.topbar-page-title');

  function navigateTo(pageId) {
    sidebarItems.forEach(item => item.classList.toggle('active', item.dataset.page === pageId));
    dashPages.forEach(page => page.classList.toggle('active', page.id === `page-${pageId}`));
    if (topbarTitle) {
      const activeItem = document.querySelector(`.sidebar-nav-item[data-page="${pageId}"]`);
      topbarTitle.textContent = activeItem ? activeItem.querySelector('.sidebar-nav-label')?.textContent || pageId : pageId;
    }
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 1024) closeSidebar();
    
    // Reset scroll position to top
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Trigger page-specific init
    initPageFeatures(pageId);
  }

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.page));
  });

  // Sidebar toggle (mobile)
  const sidebarToggle = document.querySelector('.sidebar-toggle-btn');
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  function openSidebar() {
    sidebar?.classList.add('open');
    sidebarOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar?.classList.remove('open');
    sidebarOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  sidebarToggle?.addEventListener('click', () => {
    sidebar?.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  sidebarOverlay?.addEventListener('click', closeSidebar);

  /* ── Init First Page ───────────────────────────────────── */
  const firstPage = document.querySelector('.sidebar-nav-item[data-page].active')?.dataset.page || 'overview';
  initPageFeatures(firstPage);

  /* ── Per-Page Feature Initialization ──────────────────── */
  function initPageFeatures(pageId) {
    switch (pageId) {
      case 'overview':    initOverview();    break;
      case 'milestones':  initMilestones();  break;
      case 'files':       initFiles();       break;
      case 'messaging':   initMessaging();   break;
      case 'invoices':    initInvoices();    break;
      case 'settings':    initSettings();    break;
    }
  }

  /* ── Overview Page ─────────────────────────────────────── */
  function initOverview() {
    // Animate progress bars
    document.querySelectorAll('#page-overview .progress-bar').forEach(bar => {
      const width = bar.dataset.width || bar.style.width;
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = width; }, 200);
    });

    // Animate mini chart bars
    const chartBars = document.querySelectorAll('.mini-chart-bar');
    chartBars.forEach((bar, i) => {
      const h = bar.dataset.height || '40%';
      bar.style.height = '0';
      setTimeout(() => { bar.style.height = h; }, 100 + i * 80);
    });
  }

  /* ── Milestones Page ───────────────────────────────────── */
  function initMilestones() {
    document.querySelectorAll('#page-milestones .progress-bar').forEach(bar => {
      const width = bar.dataset.width || bar.style.width;
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = width; }, 300);
    });
  }

  /* ── Requirements ──────────────────────────────────────── */
  const reqForm = document.getElementById('req-form');
  reqForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('req-title')?.value.trim();
    const desc  = document.getElementById('req-desc')?.value.trim();
    const prio  = document.getElementById('req-priority')?.value;
    if (!title) { showToast('error', 'Error', 'Please enter a requirement title.'); return; }
    addRequirementToList({ title, desc, prio, date: new Date().toLocaleDateString() });
    reqForm.reset();
    document.getElementById('req-modal')?.closest('.modal-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
    showToast('success', 'Requirement Added', 'Your requirement has been submitted for review.');
  });

  function addRequirementToList({ title, desc, prio, date }) {
    const list = document.querySelector('.req-list');
    if (!list) return;
    const colors = { high: 'danger', medium: 'warning', low: 'success' };
    const item = document.createElement('div');
    item.className = 'req-item reveal';
    item.innerHTML = `
      <div class="req-icon" style="background:rgba(37,99,235,.1);color:var(--primary)">📋</div>
      <div class="req-info">
        <div class="req-title">${title}</div>
        <div class="req-desc">${desc || 'No description provided.'}</div>
        <div class="req-meta">
          <span class="req-meta-item">📅 ${date}</span>
          <span class="badge badge-${colors[prio] || 'muted'}">${prio || 'medium'}</span>
        </div>
      </div>
      <div class="req-actions">
        <span class="badge badge-warning">Pending</span>
      </div>`;
    list.prepend(item);
    setTimeout(() => item.classList.add('visible'), 50);
  }

  /* ── Prototype Review ──────────────────────────────────── */
  document.querySelectorAll('.proto-approve').forEach(btn => {
    btn.addEventListener('click', function () {
      const card = btn.closest('.prototype-card');
      const statusBadge = card?.querySelector('.proto-status-badge');
      if (statusBadge) { statusBadge.textContent = 'Approved'; statusBadge.className = 'badge badge-success proto-status-badge'; }
      btn.disabled = true;
      card?.querySelector('.proto-reject')?.setAttribute('disabled', true);
      showToast('success', 'Prototype Approved', 'Your approval has been recorded.');
    });
  });
  document.querySelectorAll('.proto-reject').forEach(btn => {
    btn.addEventListener('click', function () {
      const card = btn.closest('.prototype-card');
      const statusBadge = card?.querySelector('.proto-status-badge');
      if (statusBadge) { statusBadge.textContent = 'Revision Requested'; statusBadge.className = 'badge badge-warning proto-status-badge'; }
      btn.disabled = true;
      card?.querySelector('.proto-approve')?.setAttribute('disabled', true);
      showToast('warning', 'Revision Requested', 'The team will be notified of your feedback.');
    });
  });

  // Comment system
  document.querySelectorAll('.comment-send').forEach(btn => {
    btn.addEventListener('click', function () {
      const row   = btn.closest('.comment-input-row');
      const input = row?.querySelector('input');
      const thread = btn.closest('.comment-thread');
      if (!input || !input.value.trim()) return;
      const comment = document.createElement('div');
      comment.className = 'comment-item';
      comment.innerHTML = `
        <div class="avatar avatar-sm">JD</div>
        <div class="comment-body">
          <div class="comment-author">You</div>
          <div class="comment-text">${input.value}</div>
          <div class="comment-time">Just now</div>
        </div>`;
      thread?.querySelector('.comment-thread-list')?.appendChild(comment);
      input.value = '';
    });
  });
  document.querySelectorAll('.comment-input-row input').forEach(inp => {
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') inp.closest('.comment-input-row')?.querySelector('.comment-send')?.click(); });
  });

  /* ── Messaging ─────────────────────────────────────────── */
  function initMessaging() {
    const threads = document.querySelectorAll('.msg-thread');
    threads.forEach(thread => {
      thread.addEventListener('click', function () {
        threads.forEach(t => t.classList.remove('active'));
        thread.classList.add('active');
        thread.querySelector('.msg-unread')?.remove();
        const name = thread.querySelector('.msg-thread-name')?.textContent;
        const mainHeader = document.querySelector('.msg-main-name');
        if (mainHeader) mainHeader.textContent = name;
      });
    });
    const sendBtn  = document.getElementById('msg-send-btn');
    const msgInput = document.getElementById('msg-input');
    const msgArea  = document.querySelector('.msg-messages');
    function sendMessage() {
      if (!msgInput || !msgInput.value.trim()) return;
      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble sent';
      bubble.innerHTML = `${msgInput.value}<div class="msg-bubble-time">Just now</div>`;
      msgArea?.appendChild(bubble);
      msgArea?.scrollTo(0, msgArea.scrollHeight);
      msgInput.value = '';
      // Simulate reply
      setTimeout(() => {
        const reply = document.createElement('div');
        reply.className = 'msg-bubble received';
        reply.innerHTML = `Got it! We'll look into that. <div class="msg-bubble-time">Just now</div>`;
        msgArea?.appendChild(reply);
        msgArea?.scrollTo(0, msgArea.scrollHeight);
      }, 1500);
    }
    sendBtn?.addEventListener('click', sendMessage);
    msgInput?.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
  }

  /* ── File Manager ──────────────────────────────────────── */
  function initFiles() {
    const uploadArea = document.querySelector('.upload-area');
    const fileInput  = document.getElementById('file-input');
    uploadArea?.addEventListener('click', () => fileInput?.click());
    uploadArea?.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
    uploadArea?.addEventListener('dragleave', () => uploadArea?.classList.remove('drag-over'));
    uploadArea?.addEventListener('drop', function (e) {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      processUploadedFiles(e.dataTransfer.files);
    });
    fileInput?.addEventListener('change', function () { processUploadedFiles(fileInput.files); });
  }

  function processUploadedFiles(files) {
    const grid = document.querySelector('.file-grid');
    if (!grid || !files.length) return;
    Array.from(files).forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      const icons = { pdf: '📄', doc: '📝', docx: '📝', png: '🖼️', jpg: '🖼️', jpeg: '🖼️', zip: '📦', mp4: '🎥', psd: '🎨' };
      const icon = icons[ext] || '📁';
      const card = document.createElement('div');
      card.className = 'file-card reveal';
      card.innerHTML = `
        <div class="file-icon">${icon}</div>
        <div class="file-name">${file.name}</div>
        <div class="file-meta">${(file.size/1024).toFixed(1)} KB</div>
        <div class="file-actions">
          <button class="btn btn-ghost btn-sm btn-icon" title="Download">⬇️</button>
          <button class="btn btn-ghost btn-sm btn-icon" title="Delete">🗑️</button>
        </div>`;
      grid.prepend(card);
      setTimeout(() => card.classList.add('visible'), 50);
    });
    showToast('success', 'Upload Complete', `${files.length} file(s) uploaded successfully.`);
  }

  /* ── Invoice ───────────────────────────────────────────── */
  function initInvoices() {
    document.querySelectorAll('.invoice-download').forEach(btn => {
      btn.addEventListener('click', function () {
        showToast('info', 'Downloading Invoice', 'Your PDF is being prepared…');
      });
    });
  }

  /* ── Settings Tabs ─────────────────────────────────────── */
  function initSettings() {
    const navBtns  = document.querySelectorAll('.settings-nav-btn');
    const panels   = document.querySelectorAll('.settings-subpanel');
    navBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        navBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.add('hidden'));
        btn.classList.add('active');
        const target = document.getElementById(`settings-${btn.dataset.settings}`);
        target?.classList.remove('hidden');
      });
    });
    // Toggle switches
    document.querySelectorAll('.toggle').forEach(toggle => {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('active');
      });
    });
    // Profile save
    document.getElementById('settings-save-btn')?.addEventListener('click', function () {
      showToast('success', 'Settings Saved', 'Your profile has been updated.');
    });
    // Password change
    document.getElementById('change-password-btn')?.addEventListener('click', function () {
      const current = document.getElementById('current-password')?.value;
      const newPass  = document.getElementById('new-password')?.value;
      if (!current || !newPass) { showToast('error', 'Error', 'Please fill in all password fields.'); return; }
      showToast('success', 'Password Changed', 'Your password has been updated.');
    });
  }

  /* ── Topbar Notification Panel ─────────────────────────── */
  const notifBtn = document.getElementById('notif-btn');
  const notifPanel = document.getElementById('notif-panel');
  notifBtn?.addEventListener('click', function (e) {
    e.stopPropagation();
    notifPanel?.classList.toggle('hidden');
    notifBtn.querySelector('.notif-dot')?.remove();
  });
  document.addEventListener('click', e => {
    if (!notifPanel?.contains(e.target) && e.target !== notifBtn) notifPanel?.classList.add('hidden');
  });

  /* ── Logout ────────────────────────────────────────────── */
  document.querySelector('[data-action="logout"]')?.addEventListener('click', function () {
    showToast('info', 'Signing Out', 'Redirecting to login…');
    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
  });

  /* ── Welcome Toast ─────────────────────────────────────── */
  setTimeout(() => showToast('success', 'Welcome back, John! 👋', 'You have 3 new notifications.'), 800);

  /* ── Utility: expose showToast ─────────────────────────── */
  function showToast(type, title, msg) {
    window.MADA?.showToast(type, title, msg);
    // Fallback if MADA not loaded yet
    if (!window.MADA) console.log(`[${type.toUpperCase()}] ${title}: ${msg}`);
  }

})();
