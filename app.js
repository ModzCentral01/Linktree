// Availability and London time
function getLondonParts() {
  const dt = new Date();
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12:false });
  const parts = fmt.formatToParts(dt);
  const weekday = parts.find(p=>p.type==='weekday')?.value || '';
  const hour = parseInt(parts.find(p=>p.type==='hour')?.value||'0',10);
  const minute = parseInt(parts.find(p=>p.type==='minute')?.value||'0',10);
  return { weekday, hour, minute, formatted: fmt.format(dt) };
}
function updateAvailability(){
  const { weekday, hour, formatted } = getLondonParts();
  const days = ['Mon','Tue','Wed','Thu','Fri'];
  const isWeekday = days.includes(weekday);
  const open = isWeekday && (hour >= 10 && hour < 14);
  const dot = document.getElementById('availDot');
  const txt = document.getElementById('availText');
  const lt = document.getElementById('londonTime');

  if(lt) lt.innerText = `• London: ${formatted}`;
  if(!dot || !txt) return;
  if(open){
    dot.style.background = '#2ee06d';
    txt.innerText = '🟢 Online — Available now (Mon–Fri 10:00–14:00 UK)';
  } else {
    dot.style.background = '#ff6b6b';
    const dayIndex = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(weekday);
    let daysAhead = 1;
    if (isWeekday && hour < 10) daysAhead = 0;
    else {
      for (let i=1;i<=7;i++){
        const check = (dayIndex + i) % 7;
        const checkName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][check];
        if(['Mon','Tue','Wed','Thu','Fri'].includes(checkName)){ daysAhead = i; break; }
      }
    }
    const nextText = daysAhead===0 ? 'today at 10:00' : `in ${daysAhead} day${daysAhead>1?'s':''} at 10:00`;
    txt.innerText = `🔴 Offline — Next: ${nextText} (UK)`;
  }
}

// reveal animations
function revealOnScroll(){
  document.querySelectorAll('.reveal').forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top < (window.innerHeight - 120)) el.classList.add('visible');
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// adapt layout for responsive behaviors
function adaptLayout(){
  // placeholder for future layout adaptation
}
window.addEventListener('resize', adaptLayout);

// Debounce helper
function debounce(fn, wait){ let t; return function(...args){ clearTimeout(t); t = setTimeout(()=>fn.apply(this,args), wait); } }

// SEARCH wiring with debounce
const searchEl = document.getElementById('search');
if(searchEl){
  searchEl.setAttribute('aria-label','Search products');
  searchEl.addEventListener('input', debounce(filterProducts, 180));
}

// Make product cards keyboard-activatable and accessible
function makeProductsAccessible(){
  document.querySelectorAll('.product').forEach(card=>{
    card.setAttribute('tabindex','0');
    card.setAttribute('role','article');
    // allow pressing Enter to open first buy link
    card.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        const a = card.querySelector('.btn-buy');
        if(a){ a.click(); }
      }
    });
  });
}

// Update availability aria status and run on load
function setAvailabilityAria(){
  const badge = document.getElementById('availBadge');
  if(!badge) return;
  badge.setAttribute('role','status');
}

// FAQ aria setup
function setupFaqAria(){
  document.querySelectorAll('.faq-item').forEach(item=>{
    const q = item.querySelector('.question');
    const a = item.querySelector('.answer');
    if(!q || !a) return;
    q.setAttribute('role','button');
    q.setAttribute('tabindex','0');
    q.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
  });
}

// enhance click handler to toggle aria-expanded
document.addEventListener('click', (e)=>{
  const q = e.target.closest('.faq-item .question');
  if(q){
    const item = q.parentElement;
    item.classList.toggle('open');
    q.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
  }
});
// keyboard toggle for FAQ questions
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' || e.key === ' '){
    const q = document.activeElement.closest && document.activeElement.closest('.faq-item .question');
    if(q){ e.preventDefault(); q.click(); }
  }
});

// init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', ()=>{
  updateAvailability(); setInterval(updateAvailability, 30000);
  revealOnScroll(); highlightNav(); makeProductsAccessible(); setAvailabilityAria(); setupFaqAria();
});

// keyboard 
window.addEventListener('keydown', e=>{
  if(e.key === '/') { e.preventDefault(); const s = document.getElementById('search'); if(s) s.focus(); }
});

// highlight nav on scroll
function highlightNav(){
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = ['links','shop','faq'];
  let found = null;
  sections.forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    if(el.getBoundingClientRect().top <= 120) found = id;
  });
  navLinks.forEach(a=>{
    if(found && a.getAttribute('href') === '#'+found) a.classList.add('active');
    else a.classList.remove('active');
  });
}
window.addEventListener('scroll', highlightNav);
window.addEventListener('load', ()=>{ updateAvailability(); setInterval(updateAvailability, 30000); highlightNav(); });

// FAQ accordion
document.addEventListener('click', (e)=>{
  const q = e.target.closest('.faq-item .question');
  if(q){
    const item = q.parentElement;
    item.classList.toggle('open');
  }
});

// Typewriter effect for hero subtitle
function typewriter(el, text, speed=40){
  if(!el) return;
  let i=0; el.innerText = '';
  function step(){ if(i<=text.length){ el.innerText = text.slice(0,i); i++; setTimeout(step, speed); } }
  step();
}
const heroSubtitle = document.querySelector('.hero .subtitle');
if(heroSubtitle){
  const txt = "Unlock exclusive mods, max ranks, and dominate your favourite games • Pay with PayPal (GBP) • Delivery 24–48 hours";
  typewriter(heroSubtitle, txt, 18);
}
