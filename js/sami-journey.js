/**
 * UNICORE: Your First 30 Days — Interactive Survival Journey with Sami
 * State Management, Audio Pronunciation, Backpack Drawer, Progress Persistence
 */

document.addEventListener('DOMContentLoaded', () => {
  const TOTAL_CHAPTERS = 12;
  const STORAGE_KEY = 'unicore_sami_progress';
  const BACKPACK_KEY = 'unicore_sami_backpack';

  // Milestone Backpack Rewards
  const BACKPACK_ITEMS = [
    { id: 'docs', icon: 'fa-solid fa-folder-closed', name: 'Document Folder', desc: 'Certified degree copies & visa/laissez-passer' },
    { id: 'adapter', icon: 'fa-solid fa-plug', name: 'EU Power Adapter', desc: 'Type C/L plug adapter & warm clothing' },
    { id: 'boarding', icon: 'fa-solid fa-plane-arrival', name: 'Flight Pass', desc: 'Boarding pass & arrival confirmation' },
    { id: 'sim', icon: 'fa-solid fa-sim-card', name: 'Italian SIM Card', desc: 'Local mobile data & offline city map' },
    { id: 'cf', icon: 'fa-solid fa-id-card', name: 'Codice Fiscale', desc: 'Official Italian tax code certificate' },
    { id: 'badge', icon: 'fa-solid fa-id-badge', name: 'Student ID Badge', desc: 'Campus library, Wi-Fi & canteen card' },
    { id: 'bank', icon: 'fa-solid fa-credit-card', name: 'Bank Card (IBAN)', desc: 'Zero-fee student bank account for stipend' },
    { id: 'ssn', icon: 'fa-solid fa-heart-pulse', name: 'Tessera Sanitaria', desc: 'SSN health registration & family doctor' },
    { id: 'phrasebook', icon: 'fa-solid fa-book-open-reader', name: 'Italian Phrasebook', desc: '10 Essential daily survival phrases' },
    { id: 'transit', icon: 'fa-solid fa-bus-simple', name: 'Metro & Bus Pass', desc: 'Annual subsidized regional student transit pass' },
    { id: 'buddy', icon: 'fa-solid fa-handshake-angle', name: 'UNICORE Buddy Pin', desc: 'Lifelong peer network & Community Matching' },
    { id: 'laurea', icon: 'fa-solid fa-graduation-cap', name: 'Master Laurea (120 CFU)', desc: '12-Month Job Search Permit & PhD pathways' }
  ];

  let currentChapter = 0;
  let unlockedItems = new Set();

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

  // Load Saved Progress
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
        const arr = JSON.parse(savedBackpack);
        unlockedItems = new Set(arr);
      } else {
        for (let i = 0; i <= currentChapter; i++) {
          if (BACKPACK_ITEMS[i]) unlockedItems.add(BACKPACK_ITEMS[i].id);
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
      currentChapter = 0;
      unlockedItems = new Set([BACKPACK_ITEMS[0].id]);
    }
  }

  // Save Progress
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, currentChapter.toString());
      localStorage.setItem(BACKPACK_KEY, JSON.stringify(Array.from(unlockedItems)));
    } catch (e) {
      console.warn('Could not write to localStorage', e);
    }
  }

  // Render Current Chapter
  function renderChapter(index) {
    if (index < 0) index = 0;
    if (index >= TOTAL_CHAPTERS) index = TOTAL_CHAPTERS - 1;
    currentChapter = index;

    if (BACKPACK_ITEMS[currentChapter]) {
      unlockedItems.add(BACKPACK_ITEMS[currentChapter].id);
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
        nextBtn.innerHTML = '<i class="fa-solid fa-trophy"></i> Complete Journey';
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
          ${isUnlocked ? '<i class="fa-solid fa-check" style="color: #059669;"></i>' : '<i class="fa-solid fa-lock" style="color: #94a3b8;"></i>'}
        </div>
      `;

      backpackGridEl.appendChild(itemEl);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentChapter > 0) renderChapter(currentChapter - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentChapter < TOTAL_CHAPTERS - 1) {
        renderChapter(currentChapter + 1);
      } else {
        triggerConfetti();
        openBackpackModal();
      }
    });
  }

  scrubberPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const idx = parseInt(pill.getAttribute('data-chapter'), 10);
      if (!isNaN(idx)) renderChapter(idx);
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
      if (currentChapter < TOTAL_CHAPTERS - 1) renderChapter(currentChapter + 1);
    } else if (e.key === 'ArrowLeft') {
      if (currentChapter > 0) renderChapter(currentChapter - 1);
    }
  });

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

  function triggerConfetti() {
    try {
      const duration = 3000;
      const end = Date.now() + duration;
      const colors = ['#1d4ed8', '#38bdf8', '#059669', '#f59e0b', '#ec4899'];

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
      for (let i = 0; i < 90; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * -canvas.height,
          size: Math.random() * 8 + 4,
          speedY: Math.random() * 4 + 2,
          speedX: (Math.random() - 0.5) * 3,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.y += p.speedY;
          p.x += p.speedX;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
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
