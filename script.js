// assets/main.js
// Small, dependency-free JS for availability, search, typewriter and reveals.

/* ---------- Availability (Mon–Fri 10:00–14:00 UK) ---------- */
function getLondonParts() {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
  const parts = fmt.formatToParts(now);
  const weekday = parts.find(p => p.type === 'weekday')?.value || '';
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
  return { weekday, hour, minute, formatted: fmt.format(now) };
}

function updateAvailability() {
  const elDot = document.getElementById('availDot');
  const elText = document.getElementById('availText');
  const elTime = document.getElementById('availTime');
  if (!elDot || !elText || !elTime) return;

  const { weekday, hour, formatted } = getLondonParts();
  elTime.textContent = `• London: ${formatted}`;

  const open = ['Mon','Tue','Wed','Thu','Fri'].includes(weekday) && hour >= 10 && hour < 14;
  if (open) {
    elDot.style.background = '#2ee06d';
    elText.textContent = '🟢 Online — Available now (Mon–Fri 10:00–14:00 UK)';
  } else {
    elDot.style.background = '#ff6b6b';
    // quick next open calc
    let dayIndex = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(weekday);
    let daysAhead = 1;
    if (['Mon','Tue','Wed','Thu','Fri'].includes(weekday) && hour < 10) daysAhead = 0;
    else {
      for (let i = 1; i <= 7; i++) {
        const c = (dayIndex + i) % 7;
        if (['Mon','Tue','Wed','Thu','Fri'].includes(['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][c])) { daysAhead = i; break; }
      }
    }
    elText.textContent = daysAhead === 0 ? '🔴 Offline — Next: today 10:00' : `🔴 Offline — Next: in ${daysAhead} day${daysAhead > 1 ? 's' : ''} at 10:00 (UK)`;
  }
}

updateAvailability();
setInterval(updateAvailability, 30000);

/* ---------- Typewriter (subtle) ---------- */
(function typeWriterSetup() {
  const lines = [
    'Unlock mods. Keep it clean. Delivered fast.',
    'Professional modding services — PS4, PS5, PC.',
    'Pay via PayPal. Contact via Telegram.'
  ];
  const el = document.getElementById('typewriterLine');
  if (!el) return;
  let li = 0, ci = 0, forward = true;

  function tick() {
    const line = lines[li];
    if (forward) {
      ci++;
      if (ci >= line.length) { forward = false; setTimeout(tick, 900); return; }
    } else {
      ci--;
      if (ci <= 0) { forward = true; li = (li + 1) % lines.length; setTimeout(tick, 400); return; }
    }
    el.textContent = line.slice(0, ci);
    setTimeout(tick, forward ? 40 + Math.random()*30 : 24 + Math.random()*30);
  }
  tick();
})();

/* ---------- Simple reveal-on-scroll (lightweight) ---------- */
function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight - 80) el.classList.add('visible');
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

/* ---------- Accessible details polyfill (optional) ----------
   Some older browsers show different default behavior for <details>.
   We ensure keyboard accessibility and allow only one open on mobile if desired.
*/
(function detailsEnhance() {
  const details = document.querySelectorAll('details.category');
  if (!details.length) return;

  function adapt() {
    if (window.innerWidth <= 720) {
      // collapse all by default on small screens
      details.forEach(d => d.open = false);
    } else {
      // expand categories on larger screens for overview
      details.forEach(d => d.open = true);
    }
  }
  window.addEventListener('resize', adapt);
  adapt();

  // optional: close other categories when opening one on small screens
  details.forEach(d => {
    d.addEventListener('toggle', () => {
      if (window.innerWidth <= 720 && d.open) {
        details.forEach(other => { if (other !== d) other.open = false; });
      }
    });
  });
})();

/* ---------- Search (very small) ---------- */
(function searchSetup() {
  const input = document.getElementById('search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
      const text = (card.innerText || '').toLowerCase();
      card.closest('.col-12')?.classList.toggle('d-none', q ? !text.includes(q) : false);
    });
  });

  // "/" focuses search
  window.addEventListener('keydown', (e) => {
    if (e.key === '/') { e.preventDefault(); input.focus(); }
  });
})();