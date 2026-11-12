// enhance.js — progressive enhancement only (cms-spec.md C5).
// The build cannot know today's date, so without JavaScript every bellows
// list is the full list, latest date first — correct as it stands. Here,
// in the browser, the dates still to come move to the top (soonest first)
// and the played ones settle below their own label, marked .played.

const now = new Date();
const two = (n) => String(n).padStart(2, '0');
const today = `${now.getFullYear()}-${two(now.getMonth() + 1)}-${two(now.getDate())}`;

for (const list of document.querySelectorAll('.bellows[data-sortable]')) {
  const rows = [...list.querySelectorAll(':scope > .pleat')]
    .map((row) => ({ row, iso: (row.querySelector('time[datetime]')?.getAttribute('datetime') || '').slice(0, 10) }))
    .filter((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry.iso));
  const ahead = rows.filter((entry) => entry.iso >= today).sort((a, b) => a.iso.localeCompare(b.iso));
  const played = rows.filter((entry) => entry.iso < today).sort((a, b) => b.iso.localeCompare(a.iso));
  for (const entry of played) entry.row.classList.add('played');
  const divider = list.querySelector('.bellows-divider');
  if (divider) divider.hidden = !played.length;
  list.append(...ahead.map((entry) => entry.row), ...(divider ? [divider] : []), ...played.map((entry) => entry.row));
}
