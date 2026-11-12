// Progressive enhancement only (C5): with scripts off every row shows. From
// the day after its date a row turns grey; more than seven days past it comes
// down, unless that would leave the notice empty.
const iso = (d) => [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, '0')).join('-');
const now = new Date();
const today = iso(now);
const weekAgo = iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7));

for (const list of document.querySelectorAll('.dates')) {
  const rows = [...list.querySelectorAll('.event-row')];
  const date = (row) => row.querySelector('time[datetime]')?.dateTime || '';
  const old = rows.filter((row) => date(row) && date(row) < weekAgo);
  for (const row of rows) if (date(row) && date(row) < today) row.dataset.past = '';
  if (old.length < rows.length) for (const row of old) row.hidden = true;
}

// Under each day figure: month and weekday ("Nov · Tue"), not the whole date
// again. The full date stays in the <time> for screen readers and no-script.
const fmt = (o) => new Intl.DateTimeFormat(document.documentElement.lang || undefined, { ...o, timeZone: 'UTC' });
const month = fmt({ month: 'short' });
const weekday = fmt({ weekday: 'short' });
for (const time of document.querySelectorAll('.dates .when time')) {
  const d = new Date(`${time.dateTime}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) continue;
  const short = document.createElement('span');
  short.className = 'short';
  short.setAttribute('aria-hidden', 'true');
  const y = d.getUTCFullYear();
  // another year: the year after the month, the weekday on its own line
  short.textContent = month.format(d) + (y === now.getFullYear() ? ' · ' : ` ${y}\n`) + weekday.format(d);
  time.classList.add('sr');
  time.after(short);
}
