// Progressive enhancement only: the timetable is complete without it.
// Marks the day block whose label is today's weekday (in the page language or
// English) and reveals its hidden Today flag. Labels it cannot match stay as they are.
const clean = (text) => text.trim().toLowerCase().replace(/\.$/, '');
const now = new Date();
const names = new Set();
for (const locale of [document.documentElement.lang || 'en', 'en']) {
  for (const weekday of ['long', 'short']) {
    try { names.add(clean(now.toLocaleDateString(locale, { weekday }))); } catch { /* unknown locale */ }
  }
}
for (const day of document.querySelectorAll('.timetable .day')) {
  if (!names.has(clean(day.dataset.day || ''))) continue;
  day.classList.add('is-today');
  day.setAttribute('aria-current', 'date');
  const flag = day.querySelector('.today-flag');
  if (flag) flag.hidden = false;
}
