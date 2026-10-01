document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLogoSwitcher();
  initClientEnv();
  initEventListeners();
  initFormControls();
  initNetworkTester();
  initStorageTester();
  initUIFeedback();
});

/* ==========================================================================
   0. Interactive Logo Switcher
   ========================================================================== */

function initLogoSwitcher() {
  const brandBtn = document.getElementById('brand-logo-btn');
  if (!brandBtn) return;

  const logos = [
    {
      name: "Cyber Hexagon",
      svg: `<polygon points="16,3 28,9.5 28,22.5 16,29 4,22.5 4,9.5" stroke="url(#brand-grad)" stroke-width="2.2" stroke-linejoin="round" fill="rgba(99, 102, 241, 0.12)"/>
            <path d="M16 9L23 13V19L16 23L9 19V13L16 9Z" stroke="url(#inner-grad)" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M16 9V16M16 16L23 20M16 16L9 20" stroke="url(#brand-grad)" stroke-width="1.6" stroke-linecap="round"/>
            <circle cx="16" cy="16" r="2.2" fill="#ffffff"/>`
    },
    {
      name: "Mustafa 'M' Monogram",
      svg: `<rect x="3" y="3" width="26" height="26" rx="8" stroke="url(#brand-grad)" stroke-width="2.2" fill="rgba(99, 102, 241, 0.12)"/>
            <path d="M8 22V10L16 18L24 10V22" stroke="url(#inner-grad)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="16" cy="18" r="2" fill="url(#brand-grad)"/>`
    },
    {
      name: "Science Lab Flask",
      svg: `<path d="M13 4H19M14 4V10L8 22C7.2 23.5 8.3 25 10 25H22C23.7 25 24.8 23.5 24 22L18 10V4" stroke="url(#brand-grad)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="rgba(99, 102, 241, 0.12)"/>
            <circle cx="14" cy="19" r="1.5" fill="#38BDF8"/>
            <circle cx="18" cy="17" r="2" fill="#EC4899"/>
            <path d="M11 20Q16 17 21 20" stroke="url(#inner-grad)" stroke-width="1.5"/>`
    }
  ];

  let currentIdx = 0;

  brandBtn.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % logos.length;
    const selected = logos[currentIdx];
    const defs = `<defs>
      <linearGradient id="brand-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
        <stop stop-color="#6366F1"/>
        <stop offset="0.5" stop-color="#A855F7"/>
        <stop offset="1" stop-color="#EC4899"/>
      </linearGradient>
      <linearGradient id="inner-grad" x1="10" y1="10" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stop-color="#38BDF8"/>
        <stop offset="1" stop-color="#6366F1"/>
      </linearGradient>
    </defs>`;

    const brandSvg = document.getElementById('brand-svg');
    if (brandSvg) {
      brandSvg.innerHTML = defs + selected.svg;
      showToast(`Logo changed to: ${selected.name}`, 'success');
    }
  });
}

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */

function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const colorSchemeStat = document.getElementById('color-scheme-stat');

  const savedTheme = localStorage.getItem('testlab_theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(`Switched to ${newTheme} mode`, 'success');
  });

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('testlab_theme', theme);
    themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    colorSchemeStat.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
  }
}

/* ==========================================================================
   2. Client Environment & Viewport
   ========================================================================== */

