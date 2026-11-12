// enhance.js — progressive enhancement only; the site is complete without it.
//
// theme.css seats two things for the eye with `order`; this moves them in the
// document to match, so keyboard and screen-reader order agree with what is seen.
//
// 1. The panel arrives sorted by section name from a to z and is shown in
//    service order. Keep SECTIONS in step with the `order` rules in theme.css:
//    a band with no section, or one outside this list, comes first (order 0).
const SECTIONS = ['Breakfast', 'Bread', 'Pastries', 'Starters', 'Mains', 'Sides', 'Desserts', 'Hot drinks', 'Drinks', 'Snacks'];
const rank = (band) => SECTIONS.indexOf(band.dataset.section); // -1: before every section

for (const panel of document.querySelectorAll('.hatch')) {
  const bands = [...panel.children];
  const seated = [...bands].sort((a, b) => rank(a) - rank(b)); // stable: order within a section is kept
  if (seated.some((band, i) => band !== bands[i])) panel.prepend(...seated);
}

// 2. The home page stands its pitch list between the welcome stripe and the panel.
const card = document.querySelector('.front .prose > .hours-card');
const stripe = card && card.closest('.front').querySelector('.stripe');
if (stripe) stripe.after(card);
