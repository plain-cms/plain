// Progressive enhancement only: a fingerpost ranges the walking time right
// of the destination, so a piece's header ranges its reading time right of
// its date. Without scripts the header shows the date alone.
const meta = document.querySelector('.stage-meta[data-read]');
const prose = document.querySelector('.stage .prose');
if (meta && prose) {
  const words = (prose.textContent.match(/\S+/g) || []).length;
  const span = document.createElement('span');
  span.className = 'walk-time';
  span.textContent = `≈ ${Math.max(1, Math.round(words / 230))} ${meta.dataset.read}`;
  meta.append(span);
}
