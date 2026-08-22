/**
 * UNICORE: Welcome to Italy with Yohannes (v3.0 Friendly Mentorship Edition)
 * State Management, Flexible Dynamic Budget Simulator, Healthcare Triage, Audio Synthesis, Web Audio Chimes
 */

document.addEventListener('DOMContentLoaded', () => {
  const TOTAL_CHAPTERS = 12;
  const STORAGE_KEY = 'unicore_yohannes_progress';
  const BACKPACK_KEY = 'unicore_yohannes_backpack';
  const CHECKLIST_KEY = 'unicore_yohannes_checklist';

  // Milestone Backpack Rewards
  const BACKPACK_ITEMS = [
    { id: 'docs', icon: 'fa-solid fa-folder-closed', name: 'Pre-Departure Folder', desc: 'Degree certificates, visa/laissez-passer & comfort foods' },
    { id: 'adapter', icon: 'fa-solid fa-plug', name: 'EU Adapter & Coat', desc: 'Type C/L plug adapter, warm jacket & Google Maps offline' },
    { id: 'cash', icon: 'fa-solid fa-money-bill-wave', name: 'Pocket Euros (€)', desc: 'Small cash notes for airport transit & initial needs' },
    { id: 'sim', icon: 'fa-solid fa-sim-card', name: 'Italian SIM & Apps', desc: 'Local mobile data, Google Maps & Trenitalia app' },
    { id: 'cf', icon: 'fa-solid fa-id-card', name: 'Codice Fiscale & Kit', desc: 'Tax code & postal receipt (Ricevuta) legal shield' },
    { id: 'badge', icon: 'fa-solid fa-id-badge', name: 'Student Badge & Email', desc: 'Institutional university email & campus card' },
    { id: 'bank', icon: 'fa-solid fa-credit-card', name: 'Student Bank (IBAN)', desc: 'Zero-fee account & smart monthly budget plan' },
    { id: 'ssn', icon: 'fa-solid fa-heart-pulse', name: 'Tessera Sanitaria', desc: 'SSN public health card & Medico di Base' },
    { id: 'phrasebook', icon: 'fa-solid fa-book-open-reader', name: 'Spoken Italian Guide', desc: '10 Essential polite daily phrases with audio' },
    { id: 'transit', icon: 'fa-solid fa-bus-simple', name: 'Student Transit Pass', desc: 'Subsidized regional bus & metro travel card' },
    { id: 'buddy', icon: 'fa-solid fa-handshake-angle', name: 'Community & Mentors', desc: 'Peer buddy, study cohort & UNICORE Alumni' },
    { id: 'laurea', icon: 'fa-solid fa-graduation-cap', name: 'Master Laurea & Launch', desc: '120 CFU degree, Erasmus+ & 12-Mo Job Permit' }
  ];

  let currentChapter = 0;
  let unlockedItems = new Set();
  let checkedTasks = new Set();

  // Audio Context for UI Chimes
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playChime(type = 'step') {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'unlock') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.09);
        osc.frequency.setValueAtTime(783.99, now + 0.18);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'complete') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'triangle';
          o.frequency.setValueAtTime(freq, now + i * 0.08);
          o.connect(g);
          g.connect(ctx.destination);
          g.gain.setValueAtTime(0.15, now + i * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          o.start(now + i * 0.08);
          o.stop(now + 0.8);
        });
      }
    } catch (e) {
      // Silent fallback
    }
  }

  // DOM Elements
  const chapterCards = document.querySelectorAll('.journey-chapter-card');
  const scrubberPills = document.querySelectorAll('.scrubber-pill');
  const prevBtn = document.getElementById('journeyPrevBtn');
  const nextBtn = document.getElementById('journeyNextBtn');
  const currentChapterNumEl = document.getElementById('currentChapterNum');
  const chapterTitleHeaderEl = document.getElementById('chapterTitleHeader');
  const progressBarFill = document.getElementById('journeyProgressBarFill');
  const backpackCountEl = document.getElementById('backpackCount');
  const backpackModal = document.getElementById('backpackModal');
  const backpackToggleBtn = document.getElementById('backpackToggleBtn');
  const closeBackpackBtn = document.getElementById('closeBackpackBtn');
  const backpackGridEl = document.getElementById('backpackItemsGrid');
  const audioBtns = document.querySelectorAll('.phrase-audio-btn');
  const interactiveCheckboxes = document.querySelectorAll('.interactive-check-input');

  // Load Saved State
  function loadSavedState() {
    try {
      const savedChapter = localStorage.getItem(STORAGE_KEY);
      if (savedChapter !== null) {
        currentChapter = parseInt(savedChapter, 10);
        if (isNaN(currentChapter) || currentChapter < 0 || currentChapter >= TOTAL_CHAPTERS) {
          currentChapter = 0;
        }
      }

      const savedBackpack = localStorage.getItem(BACKPACK_KEY);
      if (savedBackpack) {
        unlockedItems = new Set(JSON.parse(savedBackpack));
      } else {
        for (let i = 0; i <= currentChapter; i++) {
          if (BACKPACK_ITEMS[i]) unlockedItems.add(BACKPACK_ITEMS[i].id);
        }
      }

      const savedChecks = localStorage.getItem(CHECKLIST_KEY);
      if (savedChecks) {
        checkedTasks = new Set(JSON.parse(savedChecks));
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
      currentChapter = 0;
      unlockedItems = new Set([BACKPACK_ITEMS[0].id]);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, currentChapter.toString());
      localStorage.setItem(BACKPACK_KEY, JSON.stringify(Array.from(unlockedItems)));
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(Array.from(checkedTasks)));
    } catch (e) {
      console.warn('Could not write to localStorage', e);
    }
  }

  // Render Current Chapter
  function renderChapter(index, isUserAction = false) {
    if (index < 0) index = 0;
    if (index >= TOTAL_CHAPTERS) index = TOTAL_CHAPTERS - 1;
    currentChapter = index;

    if (BACKPACK_ITEMS[currentChapter]) {
      const wasLocked = !unlockedItems.has(BACKPACK_ITEMS[currentChapter].id);
      unlockedItems.add(BACKPACK_ITEMS[currentChapter].id);
      if (wasLocked && isUserAction) {
        playChime('unlock');
      }
    }
    saveState();

    chapterCards.forEach((card, idx) => {
      if (idx === currentChapter) {
        card.classList.add('active');
        card.style.display = 'block';
      } else {
        card.classList.remove('active');
        card.style.display = 'none';
      }
    });

    scrubberPills.forEach((pill, idx) => {
      if (idx === currentChapter) {
        pill.classList.add('active');
        pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else if (idx < currentChapter) {
        pill.classList.remove('active');
        pill.classList.add('completed');
      } else {
        pill.classList.remove('active');
        pill.classList.remove('completed');
      }
    });

    const activeCard = chapterCards[currentChapter];
    const chapterName = activeCard ? activeCard.getAttribute('data-title') : `Chapter ${currentChapter + 1}`;
    if (currentChapterNumEl) currentChapterNumEl.textContent = (currentChapter + 1).toString();
    if (chapterTitleHeaderEl) chapterTitleHeaderEl.textContent = chapterName;

    const percent = Math.round(((currentChapter + 1) / TOTAL_CHAPTERS) * 100);
    if (progressBarFill) progressBarFill.style.width = `${percent}%`;

    if (prevBtn) {
      prevBtn.disabled = currentChapter === 0;
      prevBtn.style.opacity = currentChapter === 0 ? '0.4' : '1';
    }

    if (nextBtn) {
      if (currentChapter === TOTAL_CHAPTERS - 1) {
        nextBtn.innerHTML = '<i class="fa-solid fa-trophy"></i> Complete Welcome Guide';
        nextBtn.classList.add('btn-complete-journey');
      } else {
        nextBtn.innerHTML = 'Next Step <i class="fa-solid fa-arrow-right"></i>';
        nextBtn.classList.remove('btn-complete-journey');
      }
    }

    if (backpackCountEl) {
      backpackCountEl.textContent = `${unlockedItems.size}/${TOTAL_CHAPTERS}`;
    }

    renderBackpackGrid();
    restoreCheckboxes();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderBackpackGrid() {
    if (!backpackGridEl) return;
    backpackGridEl.innerHTML = '';

    BACKPACK_ITEMS.forEach((item, idx) => {
      const isUnlocked = unlockedItems.has(item.id);
      const itemEl = document.createElement('div');
      itemEl.className = `backpack-item ${isUnlocked ? 'unlocked' : 'locked'}`;

      itemEl.innerHTML = `
        <div class="backpack-item-icon">
          <i class="${item.icon}"></i>
        </div>
        <div class="backpack-item-info">
          <div class="backpack-item-title">${item.name}</div>
          <div class="backpack-item-desc">${isUnlocked ? item.desc : `Unlocked in Chapter ${idx + 1}`}</div>
        </div>
        <div class="backpack-item-status">
          ${isUnlocked ? '<i class="fa-solid fa-circle-check" style="color: #059669; font-size: 1.15rem;"></i>' : '<i class="fa-solid fa-lock" style="color: #94a3b8;"></i>'}
        </div>
      `;

      backpackGridEl.appendChild(itemEl);
    });
  }

  function restoreCheckboxes() {
    interactiveCheckboxes.forEach((cb) => {
      const id = cb.getAttribute('data-task-id');
      if (id && checkedTasks.has(id)) {
        cb.checked = true;
        const parentLi = cb.closest('li');
        if (parentLi) parentLi.classList.add('task-completed');
      }
    });
  }

  interactiveCheckboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      const id = cb.getAttribute('data-task-id');
      const parentLi = cb.closest('li');
      if (cb.checked) {
        if (id) checkedTasks.add(id);
        if (parentLi) parentLi.classList.add('task-completed');
        playChime('correct');
      } else {
        if (id) checkedTasks.delete(id);
        if (parentLi) parentLi.classList.remove('task-completed');
      }
      saveState();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentChapter > 0) renderChapter(currentChapter - 1, true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentChapter < TOTAL_CHAPTERS - 1) {
        renderChapter(currentChapter + 1, true);
      } else {
        playChime('complete');
        triggerConfetti();
        openBackpackModal();
      }
    });
  }

  scrubberPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const idx = parseInt(pill.getAttribute('data-chapter'), 10);
      if (!isNaN(idx)) renderChapter(idx, true);
    });
  });

  function openBackpackModal() {
    if (backpackModal) {
      backpackModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeBackpackModal() {
    if (backpackModal) {
      backpackModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (backpackToggleBtn) backpackToggleBtn.addEventListener('click', openBackpackModal);
  if (closeBackpackBtn) closeBackpackBtn.addEventListener('click', closeBackpackModal);
  if (backpackModal) {
    backpackModal.addEventListener('click', (e) => {
      if (e.target === backpackModal) closeBackpackModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (backpackModal && backpackModal.classList.contains('active')) {
      if (e.key === 'Escape') closeBackpackModal();
      return;
    }
    if (e.key === 'ArrowRight') {
      if (currentChapter < TOTAL_CHAPTERS - 1) renderChapter(currentChapter + 1, true);
    } else if (e.key === 'ArrowLeft') {
      if (currentChapter > 0) renderChapter(currentChapter - 1, true);
    }
  });

  // Web Speech Spoken Italian
  if ('speechSynthesis' in window) {
    audioBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-phrase');
        if (!text) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'it-IT';
        utterance.rate = 0.85;

        btn.classList.add('speaking');
        utterance.onend = () => btn.classList.remove('speaking');
        utterance.onerror = () => btn.classList.remove('speaking');

        window.speechSynthesis.speak(utterance);
      });
    });
  }

  // Enhanced Dynamic Student Budget Simulator (Flexible Stipend Input)
  const stipendSlider = document.getElementById('budgetStipend');
  const rentSlider = document.getElementById('budgetRent');
  const foodSlider = document.getElementById('budgetFood');
  const otherSlider = document.getElementById('budgetOther');
  const totalCostEl = document.getElementById('budgetTotalDisplay');
  const balanceStatusEl = document.getElementById('budgetBalanceStatus');

  function updateBudgetCalc() {
    if (!stipendSlider || !rentSlider || !foodSlider || !otherSlider || !totalCostEl) return;
    
    const stipend = parseInt(stipendSlider.value, 10) || 500;
    const rent = parseInt(rentSlider.value, 10) || 0;
    const food = parseInt(foodSlider.value, 10) || 0;
    const other = parseInt(otherSlider.value, 10) || 0;
    const total = rent + food + other;

    totalCostEl.textContent = `€${total}`;
    const sEl = document.getElementById('stipendVal');
    const rEl = document.getElementById('rentVal');
    const fEl = document.getElementById('foodVal');
    const oEl = document.getElementById('otherVal');
    
    if (sEl) sEl.textContent = `€${stipend}/mo`;
    if (rEl) rEl.textContent = `€${rent}`;
    if (fEl) fEl.textContent = `€${food}`;
    if (oEl) oEl.textContent = `€${other}`;

    if (balanceStatusEl) {
      if (total <= stipend) {
        const saved = stipend - total;
        balanceStatusEl.innerHTML = `
          <div class="budget-status-box positive">
            <span style="color: #059669; font-weight: 800; font-size: 0.95rem;">
              <i class="fa-solid fa-circle-check"></i> Great Plan! You save €${saved}/month.
            </span>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.8rem; color: #065f46;">
              💡 <strong>Yohannes Tip:</strong> Put this €${saved} directly into your Erasmus+ / Job Search transition savings buffer!
            </p>
          </div>
        `;
      } else {
        const over = total - stipend;
        balanceStatusEl.innerHTML = `
          <div class="budget-status-box negative">
            <span style="color: #dc2626; font-weight: 800; font-size: 0.95rem;">
              <i class="fa-solid fa-triangle-exclamation"></i> Deficit Alert: €${over}/month above your stipend!
            </span>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.8rem; color: #991b1b;">
              💡 <strong>Yohannes Tip:</strong> Use the university Mensa (Fascia 0/1 subsidized meals for €2–€3) and cook with roommates to stay balanced!
            </p>
          </div>
        `;
      }
    }
  }

  [stipendSlider, rentSlider, foodSlider, otherSlider].forEach(slider => {
    if (slider) slider.addEventListener('input', updateBudgetCalc);
  });
  updateBudgetCalc();

  // Symptom Triage Tool (Italian Healthcare System)
  const triageOptions = document.querySelectorAll('.triage-select-btn');
  const triageOutput = document.getElementById('triageResultBox');

  const triageMap = {
    cold: {
      title: '💊 Non-Emergency: Cold, Cough, Muscle Pain, or Minor Ailment',
      dest: 'Walk into your local Farmacia (Green Cross) or contact your Medico di Base',
      action: 'Pharmacists in Italy are trained healthcare professionals and can recommend over-the-counter medicine. For sick leave certificates or prescription medicine, message or call your assigned Medico di Base (Family Doctor). Consultations and prescriptions are 100% free.',
      urgent: false
    },
    fever: {
      title: '🩺 Persistent Illness or Specialist Visit Referral (*Impegnativa*)',
      dest: 'Contact your assigned Medico di Base (Family Doctor)',
      action: 'Call your family doctor during clinic hours. If you need blood tests, X-rays, or a specialist doctor (e.g. dermatologist, dentist, ophthalmologist), your doctor will write an electronic prescription (Ricetta Elettronica) for the public hospital network with subsidized ticket fees.',
      urgent: false
    },
    night: {
      title: '🌙 Night or Weekend Sudden Illness (When Doctor's Clinic is Closed)',
      dest: 'Call or visit the local Guardia Medica (Continuità Assistenziale)',
      action: 'Every Italian city has a free out-of-hours public doctor service (Guardia Medica) open every night from 20:00 to 08:00, and 24 hours on weekends/holidays. They provide free medical consultations and urgent prescriptions when your family doctor is unavailable.',
      urgent: false
    },
    emergency: {
      title: '🚨 Severe Accident, Chest Pain, or Difficulty Breathing',
      dest: 'Call 112 or go straight to Pronto Soccorso (Emergency Hospital)',
      action: 'Dial 112 (free from any mobile phone) for emergency ambulance dispatch or proceed immediately to the hospital Pronto Soccorso. Emergency care is guaranteed to all persons regardless of residency status.',
      urgent: true
    },
    mental: {
      title: '🧠 Feeling Overwhelmed, Anxious, Isolated, or Stressed',
      dest: 'Free University Psychological Counseling & SAMIFO Center',
      action: 'Every Italian university offers confidential, 100% free psychological counseling (Servizio di Counseling Psicologico). You can also access SAMIFO (specialized refugee health centers in Rome/Milan) or 100% therapy refunds through Assolavoro.',
      urgent: false
    }
  };

  triageOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      triageOptions.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-triage');
      const res = triageMap[key];
      if (res && triageOutput) {
        triageOutput.innerHTML = `
          <div class="triage-result-card ${res.urgent ? 'urgent' : ''}">
            <div class="triage-res-title">${res.title}</div>
            <div class="triage-res-dest"><strong>Where to go:</strong> ${res.dest}</div>
            <div class="triage-res-action">${res.action}</div>
          </div>
        `;
        playChime('step');
      }
    });
  });

  // Mini Quizzes
  document.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const container = btn.closest('.mini-quiz-box');
      if (!container) return;

      const isCorrect = btn.getAttribute('data-correct') === 'true';
      const feedbackEl = container.querySelector('.quiz-feedback');

      container.querySelectorAll('.quiz-option-btn').forEach(b => {
        b.disabled = true;
        if (b.getAttribute('data-correct') === 'true') {
          b.classList.add('correct');
        } else if (b === btn && !isCorrect) {
          b.classList.add('wrong');
        }
      });

      if (feedbackEl) {
        if (isCorrect) {
          feedbackEl.innerHTML = `<span style="color: #059669; font-weight: 800;"><i class="fa-solid fa-circle-check"></i> Exactly right!</span> ${btn.getAttribute('data-explanation') || ''}`;
          playChime('correct');
        } else {
          feedbackEl.innerHTML = `<span style="color: #dc2626; font-weight: 800;"><i class="fa-solid fa-circle-xmark"></i> Not quite!</span> ${btn.getAttribute('data-explanation') || ''}`;
        }
        feedbackEl.style.display = 'block';
      }
    });
  });

  // Confetti Animation
  function triggerConfetti() {
    try {
      const duration = 3500;
      const end = Date.now() + duration;
      const colors = ['#1d4ed8', '#38bdf8', '#059669', '#f59e0b', '#ec4899', '#8b5cf6'];

      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '99999';
      document.body.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      for (let i = 0; i < 110; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * -canvas.height,
          size: Math.random() * 8 + 4,
          speedY: Math.random() * 4 + 2,
          speedX: (Math.random() - 0.5) * 3.5,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.rotation += p.rotSpeed;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        });

        if (Date.now() < end) {
          requestAnimationFrame(draw);
        } else {
          canvas.remove();
        }
      }
      draw();
    } catch (e) {
      console.log('Confetti completed');
    }
  }

  loadSavedState();
  renderChapter(currentChapter);
});
