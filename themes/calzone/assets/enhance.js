// enhance.js — progressive enhancement only; every page is complete without it.
//
// The menu arrives sorted by section name from a to z, and theme.css seats the
// sections in service order for the eye with `order`. This moves the lines in
// the document to match, so keyboard and screen-reader order agree with what
// is seen. Keep SECTIONS in step with the `order` rules in theme.css: a line
// with no section, or one outside this list, comes first (order 0).
const SECTIONS = ['Breakfast', 'Bread', 'Pastries', 'Starters', 'Mains', 'Sides', 'Desserts', 'Hot drinks', 'Drinks', 'Snacks'];
const rank = (dish) => SECTIONS.indexOf(dish.dataset.section); // -1: before every section

for (const list of document.querySelectorAll('.order')) {
  const dishes = [...list.children];
  const seated = [...dishes].sort((a, b) => rank(a) - rank(b)); // stable: order inside a section is kept
  if (seated.some((dish, i) => dish !== dishes[i])) list.append(...seated);
}
