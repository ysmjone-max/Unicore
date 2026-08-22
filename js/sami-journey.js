/**
 * UNICORE: Welcome to Italy with Yohannes (v3.2 Ultra-Smooth Flow & Responsive Animation Engine)
 * Robust Navigation, Dual Direction Transitions, Chapter Jump Selector, In-Card Continue Buttons
 */

(function () {
  'use strict';

  const TOTAL_CHAPTERS = 12;
  const STORAGE_KEY = 'unicore_yohannes_progress';
  const BACKPACK_KEY = 'unicore_yohannes_backpack';
  const CHECKLIST_KEY = 'unicore_yohannes_checklist';

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
  let navigationDirection = 'next'; // 'next' or 'prev'

  // Web Audio Synthesizer (Safe & Non-blocking)
  let audioCtx = null;
  function playSound(type = 'step') {
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'unlock') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880, now + 0.07);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'step') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'complete') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const o = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          o.type = 'triangle';
          o.frequency.setValueAtTime(freq, now + i * 0.08);
          o.connect(g);
          g.connect(audioCtx.destination);
          g.gain.setValueAtTime(0.12, now + i * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
          o.start(now + i * 0.08);
          o.stop(now + 0.7);
        });
      }
    } catch (e) {
      // Audio fallback
    }
  }

  function initJourney() {
    loadSavedState();

    // Attach Event Listeners to Navigation Elements
    attachNavigationListeners();
    attachInteractiveTools();
    attachAudioPhrases();
    attachQuizzes();
    attachTouchGestures();

    // Render Initial Chapter
    renderChapter(currentChapter, false);
  }

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
      // Storage fallback
    }
  }

  function renderChapter(index, isUserAction = false) {
    if (index < 0) index = 0;
    if (index >= TOTAL_CHAPTERS) index = TOTAL_CHAPTERS - 1;

    navigationDirection = index >= currentChapter ? 'next' : 'prev';
    currentChapter = index;

    // Unlock Backpack Item
    if (BACKPACK_ITEMS[currentChapter]) {
      const wasLocked = !unlockedItems.has(BACKPACK_ITEMS[currentChapter].id);
      unlockedItems.add(BACKPACK_ITEMS[currentChapter].id);
      if (wasLocked && isUserAction) {
        playSound('unlock');
      }
    }
    saveState();

    const chapterCards = document.querySelectorAll('.journey-chapter-card');
    chapterCards.forEach((card, idx) => {
      if (idx === currentChapter) {
        card.style.display = 'block';
        card.classList.remove('slide-in-right', 'slide-in-left');
        card.classList.add(navigationDirection === 'next' ? 'slide-in-right' : 'slide-in-left');
        card.classList.add('active');
      } else {
        card.style.display = 'none';
        card.classList.remove('active', 'slide-in-right', 'slide-in-left');
      }
    });

    // Update Scrubber Pills
    const scrubberPills = document.querySelectorAll('.scrubber-pill');
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

    // Update Sticky Headers
    const activeCard = chapterCards[currentChapter];
    const chapterName = activeCard ? activeCard.getAttribute('data-title') : `Chapter ${currentChapter + 1}`;
    
    const currentNumEl = document.getElementById('currentChapterNum');
    const titleHeaderEl = document.getElementById('chapterTitleHeader');
    const progressBarFill = document.getElementById('journeyProgressBarFill');
    const backpackCountEl = document.getElementById('backpackCount');

    if (currentNumEl) currentNumEl.textContent = (currentChapter + 1).toString();
    if (titleHeaderEl) titleHeaderEl.textContent = chapterName;

    const percent = Math.round(((currentChapter + 1) / TOTAL_CHAPTERS) * 100);
    if (progressBarFill) progressBarFill.style.width = `${percent}%`;

    if (backpackCountEl) {
      backpackCountEl.textContent = `${unlockedItems.size}/${TOTAL_CHAPTERS}`;
    }

    // Update Bottom & In-Card Navigation Buttons
    updateNavButtons();
    renderBackpackGrid();
    restoreCheckboxes();

    if (isUserAction) {
      playSound('step');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }

  function updateNavButtons() {
    const prevBtns = document.querySelectorAll('.btn-journey-prev, #journeyPrevBtn');
    const nextBtns = document.querySelectorAll('.btn-journey-next, #journeyNextBtn, .in-card-continue-btn');

    prevBtns.forEach(btn => {
      btn.disabled = currentChapter === 0;
      btn.style.opacity = currentChapter === 0 ? '0.4' : '1';
      btn.style.pointerEvents = currentChapter === 0 ? 'none' : 'auto';
    });

    nextBtns.forEach(btn => {
      if (currentChapter === TOTAL_CHAPTERS - 1) {
        btn.innerHTML = '<i class="fa-solid fa-trophy"></i> Complete & Open Backpack';
        btn.classList.add('btn-complete-journey');
      } else {
        const nextIdx = currentChapter + 1;
        const nextCard = document.querySelector(`.journey-chapter-card[data-chapter="${nextIdx}"]`);
        const nextTitle = nextCard ? nextCard.getAttribute('data-title') : `Chapter ${nextIdx + 1}`;
        
        if (btn.classList.contains('in-card-continue-btn')) {
          btn.innerHTML = `Continue to ${nextTitle} <i class="fa-solid fa-arrow-right"></i>`;
        } else {
          btn.innerHTML = `Next Step <i class="fa-solid fa-arrow-right"></i>`;
        }
        btn.classList.remove('btn-complete-journey');
      }
    });
  }

  function attachNavigationListeners() {
    // Top & Bottom Prev Buttons
    document.addEventListener('click', (e) => {
      const prevTarget = e.target.closest('.btn-journey-prev, #journeyPrevBtn');
      if (prevTarget) {
        e.preventDefault();
        if (currentChapter > 0) renderChapter(currentChapter - 1, true);
        return;
      }

      const nextTarget = e.target.closest('.btn-journey-next, #journeyNextBtn, .in-card-continue-btn');
      if (nextTarget) {
        e.preventDefault();
        if (currentChapter < TOTAL_CHAPTERS - 1) {
          renderChapter(currentChapter + 1, true);
        } else {
          playSound('complete');
          triggerConfetti();
          openBackpackModal();
        }
        return;
      }

      const pillTarget = e.target.closest('.scrubber-pill');
      if (pillTarget) {
        e.preventDefault();
        const idx = parseInt(pillTarget.getAttribute('data-chapter'), 10);
        if (!isNaN(idx)) renderChapter(idx, true);
        return;
      }

      // Backpack Modal Toggles
      if (e.target.closest('#backpackToggleBtn, .open-backpack-action')) {
        e.preventDefault();
        openBackpackModal();
        return;
      }

      if (e.target.closest('#closeBackpackBtn, .backpack-modal-backdrop')) {
        if (e.target.closest('#closeBackpackBtn') || e.target.classList.contains('backpack-modal-backdrop')) {
          e.preventDefault();
          closeBackpackModal();
          return;
        }
      }
    });

    // Keyboard Shortcuts (Arrow Left/Right)
    document.addEventListener('keydown', (e) => {
      const modal = document.getElementById('backpackModal');
      if (modal && modal.classList.contains('active')) {
        if (e.key === 'Escape') closeBackpackModal();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentChapter < TOTAL_CHAPTERS - 1) renderChapter(currentChapter + 1, true);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentChapter > 0) renderChapter(currentChapter - 1, true);
      }
    });
  }

  // Touch Gestures (Non-interfering)
  function attachTouchGestures() {
    let startX = 0;
    let startY = 0;
    let isTracking = false;

    const mainArea = document.querySelector('main');
    if (!mainArea) return;

    mainArea.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isTracking = true;
      }
    }, { passive: true });

    mainArea.addEventListener('touchend', (e) => {
      if (!isTracking || e.changedTouches.length !== 1) return;
      isTracking = false;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;

      // Ensure clear horizontal intent (> 85px and horizontal > 2x vertical)
      if (Math.abs(diffX) > 85 && Math.abs(diffX) > Math.abs(diffY) * 2) {
        if (diffX < 0) {
          // Swipe Left -> Next
          if (currentChapter < TOTAL_CHAPTERS - 1) renderChapter(currentChapter + 1, true);
        } else {
          // Swipe Right -> Prev
          if (currentChapter > 0) renderChapter(currentChapter - 1, true);
        }
      }
    }, { passive: true });
  }

  function renderBackpackGrid() {
    const backpackGridEl = document.getElementById('backpackItemsGrid');
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

  function openBackpackModal() {
    const modal = document.getElementById('backpackModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeBackpackModal() {
    const modal = document.getElementById('backpackModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function restoreCheckboxes() {
    document.querySelectorAll('.interactive-check-input').forEach((cb) => {
      const id = cb.getAttribute('data-task-id');
      if (id && checkedTasks.has(id)) {
        cb.checked = true;
        const parentLi = cb.closest('li');
        if (parentLi) parentLi.classList.add('task-completed');
      }
    });
  }

  function attachInteractiveTools() {
    // Checkboxes
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('interactive-check-input')) {
        const id = e.target.getAttribute('data-task-id');
        const parentLi = e.target.closest('li');
        if (e.target.checked) {
          if (id) checkedTasks.add(id);
          if (parentLi) parentLi.classList.add('task-completed');
          playSound('correct');
        } else {
          if (id) checkedTasks.delete(id);
          if (parentLi) parentLi.classList.remove('task-completed');
        }
        saveState();
      }
    });

    // Dynamic Budget Calculation
    const stipendInput = document.getElementById('budgetStipendInput');
    const stipendSlider = document.getElementById('budgetStipendSlider');
    const presetPills = document.querySelectorAll('.preset-pill');

    const rentSlider = document.getElementById('budgetRent');
    const foodSlider = document.getElementById('budgetFood');
    const phoneSlider = document.getElementById('budgetPhone');
    const transitSlider = document.getElementById('budgetTransit');
    const otherSlider = document.getElementById('budgetOther');

    function calculateBudget() {
      if (!stipendInput) return;

      let stipend = parseFloat(stipendInput.value) || 0;
      if (stipend < 0) stipend = 0;

      const rent = parseFloat(rentSlider ? rentSlider.value : 150) || 0;
      const food = parseFloat(foodSlider ? foodSlider.value : 180) || 0;
      const phone = parseFloat(phoneSlider ? phoneSlider.value : 30) || 0;
      const transit = parseFloat(transitSlider ? transitSlider.value : 25) || 0;
      const other = parseFloat(otherSlider ? otherSlider.value : 45) || 0;

      const totalExpenses = rent + food + phone + transit + other;
      const netMonthly = stipend - totalExpenses;
      const annualSavings = netMonthly * 10;

      if (document.getElementById('rentVal')) document.getElementById('rentVal').textContent = `€${rent}`;
      if (document.getElementById('foodVal')) document.getElementById('foodVal').textContent = `€${food}`;
      if (document.getElementById('phoneVal')) document.getElementById('phoneVal').textContent = `€${phone}`;
      if (document.getElementById('transitVal')) document.getElementById('transitVal').textContent = `€${transit}`;
      if (document.getElementById('otherVal')) document.getElementById('otherVal').textContent = `€${other}`;

      const totalDisplay = document.getElementById('budgetTotalDisplay');
      const netDisplay = document.getElementById('budgetNetBalanceDisplay');
      const annualDisplay = document.getElementById('budgetAnnualSavingsDisplay');
      const balanceStatusEl = document.getElementById('budgetBalanceStatus');

      if (totalDisplay) totalDisplay.textContent = `€${totalExpenses}`;

      if (netDisplay) {
        if (netMonthly >= 0) {
          netDisplay.textContent = `+€${netMonthly}`;
          netDisplay.className = 'metric-val text-surplus';
        } else {
          netDisplay.textContent = `-€${Math.abs(netMonthly)}`;
          netDisplay.className = 'metric-val text-deficit';
        }
      }

      if (annualDisplay) {
        if (annualSavings >= 0) {
          annualDisplay.textContent = `+€${annualSavings} Saved`;
          annualDisplay.className = 'metric-val text-surplus';
        } else {
          annualDisplay.textContent = `-€${Math.abs(annualSavings)} Deficit`;
          annualDisplay.className = 'metric-val text-deficit';
        }
      }

      if (balanceStatusEl) {
        if (netMonthly >= 100) {
          balanceStatusEl.innerHTML = `
            <div class="budget-status-box positive">
              <span class="status-title"><i class="fa-solid fa-circle-check"></i> Outstanding Budgeting! (+€${netMonthly}/mo)</span>
              <p class="status-desc">
                Over your 10-month Master's academic year, you will build a <strong>€${annualSavings} savings fund</strong>. This is enough to fund an <strong>Erasmus+ mobility semester</strong> in another EU country or cover your post-graduation job search transition permit (*Art. 39-bis.1*)!
              </p>
            </div>
          `;
        } else if (netMonthly >= 0) {
          balanceStatusEl.innerHTML = `
            <div class="budget-status-box balanced">
              <span class="status-title"><i class="fa-solid fa-scale-balanced"></i> Healthy Balanced Budget (+€${netMonthly}/mo)</span>
              <p class="status-desc">
                You are living comfortably within your scholarship amount with €${netMonthly}/month set aside for unforeseen expenses. 
              </p>
            </div>
          `;
        } else {
          const deficit = Math.abs(netMonthly);
          balanceStatusEl.innerHTML = `
            <div class="budget-status-box negative">
              <span class="status-title"><i class="fa-solid fa-triangle-exclamation"></i> Budget Deficit Alert: -€${deficit}/month</span>
              <p class="status-desc">
                Your planned expenses exceed your monthly stipend by €${deficit}. 
                <br>💡 <strong>Yohannes Tip:</strong> Apply for university canteen (*Mensa*) Fascia 0 (€2.50 full meals), share groceries with roommates, and buy student discounted annual transit passes to eliminate this deficit!
              </p>
            </div>
          `;
        }
      }
    }

    if (stipendInput && stipendSlider) {
      stipendInput.addEventListener('input', () => {
        stipendSlider.value = stipendInput.value;
        presetPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-amount') === stipendInput.value));
        calculateBudget();
      });

      stipendSlider.addEventListener('input', () => {
        stipendInput.value = stipendSlider.value;
        presetPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-amount') === stipendSlider.value));
        calculateBudget();
      });
    }

    presetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const amount = pill.getAttribute('data-amount');
        if (stipendInput && stipendSlider) {
          stipendInput.value = amount;
          stipendSlider.value = amount;
          presetPills.forEach(p => p.classList.toggle('active', p === pill));
          calculateBudget();
          playSound('step');
        }
      });
    });

    [rentSlider, foodSlider, phoneSlider, transitSlider, otherSlider].forEach(slider => {
      if (slider) slider.addEventListener('input', calculateBudget);
    });

    calculateBudget();

    // Healthcare Triage
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
          playSound('step');
        }
      });
    });
  }

  function attachAudioPhrases() {
    if ('speechSynthesis' in window) {
      document.querySelectorAll('.phrase-audio-btn').forEach((btn) => {
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
  }

  function attachQuizzes() {
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
            playSound('correct');
          } else {
            feedbackEl.innerHTML = `<span style="color: #dc2626; font-weight: 800;"><i class="fa-solid fa-circle-xmark"></i> Not quite!</span> ${btn.getAttribute('data-explanation') || ''}`;
          }
          feedbackEl.style.display = 'block';
        }
      });
    });
  }

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
      // Confetti fallback
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJourney);
  } else {
    initJourney();
  }
})();
