// enhance.js — progressive enhancement only (cms-spec.md C5).
// The build can't know "today" or a weekday, so the tour list is finished in
// the browser: each date becomes a block (day, weekday, month), the shows
// still to come move up with the next one first, and played ones settle
// underneath, marked .played, under their own label. When nothing is left to
// come, the "no shows right now" line says so. Without JavaScript the list is
// every show, latest date first, with the date written out — still correct,
// just less scannable.

const now = new Date();
const two = (n) => String(n).padStart(2, '0');
// Local calendar day, compared as text: tonight's show is not "played" yet.
const today = `${now.getFullYear()}-${two(now.getMonth() + 1)}-${two(now.getDate())}`;
const isoOf = (time) => (time?.getAttribute('datetime') || '').slice(0, 10);

let locale;
try { [locale] = Intl.DateTimeFormat.supportedLocalesOf(document.documentElement.lang); } catch { /* browser default */ }
const part = (date, options) => new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(date);

const span = (className, ...children) => {
  const el = document.createElement('span');
  el.className = className;
  el.append(...children);
  return el;
};

for (const time of document.querySelectorAll('time.show-date')) {
  const [year, month, day] = isoOf(time).split('-').map(Number);
  if (!year || !month || !day) continue;
  const date = new Date(Date.UTC(year, month - 1, day));
  const monthLine = span('date-month', part(date, { month: 'short' }));
  if (year !== now.getFullYear()) monthLine.append(' ', span('date-year', String(year)));
  const block = span('date-block', span('date-day', two(day)), span('date-rest', span('date-week', part(date, { weekday: 'short' })), monthLine));
  block.setAttribute('aria-hidden', 'true');
  // The written-out date stays for screen readers.
  time.replaceChildren(span('sr-only', time.textContent.trim()), block);
  const row = time.closest('.show-row');
  row?.classList.add('dated');
  if (isoOf(time) < today) row?.classList.add('played');
}

for (const list of document.querySelectorAll('.show-list')) {
  const rows = [...list.querySelectorAll('.show-row')]
    .map((row) => ({ row, iso: isoOf(row.querySelector('time[datetime]')) }))
    .filter((entry) => entry.iso);
  const ahead = rows.filter((entry) => entry.iso >= today).sort((a, b) => a.iso.localeCompare(b.iso));
  const played = rows.filter((entry) => entry.iso < today).sort((a, b) => b.iso.localeCompare(a.iso));
  const divider = list.querySelector('.show-divider');
  if (divider) divider.hidden = !played.length;
  const none = document.querySelector('.no-ahead');
  if (none) none.hidden = ahead.length > 0;
  list.append(...ahead.map((entry) => entry.row), ...(divider ? [divider] : []), ...played.map((entry) => entry.row));
}
