// enhance.js — progressive enhancement only (cms-spec.md C5). theme.css lets a long
// price wrap in its punch; one of more than 14 characters is set a size smaller.
for (const price of document.querySelectorAll('.cut')) {
  if (price.textContent.trim().length > 14) price.dataset.long = '';
}
