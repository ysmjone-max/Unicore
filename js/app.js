/* ==========================================================================
   UNICORE Scholar & Student Support Platform — Application Logic
   Accessible, Mobile-Optimized, Universal Search & Dark Mode
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Drawer & Dropdown Toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // Mobile Dropdown Submenus Toggle
    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 820) {
          e.preventDefault();
          const parentDropdown = trigger.closest('.nav-dropdown');
          if (parentDropdown) {
            parentDropdown.classList.toggle('mobile-open');
          }
        }
      });
    });

    // Close menu when clicking direct nav links or outside
    document.querySelectorAll('.nav-link:not(.dropdown-trigger), .dropdown-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
        navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
        navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  }

  // Active Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      
      // If inside dropdown, also highlight parent trigger
      const parentDropdown = link.closest('.nav-dropdown');
      if (parentDropdown) {
        const trigger = parentDropdown.querySelector('.nav-link');
        if (trigger) trigger.classList.add('active');
      }
    }
  });

  // Animated Stats Counters
  const counters = document.querySelectorAll('.counter-val');
  if (counters.length > 0) {
    const countUp = () => {
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText.replace('+', '').replace('%', '');
        const inc = Math.max(1, Math.ceil(target / 30));

        if (count < target) {
          const nextVal = count + inc > target ? target : count + inc;
          counter.innerText = nextVal + (counter.getAttribute('data-suffix') || '');
          setTimeout(countUp, 35);
        } else {
          counter.innerText = target + (counter.getAttribute('data-suffix') || '');
        }
      });
    };

    let animated = false;
    const statsContainer = document.querySelector('.stats-dashboard') || document.querySelector('.quick-stats-grid');
    
    if (statsContainer) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            countUp();
          }
        });
      }, { threshold: 0.15 });

      observer.observe(statsContainer);
    } else {
      countUp();
    }
  }

  // Interactive Arrival Checklist with LocalStorage (on living-in-italy.html)
  const checklistContainer = document.getElementById('arrivalChecklist');
  if (checklistContainer) {
    const items = checklistContainer.querySelectorAll('.checklist-item');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');

    const updateChecklist = () => {
      let checkedCount = 0;
      items.forEach(item => {
        const checkbox = item.querySelector('.checklist-checkbox');
        const docId = item.getAttribute('data-id');
        if (checkbox.checked) {
          item.classList.add('checked');
          checkedCount++;
          localStorage.setItem('unicore_' + docId, 'true');
        } else {
          item.classList.remove('checked');
          localStorage.removeItem('unicore_' + docId);
        }
      });

      const percent = Math.round((checkedCount / items.length) * 100);
      if (progressBar) progressBar.style.width = percent + '%';
      if (progressPercent) progressPercent.innerText = percent + '%';
    };

    // Load saved states from localStorage
    items.forEach(item => {
      const checkbox = item.querySelector('.checklist-checkbox');
      const docId = item.getAttribute('data-id');
      if (localStorage.getItem('unicore_' + docId) === 'true') {
        checkbox.checked = true;
        item.classList.add('checked');
      }

      item.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        updateChecklist();
      });
    });

    updateChecklist();
  }

  // FAQ Accordion Toggle & Filter (on faq.html)
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (questionBtn && answer) {
        questionBtn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          // Close other accordions for clean mobile focus
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
              const otherAnswer = otherItem.querySelector('.faq-answer');
              if (otherAnswer) otherAnswer.style.maxHeight = null;
            }
          });

          if (isActive) {
            item.classList.remove('active');
            answer.style.maxHeight = null;
          } else {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
          }
        });
      }
    });

    // FAQ Category Filter Tabs
    const faqTabs = document.querySelectorAll('.faq-tab-btn');
    const faqSearchInput = document.getElementById('faqSearch');

    function filterFAQs() {
      const activeTab = document.querySelector('.faq-tab-btn.active')?.getAttribute('data-category') || 'all';
      const searchQuery = (faqSearchInput ? faqSearchInput.value : '').toLowerCase().trim();

      faqItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const questionText = item.querySelector('.faq-question')?.textContent.toLowerCase() || '';
        const answerText = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';

        const matchesCategory = (activeTab === 'all' || category === activeTab);
        const matchesSearch = questionText.includes(searchQuery) || answerText.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
          item.classList.remove('active');
          const answer = item.querySelector('.faq-answer');
          if (answer) answer.style.maxHeight = null;
        }
      });
    }

    faqTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        faqTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        filterFAQs();
      });
    });

    if (faqSearchInput) {
      faqSearchInput.addEventListener('input', filterFAQs);
    }
  }

  // Important Links Filtering & Search (on important-links.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const linkCards = document.querySelectorAll('.link-card');
  const linkSearchInput = document.getElementById('linkSearch');

  if (linkCards.length > 0) {
    function filterLinks() {
      const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
      const searchQuery = (linkSearchInput ? linkSearchInput.value : '').toLowerCase().trim();

      linkCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        const titleText = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const descText = card.querySelector('p')?.textContent.toLowerCase() || '';
        const featuresText = card.querySelector('.link-features-list')?.textContent.toLowerCase() || '';

        const matchesCategory = (activeFilter === 'all' || cardCategory === activeFilter);
        const matchesSearch = titleText.includes(searchQuery) || descText.includes(searchQuery) || featuresText.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterLinks();
      });
    });

    if (linkSearchInput) {
      linkSearchInput.addEventListener('input', filterLinks);
    }
  }

  // Modulo 1 Form Tabs Switcher (on living-in-italy.html)
  const formTabBtns = document.querySelectorAll('.form-tab-btn');
  const formTabPanes = document.querySelectorAll('.form-tab-pane');

  if (formTabBtns.length > 0 && formTabPanes.length > 0) {
    formTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPage = btn.getAttribute('data-tab');
        
        formTabBtns.forEach(b => b.classList.remove('active'));
        formTabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePane = document.getElementById(targetPage);
        if (activePane) {
          activePane.classList.add('active');
        }
      });
    });
  }

  // Tractable Document Description Accordion (+ / - Toggle)
  const docAccordionHeaders = document.querySelectorAll('.doc-accordion-header');
  docAccordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.doc-accordion-item');
      const body = item?.querySelector('.doc-accordion-body');
      const toggleBtn = item?.querySelector('.doc-toggle-btn');

      if (item && body) {
        const isActive = item.classList.contains('active');

        if (isActive) {
          item.classList.remove('active');
          body.style.maxHeight = null;
          if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
        } else {
          item.classList.add('active');
          body.style.maxHeight = (body.scrollHeight + 100) + 'px';
          if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-minus"></i>';
        }
      }
    });
  });

  // Recompute accordion heights on window resize
  window.addEventListener('resize', () => {
    document.querySelectorAll('.doc-accordion-item.active .doc-accordion-body').forEach(body => {
      body.style.maxHeight = (body.scrollHeight + 100) + 'px';
    });
  });

  // Spoken Italian Copy-to-Clipboard & Category Filter
  const copyPhraseBtns = document.querySelectorAll('.copy-phrase-btn');
  copyPhraseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const phraseCard = btn.closest('.phrase-card');
      const textToCopy = phraseCard?.querySelector('.phrase-italian')?.textContent.trim();
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied');
          }, 1800);
        });
      }
    });
  });

  const phraseFilterBtns = document.querySelectorAll('.phrase-filter-btn');
  const phraseCards = document.querySelectorAll('.phrase-card');
  if (phraseFilterBtns.length > 0 && phraseCards.length > 0) {
    phraseFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-phrase-cat');
        phraseFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        phraseCards.forEach(card => {
          if (cat === 'all' || card.getAttribute('data-phrase-cat') === cat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Theme Switcher (Dark Mode / Light Mode)
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const currentTheme = localStorage.getItem('unicore_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggleBtns.forEach(btn => {
        btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        btn.setAttribute('aria-label', 'Switch to Light Mode');
      });
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggleBtns.forEach(btn => {
        btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        btn.setAttribute('aria-label', 'Switch to Dark Mode');
      });
    }
    localStorage.setItem('unicore_theme', theme);
  };

  applyTheme(currentTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(activeTheme);
    });
  });

  // Universal Global Search Modal (Ctrl + K / Cmd + K)
  const searchBackdrop = document.getElementById('globalSearchModal');
  const searchInput = document.getElementById('globalSearchInput');
  const searchResultsList = document.getElementById('globalSearchResults');
  const searchTriggerBtns = document.querySelectorAll('.search-trigger-btn');
  const searchCloseBtns = document.querySelectorAll('.search-modal-close-btn');

  // Comprehensive Search Index
  const searchIndex = [
    { title: "Living in Italy: Bureaucracy & Documents", url: "living-in-italy.html", tag: "Guide", desc: "Complete guide for Permesso di Soggiorno, Codice Fiscale, CIE, Tessera Sanitaria & essential Italian words.", icon: "fa-passport" },
    { title: "Financial Survival, Tax Rights & City Budgeting", url: "living-in-italy.html#documents", tag: "Finance", desc: "Legal tax exemptions under D.Lgs 68/2012, ISEE Parificato, Mensa food cards, and regional living costs.", icon: "fa-piggy-bank" },
    { title: "First 30 Days Financial Buffer & Bank Account Setup", url: "faq.html", tag: "Finance", desc: "Why a €150–€300 emergency cash reserve is needed during the 3–6 week Italian bank and tax code setup period.", icon: "fa-wallet" },
    { title: "Missing Transcripts & EQPR / CIMEA Degree Recognition", url: "faq.html", tag: "Academic Entry", desc: "Council of Europe European Qualifications Passport for Refugees (EQPR) and CIMEA statements without original papers.", icon: "fa-file-certificate" },
    { title: "Faculty Selection Interviews & 100-Point Scoring Rubric", url: "faq.html", tag: "Selection", desc: "How academic committees score subject mastery (40%), English (30%), motivation (15%), and adaptability (15%).", icon: "fa-chalkboard-user" },
    { title: "Consular Travel Documents: Laissez-Passer & Late Arrival", url: "faq.html", tag: "Visa & Travel", desc: "Emergency consular travel documents from Italian Embassies and university late-enrollment waivers.", icon: "fa-plane-circle-check" },
    { title: "Immigration Delays & Questura Backlog Protocols", url: "living-in-italy.html#documents", tag: "Troubleshooting", desc: "Handling 8–10 month Questura waits, Ricevuta Postale legal shield, PEC Sollecito, and late arrivals.", icon: "fa-hourglass-half" },
    { title: "CFU Deficits & Tutor Hardship Appeals (Istanza di Deroga)", url: "faq.html", tag: "Academics", desc: "Safeguarding scholarships and housing through tutor petitions, remedial study plans, and Student Ombudsman.", icon: "fa-hand-holding-heart" },
    { title: "Annual Health Card Renewal (Tessera Sanitaria on Dec 31)", url: "faq.html", tag: "Healthcare", desc: "Renewing Italian National Health Service (SSN) coverage each January at local ASL counters at zero cost.", icon: "fa-notes-medical" },
    { title: "Kit Giallo Step-by-Step Filling Guide", url: "living-in-italy.html#modulo1", tag: "Procedure", desc: "Detailed Modulo 1 box-by-box filling instructions for students, Code 11, postal payment & Marca da Bollo.", icon: "fa-envelope-open-text" },
    { title: "Official PDF Guide: Guida Permesso di Soggiorno", url: "docs/Guida_Permesso_di_Soggiorno.pdf", tag: "PDF Download", desc: "Annotated visual reference PDF for filling out the residence permit form for students.", icon: "fa-file-pdf" },
    { title: "Essential Italian Vocabulary & Office Phrases", url: "living-in-italy.html#phrases", tag: "Language", desc: "Practical Italian words and phrases with audio phonetics and 1-click copy for Poste, Questura, and ASL.", icon: "fa-language" },
    { title: "UNICORE Buddy Mentorship Program", url: "buddy-program.html", tag: "Mentorship", desc: "Peer-to-peer support network pairing incoming refugee scholars with senior student buddies across Italian cities.", icon: "fa-people-arrows" },
    { title: "UNHCR Community Matching (13 Italian Cities)", url: "buddy-program.html#community-matching", tag: "Community", desc: "1-on-1 mentorship scheme active in Rome, Milan, Bologna, Turin, Naples, Bari, Padua, and more.", icon: "fa-hands-holding-circle" },
    { title: "Community Outreach Volunteers (COV / VOC)", url: "buddy-program.html#community-matching", tag: "Leadership", desc: "Refugee community leaders network in Milan, Bologna, Rome, Naples, and Turin with PartecipAzione.", icon: "fa-bullhorn" },
    { title: "From Thesis to Career: 12-Month Job Search Permit", url: "how-it-works.html#career", tag: "Career", desc: "Converting study permit to Permesso Ricerca Lavoro (Art. 39-bis), CPI registration, and Ph.D. bandi.", icon: "fa-briefcase" },
    { title: "Welcome-in-One-Click Platform (UNHCR)", url: "important-links.html#career", tag: "Jobs", desc: "500+ certified Italian inclusive employers, 50,000+ activated pathways, and step-by-step profile creation.", icon: "fa-building-user" },
    { title: "Spazio Comune Municipal Integration Desks", url: "important-links.html#career", tag: "Municipal Hubs", desc: "One-stop physical desks in Bari, Bologna, Rome, Milan, Naples, Turin, and Brescia for legal & housing aid.", icon: "fa-landmark-dome" },
    { title: "JumaMap Multilingual Services & Helpline (800 905 570)", url: "important-links.html", tag: "Directory", desc: "Multilingual guidance on housing, health, education, and legal aid across all Italian regions.", icon: "fa-map-location-dot" },
    { title: "International Protection (Asylum) vs Study/Work Permit", url: "faq.html", tag: "Legal", desc: "Comparing Schengen travel freedoms for research/conferences versus asylum rights under D.Lgs 25/2008.", icon: "fa-scale-balanced" },
    { title: "Family Reunification Rules (Art. 29 T.U. Immigrazione)", url: "faq.html", tag: "Family", desc: "Legal requirements for sponsoring spouses and dependent children upon transitioning to employment.", icon: "fa-people-roof" },
    { title: "Erasmus+ European Exchanges & Travel Grants", url: "faq.html", tag: "Mobility", desc: "Participating in EU study exchanges and internships with refugee travel documents (Titolo di Viaggio).", icon: "fa-earth-europe" },
    { title: "Assolavoro Welfare Grants & Psychotherapy Refund", url: "important-links.html#career", tag: "Welfare", desc: "Financial aid for textbooks, tuition support, nursery allowances, and 100% psychotherapy refunds.", icon: "fa-hand-holding-dollar" },
    { title: "Psychotherapy, Mental Health & Campus Counseling", url: "important-links.html", tag: "Health", desc: "Free campus Sportello di Ascolto Psicologico, SAMIFO specialized psychiatric care, and Diaconia Valdese.", icon: "fa-brain" },
    { title: "Zero Tolerance: UNAR Anti-Discrimination (800 90 10 10)", url: "important-links.html", tag: "Safety", desc: "Reporting racism, campus ombudsperson (Consigliera di Fiducia / CUG), and UN PSEA reporting portal.", icon: "fa-shield-halved" },
    { title: "Anti-Trafficking & Exploitation Hotline (800 290 290)", url: "important-links.html", tag: "Helpline", desc: "24/7 Free, anonymous national helpline for labor exploitation, human trafficking, and protection.", icon: "fa-phone-volume" },
    { title: "Who Does What? Partner Responsibility Matrix", url: "about.html#responsibilities", tag: "Accountability", desc: "Clear division of roles for UNHCR, Universities, Caritas, Diaconia, Centro Astalli, and MAECI.", icon: "fa-list-check" },
    { title: "FAQ Guide (Pre-Arrival, Studies, Alumni)", url: "faq.html", tag: "FAQ", desc: "24 comprehensive questions regarding scholarships, GPA, work limits (20h/week), and visa steps.", icon: "fa-circle-question" },
    { title: "Stories & Official Digital Archive (2018–2026)", url: "stories-archive.html", tag: "Archive", desc: "14 spotlight graduate profiles (Apollo Pach, Bidong Ruot, Charles Waru), videos, and UNHCR press timeline.", icon: "fa-box-archive" },
    { title: "Stats & Impact: Milestones from Pilot to 6.0", url: "progress-stats.html", tag: "Stats", desc: "Data dashboard on 42 universities, 258 scholarships, 1,063 candidates, and PhD placements.", icon: "fa-chart-line" },
    { title: "What is UNICORE? (Mission & 15by30 Vision)", url: "about.html", tag: "About", desc: "The UNHCR 15by30 global target, 3 pillars of UNICORE, and institutional partner matrix.", icon: "fa-info-circle" }
  ];

  const openSearch = () => {
    if (searchBackdrop) {
      searchBackdrop.classList.add('open');
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        renderSearchResults('');
      }
      document.body.style.overflow = 'hidden';
    }
  };

  const closeSearch = () => {
    if (searchBackdrop) {
      searchBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  const renderSearchResults = (query) => {
    if (!searchResultsList) return;
    const cleanQuery = query.toLowerCase().trim();

    const filtered = cleanQuery === '' 
      ? searchIndex.slice(0, 6) 
      : searchIndex.filter(item => 
          item.title.toLowerCase().includes(cleanQuery) || 
          item.desc.toLowerCase().includes(cleanQuery) || 
          item.tag.toLowerCase().includes(cleanQuery)
        );

    if (filtered.length === 0) {
      searchResultsList.innerHTML = `
        <div class="search-empty-state">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 1.75rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
          <p>No results found for "<strong>${query}</strong>". Try searching for <em>Permesso, CFU, Astalli,</em> or <em>Buddy</em>.</p>
        </div>
      `;
      return;
    }

    searchResultsList.innerHTML = filtered.map((item, idx) => `
      <a href="${item.url}" class="search-result-item ${idx === 0 ? 'selected' : ''}">
        <div class="search-result-info">
          <div class="search-result-title">
            <i class="fa-solid ${item.icon}" style="color: var(--primary); font-size: 0.9rem;"></i>
            <span>${item.title}</span>
          </div>
          <div class="search-result-desc">${item.desc}</div>
        </div>
        <span class="search-result-tag">${item.tag}</span>
      </a>
    `).join('');

    // Attach click listeners to close search on navigate
    searchResultsList.querySelectorAll('.search-result-item').forEach(link => {
      link.addEventListener('click', closeSearch);
    });
  };

  searchTriggerBtns.forEach(btn => btn.addEventListener('click', openSearch));
  searchCloseBtns.forEach(btn => btn.addEventListener('click', closeSearch));

  if (searchBackdrop) {
    searchBackdrop.addEventListener('click', (e) => {
      if (e.target === searchBackdrop) closeSearch();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });

    searchInput.addEventListener('keydown', (e) => {
      const items = searchResultsList?.querySelectorAll('.search-result-item');
      if (!items || items.length === 0) return;

      let selectedIndex = Array.from(items).findIndex(el => el.classList.contains('selected'));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[selectedIndex]?.classList.remove('selected');
        selectedIndex = (selectedIndex + 1) % items.length;
        items[selectedIndex]?.classList.add('selected');
        items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[selectedIndex]?.classList.remove('selected');
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        items[selectedIndex]?.classList.add('selected');
        items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeLink = items[selectedIndex] || items[0];
        if (activeLink) {
          activeLink.click();
        }
      }
    });
  }

  // Keyboard shortcut Ctrl + K / Cmd + K & Escape
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchBackdrop?.classList.contains('open')) {
        closeSearch();
      } else {
        openSearch();
      }
    } else if (e.key === 'Escape' && searchBackdrop?.classList.contains('open')) {
      closeSearch();
    }
  });
});
