// enhance.js — progressive enhancement only (cms-spec.md C5). theme.css keeps
// a price of about ten characters whole at its own size; this only tunes it:
// a short price ("£8.40") is set larger, a long one ("from £1,249 fitted") smaller.
for (const price of document.querySelectorAll('.price')) {
  const length = price.textContent.trim().length;
  if (length <= 7) price.dataset.len = 'short';
  else if (length > 13) price.dataset.len = 'long';
  else if (length > 10) price.dataset.len = 'mid';
}
