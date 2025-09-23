// Typewriter effect
const words = ["Tools", "Bots", "Community"];
let i = 0, j = 0, currentWord = "", isDeleting = false;
function type() {
  currentWord = words[i];
  const display = document.getElementById("typewriter");
  if (isDeleting) {
    display.textContent = currentWord.substring(0, j--);
    if (j < 0) {
      isDeleting = false;
      i = (i + 1) % words.length;
      setTimeout(type, 500);
    } else setTimeout(type, 50);
  } else {
    display.textContent = currentWord.substring(0, j++);
    if (j > currentWord.length) {
      isDeleting = true;
      setTimeout(type, 1200);
    } else setTimeout(type, 120);
  }
}
type();

// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Countdown timer to 10am GMT
function updateCountdown() {
  const now = new Date();
  let target = new Date();
  target.setUTCHours(10, 0, 0, 0);
  if (now.getTime() > target.getTime()) {
    target.setUTCDate(target.getUTCDate() + 1);
  }
  const diff = target - now;
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  document.getElementById("timer").textContent =
    `${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Loading spinner
window.addEventListener('load', function() {
  setTimeout(function() {
    document.getElementById('spinner').style.display = 'none';
  }, 600);
});

// TikTok browser detection and Toast
function isTikTokBrowser() {
  return navigator.userAgent.toLowerCase().includes('tiktok');
}
var tiktokToast = new bootstrap.Toast(document.getElementById('tiktokToast'));
document.getElementById('tiktok-link').addEventListener('click', function(e) {
  if (isTikTokBrowser()) {
    e.preventDefault();
    tiktokToast.show();
  }
});
document.getElementById('copyTikTok').addEventListener('click', function() {
  navigator.clipboard.writeText(document.getElementById('tiktokUrl').textContent);
  this.textContent = 'Copied!';
  setTimeout(() => { this.textContent = 'Copy Link'; }, 1200);
});

// Smooth scroll for FAQ and modal triggers
document.querySelectorAll('button[data-bs-toggle="collapse"], button[data-bs-toggle="modal"]').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    setTimeout(function() {
      var targetId = btn.getAttribute('data-bs-target');
      if (targetId && targetId.startsWith('#')) {
        var el = document.querySelector(targetId);
        if (el) el.scrollIntoView({behavior:'smooth',block:'center'});
      }
    }, 400);
  });
});

// Copy Link buttons for all social and card links
const copyBtns = document.querySelectorAll('.copy-link');
copyBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    navigator.clipboard.writeText(btn.getAttribute('data-link'));
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy Link'; }, 1200);
  });
});

// Dark/Light mode toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  if (document.body.classList.contains('light-mode')) {
    themeIcon.textContent = '☀️';
  } else {
    themeIcon.textContent = '🌙';
  }
});

// Share button functionality
const shareBtn = document.getElementById('shareBtn');
shareBtn.addEventListener('click', () => {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    shareBtn.textContent = 'Copied!';
    setTimeout(() => { shareBtn.innerHTML = '<span>🔗 Share</span>'; }, 1200);
  }
});

// Back to top button
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = 'block';
  } else {
    backToTopBtn.style.display = 'none';
  }
});
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Message sent!');
    contactForm.reset();
    var modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
    modal.hide();
  });
}

// Feedback form submission
const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
  feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Feedback sent! Thank you for your suggestion.');
    feedbackForm.reset();
    var modal = bootstrap.Modal.getInstance(document.getElementById('feedbackModal'));
    modal.hide();
  });
}
