// enhance.js — progressive enhancement only. The build cannot know today's
// date, so without JavaScript the track panel lists every show latest date
// first. Here the lines still to come move to the top, soonest first (A1 is
// the next show), and played ones follow, newest first, dimmed as .played.
// The side labels and numbers are CSS, so they follow the new order.
const two = (n) => String(n).padStart(2, '0');
const now = new Date();
const today = `${now.getFullYear()}-${two(now.getMonth() + 1)}-${two(now.getDate())}`;

for (const list of document.querySelectorAll('ol.tracks')) {
  const rows = [...list.children].map((row) => ({ row, iso: (row.querySelector('time')?.getAttribute('datetime') || '').slice(0, 10) }));
  if (rows.some((r) => !r.iso)) continue;
  const ahead = rows.filter((r) => r.iso >= today).sort((a, b) => a.iso.localeCompare(b.iso));
  const played = rows.filter((r) => r.iso < today).sort((a, b) => b.iso.localeCompare(a.iso));
  for (const r of played) r.row.classList.add('played');
  list.append(...ahead.map((r) => r.row), ...played.map((r) => r.row));
}
