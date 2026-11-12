// enhance.js — progressive enhancement only; every page is complete without it.
//
// The menu arrives sorted by section name from a to z, and theme.css seats the
// keys in service order for the eye with `order`. This moves them in the
// document to match, so keyboard and screen-reader order agree with what is
// seen. Keep SECTIONS in step with the `order` rules in theme.css: a key with
// no section, or one outside this list, comes first (order 0).
const SECTIONS = ['Breakfast', 'Bread', 'Pastries', 'Starters', 'Mains', 'Sides', 'Desserts', 'Hot drinks', 'Drinks', 'Snacks'];
const rank = (key) => SECTIONS.indexOf(key.dataset.section); // -1: before every section

for (const panel of document.querySelectorAll('.keys')) {
  const keys = [...panel.children];
  const seated = [...keys].sort((a, b) => rank(a) - rank(b)); // stable: order inside a section is kept
  if (seated.some((key, i) => key !== keys[i])) panel.append(...seated);
}

// A price such as "£9/£13/£16" has nowhere to break, so on a narrow key it
// would be cut mid-figure. Offer a break after each slash.
for (const price of document.querySelectorAll('.key-price')) {
  const parts = price.textContent.split('/');
  if (parts.length > 1) price.replaceChildren(...parts.flatMap((part, i) => (i ? ['/', document.createElement('wbr'), part] : [part])));
}
