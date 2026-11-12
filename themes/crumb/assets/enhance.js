// Progressive enhancement only: the menu reads right without this file.
// The build sorts menu items by section name; theme.css seats the sections in
// service order with `order`. This moves the items in the document to match,
// so keyboard and screen-reader order agree with the eye. Keep the list in
// step with the `order` rules in theme.css.
const ORDER = ['Breakfast', 'Bread', 'Pastries', 'Starters', 'Mains', 'Sides', 'Desserts', 'Hot drinks', 'Drinks', 'Snacks'];
const rank = (li) => ORDER.indexOf(li.dataset.section); // -1: no section, first

for (const list of document.querySelectorAll('.shelves')) {
  const items = [...list.children];
  const seated = [...items].sort((a, b) => rank(a) - rank(b)); // stable
  if (seated.some((li, i) => li !== items[i])) list.append(...seated);
}
