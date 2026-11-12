// enhance.js — progressive enhancement only (cms-spec.md C5).
// The site is fully readable without this. It adds one nicety: a front-page
// story dated today or yesterday says so ("today", "yesterday") in the page's
// own language. Dates carry no time of day, so nothing finer would be honest.
// The printed date moves to the title; the datetime attribute is untouched.

const DAY = 864e5;
const now = new Date();
const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
const lang = document.documentElement.lang || undefined;

if (typeof Intl === 'object' && Intl.RelativeTimeFormat) {
  const relative = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
  for (const time of document.querySelectorAll('.front time[datetime]')) {
    const stamp = Date.parse(time.getAttribute('datetime').slice(0, 10));
    const days = Math.round((stamp - today) / DAY);
    if (days !== 0 && days !== -1) continue;
    time.title = time.textContent;
    time.textContent = relative.format(days, 'day');
  }
}
