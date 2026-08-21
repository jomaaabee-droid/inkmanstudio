/* ============================================
   INKMAN STUDIO – script.js
   ============================================ */

/* ---------- INSTAGRAM API ----------
   När du har din Meta API-nyckel, ersätt
   INSTAGRAM_ACCESS_TOKEN nedan och sätt
   INSTAGRAM_ENABLED = true
   ----------------------------------------- */

const INSTAGRAM_ENABLED = false;
const INSTAGRAM_ACCESS_TOKEN = 'DIN_API_NYCKEL_HÄR';
const INSTAGRAM_USER_ID = 'DIN_USER_ID_HÄR';
const INSTAGRAM_LIMIT = 12;

async function loadInstagramFeed() {
  if (!INSTAGRAM_ENABLED) {
    // API inte konfigurerat ännu – visa placeholder
    return;
  }

  const grid = document.getElementById('instagram-grid');
  if (!grid) return;

  try {
    const url = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media`
      + `?fields=id,media_type,media_url,thumbnail_url,permalink,caption`
      + `&limit=${INSTAGRAM_LIMIT}`
      + `&access_token=${INSTAGRAM_ACCESS_TOKEN}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Instagram API fel: ' + response.status);
    const data = await response.json();

    if (!data.data || data.data.length === 0) return;

    // Rensa placeholder
    grid.innerHTML = '';

    data.data.forEach(post => {
      if (post.media_type === 'VIDEO') return; // visa bara bilder

      const imgUrl = post.media_url || post.thumbnail_url;
      if (!imgUrl) return;

      const a = document.createElement('a');
      a.href = post.permalink;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', post.caption ? post.caption.substring(0, 60) : 'Instagram inlägg');

      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = post.caption ? post.caption.substring(0, 80) : 'Inkman Studio tatuering';
      img.loading = 'lazy';

      a.appendChild(img);
      grid.appendChild(a);
    });

  } catch (error) {
    console.warn('Instagram feed kunde inte laddas:', error.message);
  }
}

/* ---------- NAVBAR – sticky shadow ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.9)';
    } else {
      navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.6)';
    }
  }, { passive: true });
}

/* ---------- SIDEBAR – aktiv länk ---------- */
function initSidebarActiveLink() {
  const links = document.querySelectorAll('.sidebar__link');
  if (links.length === 0) return;

  // Markera aktiv länk vid klick
  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Markera aktiv länk baserat på scroll (Intersection Observer)
  const sections = document.querySelectorAll('.section, .center-hero');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(link => {
            link.classList.toggle('active',
              link.getAttribute('href') === `#${id}` ||
              link.id === id
            );
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(section => observer.observe(section));
}

/* ---------- SMOOTH SCROLL för ankarlänkar ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 60;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---------- NAVBAR – stäng dropdown vid klick utanför ---------- */
function initDropdownClose() {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown__menu').forEach(menu => {
        menu.style.display = '';
      });
    }
  });
}

/* ---------- HERO VIDEO – fallback om ingen video finns ---------- */
function initVideoFallback() {
  const video = document.querySelector('.hero__video');
  if (!video) return;

  video.addEventListener('error', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.background = 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%)';
    }
  });
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSidebarActiveLink();
  initSmoothScroll();
  initDropdownClose();
  initVideoFallback();
  loadInstagramFeed();
});
