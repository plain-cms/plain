// enhance.js — progressive enhancement only; the timetable is complete without it.
// Marks today's act in the weekly programme and reveals its hidden "Today"
// flag. A day label it cannot match ("Saturday (even weeks only)") stays unmarked.

const now = new Date();
const clean = (text) => text.trim().toLowerCase().replace(/\.$/, '');

const todayNames = new Set();
for (const locale of [document.documentElement.lang || 'en', 'en']) {
  for (const weekday of ['long', 'short']) {
    try { todayNames.add(clean(now.toLocaleDateString(locale, { weekday }))); } catch { /* unknown locale */ }
  }
}

for (const act of document.querySelectorAll('.programme .act')) {
  if (!todayNames.has(clean(act.dataset.day || ''))) continue;
  act.classList.add('is-today');
  act.setAttribute('aria-current', 'date');
  const flag = act.querySelector('.today-flag');
  if (flag) flag.hidden = false;
}
