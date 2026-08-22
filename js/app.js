/* ==========================================================================
   UNICORE Scholar & Student Support Platform — Application Logic
   Accessible, Direct Live Universal Search & Dark Mode
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
    }
  }

  // FAQ Accordion & Category Filter System (on faq.html)
  const faqItems = document.querySelectorAll('.faq-item');
  const faqTabs = document.querySelectorAll('.faq-tab-btn');
  const faqSearchInput = document.getElementById('faqSearch');

  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all other accordions for clean UX
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = (answer.scrollHeight + 40) + 'px';
        }
      });
    });

    // Category Filtering & In-Page Keyword Search
    function filterFAQs() {
      const activeCategory = document.querySelector('.faq-tab-btn.active')?.getAttribute('data-category') || 'all';
      const searchQuery = (faqSearchInput ? faqSearchInput.value : '').toLowerCase().trim();

      faqItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        const questionText = item.querySelector('.faq-question')?.textContent.toLowerCase() || '';
        const answerText = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';

        const matchesCategory = (activeCategory === 'all' || itemCategory === activeCategory);
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

  // =========================================================================
  // Direct Live General Search Engine (Searches the Entire Website)
  // =========================================================================
  const siteSearchInput = document.getElementById('siteSearchInput');
  const searchDropdown = document.getElementById('siteSearchResults');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  // Complete Indexed Website Corpus (90+ entries across all 9 pages)
  const searchCorpus = [
  {
    "title": "Welcome to Italy with Yohannes (First 30 Days Guide)",
    "url": "first-30-days.html",
    "tag": "Interactive Experience",
    "desc": "An animated survival journey with 12 chapters (Pre-Arrival to Day 30), interactive backpack milestones, and 10 spoken Italian phrases.",
    "icon": "fa-person-walking-luggage",
    "keywords": "welcome to italy with yohannes first 30 days your first 30 days in italy survival journey pre departure packing codice fiscale kit giallo health ssn bank account phrases"
  },
  {
    "title": "10 Italian Survival Phrases with Audio",
    "url": "first-30-days.html",
    "tag": "Survival Guide",
    "desc": "Essential Italian phrases for administration, healthcare, daily shopping, and transport with interactive audio pronunciation.",
    "icon": "fa-volume-high",
    "keywords": "10 italian survival phrases audio pronunciation buongiorno ho un appuntamento quanto costa permesso di soggiorno"
  },
  {
    "title": "UNICORE",
    "url": "index.html",
    "tag": "Home",
    "desc": "University Corridors for Refugees (UNICORE) provides recognized refugees with safe, regular, and fully supported pathways to pursue Master's degree programs across 40+ Italian inst",
    "icon": "fa-house",
    "keywords": "unicore university corridors for refugees (unicore) provides recognized refugees with safe, regular, and fully supported pathways to pursue master's degree programs across 40+ italian institutions."
  },
  {
    "title": "Welcoming Gaddisa (Uganda) & Sandra (Nigeria) to UNITUS",
    "url": "stories-archive.html",
    "tag": "Story Spotlight",
    "desc": "The UNICORE 7.0 corridor welcomed scholars to the International Master's Programme in Security & Human Rights at the DIKE Department, greeted by Prof. Daniela Vitiello, the UNITUS ",
    "icon": "fa-user-graduate",
    "keywords": "welcoming gaddisa (uganda) & sandra (nigeria) to unitus the unicore 7.0 corridor welcomed scholars to the international master's programme in security & human rights at the dike department, greeted by prof. daniela vitiello, the unitus rector, and unhcr italia."
  },
  {
    "title": "What is UNICORE?",
    "url": "about.html",
    "tag": "About",
    "desc": "University Corridors for Refugees (UNICORE) is an Italian multi-stakeholder partnership offering regular higher education pathways for refugee students living in asylum countries.",
    "icon": "fa-info-circle",
    "keywords": "what is unicore? university corridors for refugees (unicore) is an italian multi-stakeholder partnership offering regular higher education pathways for refugee students living in asylum countries."
  },
  {
    "title": "How UNICORE Works",
    "url": "how-it-works.html",
    "tag": "Roadmap",
    "desc": "A step-by-step roadmap from initial online selection to university arrival, Italian academic exam navigation, and post-graduation career launchpad.",
    "icon": "fa-route",
    "keywords": "how unicore works a step-by-step roadmap from initial online selection to university arrival, italian academic exam navigation, and post-graduation career launchpad."
  },
  {
    "title": "The CFU Credit System",
    "url": "how-it-works.html",
    "tag": "Survival Guide",
    "desc": "1 CFU equals 25 hours of total student workload (lectures + individual study). A full academic year consists of 60 CFU (120 CFU total for a 2-year Master's degree).",
    "icon": "fa-shield-halved",
    "keywords": "the cfu credit system 1 cfu equals 25 hours of total student workload (lectures + individual study). a full academic year consists of 60 cfu (120 cfu total for a 2-year master's degree)."
  },
  {
    "title": "Exam Grading (18–30 e Lode)",
    "url": "how-it-works.html",
    "tag": "Survival Guide",
    "desc": "Grades range from 0 to 30. The minimum passing mark is 18/30, and the maximum with honors is 30L (30 e Lode).",
    "icon": "fa-shield-halved",
    "keywords": "exam grading (18–30 e lode) grades range from 0 to 30. the minimum passing mark is 18/30, and the maximum with honors is 30l (30 e lode)."
  },
  {
    "title": "Oral Exams (Esame Orale)",
    "url": "how-it-works.html",
    "tag": "Survival Guide",
    "desc": "Unlike multiple-choice systems, most Italian university courses include an in-depth oral examination conducted directly with the professor.",
    "icon": "fa-shield-halved",
    "keywords": "oral exams (esame orale) unlike multiple-choice systems, most italian university courses include an in-depth oral examination conducted directly with the professor."
  },
  {
    "title": "12-Month Job Search Permit",
    "url": "how-it-works.html#career",
    "tag": "Survival Guide",
    "desc": "Under Italian immigration law, graduates of an Italian Master's degree can convert their study permit into a 12-Month Permesso per Ricerca Lavoro o Imprenditorialità.",
    "icon": "fa-shield-halved",
    "keywords": "12-month job search permit under italian immigration law, graduates of an italian master's degree can convert their study permit into a 12-month permesso per ricerca lavoro o imprenditorialità."
  },
  {
    "title": "Welcome-in-One-Click Gateway",
    "url": "how-it-works.html#career",
    "tag": "Survival Guide",
    "desc": "Official job gateway with 50,000+ activated pathways connecting refugee graduates with certified Italian companies, multinationals, and research organizations.",
    "icon": "fa-shield-halved",
    "keywords": "welcome-in-one-click gateway official job gateway with 50,000+ activated pathways connecting refugee graduates with certified italian companies, multinationals, and research organizations."
  },
  {
    "title": "Community Matching & Spazio Comune",
    "url": "how-it-works.html#career",
    "tag": "Survival Guide",
    "desc": "Pair with local professionals in 13 cities (Rome, Milan, Bologna, Turin, Naples, etc.) and access one-stop municipal integration desks in 7 major cities.",
    "icon": "fa-shield-halved",
    "keywords": "community matching & spazio comune pair with local professionals in 13 cities (rome, milan, bologna, turin, naples, etc.) and access one-stop municipal integration desks in 7 major cities."
  },
  {
    "title": "Assolavoro Welfare & Training",
    "url": "how-it-works.html#career",
    "tag": "Survival Guide",
    "desc": "Social aid allowances and educational support funded through employment agencies under the national Assolavoro & UNHCR agreement.",
    "icon": "fa-shield-halved",
    "keywords": "assolavoro welfare & training social aid allowances and educational support funded through employment agencies under the national assolavoro & unhcr agreement."
  },
  {
    "title": "Doctoral (Ph.D.) Research",
    "url": "how-it-works.html#career",
    "tag": "Survival Guide",
    "desc": "Graduates with an accredited Italian Laurea Magistrale can compete for fully funded 3-year Ph.D. scholarships (€1,200–€1,600/month net) across Italian and European universities.",
    "icon": "fa-shield-halved",
    "keywords": "doctoral (ph.d.) research graduates with an accredited italian laurea magistrale can compete for fully funded 3-year ph.d. scholarships (€1,200–€1,600/month net) across italian and european universities."
  },
  {
    "title": "Online Call & Document Submission",
    "url": "how-it-works.html",
    "tag": "Stage 1: Application",
    "desc": "Candidates apply through the official UNICORE platform for up to two Italian universities, submitting certified academic transcripts, refugee status documentation, CV, and motivati",
    "icon": "fa-route",
    "keywords": "online call & document submission candidates apply through the official unicore platform for up to two italian universities, submitting certified academic transcripts, refugee status documentation, cv, and motivational statements."
  },
  {
    "title": "Merit Evaluation & Online Faculty Interview",
    "url": "how-it-works.html",
    "tag": "Stage 2: Selection",
    "desc": "University academic committees evaluate candidate portfolios (0–40 points). Shortlisted applicants attend an online technical interview (0–40 points) assessing subject mastery and ",
    "icon": "fa-route",
    "keywords": "merit evaluation & online faculty interview university academic committees evaluate candidate portfolios (0–40 points). shortlisted applicants attend an online technical interview (0–40 points) assessing subject mastery and motivation."
  },
  {
    "title": "Visa Issuance & Safe International Travel",
    "url": "how-it-works.html",
    "tag": "Stage 3: Relocation",
    "desc": "Successful candidates receive comprehensive relocation support: MAECI study visa facilitation, UNHCR document coordination, pre-departure briefings, and flight sponsorship.",
    "icon": "fa-route",
    "keywords": "visa issuance & safe international travel successful candidates receive comprehensive relocation support: maeci study visa facilitation, unhcr document coordination, pre-departure briefings, and flight sponsorship."
  },
  {
    "title": "Arrival, Enrollment & Campus Integration",
    "url": "how-it-works.html",
    "tag": "Stage 4: Studies in Italy",
    "desc": "Students arrive in Italy in September/October, attend the national welcome event, and transition to their host universities with housing, monthly stipends, and peer buddy support.",
    "icon": "fa-route",
    "keywords": "arrival, enrollment & campus integration students arrive in italy in september/october, attend the national welcome event, and transition to their host universities with housing, monthly stipends, and peer buddy support."
  },
  {
    "title": "Graduation & Professional Career Pathways",
    "url": "how-it-works.html",
    "tag": "Stage 5: Career",
    "desc": "Upon completing their Master's degree, graduates can convert their study permit into a 12-month job search residence permit (Permesso Ricerca Lavoro) or pursue Ph.D. positions.",
    "icon": "fa-route",
    "keywords": "graduation & professional career pathways upon completing their master's degree, graduates can convert their study permit into a 12-month job search residence permit (permesso ricerca lavoro) or pursue ph.d. positions."
  },
  {
    "title": "Living in Italy: Bureaucracy, Kit Giallo & Settlement Hub",
    "url": "living-in-italy.html",
    "tag": "Guide",
    "desc": "Your complete operational handbook for Italian administration: the first 30-day settlement roadmap, interactive Kit Giallo form simulator, healthcare enrollment, bank accounts, and",
    "icon": "fa-passport",
    "keywords": "living in italy: bureaucracy, kit giallo & settlement hub your complete operational handbook for italian administration: the first 30-day settlement roadmap, interactive kit giallo form simulator, healthcare enrollment, bank accounts, and spoken italian phrasebook."
  },
  {
    "title": "Procure the Yellow Envelope (Kit Giallo) & €16 Marca da Bollo",
    "url": "living-in-italy.html#modulo1",
    "tag": "Procedure",
    "desc": "Go to any post office branch with an active Sportello Amico desk and ask the postal clerk: \"Vorrei un kit per il permesso di soggiorno, per favore.\" The envelope is 100% free of ch",
    "icon": "fa-shield-halved",
    "keywords": "procure the yellow envelope (kit giallo) & €16 marca da bollo go to any post office branch with an active sportello amico desk and ask the postal clerk: \"vorrei un kit per il permesso di soggiorno, per favore.\" the envelope is 100% free of charge. then, visit any tobacco shop (tabaccheria displaying the white \"t\" sign) and buy a €16.00 marca da bollo revenue stamp."
  },
  {
    "title": "Box-by-Box Guide: Completing Modulo 1 (Pages 1, 2 & 3)",
    "url": "living-in-italy.html#modulo1",
    "tag": "Procedure",
    "desc": "Only fill MODULO 1. (DO NOT touch Modulo 2 — it is strictly for employed workers and must be left entirely blank).",
    "icon": "fa-envelope-open-text",
    "keywords": "box-by-box guide: completing modulo 1 (pages 1, 2 & 3) only fill modulo 1. (do not touch modulo 2 — it is strictly for employed workers and must be left entirely blank)."
  },
  {
    "title": "Prepare the Required A4 Photocopies (Never Send Originals!)",
    "url": "living-in-italy.html#modulo1",
    "tag": "Survival Guide",
    "desc": "Insert ONLY clean A4 photocopies into the yellow envelope. Keep all original passports and certificates safely with you to present in person at the Questura.",
    "icon": "fa-shield-halved",
    "keywords": "prepare the required a4 photocopies (never send originals!) insert only clean a4 photocopies into the yellow envelope. keep all original passports and certificates safely with you to present in person at the questura."
  },
  {
    "title": "Pay the Postal Bulletin & Submit at Sportello Amico (Day 8 Deadline)",
    "url": "living-in-italy.html#modulo1",
    "tag": "Survival Guide",
    "desc": "Take the open yellow envelope to a Poste Italiane Sportello Amico counter within 8 business days of arriving in Italy.",
    "icon": "fa-shield-halved",
    "keywords": "pay the postal bulletin & submit at sportello amico (day 8 deadline) take the open yellow envelope to a poste italiane sportello amico counter within 8 business days of arriving in italy."
  },
  {
    "title": "What is it? (Che cos'è?)",
    "url": "living-in-italy.html#documents",
    "tag": "Survival Guide",
    "desc": "The official plastic electronic identity card granting non-EU citizens the legal right to reside in Italy. While your Type D Visa allowed you to enter Italy once, the Permesso di S",
    "icon": "fa-shield-halved",
    "keywords": "what is it? (che cos'è?) the official plastic electronic identity card granting non-eu citizens the legal right to reside in italy. while your type d visa allowed you to enter italy once, the permesso di soggiorno is what legally authorizes your stay for the full academic duration."
  },
  {
    "title": "Why is it important? (Perché è fondamentale?)",
    "url": "living-in-italy.html#documents",
    "tag": "Survival Guide",
    "desc": "Without it (or its postal receipt Ricevuta), you become irregular under Italian immigration law. It is required to maintain university matriculation, sign apartment leases, open ba",
    "icon": "fa-shield-halved",
    "keywords": "why is it important? (perché è fondamentale?) without it (or its postal receipt ricevuta), you become irregular under italian immigration law. it is required to maintain university matriculation, sign apartment leases, open bank accounts, access healthcare, and travel."
  },
  {
    "title": "What the Student MUST Know (Rules & Legal Rights)",
    "url": "living-in-italy.html#documents",
    "tag": "Survival Guide",
    "desc": "You must submit the postal kit (Kit Giallo) at a post office within 8 working days of stepping foot in Italy.",
    "icon": "fa-shield-halved",
    "keywords": "what the student must know (rules & legal rights) you must submit the postal kit (kit giallo) at a post office within 8 working days of stepping foot in italy."
  },
  {
    "title": "What the Student MUST Know (Key Rules)",
    "url": "living-in-italy.html#documents",
    "tag": "Survival Guide",
    "desc": "You receive a paper certificate (Certificato di Attribuzione) on the spot during your office visit.",
    "icon": "fa-shield-halved",
    "keywords": "what the student must know (key rules) you receive a paper certificate (certificato di attribuzione) on the spot during your office visit."
  },
  {
    "title": "What the Student MUST Know (Requirements & Usage)",
    "url": "living-in-italy.html#documents",
    "tag": "Survival Guide",
    "desc": "Requires prior registration of your civil residence (Iscrizione Anagrafica / Residenza) at the Comune.",
    "icon": "fa-shield-halved",
    "keywords": "what the student must know (requirements & usage) requires prior registration of your civil residence (iscrizione anagrafica / residenza) at the comune."
  },
  {
    "title": "What the Student MUST Know (Healthcare Rights)",
    "url": "living-in-italy.html#documents",
    "tag": "Survival Guide",
    "desc": "Beneficiaries of international protection under UNICORE receive free mandatory SSN registration (Iscrizione Obbligatoria Gratuita).",
    "icon": "fa-shield-halved",
    "keywords": "what the student must know (healthcare rights) beneficiaries of international protection under unicore receive free mandatory ssn registration (iscrizione obbligatoria gratuita)."
  },
  {
    "title": "What the Student MUST Know (Banking Rules)",
    "url": "living-in-italy.html#documents",
    "tag": "Survival Guide",
    "desc": "Under MEF Decree 70/2018 & ABI agreement, refugees and low-income students are legally entitled to open a fee-free basic bank account.",
    "icon": "fa-shield-halved",
    "keywords": "what the student must know (banking rules) under mef decree 70/2018 & abi agreement, refugees and low-income students are legally entitled to open a fee-free basic bank account."
  },
  {
    "title": "What the Student MUST Know (Digital Setup)",
    "url": "living-in-italy.html#documents",
    "tag": "Survival Guide",
    "desc": "The easiest free way is activating PosteID at your local post office counter with Italian ID/Passport and Codice Fiscale.",
    "icon": "fa-shield-halved",
    "keywords": "what the student must know (digital setup) the easiest free way is activating posteid at your local post office counter with italian id/passport and codice fiscale."
  },
  {
    "title": "What the Student MUST Know (Purchase & Sticking)",
    "url": "living-in-italy.html#documents",
    "tag": "Survival Guide",
    "desc": "Buy it in cash or card at any local shop displaying the white \"T\" sign (Tabaccheria).",
    "icon": "fa-shield-halved",
    "keywords": "what the student must know (purchase & sticking) buy it in cash or card at any local shop displaying the white \"t\" sign (tabaccheria)."
  },
  {
    "title": "What the Student MUST Know (Municipal Check)",
    "url": "living-in-italy.html#documents",
    "tag": "Survival Guide",
    "desc": "Within 45 days, municipal police (Vigili Urbani) will visit your address to verify you physically live there. Put your surname on the intercom!",
    "icon": "fa-shield-halved",
    "keywords": "what the student must know (municipal check) within 45 days, municipal police (vigili urbani) will visit your address to verify you physically live there. put your surname on the intercom!"
  },
  {
    "title": "Tax & Tuition Fee Exemptions (Esenzione Tasse)",
    "url": "living-in-italy.html#documents",
    "tag": "Survival Guide",
    "desc": "Under Italian Legislative Decree 68/2012 and regional DSU regulations, UNICORE scholarship holders are legally entitled to total exemption from university tuition fees and regional",
    "icon": "fa-shield-halved",
    "keywords": "tax & tuition fee exemptions (esenzione tasse) under italian legislative decree 68/2012 and regional dsu regulations, unicore scholarship holders are legally entitled to total exemption from university tuition fees and regional taxes (€156) via isee parificato calculation. scholarship stipends are non-taxable maintenance grants."
  },
  {
    "title": "Regional Cost-of-Living Tiers in Italy",
    "url": "living-in-italy.html#documents",
    "tag": "Survival Guide",
    "desc": "Living expenses vary significantly by region. Northern hubs (Milan/Turin/Bologna) require ~€750–€950/month; Central hubs (Rome/Florence/Siena) require ~€650–€800/month; Southern hu",
    "icon": "fa-shield-halved",
    "keywords": "regional cost-of-living tiers in italy living expenses vary significantly by region. northern hubs (milan/turin/bologna) require ~€750–€950/month; central hubs (rome/florence/siena) require ~€650–€800/month; southern hubs (naples/bari/palermo) average ~€450–€600/month."
  },
  {
    "title": "What the Student MUST Know (Budget & Welfare Relief)",
    "url": "living-in-italy.html#documents",
    "tag": "Survival Guide",
    "desc": "Request an ISEE Parificato per Studenti Stranieri at a tax assistance centre (CAF) upon arrival to secure zero university fees and maximum cafeteria discounts.",
    "icon": "fa-shield-halved",
    "keywords": "what the student must know (budget & welfare relief) request an isee parificato per studenti stranieri at a tax assistance centre (caf) upon arrival to secure zero university fees and maximum cafeteria discounts."
  },
  {
    "title": "Delayed Travel Documents & Mid-Semester Arrivals",
    "url": "living-in-italy.html#documents",
    "tag": "Survival Guide",
    "desc": "If delays in acquiring Travel Documents (CTD) or Visas cause you to arrive after academic lectures have begun, your academic standing is protected. Contact your Degree Program Dire",
    "icon": "fa-shield-halved",
    "keywords": "delayed travel documents & mid-semester arrivals if delays in acquiring travel documents (ctd) or visas cause you to arrive after academic lectures have begun, your academic standing is protected. contact your degree program director immediately to assign a departmental tutor and request lecture video recordings."
  },
  {
    "title": "Managing 8–10 Month Questura Delays",
    "url": "living-in-italy.html#documents",
    "tag": "Survival Guide",
    "desc": "In metropolitan areas (such as Veneto, Rome, or Milan), fingerprinting appointments may be scheduled 8–10 months out. Your postal receipt (Ricevuta Postale) guarantees 100% legal p",
    "icon": "fa-shield-halved",
    "keywords": "managing 8–10 month questura delays in metropolitan areas (such as veneto, rome, or milan), fingerprinting appointments may be scheduled 8–10 months out. your postal receipt (ricevuta postale) guarantees 100% legal protection, allowing you to study, work part-time, and renew healthcare without penalty."
  },
  {
    "title": "What the Student MUST Know (Emergency Actions)",
    "url": "living-in-italy.html#documents",
    "tag": "Survival Guide",
    "desc": "If you have an urgent graduation or academic deadline, the University International Desk can submit a formal certified email (PEC) requesting Questura to expedite your card.",
    "icon": "fa-shield-halved",
    "keywords": "what the student must know (emergency actions) if you have an urgent graduation or academic deadline, the university international desk can submit a formal certified email (pec) requesting questura to expedite your card."
  },
  {
    "title": "UNICORE Buddy Mentorship Program",
    "url": "buddy-program.html",
    "tag": "Mentorship",
    "desc": "Designed by senior scholars to guide incoming refugee students through every step of academic, bureaucratic, and cultural integration across Italian university cities.",
    "icon": "fa-people-arrows",
    "keywords": "unicore buddy mentorship program designed by senior scholars to guide incoming refugee students through every step of academic, bureaucratic, and cultural integration across italian university cities."
  },
  {
    "title": "Northern Italy Chapter",
    "url": "buddy-program.html",
    "tag": "Survival Guide",
    "desc": "Covering university cities in Lombardy, Emilia-Romagna, Piedmont, Veneto, Liguria, and Trentino.",
    "icon": "fa-shield-halved",
    "keywords": "northern italy chapter covering university cities in lombardy, emilia-romagna, piedmont, veneto, liguria, and trentino."
  },
  {
    "title": "Central Italy Chapter",
    "url": "buddy-program.html",
    "tag": "Survival Guide",
    "desc": "Covering university cities in Lazio, Tuscany, Umbria, Abruzzo, and Marche.",
    "icon": "fa-shield-halved",
    "keywords": "central italy chapter covering university cities in lazio, tuscany, umbria, abruzzo, and marche."
  },
  {
    "title": "Southern & Islands Chapter",
    "url": "buddy-program.html",
    "tag": "Survival Guide",
    "desc": "Covering university cities in Campania, Apulia, Sicily, Sardinia, and Calabria.",
    "icon": "fa-shield-halved",
    "keywords": "southern & islands chapter covering university cities in campania, apulia, sicily, sardinia, and calabria."
  },
  {
    "title": "UNHCR Community Matching",
    "url": "buddy-program.html#community-matching",
    "tag": "Survival Guide",
    "desc": "A structured 1-on-1 mentorship scheme connecting refugee scholars with local residents to practice fluent Italian, discover the city, and build genuine community ties.",
    "icon": "fa-shield-halved",
    "keywords": "unhcr community matching a structured 1-on-1 mentorship scheme connecting refugee scholars with local residents to practice fluent italian, discover the city, and build genuine community ties."
  },
  {
    "title": "Community Outreach Volunteers (COV)",
    "url": "buddy-program.html#community-matching",
    "tag": "Survival Guide",
    "desc": "A network of refugee community leaders across Italy collaborating with UNHCR and local municipalities to provide community guidance and protect rights.",
    "icon": "fa-shield-halved",
    "keywords": "community outreach volunteers (cov) a network of refugee community leaders across italy collaborating with unhcr and local municipalities to provide community guidance and protect rights."
  },
  {
    "title": "Direct Contact & Travel Preparation",
    "url": "buddy-program.html",
    "tag": "Phase 1: Pre-Arrival (Aug",
    "desc": "Before departure, incoming scholars are introduced to their assigned buddy via WhatsApp and email. The buddy answers questions about weather, clothing, university housing, and esse",
    "icon": "fa-route",
    "keywords": "direct contact & travel preparation before departure, incoming scholars are introduced to their assigned buddy via whatsapp and email. the buddy answers questions about weather, clothing, university housing, and essential luggage items."
  },
  {
    "title": "On-the-Ground Settlement & Bureaucracy",
    "url": "buddy-program.html",
    "tag": "Phase 2: First 30 Days (S",
    "desc": "Upon arrival, the buddy meets the student, assists with settling into dormitory accommodation, and accompanies them through key bureaucratic offices.",
    "icon": "fa-route",
    "keywords": "on-the-ground settlement & bureaucracy upon arrival, the buddy meets the student, assists with settling into dormitory accommodation, and accompanies them through key bureaucratic offices."
  },
  {
    "title": "Academic Excellence & Social Inclusion",
    "url": "buddy-program.html",
    "tag": "Phase 3: Academic Year (N",
    "desc": "Ongoing peer support during coursework and exam sessions. Buddies help navigate Italian exam formats, professor consultations, and social life.",
    "icon": "fa-route",
    "keywords": "academic excellence & social inclusion ongoing peer support during coursework and exam sessions. buddies help navigate italian exam formats, professor consultations, and social life."
  },
  {
    "title": "Progress & Statistics",
    "url": "progress-stats.html",
    "tag": "Stats",
    "desc": "Tracing the steady expansion of the University Corridors project from the 2019 founding pilot to a nationwide coalition of 40+ universities empowering 300+ refugee scholars.",
    "icon": "fa-chart-line",
    "keywords": "progress & statistics tracing the steady expansion of the university corridors project from the 2019 founding pilot to a nationwide coalition of 40+ universities empowering 300+ refugee scholars."
  },
  {
    "title": "Frequently Asked Questions (FAQ)",
    "url": "faq.html",
    "tag": "FAQ",
    "desc": "Key questions and answers organized by student lifecycle stages: pre-arrival applications, current studies in Italy, and post-graduation alumni pathways.",
    "icon": "fa-circle-question",
    "keywords": "frequently asked questions (faq) key questions and answers organized by student lifecycle stages: pre-arrival applications, current studies in italy, and post-graduation alumni pathways."
  },
  {
    "title": "Is there any application fee or cost to apply for UNICORE?",
    "url": "faq.html",
    "tag": "FAQ &bull; Pre-arrival",
    "desc": "No. The UNICORE application is 100% free of charge. No university, UNHCR office, or partner organization ever charges any fee for applying, taking faculty interviews, or receiving ",
    "icon": "fa-circle-question",
    "keywords": "is there any application fee or cost to apply for unicore? no. the unicore application is 100% free of charge. no university, unhcr office, or partner organization ever charges any fee for applying, taking faculty interviews, or receiving scholarship awards."
  },
  {
    "title": "Who is eligible to apply for the UNICORE scholarship?",
    "url": "faq.html",
    "tag": "FAQ &bull; Pre-arrival",
    "desc": "Applicants must be recognized refugees residing in one of the designated asylum countries (e.g. Ethiopia, Kenya, Uganda, Tanzania, Mozambique, Niger, Nigeria, Cameroon, Zambia, Zim",
    "icon": "fa-circle-question",
    "keywords": "who is eligible to apply for the unicore scholarship? applicants must be recognized refugees residing in one of the designated asylum countries (e.g. ethiopia, kenya, uganda, tanzania, mozambique, niger, nigeria, cameroon, zambia, zimbabwe, south africa, bangladesh, or india), hold a recognized bachelor's degree (minimum gpa comparable to italian 24/30 or 65%), and have obtained their degree in or after 2021."
  },
  {
    "title": "How many Italian universities can I apply to under UNICORE?",
    "url": "faq.html",
    "tag": "FAQ &bull; Pre-arrival",
    "desc": "Under official UNICORE guidelines, each candidate is allowed to apply to a maximum of two (2) Italian universities per edition cycle. If an applicant submits applications to more t",
    "icon": "fa-circle-question",
    "keywords": "how many italian universities can i apply to under unicore? under official unicore guidelines, each candidate is allowed to apply to a maximum of two (2) italian universities per edition cycle. if an applicant submits applications to more than two universities, all their applications may be disqualified."
  },
  {
    "title": "What if my original university degree certificates or transcripts were lost/destroyed during displacement?",
    "url": "faq.html",
    "tag": "FAQ &bull; Pre-arrival",
    "desc": "Recognizing that refugee students often cannot obtain original transcripts or a Declaration of Value (Dichiarazione di Valore) from embassies in their country of origin, all UNICOR",
    "icon": "fa-circle-question",
    "keywords": "what if my original university degree certificates or transcripts were lost/destroyed during displacement? recognizing that refugee students often cannot obtain original transcripts or a declaration of value (dichiarazione di valore) from embassies in their country of origin, all unicore universities accept alternative documentation: the european qualifications passport for refugees (eqpr) issued by the council of europe, and cimea statements of comparability and verification. these bodies conduct structured academic interviews with credential evaluators to legally reconstruct your bachelor's degree without requiring original paper seals or apostilles."
  },
  {
    "title": "How are the online faculty selection interviews scored, and what are professors evaluating?",
    "url": "faq.html",
    "tag": "FAQ &bull; Pre-arrival",
    "desc": "Academic evaluation committees score candidates on a 100-point scale:",
    "icon": "fa-circle-question",
    "keywords": "how are the online faculty selection interviews scored, and what are professors evaluating? academic evaluation committees score candidates on a 100-point scale:"
  },
  {
    "title": "What if I do not have an official IELTS or TOEFL English certificate?",
    "url": "faq.html",
    "tag": "FAQ &bull; Pre-arrival",
    "desc": "Most participating Italian universities accept an official letter from your undergraduate university confirming that English was the medium of instruction (EMI). In addition, your ",
    "icon": "fa-circle-question",
    "keywords": "what if i do not have an official ielts or toefl english certificate? most participating italian universities accept an official letter from your undergraduate university confirming that english was the medium of instruction (emi). in addition, your english proficiency will be directly evaluated during the technical faculty interview."
  },
  {
    "title": "What happens if my host country delays my Refugee Convention Travel Document (CTD) or visa?",
    "url": "faq.html",
    "tag": "FAQ &bull; Pre-arrival",
    "desc": "If the issuance of your Convention Travel Document is delayed by authorities in your country of first asylum, UNHCR, the Italian Ministry of Foreign Affairs (MAECI), and the Italia",
    "icon": "fa-circle-question",
    "keywords": "what happens if my host country delays my refugee convention travel document (ctd) or visa? if the issuance of your convention travel document is delayed by authorities in your country of first asylum, unhcr, the italian ministry of foreign affairs (maeci), and the italian embassy coordinate to issue an emergency consular laissez-passer (emergency travel document). participating universities automatically issue a formal late enrollment waiver (deroga per immatricolazione tardiva) allowing you to travel and start classes without forfeiting your scholarship."
  },
  {
    "title": "Why is an emergency pocket buffer of €150–€300 recommended before landing in Italy?",
    "url": "faq.html",
    "tag": "FAQ &bull; Pre-arrival",
    "desc": "Survey findings show that setting up the Italian Tax Code (Codice Fiscale), opening a personal Italian bank account (Conto Corrente), and university administrative accounting cycle",
    "icon": "fa-circle-question",
    "keywords": "why is an emergency pocket buffer of €150–€300 recommended before landing in italy? survey findings show that setting up the italian tax code (codice fiscale), opening a personal italian bank account (conto corrente), and university administrative accounting cycles take between 3 to 6 weeks before the first monthly stipend batch is disbursed. scholars are strongly encouraged to prepare a small emergency buffer (€150–€300) for initial groceries, transit tickets, and pharmacy essentials. university international desks also provide immediate university canteen (mensa) meal cards on day 1."
  },
  {
    "title": "If my Master's degree is 100% in English, why and where should I learn Italian?",
    "url": "faq.html",
    "tag": "FAQ &bull; Pre-arrival",
    "desc": "While all Master's lectures, coursework, and exams are delivered in English, basic Italian (A2/B1 level) is vital for daily life, doctor appointments, Questura fingerprinting, part",
    "icon": "fa-circle-question",
    "keywords": "if my master's degree is 100% in english, why and where should i learn italian? while all master's lectures, coursework, and exams are delivered in english, basic italian (a2/b1 level) is vital for daily life, doctor appointments, questura fingerprinting, part-time jobs (up to 20h/week), and post-graduation employment in italy. all unicore universities provide 100% free italian language courses through their university language center (cla) and municipal cpia adult education centers."
  },
  {
    "title": "How does the monthly living allowance and scholarship disbursement work?",
    "url": "faq.html",
    "tag": "FAQ &bull; Current",
    "desc": "Scholars receive an initial welcome pocket allowance upon arrival to cover immediate necessities, followed by monthly stipends (typically between €450 and €600 per month) directly ",
    "icon": "fa-circle-question",
    "keywords": "how does the monthly living allowance and scholarship disbursement work? scholars receive an initial welcome pocket allowance upon arrival to cover immediate necessities, followed by monthly stipends (typically between €450 and €600 per month) directly transferred into your italian bank or postal account (conto corrente). accommodation is either provided directly in university student dormitories or funded via housing allowances."
  },
  {
    "title": "Are UNICORE scholarships taxed, and am I exempt from university fees and regional taxes?",
    "url": "faq.html",
    "tag": "FAQ &bull; Current",
    "desc": "Yes, you are 100% legally exempt. Under Legislative Decree 68/2012 and regional DSU rules, UNICORE scholarship holders who calculate their ISEE Parificato are completely exempt fro",
    "icon": "fa-circle-question",
    "keywords": "are unicore scholarships taxed, and am i exempt from university fees and regional taxes? yes, you are 100% legally exempt. under legislative decree 68/2012 and regional dsu rules, unicore scholarship holders who calculate their isee parificato are completely exempt from all university tuition fees and regional education taxes (such as the €156/year regional fee). your monthly scholarship stipend is a maintenance grant and is strictly non-taxable under italian tax law."
  },
  {
    "title": "Why is the ISEE Parificato mandatory for €0 tuition and free/discounted canteen meals?",
    "url": "faq.html",
    "tag": "FAQ &bull; Current",
    "desc": "Because foreign refugee students cannot calculate a standard domestic Italian ISEE, Italian law provides the ISEE Parificato (Equalized Financial Status Indicator). You submit a se",
    "icon": "fa-circle-question",
    "keywords": "why is the isee parificato mandatory for €0 tuition and free/discounted canteen meals? because foreign refugee students cannot calculate a standard domestic italian isee, italian law provides the isee parificato (equalized financial status indicator). you submit a self-declaration of foreign income and assets at an authorized caf desk (centro assistenza fiscale). this formally certifies you in the lowest income bracket (fascia 0/1), unlocking free regional canteen meals, local transit discounts, and university fee waivers."
  },
  {
    "title": "What happens if I miss the annual CFU credit requirement (e.g. 30 CFU by August) due to illness or hardship?",
    "url": "faq.html",
    "tag": "FAQ &bull; Current",
    "desc": "Under updated UNICORE guidelines, students experiencing documented illness, psychological distress, or acute integration challenges are protected. Rather than facing immediate scho",
    "icon": "fa-circle-question",
    "keywords": "what happens if i miss the annual cfu credit requirement (e.g. 30 cfu by august) due to illness or hardship? under updated unicore guidelines, students experiencing documented illness, psychological distress, or acute integration challenges are protected. rather than facing immediate scholarship termination, you can submit a formal tutor hardship appeal (istanza di deroga) supported by your faculty tutor, international office, and the university student ombudsman (difensore degli studenti). the academic board can approve an extended autumn exam session or a tailored remedial study plan to safeguard your scholarship and housing."
  },
  {
    "title": "What if my Questura fingerprinting appointment is scheduled 8 to 10 months in the future?",
    "url": "faq.html",
    "tag": "FAQ &bull; Current",
    "desc": "You are 100% legally protected. Under Italian immigration directives, the official postal receipt (Ricevuta Postale / Cedolino) issued by Poste Italiane Sportello Amico carries ful",
    "icon": "fa-circle-question",
    "keywords": "what if my questura fingerprinting appointment is scheduled 8 to 10 months in the future? you are 100% legally protected. under italian immigration directives, the official postal receipt (ricevuta postale / cedolino) issued by poste italiane sportello amico carries full legal validity while waiting for your appointment. it allows you to study, travel within italy, work part-time up to 20 hours/week, and register with the national health service (ssn). if you have an urgent graduation or academic travel need, your university international office can send a formal certified email (pec sollecito) to the questura."
  },
  {
    "title": "How do I renew my National Health Card (SSN / Tessera Sanitaria) when it expires on December 31st?",
    "url": "faq.html",
    "tag": "FAQ &bull; Current",
    "desc": "Student health registrations expire at the end of each calendar year (December 31st). To renew:",
    "icon": "fa-circle-question",
    "keywords": "how do i renew my national health card (ssn / tessera sanitaria) when it expires on december 31st? student health registrations expire at the end of each calendar year (december 31st). to renew:"
  },
  {
    "title": "Where can I access free psychological support, trauma counseling, and mental health care in Italy?",
    "url": "faq.html",
    "tag": "FAQ &bull; Current",
    "desc": "You have multiple free options: (1) Your university offers a free, confidential Sportello di Ascolto Psicologico on campus; (2) Specialized refugee health centers like SAMIFO (ASL ",
    "icon": "fa-circle-question",
    "keywords": "where can i access free psychological support, trauma counseling, and mental health care in italy? you have multiple free options: (1) your university offers a free, confidential sportello di ascolto psicologico on campus; (2) specialized refugee health centers like samifo (asl roma 1) and diaconia valdese provide multilingual trauma-informed psychotherapy; (3) under the assolavoro & unhcr welfare agreement, eligible scholars and temporary agency workers can claim 100% reimbursement for certified psychotherapy sessions."
  },
  {
    "title": "Can I work part-time while studying under the UNICORE scholarship in Italy?",
    "url": "faq.html",
    "tag": "FAQ &bull; Current",
    "desc": "Yes. Italian law permits non-EU students holding a valid Permesso di Soggiorno Studio to engage in part-time employment for up to a maximum of 20 hours per week (or up to 1,040 hou",
    "icon": "fa-circle-question",
    "keywords": "can i work part-time while studying under the unicore scholarship in italy? yes. italian law permits non-eu students holding a valid permesso di soggiorno studio to engage in part-time employment for up to a maximum of 20 hours per week (or up to 1,040 hours per calendar year), provided work commitments do not interfere with maintaining your required master's academic credits."
  },
  {
    "title": "What happens to my housing accommodation when my 1st-year dormitory contract ends?",
    "url": "faq.html",
    "tag": "FAQ &bull; Current",
    "desc": "While Year 1 dormitory housing is typically covered, transitioning to Year 2 or private rentals requires advance planning. Students are supported through: (1) Applying for regional",
    "icon": "fa-circle-question",
    "keywords": "what happens to my housing accommodation when my 1st-year dormitory contract ends? while year 1 dormitory housing is typically covered, transitioning to year 2 or private rentals requires advance planning. students are supported through: (1) applying for regional dsu subsidized dormitory renewals based on academic merit; (2) local partner assistance from caritas, centro astalli, and diaconia valdese to find vetted shared apartments; (3) spazio comune housing desks in 7 major cities helping review rental contracts and prevent rental discrimination."
  },
  {
    "title": "Can UNICORE scholars participate in Erasmus+ European study exchanges or traineeships abroad?",
    "url": "faq.html",
    "tag": "FAQ &bull; Current",
    "desc": "Yes! UNICORE students are fully matriculated students with equal rights to apply for EU Erasmus+ Study and Erasmus+ Traineeship mobility scholarships. If selected, consult your uni",
    "icon": "fa-circle-question",
    "keywords": "can unicore scholars participate in erasmus+ european study exchanges or traineeships abroad? yes! unicore students are fully matriculated students with equal rights to apply for eu erasmus+ study and erasmus+ traineeship mobility scholarships. if selected, consult your university international relations office at least 3 months in advance to ensure your refugee travel document (titolo di viaggio) and host country visa requirements are fully validated for european travel."
  },
  {
    "title": "What should I do if I experience racism, discrimination, or harassment on campus or in dormitories?",
    "url": "faq.html",
    "tag": "FAQ &bull; Current",
    "desc": "UNICORE and all Italian universities uphold a strict Zero Tolerance Policy against racism, bullying, and discrimination. You can report incidents confidentially to: (1) Your univer",
    "icon": "fa-circle-question",
    "keywords": "what should i do if i experience racism, discrimination, or harassment on campus or in dormitories? unicore and all italian universities uphold a strict zero tolerance policy against racism, bullying, and discrimination. you can report incidents confidentially to: (1) your university's consigliera di fiducia or comitato unico di garanzia (cug); (2) the national anti-racial discrimination office (unar toll-free: 800 90 10 10); (3) for any humanitarian staff misconduct, via the official un/ngo psea reporting portal."
  },
  {
    "title": "How do I convert my student residence permit into a 12-Month Job Search Permit (Art. 39-bis.1)?",
    "url": "faq.html",
    "tag": "FAQ &bull; Alumni",
    "desc": "Upon defending your Master's thesis, Italian immigration law allows you to apply for the 12-month Job Search Residence Permit (Permesso di Soggiorno per Ricerca Lavoro o Imprendito",
    "icon": "fa-circle-question",
    "keywords": "how do i convert my student residence permit into a 12-month job search permit (art. 39-bis.1)? upon defending your master's thesis, italian immigration law allows you to apply for the 12-month job search residence permit (permesso di soggiorno per ricerca lavoro o imprenditorialità degli studenti - art. 39-bis.1 d.lgs 286/98). submit a kit giallo at poste italiane with your final graduation certificate (certificato di laurea con esami) and proof of health coverage. once you sign an employment contract, it converts immediately into a standard work permit (permesso per lavoro subordinato)."
  },
  {
    "title": "How do Welcome-in-One-Click, Community Matching, Spazio Comune & JumaMap assist graduates?",
    "url": "faq.html",
    "tag": "FAQ &bull; Alumni",
    "desc": "UNHCR coordinates four major post-graduation inclusion pillars:",
    "icon": "fa-circle-question",
    "keywords": "how do welcome-in-one-click, community matching, spazio comune & jumamap assist graduates? unhcr coordinates four major post-graduation inclusion pillars:"
  },
  {
    "title": "Can I apply for International Protection (Asylum) in Italy after arriving on a UNICORE student visa?",
    "url": "faq.html",
    "tag": "FAQ &bull; Alumni",
    "desc": "Yes. Under Italian and international law (D.Lgs 25/2008), every individual with a well-founded fear of persecution retains the inalienable constitutional right to apply for Interna",
    "icon": "fa-circle-question",
    "keywords": "can i apply for international protection (asylum) in italy after arriving on a unicore student visa? yes. under italian and international law (d.lgs 25/2008), every individual with a well-founded fear of persecution retains the inalienable constitutional right to apply for international protection (asilo politico / protezione sussidiaria) at the questura at any time. however, holding a study/work permit carries the advantage of allowing unrestricted international travel for research, european internships, and academic conferences without refugee travel limitations."
  },
  {
    "title": "Can I sponsor my spouse or dependent children to join me in Italy through Family Reunification?",
    "url": "faq.html",
    "tag": "FAQ &bull; Alumni",
    "desc": "Under Article 29 of the Italian Immigration Consolidated Act (T.U. Immigrazione), holders of a valid permit with at least 1-year validity can apply for Family Reunification (Ricong",
    "icon": "fa-circle-question",
    "keywords": "can i sponsor my spouse or dependent children to join me in italy through family reunification? under article 29 of the italian immigration consolidated act (t.u. immigrazione), holders of a valid permit with at least 1-year validity can apply for family reunification (ricongiungimento familiare) through the prefettura sportello unico per l'immigrazione. requirements include: (1) proof of minimum annual income (~€9,000+ per dependent); (2) housing suitability certificate (idoneità alloggiativa) issued by the local municipality. in practice, scholars fulfill these thresholds after completing their master's and transitioning into full-time employment."
  },
  {
    "title": "Can UNICORE graduates apply for Ph.D. / Doctoral research positions in Italy and Europe?",
    "url": "faq.html",
    "tag": "FAQ &bull; Alumni",
    "desc": "Yes. With an accredited Italian Laurea Magistrale (120 CFU / Second-Cycle Degree), UNICORE graduates meet all academic and legal criteria to compete for fully funded Ph.D. position",
    "icon": "fa-circle-question",
    "keywords": "can unicore graduates apply for ph.d. / doctoral research positions in italy and europe? yes. with an accredited italian laurea magistrale (120 cfu / second-cycle degree), unicore graduates meet all academic and legal criteria to compete for fully funded ph.d. positions, research fellowships, and doctoral schools across italian, european, and international universities. multiple unicore alumni have successfully transitioned into funded doctoral programs (e.g. at university of verona, unito, and unimi)."
  },
  {
    "title": "How can I join and stay connected with the UNICORE Alumni Network?",
    "url": "faq.html",
    "tag": "FAQ &bull; Alumni",
    "desc": "Graduates can join the active UNICORE Students Association on LinkedIn and professional networking channels to mentor incoming cohorts, share verified job openings, collaborate on ",
    "icon": "fa-circle-question",
    "keywords": "how can i join and stay connected with the unicore alumni network? graduates can join the active unicore students association on linkedin and professional networking channels to mentor incoming cohorts, share verified job openings, collaborate on research publications, and participate in national higher education advocacy roundtables."
  },
  {
    "title": "Student Stories, Research & Digital Archive (2018-2026)",
    "url": "stories-archive.html",
    "tag": "Stories",
    "desc": "A unified repository uniting authentic student testimonies, video documentaries, official UNHCR milestone press releases (2018–2026), doctoral research, and community leadership.",
    "icon": "fa-user-graduate",
    "keywords": "student stories, research & digital archive (2018-2026) a unified repository uniting authentic student testimonies, video documentaries, official unhcr milestone press releases (2018–2026), doctoral research, and community leadership."
  },
  {
    "title": "Charles Emmanuel Waru: Master's in Electronics Engineering (110/110)",
    "url": "stories-archive.html",
    "tag": "Story Spotlight",
    "desc": "One of the core missions of universities is to foster social mobility and create opportunities for talented individuals, regardless of their background. Charles Emmanuel Waru came ",
    "icon": "fa-user-graduate",
    "keywords": "charles emmanuel waru: master's in electronics engineering (110/110) one of the core missions of universities is to foster social mobility and create opportunities for talented individuals, regardless of their background. charles emmanuel waru came to politecnico di milano through unicore and has now graduated in electronics engineering with 110/110. his achievement is a powerful sign of what happens when talent, determination, and opportunity come together."
  },
  {
    "title": "Amanuel T. Yosief: 110 Cum Laude in Biotechnological & Chemical Sciences",
    "url": "stories-archive.html",
    "tag": "Story Spotlight",
    "desc": "Against all odds, Amanuel pursued his academic journey at the University of Turin and has now graduated with 110 cum laude in Biotechnological and Chemical Sciences in Diagnostics—",
    "icon": "fa-user-graduate",
    "keywords": "amanuel t. yosief: 110 cum laude in biotechnological & chemical sciences against all odds, amanuel pursued his academic journey at the university of turin and has now graduated with 110 cum laude in biotechnological and chemical sciences in diagnostics—the highest distinction. amanuel's journey reminds us that investing in refugee education is not charity; it is an investment in potential, excellence, and a shared future."
  },
  {
    "title": "Rehema Amisi: Passing the Torch to Annet & Moses in Cagliari",
    "url": "stories-archive.html",
    "tag": "Story Spotlight",
    "desc": "Last year, it was me being welcomed at the airport—nervous, hopeful, and ready to begin my journey with UNICORE. This year, it was my turn to stand on the other side and welcome th",
    "icon": "fa-user-graduate",
    "keywords": "rehema amisi: passing the torch to annet & moses in cagliari last year, it was me being welcomed at the airport—nervous, hopeful, and ready to begin my journey with unicore. this year, it was my turn to stand on the other side and welcome the next cohort of unicore students to cagliari: annet and moses. the unicore project is a bridge connecting potential with opportunity, and turning displacement into direction."
  },
  {
    "title": "Samuel Mesfin: From Eritrea to Master's Degree & Banking Career in Italy",
    "url": "stories-archive.html",
    "tag": "Story Spotlight",
    "desc": "In an interview with Fanpage.it, Samuel recounted his journey: from the initial difficulties of learning Italian to earning his degree and securing a permanent role in a bank. Fund",
    "icon": "fa-user-graduate",
    "keywords": "samuel mesfin: from eritrea to master's degree & banking career in italy in an interview with fanpage.it, samuel recounted his journey: from the initial difficulties of learning italian to earning his degree and securing a permanent role in a bank. fundamental to this journey was the support of fondazione permira, with dedicated 1-on-1 mentorship guiding his professional transition."
  },
  {
    "title": "UNICORE 7.0: 71 Refugee Scholars Welcomed Across 33 Universities",
    "url": "stories-archive.html",
    "tag": "Story Spotlight",
    "desc": "Today the new cohort of young refugee scholars arrived in Italy ready to begin their university journeys. UNICORE represents a concrete opportunity to reclaim dreams and grow in sa",
    "icon": "fa-user-graduate",
    "keywords": "unicore 7.0: 71 refugee scholars welcomed across 33 universities today the new cohort of young refugee scholars arrived in italy ready to begin their university journeys. unicore represents a concrete opportunity to reclaim dreams and grow in safety. realized with maeci, caritas italiana, diaconia valdese, centro astalli, permira foundation, fondazione finanza etica, campusx, and gandhi charity."
  },
  {
    "title": "PUPA Milano Welcomes UNICORE Scholars for Corporate Immersion",
    "url": "stories-archive.html",
    "tag": "Story Spotlight",
    "desc": "A special morning for UNICORE refugee students welcomed at PUPA Milano headquarters. They connected directly with industry leaders, gained insights into corporate operations, and o",
    "icon": "fa-user-graduate",
    "keywords": "pupa milano welcomes unicore scholars for corporate immersion a special morning for unicore refugee students welcomed at pupa milano headquarters. they connected directly with industry leaders, gained insights into corporate operations, and opened new professional horizons. thanks to pupa milano for supporting unhcr and the dafi tertiary education scholarship program."
  },
  {
    "title": "Fariha Sidiqi & Elizabeth Nyajang Kuon: Breaking Barriers Through Education",
    "url": "stories-archive.html",
    "tag": "Story Spotlight",
    "desc": "Fariha Sidiqi and Elizabeth Nyajang Kuon shared their journeys and highlighted the decisive role of higher education in rebuilding a safe future, far from violence. Sustaining educ",
    "icon": "fa-user-graduate",
    "keywords": "fariha sidiqi & elizabeth nyajang kuon: breaking barriers through education fariha sidiqi and elizabeth nyajang kuon shared their journeys and highlighted the decisive role of higher education in rebuilding a safe future, far from violence. sustaining education for refugee women creates opportunity and breaks down institutional barriers. recognized alongside general packing italy spa, an impresa speciale for over 10 years."
  },
  {
    "title": "Bereket Gebremichael: The First UNICORE Master's Graduate in Italy",
    "url": "stories-archive.html",
    "tag": "Story Spotlight",
    "desc": "Arrived in Italy in 2019 as part of the founding 6-student pilot corridor between Ethiopia and Italy, Bereket made history by becoming the very first UNICORE scholar to successfull",
    "icon": "fa-user-graduate",
    "keywords": "bereket gebremichael: the first unicore master's graduate in italy arrived in italy in 2019 as part of the founding 6-student pilot corridor between ethiopia and italy, bereket made history by becoming the very first unicore scholar to successfully defend his master's thesis and graduate from luiss guido carli university in rome, proving that regular academic corridors create pathways to safety, dignity, and excellence."
  },
  {
    "title": "Jules Bitwayiki Mende: Natural Resources Management at UniFI",
    "url": "stories-archive.html",
    "tag": "Story Spotlight",
    "desc": "When I was living in the refugee camp, books were my only window to the outside world. Arriving through UNICORE allowed me to complete my Master's in Natural Resources Management f",
    "icon": "fa-user-graduate",
    "keywords": "jules bitwayiki mende: natural resources management at unifi when i was living in the refugee camp, books were my only window to the outside world. arriving through unicore allowed me to complete my master's in natural resources management for tropical rural development at the university of florence. today, i dedicate my research to sustainable agriculture and rural development."
  },
  {
    "title": "Apollo Pach: First UNICORE Graduate at University of Verona & Ph.D. Researcher",
    "url": "stories-archive.html",
    "tag": "Story Spotlight",
    "desc": "Apollo arrived in Verona in 2023 and became the very first UNICORE graduate at the University of Verona. After defending his Master's thesis in Economics and Data Analysis, he imme",
    "icon": "fa-user-graduate",
    "keywords": "apollo pach: first unicore graduate at university of verona & ph.d. researcher apollo arrived in verona in 2023 and became the very first unicore graduate at the university of verona. after defending his master's thesis in economics and data analysis, he immediately won a competitive fully-funded scholarship for a ph.d. program in economics & finance at univr, conducting econometric research on financial inclusion."
  },
  {
    "title": "Bidong Paul Ruot: Development & International Cooperation Sciences at Sapienza",
    "url": "stories-archive.html",
    "tag": "Story Spotlight",
    "desc": "Bidong made history as the first UNICORE scholar to graduate from Sapienza University of Rome, completing his Master's in Development and International Cooperation Sciences with a ",
    "icon": "fa-user-graduate",
    "keywords": "bidong paul ruot: development & international cooperation sciences at sapienza bidong made history as the first unicore scholar to graduate from sapienza university of rome, completing his master's in development and international cooperation sciences with a thesis focused on digital agriculture and food security solutions in east africa."
  },
  {
    "title": "Cleodicee Juru: First Refugee Master's Graduate at Uni L'Orientale Naples",
    "url": "stories-archive.html",
    "tag": "Story Spotlight",
    "desc": "Cleodicee graduated with honors in International Relations from University of Naples L'Orientale, presenting an innovative thesis on international refugee protection frameworks and",
    "icon": "fa-user-graduate",
    "keywords": "cleodicee juru: first refugee master's graduate at uni l'orientale naples cleodicee graduated with honors in international relations from university of naples l'orientale, presenting an innovative thesis on international refugee protection frameworks and legal human rights pathways in the mediterranean."
  },
  {
    "title": "Gbreel Telbo: Medical Biology Research at University of Foggia",
    "url": "stories-archive.html",
    "tag": "Story Spotlight",
    "desc": "Three years after fleeing the conflict in Sudan, Gbreel is pursuing his dream of clinical research at the University of Foggia, working in medical laboratories to develop scientifi",
    "icon": "fa-user-graduate",
    "keywords": "gbreel telbo: medical biology research at university of foggia three years after fleeing the conflict in sudan, gbreel is pursuing his dream of clinical research at the university of foggia, working in medical laboratories to develop scientific diagnostics for conflict-affected populations."
  },
  {
    "title": "Important Links & Institutional Support Directory",
    "url": "important-links.html",
    "tag": "Directory",
    "desc": "Direct access to verified Italian partner organizations, free legal clinics, mental health psychotherapy, academic recognition portals, UNHCR employment networks, and 24/7 emergenc",
    "icon": "fa-link",
    "keywords": "important links & institutional support directory direct access to verified italian partner organizations, free legal clinics, mental health psychotherapy, academic recognition portals, unhcr employment networks, and 24/7 emergency hotlines."
  }
];

  if (siteSearchInput && searchDropdown) {
    const highlightMatch = (text, query) => {
      if (!query || !text) return text;
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    };

    const renderLiveSearch = (query) => {
      const q = query.toLowerCase().trim();
      
      if (!q) {
        searchDropdown.style.display = 'none';
        searchDropdown.innerHTML = '';
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        return;
      }

      if (clearSearchBtn) clearSearchBtn.style.display = 'block';

      // Split words for multi-term matching
      const words = q.split(/\s+/).filter(w => w.length > 0);

      const results = searchCorpus.filter(item => {
        const targetStr = (item.keywords || (item.title + ' ' + item.desc + ' ' + item.tag)).toLowerCase();
        return words.every(w => targetStr.includes(w));
      }).slice(0, 10);

      searchDropdown.style.display = 'block';

      if (results.length === 0) {
        searchDropdown.innerHTML = `
          <div class="search-dropdown-header">
            <span>0 Results Found</span>
          </div>
          <div class="search-empty-state">
            <i class="fa-solid fa-magnifying-glass"></i>
            <p>No matches found for "<strong>${query}</strong>".</p>
            <p style="font-size: 0.775rem; color: var(--slate-400); margin-top: 0.35rem;">
              Try searching for <em>visa, ISEE, housing, CFU, Charles, SIM,</em> or <em>bologna</em>.
            </p>
          </div>
        `;
        return;
      }

      searchDropdown.innerHTML = `
        <div class="search-dropdown-header">
          <span>${results.length} Result${results.length > 1 ? 's' : ''} Found Across Website</span>
          <span style="font-size: 0.7rem; color: var(--primary);">Press ESC to close</span>
        </div>
        <div class="search-dropdown-list">
          ${results.map((item, idx) => `
            <a href="${item.url}" class="search-dropdown-item ${idx === 0 ? 'active' : ''}">
              <div class="search-item-icon">
                <i class="fa-solid ${item.icon || 'fa-file-lines'}"></i>
              </div>
              <div class="search-item-content">
                <div class="search-item-top">
                  <div class="search-item-title">${highlightMatch(item.title, q)}</div>
                  <span class="search-item-tag">${item.tag}</span>
                </div>
                <div class="search-item-desc">${highlightMatch(item.desc, q)}</div>
              </div>
            </a>
          `).join('')}
        </div>
      `;

      // Click listener on search items
      searchDropdown.querySelectorAll('.search-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
          searchDropdown.style.display = 'none';
        });
      });
    };

    siteSearchInput.addEventListener('input', (e) => {
      renderLiveSearch(e.target.value);
    });

    siteSearchInput.addEventListener('focus', (e) => {
      if (e.target.value.trim()) {
        renderLiveSearch(e.target.value);
      }
    });

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        siteSearchInput.value = '';
        renderLiveSearch('');
        siteSearchInput.focus();
      });
    }

    // Keyboard Arrow Navigation
    siteSearchInput.addEventListener('keydown', (e) => {
      const items = searchDropdown.querySelectorAll('.search-dropdown-item');
      if (items.length === 0 || searchDropdown.style.display === 'none') return;

      let activeIndex = Array.from(items).findIndex(el => el.classList.contains('active'));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[activeIndex]?.classList.remove('active');
        activeIndex = (activeIndex + 1) % items.length;
        items[activeIndex]?.classList.add('active');
        items[activeIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[activeIndex]?.classList.remove('active');
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        items[activeIndex]?.classList.add('active');
        items[activeIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const target = items[activeIndex] || items[0];
        if (target) target.click();
      } else if (e.key === 'Escape') {
        searchDropdown.style.display = 'none';
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      const wrapper = document.getElementById('navSearchWrapper');
      if (wrapper && !wrapper.contains(e.target)) {
        searchDropdown.style.display = 'none';
      }
    });
  }

  // =========================================================================
  // Interactive Kit Giallo (Modulo 1) Practice Simulator Logic
  // =========================================================================
  const simStepBtns = document.querySelectorAll('.sim-step-btn');
  const simPages = [
    document.getElementById('simPage1'),
    document.getElementById('simPage2'),
    document.getElementById('simPage3')
  ];
  const simPrevBtn = document.getElementById('simPrevBtn');
  const simNextBtn = document.getElementById('simNextBtn');
  const simPageIndicator = document.getElementById('simPageIndicator');
  let currentSimPage = 1;

  function updateSimPage(page) {
    if (page < 1) page = 1;
    if (page > 3) page = 3;
    currentSimPage = page;

    simPages.forEach((p, idx) => {
      if (p) {
        p.style.display = (idx + 1 === currentSimPage) ? 'block' : 'none';
        p.classList.toggle('active', idx + 1 === currentSimPage);
      }
    });

    simStepBtns.forEach(btn => {
      const pNum = parseInt(btn.getAttribute('data-sim-page'), 10);
      btn.classList.toggle('active', pNum === currentSimPage);
    });

    if (simPageIndicator) simPageIndicator.textContent = `Page ${currentSimPage} of 3`;
    if (simPrevBtn) {
      simPrevBtn.disabled = currentSimPage === 1;
      simPrevBtn.style.opacity = currentSimPage === 1 ? '0.4' : '1';
    }
    if (simNextBtn) {
      simNextBtn.innerHTML = currentSimPage === 3 ? '<i class="fa-solid fa-check"></i> Finished' : 'Next Page <i class="fa-solid fa-arrow-right"></i>';
    }

    renderSimSummary();
  }

  function renderSimSummary() {
    const summaryContainer = document.getElementById('simGeneratedSummary');
    if (!summaryContainer) return;

    const prov = document.getElementById('simProvincia')?.value || 'SI';
    const comune = document.getElementById('simComune')?.value || 'SIENA';
    const cognome = document.getElementById('simCognome')?.value || 'MOLLA';
    const nome = document.getElementById('simNome')?.value || 'YOHANNES';
    const cf = document.getElementById('simCF')?.value || 'MLLYHN98A01Z330A';
    const pass = document.getElementById('simPassaporto')?.value || 'EP1234567';
    const valico = document.getElementById('simValico')?.value || 'AEROPORTO FIUMICINO ROMA';
    const addr = document.getElementById('simIndirizzo')?.value || 'VIA DEI MILLE 12';
    const cap = document.getElementById('simCAP')?.value || '53100';
    const tel = document.getElementById('simTelefono')?.value || '+39 345 1234567';

    summaryContainer.innerHTML = `
      <div class="sim-summary-grid">
        <div><strong>Questura:</strong> ${prov} (${comune})</div>
        <div><strong>Motivo:</strong> 11 (STUDIO) &bull; RILASCIO</div>
        <div><strong>Richiedente:</strong> ${cognome} ${nome}</div>
        <div><strong>Codice Fiscale:</strong> ${cf}</div>
        <div><strong>Passaporto:</strong> ${pass}</div>
        <div><strong>Frontiera d'Ingresso:</strong> ${valico}</div>
        <div><strong>Domicilio:</strong> ${addr}, ${cap} ${comune}</div>
        <div><strong>Telefono:</strong> ${tel}</div>
      </div>
    `;
  }

  simStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const p = parseInt(btn.getAttribute('data-sim-page'), 10);
      if (!isNaN(p)) updateSimPage(p);
    });
  });

  simPrevBtn?.addEventListener('click', () => {
    if (currentSimPage > 1) updateSimPage(currentSimPage - 1);
  });

  simNextBtn?.addEventListener('click', () => {
    if (currentSimPage < 3) updateSimPage(currentSimPage + 1);
  });

  // Uppercase auto-transform for Modulo 1 simulator inputs
  document.querySelectorAll('.uppercase-field').forEach(input => {
    input.addEventListener('input', () => {
      input.value = input.value.toUpperCase();
      renderSimSummary();
    });
  });

  // CF length validator
  const simCFInput = document.getElementById('simCF');
  const simCFValidation = document.getElementById('simCFValidation');
  simCFInput?.addEventListener('input', () => {
    if (simCFValidation) {
      if (simCFInput.value.length === 16) {
        simCFValidation.textContent = '✓ 16 Characters valid';
        simCFValidation.style.color = '#059669';
      } else {
        simCFValidation.textContent = `⚠ ${simCFInput.value.length}/16 Characters (Must be exactly 16)`;
        simCFValidation.style.color = '#e11d48';
      }
    }
  });

  // Copy simulator summary to clipboard
  document.getElementById('copySimSummaryBtn')?.addEventListener('click', () => {
    const prov = document.getElementById('simProvincia')?.value || 'SI';
    const comune = document.getElementById('simComune')?.value || 'SIENA';
    const cognome = document.getElementById('simCognome')?.value || 'MOLLA';
    const nome = document.getElementById('simNome')?.value || 'YOHANNES';
    const cf = document.getElementById('simCF')?.value || 'MLLYHN98A01Z330A';
    const pass = document.getElementById('simPassaporto')?.value || 'EP1234567';
    const addr = document.getElementById('simIndirizzo')?.value || 'VIA DEI MILLE 12';
    const cap = document.getElementById('simCAP')?.value || '53100';
    const tel = document.getElementById('simTelefono')?.value || '+39 345 1234567';

    const text = [
      '🇮🇹 UNICORE: MODULO 1 KIT GIALLO SUMMARY',
      '----------------------------------------',
      `• Questura / Comune: ${prov} - ${comune}`,
      `• Reason Code: 11 (STUDIO) - RILASCIO`,
      `• Name: ${cognome} ${nome}`,
      `• Codice Fiscale: ${cf}`,
      `• Passport: ${pass}`,
      `• Domicile: ${addr}, ${cap} ${comune}`,
      `• Mobile: ${tel}`,
      '----------------------------------------',
      'Remember: Write in BLACK INK & CAPITAL LETTERS. Sign ONLY at the Post Office counter.'
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('copySimSummaryBtn');
      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-check" style="color: #059669;"></i> Copied!';
        setTimeout(() => {
          btn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Summary to Clipboard';
        }, 2000);
      }
    });
  });

  if (document.getElementById('simPage1')) {
    updateSimPage(1);
  }
});
