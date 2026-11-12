// enhance.js — progressive enhancement only; the site is complete without it.
//
// The menu arrives sorted by section name from a to z, and theme.css seats
// the sections in service order for the eye with `order`. This moves the
// dishes in the document to match, so keyboard and screen-reader order agree
// with what is seen. Keep SECTIONS in step with the `order` rules in
// theme.css: a dish with no section, or one outside this list, comes first.
const SECTIONS = ['Breakfast', 'Bread', 'Pastries', 'Starters', 'Mains', 'Sides', 'Desserts', 'Hot drinks', 'Drinks', 'Snacks'];
const rank = (dish) => SECTIONS.indexOf(dish.dataset.section); // -1: before every section

for (const list of document.querySelectorAll('.dishes')) {
  const dishes = [...list.children];
  const seated = [...dishes].sort((a, b) => rank(a) - rank(b)); // stable: order within a section is kept
  if (seated.some((dish, i) => dish !== dishes[i])) list.append(...seated);
}
