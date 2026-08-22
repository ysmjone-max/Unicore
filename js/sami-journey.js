/**
 * LINEA UNICORE: Interactive Metro Map Controller (v5.0 Metro Transit Edition)
 * Metro Transit Track Animation, Station Switching, Sound Synthesis, Dynamic Budget Calculator, Healthcare Triage
 */

(function () {
  'use strict';

  const STORAGE_VISITED_KEY = 'unicore_metro_visited_stations';
  const STORAGE_CHECKS_KEY = 'unicore_metro_checked_tasks';
  const TOTAL_STATIONS = 12;

  let currentStation = 0;
  let visitedStations = new Set([0]); // Station 0 is visited by default
  let checkedTasks = new Set();

  // Metro Station Master Database
  const STATIONS = [
    {
      code: '0A',
      name: 'Stazione 0A: Partenza (Pre-Departure)',
      subtitle: 'PHASE 0 &bull; BEFORE LEAVING (T-MINUS 30 DAYS)',
      icon: '📋',
      avatar: '👋',
      speech: '<strong>Benvenuto aboard Linea UNICORE! I\'m Yohannes.</strong> When I was selected, I felt overjoyed—and also had a hundred questions: <em>"What should I pack? What paperwork do I need before boarding? Will I miss my home food?"</em> Let me share what I wish someone had told me before I boarded the flight. <strong>Let\'s get you ready for Italy! 🇮🇹</strong>',
      body: `
        <h4><i class="fa-solid fa-list-check" style="color: var(--primary);"></i> 1. Pre-Departure Action Checklist:</h4>
        <ul class="clean-interactive-checklist">
          <li>
            <label class="check-item-label">
              <input type="checkbox" class="journey-checkbox" data-task="task-0a-1">
              <span><strong>Certify Bachelor's Degree & Transcripts:</strong> Make 2 physical photocopies of your degree certificate, transcript, and EQPR/CIMEA certificates. Keep originals in your hand luggage.</span>
            </label>
          </li>
          <li>
            <label class="check-item-label">
              <input type="checkbox" class="journey-checkbox" data-task="task-0a-2">
              <span><strong>Keep Cash in Your Pocket (€50–€150):</strong> Have a small amount of cash in small €10/€20 notes. Many Italian train station ticket kiosks and buses do not accept foreign bank cards!</span>
            </label>
          </li>
          <li>
            <label class="check-item-label">
              <input type="checkbox" class="journey-checkbox" data-task="task-0a-3">
              <span><strong>Pack Tastes of Home:</strong> Bring a few sealed packets of your favorite dried home spices, traditional tea, or coffee. In your first few weeks, when homesickness hits, cooking familiar home food is pure comfort!</span>
            </label>
          </li>
        </ul>

        <div class="pro-tip-box">
          <div class="pro-tip-icon"><i class="fa-solid fa-lightbulb"></i></div>
          <div>
            <strong>Yohannes' Golden Rule: Keep ALL documents in your hand luggage!</strong>
            <p>Never pack original academic certificates, passports, or medical records in checked suitcases. Always keep them in your personal backpack with you on the airplane.</p>
          </div>
        </div>
      `
    },
    {
      code: '0B',
      name: 'Stazione 0B: Hub Bagagli & Mappe',
      subtitle: 'PHASE 0 &bull; BEFORE LEAVING (T-MINUS 14 DAYS)',
      icon: '🧳',
      avatar: '🗺️',
      speech: 'Italian autumn gets chilly in October (5°C–12°C in Milan, Turin, Bologna, Florence, Verona). But here is a secret: <strong>Google Maps is your #1 daily superpower in Italy!</strong> Before boarding, download the offline map of your university city.',
      body: `
        <h4><i class="fa-solid fa-mobile-screen-button" style="color: var(--primary);"></i> Why Google Maps is Vital in Italy:</h4>
        <div class="feature-pills-grid">
          <div class="feature-pill"><i class="fa-solid fa-bus"></i> <strong>Live Bus Timetables:</strong> Platform numbers and live delay alerts.</div>
          <div class="feature-pill"><i class="fa-solid fa-store"></i> <strong>Find Ticket Tabacchi:</strong> Bus tickets are sold at tobacco shops (*'T'* sign), not on the bus!</div>
          <div class="feature-pill"><i class="fa-solid fa-diamond-turn-right"></i> <strong>Cobblestone Shortcuts:</strong> Fast walking routes through medieval alleys.</div>
        </div>

        <h4 style="margin-top: 1.5rem;"><i class="fa-solid fa-plug" style="color: #059669;"></i> Electronics & Essentials Checklist:</h4>
        <ul class="clean-interactive-checklist">
          <li>
            <label class="check-item-label">
              <input type="checkbox" class="journey-checkbox" data-task="task-0b-1">
              <span><strong>European Type C/L Plug Adapters:</strong> Italian sockets use round 2 or 3 pins. Bring 2 universal adapters for your phone and laptop.</span>
            </label>
          </li>
          <li>
            <label class="check-item-label">
              <input type="checkbox" class="journey-checkbox" data-task="task-0b-2">
              <span><strong>Warm Windproof Jacket & Shoes:</strong> Comfortable shoes for walking on stone pavements and 1 warm jacket.</span>
            </label>
          </li>
          <li>
            <label class="check-item-label">
              <input type="checkbox" class="journey-checkbox" data-task="task-0b-3">
              <span><strong>30–60 Days Personal Medication:</strong> Keep personal medicines in original packaging with an English doctor's note.</span>
            </label>
          </li>
        </ul>
      `
    },
    {
      code: '1',
      name: 'Stazione 1: Aeroporto d\'Arrivo (Day 1)',
      subtitle: 'PHASE 1 &bull; SETTLEMENT (DAYS 1–2)',
      icon: '✈️',
      avatar: '😌',
      speech: '<em>"Okay... we\'re actually in Italy!"</em> You step out into Rome Fiumicino or Milan Malpensa. <strong>Follow the exact travel instructions given before departure to reach your university accommodation and meet your coordinator or buddy!</strong>',
      body: `
        <ul class="clean-interactive-checklist">
          <li>
            <label class="check-item-label">
              <input type="checkbox" class="journey-checkbox" data-task="task-1-1">
              <span><strong>Follow Transit Instructions to Accommodation:</strong> Take the pre-arranged airport train/shuttle to your university city.</span>
            </label>
          </li>
          <li>
            <label class="check-item-label">
              <input type="checkbox" class="journey-checkbox" data-task="task-1-2">
              <span><strong>Meet Your Coordinator & Peer Buddy:</strong> Let your university International Desk know you arrived safely and collect your dorm room keys.</span>
            </label>
          </li>
          <li>
            <label class="check-item-label">
              <input type="checkbox" class="journey-checkbox" data-task="task-1-3">
              <span><strong>Use Cash for Initial Travel:</strong> Use your pocket euros (€) to pay for local buses or train tickets if machines reject foreign cards.</span>
            </label>
          </li>
          <li>
            <label class="check-item-label">
              <input type="checkbox" class="journey-checkbox" data-task="task-1-4">
              <span><strong>Eat a Warm Meal & Sleep:</strong> Rest and recover from jet lag before jumping into administrative paperwork.</span>
            </label>
          </li>
        </ul>

        <div class="pro-tip-box">
          <div class="pro-tip-icon"><i class="fa-solid fa-bed"></i></div>
          <div>
            <strong>Do NOT rush to government offices on Day 1!</strong>
            <p>You have 8 working days to submit your residence permit kit. Sleep first, unpack, and get your bearings.</p>
          </div>
        </div>
      `
    },
    {
      code: '2',
      name: 'Stazione 2: Quartiere & Spesa (Days 2–3)',
      subtitle: 'PHASE 1 &bull; SETTLEMENT (DAYS 2–3)',
      icon: '🛒',
      avatar: '💡',
      speech: '<em>"Always search on Google and compare prices before you buy anything!"</em> In Italy, buying groceries at small tourist mini-markets costs twice as much as shopping at discount supermarkets like <strong>Lidl, Eurospin, Conad, or Coop</strong>.',
      body: `
        <h4><i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> Pin these 5 Essential Spots on Google Maps:</h4>
        <div class="five-places-grid">
          <div class="place-tile"><i class="fa-solid fa-bed"></i> <strong>1. Home / Dorm</strong><span>Where you sleep & cook</span></div>
          <div class="place-tile"><i class="fa-solid fa-building-columns"></i> <strong>2. Campus Hub</strong><span>Classes & study rooms</span></div>
          <div class="place-tile"><i class="fa-solid fa-cart-shopping"></i> <strong>3. Discount Supermarket</strong><span>Lidl, Eurospin, Conad</span></div>
          <div class="place-tile"><i class="fa-solid fa-prescription-bottle-medical"></i> <strong>4. Farmacia (Green Cross)</strong><span>Medicine & essentials</span></div>
          <div class="place-tile"><i class="fa-solid fa-bus-simple"></i> <strong>5. Bus / Metro Stop</strong><span>Daily commute point</span></div>
        </div>

        <h4 style="margin-top: 1.5rem;"><i class="fa-solid fa-sim-card" style="color: #059669;"></i> Get an Italian SIM Card (Day 2 or 3):</h4>
        <p style="font-size: 0.9rem; color: var(--slate-700); line-height: 1.6;">
          Visit an official store (Iliad, Fastweb, TIM, Vodafone, WindTre). For ~€8–€10/month, you get 100GB–150GB 5G mobile data. Bring your <strong>Passport</strong> and your <strong>Codice Fiscale</strong> (or temporary tax number).
        </p>
      `
    },
    {
      code: '3',
      name: 'Stazione 3: Snodo Burocrazia (Days 3–7)',
      subtitle: 'PHASE 1 &bull; BUREAUCRACY (DAYS 3–7)',
      icon: '📑',
      avatar: '🪪',
      speech: '<strong>The Golden Rule of Italian Administration: PRENOTAZIONI (Appointments)!</strong> Public offices in Italy—banks, Agenzia delle Entrate, Poste Italiane, Questura, and Anagrafe—require an advance online appointment. If you walk in without an appointment, you will be turned away. Always book in advance!',
      body: `
        <div class="document-flow-diagram">
          <div class="flow-step"><span>1. PASSPORT & VISA</span><small>Your legal entry ticket into Italy</small></div>
          <div class="flow-arrow"><i class="fa-solid fa-arrow-down"></i></div>
          <div class="flow-step highlight"><span>2. CODICE FISCALE</span><small>Tax code issued free at Agenzia delle Entrate (Day 3–5)</small></div>
          <div class="flow-arrow"><i class="fa-solid fa-arrow-down"></i></div>
          <div class="flow-step highlight"><span>3. KIT GIALLO (POSTE ITALIANE)</span><small>Residence permit application (Within 8 working days)</small></div>
          <div class="flow-arrow"><i class="fa-solid fa-arrow-down"></i></div>
          <div class="flow-step"><span>4. RICEVUTA POSTALE</span><small>Your 100% legal protection while waiting for Questura</small></div>
        </div>

        <div class="pro-tip-box" style="background: #eff6ff; border-color: #93c5fd;">
          <div class="pro-tip-icon" style="color: var(--primary);"><i class="fa-solid fa-shield-halved"></i></div>
          <div>
            <strong>The Ricevuta is your legal shield!</strong>
            <p>While waiting for your Questura fingerprinting appointment (which might take several months), your official postal receipt (<em>Ricevuta</em>) carries 100% legal validity to live, study, work up to 20h/week, and access public healthcare in Italy!</p>
          </div>
        </div>

        <div class="mini-quiz-box">
          <div class="quiz-header"><i class="fa-solid fa-brain"></i> Quick Knowledge Check:</div>
          <p class="quiz-question">Within how many working days of arriving in Italy must you submit your Kit Giallo for the Permesso di Soggiorno?</p>
          <div class="quiz-options">
            <button type="button" class="quiz-option-btn" data-correct="true" data-explanation="Under Art. 5 D.Lgs. 286/98, you have 8 working days from arrival.">Within 8 working days</button>
            <button type="button" class="quiz-option-btn" data-correct="false" data-explanation="30 days is too late! Submit within 8 working days.">Within 30 days</button>
          </div>
          <div class="quiz-feedback" style="display: none;"></div>
        </div>
      `
    },
    {
      code: '4',
      name: 'Stazione 4: Campus Universitario (Days 5–10)',
      subtitle: 'PHASE 1 &bull; CAMPUS LIFE (DAYS 5–10)',
      icon: '🏛️',
      avatar: '📧',
      speech: '<strong>Check your institutional university email (@studenti.uni...) every single morning!</strong> Everything in Italy—scholarship release notices, exam registration dates (*appelli*), professor cancellations, and Questura letters—arrives via email. Missing an email will cost you time, energy, and money!',
      body: `
        <div class="four-doors-grid">
          <div class="door-card">
            <div class="door-badge"><i class="fa-solid fa-globe"></i> Office 1</div>
            <h4>International Student Desk</h4>
            <p>Your primary home for UNICORE orientation, scholarship questions, late arrival waivers, and tutor pairing.</p>
          </div>
          <div class="door-card">
            <div class="door-badge"><i class="fa-solid fa-folder-tree"></i> Office 2</div>
            <h4>Segreteria Studenti (Registrar)</h4>
            <p>Handles official student card (Badge), enrollment certificates, exam booking portal (Esse3/Gomp), and CFU credits.</p>
          </div>
          <div class="door-card">
            <div class="door-badge"><i class="fa-solid fa-chalkboard-user"></i> Office 3</div>
            <h4>Programme Coordinator</h4>
            <p>Course curriculum, exam syllabus, laboratory placements, and Master's thesis supervisor assignment.</p>
          </div>
          <div class="door-card">
            <div class="door-badge"><i class="fa-solid fa-briefcase"></i> Office 4</div>
            <h4>Career & Placement Office</h4>
            <p>Curriculum workshops, curricular internships, company job fairs, and Erasmus+ exchange mobility bandi.</p>
          </div>
        </div>

        <div class="pro-tip-box" style="margin-top: 1.5rem;">
          <div class="pro-tip-icon"><i class="fa-solid fa-robot"></i></div>
          <div>
            <strong>Yohannes' AI Productivity Tip:</strong>
            <p>Use AI assistants (ChatGPT, Gemini, DeepL) to draft polite, formal Italian emails to professors (<em>"Gentile Professore/Professoressa..."</em>) or summarize dense Italian PDF documents. <strong>Always fact-check and proofread</strong> before sending!</p>
          </div>
        </div>
      `
    },
    {
      code: '5',
      name: 'Stazione 5: Banca & Borsa di Studio (Days 8–14)',
      subtitle: 'PHASE 2 &bull; FINANCIAL MASTERY (DAYS 8–14)',
      icon: '💶',
      avatar: '💡',
      speech: '<strong>How Italian scholarships actually work:</strong> The first installment takes 3–6 weeks to arrive after opening your Italian bank account. But here is the most critical fact: <strong>subsequent installments require passing exams and earning CFU credits!</strong> If you don\'t earn enough credits by university deadlines, scholarship payments are paused or canceled!',
      body: `
        <div class="pro-tip-box" style="background: #f0fdf4; border-color: #86efac;">
          <div class="pro-tip-icon" style="color: #059669;"><i class="fa-solid fa-piggy-bank"></i></div>
          <div>
            <strong>Why Saving Money Matters for Your Future:</strong>
            <p>Being frugal and saving every month builds a vital fund for <strong>Erasmus+ study exchange semesters in other European countries</strong> and covers your transition period after graduation when converting to the <strong>12-Month Job Search Permit (*Art. 39-bis.1*)</strong>.</p>
          </div>
        </div>

        <div class="interactive-budget-box" style="margin-top: 1.5rem;">
          <div class="budget-box-header">
            <h4><i class="fa-solid fa-calculator" style="color: var(--primary);"></i> Scholar Dynamic Budget Calculator</h4>
            <span class="budget-help-tag">Customizable Stipend & Range Calculation</span>
          </div>
          
          <p style="font-size: 0.85rem; color: var(--slate-600); margin-bottom: 1.25rem;">
            Stipends vary by university and regional agencies (EDISU, LazioDisco, ER.GO). <strong>Type your exact monthly amount or pick a range below:</strong>
          </p>
          
          <div class="stipend-input-container">
            <div class="stipend-custom-input-row">
              <label for="budgetStipendInput"><strong>Your Monthly Stipend / Income:</strong></label>
              <div class="stipend-currency-wrap">
                <span class="currency-symbol">€</span>
                <input type="number" id="budgetStipendInput" min="0" max="3000" step="10" value="500" class="budget-num-field" aria-label="Monthly stipend amount">
                <span class="currency-period">/ month</span>
              </div>
            </div>

            <div class="stipend-preset-pills">
              <button type="button" class="preset-pill" data-amount="350">€350 (Partial)</button>
              <button type="button" class="preset-pill active" data-amount="500">€500 (Standard)</button>
              <button type="button" class="preset-pill" data-amount="650">€650 (Regional DSU)</button>
              <button type="button" class="preset-pill" data-amount="850">€850 (Full Package)</button>
            </div>
            
            <input type="range" id="budgetStipendSlider" min="100" max="1500" value="500" step="25" class="range-slider" aria-label="Stipend range slider">
          </div>

          <div class="budget-expense-category-title">
            <i class="fa-solid fa-cart-flatbed"></i> Monthly Planned Living Expenses
          </div>

          <div class="budget-slider-row">
            <label><span><i class="fa-solid fa-house-user"></i> Housing / Extra Utilities:</span><strong id="rentVal">€150</strong></label>
            <input type="range" id="budgetRent" min="0" max="500" value="150" step="10" class="range-slider">
          </div>

          <div class="budget-slider-row">
            <label><span><i class="fa-solid fa-utensils"></i> Groceries & Campus Canteen (*Mensa*):</span><strong id="foodVal">€180</strong></label>
            <input type="range" id="budgetFood" min="50" max="400" value="180" step="10" class="range-slider">
          </div>

          <div class="budget-slider-row">
            <label><span><i class="fa-solid fa-wifi"></i> Mobile SIM, Internet & Study Materials:</span><strong id="phoneVal">€30</strong></label>
            <input type="range" id="budgetPhone" min="5" max="100" value="30" step="5" class="range-slider">
          </div>

          <div class="budget-slider-row">
            <label><span><i class="fa-solid fa-bus-simple"></i> Local Bus / Metro Student Transit Pass:</span><strong id="transitVal">€25</strong></label>
            <input type="range" id="budgetTransit" min="0" max="80" value="25" step="5" class="range-slider">
          </div>

          <div class="budget-slider-row">
            <label><span><i class="fa-solid fa-mug-hot"></i> Coffee, Personal Care & Emergency Buffer:</span><strong id="otherVal">€45</strong></label>
            <input type="range" id="budgetOther" min="10" max="200" value="45" step="5" class="range-slider">
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
            <button type="button" class="btn btn-outline btn-sm" id="copyBudgetBtn" style="font-size: 0.8rem; font-weight: 700;">
              <i class="fa-solid fa-copy"></i> Copy Budget Plan to Clipboard
            </button>
          </div>

          <div class="budget-calculation-results-panel">
            <div class="budget-metric-card">
              <span class="metric-label">Total Monthly Expenses</span>
              <strong class="metric-val text-expense" id="budgetTotalDisplay">€430</strong>
            </div>
            <div class="budget-metric-card">
              <span class="metric-label">Net Monthly Balance</span>
              <strong class="metric-val text-surplus" id="budgetNetBalanceDisplay">+€70</strong>
            </div>
            <div class="budget-metric-card">
              <span class="metric-label">10-Month Year Projection</span>
              <strong class="metric-val text-surplus" id="budgetAnnualSavingsDisplay">+€700 Saved</strong>
            </div>
          </div>

          <div id="budgetBalanceStatus" style="margin-top: 1rem;"></div>
        </div>
      `
    },
    {
      code: '6',
      name: 'Stazione 6: Servizio Sanitario SSN (Days 10–15)',
      subtitle: 'PHASE 2 &bull; HEALTHCARE (DAYS 10–15)',
      icon: '🩺',
      avatar: '🩺',
      speech: '<strong>The Italian Healthcare System (SSN) is universal, but you must know how it works:</strong> For regular non-emergency illnesses, contact your <strong>Family Doctor (Medico di Base)</strong>. For life-threatening emergencies, go to the <strong>Emergency Room (Pronto Soccorso)</strong> or call 112.',
      body: `
        <div class="interactive-triage-tool">
          <h4><i class="fa-solid fa-stethoscope" style="color: var(--primary);"></i> Interactive Healthcare Navigator:</h4>
          <p style="font-size: 0.825rem; color: var(--slate-600); margin-bottom: 0.75rem;">Click your medical situation to see the correct procedure:</p>
          
          <div class="triage-buttons-grid">
            <button type="button" class="triage-select-btn active" data-triage="cold"><i class="fa-solid fa-head-side-cough"></i> Non-Emergency (Cold/Cough)</button>
            <button type="button" class="triage-select-btn" data-triage="fever"><i class="fa-solid fa-temperature-arrow-up"></i> Specialist Visit Needed</button>
            <button type="button" class="triage-select-btn" data-triage="night"><i class="fa-solid fa-moon"></i> Night/Weekend Illness</button>
            <button type="button" class="triage-select-btn" data-triage="emergency"><i class="fa-solid fa-truck-medical"></i> Severe Emergency (112)</button>
            <button type="button" class="triage-select-btn" data-triage="mental"><i class="fa-solid fa-head-side-heart"></i> Stress / Mental Wellness</button>
          </div>

          <div id="triageResultBox" style="margin-top: 1rem;">
            <div class="triage-result-card">
              <div class="triage-res-title">💊 Non-Emergency: Cold, Cough, Muscle Pain, or Minor Ailment</div>
              <div class="triage-res-dest"><strong>Where to go:</strong> Walk into your local Farmacia (Green Cross) or contact your Medico di Base</div>
              <div class="triage-res-action">Pharmacists in Italy are trained healthcare professionals and can recommend over-the-counter medicine. For sick leave certificates or prescription medicine, message or call your assigned Medico di Base (Family Doctor). Consultations and prescriptions are 100% free.</div>
            </div>
          </div>
        </div>

        <div class="pro-tip-box" style="margin-top: 1.5rem;">
          <div class="pro-tip-icon"><i class="fa-solid fa-calendar-xmark"></i></div>
          <div>
            <strong>Important Health Card Rule:</strong>
            <p>Italian student health registrations (*Tessera Sanitaria*) expire on <strong>December 31st</strong> every year. Visit your local ASL health desk in January with your enrollment certificate to renew it for free!</p>
          </div>
        </div>
      `
    },
    {
      code: '7',
      name: 'Stazione 7: Corso Italiano (Days 12–20)',
      subtitle: 'PHASE 2 &bull; LANGUAGE (DAYS 12–20)',
      icon: '🗣️',
      avatar: '🇮🇹',
      speech: 'Even if your Master\'s is 100% in English, greeting Italians with <em>"Buongiorno"</em> or <em>"Grazie mille"</em> makes people smile and opens doors at government desks. <strong>Click the speaker icons to hear each phrase spoken:</strong>',
      body: `
        <div class="phrases-interactive-list">
          <div class="phrase-audio-card">
            <div class="phrase-main">
              <span class="phrase-category-tag">Administration</span>
              <strong class="phrase-it">"Buongiorno, ho un appuntamento."</strong>
              <span class="phrase-en">Good morning, I have an appointment.</span>
            </div>
            <button type="button" class="phrase-audio-btn" data-phrase="Buongiorno, ho un appuntamento" aria-label="Listen">
              <i class="fa-solid fa-volume-high"></i> Listen
            </button>
          </div>

          <div class="phrase-audio-card">
            <div class="phrase-main">
              <span class="phrase-category-tag">Asking Help</span>
              <strong class="phrase-it">"Potrebbe aiutarmi a compilare questo modulo?"</strong>
              <span class="phrase-en">Could you help me fill out this form?</span>
            </div>
            <button type="button" class="phrase-audio-btn" data-phrase="Potrebbe aiutarmi a compilare questo modulo?" aria-label="Listen">
              <i class="fa-solid fa-volume-high"></i> Listen
            </button>
          </div>

          <div class="phrase-audio-card">
            <div class="phrase-main">
              <span class="phrase-category-tag">When Lost</span>
              <strong class="phrase-it">"Non ho capito. Può ripetere più lentamente?"</strong>
              <span class="phrase-en">I didn't understand. Could you repeat more slowly?</span>
            </div>
            <button type="button" class="phrase-audio-btn" data-phrase="Non ho capito. Può ripetere più lentamente?" aria-label="Listen">
              <i class="fa-solid fa-volume-high"></i> Listen
            </button>
          </div>

          <div class="phrase-audio-card">
            <div class="phrase-main">
              <span class="phrase-category-tag">Language Switch</span>
              <strong class="phrase-it">"Possiamo parlare in inglese?"</strong>
              <span class="phrase-en">Can we speak in English?</span>
            </div>
            <button type="button" class="phrase-audio-btn" data-phrase="Possiamo parlare in inglese?" aria-label="Listen">
              <i class="fa-solid fa-volume-high"></i> Listen
            </button>
          </div>

          <div class="phrase-audio-card">
            <div class="phrase-main">
              <span class="phrase-category-tag">Shopping</span>
              <strong class="phrase-it">"Quanto costa questo?"</strong>
              <span class="phrase-en">How much does this cost?</span>
            </div>
            <button type="button" class="phrase-audio-btn" data-phrase="Quanto costa questo?" aria-label="Listen">
              <i class="fa-solid fa-volume-high"></i> Listen
            </button>
          </div>

          <div class="phrase-audio-card">
            <div class="phrase-main">
              <span class="phrase-category-tag">Transport</span>
              <strong class="phrase-it">"Dove posso comprare il biglietto dell'autobus?"</strong>
              <span class="phrase-en">Where can I buy a bus ticket?</span>
            </div>
            <button type="button" class="phrase-audio-btn" data-phrase="Dove posso comprare il biglietto dell'autobus?" aria-label="Listen">
              <i class="fa-solid fa-volume-high"></i> Listen
            </button>
          </div>

          <div class="phrase-audio-card">
            <div class="phrase-main">
              <span class="phrase-category-tag">Health</span>
              <strong class="phrase-it">"Ho bisogno di vedere un medico."</strong>
              <span class="phrase-en">I need to see a doctor.</span>
            </div>
            <button type="button" class="phrase-audio-btn" data-phrase="Ho bisogno di vedere un medico." aria-label="Listen">
              <i class="fa-solid fa-volume-high"></i> Listen
            </button>
          </div>

          <div class="phrase-audio-card">
            <div class="phrase-main">
              <span class="phrase-category-tag">Politeness</span>
              <strong class="phrase-it">"Grazie mille e buona giornata!"</strong>
              <span class="phrase-en">Thank you very much and have a nice day!</span>
            </div>
            <button type="button" class="phrase-audio-btn" data-phrase="Grazie mille e buona giornata!" aria-label="Listen">
              <i class="fa-solid fa-volume-high"></i> Listen
            </button>
          </div>
        </div>
      `
    },
    {
      code: '8',
      name: 'Stazione 8: Autonomia Cittadina (Days 15–21)',
      subtitle: 'PHASE 2 &bull; AUTONOMY (DAYS 15–21)',
      icon: '🚌',
      avatar: '💪',
      speech: 'In week 1, my buddy accompanied me everywhere. But by week 3, I was buying my own tram tickets, booking postal appointments, and ordering food with confidence. <strong>The ultimate goal of UNICORE is to help you stand proudly on your own feet!</strong>',
      body: `
        <ul class="clean-interactive-checklist">
          <li>
            <label class="check-item-label">
              <input type="checkbox" class="journey-checkbox" data-task="task-8-1">
              <span><strong>Buy a Student Monthly Transit Pass:</strong> Visit the municipal transport office (e.g. ATAC Rome, ATM Milan, TPER Bologna, GTT Turin) with your student certificate for 50%+ discounts.</span>
            </label>
          </li>
          <li>
            <label class="check-item-label">
              <input type="checkbox" class="journey-checkbox" data-task="task-8-2">
              <span><strong>Navigate the Italian Post Office (Poste):</strong> Take a ticket from the touchscreen kiosk (press *Finanziari* for bank/payments or *Posta e Pacchi* for parcels).</span>
            </label>
          </li>
          <li>
            <label class="check-item-label">
              <input type="checkbox" class="journey-checkbox" data-task="task-8-3">
              <span><strong>Book Appointments Online:</strong> Learn to use university portals and municipal *Anagrafe* booking systems.</span>
            </label>
          </li>
          <li>
            <label class="check-item-label">
              <input type="checkbox" class="journey-checkbox" data-task="task-8-4">
              <span><strong>Write Simple Formal Italian Emails:</strong> Begin with <em>"Gentile Professore/Professoressa..."</em> and end with <em>"Cordiali saluti"</em>.</span>
            </label>
          </li>
        </ul>
      `
    },
    {
      code: '9',
      name: 'Stazione 9: Rete & Comunità (Days 20–25)',
      subtitle: 'PHASE 2 &bull; COMMUNITY (DAYS 20–25)',
      icon: '🤝',
      avatar: '🫂',
      speech: '<em>"Your Master\'s degree is important. But your community is what makes Italy feel like home."</em> Form study groups with classmates, cook weekend dinners, and connect with senior UNICORE scholars who have walked this exact path before you.',
      body: `
        <div class="community-tree-box">
          <div class="community-tree-header"><strong>THE UNICORE SUPPORT NETWORK</strong></div>
          <div class="community-tree-grid">
            <div class="community-node">
              <i class="fa-solid fa-handshake"></i>
              <strong>Your Peer Buddy</strong>
              <span>Daily life & campus friend</span>
            </div>
            <div class="community-node">
              <i class="fa-solid fa-users"></i>
              <strong>Classmates & Cohort</strong>
              <span>Study groups & project teams</span>
            </div>
            <div class="community-node">
              <i class="fa-brands fa-linkedin"></i>
              <strong>UNICORE Alumni Network</strong>
              <span>Senior scholars across Italy</span>
            </div>
            <div class="community-node">
              <i class="fa-solid fa-earth-africa"></i>
              <strong>Community Matching</strong>
              <span>Local mentors in 13 cities</span>
            </div>
          </div>
        </div>
      `
    },
    {
      code: '10',
      name: 'Stazione 10: Capolinea Laurea (Days 25–30)',
      subtitle: 'DAY 30 &bull; THE GRADUATION LAUNCHPAD',
      icon: '🎓',
      avatar: '🚀',
      speech: 'Look back at Day 1 when you landed with that single suitcase. <strong>You now know where to go. You know who to ask. You understand how Italian bureaucracy, university, and budgeting work. And most importantly, you know you don\'t have to do it alone!</strong>',
      body: `
        <div class="three-pathways-grid">
          <div class="pathway-card">
            <div class="pathway-icon"><i class="fa-solid fa-briefcase"></i></div>
            <h4>1. Professional Career & Job Search</h4>
            <p>Under Italian Law (<em>Art. 39-bis.1</em>), UNICORE Master's graduates can convert their student permit into a <strong>12-Month Job Search Permit</strong>. Connect with 500+ certified employers on UNHCR's <em>Welcome-in-One-Click</em> portal.</p>
          </div>
          <div class="pathway-card">
            <div class="pathway-icon"><i class="fa-solid fa-microscope"></i></div>
            <h4>2. Fully Funded Ph.D. Research</h4>
            <p>With an accredited Italian <em>Laurea Magistrale (120 CFU)</em>, you can apply for competitive funded doctoral research fellowships across Italian and European universities.</p>
          </div>
          <div class="pathway-card">
            <div class="pathway-icon"><i class="fa-solid fa-lightbulb"></i></div>
            <h4>3. Community & Social Leadership</h4>
            <p>Join the UNICORE Students Association, mentor incoming scholars, and publish research that shapes global higher education corridors.</p>
          </div>
        </div>

        <div class="sami-final-letter" style="margin-top: 2rem;">
          <h3>🇮🇹 Benvenuto in Italia, My Friend!</h3>
          <p>
            You came to Italy to study. But you are also building a new life. Walk into your university with your head held high—you have earned your seat here!
          </p>
          <div style="margin-top: 1rem; font-weight: 700; color: var(--primary);">
            &mdash; Yohannes Sisay Molla & the UNICORE Senior Scholars Community
          </div>
        </div>
      `
    }
  ];

  // Web Audio Synthesizer (Safe)
  let audioCtx = null;
  function playMetroChime(type = 'chime') {
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

      if (type === 'chime') {
        // Italian train announcement two-tone chime (Fa - Do)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(349.23, now);
        osc.frequency.setValueAtTime(523.25, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'check') {
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
      // Audio fallback
    }
  }

  function init() {
    loadSavedState();
    attachMetroStationEvents();
    renderActiveStation(currentStation, false);
  }

  function loadSavedState() {
    try {
      const savedVisited = localStorage.getItem(STORAGE_VISITED_KEY);
      if (savedVisited) visitedStations = new Set(JSON.parse(savedVisited));

      const savedChecks = localStorage.getItem(STORAGE_CHECKS_KEY);
      if (savedChecks) checkedTasks = new Set(JSON.parse(savedChecks));
    } catch (e) {
      // Storage fallback
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_VISITED_KEY, JSON.stringify(Array.from(visitedStations)));
      localStorage.setItem(STORAGE_CHECKS_KEY, JSON.stringify(Array.from(checkedTasks)));
    } catch (e) {
      // Storage fallback
    }
  }

  function renderActiveStation(index, isUserAction = true) {
    if (index < 0) index = 0;
    if (index >= TOTAL_STATIONS) index = TOTAL_STATIONS - 1;
    currentStation = index;
    visitedStations.add(currentStation);
    saveState();

    const data = STATIONS[currentStation];
    if (!data) return;

    // 1. Update Metro Track Nodes
    const stationNodes = document.querySelectorAll('.metro-station-node');
    stationNodes.forEach((node, idx) => {
      node.classList.toggle('active', idx === currentStation);
      node.classList.toggle('visited', visitedStations.has(idx));
    });

    // Scroll active station node into view on horizontal track
    const activeNode = document.querySelector(`.metro-station-node[data-station="${currentStation}"]`);
    if (activeNode) {
      activeNode.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // 2. Update Metro Rail Line Glowing Progress
    const railProgress = document.getElementById('metroRailProgress');
    if (railProgress) {
      const railPct = (currentStation / (TOTAL_STATIONS - 1)) * 100;
      railProgress.style.width = `${railPct}%`;
    }

    // 3. Update Header Status
    const headerName = document.getElementById('currentStationNameHeader');
    const progressCount = document.getElementById('metroProgressCount');
    const progressBarFill = document.getElementById('metroProgressBarFill');

    if (headerName) headerName.textContent = data.name;
    if (progressCount) progressCount.textContent = `${visitedStations.size} / ${TOTAL_STATIONS} Stations Visited`;
    if (progressBarFill) {
      const pct = Math.round((visitedStations.size / TOTAL_STATIONS) * 100);
      progressBarFill.style.width = `${pct}%`;
    }

    // 4. Update Terminal Card Viewport
    const viewport = document.getElementById('stationContentViewport');
    const stationCodeDisplay = document.getElementById('stationCodeDisplay');
    const prevBtn = document.getElementById('prevStationBtn');
    const nextBtn = document.getElementById('nextStationBtn');
    const markVisitedBtn = document.getElementById('markStationVisitedBtn');
    const continueBtn = document.getElementById('terminalContinueBtn');

    if (stationCodeDisplay) stationCodeDisplay.textContent = `STAZIONE ${data.code}`;

    if (viewport) {
      viewport.innerHTML = `
        <div class="terminal-station-header">
          <div class="station-main-icon">${data.icon}</div>
          <div>
            <span class="station-subtitle-tag">${data.subtitle}</span>
            <h2 class="station-main-title">${data.name}</h2>
          </div>
        </div>

        <div class="yohannes-speech-bubble" style="margin-top: 1.25rem;">
          <div class="bubble-avatar">${data.avatar}</div>
          <div class="bubble-content">${data.speech}</div>
        </div>

        <div class="station-inner-content">
          ${data.body}
        </div>
      `;

      // Re-initialize dynamic tools inside the rendered content
      initDynamicTools();
    }

    // 5. Update Navigation Buttons
    if (prevBtn) {
      prevBtn.disabled = currentStation === 0;
      prevBtn.style.opacity = currentStation === 0 ? '0.4' : '1';
    }

    if (nextBtn) {
      if (currentStation === TOTAL_STATIONS - 1) {
        nextBtn.innerHTML = '<i class="fa-solid fa-trophy"></i> Capolinea';
      } else {
        nextBtn.innerHTML = 'Next Stop <i class="fa-solid fa-chevron-right"></i>';
      }
    }

    if (continueBtn) {
      if (currentStation === TOTAL_STATIONS - 1) {
        continueBtn.innerHTML = '<i class="fa-solid fa-trophy"></i> Arrived at Capolinea Laurea!';
        continueBtn.style.background = '#059669';
      } else {
        const nextData = STATIONS[currentStation + 1];
        continueBtn.innerHTML = `Travel to ${nextData.code}. ${nextData.name.split(':')[1] || ''} <i class="fa-solid fa-arrow-right"></i>`;
        continueBtn.style.background = '';
      }
    }

    if (markVisitedBtn) {
      markVisitedBtn.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #059669;"></i> Station Checked';
    }

    if (isUserAction) {
      playMetroChime('chime');
      const card = document.getElementById('metroStationCard');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function attachMetroStationEvents() {
    // Station Nodes on Map
    document.querySelectorAll('.metro-station-node').forEach((node) => {
      node.addEventListener('click', () => {
        const idx = parseInt(node.getAttribute('data-station'), 10);
        if (!isNaN(idx)) renderActiveStation(idx, true);
      });
    });

    // Top Prev/Next Buttons
    const prevBtn = document.getElementById('prevStationBtn');
    const nextBtn = document.getElementById('nextStationBtn');
    const continueBtn = document.getElementById('terminalContinueBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStation > 0) renderActiveStation(currentStation - 1, true);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentStation < TOTAL_STATIONS - 1) {
          renderActiveStation(currentStation + 1, true);
        } else {
          playMetroChime('complete');
          triggerConfetti();
        }
      });
    }

    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        if (currentStation < TOTAL_STATIONS - 1) {
          renderActiveStation(currentStation + 1, true);
        } else {
          playMetroChime('complete');
          triggerConfetti();
        }
      });
    }
  }

  // Dynamic Tools Attachments (Budget, Triage, Audio, Quizzes, Checks)
  function initDynamicTools() {
    // Checkboxes
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
          playMetroChime('check');
        } else {
          if (id) checkedTasks.delete(id);
          if (parentLi) parentLi.classList.remove('checked-task');
        }
        saveState();
      });
    });

    // Budget Simulator
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
          playMetroChime('check');
        }
      });
    });

    [rentSlider, foodSlider, phoneSlider, transitSlider, otherSlider].forEach(s => {
      if (s) s.addEventListener('input', calculateBudget);
    });

    calculateBudget();

    // Copy Budget Button
    const copyBtn = document.getElementById('copyBudgetBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const stipend = document.getElementById('budgetStipendInput')?.value || '500';
        const rent = document.getElementById('rentVal')?.textContent || '€150';
        const food = document.getElementById('foodVal')?.textContent || '€180';
        const phone = document.getElementById('phoneVal')?.textContent || '€30';
        const transit = document.getElementById('transitVal')?.textContent || '€25';
        const other = document.getElementById('otherVal')?.textContent || '€45';
        const total = document.getElementById('budgetTotalDisplay')?.textContent || '€430';
        const net = document.getElementById('budgetNetBalanceDisplay')?.textContent || '+€70';
        const projection = document.getElementById('budgetAnnualSavingsDisplay')?.textContent || '+€700 Saved';

        const planText = [
          '🇮🇹 UNICORE Student Monthly Budget Plan',
          '---------------------------------------',
          `• Monthly Stipend: €${stipend}/month`,
          `• Housing / Utilities: ${rent}`,
          `• Groceries & Mensa: ${food}`,
          `• Phone & Internet: ${phone}`,
          `• Public Transit Pass: ${transit}`,
          `• Personal & Buffer: ${other}`,
          '---------------------------------------',
          `• Total Monthly Expenses: ${total}`,
          `• Net Balance: ${net}/month`,
          `• 10-Month Academic Projection: ${projection}`,
          '',
          'Generated from Linea UNICORE Metro Guide (https://ysmjone-max.github.io/Unicore/first-30-days.html)'
        ].join('\n');

        navigator.clipboard.writeText(planText).then(() => {
          copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #059669;"></i> Copied!';
          playMetroChime('check');
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Budget Plan to Clipboard';
          }, 2500);
        });
      });
    }

    // Healthcare Triage
    const triageBtns = document.querySelectorAll('.triage-select-btn');
    const triageOutput = document.getElementById('triageResultBox');
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

    triageBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        triageBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-triage');
        const item = triageData[key];
        if (item && triageOutput) {
          triageOutput.innerHTML = `
            <div class="triage-result-card ${item.urgent ? 'urgent' : ''}">
              <div class="triage-res-title">${item.title}</div>
              <div class="triage-res-dest"><strong>Where to go:</strong> ${item.dest}</div>
              <div class="triage-res-action">${item.action}</div>
            </div>
          `;
          playMetroChime('check');
        }
      });
    });

    // Spoken Audio Phrases
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

    // Mini Quizzes
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
            playMetroChime('check');
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
      // Fallback
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
