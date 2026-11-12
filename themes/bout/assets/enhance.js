// enhance.js — progressive enhancement only. The bill is complete without it.
// With it, the day block whose label matches today's weekday (in the page's
// language or in English) shows its hidden Today flag. A label it cannot match
// ("Saturday (even weeks only)") is left alone.

const now = new Date();
const clean = (text) => text.trim().toLowerCase().replace(/\.$/, '');
const names = new Set();
for (const locale of [document.documentElement.lang || 'en', 'en']) {
  for (const weekday of ['long', 'short']) {
    try { names.add(clean(now.toLocaleDateString(locale, { weekday }))); } catch { /* unknown locale */ }
  }
}

for (const bill of document.querySelectorAll('.bill[data-day]')) {
  if (!names.has(clean(bill.dataset.day))) continue;
  bill.classList.add('is-today');
  bill.setAttribute('aria-current', 'date');
  const flag = bill.querySelector('.today-flag');
  if (flag) flag.hidden = false;
}
