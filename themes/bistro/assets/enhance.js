// enhance.js — progressive enhancement only (cms-spec.md C5).
// The site, the menu, and the reserve link are fully usable without this file.
//
// The carte arrives sorted by course name (Desserts, Drinks, Mains, Starters);
// theme.css seats the courses in service order for the eye with `order`.
// This moves the dishes in the document to match, so keyboard and
// screen-reader order agree with what is seen. Keep COURSES in step with the
// `order` rules in theme.css.
const COURSES = ['Starters', 'Mains', 'Desserts', 'Drinks'];
const rank = (dish) => {
  const i = COURSES.indexOf(dish.dataset.course);
  return i < 0 ? COURSES.length : i;
};

for (const list of document.querySelectorAll('.carte-list')) {
  const dishes = [...list.children];
  const seated = [...dishes].sort((a, b) => rank(a) - rank(b)); // stable: order within a course is kept
  if (seated.some((dish, i) => dish !== dishes[i])) list.append(...seated);
}
