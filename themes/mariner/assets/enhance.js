// Progressive enhancement only: swap the print hint for the Print button.
const button = document.querySelector('.print-button');
if (button && typeof window.print === 'function') {
  const hint = document.querySelector('.print-hint');
  if (hint) hint.hidden = true;
  button.hidden = false;
  button.addEventListener('click', () => window.print());
}
