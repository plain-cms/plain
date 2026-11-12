// enhance.js — progressive enhancement only (cms-spec.md C5). The timetable is
// complete without it. With it, today's day on the contents page gets heavier
// rules and its hidden "Today" word is revealed, matched on the day label in
// the page's language or in English ("Monday", "Mon", "Montag", "Mo.").
const now = new Date();
const clean = (text) => text.trim().toLowerCase().replace(/\.$/, '');
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
