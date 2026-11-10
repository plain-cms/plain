// enhance.js — progressive enhancement only (cms-spec.md C5).
// The timetable is complete without JavaScript. With it, today's day block is
// marked, classes already under way fade and the next one takes the accent
// (the theme.css .is-today / .is-past / .is-next styles), so a phone at arm's
// length answers "can I go today?" in one glance.

const now = new Date();
const clean = (text) => text.trim().toLowerCase().replace(/\.$/, '');

// Today's name, long and short, in the page's language and in English — so
// "Monday", "mon", "Montag" and "Mo." all match.
const todayNames = new Set();
for (const locale of [document.documentElement.lang || 'en', 'en']) {
  for (const weekday of ['long', 'short']) {
    try { todayNames.add(clean(now.toLocaleDateString(locale, { weekday }))); } catch { /* unknown locale */ }
  }
}

/** Minutes since midnight for "07:00", "7.30", "19h15", "6pm" or "6:15 PM"; null if unreadable. */
function minutes(text) {
  const m = text.match(/^\s*(\d{1,2})(?:[:.h](\d{2}))?\s*([ap])?/i);
  if (!m) return null;
  const hour = m[3] ? (Number(m[1]) % 12) + (m[3].toLowerCase() === 'p' ? 12 : 0) : Number(m[1]);
  return hour * 60 + Number(m[2] || 0);
}

const nowMinutes = now.getHours() * 60 + now.getMinutes();

for (const day of document.querySelectorAll('.timetable .day')) {
  if (!todayNames.has(clean(day.dataset.day || ''))) continue;
  day.classList.add('is-today');
  day.setAttribute('aria-current', 'date');
  const flag = day.querySelector('.today-flag');
  if (flag) flag.hidden = false;
  let nextFound = false;
  for (const session of day.querySelectorAll('.session')) {
    const starts = minutes(session.querySelector('.session-time')?.textContent || '');
    if (starts === null) continue;
    if (starts < nowMinutes) session.classList.add('is-past');
    else if (!nextFound) { session.classList.add('is-next'); nextFound = true; }
  }
}
