// enhance.js — progressive enhancement only (cms-spec.md C5).
// The CV page renders a keyboard hint for printing and a hidden Print
// button whose label comes from strings.json. With script, the button
// replaces the hint. Nothing else depends on this file.

const button = document.querySelector('.print-button');
if (button && typeof window.print === 'function') {
  const hint = document.querySelector('.print-hint');
  if (hint) hint.hidden = true;
  button.hidden = false;
  button.addEventListener('click', () => window.print());
}
