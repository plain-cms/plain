// enhance.js — progressive enhancement only; the site is complete without it.
// The menu arrives sorted by section name from a to z and theme.css seats the
// sections in service order with `order`. This moves the items in the document
// to match, so keyboard and screen-reader order agree with what is seen.
// Keep SECTIONS in step with the `order` rules in theme.css; an item with no
// section, or one outside this list, comes first (order 0).
const SECTIONS = ['Breakfast', 'Bread', 'Pastries', 'Starters', 'Mains', 'Sides', 'Desserts', 'Hot drinks', 'Drinks', 'Snacks'];
const rank = (item) => SECTIONS.indexOf(item.dataset.section);

for (const list of document.querySelectorAll('.drinks')) {
  const items = [...list.children];
  const seated = [...items].sort((a, b) => rank(a) - rank(b)); // stable: order inside a section is kept
  if (seated.some((item, i) => item !== items[i])) list.append(...seated);
}
