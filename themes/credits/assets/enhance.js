// enhance.js — progressive enhancement only (cms-spec.md C5).
// Without JavaScript the CV shows a keyboard hint for printing. With it, the
// hint gives way to the Print button the template rendered hidden, so its
// label comes from strings.json.

const button = document.querySelector('.print-button');
if (button && typeof window.print === 'function') {
  const hint = document.querySelector('.print-hint');
  if (hint) hint.hidden = true;
  button.hidden = false;
  button.addEventListener('click', () => window.print());
}
