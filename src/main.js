import {
  PRESETS,
  buildGeminiPrompts,
  recalculateTimelineDates,
} from './data/presets.js';
import { renderMobileLockScreen } from './renderer/renderMobile.js';
import { renderDesktopLockScreen } from './renderer/renderDesktop.js';
import { renderHandshakeCover } from './renderer/renderCover.js';

function clonePreset(key) {
  return JSON.parse(JSON.stringify(PRESETS[key] || PRESETS.career));
}

const state = {
  ...clonePreset('career'),
  theme: 'dark',
  device: 'ios',
  showClock: true,
  showSafeZones: false,
};

// DOM references
const mobileCanvas = document.getElementById('mobileCanvas');
const desktopCanvas = document.getElementById('desktopCanvas');
const coverCanvas = document.getElementById('coverCanvas');

const phoneShell = document.getElementById('phoneShell');
const desktopShell = document.getElementById('desktopShell');
const iosOverlay = document.getElementById('iosOverlay');
const androidOverlay = document.getElementById('androidOverlay');
const desktopOverlay = document.getElementById('desktopOverlay');

const missionTitleInput = document.getElementById('missionTitleInput');
const originCodeInput = document.getElementById('originCodeInput');
const destCodeInput = document.getElementById('destCodeInput');
const flightCodeInput = document.getElementById('flightCodeInput');
const startDateInput = document.getElementById('startDateInput');
const targetDateInput = document.getElementById('targetDateInput');
const milestonesEditor = document.getElementById('milestonesEditor');
const backwardPlanGrid = document.getElementById('backwardPlanGrid');

const promptBackward = document.getElementById('promptBackward');
const promptDesign = document.getElementById('promptDesign');
const promptReminders = document.getElementById('promptReminders');

function syncInputsFromState() {
  missionTitleInput.value = state.missionTitle;
  originCodeInput.value = state.originCode;
  destCodeInput.value = state.destCode;
  flightCodeInput.value = state.flightCode;
  startDateInput.value = state.startDate;
  targetDateInput.value = state.targetDate;
  renderMilestonesEditor();
}

function renderMilestonesEditor() {
  milestonesEditor.innerHTML = '';
  state.milestones.forEach((m, idx) => {
    const row = document.createElement('div');
    row.className = 'ms-row';
    if (idx < state.activeIndex) row.classList.add('is-done');
    if (idx === state.activeIndex) row.classList.add('is-active');

    const dotBtn = document.createElement('button');
    dotBtn.type = 'button';
    dotBtn.className = 'ms-dot-btn';
    dotBtn.title = `Set Stage ${idx + 1} as Active`;
    dotBtn.setAttribute('aria-label', `Set milestone ${idx + 1} as active`);
    dotBtn.addEventListener('click', () => {
      state.activeIndex = idx;
      renderMilestonesEditor();
      renderAll();
    });

    const tInput = document.createElement('input');
    tInput.type = 'text';
    tInput.className = 'ms-input mono';
    tInput.value = m.tMinus;
    tInput.maxLength = 5;
    tInput.setAttribute('aria-label', `Milestone ${idx + 1} countdown`);
    tInput.addEventListener('input', (e) => {
      m.tMinus = e.target.value;
      renderAll();
    });

    const dateInput = document.createElement('input');
    dateInput.type = 'text';
    dateInput.className = 'ms-input mono';
    dateInput.value = m.date;
    dateInput.maxLength = 7;
    dateInput.setAttribute('aria-label', `Milestone ${idx + 1} date`);
    dateInput.addEventListener('input', (e) => {
      m.date = e.target.value;
      renderAll();
    });

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'ms-input';
    titleInput.value = m.title;
    titleInput.maxLength = 34;
    titleInput.setAttribute('aria-label', `Milestone ${idx + 1} action`);
    titleInput.addEventListener('input', (e) => {
      m.title = e.target.value;
      renderAll();
    });

    row.append(dotBtn, tInput, dateInput, titleInput);
    milestonesEditor.appendChild(row);
  });
}

