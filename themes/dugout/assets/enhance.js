// enhance.js — progressive enhancement only (cms-spec.md C5). Every row of the
// fixture card shows without this file. The build does not know today's date;
// the browser does: from the day after its date a row is printed in grey.
// `date` is only the first day of an event that may run for several, so no
// row is ever hidden.
const now = new Date();
const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n) => String(n).padStart(2, '0')).join('-');

for (const time of document.querySelectorAll('.fx time[datetime]')) {
  if (time.dateTime < today) time.closest('.fx').dataset.past = '';
}
