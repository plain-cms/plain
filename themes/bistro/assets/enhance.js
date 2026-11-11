// enhance.js — progressive enhancement only (cms-spec.md C5).
// The site, the menu, and the reserve link are fully usable without this file.
//
// The carte arrives sorted by section name from a to z; theme.css seats the
// sections in service order for the eye with `order`. This moves the dishes
// in the document to match, so keyboard and screen-reader order agree with
// what is seen. Keep COURSES in step with the `order` rules in theme.css:
// a dish with no section, or one outside this list, comes first (order 0).
const COURSES = ['Breakfast', 'Bread', 'Pastries', 'Starters', 'Mains', 'Sides', 'Desserts', 'Hot drinks', 'Drinks', 'Snacks'];
const rank = (dish) => COURSES.indexOf(dish.dataset.course); // -1: before every section

for (const list of document.querySelectorAll('.carte-list')) {
  const dishes = [...list.children];
  const seated = [...dishes].sort((a, b) => rank(a) - rank(b)); // stable: order within a section is kept
  if (seated.some((dish, i) => dish !== dishes[i])) list.append(...seated);
}
