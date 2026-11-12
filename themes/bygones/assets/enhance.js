// Progressive enhancement only (C5): the build does not know today's date, the
// browser does. From the day after its date an event card is stamped held.
// `date` is only an event's first day, so nothing is ever hidden.
const now = new Date();
const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n) => String(n).padStart(2, '0')).join('-');

for (const time of document.querySelectorAll('.cards > .ev > .tab > time[datetime]')) {
  if (time.dateTime < today) time.closest('.ev').dataset.past = '';
}
