// enhance.js — progressive enhancement only; the site is complete without it.
//
// The board arrives sorted by section name from a to z, and theme.css seats
// the sections in service order for the eye with `order`. This moves the rows
// in the document to match, so keyboard and screen-reader order agree with
// what is seen. Keep SECTIONS in step with the `order` rules in theme.css: a
// row with no section, or one outside this list, comes first (order 0).
const SECTIONS = ['Breakfast', 'Bread', 'Pastries', 'Starters', 'Mains', 'Sides', 'Desserts', 'Hot drinks', 'Drinks', 'Snacks'];
const rank = (row) => SECTIONS.indexOf(row.dataset.section); // -1: before every section

for (const board of document.querySelectorAll('.pegs')) {
  const rows = [...board.children];
  const seated = [...rows].sort((a, b) => rank(a) - rank(b)); // stable: order within a section is kept
  if (seated.some((row, i) => row !== rows[i])) board.append(...seated);
}
