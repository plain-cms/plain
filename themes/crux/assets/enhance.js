// Progressive enhancement only: the timetable is complete without it. With
// it, today's row on the wall is flagged, matched on the day label in the
// page's language or in English; a label it cannot match stays unmarked.
const now = new Date();
const clean = (t) => t.trim().toLowerCase().replace(/\.$/, '');
const names = new Set();
for (const locale of [document.documentElement.lang || 'en', 'en']) {
  for (const weekday of ['long', 'short']) {
    try { names.add(clean(now.toLocaleDateString(locale, { weekday }))); } catch { /* unknown locale */ }
  }
}
for (const day of document.querySelectorAll('.wall .day')) {
  if (!names.has(clean(day.dataset.day || ''))) continue;
  day.classList.add('is-today');
  day.setAttribute('aria-current', 'date');
  const flag = day.querySelector('.today-flag');
  if (flag) flag.hidden = false;
}