function renderBackwardPlanCards() {
  backwardPlanGrid.innerHTML = '';
  state.milestones.forEach((m, idx) => {
    const card = document.createElement('article');
    card.className = `plan-card${idx === state.activeIndex ? ' active' : ''}`;
    card.innerHTML = `
      <div class="plan-card-top">
        <span class="plan-tminus">${escapeHtml(m.tMinus)}</span>
        <span class="plan-date">${escapeHtml(m.date)} · STAGE 0${idx + 1}</span>
      </div>
      <h3>${escapeHtml(m.title)}</h3>
      <p>${escapeHtml(m.detail || 'Execute key milestone action and log progress in Gemini.')}</p>
      <div class="plan-done">✓ DONE: ${escapeHtml(m.doneCriteria || 'Milestone verified on schedule.')}</div>
    `;
    backwardPlanGrid.appendChild(card);
  });
}

function renderPrompts() {
  const prompts = buildGeminiPrompts(state);
  promptBackward.textContent = prompts.backwardPlan;
  promptDesign.textContent = prompts.multimodalDesign;
  promptReminders.textContent = prompts.dailyReminders;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function updateDeviceVisibility() {
  const isDesktop = state.device === 'desktop';
  phoneShell.classList.toggle('hidden', isDesktop);
  desktopShell.classList.toggle('hidden', !isDesktop);

  iosOverlay.classList.toggle('hidden', !state.showClock || state.device !== 'ios');
  androidOverlay.classList.toggle('hidden', !state.showClock || state.device !== 'android');
  desktopOverlay.classList.toggle('hidden', !state.showClock || state.device !== 'desktop');
}

function renderCanvases() {
  renderMobileLockScreen(mobileCanvas, state, { showSafeZones: state.showSafeZones });
  renderDesktopLockScreen(desktopCanvas, state, { showSafeZones: state.showSafeZones });
}

function renderAll() {
  updateDeviceVisibility();
  renderCanvases();
  renderBackwardPlanCards();
  renderPrompts();
}

function downloadCanvas(canvas, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function exportCleanMobile() {
  const cleanCanvas = document.createElement('canvas');
  renderMobileLockScreen(cleanCanvas, state, { showSafeZones: false });
  const slug = (state.id || 'custom').toLowerCase();
  downloadCanvas(cleanCanvas, `boarding-pass-${slug}-${state.theme}-1290x2796.png`);
}

function exportCleanDesktop() {
  const cleanCanvas = document.createElement('canvas');
  renderDesktopLockScreen(cleanCanvas, state, { showSafeZones: false });
  const slug = (state.id || 'custom').toLowerCase();
  downloadCanvas(cleanCanvas, `boarding-pass-${slug}-${state.theme}-3840x2160.png`);
}

function exportCleanCover() {
  renderHandshakeCover(coverCanvas, state);
  downloadCanvas(coverCanvas, 'handshake-cover-1600x1000.png');
}

// Wire device tabs
document.querySelectorAll('.seg-btn[data-device]').forEach((btn) => {
  btn.addEventListener('click', () => {
    state.device = btn.dataset.device;
    document.querySelectorAll('.seg-btn[data-device]').forEach((b) => {
      const isActive = b.dataset.device === state.device;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-selected', String(isActive));
    });
    renderAll();
  });
});

// Wire toggles
const toggleClockBtn = document.getElementById('toggleClockBtn');
toggleClockBtn.addEventListener('click', () => {
  state.showClock = !state.showClock;
  toggleClockBtn.classList.toggle('active', state.showClock);
  toggleClockBtn.setAttribute('aria-pressed', String(state.showClock));
  updateDeviceVisibility();
});

const toggleSafeZonesBtn = document.getElementById('toggleSafeZonesBtn');
toggleSafeZonesBtn.addEventListener('click', () => {
  state.showSafeZones = !state.showSafeZones;
  toggleSafeZonesBtn.classList.toggle('active', state.showSafeZones);
  toggleSafeZonesBtn.setAttribute('aria-pressed', String(state.showSafeZones));
  renderCanvases();
});

// Wire theme switcher
document.querySelectorAll('.theme-pill[data-theme]').forEach((btn) => {
  btn.addEventListener('click', () => {
    state.theme = btn.dataset.theme;
    document.querySelectorAll('.theme-pill[data-theme]').forEach((b) => {
      b.classList.toggle('active', b.dataset.theme === state.theme);
    });
    renderCanvases();
  });
});

// Wire presets
document.querySelectorAll('.preset-btn[data-preset]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const preset = clonePreset(btn.dataset.preset);
    Object.assign(state, preset);
    document.querySelectorAll('.preset-btn[data-preset]').forEach((b) => {
      b.classList.toggle('active', b.dataset.preset === btn.dataset.preset);
    });
    syncInputsFromState();
    renderAll();
  });
});

