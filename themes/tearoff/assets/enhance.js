// Progressive enhancement only: the fringe is complete without it. With it,
// today's strip is marked (matched on the day label in the page's language or
// English; a label it cannot match, such as "Saturday (even weeks)", is left alone).
const clean = (text) => text.trim().toLowerCase().replace(/\.$/, '');
const now = new Date();
const names = new Set();
for (const locale of [document.documentElement.lang || 'en', 'en']) {
  for (const weekday of ['long', 'short']) {
    try { names.add(clean(now.toLocaleDateString(locale, { weekday }))); } catch { /* unknown locale */ }
  }
}
for (const strip of document.querySelectorAll('.strip[data-day]')) {
  if (!names.has(clean(strip.dataset.day))) continue;
  strip.classList.add('is-today');
  strip.setAttribute('aria-current', 'date');
  const flag = strip.querySelector('.today-flag');
  if (flag) flag.hidden = false;
}
