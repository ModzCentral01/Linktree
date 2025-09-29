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

// SEARCH
const searchInput = document.getElementById('search');
if(searchInput){
  searchInput.addEventListener('input', filterProducts);
}
function filterProducts(){
  const q = (document.getElementById('search').value || '').trim().toLowerCase();
  document.querySelectorAll('.product').forEach(card=>{
    const text = ((card.dataset.tags || '') + ' ' + (card.innerText || '')).toLowerCase();
    const matches = !q || text.includes(q);
    card.style.display = matches ? '' : 'none';
  });
}

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