function initClientEnv() {
  const viewportStat = document.getElementById('viewport-stat');
  const dprStat = document.getElementById('dpr-stat');
  const uaVal = document.getElementById('ua-val');
  const langVal = document.getElementById('lang-val');
  const screenVal = document.getElementById('screen-val');
  const touchVal = document.getElementById('touch-val');
  const copyEnvBtn = document.getElementById('copy-env-btn');
  const networkStatus = document.getElementById('network-status');
  const networkDot = networkStatus.querySelector('.status-dot');
  const networkText = document.getElementById('network-text');

  function updateDimensions() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    viewportStat.textContent = `${width} × ${height} px`;
    dprStat.textContent = (window.devicePixelRatio || 1).toFixed(2);
  }

  window.addEventListener('resize', updateDimensions);
  updateDimensions();

  // Populate static info
  uaVal.textContent = navigator.userAgent;
  langVal.textContent = navigator.language || navigator.userLanguage || 'Unknown';
  screenVal.textContent = `${window.screen.width} × ${window.screen.height} (${window.screen.colorDepth}-bit)`;
  touchVal.textContent = ('ontouchstart' in window || navigator.maxTouchPoints > 0) ? 'Supported' : 'Not detected';

  // Online / Offline Detection
  function updateNetworkStatus() {
    const isOnline = navigator.onLine;
    if (isOnline) {
      networkDot.className = 'status-dot online';
      networkText.textContent = 'Online';
    } else {
      networkDot.className = 'status-dot offline';
      networkText.textContent = 'Offline';
    }
  }

  window.addEventListener('online', () => {
    updateNetworkStatus();
    showToast('Network connection restored (Online)', 'success');
  });

  window.addEventListener('offline', () => {
    updateNetworkStatus();
    showToast('Network disconnected (Offline)', 'error');
  });

  updateNetworkStatus();

  // Copy Environment Info
  copyEnvBtn.addEventListener('click', async () => {
    const info = {
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      dpr: window.devicePixelRatio,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`,
      online: navigator.onLine
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(info, null, 2));
      showToast('Environment details copied to clipboard!', 'success');
    } catch {
      showToast('Could not access clipboard', 'error');
    }
  });
}

/* ==========================================================================
   3. Interactive Events & Key Logger
   ========================================================================== */

function initEventListeners() {
  const incrementBtn = document.getElementById('increment-btn');
  const dblclickBtn = document.getElementById('dblclick-btn');
  const resetCounterBtn = document.getElementById('reset-counter-btn');
  const clickCounter = document.getElementById('click-counter');
  const totalClicksStat = document.getElementById('total-clicks-stat');

  const keyName = document.getElementById('key-name');
  const keyCode = document.getElementById('key-code');

  let count = 0;

  function setCounter(newVal) {
    count = newVal;
    clickCounter.textContent = count;
    totalClicksStat.textContent = count;

    // Small scale bounce effect
    clickCounter.style.transform = 'scale(1.2)';
    setTimeout(() => {
      clickCounter.style.transform = 'scale(1)';
    }, 120);
  }

  incrementBtn.addEventListener('click', () => {
    setCounter(count + 1);
  });

  dblclickBtn.addEventListener('dblclick', () => {
    setCounter(count + 5);
    showToast('Double-click triggered (+5)!', 'success');
  });

  resetCounterBtn.addEventListener('click', () => {
    setCounter(0);
    showToast('Counter reset to 0', 'success');
  });

  // Global key logger
  window.addEventListener('keydown', (e) => {
    // Avoid capturing inputs when typing into input fields
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      return;
    }

    keyName.textContent = e.key === ' ' ? 'Space' : e.key;
    keyCode.textContent = `Code: ${e.code} (${e.keyCode})`;
  });
}

/* ==========================================================================
   4. Form Controls Live Sync & JSON Preview
   ========================================================================== */

function initFormControls() {
  const inputText = document.getElementById('input-text');
  const selectOption = document.getElementById('select-option');
  const rangeSlider = document.getElementById('range-slider');
  const sliderVal = document.getElementById('slider-val');
  const toggleCheckbox = document.getElementById('toggle-checkbox');
  const formJsonOutput = document.getElementById('form-json-output');
  const previewFormBtn = document.getElementById('preview-form-btn');

  rangeSlider.addEventListener('input', () => {
    sliderVal.textContent = rangeSlider.value;
    updateFormPreview();
  });

  inputText.addEventListener('input', updateFormPreview);
  selectOption.addEventListener('change', updateFormPreview);
  toggleCheckbox.addEventListener('change', updateFormPreview);

  function getFormState() {
    return {
      text: inputText.value,
      selected: selectOption.value,
      sliderValue: Number(rangeSlider.value),
      active: toggleCheckbox.checked,
      timestamp: new Date().toISOString()
    };
  }

  function updateFormPreview() {
    const state = getFormState();
    formJsonOutput.querySelector('pre code').textContent = JSON.stringify(state, null, 2);
  }

  previewFormBtn.addEventListener('click', () => {
    updateFormPreview();
    showToast('Form preview refreshed!', 'success');
  });

  updateFormPreview();
}

/* ==========================================================================
   5. Network & HTTP Fetch Tester
   ========================================================================== */

function initNetworkTester() {
  const apiUrlInput = document.getElementById('api-url');
  const fetchBtn = document.getElementById('fetch-btn');
  const latencyVal = document.getElementById('latency-val');
  const httpStatusVal = document.getElementById('http-status-val');
  const apiStatusBadge = document.getElementById('api-status-badge');
  const apiResponseOutput = document.getElementById('api-response-output');

  fetchBtn.addEventListener('click', async () => {
    const url = apiUrlInput.value.trim();
    if (!url) {
      showToast('Please enter a valid URL', 'error');
      return;
    }

    apiStatusBadge.textContent = 'Fetching...';
    apiStatusBadge.style.color = 'var(--accent-primary)';
    fetchBtn.disabled = true;
    fetchBtn.textContent = 'Loading...';
    apiResponseOutput.textContent = '// Request in progress...';

    const startTime = performance.now();

    try {
      const response = await fetch(url);
      const elapsed = Math.round(performance.now() - startTime);

      latencyVal.textContent = `${elapsed} ms`;
      httpStatusVal.textContent = `${response.status} ${response.statusText}`;

      let data;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
        apiResponseOutput.textContent = JSON.stringify(data, null, 2);
      } else {
        data = await response.text();
        apiResponseOutput.textContent = data.slice(0, 1500) + (data.length > 1500 ? '\n...[truncated]' : '');
      }

      if (response.ok) {
        apiStatusBadge.textContent = 'Success (200 OK)';
        apiStatusBadge.style.color = 'var(--success)';
        showToast(`Request completed in ${elapsed}ms`, 'success');
      } else {
        apiStatusBadge.textContent = `Status: ${response.status}`;
        apiStatusBadge.style.color = 'var(--warning)';
      }
    } catch (err) {
      const elapsed = Math.round(performance.now() - startTime);
      latencyVal.textContent = `${elapsed} ms`;
      httpStatusVal.textContent = 'Fetch Error';
      apiStatusBadge.textContent = 'Failed';
      apiStatusBadge.style.color = 'var(--danger)';
      apiResponseOutput.textContent = `Error: ${err.message}\n(Check CORS headers or endpoint connectivity)`;
      showToast(`Request failed: ${err.message}`, 'error');
    } finally {
      fetchBtn.disabled = false;
      fetchBtn.textContent = 'Send GET';
    }
  });
}

/* ==========================================================================
   6. LocalStorage Verification
   ========================================================================== */

function initStorageTester() {
  const keyInput = document.getElementById('storage-key');
  const valInput = document.getElementById('storage-val');
  const saveBtn = document.getElementById('save-storage-btn');
  const readBtn = document.getElementById('read-storage-btn');
  const clearBtn = document.getElementById('clear-storage-btn');
  const storageList = document.getElementById('storage-list');

  function renderStorage() {
    storageList.innerHTML = '';
    const keys = Object.keys(localStorage).filter(k => k !== 'testlab_theme');

    if (keys.length === 0) {
      storageList.innerHTML = '<p class="empty-hint">No items in localStorage</p>';
      return;
    }

    keys.forEach(key => {
      const val = localStorage.getItem(key);
      const row = document.createElement('div');
      row.className = 'storage-entry';
      row.innerHTML = `
        <span><strong>${escapeHTML(key)}:</strong> ${escapeHTML(val)}</span>
        <button class="btn-sm btn-danger delete-item-btn" data-key="${escapeHTML(key)}">&times;</button>
      `;

      row.querySelector('.delete-item-btn').addEventListener('click', (e) => {
        const itemKey = e.currentTarget.getAttribute('data-key');
        localStorage.removeItem(itemKey);
        renderStorage();
        showToast(`Removed "${itemKey}"`, 'success');
      });

      storageList.appendChild(row);
    });
  }

  saveBtn.addEventListener('click', () => {
    const k = keyInput.value.trim();
    const v = valInput.value.trim();
    if (!k) {
      showToast('Key cannot be empty', 'error');
      return;
    }
    localStorage.setItem(k, v);
    renderStorage();
    showToast(`Saved "${k}"`, 'success');
  });

  readBtn.addEventListener('click', () => {
    renderStorage();
    showToast('Storage list refreshed', 'success');
  });

  clearBtn.addEventListener('click', () => {
    const keys = Object.keys(localStorage).filter(k => k !== 'testlab_theme');
    keys.forEach(k => localStorage.removeItem(k));
    renderStorage();
    showToast('Cleared custom storage items', 'success');
  });

  renderStorage();
}

/* ==========================================================================
   7. UI Feedback, Modals, Toasts & Audio Tone
   ========================================================================== */

function initUIFeedback() {
  // Modal handling
  const modal = document.getElementById('test-modal');
  const openModalBtn = document.getElementById('open-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  openModalBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  modalCancelBtn.addEventListener('click', closeModal);
  modalConfirmBtn.addEventListener('click', () => {
    closeModal();
    showToast('Modal action acknowledged!', 'success');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Toasts
  document.getElementById('toast-success-btn').addEventListener('click', () => {
    showToast('Test operation completed successfully! 🚀', 'success');
  });

  document.getElementById('toast-error-btn').addEventListener('click', () => {
    showToast('Warning: Simulation test error encountered! ⚠️', 'error');
  });

  // Audio tone generation (Web Audio API)
  document.getElementById('audio-beep-btn').addEventListener('click', () => {
    playTestTone();
  });
}

function playTestTone() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      showToast('Web Audio API not supported in this browser', 'error');
      return;
    }

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);

    showToast('Played synthetic 587Hz-880Hz test tone 🎵', 'success');
  } catch (err) {
    showToast('Audio playback failed: ' + err.message, 'error');
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✓' : '⚠️';
  toast.innerHTML = `<span>${icon} ${escapeHTML(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3200);
}

function escapeHTML(str) {
  if (typeof str !== 'string') return String(str);
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
