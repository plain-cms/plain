// enhance.js — progressive enhancement only (cms-spec.md C5). Without
// JavaScript the CV shows a keyboard hint for printing; with it, the hint
// gives way to the Print button the template rendered hidden.
const button = document.querySelector('.print-button');
if (button && typeof window.print === 'function') {
  const hint = document.querySelector('.print-hint');
  if (hint) hint.hidden = true;
  button.hidden = false;
  button.addEventListener('click', () => window.print());
}
