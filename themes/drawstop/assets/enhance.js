// enhance.js — progressive enhancement only (cms-spec.md C5).
// The build cannot know today's date. In the browser, each list of dates
// puts the dates still to come first, soonest at the top, and the played
// ones after them, latest first, with their knobs pushed in (.played).
// Each date also gains its weekday. Without JavaScript the list is every
// date, latest first, and reads correctly as it stands.

const now = new Date();
const two = (n) => String(n).padStart(2, '0');
const today = `${now.getFullYear()}-${two(now.getMonth() + 1)}-${two(now.getDate())}`;
const isoOf = (row) => (row.querySelector('time[datetime]')?.getAttribute('datetime') || '').slice(0, 10);

let locale;
try { [locale] = Intl.DateTimeFormat.supportedLocalesOf(document.documentElement.lang); } catch { /* browser default */ }

for (const time of document.querySelectorAll('time.stop-date')) {
  const [y, m, d] = (time.getAttribute('datetime') || '').slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) continue;
  const day = document.createElement('span');
  day.className = 'stop-day';
  day.textContent = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)));
  time.prepend(day);
}

for (const list of document.querySelectorAll('.jamb')) {
  const rows = [...list.querySelectorAll('.stop')].filter(isoOf);
  const ahead = rows.filter((r) => isoOf(r) >= today).sort((a, b) => isoOf(a).localeCompare(isoOf(b)));
  const played = rows.filter((r) => isoOf(r) < today);
  for (const r of played) r.classList.add('played');
  list.append(...ahead, ...played);
  list.classList.add('sorted');
}

const show = document.querySelector('.show');
if (show && isoOf(show) && isoOf(show) < today) show.classList.add('played');
