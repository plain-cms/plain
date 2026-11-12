// Progressive enhancement only: the home page's hand-picked pieces are
// cells of the date-due slip; this stamps each with its own date, read from
// the piece's page. Without scripts the cells show their titles, unstamped.
const list = document.querySelector('.sheet-home .prose > ul:first-of-type');
const items = list && list.matches(':has(> li > a)') ? [...list.children] : [];
for (const li of items) {
  const a = li.querySelector(':scope > a[href]');
  if (!a || a.origin !== location.origin) { li.classList.add('is-stamped'); continue; }
  fetch(a.href)
    .then((r) => (r.ok ? r.text() : ''))
    .then((html) => {
      const t = html && new DOMParser().parseFromString(html, 'text/html').querySelector('.review-stamp time');
      if (t) {
        const stamp = document.createElement('time');
        stamp.className = 'stamp';
        stamp.dateTime = t.getAttribute('datetime') || '';
        stamp.textContent = t.textContent.trim();
        li.prepend(stamp);
      }
    })
    .catch(() => {})
    .finally(() => li.classList.add('is-stamped'));
}