// Wire form inputs
missionTitleInput.addEventListener('input', (e) => {
  state.missionTitle = e.target.value;
  renderAll();
});
originCodeInput.addEventListener('input', (e) => {
  state.originCode = e.target.value;
  renderAll();
});
destCodeInput.addEventListener('input', (e) => {
  state.destCode = e.target.value;
  renderAll();
});
flightCodeInput.addEventListener('input', (e) => {
  state.flightCode = e.target.value;
  renderAll();
});
startDateInput.addEventListener('change', (e) => {
  state.startDate = e.target.value;
  recalculateTimelineDates(state);
  renderMilestonesEditor();
  renderAll();
});
targetDateInput.addEventListener('change', (e) => {
  state.targetDate = e.target.value;
  recalculateTimelineDates(state);
  renderMilestonesEditor();
  renderAll();
});

document.getElementById('recalcDatesBtn').addEventListener('click', () => {
  recalculateTimelineDates(state);
  renderMilestonesEditor();
  renderAll();
});

// Wire export buttons
document.getElementById('exportMobileBtn').addEventListener('click', exportCleanMobile);
document.getElementById('navDownloadBtn').addEventListener('click', exportCleanMobile);
document.getElementById('exportDesktopBtn').addEventListener('click', exportCleanDesktop);
document.getElementById('exportCoverBtn').addEventListener('click', exportCleanCover);

// Wire copy buttons for Gemini prompts
document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const key = btn.dataset.copy;
    const prompts = buildGeminiPrompts(state);
    const text = prompts[key] || '';
    try {
      await navigator.clipboard.writeText(text);
      const prev = btn.textContent;
      btn.textContent = 'Copied ✓';
      setTimeout(() => {
        btn.textContent = prev;
      }, 1600);
    } catch {
      btn.textContent = 'Select & Copy';
    }
  });
});

// Expose deterministic high-res asset renderer for headless build/export scripts
window.__renderExportDataUrl = (kind) => {
  const c = document.createElement('canvas');
  if (kind === 'mobile-dark') {
    renderMobileLockScreen(c, { ...state, theme: 'dark' }, { showSafeZones: false });
  } else if (kind === 'mobile-light') {
    renderMobileLockScreen(c, { ...state, theme: 'light' }, { showSafeZones: false });
  } else if (kind === 'desktop-dark') {
    renderDesktopLockScreen(c, { ...state, theme: 'dark' }, { showSafeZones: false });
  } else if (kind === 'cover') {
    renderHandshakeCover(c, { ...state, theme: 'dark' });
  }
  return c.toDataURL('image/png');
};

// Boot after fonts load so Canvas 2D draws Space Grotesk & JetBrains Mono crisply
async function boot() {
  syncInputsFromState();
  renderAll();
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
    renderAll();
  }
}

boot();
