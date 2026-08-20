/* ==========================================================================
   UNICORE Scholar & Student Support Platform — Application Logic
   Accessible, Mobile-Optimized & Interactive
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Drawer & Dropdown Toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const dropdownTrigger = document.querySelector('.dropdown-trigger');
  const navDropdown = document.querySelector('.nav-dropdown');

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
      
      // If inside dropdown, also highlight parent
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
});
