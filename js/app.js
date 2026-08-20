/* ==========================================================================
   UNICORE Scholar & Student Support Platform — Application Logic
   Accessible, Mobile-Optimized & Fast
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

    // Mobile Dropdown Submenu Toggle
    if (dropdownTrigger && navDropdown) {
      dropdownTrigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 820) {
          e.preventDefault();
          navDropdown.classList.toggle('mobile-open');
        }
      });
    }

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

  // Support Directory Category Filter (on support-directory.html)
  const supportFilterBtns = document.querySelectorAll('.support-filter-btn');
  const supportCards = document.querySelectorAll('.support-card');

  if (supportFilterBtns.length > 0 && supportCards.length > 0) {
    supportFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        supportFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        supportCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filter === 'all' || cardCategory === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});
