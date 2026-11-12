// enhance.js — progressive enhancement only (cms-spec.md C5). The star is cut
// around whatever the price says, at any length; this only writes a long price
// ("from £1,249 fitted") smaller, so that its star stays the size of the others.
for (const price of document.querySelectorAll('.price')) {
  const length = price.textContent.trim().length;
  if (length > 16) price.dataset.len = 'long';
  else if (length > 8) price.dataset.len = 'mid';
}
