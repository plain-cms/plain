// Optional: greys a stop from the day after its date. Nothing is hidden,
// since `date` is only an event's first day.
const d = new Date();
const today = [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, '0')).join('-');
for (const t of document.querySelectorAll('.stop time[datetime]')) {
  if (t.dateTime < today) t.closest('.stop').dataset.past = '';
}
