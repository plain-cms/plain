// enhance.js — progressive enhancement only (cms-spec.md C5). Every row shows
// without this file. The build does not know today's date; the browser does:
// from the day after its date an event row's date steps back to the quieter
// ink. `date` is only the first day of an event that may run for several, so
// nothing is ever hidden.
const now = new Date();
const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n) => String(n).padStart(2, '0')).join('-');

for (const time of document.querySelectorAll('.row time[datetime]')) {
  if (time.dateTime < today) time.closest('.row').dataset.past = '';
}
