// enhance.js — progressive enhancement only (cms-spec.md C5).
// Adds an estimated reading time to the essay's meta line. Without JS the
// meta line simply shows the date and tags — nothing is lost. The words
// "min read" come from the theme's strings, via data-read-label.

const body = document.querySelector('.essay-body');
const meta = document.querySelector('.essay-meta');
const label = meta && meta.dataset.readLabel;
if (body && label) {
  const words = (body.textContent || '').trim().split(/\s+/).filter(Boolean).length;
  if (words > 0) {
    const span = document.createElement('span');
    span.className = 'read-time';
    span.textContent = `${Math.max(1, Math.round(words / 220))} ${label}`;
    meta.append(span);
  }
}
