/**
 * UNICORE: Welcome to Italy with Yohannes (v4.0 Bulletproof Storybook Edition)
 * ScrollSpy, Milestone Progress Persistence, Dynamic Budget Calculator, Healthcare Triage, Audio Speech
 */

(function () {
  'use strict';

  const STORAGE_READ_KEY = 'unicore_yohannes_read_chapters';
  const STORAGE_CHECK_KEY = 'unicore_yohannes_checked_tasks';
  const TOTAL_CHAPTERS = 12;

  let readChapters = new Set();
  let checkedTasks = new Set();

  // Web Audio Synthesizer (Safe)
  let audioCtx = null;
  function playSound(type = 'click') {
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

      if (type === 'check') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
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
      // audio fallback
    }
  }

  function init() {
    loadSavedState();
    setupScrollSpy();
    setupReadButtons();
    setupCheckboxes();
    setupBudgetCalculator();
    setupHealthcareTriage();
    setupItalianAudio();
    setupQuizzes();
    updateProgressUI();
  }

  function loadSavedState() {
    try {
      const savedRead = localStorage.getItem(STORAGE_READ_KEY);
      if (savedRead) readChapters = new Set(JSON.parse(savedRead));

      const savedChecks = localStorage.getItem(STORAGE_CHECK_KEY);
      if (savedChecks) checkedTasks = new Set(JSON.parse(savedChecks));
    } catch (e) {
      // localstorage fallback
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_READ_KEY, JSON.stringify(Array.from(readChapters)));
      localStorage.setItem(STORAGE_CHECK_KEY, JSON.stringify(Array.from(checkedTasks)));
    } catch (e) {
      // storage fallback
    }
  }

  function updateProgressUI() {
    const totalRead = readChapters.size;
    const percent = Math.round((totalRead / TOTAL_CHAPTERS) * 100);

    const progressText = document.getElementById('globalProgressText');
    const progressBar = document.getElementById('globalProgressBar');

    if (progressText) progressText.textContent = `${totalRead} / ${TOTAL_CHAPTERS} Read`;
    if (progressBar) progressBar.style.width = `${percent}%`;

    // Update Mark Read Buttons
    document.querySelectorAll('.mark-read-btn').forEach((btn) => {
      const chIdx = btn.getAttribute('data-chapter');
      if (readChapters.has(chIdx)) {
        btn.classList.add('read');
        btn.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #059669;"></i> Completed';
      } else {
        btn.classList.remove('read');
        if (chIdx === '11') {
          btn.innerHTML = '<i class="fa-solid fa-trophy"></i> Complete Entire Guide & Celebrate!';
        } else {
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Mark Chapter as Read';
        }
      }
    });
  }

  function setupScrollSpy() {
    const sections = document.querySelectorAll('.journey-section-card');
    const pills = document.querySelectorAll('.sticky-pill');

    function onScroll() {
      let currentSectionId = '';
      const scrollPos = window.scrollY + 200;

      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = sec.id;
        }
      });

      if (currentSectionId) {
        pills.forEach((pill) => {
          if (pill.getAttribute('href') === `#${currentSectionId}`) {
            pill.classList.add('active');
            pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          } else {
            pill.classList.remove('active');
          }
        });
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Smooth scroll on pill click
    pills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = pill.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          const headerOffset = 130;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  function setupReadButtons() {
    document.querySelectorAll('.mark-read-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const chIdx = btn.getAttribute('data-chapter');
        if (!chIdx) return;

        if (readChapters.has(chIdx)) {
          readChapters.delete(chIdx);
        } else {
          readChapters.add(chIdx);
          playSound('check');

          if (chIdx === '11' || readChapters.size === TOTAL_CHAPTERS) {
            playSound('complete');
            triggerConfetti();
          }
        }
        saveState();
        updateProgressUI();
      });
    });
  }

  function setupCheckboxes() {
    document.querySelectorAll('.journey-checkbox').forEach((cb) => {
      const taskId = cb.getAttribute('data-task');
      if (taskId && checkedTasks.has(taskId)) {
        cb.checked = true;
        const parentLi = cb.closest('li');
        if (parentLi) parentLi.classList.add('checked-task');
      }

      cb.addEventListener('change', () => {
        const id = cb.getAttribute('data-task');
        const parentLi = cb.closest('li');
        if (cb.checked) {
          if (id) checkedTasks.add(id);
          if (parentLi) parentLi.classList.add('checked-task');
          playSound('check');
        } else {
          if (id) checkedTasks.delete(id);
          if (parentLi) parentLi.classList.remove('checked-task');
        }
        saveState();
      });
    });
  }

  function setupBudgetCalculator() {
    const stipendInput = document.getElementById('budgetStipendInput');
    const stipendSlider = document.getElementById('budgetStipendSlider');
    const presetPills = document.querySelectorAll('.preset-pill');

    const rentSlider = document.getElementById('budgetRent');
    const foodSlider = document.getElementById('budgetFood');
    const phoneSlider = document.getElementById('budgetPhone');
    const transitSlider = document.getElementById('budgetTransit');
    const otherSlider = document.getElementById('budgetOther');

    const totalDisplay = document.getElementById('budgetTotalDisplay');
    const netDisplay = document.getElementById('budgetNetBalanceDisplay');
    const annualDisplay = document.getElementById('budgetAnnualSavingsDisplay');
    const balanceStatusEl = document.getElementById('budgetBalanceStatus');

    function calculate() {
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
        calculate();
      });

      stipendSlider.addEventListener('input', () => {
        stipendInput.value = stipendSlider.value;
        presetPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-amount') === stipendSlider.value));
        calculate();
      });
    }

    presetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const amount = pill.getAttribute('data-amount');
        if (stipendInput && stipendSlider) {
          stipendInput.value = amount;
          stipendSlider.value = amount;
          presetPills.forEach(p => p.classList.toggle('active', p === pill));
          calculate();
          playSound('check');
        }
      });
    });

    [rentSlider, foodSlider, phoneSlider, transitSlider, otherSlider].forEach(s => {
      if (s) s.addEventListener('input', calculate);
    });

    calculate();
  }

  function setupHealthcareTriage() {
    const buttons = document.querySelectorAll('.triage-select-btn');
    const resultBox = document.getElementById('triageResultBox');

    const triageData = {
      cold: {
        title: '💊 Non-Emergency: Cold, Cough, Muscle Pain, or Minor Ailment',
        dest: 'Walk into your local Farmacia (Green Cross) or contact your Medico di Base',
        action: 'Pharmacists in Italy are trained healthcare professionals and can recommend over-the-counter medicine. For sick leave certificates or prescription medicine, message or call your assigned Medico di Base (Family Doctor). Consultations and prescriptions are 100% free.'
      },
      fever: {
        title: '🩺 Persistent Illness or Specialist Visit Referral (*Impegnativa*)',
        dest: 'Contact your assigned Medico di Base (Family Doctor)',
        action: 'Call your family doctor during clinic hours. If you need blood tests, X-rays, or a specialist doctor (e.g. dermatologist, dentist, ophthalmologist), your doctor will write an electronic prescription (Ricetta Elettronica) for the public hospital network with subsidized ticket fees.'
      },
      night: {
        title: '🌙 Night or Weekend Sudden Illness (When Doctor Clinic is Closed)',
        dest: 'Call or visit the local Guardia Medica (Continuità Assistenziale)',
        action: 'Every Italian city has a free out-of-hours public doctor service (Guardia Medica) open every night from 20:00 to 08:00, and 24 hours on weekends/holidays. They provide free medical consultations and urgent prescriptions when your family doctor is unavailable.'
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
        action: 'Every Italian university offers confidential, 100% free psychological counseling (Servizio di Counseling Psicologico). You can also access SAMIFO (specialized refugee health centers in Rome/Milan) or 100% therapy refunds through Assolavoro.'
      }
    };

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-triage');
        const item = triageData[key];
        if (item && resultBox) {
          resultBox.innerHTML = `
            <div class="triage-result-card ${item.urgent ? 'urgent' : ''}">
              <div class="triage-res-title">${item.title}</div>
              <div class="triage-res-dest"><strong>Where to go:</strong> ${item.dest}</div>
              <div class="triage-res-action">${item.action}</div>
            </div>
          `;
          playSound('check');
        }
      });
    });
  }

  function setupItalianAudio() {
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

  function setupQuizzes() {
    document.querySelectorAll('.quiz-option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const container = btn.closest('.mini-quiz-box');
        if (!container) return;

        const isCorrect = btn.getAttribute('data-correct') === 'true';
        const feedbackEl = container.querySelector('.quiz-feedback');

        container.querySelectorAll('.quiz-option-btn').forEach((b) => {
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
            playSound('check');
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
      // fallback
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
