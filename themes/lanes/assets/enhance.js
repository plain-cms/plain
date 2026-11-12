// enhance.js — progressive enhancement only. The timetable is complete
// without it; with it, today's lane shows a white "Today" plate beside its
// day name. Matched on the day label in the page language or English
// ("Monday", "Mon", "Montag"); a label it cannot match stays unmarked.

const clean = (text) => text.trim().toLowerCase().replace(/\.$/, '');
const now = new Date();
const today = new Set();
for (const locale of [document.documentElement.lang || 'en', 'en']) {
  for (const weekday of ['long', 'short']) {
    try { today.add(clean(now.toLocaleDateString(locale, { weekday }))); } catch { /* unknown locale */ }
  }
}

for (const lane of document.querySelectorAll('.lane[data-day]')) {
  if (!today.has(clean(lane.dataset.day || ''))) continue;
  lane.classList.add('is-today');
  lane.setAttribute('aria-current', 'date');
  const flag = lane.querySelector('.today-flag');
  if (flag) flag.hidden = false;
}
